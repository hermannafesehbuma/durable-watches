import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

// Client-side Supabase client (cookie-based for SSR/middleware compatibility)
export const supabase = createSupabaseBrowserClient();

export default supabase;
