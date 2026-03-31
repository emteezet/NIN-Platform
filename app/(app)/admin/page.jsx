"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
    Users,
    CreditCard,
    BarChart3,
    Activity,
    ShieldAlert,
    ChevronRight,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    Search
} from "lucide-react";
import { getPlatformStatsAction, getPaginatedGlobalActivityAction } from "@/actions/admin";
import { useNotification } from "@/components/NotificationContext";

export default function AdminDashboardPage() {
    const { showNotification } = useNotification();
    const router = useRouter();
    const { user, loading, isAuthenticated } = useAuth();
    const [stats, setStats] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);

    // Pagination State
    const [activityPage, setActivityPage] = useState(1);
    const [activityData, setActivityData] = useState({ transactions: [], total: 0 });
    const [fetchingActivity, setFetchingActivity] = useState(false);
    const pageSize = 10;

    const fetchStats = async () => {
        setFetching(true);
        const result = await getPlatformStatsAction();
        if (result.success) {
            setStats(result.stats);
            // Initial activity load
            fetchActivity(1);
            if (stats) showNotification("Dashboard statistics updated", "success");
        } else {
            setError(result.error);
            showNotification(result.error, "error");
        }
        setFetching(false);
    };

    const fetchActivity = async (page) => {
        setFetchingActivity(true);
        const result = await getPaginatedGlobalActivityAction(page, pageSize);
        if (result.success) {
            setActivityData({
                transactions: result.transactions,
                total: result.total
            });
            setActivityPage(page);
        } else {
            showNotification(result.error, "error");
        }
        setFetchingActivity(false);
    };

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/auth/login");
        } else if (!loading && isAuthenticated) {
            fetchStats();
        }
    }, [loading, isAuthenticated, user]);

    if (loading || fetching && !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-secondary/30">
                <div className="flex flex-col items-center gap-4">
                    <div className="spinner text-primary-500! w-10! h-10! border-4" />
                    <p className="text-sm font-medium text-text-muted animate-pulse">Initializing Admin Engine...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-secondary/30 p-6">
                <div className="glass-card p-12 max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Access Denied</h1>
                        <p className="text-text-muted mt-2">{error}</p>
                    </div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="btn-primary w-full py-4"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(activityData.total / pageSize);

    return (
        <div className="min-h-screen bg-bg-secondary/30 pb-20">
            {/* Admin Header */}
            <div className="bg-slate-900 pt-24 pb-32 px-6 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="animate-in">
                            <div className="flex items-center gap-2 text-primary-500 text-sm font-bold mb-3 uppercase tracking-widest">
                                <ShieldAlert className="w-4 h-4" />
                                <span>Admin Control Center</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">Platform Overview</h1>
                            <p className="text-white/50 text-lg">System-wide monitoring, revenue metrics, and user activity logs.</p>
                        </div>

                        <button
                            onClick={fetchStats}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-semibold"
                        >
                            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="max-w-7xl mx-auto px-6 -mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Total Users */}
                    <div className="glass-card p-6 border-transparent bg-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +12%
                            </span>
                        </div>
                        <h3 className="text-text-muted text-sm font-medium">Total Registered Users</h3>
                        <p className="text-3xl font-bold text-text-primary mt-1">{stats?.users.toLocaleString()}</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="glass-card p-6 border-transparent bg-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary-50 text-primary-500 rounded-xl">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">LIVE</span>
                        </div>
                        <h3 className="text-text-muted text-sm font-medium">Platform Revenue (Fees)</h3>
                        <p className="text-3xl font-bold text-text-primary mt-1">₦{stats?.revenue.toLocaleString()}</p>
                    </div>

                    {/* Total Funding */}
                    <div className="glass-card p-6 border-transparent bg-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-text-muted italic">Total Volume</span>
                        </div>
                        <h3 className="text-text-muted text-sm font-medium">Total Wallet Funding</h3>
                        <p className="text-3xl font-bold text-text-primary mt-1">₦{stats?.funding.toLocaleString()}</p>
                    </div>

                    {/* Total Transactions */}
                    <div className="glass-card p-6 border-transparent bg-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />)}
                            </div>
                        </div>
                        <h3 className="text-text-muted text-sm font-medium">Total Transactions</h3>
                        <p className="text-3xl font-bold text-text-primary mt-1">{stats?.transactions.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity Feed */}
                    <div className="lg:col-span-2 glass-card overflow-hidden h-fit">
                        <div className="p-6 border-b border-bg-secondary/50 flex items-center justify-between">
                            <h3 className="font-bold text-text-primary flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary-500" />
                                Global Activity Feed
                            </h3>
                            <button className="text-[10px] font-bold text-primary-500 hover:underline">Download CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-bg-secondary/30 text-text-muted text-[10px] uppercase tracking-wider font-bold">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4 text-center">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y divide-bg-secondary/30 transition-opacity duration-200 ${fetchingActivity ? 'opacity-50' : 'opacity-100'}`}>
                                    {activityData.transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-text-primary">
                                                        {tx.wallet?.user?.first_name
                                                            ? `${tx.wallet.user.first_name} ${tx.wallet.user.last_name}`
                                                            : "Unknown User"}
                                                    </span>
                                                    <span className="text-[10px] text-text-muted">{tx.wallet?.user?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${tx.type === 'FUNDING' ? "bg-primary-50 text-primary-600" : "bg-blue-50 text-blue-600"
                                                    }`}>
                                                    {tx.type === 'FUNDING' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                                    {tx.type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-sm font-bold ${tx.type === 'FUNDING' ? 'text-primary-600' : 'text-text-primary'}`}>
                                                    {tx.type === 'FUNDING' ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-[10px] text-text-muted text-center">
                                                    {tx.reference?.slice(0, 12) || "---"}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-6 border-t border-bg-secondary/50 flex items-center justify-between bg-bg-secondary/10">
                            <p className="text-xs text-text-muted">
                                Showing <span className="font-bold text-text-primary">{(activityPage - 1) * pageSize + 1}</span> to <span className="font-bold text-text-primary">{Math.min(activityPage * pageSize, activityData.total)}</span> of <span className="font-bold text-text-primary">{activityData.total}</span> entries
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchActivity(activityPage - 1)}
                                    disabled={activityPage === 1 || fetchingActivity}
                                    className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => fetchActivity(pageNum)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                                    activityPage === pageNum ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' : 'hover:bg-slate-100 text-text-muted'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 5 && <span className="text-xs text-text-muted px-2">...</span>}
                                </div>
                                <button
                                    onClick={() => fetchActivity(activityPage + 1)}
                                    disabled={activityPage >= totalPages || fetchingActivity}
                                    className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* System Health / Logs */}
                    <div className="space-y-8">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-primary-500" />
                                Security Overrides
                            </h3>
                            <div className="space-y-4">
                                <button 
                                    onClick={() => router.push("/admin/users")}
                                    className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-between group hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20"
                                >
                                    Manage Registry Users
                                    <Users className="w-4 h-4 text-white/70 group-hover:scale-110 transition-transform" />
                                </button>                                
                            </div>
                        </div>

                        <div className="glass-card p-8 bg-slate-900 text-white border-transparent">
                            <h4 className="font-bold text-sm mb-2 text-primary-500">Admin Tip</h4>
                            <p className="text-xs text-white/60 leading-relaxed">
                                All platform-level transactions are ACID compliant. Revenue figures shown are calculated directly from the transaction history.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
