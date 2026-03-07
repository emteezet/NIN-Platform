"use client";

import { useRef } from "react";
import PremiumPlasticCard from "./PremiumPlasticCard";
import DownloadButton from "./DownloadButton";

export default function SlipTemplate({ user = {}, serialNumber = "" }) {
  const documentRef = useRef(null);

  const qrCodeData = user?.nin ? `NIN:${user.nin}` : "";

  return (
    <div className="w-full space-y-10">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Premium Identity Card</h2>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
           Format optimized for high-quality plastic printing
        </p>
      </div>

      {/* Preview Container */}
      <div
        className="relative rounded-[3rem] overflow-hidden border-2 border-slate-100 bg-[#f8fafc] flex flex-col items-center justify-center py-20 px-4 min-h-[500px] shadow-inner"
      >
        {/* Shadow Overlay for Premium Feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/20 pointer-events-none" />
        
        <div className="scale-[0.6] sm:scale-[0.85] lg:scale-[1.1] transition-all duration-700 origin-center hover:scale-[1.15]">
          <PremiumPlasticCard
            user={user}
            qrCodeData={qrCodeData}
            forwardedRef={documentRef}
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col items-center justify-center gap-6">
        <DownloadButton
          templateRef={documentRef}
          fileName={`${user?.lastName || "NIN"}-Premium-ID`}
          slipType="plastic"
        />
        
        <div className="flex items-center gap-4 text-slate-400">
           <div className="h-px w-8 bg-slate-200" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em]">
             Standard ID-1 Size (85.6mm x 53.98mm)
           </p>
           <div className="h-px w-8 bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
