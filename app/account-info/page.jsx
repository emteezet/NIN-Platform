"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function AccountInfoPage() {
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
            Account Information
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your profile and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div
            className="md:col-span-2 glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Profile Information
            </h2>
            <div className="space-y-6">
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Email Address
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
                  className="text-sm mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  First Name
                </p>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.firstName || "Not provided"}
                </p>
              </div>
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Last Name
                </p>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.lastName || "Not provided"}
                </p>
              </div>
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Phone Number
                </p>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.phone || "Not provided"}
                </p>
              </div>
              <div>
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  National Identification Number
                </p>
                <p
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.nin || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Details Card */}
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
              Account Details
            </h2>
            <div className="space-y-4">
              <div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Account Number
                </p>
                <p
                  className="font-medium mt-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.accountNumber || "Not provided"}
                </p>
              </div>
              <div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Account Name
                </p>
                <p
                  className="font-medium mt-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.accountName || "Not provided"}
                </p>
              </div>
              <div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Bank Name
                </p>
                <p
                  className="font-medium mt-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.bankName || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Settings */}
          <div
            className="glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Security Settings
            </h3>
            <div className="space-y-3">
              <button
                className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--bg-secondary)",
                }}
              >
                Change Password
              </button>
              <button
                className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--bg-secondary)",
                }}
              >
                Two-Factor Authentication
              </button>
              <button
                className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--bg-secondary)",
                }}
              >
                Active Sessions
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div
            className="glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Notification Preferences
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span style={{ color: "var(--text-secondary)" }}>
                  Email Notifications
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span style={{ color: "var(--text-secondary)" }}>
                  Transaction Alerts
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span style={{ color: "var(--text-secondary)" }}>
                  Marketing Updates
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
