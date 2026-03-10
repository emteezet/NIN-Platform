import PDFDocument from 'pdfkit';
import { generateQRBuffer } from './generateQR.js';
import { generateSerial } from './serial.js';
import path from 'path';
import fs from 'fs';

/**
 * Generate a Premium NIN Slip PDF (A4 Portrait Stacked)
 * Returns { buffer, serialNumber }
 */
export async function generatePremiumPDF(user) {
    return new Promise(async (resolve, reject) => {
        try {
            const serialNumber = generateSerial();
            const qrBuffer = await generateQRBuffer(user.nin);

            const dobFormatted = new Date(user.dob).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).toUpperCase();

            const issueDate = new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).toUpperCase();

            // Create Portrait A4 Document
            const doc = new PDFDocument({
                size: 'A4',
                margin: 0,
                info: {
                    Title: `Premium NIN Slip - ${user.firstName} ${user.lastName}`,
                    Author: 'NIN Platform',
                },
            });

            const buffers = [];
            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => {
                resolve({ buffer: Buffer.concat(buffers), serialNumber });
            });
            doc.on('error', reject);

            // Standard CR80 ID Card dimensions
            const cardWidth = 243;
            const cardHeight = 153;

            // Center horizontally
            const startX = (doc.page.width - cardWidth) / 2;

            const topCardY = 100;
            const bottomCardY = topCardY + cardHeight + 40;

            // ==========================================
            // FRONT CARD LAYOUT
            // ==========================================

            // FIX: PDFKit crashes on SVGs. We only check for PNG/JPG formats now.
            const frontBgPng = path.join(process.cwd(), 'public', 'premium-front.png');
            const frontBgJpg = path.join(process.cwd(), 'public', 'premium-front.jpg');

            if (fs.existsSync(frontBgPng)) {
                doc.image(frontBgPng, startX, topCardY, { width: cardWidth, height: cardHeight });
            } else if (fs.existsSync(frontBgJpg)) {
                doc.image(frontBgJpg, startX, topCardY, { width: cardWidth, height: cardHeight });
            } else {
                // Fallback: White background with green border and header
                doc.rect(startX, topCardY, cardWidth, cardHeight).fill('#ffffff').stroke('#0d6b0d').stroke();
                doc.rect(startX, topCardY, cardWidth, 20).fill('#e0f0e0');
                doc.fontSize(6).font('Helvetica-Bold').fillColor('#0d6b0d')
                    .text('FEDERAL REPUBLIC OF NIGERIA - DIGITAL NIN SLIP', startX + 5, topCardY + 6, { align: 'center', width: cardWidth - 10 });
            }

            // --- Front Card Data ---
            const detailsStartX = startX + 75;
            let y = topCardY + 30;
            const fullName = [user.firstName, user.middleName].filter(Boolean).join(' ').toUpperCase();

            // Photo
            const photoX = startX + 10;
            const photoY = topCardY + 30;
            const photoW = 55;
            const photoH = 70;
            const photoPath = user.photo && user.photo !== '/uploads/default-avatar.png'
                ? path.join(process.cwd(), 'public', user.photo) : null;

            if (photoPath && fs.existsSync(photoPath)) {
                // Ensure photos are JPG/PNG. SVGs/WebP will crash the generator.
                doc.image(photoPath, photoX, photoY, { width: photoW, height: photoH });
            } else {
                doc.rect(photoX, photoY, photoW, photoH).fill('#e8e8e8');
                doc.fontSize(6).fill('#999').text('PHOTO', photoX + 15, photoY + 30);
            }

            // QR Code
            const qrX = startX + cardWidth - 55;
            const qrY = topCardY + 15;
            doc.image(qrBuffer, qrX, qrY, { width: 45, height: 45 });

            // Labels and Values
            doc.fontSize(5).fillColor('#666666').text('SURNAME/NOM', detailsStartX, y);
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#111').text((user.lastName || '').toUpperCase(), detailsStartX, y + 8);

            y += 22;
            doc.fontSize(5).fillColor('#666666').text('GIVEN NAMES/PRENOMS', detailsStartX, y);
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#111').text(fullName, detailsStartX, y + 8);

            y += 22;
            doc.fontSize(5).fillColor('#666666').text('DATE OF BIRTH', detailsStartX, y);
            doc.fontSize(8).font('Helvetica-Bold').fillColor('#111').text(dobFormatted, detailsStartX, y + 8);

            doc.fontSize(5).fillColor('#666666').text('SEX/SEXE', detailsStartX + 60, y);
            doc.fontSize(8).font('Helvetica-Bold').fillColor('#111').text((user.gender === 'MALE' ? 'MALE' : 'FEMALE'), detailsStartX + 60, y + 8);

            doc.fontSize(5).fillColor('#666666').text('ISSUE DATE', qrX, y);
            doc.fontSize(7).font('Helvetica-Bold').fillColor('#111').text(issueDate, qrX, y + 8);

            const ninY = topCardY + cardHeight - 30;
            doc.fontSize(6).fillColor('#666666').text('National Identification Number (NIN)', startX, ninY, { width: cardWidth, align: 'center' });
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#000').text(user.nin, startX, ninY + 8, { width: cardWidth, align: 'center', characterSpacing: 2 });

            // ==========================================
            // BACK CARD LAYOUT
            // ==========================================
            const backBgPng = path.join(process.cwd(), 'public', 'premiumback-back.png');
            const backBgJpg = path.join(process.cwd(), 'public', 'premiumback-back.jpg');

            if (fs.existsSync(backBgPng)) {
                doc.image(backBgPng, startX, bottomCardY, { width: cardWidth, height: cardHeight });
            } else if (fs.existsSync(backBgJpg)) {
                doc.image(backBgJpg, startX, bottomCardY, { width: cardWidth, height: cardHeight });
            } else {
                doc.rect(startX, bottomCardY, cardWidth, cardHeight).fill('#ffffff').stroke('#0d6b0d').stroke();
                doc.fontSize(8).font('Helvetica').fillColor('#444')
                    .text("This card remains the property of the National Identity Management Commission. If found, please return to the nearest NIMC office.", startX + 20, bottomCardY + 60, { width: cardWidth - 40, align: 'center' });
            }

            doc.end();
        } catch (err) {
            console.error("PDFKit Generation Error:", err);
            reject(err);
        }
    });
}