"use client";

import React from "react";

export default function FullSlipTemplate({ userData }) {
    if (!userData) return null;

    const formatNin = (nin) => {
        return nin.replace(/(\d{4})(\d{4})(\d{3})/, "$1 $2 $3");
    };

    return (
        <div
            id="full-slip-template"
            className="bg-white p-8 font-sans border border-slate-200"
            style={{ width: "800px", minHeight: "1100px", color: "#333" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#008751] pb-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#008751] rounded-full flex items-center justify-center text-white text-xs text-center font-bold p-1">
                        COATS OF ARMS
                    </div>
                    <div>
                        <h1 className="text-[#008751] font-extrabold text-xl tracking-tighter">
                            FEDERAL REPUBLIC OF NIGERIA
                        </h1>
                        <p className="text-slate-600 text-sm font-semibold">
                            National Identity Management Commission
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Tracking ID</p>
                    <p className="font-mono font-bold">{userData.trackingId}</p>
                </div>
            </div>

            <div className="mb-10 text-center">
                <h2 className="text-2xl font-black bg-slate-100 py-3 rounded-lg border border-slate-200">
                    NATIONAL IDENTIFICATION NUMBER SLIP (NINS)
                </h2>
            </div>

            <div className="flex gap-10 mb-12">
                {/* Photo Container */}
                <div className="w-48 h-56 bg-slate-50 border-2 border-slate-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                    {userData.photo ? (
                        <img src={userData.photo} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-slate-200 text-4xl">👤</div>
                    )}
                </div>

                {/* Info Grid */}
                <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Surname</p>
                        <p className="font-bold text-lg">{userData.lastName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">First Name</p>
                        <p className="font-bold text-lg">{userData.firstName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Middle Name</p>
                        <p className="font-bold text-lg">{userData.middleName || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Gender</p>
                        <p className="font-bold text-lg">{userData.gender}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Date of Birth</p>
                        <p className="font-bold text-lg">{userData.dob}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Phone Number</p>
                        <p className="font-bold text-lg">{userData.phone}</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#008751]/5 p-8 rounded-2xl border border-[#008751]/10 mb-12">
                <div className="text-center">
                    <p className="text-xs text-[#008751] font-bold uppercase tracking-[0.3em] mb-2">
                        National Identification Number (NIN)
                    </p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">
                        {formatNin(userData.nin)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Address</h3>
                    <p className="text-sm leading-relaxed font-medium">{userData.residence}</p>
                    <p className="text-sm font-bold mt-1">{userData.lga}, {userData.state} State</p>
                </div>
                <div className="flex justify-end items-end">
                    <div className="w-24 h-24 bg-slate-100 flex items-center justify-center border border-slate-200 rounded">
                        QR CODE
                    </div>
                </div>
            </div>

            <div className="mt-auto border-t pt-6 text-[10px] text-slate-400 leading-relaxed text-center">
                <p className="font-bold text-slate-500 mb-2">NOTE: The National Identification Number (NIN) is your identity. Do not disclose it to unauthorized persons.</p>
                <p>This document is a property of the Federal Government of Nigeria. If found, please return to any NIMC office or Police Station.</p>
            </div>
        </div>
    );
}
