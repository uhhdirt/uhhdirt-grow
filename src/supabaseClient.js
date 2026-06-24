import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const configured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Create defensively — a bad key/url should never crash the whole app.
let _client = null;
if (configured) {
  try {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.error('Supabase init failed, running local:', err);
    _client = null;
  }
}

export const supabase = _client;
// isCloud is true ONLY if the client actually built — keeps the app from
// calling supabase.* when it's null.
export const isCloud = !!_client;

export const GROW_ID = 'pomelo-punch-v1';
