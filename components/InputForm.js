'use client';

import { useState } from 'react';

export default function InputForm({ onSubmit, loading }) {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const trimmed = query.trim();
        if (!trimmed) {
            setError('Please enter a NIN or phone number.');
            return;
        }

        // Validate: must be exactly 11 digits
        if (!/^\d{11}$/.test(trimmed) && !/^0\d{10}$/.test(trimmed)) {
            setError('Enter a valid 11-digit NIN or phone number (starting with 0).');
            return;
        }

        onSubmit(trimmed);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setError('');
                    }}
                    placeholder="Enter NIN or Phone Number"
                    className="input-field pl-12 pr-4"
                    maxLength={11}
                    disabled={loading}
                    autoFocus
                />
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4m0 4h.01" />
                    </svg>
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <span className="spinner" />
                        Generating...
                    </>
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6" />
                            <path d="M12 18v-6" />
                            <path d="M9 15l3 3 3-3" />
                        </svg>
                        Generate Slip
                    </>
                )}
            </button>
        </form>
    );
}
