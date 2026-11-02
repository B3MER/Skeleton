import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LucideProps } from 'lucide-react-native';
import Icon from './Icon';

export type BadgeVariant =
    | 'info'
    | 'check'
    | 'uncheck'
    | 'day'
    | 'night'
    | 'chart-1'
    | 'chart-2'
    | 'chart-3'
    | 'chart-4'
    | 'chart-5'
    | 'muted'
    | 'primary'
    | 'secondary'
    | 'agree'
    | 'decline'
    | 'destructive'
    | 'neutro';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps {
    label?: React.ReactNode;
    icon?: React.ComponentType<LucideProps> | string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    onPress?: () => void;
}

const VARIANT_CONFIG: Record<
    BadgeVariant,
    { bg: string; border: string; text: string; icon: string }
> = {
    info: {
        bg: 'bg-info',
        border: 'border-info-foreground',
        text: 'text-info-foreground',
        icon: 'info-foreground',
    },
    check: {
        bg: 'bg-check',
        border: 'border-check-foreground',
        text: 'text-check-foreground',
        icon: 'check-foreground',
    },
    uncheck: {
        bg: 'bg-uncheck',
        border: 'border-uncheck-foreground',
        text: 'text-uncheck-foreground',
        icon: 'uncheck-foreground',
    },
    day: {
        bg: 'bg-day',
        border: 'border-day-foreground',
        text: 'text-day-foreground',
        icon: 'day-foreground',
    },
    night: {
        bg: 'bg-night',
        border: 'border-night-foreground',
        text: 'text-night-foreground',
        icon: 'night-foreground',
    },
    'chart-1': {
        bg: 'bg-chart-1',
        border: 'border-chart-1-foreground',
        text: 'text-chart-1-foreground',
        icon: 'chart-1-foreground',
    },
    'chart-2': {
        bg: 'bg-chart-2',
        border: 'border-chart-2-foreground',
        text: 'text-chart-2-foreground',
        icon: 'chart-2-foreground',
    },
    'chart-3': {
        bg: 'bg-chart-3',
        border: 'border-chart-3-foreground',
        text: 'text-chart-3-foreground',
        icon: 'chart-3-foreground',
    },
    'chart-4': {
        bg: 'bg-chart-4',
        border: 'border-chart-4-foreground',
        text: 'text-chart-4-foreground',
        icon: 'chart-4-foreground',
    },
    'chart-5': {
        bg: 'bg-chart-5',
        border: 'border-chart-5-foreground',
        text: 'text-chart-5-foreground',
        icon: 'chart-5-foreground',
    },
    muted: {
        bg: 'bg-muted',
        border: 'border-border',
        text: 'text-muted-foreground',
        icon: 'muted-foreground',
    },
    primary: {
        bg: 'bg-primary',
        border: 'border-primary',
        text: 'text-primary-foreground',
        icon: 'primary-foreground',
    },
    secondary: {
        bg: 'bg-secondary',
        border: 'border-border',
        text: 'text-secondary-foreground',
        icon: 'secondary-foreground',
    },
    agree: {
        bg: 'bg-agree',
        border: 'border-agree',
        text: 'text-agree-foreground',
        icon: 'agree-foreground',
    },
    decline: {
        bg: 'bg-decline',
        border: 'border-decline',
        text: 'text-decline-foreground',
        icon: 'decline-foreground',
    },
    destructive: {
        bg: 'bg-destructive',
        border: 'border-destructive',
        text: 'text-destructive-foreground',
        icon: 'destructive-foreground',
    },
    neutro: {
        bg: 'bg-neutro',
        border: 'border-neutro',
        text: 'text-neutro-foreground',
        icon: 'neutro-foreground',
    },
};

const SIZE_CONFIG: Record<
    BadgeSize,
    { padding: string; text: string; icon: number; gap: string }
> = {
    xs: {
        padding: 'px-1.5 py-0.5',
        text: 'text-[10px] font-semibold',
        icon: 10,
        gap: 'ml-1',
    },
    sm: {
        padding: 'px-2 py-0.5',
        text: 'text-[11px] font-semibold',
        icon: 11,
        gap: 'ml-1',
    },
    md: {
        padding: 'px-2.5 py-1',
        text: 'text-xs font-bold',
        icon: 14,
        gap: 'ml-1.5',
    },
    lg: {
        padding: 'px-3 py-1.5',
        text: 'text-sm font-bold',
        icon: 16,
        gap: 'ml-1.5',
    },
};

export default function Badge({
    label,
    icon,
    variant = 'info',
    size = 'sm',
    onPress,
}: BadgeProps) {
    const variantStyle = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;
    const sizeStyle = SIZE_CONFIG[size] || SIZE_CONFIG.sm;

    const containerClass = `flex-row items-center self-start rounded-md border ${sizeStyle.padding} ${variantStyle.bg} ${variantStyle.border}`;

    const badgeBody = (
        <>
            {icon && (
                <Icon name={icon} size={sizeStyle.icon} colorClass={variantStyle.icon} />
            )}
            {typeof label === 'string' || typeof label === 'number' ? (
                <Text
                    className={`${sizeStyle.text} ${variantStyle.text} ${icon ? sizeStyle.gap : ''}`.trim()}
                    numberOfLines={1}
                >
                    {label}
                </Text>
            ) : (
                label
            )}
        </>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                className={`${containerClass} active:opacity-70`}
            >
                {badgeBody}
            </Pressable>
        );
    }

    return <View className={containerClass}>{badgeBody}</View>;
}
