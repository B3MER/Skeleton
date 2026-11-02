import React from 'react';
import { rawColors } from '@/assets/themes';
import { useThemeStore } from '@/App/store/useTheme';
import { LucideProps } from 'lucide-react-native';

interface IconProps {
  name: React.ComponentType<LucideProps>|string; 
  colorClass?: string;
  size?: number;
  [key: string]: any; 
}

const Icon = ({ name: LucideIcon, colorClass = "foreground", size = 24, ...props }: IconProps) => {
    const isDark = useThemeStore((state) => state.isDark);
    const currentTheme = isDark ? 'dark' : 'light';
    const themeColors: any = rawColors[currentTheme];

    const stripped = colorClass?.replace(/^(text|bg|border)-/, '') || 'foreground';
    const [baseColor, alphaStr] = stripped.split('/');
    const baseHsl = themeColors?.[baseColor];

    let exactColor: string;
    if (baseHsl) {
        if (alphaStr && !isNaN(Number(alphaStr))) {
            const alpha = Number(alphaStr) / 100;
            exactColor = baseHsl.replace(/^hsl\((.*)\)$/, `hsla($1, ${alpha})`);
        } else {
            exactColor = baseHsl;
        }
    } else if (
        stripped === 'white' ||
        stripped === 'black' ||
        stripped === 'transparent' ||
        stripped.startsWith('#') ||
        stripped.startsWith('rgb') ||
        stripped.startsWith('hsl')
    ) {
        exactColor = stripped;
    } else {
        exactColor = themeColors?.foreground;
    }

    return <LucideIcon color={exactColor} size={size} {...props} />;
};

export default Icon;