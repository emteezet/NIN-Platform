import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Slip from '@/lib/models/Slip';
import { generatePDF } from '@/lib/utils/generatePDF';
import { generateQR } from '@/lib/utils/generateQR';
import { generateSerial } from '@/lib/utils/serial';

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { query } = body;

        // Validate input
        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: 'Please provide a NIN or phone number.' },
                { status: 400 }
            );
        }

        const sanitized = query.trim();

        // Determine if NIN or phone and validate
        let searchQuery;
        if (/^\d{11}$/.test(sanitized)) {
            // Could be NIN or phone — search both
            searchQuery = { $or: [{ nin: sanitized }, { phone: sanitized }] };
        } else if (/^0\d{10}$/.test(sanitized)) {
            searchQuery = { phone: sanitized };
        } else {
            return NextResponse.json(
                { error: 'Invalid input. NIN must be 11 digits. Phone must be 11 digits starting with 0.' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne(searchQuery).lean();

        if (!user) {
            return NextResponse.json(
                { error: 'Record not found. Please check your NIN or phone number.' },
                { status: 404 }
            );
        }

        // Generate QR code as data URL
        const qrCode = await generateQR(user.nin);

        // Generate PDF
        const { buffer: pdfBuffer, serialNumber } = await generatePDF(user);

        // Track the slip generation
        await Slip.create({
            nin: user.nin,
            serialNumber,
            userId: user._id,
        });

        // Convert PDF buffer to base64
        const pdfBase64 = pdfBuffer.toString('base64');

        // Format user for frontend (don't expose DB internals)
        const userData = {
            nin: user.nin,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName || '',
            dob: user.dob,
            gender: user.gender,
            state: user.state,
            lga: user.lga,
            photo: user.photo,
            createdAt: user.createdAt,
        };

        return NextResponse.json({
            success: true,
            user: userData,
            qrCode,
            pdf: pdfBase64,
            serialNumber,
            generatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Generate API error:', err);
        return NextResponse.json(
            { error: 'An error occurred while generating the slip. Please try again.' },
            { status: 500 }
        );
    }
}
