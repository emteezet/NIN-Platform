'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputForm from '@/components/InputForm';

export default function HomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (query) => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong. Please try again.');
                setLoading(false);
                return;
            }

            // Store result in sessionStorage for the generate page
            sessionStorage.setItem('nin-result', JSON.stringify(data));
            router.push('/generate');
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex flex-col">
            {/* Hero Section */}
            <section className="gradient-hero flex-1 flex items-center justify-center px-4 py-20">
                <div className="text-center max-w-2xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-in">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-100 text-xs font-medium tracking-wide">
                            Third-Party Simulation Platform
                        </span>
                    </div>

                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 animate-in animate-delay-1"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                        NIN Slip &{' '}
                        <span className="bg-gradient-to-r from-green-200 to-green-400 bg-clip-text text-transparent">
                            ID Card
                        </span>{' '}
                        Generator
                    </h1>

                    <p className="text-green-100/80 text-lg mb-10 max-w-lg mx-auto animate-in animate-delay-2">
                        Generate your National Identification Number slip and preview your
                        plastic ID card instantly.
                    </p>

                    {/* Search Card */}
                    <div
                        className="glass-card p-8 max-w-lg mx-auto animate-in animate-delay-3"
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                        }}
                    >
                        <InputForm onSubmit={handleSubmit} loading={loading} />

                        {error && (
                            <div
                                className="mt-4 p-4 rounded-xl text-sm flex items-start gap-3"
                                style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                    color: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.15)',
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="flex-shrink-0 mt-0.5"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4m0 4h.01" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Sample NINs */}
                    <div className="mt-8 animate-in animate-delay-4">
                        <p className="text-green-200/50 text-xs mb-3">Try sample NINs:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['12345678901', '23456789012', '34567890123'].map((nin) => (
                                <button
                                    key={nin}
                                    onClick={() => {
                                        document.querySelector('input').value = nin;
                                        document.querySelector('input').dispatchEvent(
                                            new Event('input', { bubbles: true })
                                        );
                                        handleSubmit(nin);
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all hover:scale-105"
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        color: 'rgba(255,255,255,0.7)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                >
                                    {nin}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="max-w-5xl mx-auto">
                    <h2
                        className="text-2xl font-bold text-center mb-10"
                        style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
                    >
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🔍',
                                title: 'Enter NIN or Phone',
                                desc: 'Input your 11-digit National Identification Number or registered phone number.',
                            },
                            {
                                icon: '⚡',
                                title: 'Instant Generation',
                                desc: 'The system retrieves your record and generates a professional PDF slip immediately.',
                            },
                            {
                                icon: '📥',
                                title: 'Download & Verify',
                                desc: 'Download your slip, view your ID card preview, and verify via QR code.',
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="glass-card p-6 text-center"
                            >
                                <div className="text-3xl mb-4">{feature.icon}</div>
                                <h3
                                    className="font-semibold text-base mb-2"
                                    style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
                                >
                                    {feature.title}
                                </h3>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
