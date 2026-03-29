import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';
import { authenticateRequest } from '@/lib/utils/auth';
const { decryptIdentity } = require('@/lib/crypto/encryption');

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { user: authUser, error: authError } = await authenticateRequest(request);

        if (!authUser) {
            return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });
        }

        const { data: record, error } = await supabase
            .from('verification_history')
            .select('*')
            .eq('id', id)
            .eq('user_id', authUser.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Record not found' }, { status: 404 });
            }
            throw error;
        }

        // Decrypt the identity data
        let userData = JSON.parse(record.id_data);
        
        // Ensure NIN/BVN inside the data are also decrypted if they were stored encrypted
        if (userData.nin) userData.nin = decryptIdentity(userData.nin);
        if (userData.bvn) userData.bvn = decryptIdentity(userData.bvn);

        return NextResponse.json({
            success: true,
            record: {
                ...record,
                user: userData,
                identifier: decryptIdentity(record.identifier)
            }
        });
    } catch (error) {
        console.error('[API Verification Detail] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch verification details' }, { status: 500 });
    }
}
