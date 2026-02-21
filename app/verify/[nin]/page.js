"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slipType = searchParams.get("slipType") || "improved";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const res = await fetch(`/api/verify/${params.nin}`);
        const json = await res.json();

        if (!res.ok) {
          setError(json.error || "Verification failed.");
          setLoading(false);
          return;
        }

        setData(json);
      } catch (err) {
        setError("Network error during verification.");
      } finally {
        setLoading(false);
      }
    };

    if (params.nin) {
      fetchVerification();
    }
  }, [params.nin]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div
            className="spinner mx-auto mb-4"
            style={{
              borderTopColor: "var(--accent-green)",
              borderColor: "var(--border-color)",
              width: "40px",
              height: "40px",
            }}
          />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Verifying NIN...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{
              color: "var(--text-primary)",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Verification Failed
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  const user = data.user;
  const fullName = [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ");

  const dob = new Date(user.dob).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generatedDate = data.lastGenerated
    ? new Date(data.lastGenerated).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Status */}
        <div className="text-center mb-8 animate-in">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #d5ecd5, #eef7ee)" }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0d6b0d"
              strokeWidth="2.5"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="badge-valid mx-auto mb-3">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            VALID
          </div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Identity Verified
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            NIN: {params.nin}
          </p>
        </div>

        {/* Details Card */}
        <div className="glass-card overflow-hidden animate-in animate-delay-1">
          {/* Green bar */}
          <div
            className="h-1.5"
            style={{
              background: "linear-gradient(90deg, #0d6b0d, #1a8c1a, #0d6b0d)",
            }}
          />

          <div className="p-6">
            {/* Photo + Name */}
            <div
              className="flex items-center gap-4 mb-6 pb-6 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div
                className="w-16 h-16 rounded-xl border-2 flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{
                  borderColor: "var(--accent-green)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                {user.photo && user.photo !== "/uploads/default-avatar.png" ? (
                  <img
                    src={user.photo}
                    alt="Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {fullName}
                </h2>
                <p
                  className="text-sm font-mono"
                  style={{ color: "var(--accent-green)" }}
                >
                  {user.nin}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div
              className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <VerifyField label="Date of Birth" value={dob} />
              <VerifyField label="Gender" value={user.gender} />
              <VerifyField label="State" value={user.state} />
              <VerifyField label="LGA" value={user.lga} />
              <VerifyField label="Last Generated" value={generatedDate} />
              <VerifyField
                label="Serial No."
                value={data.serialNumber || "—"}
              />
            </div>

            {/* Slip Type */}
            <div
              className="mb-6 pb-6 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p
                className="text-xs mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Selected Slip Type
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {slipType === "improved"
                  ? "Improved NIN Slip"
                  : slipType === "premium"
                    ? "Premium Slip"
                    : "NIN Regular Slip"}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-3"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <p
              className="text-xs text-center"
              style={{ color: "var(--text-muted)" }}
            >
              Verified on{" "}
              {new Date().toLocaleDateString("en-NG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              — School Project Simulation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifyField({ label, value }) {
  return (
    <div>
      <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p
        className="text-sm font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {value || "—"}
      </p>
    </div>
  );
}
