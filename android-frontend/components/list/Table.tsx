import React from 'react';
import { View, Text } from 'react-native';
import Icon from '../layout/Icon';

export interface TableProps {
    title?: string;
    icon?: any;
    active?: boolean;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
}

export default function Table({
    title,
    icon,
    active,
    children,
    className = '',
    headerClassName = '',
}: TableProps) {
    const hasActiveDot = typeof active === 'boolean';

    return (
        <View className={`bg-card border border-border rounded-2xl overflow-hidden mb-4 ${className}`}>
            {title && (
                <View className={`flex-row items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border ${headerClassName}`}>
                    <View className="flex-row items-center flex-1 pr-2">
                        {icon && <Icon name={icon} size={15} colorClass="foreground" />}
                        <Text className="font-bold text-xs text-foreground uppercase tracking-wider ml-2 flex-1" numberOfLines={1}>
                            {title}
                        </Text>
                    </View>
                    {hasActiveDot && (
                        <View className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-agree' : 'bg-decline'}`} />
                    )}
                </View>
            )}
            <View>{children}</View>
        </View>
    );
}
