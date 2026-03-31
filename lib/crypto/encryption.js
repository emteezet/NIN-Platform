import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Only warn at top-level during build or dev. 
// Runtime enforcement is handled inside the functions below.
if (!ENCRYPTION_KEY && process.env.NODE_ENV === 'development') {
    console.warn('[Encryption] Warning: ENCRYPTION_KEY is missing. Identity encryption will fail.');
}

/**
 * Encrypts sensitive data (NIN/BVN) for temporary storage
 * @param {string} data 
 * @returns {string}
 */
export const encryptIdentity = (data) => {
    if (!data) return null;
    if (!ENCRYPTION_KEY) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('CRITICAL: ENCRYPTION_KEY is missing. Data cannot be encrypted.');
        }
        return `[UNENCRYPTED_DEV_MODE]:${data}`;
    }
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

/**
 * Decrypts sensitive data for PDF generation
 * @param {string} ciphertext 
 * @returns {string}
 */
export const decryptIdentity = (ciphertext) => {
    if (!ciphertext) return null;

    // Handle legacy unencrypted dev mode data
    if (ciphertext.startsWith('[UNENCRYPTED_DEV_MODE]:')) {
        return ciphertext.replace('[UNENCRYPTED_DEV_MODE]:', '');
    }

    if (!ENCRYPTION_KEY) {
        return ciphertext;
    }

    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        
        // If decryption succeeds and yields a non-empty string, return it
        if (decrypted) return decrypted;

        // If decryption fails or yields empty string, it might already be plain text
        // (e.g. if it was stored before encryption was enabled, but without the dev prefix)
        return ciphertext;
    } catch (e) {
        console.warn('[Encryption] Decryption failed, returning raw ciphertext:', e.message);
        return ciphertext;
    }
};

/**
 * Masks sensitive information for logging
 * @param {string} data 
 * @returns {string}
 */
export const maskData = (data, visibleCount = 4) => {
    if (!data) return '';
    const maskedLength = data.length - visibleCount;
    if (maskedLength <= 0) return data;
    return '*'.repeat(maskedLength) + data.slice(-visibleCount);
};
