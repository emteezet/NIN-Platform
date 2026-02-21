import crypto from 'crypto';

/**
 * Generate a unique slip serial number using crypto
 * Format: SLIP-YYYY-XXXXXX
 * Where YYYY is the current year and XXXXXX is a random hex string
 */
export function generateSerial() {
    const year = new Date().getFullYear();
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `SLIP-${year}-${randomPart}`;
}
