import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Publishable key only. RLS, not key secrecy, protects each student's data.
// Never initialize an admin/service-role Supabase client in browser code.
// Both fallback values are public browser configuration, never admin credentials.
// They keep static exports functional even when the hosting environment is runtime-only.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vyqrnxmidsrlwvmvzrbo.supabase.co';
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_F_n53iNKZcgzkjLJqs62OQ_w4d6Nps0';
let browserClient: SupabaseClient | null = null;

export const isSupabaseConfigured = Boolean(supabaseUrl && publishableKey);

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  browserClient ??= createClient(supabaseUrl!, publishableKey!, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
  });
  return browserClient;
}
