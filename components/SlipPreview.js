'use client';

export default function SlipPreview({ user, qrCode, serialNumber, generatedAt }) {
    if (!user) return null;

    const fullName = [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .toUpperCase();

    const dob = new Date(user.dob).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const issueDate = new Date(generatedAt).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="glass-card overflow-hidden animate-in animate-delay-1" style={{ maxWidth: '580px' }}>
            {/* Green Header */}
            <div
                className="px-6 py-4 text-center"
                style={{ background: 'linear-gradient(135deg, #0d6b0d, #095209)' }}
            >
                <h3 className="text-white font-bold text-base tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    FEDERAL REPUBLIC OF NIGERIA
                </h3>
                <p className="text-green-200 text-xs mt-1 tracking-wider">
                    NATIONAL IDENTIFICATION NUMBER
                </p>
            </div>

            {/* Body */}
            <div className="p-6">
                <div className="flex gap-5">
                    {/* Photo */}
                    <div
                        className="flex-shrink-0 w-24 h-28 rounded-lg border-2 flex items-center justify-center overflow-hidden"
                        style={{ borderColor: 'var(--accent-green)', backgroundColor: 'var(--bg-secondary)' }}
                    >
                        {user.photo && user.photo !== '/uploads/default-avatar.png' ? (
                            <img src={user.photo} alt="Passport" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    style={{ color: 'var(--text-muted)' }}
                                    className="mx-auto"
                                >
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>
                                    Photo
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-3">
                            <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                            <p className="font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                                {fullName}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs" style={{ color: 'var(--text-muted)' }}>NIN</label>
                            <p className="font-bold text-xl tracking-wider" style={{ color: 'var(--accent-green)' }}>
                                {user.nin}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <DetailItem label="Date of Birth" value={dob} />
                    <DetailItem label="Gender" value={user.gender} />
                    <DetailItem label="State of Origin" value={user.state} />
                    <DetailItem label="Local Govt. Area" value={user.lga} />
                    <DetailItem label="Issue Date" value={issueDate} />
                    <DetailItem label="Serial No." value={serialNumber} />
                </div>

                {/* QR Section */}
                {qrCode && (
                    <div className="mt-5 pt-5 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                        <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Verification QR
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                Scan to verify this slip
                            </p>
                        </div>
                        <img src={qrCode} alt="QR Code" className="w-20 h-20 rounded-lg" />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    School Project Simulation — Not affiliated with NIMC
                </p>
            </div>
        </div>
    );
}

function DetailItem({ label, value }) {
    return (
        <div>
            <label className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</label>
            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {value || '—'}
            </p>
        </div>
    );
}
