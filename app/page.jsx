"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { Shield, CreditCard, FileText, Fingerprint, Search } from "lucide-react";

export default function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <main className="min-h-screen bg-white selection:bg-[#008751]/20">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#008751] rounded-lg flex items-center justify-center text-white font-bold">N</div>
                    <span className="font-bold text-xl tracking-tight text-[#008751]">NINPlatform</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/auth/login" className="text-sm font-semibold text-slate-600 hover:text-[#008751] transition-colors">Login</Link>
                    <Link
                        href={isAuthenticated ? "/dashboard" : "/auth/signup"}
                        className="bg-[#008751] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#008751]/20 hover:bg-[#007043] transition-all"
                    >
                        {isAuthenticated ? "Dashboard" : "Get Started"}
                    </Link>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#008751]/5 border border-[#008751]/10 rounded-full px-4 py-1.5 mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#008751] animate-pulse" />
                        <span className="text-[#008751] text-xs font-bold tracking-wide uppercase">
                            Secure Simulation Platform
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-[1.05]">
                        Generate your NIN Slip <br />
                        <span className="text-[#008751]">in seconds.</span>
                    </h1>

                    <p className="text-slate-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        The professional way to verify your identity and generate official-standard NIN slips and Premium Digital IDs. Secure, fast, and high-fidelity.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
                        <Link
                            href={isAuthenticated ? "/dashboard/verify" : "/auth/login"}
                            className="px-10 py-5 bg-[#008751] text-white rounded-2xl font-black text-lg shadow-2xl shadow-[#008751]/30 hover:bg-[#007043] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                            <Search className="h-6 w-6" />
                            Verify My NIN
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-lg hover:border-slate-200 hover:bg-slate-50 transition-all"
                        >
                            Sign Up Free
                        </Link>
                    </div>

                    {/* Trusted Indicators */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-50 contrast-0 grayscale">
                        <div className="flex justify-center items-center font-black text-2xl italic tracking-tighter">NIMC</div>
                        <div className="flex justify-center items-center font-black text-2xl italic tracking-tighter">FEDERAL</div>
                        <div className="flex justify-center items-center font-black text-2xl italic tracking-tighter">REPUBLIC</div>
                        <div className="flex justify-center items-center font-black text-2xl italic tracking-tighter">NIGERIA</div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-24 bg-[#f8fafc] border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#008751]">
                                <FileText className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Standard Slips</h3>
                            <p className="text-slate-500 leading-relaxed">Generate the official vertical NIN slip format, perfect for printing and all government validations.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#008751]">
                                <CreditCard className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Premium IDs</h3>
                            <p className="text-slate-500 leading-relaxed">Get a modern landscape digital ID preview with QR code integration and high-fidelity aesthetics.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-[#008751]">
                                <Fingerprint className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Secure Retrieval</h3>
                            <p className="text-slate-500 leading-relaxed">End-to-end encrypted verification process ensuring your personal information is protected at all times.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-100 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                    © 2026 NINPlatform | Secure Identity Systems
                </p>
            </footer>
        </main>
    );
}
