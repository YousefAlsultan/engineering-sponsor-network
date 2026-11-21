// Server-only Supabase Edge Function: mirrors limited student account metadata to Notion.
// Requires NOTION_INTEGRATION_TOKEN and built-in Supabase server credentials.
// Cron sends a private Vault secret; only its SHA-256 digest is present here.
import { createClient } from 'npm:@supabase/supabase-js@2.119.2';

const NOTION_VERSION = '2025-09-03';
const notionBase = 'https://api.notion.com/v1';

const noteText = (text: string) => ({ rich_text: [{ text: { content: text.slice(0, 1900) } }] });

async function notion(path: string, token: string, options?: { method?: string; body?: unknown }) {
  const result = await fetch(`${notionBase}${path}`, {
    method: options?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await result.json();
  if (!result.ok) throw new Error(`Notion returned HTTP ${result.status}: ${String(payload.message ?? '').slice(0, 200)}`);
  return payload;
}

Deno.serve(async request => {
  const expectedDigest = "a98a614b9e1df89952d51bc59de0195489fa98bbeded4dbf2acccebcee9fddcc";
  const url = Deno.env.get('SUPABASE_URL');
  const adminKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const notionToken = Deno.env.get('NOTION_INTEGRATION_TOKEN');
  const sourceId = '41d60d63-f628-81c6-a4f2-000b5315c8f8';
  if (!url || !adminKey || !notionToken || !sourceId) {
    return Response.json({error:'Server integration not configured',missing:[!url?'SUPABASE_URL':null,!adminKey?'SUPABASE_SERVICE_ROLE_KEY':null,!notionToken?'NOTION_INTEGRATION_TOKEN':null,!sourceId?'NOTION_STUDENT_DATA_SOURCE_ID':null].filter(Boolean)},{status:503});
  }
  const suppliedSecret=request.headers.get('x-cron-secret') || '';
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(suppliedSecret)))).map(byte=>byte.toString(16).padStart(2,'0')).join('');
  if (request.method !== 'POST' || digest !== expectedDigest) {
    return Response.json({error:'Unauthorized'},{status:401});
  }
  const admin = createClient(url,adminKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:jobs,error:queueError} = await admin.from('notion_account_sync_queue')
    .select('id,user_id').is('processed_at',null).order('queued_at',{ascending:true}).limit(30);
  if (queueError) return Response.json({error:'Queue unavailable'},{status:500});
  const accountIds = [...new Set((jobs ?? []).map(job=>job.user_id as string))].slice(0,8);
  let synced=0;
  const errors:string[]=[];
  for (const id of accountIds) {
    try {
      const [profileResult,membershipResult,activityResult,postResult,userResult] = await Promise.all([
        admin.from('student_profiles').select('*').eq('user_id',id).maybeSingle(),
        admin.from('student_memberships').select('tier,billing_status,paid_until').eq('user_id',id).maybeSingle(),
        admin.from('student_activity').select('event_type,occurred_at').eq('user_id',id).order('occurred_at',{ascending:false}).limit(1).maybeSingle(),
        admin.from('student_posts').select('id',{count:'exact',head:true}).eq('user_id',id),
        admin.auth.admin.getUserById(id),
      ]);
      if (profileResult.error || membershipResult.error || activityResult.error || postResult.error || userResult.error || !userResult.data.user) throw new Error('Account data unavailable');
      const profile=profileResult.data;
      const user=userResult.data.user;
      const membership=membershipResult.data;
      const recent=activityResult.data;
      const access=membership?.billing_status==='past_due'?'Past due':membership?.billing_status==='canceled'?'Canceled':membership?.tier==='student_plus' && membership.billing_status==='active' && new Date(membership.paid_until).getTime()>Date.now()?'Paid':'Free';
      const properties:Record<string,unknown> = {
        'Name': {title:[{text:{content:(profile?.display_name || 'New student').slice(0,180)}}]},
        'Account ID': noteText(id),
        'Email': {email:user.email ?? null},
        'Email verified': {checkbox:Boolean(user.email_confirmed_at)},
        'Joined': {date:{start:user.created_at}},
        'Access': {select:{name:access}},
        'Organization': noteText(profile?.organization || ''),
        'Posts': {number:postResult.count ?? 0},
        'Recent activity': noteText(recent?.event_type || 'account_created'),
      };
      if (recent?.occurred_at) properties['Last active']={date:{start:recent.occurred_at}};
      // The Notion tracker currently has a single option: Ohio State University.
      if (profile?.university?.toLowerCase().includes('ohio state')) properties['University']={select:{name:'Ohio State University'}};
      else properties['University']={select:null};
      const existing=await notion(`/data_sources/${sourceId}/query`,notionToken,{
        method:'POST',body:{page_size:1,filter:{property:'Account ID',rich_text:{equals:id}}},
      });
      if (existing.results?.length) {
        await notion(`/pages/${existing.results[0].id}`,notionToken,{method:'PATCH',body:{properties}});
      } else {
        await notion('/pages',notionToken,{method:'POST',body:{parent:{type:'data_source_id',data_source_id:sourceId},properties}});
      }
      const pending=(jobs??[]).filter(job=>job.user_id===id).map(job=>job.id);
      const {error:markError}=await admin.from('notion_account_sync_queue').update({processed_at:new Date().toISOString()}).in('id',pending);
      if (markError) throw new Error('Notion updated, queue acknowledgement failed');
      synced++;
    } catch (error) {
      errors.push(`Account ${id.slice(0,8)}: ${error instanceof Error?error.message:'unknown error'}`);
      const pending=(jobs??[]).filter(job=>job.user_id===id).map(job=>job.id);
      await admin.from('notion_account_sync_queue').update({attempts:1}).in('id',pending);
    }
  }
  return Response.json({synced,pending_accounts:accountIds.length-synced,errors},{status:errors.length?207:200});
});

