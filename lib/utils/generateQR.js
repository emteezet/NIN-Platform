import QRCode from 'qrcode';

/**
 * Generate a QR code as a data URL (base64 PNG)
 * The QR encodes a verification URL for the given NIN
 */
export async function generateQR(nin) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify/${nin}`;

    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 150,
        margin: 1,
        color: {
            dark: '#000000',
            light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
    });

    return qrDataUrl;
}

/**
 * Generate QR code as a Buffer (for PDF embedding)
 */
export async function generateQRBuffer(nin) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify/${nin}`;

    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
        width: 150,
        margin: 1,
        color: {
            dark: '#000000',
            light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
    });

    return qrBuffer;
}
