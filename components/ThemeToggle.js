'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            style={{
                background: isDark
                    ? 'linear-gradient(135deg, #1e293b, #334155)'
                    : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <span
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 text-sm"
                style={{
                    transform: isDark ? 'translateX(28px)' : 'translateX(0)',
                }}
            >
                {isDark ? '🌙' : '☀️'}
            </span>
        </button>
    );
}
