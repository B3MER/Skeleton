import React from 'react';
import { View, Text } from 'react-native';
import Badge, { type BadgeVariant } from '../layout/Badge';
import { formatField } from '@/App/helpers';

export interface RowProps {
    label: string;
    value?: string | number | null;
    badge?: BadgeVariant;
    isLast?: boolean;
    children?: React.ReactNode;
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
}

export default function Row({
    label,
    value,
    badge,
    isLast = false,
    children,
    className = '',
    labelClassName = '',
    valueClassName = '',
}: RowProps) {
    const formattedValue = formatField(value, 'N/A');

    return (
        <View
            className={`flex-row justify-between items-center px-4 py-3 ${
                !isLast ? 'border-b border-border/60' : ''
            } ${className}`}
        >
            <Text className={`text-xs font-medium text-muted-foreground mr-3 shrink-0 ${labelClassName}`}>
                {label}
            </Text>

            <View className="flex-1 flex-row justify-end items-center">
                {children ? (
                    children
                ) : badge ? (
                    <Badge label={formattedValue} variant={badge} />
                ) : (
                    <Text className={`text-sm font-semibold text-foreground text-right ${valueClassName}`}>
                        {formattedValue}
                    </Text>
                )}
            </View>
        </View>
    );
}
