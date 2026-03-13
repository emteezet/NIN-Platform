/**
 * @interface IKycProvider
 * @description Universal interface for Identity Providers (Strategy Pattern)
 */
export class IKycProvider {
    /**
     * Fetch Identity data by NIN
     * @param {string} nin 
     */
    async fetchByNin(nin) {
        throw new Error("Method 'fetchByNin()' must be implemented.");
    }

    /**
     * Search NIN by phone number
     * @param {string} phone 
     */
    async fetchByNinPhone(phone) {
        throw new Error("Method 'fetchByNinPhone()' must be implemented.");
    }

    /**
     * Search NIN by tracking ID
     * @param {string} tracking_id 
     */
    async fetchByNinTracking(tracking_id) {
        throw new Error("Method 'fetchByNinTracking()' must be implemented.");
    }

    /**
     * Search NIN by demography
     */
    async fetchByNinDemography(firstname, lastname, gender, dob) {
        throw new Error("Method 'fetchByNinDemography()' must be implemented.");
    }

    /**
     * Fetch Identity data by BVN
     * @param {string} bvn 
     */
    async fetchByBvn(bvn) {
        throw new Error("Method 'fetchByBvn()' must be implemented.");
    }

    /**
     * Search BVN by phone number
     * @param {string} phone 
     */
    async fetchByBvnPhone(phone) {
        throw new Error("Method 'fetchByBvnPhone()' must be implemented.");
    }
}
