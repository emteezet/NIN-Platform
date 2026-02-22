'use client';

export default function CardPreview({ user, qrCode, serialNumber, generatedAt }) {
    if (!user) return null;

    const fullName = [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .toUpperCase();

    const issueDate = new Date(generatedAt).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="animate-in animate-delay-2">
            <h3
                className="text-sm font-semibold mb-3 flex items-center gap-2"
                style={{ color: 'var(--text-secondary)' }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                </svg>
                Plastic ID Card Preview
                <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                    (hover to flip)
                </span>
            </h3>

            <div className="id-card mx-auto sm:mx-0">
                <div className="id-card-inner">
                    {/* Front */}
                    <div className="id-card-front">
                        {/* Top stripe */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20" />

                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-[10px] text-green-200 tracking-widest">FEDERAL REPUBLIC OF NIGERIA</p>
                                <p className="text-xs font-bold tracking-wider">NATIONAL ID CARD</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-xs font-bold">🇳🇬</span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex gap-3 mt-2">
                            {/* Photo */}
                            <div className="w-16 h-20 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20 overflow-hidden">
                                {user.photo && user.photo !== '/uploads/default-avatar.png' ? (
                                    <img src={user.photo} alt="Photo" className="w-full h-full object-cover" />
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] text-green-300 uppercase">Name</p>
                                <p className="font-bold text-xs leading-tight truncate">{fullName}</p>

                                <p className="text-[9px] text-green-300 uppercase mt-2">NIN</p>
                                <p className="font-bold text-sm tracking-widest">{user.nin}</p>

                                <div className="flex gap-4 mt-2">
                                    <div>
                                        <p className="text-[9px] text-green-300">DOB</p>
                                        <p className="text-[10px] font-medium">
                                            {new Date(user.dob).toLocaleDateString('en-NG', { year: '2-digit', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-green-300">SEX</p>
                                        <p className="text-[10px] font-medium">{user.gender?.charAt(0)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR in corner */}
                        {qrCode && (
                            <div className="absolute bottom-3 right-3">
                                <img src={qrCode} alt="QR" className="w-10 h-10 rounded" style={{ filter: 'brightness(1.2)' }} />
                            </div>
                        )}

                        {/* Bottom stripe */}
                        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, #fff, #0d6b0d, #fff)' }} />
                    </div>

                    {/* Back */}
                    <div className="id-card-back">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20" />

                        <h4 className="text-[10px] tracking-widest text-green-300 mb-4">CARD INFORMATION</h4>

                        <div className="space-y-3">
                            <div>
                                <p className="text-[9px] text-green-300">Issue Date</p>
                                <p className="text-xs font-medium">{issueDate}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-green-300">Serial Number</p>
                                <p className="text-xs font-mono font-medium tracking-wider">{serialNumber}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-green-300">State</p>
                                <p className="text-xs font-medium">{user.state}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-green-300">LGA</p>
                                <p className="text-xs font-medium">{user.lga}</p>
                            </div>
                        </div>

                        <div className="absolute bottom-3 left-5 right-5">
                            <p className="text-[7px] text-green-400/60 text-center leading-relaxed">
                                School project simulation. Not a valid government document.
                            </p>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, #fff, #0d6b0d, #fff)' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
