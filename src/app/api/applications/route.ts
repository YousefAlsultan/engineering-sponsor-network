import { randomUUID } from 'node:crypto';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { validateApplication } from '@/lib/application-model';

export const runtime = 'nodejs';

const NOTION_VERSION = '2026-03-11';
const SPONSOR_DATA_SOURCE_ID = 'bc71eb9f-b048-40b8-bbc2-2e0d645a1928';
const richText = (value: unknown) => ({rich_text: [{text: {content: String(value || '').slice(0, 2000)}}]});

async function resolveSponsorPage(token: string, company: unknown) {
  const response = await fetch(`https://api.notion.com/v1/data_sources/${SPONSOR_DATA_SOURCE_ID}/query`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Notion-Version': NOTION_VERSION},
    body: JSON.stringify({filter: {property: 'Company Name', title: {equals: String(company || '')}}, page_size: 1}),
  });
  if (!response.ok) return null;
  const data = await response.json() as {results?: Array<{id: string}>};
  return data.results?.[0]?.id || null;
}

async function saveToNotion(record: Record<string, unknown>) {
  const token = process.env.NOTION_API_KEY;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
  if (!token || !dataSourceId) return null;

  const sponsorshipTypes = Array.isArray(record.sponsorshipTypes) ? record.sponsorshipTypes : [record.sponsorshipTypes];
  const sponsorPageId = await resolveSponsorPage(token, record.sponsorCompany);
  const properties: Record<string, unknown> = {
    Application: {title: [{text: {content: String(record.application).slice(0, 2000)}}]},
    'Application Status': {select: {name: 'Submitted'}},
    'Email Delivery Status': {select: {name: 'Not Sent'}},
    'Sponsorship Program': richText(record.sponsorshipProgram),
    University: richText(record.university),
    'Engineering Team Name': richText(record.teamName),
    'Engineering Team Type': {multi_select: [String(record.teamType)].filter(Boolean).map(name => ({name}))},
    'Applicant Name': richText(record.applicantName),
    'Applicant Role': richText(record.applicantRole),
    'Applicant Email': {email: String(record.applicantEmail)},
    'Competition / Project': richText(record.competition),
    'Sponsorship Type Requested': {multi_select: sponsorshipTypes.filter(Boolean).map(name => ({name: String(name)}))},
    'Amount / Value Requested': richText(record.requestedValue),
    'Requested Support': richText(record.requestedSupport),
    'Why This Sponsor Is a Good Fit': richText(record.whyFit),
    'Team / Project Description': richText(record.projectDescription),
    'What the Team Can Offer Sponsor': richText(record.sponsorOffer),
    'Additional Notes': richText(record.notes),
    'Submitted Date': {date: {start: String(record.submittedDate)}},
  };
  if (record.teamSize) properties['Number of Team Members'] = {number: Number(record.teamSize)};
  if (record.teamWebsite) properties['Team Website'] = {url: String(record.teamWebsite)};
  if (record.teamSocial) properties['Team Social / Project URL'] = {url: String(record.teamSocial)};
  if (record.deckUrl) properties['Sponsorship Deck URL'] = {url: String(record.deckUrl)};
  if (record.needBy) properties['Need-By Date'] = {date: {start: String(record.needBy)}};
  if (sponsorPageId) properties['Sponsor Company'] = {relation: [{id: sponsorPageId}]};

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Notion-Version': NOTION_VERSION},
    body: JSON.stringify({parent: {type: 'data_source_id', data_source_id: dataSourceId}, properties}),
  });
  if (!response.ok) throw new Error(`Notion could not save this application (${response.status}).`);
  return await response.json() as {id: string; url?: string};
}

export async function POST(request: Request) {
  const notionConfigured = Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATA_SOURCE_ID);
  if (process.env.NODE_ENV === 'production' && !notionConfigured && process.env.APPLICATION_STORAGE_ENABLED !== 'true') {
    return NextResponse.json({error: 'Application storage is not configured for this deployment.'}, {status: 503});
  }
  try {
    if (Number(request.headers.get('content-length') || 0) > 100_000) {
      return NextResponse.json({error: 'Application payload is too large.'}, {status: 413});
    }
    const application = validateApplication(await request.json());
    const record = {id: `application-${randomUUID()}`, ...application};
    const notionPage = await saveToNotion(record);
    if (notionPage) {
      return NextResponse.json({id: record.id, status: 'saved', destination: 'Notion', notionPageId: notionPage.id, notionUrl: notionPage.url, deliveryStatus: 'Not Sent'}, {status: 201});
    }
    const storageDirectory = path.join(process.cwd(), '.local');
    await mkdir(storageDirectory, {recursive: true});
    await appendFile(path.join(storageDirectory, 'applications.jsonl'), `${JSON.stringify(record)}\n`, {encoding: 'utf8', mode: 0o600});
    return NextResponse.json({id: record.id, status: 'saved', deliveryStatus: 'Not Sent'}, {status: 201});
  } catch (error) {
    return NextResponse.json({error: error instanceof Error ? error.message : 'Invalid application.'}, {status: 400});
  }
}
