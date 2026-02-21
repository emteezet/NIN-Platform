"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyNINPage() {
  const router = useRouter();
  const [nin, setNin] = useState("");
  const [slipType, setSlipType] = useState("improved");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  const handleNinChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setNin(value);
    setError("");
  };

  const handleVerify = (e) => {
    e.preventDefault();

    if (!nin) {
      setError("Please enter your NIN");
      return;
    }

    if (nin.length !== 11) {
      setError("NIN must be exactly 11 digits");
      return;
    }

    if (!slipType) {
      setError("Please select a slip type");
      return;
    }

    if (!consent) {
      setError("Please accept the terms and conditions");
      return;
    }

    // Navigate to verification result page with slip type as query parameter
    router.push(`/verify/${nin}?slipType=${slipType}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-white mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, #0d6b0d, #1a8c1a)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M20.84 4.61a2.5 2.5 0 0 0-3.54 0l-5.83 5.83a2.5 2.5 0 0 0 0 3.54" />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Verify NIN
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Enter your 11-digit National Identification Number and select your
            preferred slip type
          </p>
        </div>

        <div
          className="glass-card p-6 rounded-xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <form onSubmit={handleVerify} className="space-y-4">
            {/* NIN Input */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                NIN Number
              </label>
              <input
                type="text"
                value={nin}
                onChange={handleNinChange}
                placeholder="11-digit NIN"
                maxLength="11"
                className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  "--tw-ring-color": "#0d6b0d",
                }}
              />
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {nin.length}/11 digits
              </p>
            </div>

            {/* Slip Type Select */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Select Preferred Slip
              </label>
              <select
                value={slipType}
                onChange={(e) => setSlipType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  "--tw-ring-color": "#0d6b0d",
                }}
              >
                <option value="improved">Improved NIN Slip</option>
                <option value="premium">Premium Slip</option>
                <option value="regular">NIN Regular Slip</option>
              </select>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  setError("");
                }}
                className="mt-1 w-4 h-4 rounded cursor-pointer"
                style={{
                  accentColor: "#0d6b0d",
                }}
              />
              <label
                htmlFor="consent"
                className="text-sm cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                I hereby give consent for my NIN information to be verified and
                processed according to the privacy policy
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#dc2626",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-medium text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #0d6b0d, #1a8c1a)",
              }}
            >
              Verify NIN
            </button>
          </form>
        </div>

        <div
          className="mt-6 p-4 rounded-lg"
          style={{ background: "rgba(13, 107, 13, 0.05)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            💡 <span className="font-medium">Tip:</span> Your NIN is an 11-digit
            unique identifier issued by NIMC. Choose your preferred slip format
            for verification.
          </p>
        </div>
      </div>
    </div>
  );
}
