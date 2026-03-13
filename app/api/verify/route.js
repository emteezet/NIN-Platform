import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { identityService } from '@/services/IdentityService';

export async function POST(request) {
    console.log('[API Verify] Request started');
    try {
        const body = await request.json();
        const { nin } = body;

        // Strict validation: exactly 11 numeric digits
        if (!nin || !/^\d{11}$/.test(nin)) {
            return NextResponse.json(
                { error: 'Invalid input. NIN must be exactly 11 numeric digits.' },
                { status: 400 }
            );
        }

        // ── 1. Authenticate the request ──────────────────────────────────
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

        if (!token) {
            console.error('[API Verify] Auth token missing or invalid prefix');
            return NextResponse.json(
                { error: 'Unauthorized. Please log in to verify.' },
                { status: 401 }
            );
        }

        let authUser = null;
        let authError = null;

        // Using native https to bypass local fetch issues
        const https = await import('https');
        
        try {
            authUser = await new Promise((resolve, reject) => {
                const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`);
                const options = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    },
                    timeout: 10000 // 10s timeout
                };

                const req = https.request(url, options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => { data += chunk; });
                    res.on('end', () => {
                        try {
                            const json = JSON.parse(data);
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
                    console.error('[API Verify] HTTPS Request Error:', e.message);
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
            console.error('[API Verify] Critical auth check failure:', err);
            authError = { message: 'Authentication internal error' };
        }

        if (authError || !authUser) {
            console.error('[API Verify] Auth failure:', { 
                message: authError?.message, 
                tokenLength: token.length
            });
            return NextResponse.json(
                { error: authError?.message || 'Session expired. Please log in again.' },
                { status: 401 }
            );
        }

        // ── 2. Call IdentityService (Handles Debit + Registry Lookup) ──
        try {
            const result = await identityService.verifyNin(authUser.id, nin);
            
            return NextResponse.json({
                success: true,
                status: result.status || 'VALID',
                user: result.data,
                generatedAt: new Date().toISOString()
            });

        } catch (err) {
            console.error('[API Verify] Error object:', JSON.stringify(err, null, 2));
            console.error('[API Verify] Error message:', err.message);
            // Handle Insufficient Balance
            if (err.message?.toLowerCase().includes('insufficient') || err.code === 'INSUFFICIENT_BALANCE') {
                return NextResponse.json(
                    {
                        error: `Insufficient wallet balance. You need at least ₦150 to verify a NIN.`,
                        code: 'INSUFFICIENT_BALANCE',
                    },
                    { status: 402 }
                );
            }

            // Handle Not Found
            if (err.code === 'IDENTITY_NOT_FOUND' || err.message?.includes('not found')) {
                return NextResponse.json(
                    { error: 'NIN record not found in the official registry.' },
                    { status: 404 }
                );
            }

            throw err; // Pass to main catch block
        }

    } catch (err) {
        console.error('Verify API error:', err);
        return NextResponse.json(
            { error: err.message || 'An error occurred during verification.' },
            { status: err.status || 500 }
        );
    }
}
