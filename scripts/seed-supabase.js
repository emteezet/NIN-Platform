const { createClient } = require('@supabase/supabase-js');

const sampleUsers = [
    {
        nin: '12345678901',
        phone: '08012345678',
        first_name: 'Adewale',
        last_name: 'Okonkwo',
        middle_name: 'Chinedu',
        dob: '1990-03-15',
        gender: 'Male',
        state: 'Lagos',
        lga: 'Ikeja',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '23456789012',
        phone: '08023456789',
        first_name: 'Ngozi',
        last_name: 'Adekunle',
        middle_name: 'Amaka',
        dob: '1988-07-22',
        gender: 'Female',
        state: 'Anambra',
        lga: 'Awka South',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '34567890123',
        phone: '08034567890',
        first_name: 'Ibrahim',
        last_name: 'Mohammed',
        middle_name: 'Suleiman',
        dob: '1995-11-08',
        gender: 'Male',
        state: 'Kano',
        lga: 'Kano Municipal',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '45678901234',
        phone: '08045678901',
        first_name: 'Folake',
        last_name: 'Adeyemi',
        middle_name: 'Oluwaseun',
        dob: '1992-01-30',
        gender: 'Female',
        state: 'Oyo',
        lga: 'Ibadan North',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '56789012345',
        phone: '08056789012',
        first_name: 'Emeka',
        last_name: 'Nwankwo',
        middle_name: 'Obiora',
        dob: '1985-05-14',
        gender: 'Male',
        state: 'Enugu',
        lga: 'Enugu East',
        photo: '/uploads/default-avatar.png',
    },
    {
        nin: '67890123456',
        phone: '08067890123',
        first_name: 'Aisha',
        last_name: 'Bello',
        middle_name: 'Fatima',
        dob: '1998-09-03',
        gender: 'Female',
        state: 'Abuja FCT',
        lga: 'Abuja Municipal',
        photo: '/uploads/default-avatar.png',
    },
];

async function seedSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase credentials missing in env');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
        console.log('🔗 Connecting to Supabase Registry...');

        // Clear existing registry (optional, depending on preference)
        const { error: deleteError } = await supabase.from('registry').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (deleteError) console.warn('⚠️ Warning: Could not clear registry:', deleteError.message);

        // Insert sample users
        const { data, error } = await supabase
            .from('registry')
            .insert(sampleUsers);

        if (error) {
            console.error('❌ Seeding failed:', error.message);
            process.exit(1);
        }

        console.log(`✅ Seeded ${sampleUsers.length} sample users into Supabase Registry!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Unexpected error during seeding:', err.message);
        process.exit(1);
    }
}

seedSupabase();
