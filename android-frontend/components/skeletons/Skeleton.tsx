import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle, DimensionValue } from 'react-native';

export interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
    className?: string;
    style?: StyleProp<ViewStyle>;
}

export default function Skeleton({
    width,
    height = 16,
    rounded = 'md',
    className = '',
    style,
}: SkeletonProps) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.8,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );

        pulse.start();

        return () => pulse.stop();
    }, [opacity]);

    const roundedClass = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
    }[rounded] || 'rounded-md';

    const computedStyle: ViewStyle = {
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
    };

    return (
        <Animated.View
            style={[{ opacity }, computedStyle, style]}
            className={`bg-muted ${roundedClass} ${className}`.trim()}
        />
    );
}
