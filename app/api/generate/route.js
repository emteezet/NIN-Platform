import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase/client';
import { generatePDF } from '@/lib/utils/generatePDF';
import { generateQR } from '@/lib/utils/generateQR';

export async function POST(request) {
    try {
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

        // Determine search filter
        let filter = '';
        if (/^\d{11}$/.test(sanitized)) {
            filter = `nin.eq.${sanitized},phone.eq.${sanitized}`;
        } else if (/^0\d{10}$/.test(sanitized)) {
            filter = `phone.eq.${sanitized}`;
        } else {
            return NextResponse.json(
                { error: 'Invalid input. NIN must be 11 digits. Phone must be 11 digits starting with 0.' },
                { status: 400 }
            );
        }

        // Find user in Registry
        const { data: user, error: userError } = await supabase
            .from('registry')
            .select('*')
            .or(filter)
            .single();

        if (userError || !user) {
            console.error('Registry lookup error:', userError);
            return NextResponse.json(
                { error: 'Record not found. Please check your NIN or phone number.' },
                { status: 404 }
            );
        }

        // Generate QR code as data URL
        const qrCode = await generateQR(user.nin);

        // Generate PDF
        const { buffer: pdfBuffer, serialNumber } = await generatePDF(user);

        // Track the slip generation in Supabase
        const { error: slipError } = await supabase
            .from('slips')
            .insert({
                nin: user.nin,
                serial_number: serialNumber,
                // userId: ... (optional: could get from session if needed)
            });

        if (slipError) {
            console.error('Slip tracking error:', slipError);
        }

        // Convert PDF buffer to base64
        const pdfBase64 = pdfBuffer.toString('base64');

        // Format user for frontend
        const userData = {
            nin: user.nin,
            phone: user.phone,
            firstName: user.first_name,
            lastName: user.last_name,
            middleName: user.middle_name || '',
            dob: user.dob,
            gender: user.gender,
            state: user.state,
            lga: user.lga,
            photo: user.photo,
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
