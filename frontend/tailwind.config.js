import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                sans: ['Poppins', 'sans-serif'],
            },
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar))',
                    foreground: 'oklch(var(--sidebar-foreground))',
                    primary: 'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent: 'oklch(var(--sidebar-accent))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
                    border: 'oklch(var(--sidebar-border))',
                    ring: 'oklch(var(--sidebar-ring))'
                },
                // Luminique brand colors
                lum: {
                    beige: '#F5E6D6',
                    lavender: '#E8DFF5',
                    purple: '#7B4BB7',
                    violet: '#5B2D91',
                    'soft-lavender': '#BCA6E6',
                    mint: '#7ED1B2',
                    peach: '#EBCBB3',
                    dark: '#111111',
                    muted: '#6B6B8A',
                    gold: '#D4A843',
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                glow: '0 0 20px rgba(123, 75, 183, 0.3)',
                'glow-lg': '0 0 40px rgba(123, 75, 183, 0.4)',
                card: '0 4px 20px rgba(123, 75, 183, 0.1)',
                'card-hover': '0 8px 30px rgba(123, 75, 183, 0.2)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'pulse-glow': {
                    '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 8px rgba(123,75,183,0.4))' },
                    '50%': { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 20px rgba(123,75,183,0.7))' }
                },
                'gentle-sway': {
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%': { transform: 'rotate(2deg)' }
                },
                'float-up': {
                    '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                    '100%': { opacity: '0', transform: 'translateY(-50px) scale(1.2)' }
                },
                'badge-bounce': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '30%': { transform: 'scale(1.4)' },
                    '60%': { transform: 'scale(0.9)' },
                    '80%': { transform: 'scale(1.1)' }
                },
                'toast-in': {
                    from: { transform: 'translateY(-100%)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' }
                },
                'fade-in-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'fade-in-scale': {
                    from: { opacity: '0', transform: 'scale(0.85)' },
                    to: { opacity: '1', transform: 'scale(1)' }
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
                'gentle-sway': 'gentle-sway 2s ease-in-out infinite',
                'float-up': 'float-up 1.5s ease-out forwards',
                'badge-bounce': 'badge-bounce 0.5s ease-out',
                'toast-in': 'toast-in 0.35s ease-out forwards',
                'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
                'fade-in-scale': 'fade-in-scale 0.6s ease-out forwards',
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
