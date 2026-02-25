"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function NinForm({ onSubmit, loading }) {
    const [nin, setNin] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const val = e.target.value.replace(/\D/g, ""); // Allow only digits
        if (val.length <= 11) {
            setNin(val);
            setError("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nin.length !== 11) {
            setError("Please enter exactly 11 numeric digits.");
            return;
        }
        onSubmit(nin);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={nin}
                    onChange={handleChange}
                    placeholder="Enter 11-digit NIN"
                    className={cn(
                        "w-full pl-12 pr-4 py-4 bg-white border-2 rounded-xl text-slate-900 text-lg transition-all outline-none",
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-100 focus:border-[#008751] focus:ring-4 focus:ring-[#008751]/10"
                    )}
                    maxLength={11}
                    disabled={loading}
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm font-medium pl-1 animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading || nin.length !== 11}
                className={cn(
                    "w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
                    "bg-[#008751] hover:bg-[#007043] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-[#008751]/20"
                )}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Securing Connection...</span>
                    </>
                ) : (
                    <span>Verify & Generate Slip</span>
                )}
            </button>

            <p className="text-center text-slate-400 text-xs">
                Your data is encrypted and handled securely.
            </p>
        </form>
    );
}
