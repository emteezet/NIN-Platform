"use server";

import { adminService } from "../services/AdminService";

/**
 * Server Action: Fetches platform-wide stats for the admin dashboard
 * @param {string} userEmail The email of the user requesting stats
 * @returns {Promise<object>}
 */
export async function getPlatformStatsAction(userEmail) {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || "emteezetdesigns@gmail.com").toLowerCase().trim();
        const requestingEmail = userEmail ? userEmail.toLowerCase().trim() : "";

        console.log(`[Admin Auth] Requesting: "${requestingEmail}", Allowed: "${adminEmail}"`);

        if (requestingEmail !== adminEmail) {
            console.warn(`[Admin Auth] Access Denied for ${requestingEmail}`);
            throw new Error("Unauthorized access to admin dashboard.");
        }

        const stats = await adminService.getPlatformStats();
        return { success: true, stats };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            code: error.code || 'AUTH_ERROR'
        };
    }
}
