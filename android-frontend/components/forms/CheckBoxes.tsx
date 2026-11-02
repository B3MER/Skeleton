import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckBoxesProps {
    id?: string;
    label?: string;
    value?: boolean;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    required?: boolean;
    containerClass?: string;
    icon?: React.ElementType;
    type?: 'default' | 'pill';
    onChange?: (value: boolean, item?: any) => void;
    onFocus?: (data?: any) => void;
    [key: string]: any;
}

export default function CheckBoxes({
    id = '',
    label,
    value = false,
    placeholder = '',
    disabled = false,
    error = '',
    required = false,
    containerClass = '',
    icon: Icon,
    type = 'default',
    onChange,
    onFocus,
}: CheckBoxesProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (type === 'pill') {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 4,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [value, type, scaleAnim]);

    const handlePress = () => {
        if (disabled) return;
        if (onFocus) {
            onFocus(id);
        }
        if (onChange) {
            onChange(!value);
        }
    };

    if (type === 'pill') {
        return (
            <View className={`${containerClass}`}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Pressable
                        onPress={handlePress}
                        disabled={disabled}
                        className={`flex-row items-center justify-center px-4 py-2 rounded-full border ${value ? 'bg-secondary border-secondary' : 'bg-background border-input'} ${disabled ? 'opacity-50' : ''}`}
                    >
                        {Icon && (
                            <View className="mr-1.5 justify-center items-center">
                                <Icon
                                    size={16}
                                    color={value ? '#ffffff' : '#9ca3af'}
                                />
                            </View>
                        )}
                        <Text
                            className={`text-xs font-semibold tracking-wide ${value ? 'text-primary-foreground' : 'text-foreground'} ${disabled ? 'opacity-50' : ''}`}
                        >
                            {label}
                        </Text>
                    </Pressable>
                </Animated.View>
            </View>
        );
    }

    return (
        <View className={`w-full mb-5 ${containerClass}`}>
            <Pressable
                onPress={handlePress}
                disabled={disabled}
                className="w-full flex-col"
            >
                <View className="flex-row items-center gap-3">
                    <View
                        className={`h-4 w-4 shrink-0 rounded-sm border items-center justify-center ${value ? 'bg-primary border-primary' : 'bg-background border-input'} ${disabled ? 'opacity-50' : ''}`}
                    >
                        {value && (
                            <Check
                                size={12}
                                color="#ffffff"
                                strokeWidth={3}
                            />
                        )}
                    </View>

                    <View className="flex-row items-center flex-1">
                        {Icon && (
                            <View className="pr-2 justify-center items-center">
                                <Icon size={20} color="#9ca3af" />
                            </View>
                        )}

                        {label ? (
                            <Text
                                className={`text-sm font-medium text-foreground ${disabled ? 'opacity-50' : ''}`}
                            >
                                {label}
                            </Text>
                        ) : null}

                        {required ? (
                            <Text className="pl-1 text-sm font-normal text-decline">*</Text>
                        ) : null}
                    </View>
                </View>

                {placeholder ? (
                    <Text
                        className={`pl-7 pt-1.5 text-sm text-muted-foreground ${disabled ? 'opacity-50' : ''}`}
                    >
                        {placeholder}
                    </Text>
                ) : null}
            </Pressable>

            {!!error && (
                <Text className="pl-7 text-xs text-decline mt-1">
                    {error}
                </Text>
            )}
        </View>
    );
}