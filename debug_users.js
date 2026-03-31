
import { adminService } from "./services/AdminService.js";

async function debug() {
    try {
        const users = await adminService.getAllUsers();
        console.log("DEBUG: Sample User Data:", JSON.stringify(users[0], null, 2));
    } catch (e) {
        console.error("DEBUG: Error:", e);
    }
}

debug();
