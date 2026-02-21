import PDFDocument from 'pdfkit';
import { generateQRBuffer } from './generateQR.js';
import { generateSerial } from './serial.js';
import path from 'path';
import fs from 'fs';

/**
 * Generate a professional NIN Slip PDF
 * Returns { buffer, serialNumber }
 */
export async function generatePDF(user) {
    return new Promise(async (resolve, reject) => {
        try {
            const serialNumber = generateSerial();
            const qrBuffer = await generateQRBuffer(user.nin);
            const issueDate = new Date().toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            const doc = new PDFDocument({
                size: 'A4',
                margin: 40,
                info: {
                    Title: `NIN Slip - ${user.firstName} ${user.lastName}`,
                    Author: 'NIN Platform (School Project)',
                },
            });

            const buffers = [];
            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve({ buffer: pdfBuffer, serialNumber });
            });
            doc.on('error', reject);

            const pageWidth = doc.page.width;
            const contentWidth = pageWidth - 80;

            // ── Green Header Bar ──
            doc.rect(0, 0, pageWidth, 100).fill('#0d6b0d');

            // ── Coat of Arms text (styled)
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .fillColor('#ffffff')
                .text('FEDERAL REPUBLIC OF NIGERIA', 0, 20, { align: 'center' });

            doc.fontSize(11)
                .font('Helvetica')
                .fillColor('#d5ecd5')
                .text('NATIONAL IDENTIFICATION NUMBER', 0, 45, { align: 'center' });

            doc.fontSize(9)
                .fillColor('#a8d9a8')
                .text('National Identity Management Commission', 0, 65, { align: 'center' });

            // ── Decorative line under header ──
            doc.rect(0, 100, pageWidth, 4).fill('#1a8c1a');

            // ── Body Section ──
            const bodyTop = 130;

            // Photo area
            const photoPath = user.photo && user.photo !== '/uploads/default-avatar.png'
                ? path.join(process.cwd(), 'public', user.photo)
                : null;

            const photoX = 40;
            const photoY = bodyTop;
            const photoSize = 110;

            // Photo border
            doc.rect(photoX - 2, photoY - 2, photoSize + 4, photoSize + 4)
                .lineWidth(2)
                .strokeColor('#0d6b0d')
                .stroke();

            if (photoPath && fs.existsSync(photoPath)) {
                doc.image(photoPath, photoX, photoY, { width: photoSize, height: photoSize });
            } else {
                // Placeholder
                doc.rect(photoX, photoY, photoSize, photoSize).fill('#e8e8e8');
                doc.fontSize(9)
                    .fillColor('#999999')
                    .text('PHOTO', photoX + 30, photoY + 45);
            }

            // ── Personal Details ──
            const detailsX = 170;
            let detailsY = bodyTop;

            const fullName = [user.firstName, user.middleName, user.lastName]
                .filter(Boolean)
                .join(' ')
                .toUpperCase();

            // Name
            doc.fontSize(9)
                .font('Helvetica')
                .fillColor('#666666')
                .text('Full Name', detailsX, detailsY);
            detailsY += 14;
            doc.fontSize(14)
                .font('Helvetica-Bold')
                .fillColor('#111111')
                .text(fullName, detailsX, detailsY);
            detailsY += 28;

            // NIN
            doc.fontSize(9)
                .font('Helvetica')
                .fillColor('#666666')
                .text('National Identification Number (NIN)', detailsX, detailsY);
            detailsY += 14;
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .fillColor('#0d6b0d')
                .text(user.nin, detailsX, detailsY);
            detailsY += 30;

            // Two-column details
            const col1X = detailsX;
            const col2X = detailsX + 170;
            let rowY = detailsY;

            const dobFormatted = new Date(user.dob).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            // Row 1
            _drawField(doc, 'Date of Birth', dobFormatted, col1X, rowY);
            _drawField(doc, 'Gender', user.gender, col2X, rowY);
            rowY += 40;

            // Row 2
            _drawField(doc, 'State of Origin', user.state, col1X, rowY);
            _drawField(doc, 'Local Govt. Area', user.lga, col2X, rowY);
            rowY += 40;

            // Row 3
            _drawField(doc, 'Issue Date', issueDate, col1X, rowY);
            _drawField(doc, 'Slip Serial No.', serialNumber, col2X, rowY);
            rowY += 50;

            // ── Separator ──
            doc.moveTo(40, rowY)
                .lineTo(pageWidth - 40, rowY)
                .lineWidth(1)
                .strokeColor('#e0e0e0')
                .stroke();
            rowY += 20;

            // ── QR Code Section ──
            doc.image(qrBuffer, pageWidth - 190, rowY, { width: 130, height: 130 });

            doc.fontSize(9)
                .font('Helvetica')
                .fillColor('#666666')
                .text('Scan QR code to verify this slip', pageWidth - 195, rowY + 135, {
                    width: 140,
                    align: 'center',
                });

            // Verification text next to QR
            doc.fontSize(10)
                .font('Helvetica-Bold')
                .fillColor('#333333')
                .text('VERIFICATION', 40, rowY);
            doc.fontSize(9)
                .font('Helvetica')
                .fillColor('#666666')
                .text(
                    'This slip can be verified by scanning the QR code ' +
                    'or visiting the verification URL below.',
                    40,
                    rowY + 18,
                    { width: 300 }
                );

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            doc.fontSize(8)
                .fillColor('#0d6b0d')
                .text(`${baseUrl}/verify/${user.nin}`, 40, rowY + 50, { width: 300 });

            // ── Footer ──
            const footerY = doc.page.height - 80;

            doc.rect(0, footerY, pageWidth, 80).fill('#f8f8f8');

            doc.rect(0, footerY, pageWidth, 1).fill('#e0e0e0');

            doc.fontSize(7)
                .font('Helvetica')
                .fillColor('#999999')
                .text(
                    'DISCLAIMER: This platform is a school project simulation and is not affiliated with ' +
                    'NIMC or any government agency. This document has no legal validity.',
                    40,
                    footerY + 15,
                    { width: contentWidth, align: 'center' }
                );

            doc.fontSize(7)
                .fillColor('#bbbbbb')
                .text(
                    `Generated on ${issueDate} | Serial: ${serialNumber} | ${baseUrl}`,
                    40,
                    footerY + 40,
                    { width: contentWidth, align: 'center' }
                );

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Helper: draw a label + value field
 */
function _drawField(doc, label, value, x, y) {
    doc.fontSize(8)
        .font('Helvetica')
        .fillColor('#999999')
        .text(label, x, y);
    doc.fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#222222')
        .text(value || '—', x, y + 13);
}
