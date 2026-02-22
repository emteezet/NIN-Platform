'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SlipPreview from '@/components/SlipPreview';
import CardPreview from '@/components/CardPreview';

export default function GeneratePage() {
    const router = useRouter();
    const [result, setResult] = useState(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('nin-result');
        if (!stored) {
            router.push('/');
            return;
        }
        try {
            setResult(JSON.parse(stored));
        } catch {
            router.push('/');
        }
    }, [router]);

    if (!result) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="spinner" style={{ borderTopColor: 'var(--accent-green)', borderColor: 'var(--border-color)' }} />
            </div>
        );
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${result.pdf}`;
        link.download = `NIN-Slip-${result.user.nin}.pdf`;
        link.click();
    };

    const handlePrint = () => {
        // Open PDF in new window for printing
        const pdfWindow = window.open('', '_blank');
        pdfWindow.document.write(
            `<html><head><title>NIN Slip - ${result.user.nin}</title></head>` +
            `<body style="margin:0"><embed width="100%" height="100%" ` +
            `src="data:application/pdf;base64,${result.pdf}" ` +
            `type="application/pdf"></embed></body></html>`
        );
    };

    const handleNewSearch = () => {
        sessionStorage.removeItem('nin-result');
        router.push('/');
    };

    return (
        <div className="min-h-[80vh] py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back button */}
                <button
                    onClick={handleNewSearch}
                    className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    New Search
                </button>

                {/* Success Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-in">
                    <div>
                        <div className="badge-valid mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                            Record Found
                        </div>
                        <h1
                            className="text-2xl font-bold"
                            style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
                        >
                            NIN Slip Generated
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Serial: {result.serialNumber}
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 no-print">
                        <button onClick={handleDownload} className="btn-primary flex items-center gap-2 text-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            Download PDF
                        </button>
                        <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 text-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            Print
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Slip Preview */}
                    <div>
                        <SlipPreview
                            user={result.user}
                            qrCode={result.qrCode}
                            serialNumber={result.serialNumber}
                            generatedAt={result.generatedAt}
                        />
                    </div>

                    {/* Card Preview */}
                    <div>
                        <CardPreview
                            user={result.user}
                            qrCode={result.qrCode}
                            serialNumber={result.serialNumber}
                            generatedAt={result.generatedAt}
                        />

                        {/* Verify Link */}
                        <div
                            className="glass-card p-5 mt-6 animate-in animate-delay-3"
                        >
                            <h3
                                className="text-sm font-semibold mb-2 flex items-center gap-2"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Verification
                            </h3>
                            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                                Share this link to verify the NIN slip:
                            </p>
                            <div
                                className="flex items-center gap-2 p-3 rounded-lg text-xs font-mono"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    color: 'var(--accent-green)',
                                    border: '1px solid var(--border-color)',
                                }}
                            >
                                <span className="truncate flex-1">
                                    {typeof window !== 'undefined' ? window.location.origin : ''}/verify/{result.user.nin}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/verify/${result.user.nin}`);
                                    }}
                                    className="flex-shrink-0 p-1.5 rounded-md transition-colors hover:bg-white/10"
                                    title="Copy link"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" />
                                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
