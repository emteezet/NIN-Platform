/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef7ee',
                    100: '#d5ecd5',
                    200: '#a8d9a8',
                    300: '#6fbf6f',
                    400: '#3da33d',
                    500: '#1a8c1a',
                    600: '#0d6b0d',
                    700: '#095209',
                    800: '#063d06',
                    900: '#032903',
                },
                accent: {
                    50: '#f0f7ff',
                    100: '#dceeff',
                    200: '#b3daff',
                    300: '#80c0ff',
                    400: '#4da6ff',
                    500: '#1a8cff',
                    600: '#0070e0',
                    700: '#0055aa',
                    800: '#003d7a',
                    900: '#00264d',
                },
                surface: {
                    light: '#ffffff',
                    dark: '#0f172a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 8px 40px rgba(0, 0, 0, 0.12)',
                'glow': '0 0 40px rgba(26, 140, 26, 0.15)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'flip': 'flip 0.6s ease-in-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                flip: {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(180deg)' },
                },
            },
        },
    },
    plugins: [],
};
