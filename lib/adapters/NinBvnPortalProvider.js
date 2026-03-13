import { IKycProvider } from "./IKycProvider";
import { Logger } from "../utils/logger";

/**
 * @class NinBvnPortalProvider
 * @implements {IKycProvider}
 * @description Implementation for NinBvnPortal.com.ng API
 */
export class NinBvnPortalProvider extends IKycProvider {
    constructor() {
        super();
        this.apiKey = process.env.NIN_BVN_PORTAL_API_KEY;
        this.baseUrl = process.env.NIN_BVN_PORTAL_BASE_URL || "https://ninbvnportal.com.ng/api";

        if (!this.apiKey) {
            Logger.error("NinBvnPortalProvider: API Key is missing in environment variables.");
        }
    }

    /**
     * Generic request handler using curl as a transport fallback
     * @private
     */
    async _request(endpoint, method = "POST", body = null) {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execPromise = promisify(exec);

        const url = `${this.baseUrl}${endpoint}`;
        
        // Build curl command
        let command = `curl -s -X ${method} -H "Content-Type: application/json" -H "x-api-key: ${this.apiKey}"`;
        
        if (body) {
            const jsonBody = JSON.stringify({ ...body, consent: true });
            // Use a temporary file or properly escape the JSON for shell
            // For simplicity and safety with characters, we'll use a single-quote escape strategy
            const escapedBody = jsonBody.replace(/'/g, "'\\''");
            command += ` -d '${escapedBody}'`;
        }
        
        command += ` "${url}"`;

        try {
            console.log(`[NinBvnPortal] Executing curl request to: ${endpoint}`);
            const { stdout, stderr } = await execPromise(command);
            
            if (stderr) {
                console.warn(`[NinBvnPortal] Curl stderr for ${endpoint}:`, stderr);
            }

            try {
                const result = JSON.parse(stdout || '{}');
                if (result.status === "success") {
                    return {
                        success: true,
                        data: result.data,
                        reportId: result.reportID,
                        message: result.message
                    };
                } else {
                    console.warn(`[NinBvnPortal] API returned error for ${endpoint}:`, result.message);
                    return {
                        success: false,
                        error: result.message || "Unknown error from NinBvnPortal",
                        code: result.code || 400
                    };
                }
            } catch (e) {
                console.error(`[NinBvnPortal] JSON Parse Error for ${endpoint}. Raw:`, stdout.substring(0, 100));
                return {
                    success: false,
                    error: "Failed to parse API response",
                    code: 500
                };
            }
        } catch (error) {
            console.error(`[NinBvnPortal] Curl Execution Error [${endpoint}]:`, error.message);
            return {
                success: false,
                error: `Service connectivity error: ${error.message}`
            };
        }
    }

    /**
     * @param {string} nin 
     */
    async fetchByNin(nin) {
        const result = await this._request("/nin-verification", "POST", { nin });
        if (result.success) {
            return {
                ...result,
                data: this._mapNinData(result.data)
            };
        }
        return result;
    }

    /**
     * @param {string} bvn 
     */
    async fetchByBvn(bvn) {
        const result = await this._request("/bvn-verification", "POST", { bvn });
        if (result.success) {
            return {
                ...result,
                data: this._mapBvnData(result.data)
            };
        }
        return result;
    }

    /**
     * Search NIN by phone number
     * @param {string} phone 
     */
    async fetchByNinPhone(phone) {
        const result = await this._request("/nin-phone", "POST", { phone });
        if (result.success) {
            return {
                ...result,
                data: this._mapNinData(result.data)
            };
        }
        return result;
    }

    /**
     * Get account balance
     */
    async getBalance() {
        return await this._request("/balance", "GET");
    }

    /**
     * Search NIN by tracking ID
     * @param {string} tracking_id 
     */
    async fetchByNinTracking(tracking_id) {
        const result = await this._request("/nin-tracking", "POST", { tracking_id });
        if (result.success) {
            return {
                ...result,
                data: this._mapNinData(result.data)
            };
        }
        return result;
    }

    /**
     * Search NIN by demography
     * @param {string} firstname 
     * @param {string} lastname 
     * @param {string} gender 'male' or 'female'
     * @param {string} dob 'YYYY-MM-DD'
     */
    async fetchByNinDemography(firstname, lastname, gender, dob) {
        const result = await this._request("/nin-demography", "POST", { firstname, lastname, gender, dob });
        if (result.success) {
            return {
                ...result,
                data: this._mapNinData(result.data)
            };
        }
        return result;
    }

    /**
     * Search BVN by phone number
     * @param {string} phone 
     */
    async fetchByBvnPhone(phone) {
        const result = await this._request("/bvn-phone", "POST", { phone });
        if (result.success) {
            return {
                ...result,
                data: this._mapBvnData(result.data)
            };
        }
        return result;
    }

    /**
     * Maps API NIN response to internal format
     * @private
     */
    _mapNinData(data) {
        if (!data) return null;
        return {
            firstName: data.firstname,
            lastName: data.surname,
            middleName: data.middlename,
            gender: data.gender,
            dob: data.birthdate,
            nin: data.nin,
            photo: data.photo,
            phone: data.telephoneno,
            address: data.residence_address,
            state: data.residence_state,
            lga: data.residence_lga,
            town: data.residence_town,
            birthCountry: data.birthcountry,
            birthState: data.birthstate,
            birthLga: data.birthlga
        };
    }

    /**
     * Maps API BVN response to internal format
     * @private
     */
    _mapBvnData(data) {
        if (!data) return null;
        return {
            firstName: data.firstname,
            lastName: data.lastname || data.surname,
            middleName: data.middlename,
            gender: data.gender,
            dob: data.dob,
            bvn: data.bvn,
            photo: data.photo,
            phone: data.phone || data.telephoneno,
            email: data.email,
            nationality: data.nationality,
            stateOfOrigin: data.state_of_origin,
            stateOfResidence: data.state_of_residence
        };
    }
}
