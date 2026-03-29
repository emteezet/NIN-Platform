import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';
import { authenticateRequest } from '@/lib/utils/auth';
const { decryptIdentity } = require('@/lib/crypto/encryption');

export async function GET(request) {
    try {
        const { user: authUser, error: authError } = await authenticateRequest(request);

        if (!authUser) {
            return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('verification_history')
            .select('id, type, identifier, created_at, slip_type')
            .eq('user_id', authUser.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Decrypt identifiers (NIN/BVN) for display
        const records = data.map(record => ({
            ...record,
            identifier: decryptIdentity(record.identifier)
        }));

        return NextResponse.json({ success: true, records });
    } catch (error) {
        console.error('[API Verifications] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch verification history' }, { status: 500 });
    }
}
