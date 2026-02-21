/**
 * Seed Script — Populates MongoDB with sample Nigerian users
 * Run with: npm run seed
 */

import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from project root
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Import User model
import User from '../lib/models/User.js';

const sampleUsers = [
    {
        nin: '12345678901',
        phone: '08012345678',
        firstName: 'Adewale',
        lastName: 'Okonkwo',
        middleName: 'Chinedu',
        dob: new Date('1990-03-15'),
        gender: 'Male',
        state: 'Lagos',
        lga: 'Ikeja',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '23456789012',
        phone: '08023456789',
        firstName: 'Ngozi',
        lastName: 'Adekunle',
        middleName: 'Amaka',
        dob: new Date('1988-07-22'),
        gender: 'Female',
        state: 'Anambra',
        lga: 'Awka South',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '34567890123',
        phone: '08034567890',
        firstName: 'Ibrahim',
        lastName: 'Mohammed',
        middleName: 'Suleiman',
        dob: new Date('1995-11-08'),
        gender: 'Male',
        state: 'Kano',
        lga: 'Kano Municipal',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '45678901234',
        phone: '08045678901',
        firstName: 'Folake',
        lastName: 'Adeyemi',
        middleName: 'Oluwaseun',
        dob: new Date('1992-01-30'),
        gender: 'Female',
        state: 'Oyo',
        lga: 'Ibadan North',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '56789012345',
        phone: '08056789012',
        firstName: 'Emeka',
        lastName: 'Nwankwo',
        middleName: 'Obiora',
        dob: new Date('1985-05-14'),
        gender: 'Male',
        state: 'Enugu',
        lga: 'Enugu East',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '67890123456',
        phone: '08067890123',
        firstName: 'Aisha',
        lastName: 'Bello',
        middleName: 'Fatima',
        dob: new Date('1998-09-03'),
        gender: 'Female',
        state: 'Abuja FCT',
        lga: 'Abuja Municipal',
        photo: '/uploads/default-avatar.png',
    },
];

async function seedDatabase() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('❌ MONGODB_URI not found in .env.local');
            process.exit(1);
        }

        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users');

        // Insert sample users
        const inserted = await User.insertMany(sampleUsers);
        console.log(`✅ Seeded ${inserted.length} sample users:`);
        inserted.forEach((user) => {
            console.log(`   → ${user.firstName} ${user.lastName} | NIN: ${user.nin} | Phone: ${user.phone}`);
        });

        await mongoose.disconnect();
        console.log('\n🎉 Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
}

seedDatabase();
