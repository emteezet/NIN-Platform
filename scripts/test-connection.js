const { supabaseAdmin } = require('./lib/supabase/admin');
// We need to use require here if we are running with node in a non-esm way, 
// but the project is ESM. I'll use a dynamic import.

(async () => {
    try {
        console.log("Testing Supabase connection with httpsFetch...");
        const { supabaseAdmin } = await import('./lib/supabase/admin.js');
        
        const { data, error } = await supabaseAdmin
            .from('wallets')
            .select('count')
            .limit(1);
            
        if (error) {
            console.error("Supabase connection test failed:", error.message);
        } else {
            console.log("Supabase connection test successful!");
            console.log("Data:", data);
        }
    } catch (err) {
        console.error("Test execution error:", err);
    }
})();
