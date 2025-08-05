import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shengcgeqmfafnzdsvem.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseKey) {
  throw new Error(
    'Supabase key is required. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_KEY in your environment variables.'
  );
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
