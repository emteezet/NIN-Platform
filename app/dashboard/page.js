"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{
            borderColor: "var(--border-color)",
            borderTopColor: "#0d6b0d",
          }}
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[85vh] px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Welcome, {user.firstName || user.email}!
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your account and access our services
          </p>
        </div>

        {/* Account Information Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <div
            className="glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Profile Information
            </h2>
            <div className="space-y-3">
              <div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Email
                </p>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.email}
                </p>
              </div>
              <div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Name
                </p>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "Not set"}
                </p>
              </div>
              <div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Member Since
                </p>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Account Balance Card */}
          <div
            className="glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Account Balance
            </h2>
            <div className="flex items-end justify-between">
              <div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Current Balance
                </p>
                <p className="text-4xl font-bold" style={{ color: "#0d6b0d" }}>
                  ₦{user.accountBalance?.toFixed(2) || "0.00"}
                </p>
              </div>
              <button
                className="px-4 py-2 rounded-lg font-medium text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #0d6b0d, #1a8c1a)",
                }}
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Verify NIN */}
            <Link
              href="/verify"
              className="glass-card p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{
                    background: "linear-gradient(135deg, #0d6b0d, #1a8c1a)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M20.84 4.61a2.5 2.5 0 0 0-3.54 0l-5.83 5.83a2.5 2.5 0 0 0 0 3.54" />
                  </svg>
                </div>
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Verify NIN
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Verify and retrieve NIN information
                  </p>
                </div>
              </div>
            </Link>

            {/* Verify BVN */}
            <Link
              href="/verify-bvn"
              className="glass-card p-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{
                    background: "linear-gradient(135deg, #0d6b0d, #1a8c1a)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    <path d="M16 11h4m0 0h4m-4-4v4m0 4v4" />
                  </svg>
                </div>
                <div>
                  <h3
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Verify BVN
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Verify Bank Verification Number
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div
          className="glass-card p-6 rounded-xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <h2
            className="text-xl font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Account Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Total Transactions
              </p>
              <p className="text-3xl font-bold" style={{ color: "#0d6b0d" }}>
                0
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                NIN Slips Generated
              </p>
              <p className="text-3xl font-bold" style={{ color: "#0d6b0d" }}>
                0
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Verifications
              </p>
              <p className="text-3xl font-bold" style={{ color: "#0d6b0d" }}>
                0
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Account Age
              </p>
              <p className="text-3xl font-bold" style={{ color: "#0d6b0d" }}>
                0 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
