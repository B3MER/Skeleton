import React from 'react';
import { View } from 'react-native';
import Skeleton from './Skeleton';

export interface ListSkeletonProps {
    count?: number;
    hasIcon?: boolean;
    className?: string;
}

export default function ListSkeleton({
    count = 4,
    hasIcon = false,
    className = '',
}: ListSkeletonProps) {
    return (
        <View className={`w-full ${className}`.trim()}>
            {Array.from({ length: count }).map((_, i) => (
                <View
                    key={i}
                    className="flex-row items-center py-4 border-b border-border/40 w-full"
                >
                    {hasIcon && (
                        <Skeleton width={28} height={28} rounded="full" className="mr-3 shrink-0" />
                    )}
                    <View className="flex-1">
                        <Skeleton
                            width={i % 2 === 0 ? '75%' : '55%'}
                            height={16}
                            rounded="md"
                        />
                    </View>
                </View>
            ))}
        </View>
    );
}
