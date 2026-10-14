export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * The whole app is written against Supabase. Until the project credentials are
 * added to `.env.local`, the data layer falls back to a realistic demo dataset
 * and auth falls back to a cookie-based role preview, so the product can be
 * reviewed end-to-end without a backend. Nothing else in the code changes.
 */
export const isSupabaseConfigured =
  SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 20;
