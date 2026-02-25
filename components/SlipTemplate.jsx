"use client";

import { useRef, useState } from "react";
import NinCard from "./NinCard";
import DownloadButton from "./DownloadButton";

export default function SlipTemplate({ userData = {}, serialNumber = "" }) {
  const [slipType, setSlipType] = useState("full");
  const cardRef = useRef(null);

  // Generate QR data based on NIN and tracking ID
  const qrCodeData = userData?.nin || "https://nin-generator.demo";

  return (
    <div className="w-full">
      {/* Type Selector */}
      <div className="mb-6 flex gap-4 items-center">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Slip Type:
        </label>
        <div className="flex gap-3">
          {[
            { value: "full", label: "Full Slip" },
            { value: "premium", label: "Premium Digital" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSlipType(option.value)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm`}
              style={{
                background:
                  slipType === option.value
                    ? "linear-gradient(135deg, #0d6b0d, #1a8c1a)"
                    : "var(--bg-secondary)",
                color:
                  slipType === option.value ? "white" : "var(--text-secondary)",
                border:
                  slipType === option.value
                    ? "none"
                    : "1px solid var(--border-color)",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Container */}
      <div
        className="mb-8 rounded-lg overflow-hidden"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <NinCard
          userData={userData}
          type={slipType}
          serialNumber={serialNumber}
          qrCodeData={qrCodeData}
          forwardedRef={cardRef}
        />
      </div>

      {/* Download Button */}
      <div className="flex justify-end">
        <DownloadButton
          templateRef={cardRef}
          fileName={`NIN-${userData?.nin || "Slip"}`}
          slipType={slipType}
        />
      </div>
    </div>
  );
}
