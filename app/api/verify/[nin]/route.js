import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase/client';

export async function GET(request, { params }) {
    try {
        const { nin } = params;

        // Validate NIN format
        if (!nin || !/^\d{11}$/.test(nin)) {
            return NextResponse.json(
                { error: 'Invalid NIN format.' },
                { status: 400 }
            );
        }

        // Find user in Registry
        const { data: user, error: userError } = await supabase
            .from('registry')
            .select('*')
            .eq('nin', nin)
            .single();

        if (userError || !user) {
            console.error('Verify registry error:', userError);
            return NextResponse.json(
                { error: 'Record not found.' },
                { status: 404 }
            );
        }

        // Get latest slip for this NIN from Supabase
        const { data: latestSlip, error: slipError } = await supabase
            .from('slips')
            .select('*')
            .eq('nin', nin)
            .order('generated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (slipError) {
            console.error('Verify slip lookup error:', slipError);
        }

        return NextResponse.json({
            success: true,
            status: 'VALID',
            user: {
                nin: user.nin,
                firstName: user.first_name,
                lastName: user.last_name,
                middleName: user.middle_name || '',
                dob: user.dob,
                gender: user.gender,
                state: user.state,
                lga: user.lga,
                photo: user.photo,
            },
            lastGenerated: latestSlip ? latestSlip.generated_at : null,
            serialNumber: latestSlip ? latestSlip.serial_number : null,
        });
    } catch (err) {
        console.error('Verify API error:', err);
        return NextResponse.json(
            { error: 'An error occurred during verification.' },
            { status: 500 }
        );
    }
}
