"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function TransactionsPage() {
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

  const transactions = [
    {
      id: 1,
      type: "NIN Verification",
      amount: "₦500",
      date: "Feb 20, 2026",
      status: "Completed",
      reference: "TXN-20260220-001",
    },
    {
      id: 2,
      type: "BVN Verification",
      amount: "₦300",
      date: "Feb 19, 2026",
      status: "Completed",
      reference: "TXN-20260219-002",
    },
    {
      id: 3,
      type: "Account Funding",
      amount: "+₦5,000",
      date: "Feb 18, 2026",
      status: "Completed",
      reference: "FND-20260218-003",
    },
    {
      id: 4,
      type: "NIN Verification",
      amount: "₦500",
      date: "Feb 17, 2026",
      status: "Pending",
      reference: "TXN-20260217-004",
    },
    {
      id: 5,
      type: "Account Funding",
      amount: "+₦10,000",
      date: "Feb 15, 2026",
      status: "Completed",
      reference: "FND-20260215-005",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Completed") {
      return { bg: "rgba(13, 107, 13, 0.1)", color: "#0d6b0d" };
    } else if (status === "Pending") {
      return { bg: "rgba(217, 119, 6, 0.1)", color: "#d97706" };
    } else {
      return { bg: "rgba(220, 38, 38, 0.1)", color: "#dc2626" };
    }
  };

  return (
    <div className="min-h-[85vh] px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Transactions
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            View all your account transactions and activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Total Transactions
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: "#0d6b0d" }}>
              5
            </p>
          </div>
          <div
            className="glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Completed
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: "#0d6b0d" }}>
              4
            </p>
          </div>
          <div
            className="glass-card p-6 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Pending
            </p>
            <p className="text-3xl font-bold mt-2" style={{ color: "#d97706" }}>
              1
            </p>
          </div>
        </div>

        {/* Transactions Table */}
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
            Transaction History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th
                    className="text-left px-4 py-3 text-sm font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Type
                  </th>
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
                  <th
                    className="text-left px-4 py-3 text-sm font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => {
                  const statusColors = getStatusColor(txn.status);
                  return (
                    <tr
                      key={txn.id}
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {txn.type}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {txn.amount}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {txn.date}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: statusColors.bg,
                            color: statusColors.color,
                          }}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {txn.reference}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
