import { createClient } from "../supabase/server";

/**
 * Retrieves the currently authenticated user from the Supabase session.
 * This should only be used in Server Actions or Server Components.
 * @returns {Promise<object|null>}
 */
export async function getServerUser() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
            if (error) console.warn("[Session] Auth error:", error.message);
            return null;
        }
        
        return {
            id: user.id,
            email: user.email,
            firstName: user.user_metadata?.first_name,
            lastName: user.user_metadata?.last_name
        };
    } catch (err) {
        console.error("[Session] Error fetching server user:", err.message);
        return null;
    }
}

/**
 * Middleware-like helper for Server Actions to enforce authentication.
 * Throws an error if the user is not authenticated.
 * @returns {Promise<object>} The authenticated user
 */
export async function requireAuth() {
    const user = await getServerUser();
    if (!user) {
        const authError = new Error("Authentication required. Please log in.");
        authError.code = "UNAUTHORIZED";
        throw authError;
    }
    return user;
}

/**
 * Enhanced auth helper that also checks if the user is not suspended.
 * @returns {Promise<object>} The authenticated and active user
 */
export async function requireActiveUser() {
    const user = await requireAuth();
    
    const supabase = await createClient();
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('status, suspension_reason')
        .eq('id', user.id)
        .single();
    
    if (error) {
        console.error("[Session] Error fetching profile for status check:", error.message);
        return user; // Fallback to basic auth if profile check fails (optional)
    }

    if (profile?.status && profile.status !== 'ACTIVE') {
        const statusError = new Error(profile.suspension_reason || `Your account is ${profile.status.toLowerCase()}. Please contact support.`);
        statusError.code = "ACCOUNT_SUSPENDED";
        throw statusError;
    }

    return { ...user, status: profile.status };
}
