"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function WalletPage() {
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

  const fundingHistory = [
    { id: 1, amount: "₦5,000", date: "Feb 18, 2026", status: "Completed" },
    { id: 2, amount: "₦10,000", date: "Feb 15, 2026", status: "Completed" },
    { id: 3, amount: "₦2,500", date: "Feb 10, 2026", status: "Completed" },
    { id: 4, amount: "₦7,500", date: "Feb 5, 2026", status: "Completed" },
  ];

  return (
    <div className="min-h-[85vh] px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Wallet
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your account balance and funding history
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              Current Balance
            </h2>
            <p className="text-4xl font-bold mb-6" style={{ color: "#0d6b0d" }}>
              ₦{user.accountBalance?.toFixed(2) || "0.00"}
            </p>
            <button
              className="w-full px-4 py-2 rounded-lg font-medium text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #0d6b0d, #1a8c1a)",
              }}
            >
              Add Funds
            </button>
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
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Account Details
            </h2>
            <div className="space-y-3">
              <div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Account Number
                </p>
                <p
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.accountNumber || "Not set"}
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
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.accountName || "Not set"}
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
                  className="font-medium text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.bankName || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Funding History */}
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
            Funding History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th
                    className="text-left px-4 py-3 text-sm font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Amount
                  </th>
                  <th
                    className="text-left px-4 py-3 text-sm font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Date
                  </th>
                  <th
                    className="text-left px-4 py-3 text-sm font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {fundingHistory.map((fund) => (
                  <tr
                    key={fund.id}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {fund.amount}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {fund.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: "rgba(13, 107, 13, 0.1)",
                          color: "#0d6b0d",
                        }}
                      >
                        {fund.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
