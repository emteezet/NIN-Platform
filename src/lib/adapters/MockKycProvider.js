import { IKycProvider } from "./IKycProvider";

/**
 * @class MockKycProvider
 * @implements {IKycProvider}
 * @description Mock implementation for local development and testing
 */
export class MockKycProvider extends IKycProvider {
    /**
     * @param {string} nin 
     */
    async fetchByNin(nin) {
        console.log(`[MockKycProvider] Fetching NIN: ${nin}`);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (nin === "00000000000") {
            throw new Error("NIN not found in mock database.");
        }

        return {
            success: true,
            data: {
                firstName: "JOHN",
                lastName: "DOE",
                middleName: "MOCK",
                gender: "Male",
                dob: "1990-01-01",
                nin: nin,
                photo: "/uploads/default-avatar.png",
                phone: "08012345678",
                state: "Lagos",
                lga: "Ikeja"
            }
        };
    }

    /**
     * @param {string} bvn 
     */
    async fetchByBvn(bvn) {
        console.log(`[MockKycProvider] Fetching BVN: ${bvn}`);

        await new Promise(resolve => setTimeout(resolve, 800));

        return {
            success: true,
            data: {
                firstName: "JANE",
                lastName: "DOE",
                bvn: bvn,
                gender: "Female",
                dob: "1992-05-15"
            }
        };
    }
}
