import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { identityService } from '@/services/IdentityService';

export async function POST(request) {
    try {
        const body = await request.json();
        const { tracking_id } = body;

        console.log(`[API] Verifying NIN via Tracking ID: ${tracking_id}`);

        if (!tracking_id || tracking_id.length < 5) {
            return NextResponse.json(
                { error: 'Invalid Tracking ID format.' },
                { status: 400 }
            );
        }

        // ── 1. Authenticate the request ──────────────────────────────────
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

        if (!token) {
            console.error('[API Tracking] Auth token missing or invalid prefix');
            return NextResponse.json(
                { error: 'Unauthorized. Please log in to verify.' },
                { status: 401 }
            );
        }

        let authUser = null;
        let authError = null;
        const https = await import('https');
        
        try {
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
                    let data = '';
                    res.on('data', (chunk) => { data += chunk; });
                    res.on('end', () => {
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
                    console.error('[API Tracking] HTTPS Request Error:', e.message);
                    authError = { message: `Auth service unreachable: ${e.message}` };
                    resolve(null);
                });

                req.on('timeout', () => {
                    req.destroy();
                    authError = { message: 'Authentication timed out' };
                    resolve(null);
                });

                req.end();
            });
        } catch (err) {
            console.error('[API Tracking] Critical auth check failure:', err);
            authError = { message: 'Authentication internal error' };
        }

        if (authError || !authUser) {
            console.error('[API Tracking] Auth failure:', {
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
            const result = await identityService.verifyByNinTracking(authUser.id, tracking_id);
            
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
                        error: `Insufficient wallet balance. You need at least ₦150 to verify via tracking ID.`,
                        code: 'INSUFFICIENT_BALANCE',
                    },
                    { status: 402 }
                );
            }

            // Handle Not Found
            if (err.code === 'IDENTITY_NOT_FOUND' || err.message?.toLowerCase().includes('not found')) {
                return NextResponse.json(
                    { error: 'NIN record not found for this tracking ID in the official registry.' },
                    { status: 404 }
                );
            }

            throw err;
        }

    } catch (err) {
        console.error('Verify API error:', err);
        return NextResponse.json(
            { error: err.message || 'An error occurred during tracking ID verification.' },
            { status: err.status || 500 }
        );
    }
}
