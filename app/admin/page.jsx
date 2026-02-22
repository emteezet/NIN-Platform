'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Data
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const [activeTab, setActiveTab] = useState('users');

    // Add user form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        nin: '', phone: '', firstName: '', lastName: '', middleName: '',
        dob: '', gender: 'Male', state: '', lga: '',
    });
    const [addError, setAddError] = useState('');
    const [addSuccess, setAddSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                setAuthenticated(true);
                fetchData();
            } else {
                setAuthError('Invalid password.');
            }
        } catch {
            setAuthError('Connection error.');
        } finally {
            setAuthLoading(false);
        }
    };

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const [usersRes, statsRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/stats'),
            ]);
            const usersData = await usersRes.json();
            const statsData = await statsRes.json();

            if (usersData.success) setUsers(usersData.users);
            if (statsData.success) setStats(statsData.stats);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoadingData(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers((prev) => prev.filter((u) => u.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddError('');
        setAddSuccess('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            const data = await res.json();

            if (res.ok) {
                setAddSuccess(`User ${data.user.firstName} ${data.user.lastName} added successfully!`);
                setNewUser({
                    nin: '', phone: '', firstName: '', lastName: '', middleName: '',
                    dob: '', gender: 'Male', state: '', lga: '',
                });
                fetchData();
                setTimeout(() => setAddSuccess(''), 3000);
            } else {
                setAddError(data.error || 'Failed to add user.');
            }
        } catch {
            setAddError('Network error.');
        }
    };

    // ── Login Screen ──
    if (!authenticated) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="glass-card p-8 max-w-sm w-full animate-in">
                    <div className="text-center mb-6">
                        <div
                            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #0d6b0d, #1a8c1a)' }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                        </div>
                        <h2
                            className="text-xl font-bold"
                            style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
                        >
                            Admin Panel
                        </h2>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                            Enter password to continue
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin password"
                            className="input-field mb-3"
                            autoFocus
                        />
                        {authError && (
                            <p className="text-sm text-red-500 mb-3">{authError}</p>
                        )}
                        <button type="submit" className="btn-primary w-full" disabled={authLoading}>
                            {authLoading ? 'Authenticating...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── Admin Dashboard ──
    return (
        <div className="min-h-[80vh] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1
                            className="text-2xl font-bold"
                            style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
                        >
                            Admin Dashboard
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                            Manage users and view statistics
                        </p>
                    </div>
                    <button
                        onClick={() => setAuthenticated(false)}
                        className="btn-secondary text-sm"
                    >
                        Logout
                    </button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
                        <StatCard label="Total Slips" value={stats.totalSlips} icon="📄" />
                        <StatCard label="Top Generator" value={stats.topUsers?.[0]?.count || 0} icon="🏆" />
                        <StatCard label="Recent (10)" value={stats.recentSlips?.length || 0} icon="🕐" />
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                    {['users', 'slips', 'add'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all capitalize"
                            style={{
                                backgroundColor: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                                boxShadow: activeTab === tab ? 'var(--shadow-card)' : 'none',
                            }}
                        >
                            {tab === 'add' ? '+ Add User' : tab}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loadingData && (
                    <div className="text-center py-12">
                        <div
                            className="spinner mx-auto"
                            style={{ borderTopColor: 'var(--accent-green)', borderColor: 'var(--border-color)', width: '32px', height: '32px' }}
                        />
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && !loadingData && (
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>Name</th>
                                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>NIN</th>
                                        <th className="text-left px-4 py-3 font-semibold hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>Phone</th>
                                        <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>State</th>
                                        <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>Gender</th>
                                        <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-t transition-colors"
                                            style={{ borderColor: 'var(--border-color)' }}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #0d6b0d, #1a8c1a)' }}>
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--accent-green)' }}>{user.nin}</td>
                                            <td className="px-4 py-3 hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{user.phone}</td>
                                            <td className="px-4 py-3 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{user.state}</td>
                                            <td className="px-4 py-3 hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{user.gender}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                                                    style={{
                                                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                                        color: '#ef4444',
                                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && (
                                <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                                    No users found.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Slips Tab */}
                {activeTab === 'slips' && !loadingData && stats && (
                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Recent Slip Generations
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>NIN</th>
                                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>Serial Number</th>
                                        <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>Generated At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentSlips.map((slip, i) => (
                                        <tr key={i} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                                            <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--accent-green)' }}>{slip.nin}</td>
                                            <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{slip.serialNumber}</td>
                                            <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                {new Date(slip.generatedAt).toLocaleDateString('en-NG', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {stats.recentSlips.length === 0 && (
                                <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                                    No slips generated yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Add User Tab */}
                {activeTab === 'add' && (
                    <div className="glass-card p-6 max-w-2xl">
                        <h3
                            className="text-lg font-bold mb-6"
                            style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
                        >
                            Add Mock User
                        </h3>

                        {addSuccess && (
                            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(13, 107, 13, 0.08)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)' }}>
                                ✓ {addSuccess}
                            </div>
                        )}
                        {addError && (
                            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444' }}>
                                {addError}
                            </div>
                        )}

                        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="NIN (11 digits)" value={newUser.nin} onChange={(v) => setNewUser({ ...newUser, nin: v })} maxLength={11} required />
                            <FormField label="Phone" value={newUser.phone} onChange={(v) => setNewUser({ ...newUser, phone: v })} placeholder="08012345678" required />
                            <FormField label="First Name" value={newUser.firstName} onChange={(v) => setNewUser({ ...newUser, firstName: v })} required />
                            <FormField label="Last Name" value={newUser.lastName} onChange={(v) => setNewUser({ ...newUser, lastName: v })} required />
                            <FormField label="Middle Name" value={newUser.middleName} onChange={(v) => setNewUser({ ...newUser, middleName: v })} />
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Date of Birth *</label>
                                <input
                                    type="date"
                                    value={newUser.dob}
                                    onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Gender *</label>
                                <select
                                    value={newUser.gender}
                                    onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                                    className="input-field"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <FormField label="State" value={newUser.state} onChange={(v) => setNewUser({ ...newUser, state: v })} required />
                            <FormField label="LGA" value={newUser.lga} onChange={(v) => setNewUser({ ...newUser, lga: v })} required />

                            <div className="md:col-span-2 mt-2">
                                <button type="submit" className="btn-primary">
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                {value}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
        </div>
    );
}

function FormField({ label, value, onChange, required, maxLength, placeholder }) {
    return (
        <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                {label} {required && '*'}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-field"
                required={required}
                maxLength={maxLength}
                placeholder={placeholder}
            />
        </div>
    );
}
