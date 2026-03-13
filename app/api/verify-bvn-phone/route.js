import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { identityService } from '@/services/IdentityService';

export async function POST(request) {
    console.log('[API BVN Phone] Request started');
    try {
        const body = await request.json();
        const { phone } = body;

        // Strict validation: exactly 11 numeric digits
        if (!phone || !/^\d{11}$/.test(phone)) {
            return NextResponse.json(
                { error: 'Invalid phone number format. Must be 11 numeric digits.' },
                { status: 400 }
            );
        }

        // ── 1. Authenticate the request ──────────────────────────────────
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

        if (!token) {
            console.error('[API BVN Phone] Auth token missing or invalid prefix');
            return NextResponse.json(
                { error: 'Unauthorized. Please log in to verify.' },
                { status: 401 }
            );
        }

        let authUser = null;
        let authError = null;

        const https = await import('https');
        
        try {
            console.log('[API BVN Phone] Invoking HTTPS auth check to:', `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`);
            authUser = await new Promise((resolve) => {
                const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`);
                const options = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    },
                    timeout: 10000
                };

                const req = https.request(url, options, (res) => {
                    console.log('[API BVN Phone] HTTPS Response Status:', res.statusCode);
                    let data = '';
                    res.on('data', (chunk) => { data += chunk; });
                    res.on('end', () => {
                        console.log('[API BVN Phone] HTTPS Request End. Data length:', data.length);
                        try {
                            const json = JSON.parse(data || '{}');
                            if (res.statusCode === 200) {
                                resolve(json);
                            } else {
                                authError = { message: json.msg || json.message || 'Auth failed' };
                                resolve(null);
                            }
                        } catch (e) {
                            authError = { message: 'Invalid server response' };
                            resolve(null);
                        }
                    });
                });

                req.on('error', (e) => {
                    console.error('[API BVN Phone] HTTPS Request Error (on-error):', e.message);
                    authError = { message: `Auth service unreachable: ${e.message}` };
                    resolve(null);
                });
                
                req.on('timeout', () => {
                    console.error('[API BVN Phone] HTTPS Request Timeout');
                    req.destroy();
                    authError = { message: 'Authentication timed out' };
                    resolve(null);
                });

                req.end();
            });
        } catch (err) {
            console.error('[API BVN Phone] Critical HTTPS catch block:', err);
            authError = { message: 'Authentication internal error' };
        }

        if (authError || !authUser) {
            console.error('[API BVN Phone] Auth failure:', {
                message: authError?.message,
                tokenLength: token?.length
            });
            return NextResponse.json(
                { error: authError?.message || 'Session expired. Please log in again.' },
                { status: 401 }
            );
        }

        // ── 2. Call IdentityService (Handles Debit + Registry Lookup) ──
        try {
            const result = await identityService.verifyBvnPhone(authUser.id, phone);
            
            return NextResponse.json({
                success: true,
                status: result.status || 'VALID',
                user: result.data,
                lastGenerated: new Date().toISOString(),
                serialNumber: result.serialNumber || result.reportId || ("SRN-" + Math.random().toString(36).substring(7).toUpperCase()),
            });

        } catch (err) {
            // Handle Insufficient Balance
            if (err.message?.toLowerCase().includes('insufficient') || err.code === 'INSUFFICIENT_BALANCE') {
                return NextResponse.json(
                    {
                        error: `Insufficient wallet balance. You need at least ₦100 to verify a BVN record.`,
                        code: 'INSUFFICIENT_BALANCE',
                    },
                    { status: 402 }
                );
            }

            // Handle Not Found
            if (err.code === 'IDENTITY_NOT_FOUND' || err.message?.toLowerCase().includes('not found')) {
                return NextResponse.json(
                    { error: 'BVN record not found for this phone number in the official registry.' },
                    { status: 404 }
                );
            }

            throw err;
        }

    } catch (err) {
        console.error('Verify BVN Phone API error:', err);
        return NextResponse.json(
            { error: err.message || 'An error occurred during verification.' },
            { status: err.status || 500 }
        );
    }
}
