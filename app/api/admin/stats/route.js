import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Slip from '@/lib/models/Slip';

export async function GET() {
    try {
        await connectDB();

        const totalUsers = await User.countDocuments();
        const totalSlips = await Slip.countDocuments();

        // Get recent slips
        const recentSlips = await Slip.find({})
            .sort({ generatedAt: -1 })
            .limit(10)
            .lean();

        // Get slips per user
        const slipsPerUser = await Slip.aggregate([
            { $group: { _id: '$nin', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers,
                totalSlips,
                recentSlips: recentSlips.map((s) => ({
                    nin: s.nin,
                    serialNumber: s.serialNumber,
                    generatedAt: s.generatedAt,
                })),
                topUsers: slipsPerUser,
            },
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        return NextResponse.json({ error: 'Failed to fetch stats.' }, { status: 500 });
    }
}
