import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET — List all users
export async function GET() {
    try {
        await connectDB();
        const users = await User.find({})
            .sort({ createdAt: -1 })
            .lean();

        const sanitized = users.map((u) => ({
            id: u._id.toString(),
            nin: u.nin,
            phone: u.phone,
            firstName: u.firstName,
            lastName: u.lastName,
            middleName: u.middleName || '',
            gender: u.gender,
            state: u.state,
            lga: u.lga,
            dob: u.dob,
            photo: u.photo,
            createdAt: u.createdAt,
        }));

        return NextResponse.json({ success: true, users: sanitized });
    } catch (err) {
        console.error('Admin users GET error:', err);
        return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
    }
}

// POST — Add new user
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // Validate required fields
        const required = ['nin', 'phone', 'firstName', 'lastName', 'dob', 'gender', 'state', 'lga'];
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Check NIN format
        if (!/^\d{11}$/.test(body.nin)) {
            return NextResponse.json(
                { error: 'NIN must be exactly 11 digits.' },
                { status: 400 }
            );
        }

        // Check if NIN already exists
        const existing = await User.findOne({ nin: body.nin });
        if (existing) {
            return NextResponse.json(
                { error: 'A user with this NIN already exists.' },
                { status: 409 }
            );
        }

        const user = await User.create({
            nin: body.nin,
            phone: body.phone,
            firstName: body.firstName,
            lastName: body.lastName,
            middleName: body.middleName || '',
            dob: new Date(body.dob),
            gender: body.gender,
            state: body.state,
            lga: body.lga,
            photo: body.photo || '/uploads/default-avatar.png',
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                nin: user.nin,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        }, { status: 201 });
    } catch (err) {
        console.error('Admin users POST error:', err);
        return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
    }
}

// DELETE — Remove user by ID
export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
        }

        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'User deleted.' });
    } catch (err) {
        console.error('Admin users DELETE error:', err);
        return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
    }
}
