import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Slip from '@/lib/models/Slip';

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { nin } = params;

        // Validate NIN format
        if (!nin || !/^\d{11}$/.test(nin)) {
            return NextResponse.json(
                { error: 'Invalid NIN format.' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ nin }).lean();

        if (!user) {
            return NextResponse.json(
                { error: 'Record not found.' },
                { status: 404 }
            );
        }

        // Get latest slip for this NIN
        const latestSlip = await Slip.findOne({ nin })
            .sort({ generatedAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            status: 'VALID',
            user: {
                nin: user.nin,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName || '',
                dob: user.dob,
                gender: user.gender,
                state: user.state,
                lga: user.lga,
                photo: user.photo,
            },
            lastGenerated: latestSlip ? latestSlip.generatedAt : null,
            serialNumber: latestSlip ? latestSlip.serialNumber : null,
        });
    } catch (err) {
        console.error('Verify API error:', err);
        return NextResponse.json(
            { error: 'An error occurred during verification.' },
            { status: 500 }
        );
    }
}
