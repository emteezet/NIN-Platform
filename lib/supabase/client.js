import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (typeof window === 'undefined') {
    console.log(`[Supabase Client] Initializing on server with URL: ${supabaseUrl}`);
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
        global: {
            fetch: (...args) => {
                if (typeof window === 'undefined') {
                    // console.log(`[Supabase Fetch] Calling: ${args[0]}`);
                }
                return fetch(...args);
            }
        }
    }
);
