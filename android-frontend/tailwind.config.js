/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./App/**/*.{js,jsx,ts,tsx}",
    ],

    presets: [require("nativewind/preset")],
    safelist: [
        {
            pattern: /(border|border-[trblxy]|bg|text)-(red|blue|green|yellow|orange|purple|gray)-(100|200|300|400|500|600|700|800|900)/,
        },
        {
            pattern: /(border|border-[trblxy]|bg|text)-(background|foreground|border|input|ring|primary|secondary|muted|accent|popover|card|destructive|neutro|decline|agree|info|check|uncheck|day|night|pantone)(-foreground)?(\/(10|20|30|40|50|60|70|80|90))?/,
        },
        {
            pattern: /(border|border-[trblxy]|bg|text)-chart-(1|2|3|4|5)(-foreground)?(\/(10|20|30|40|50|60|70|80|90))?/,
        },
        {
            pattern: /(border|border-[trblxy]|bg|text)-sidebar(-(background|foreground|primary|primary-foreground|accent|accent-foreground|border|ring))?(\/(10|20|30|40|50|60|70|80|90))?/,
        }
    ],

    theme: {
        extend: {
            colors: {
                // Colores Base
                background: "hsl(var(--background) / <alpha-value>)",
                foreground: "hsl(var(--foreground) / <alpha-value>)",

                // Tarjetas y Popovers
                card: {
                    DEFAULT: "hsl(var(--card) / <alpha-value>)",
                    foreground: "hsl(var(--card-foreground) / <alpha-value>)",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover) / <alpha-value>)",
                    foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
                },

                // Colores de Marca / Acción
                primary: {
                    DEFAULT: "hsl(var(--primary) / <alpha-value>)",
                    foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
                    foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted) / <alpha-value>)",
                    foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent) / <alpha-value>)",
                    foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
                    foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
                },

                // UI Elements
                border: "hsl(var(--border) / <alpha-value>)",
                input: "hsl(var(--input) / <alpha-value>)",
                ring: "hsl(var(--ring) / <alpha-value>)",

                // Gráficos (Charts)
                chart: {
                    1: {
                        DEFAULT: "hsl(var(--chart-1) / <alpha-value>)",
                        foreground: "hsl(var(--chart-1-foreground) / <alpha-value>)",
                    },
                    2: {
                        DEFAULT: "hsl(var(--chart-2) / <alpha-value>)",
                        foreground: "hsl(var(--chart-2-foreground) / <alpha-value>)",
                    },
                    3: {
                        DEFAULT: "hsl(var(--chart-3) / <alpha-value>)",
                        foreground: "hsl(var(--chart-3-foreground) / <alpha-value>)",
                    },
                    4: {
                        DEFAULT: "hsl(var(--chart-4) / <alpha-value>)",
                        foreground: "hsl(var(--chart-4-foreground) / <alpha-value>)",
                    },
                    5: {
                        DEFAULT: "hsl(var(--chart-5) / <alpha-value>)",
                        foreground: "hsl(var(--chart-5-foreground) / <alpha-value>)",
                    },
                },

                neutro: {
                    DEFAULT: "hsl(var(--neutro) / <alpha-value>)",
                    foreground: "hsl(var(--neutro-foreground) / <alpha-value>)",
                },
                decline: {
                    DEFAULT: "hsl(var(--decline) / <alpha-value>)",
                    foreground: "hsl(var(--decline-foreground) / <alpha-value>)",
                },
                agree: {
                    DEFAULT: "hsl(var(--agree) / <alpha-value>)",
                    foreground: "hsl(var(--agree-foreground) / <alpha-value>)",
                },
                info: {
                    DEFAULT: "hsl(var(--info) / <alpha-value>)",
                    foreground: "hsl(var(--info-foreground) / <alpha-value>)",
                },
                check: {
                    DEFAULT: "hsl(var(--check) / <alpha-value>)",
                    foreground: "hsl(var(--check-foreground) / <alpha-value>)",
                },
                uncheck: {
                    DEFAULT: "hsl(var(--uncheck) / <alpha-value>)",
                    foreground: "hsl(var(--uncheck-foreground) / <alpha-value>)",
                },
                day: {
                    DEFAULT: "hsl(var(--day) / <alpha-value>)",
                    foreground: "hsl(var(--day-foreground) / <alpha-value>)",
                },
                night: {
                    DEFAULT: "hsl(var(--night) / <alpha-value>)",
                    foreground: "hsl(var(--night-foreground) / <alpha-value>)",
                },
                pantone: {
                    DEFAULT: "hsl(var(--pantone) / <alpha-value>)",
                    foreground: "hsl(var(--pantone-foreground) / <alpha-value>)",
                },

                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background) / <alpha-value>)",
                    background: "hsl(var(--sidebar-background) / <alpha-value>)",
                    foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
                    primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
                    accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
                    border: "hsl(var(--sidebar-border) / <alpha-value>)",
                    ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
                },
            },

            borderRadius: {
                sm: "4px",
                md: "6px",
                lg: "8px",    
                xl: "12px",
                "2xl": "16px",
                "3xl": "24px",
                full: "9999px",
            },
        },
    },
    plugins: [],
};