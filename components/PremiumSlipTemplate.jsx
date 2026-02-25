"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

export default function PremiumSlipTemplate({ userData }) {
    if (!userData) return null;

    // Dimensions: Standard ID card ratio (85.6mm x 53.98mm mapping to pixels ~324px x 204px)
    // Scaling for high quality preview and capture
    return (
        <div
            id="premium-slip-template"
            className="relative bg-[#008751] text-white font-sans overflow-hidden shadow-2xl"
            style={{
                width: "640px",
                height: "400px",
                borderRadius: "24px",
            }}
        >
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            </div>

            {/* Header */}
            <div className="absolute top-6 left-8 right-8 flex justify-between items-start border-b border-white/20 pb-4">
                <div>
                    <h1 className="text-xs font-black tracking-[0.2em] uppercase opacity-80">
                        Federal Republic of Nigeria
                    </h1>
                    <p className="text-xl font-black tracking-tight">DIGITAL NIN SLIP</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-[8px] text-center font-bold">
                    ARMS
                </div>
            </div>

            {/* Main Content */}
            <div className="absolute top-28 left-8 flex gap-8">
                {/* Photo */}
                <div className="w-32 h-40 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl overflow-hidden shadow-xl">
                    {userData.photo ? (
                        <img src={userData.photo} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-white/20 text-4xl">👤</div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-4 pt-2">
                    <div>
                        <p className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Surname / Nom</p>
                        <p className="text-lg font-black">{userData.lastName}</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Given Names / Prenoms</p>
                        <p className="text-base font-bold">{userData.firstName} {userData.middleName}</p>
                    </div>
                    <div className="flex gap-10">
                        <div>
                            <p className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Date of Birth</p>
                            <p className="text-sm font-bold">{userData.dob}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase font-bold text-white/50 tracking-widest">Sex / Sexe</p>
                            <p className="text-sm font-bold">{userData.gender === "MALE" ? "M" : "F"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* NIN Footer */}
            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                <div>
                    <p className="text-[9px] uppercase font-bold text-white/50 tracking-widest mb-1">National Identification Number</p>
                    <p className="text-3xl font-black tracking-tighter text-white drop-shadow-md">
                        {userData.nin}
                    </p>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-lg">
                    <QRCodeSVG
                        value={`NIN:${userData.nin}|ID:${userData.trackingId}`}
                        size={70}
                        level="H"
                        includeMargin={false}
                    />
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
        </div>
    );
}
