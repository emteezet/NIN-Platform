
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connectivity...');
console.log('URL:', supabaseUrl);
console.log('Anon Key length:', supabaseAnonKey?.length);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Attempting to fetch session (should fail but verify connectivity)...');
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.log('Auth Error (Expected if no session):', error.message);
        } else {
            console.log('Auth Success:', data);
        }
        
        console.log('Testing fetch to base URL...');
        const res = await fetch(supabaseUrl);
        console.log('Fetch Status:', res.status);
    } catch (err) {
        console.error('CRITICAL FETCH ERROR:', err);
    }
}

test();
