import { createClient } from '@supabase/supabase-js';

// These two values come from your Supabase project (Settings → API).
// They are SAFE to expose publicly — the anon key only allows what your
// Row Level Security policies permit (public read, your-login-only write).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the keys aren't configured yet, run in LOCAL mode (no crash).
// Set up Supabase later and the app upgrades to cloud-save automatically.
export const isCloud = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isCloud
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// The single row that holds this grow's whole state.
export const GROW_ID = 'pomelo-punch-v1';
