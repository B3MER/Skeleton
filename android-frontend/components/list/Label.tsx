import React, { useRef } from 'react';
import { View, Text, Pressable, ViewProps } from 'react-native';

interface SimpleLabelProps extends ViewProps {
    id: string | number;
    label?: string | null;
    disabled?: boolean;
    bullets?: boolean;

    className?: string;
    textClassName?: string;
    bulletClassName?: string;

    onPress?: (data: { id: string | number; label: string | null | undefined; disabled: boolean }) => void;
    onDoublePress?: (data: { id: string | number; label: string | null | undefined; disabled: boolean }) => void;
}

export default function SimpleLabel({
    id,
    label,
    disabled = false,
    bullets = false,
    className = '',
    textClassName = '',
    bulletClassName = '',
    onPress,
    onDoublePress,
    ...rest
}: SimpleLabelProps) {

    const lastTap = useRef<number>(0);

    const handleInteraction = () => {
        if (disabled) return;

        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
            if (onDoublePress) {
                onDoublePress({ id, label, disabled });
            }
            lastTap.current = 0;
        } else {
            lastTap.current = now;
            if (onPress) {
                onPress({ id, label, disabled });
            }
        }
    };

    return (
        <View
            className={`flex-row items-center mb-2 ${className}`}
            {...rest}
        >
            {bullets && (
                <Text className={`mr-2 text-foreground text-base ${bulletClassName}`}>
                    •
                </Text>
            )}

            <Pressable
                onPress={handleInteraction}
                disabled={disabled}
                className={`flex-row items-center flex-1 ${disabled ? 'opacity-50' : ''}`}
            >
                <Text
                    className={`text-base text-foreground flex-shrink ${textClassName}`}
                >
                    {label}
                </Text>
            </Pressable>
        </View>
    );
}