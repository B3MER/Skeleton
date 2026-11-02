import React from 'react';
import { View } from 'react-native';
import Card from '../layout/Card';
import Skeleton from './Skeleton';

export interface CardSkeletonProps {
    count?: number;
    lines?: number;
    hasAvatar?: boolean;
    hasHeader?: boolean;
    hasFooter?: boolean;
    className?: string;
}

export default function CardSkeleton({
    count = 1,
    lines = 2,
    hasAvatar = true,
    hasHeader = true,
    hasFooter = true,
    className = 'mb-3',
}: CardSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index} cardStyle={`bg-card ${className}`.trim()} padding="p-4">
                    <View className="flex-row items-center w-full">
                        {hasAvatar && (
                            <Skeleton width={44} height={44} rounded="xl" className="mr-3 shrink-0" />
                        )}

                        <View className="flex-1">
                            {hasHeader && (
                                <Skeleton width="65%" height={16} rounded="md" className="mb-2" />
                            )}

                            {Array.from({ length: lines }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    width={i === lines - 1 ? '40%' : '90%'}
                                    height={12}
                                    rounded="sm"
                                    className="mt-1.5"
                                />
                            ))}
                        </View>
                    </View>

                    {hasFooter && (
                        <View className="flex-row justify-between items-center pt-3 mt-3 border-t border-border/60">
                            <Skeleton width={80} height={20} rounded="md" />
                            <Skeleton width={90} height={16} rounded="md" />
                        </View>
                    )}
                </Card>
            ))}
        </>
    );
}

