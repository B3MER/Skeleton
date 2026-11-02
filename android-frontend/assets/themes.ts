import { vars } from 'nativewind';
import { Platform } from 'react-native';

// ==========================================
// 1. Colores Base
// ==========================================
const baseColors = {
    light: {
        background: '0 0% 94%',
        foreground: '0 0% 3.9%',
        card: '0 0% 100%',
        'card-foreground': '0 0% 3.9%',
        popover: '0 0% 100%',
        'popover-foreground': '0 0% 3.9%',
        primary: '341 65% 37%',
        'primary-foreground': '0 0% 98%',
        secondary: '35 34.1% 52.9%',
        'secondary-foreground': '0 0% 98%',
        muted: '0 0% 95.1%',
        'muted-foreground': '0 0% 45.1%',
        accent: '0 0% 96.1%',
        'accent-foreground': '0 0% 9%',
        destructive: '0 84.2% 60.2%',
        'destructive-foreground': '0 0% 98%',
        border: '0 0% 89.8%',
        input: '0 0% 89.8%',
        ring: '35 34.1% 52.9%',
        'chart-1': '12 76% 61%',
        'chart-1-foreground': '12 70% 18%',
        'chart-2': '173 58% 39%',
        'chart-2-foreground': '173 75% 96%',
        'chart-3': '197 37% 24%',
        'chart-3-foreground': '197 65% 96%',
        'chart-4': '43 74% 66%',
        'chart-4-foreground': '43 75% 18%',
        'chart-5': '27 87% 67%',
        'chart-5-foreground': '27 75% 18%',
        neutro: '0 0% 40%',
        'neutro-foreground': '0 0% 98%',
        decline: '356 100% 64%',
        'decline-foreground': '0 0% 98%',
        agree: '146 66% 46%',
        'agree-foreground': '0 0% 98%',
        info: '38 92% 93%',
        'info-foreground': '32 85% 32%',
        pantone: '0 0% 3.9%',
        'pantone-foreground': '0 0% 98%',
        'sidebar-background': '0 0% 98%',
        'sidebar-foreground': '240 5.3% 26.1%',
        'sidebar-primary': '240 5.9% 10%',
        'sidebar-primary-foreground': '0 0% 98%',
        'sidebar-accent': '341 65% 37%',
        'sidebar-accent-foreground': '0 0% 100%',
        'sidebar-border': '220 13% 91%',
        'sidebar-ring': '35 34.1% 52.9%',
        check: '145 73% 93%',
        'check-foreground': '145 80% 15%',
        uncheck: '0 85% 95%',
        'uncheck-foreground': '0 75% 38%',
        day: '48 96% 89%',
        'day-foreground': '28 80% 37%',
        night: '226 100% 94%',
        'night-foreground': '243 75% 59%',
    },
    dark: {
        background: '220 25% 16%',
        foreground: '210 33.3% 95.7%',
        card: '220 25% 20%',
        'card-foreground': '210 33.3% 95.7%',
        popover: '220 25% 24%',
        'popover-foreground': '210 33.3% 95.7%',
        primary: '341 65% 37%',
        'primary-foreground': '0 0% 98%',
        secondary: '35.6 41.7% 54.9%',
        'secondary-foreground': '210 33.3% 95.7%',
        muted: '222 47% 11%',
        'muted-foreground': '213 26.8% 83.9%',
        accent: '224 27.3% 21.6%',
        'accent-foreground': '210 33.3% 95.7%',
        destructive: '0 62.8% 30.6%',
        'destructive-foreground': '210 33.3% 95.7%',
        border: '220 15% 23.5%',
        input: '220 15% 23.5%',
        ring: '35.6 41.7% 54.9%',
        'chart-1': '220 70% 50%',
        'chart-1-foreground': '220 85% 96%',
        'chart-2': '160 60% 45%',
        'chart-2-foreground': '160 85% 96%',
        'chart-3': '30 80% 55%',
        'chart-3-foreground': '30 75% 14%',
        'chart-4': '280 65% 60%',
        'chart-4-foreground': '280 85% 96%',
        'chart-5': '340 75% 55%',
        'chart-5-foreground': '340 85% 96%',
        neutro: '0 0% 100%',
        'neutro-foreground': '0 0% 98%',
        decline: '356 100% 64%',
        'decline-foreground': '0 0% 98%',
        agree: '146 66% 46%',
        'agree-foreground': '0 0% 98%',
        info: '38 55% 18%',
        'info-foreground': '43 90% 72%',
        pantone: '0 0% 3.9%',
        'pantone-foreground': '210 33.3% 95.7%',
        'sidebar-background': '220 48.8% 8.4%',
        'sidebar-foreground': '210 33.3% 95.7%',
        'sidebar-primary': '35.6 41.7% 54.9%',
        'sidebar-primary-foreground': '220 48.8% 8.4%',
        'sidebar-accent': '224 27.3% 21.6%',
        'sidebar-accent-foreground': '210 33.3% 95.7%',
        'sidebar-border': '220 15% 23.5%',
        'sidebar-ring': '35.6 41.7% 54.9%',
        check: '145 50% 18%',
        'check-foreground': '145 75% 75%',
        uncheck: '0 50% 18%',
        'uncheck-foreground': '0 80% 75%',
        day: '38 60% 18%',
        'day-foreground': '43 96% 70%',
        night: '234 55% 20%',
        'night-foreground': '230 94% 78%',
    }
};

// ==========================================
// 2. AUTO-GENERAR COLORES PARA ÍCONOS (rawColors)
// ==========================================
const generateRawColors = (colors: Record<string, string>) => {
    const raw: Record<string, string> = {};
    Object.entries(colors).forEach(([key, value]) => {
        raw[key] = `hsl(${value.replace(/ /g, ', ')})`;
    });
    return raw;
};

export const rawColors = {
    light: generateRawColors(baseColors.light),
    dark: generateRawColors(baseColors.dark),
};

// ==========================================
// 3. VARIABLES PARA NATIVEWIND (themes)
// ==========================================
const generateVars = (colors: Record<string, string>) => {
    const cssVars: Record<string, string> = {};
    Object.entries(colors).forEach(([key, value]) => {
        cssVars[`--${key}`] = value;
    });
    return cssVars;
};

export const themes = {
    light: vars(generateVars(baseColors.light)),
    dark: vars(generateVars(baseColors.dark)),
};

// ==========================================
// 4. CSS EN PC (Web)
// ==========================================
export const injectCSSForPC = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
        let style = document.getElementById('nativewind-themes') as HTMLStyleElement;
        if (!style) {
            style = document.createElement('style');
            style.setAttribute('id', 'nativewind-themes');
            document.head.appendChild(style);
        }

        let css = ':root {\n';
        Object.entries(baseColors.light).forEach(([k, v]) => css += `  --${k}: ${v};\n`);
        css += '}\n.dark {\n';
        Object.entries(baseColors.dark).forEach(([k, v]) => css += `  --${k}: ${v};\n`);
        css += '}\n';

        style.textContent = css;
    }
};