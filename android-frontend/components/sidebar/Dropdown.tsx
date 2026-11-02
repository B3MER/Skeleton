import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { ChevronDown, LucideIcon } from 'lucide-react-native';
import 'global.css';

type Option = {
    id: string | number;
    label: string;
};

type Props = {
    id?: string | number;
    label: string;
    icon?: LucideIcon;
    options?: Option[];
    modelValue?: string | number;
    isOpen?: boolean;
    onChange?: (val: any) => void;
    onClick?: (data?: any) => void;
    onToggle?: (id?: string | number) => void;
};

export default function SidebarItem({
    id,
    label,
    icon: Icon,
    options = [],
    modelValue,
    isOpen = false,
    onChange,
    onClick,
    onToggle
}: Props) {
    const rotateAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

    const hasOptions = options.length > 0;
    const isActive = (itemId: any) => modelValue === itemId;

    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isOpen ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [isOpen]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    const handleMainClick = () => {
        if (hasOptions) {
            onToggle?.(id);
            onClick?.();
        } else {
            onChange?.(id);
            onClick?.({ id, label });
        }
    };

    const handleOptionClick = (option: Option) => {
        onChange?.(option.id);
        onClick?.(option);
    };

    return (
        <View className="w-full ">
            <Pressable
                onPress={handleMainClick}
                className={`
                    flex-row items-center w-full rounded-xl py-2 justify-between px-3
                    ${!hasOptions && isActive(id) ? 'bg-primary' : hasOptions && isOpen ? 'bg-secondary' : 'bg-transparent'}
                `}
            >
                <View className="flex-row items-center flex-1 gap-2">
                    {Icon && (
                        <Icon
                            size={16}
                            className={!hasOptions && isActive(id) ? 'text-primary-foreground' : 'text-muted-foreground'}
                        />
                    )}

                    <Text className={`text-sm ${!hasOptions && isActive(id) ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {label}
                    </Text>
                </View>

                {hasOptions && (
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <ChevronDown size={16} color="#3b82f6"/>
                    </Animated.View>
                )}
            </Pressable>

            {hasOptions && isOpen && (
                <View className="mt-2 ml-4 pl-3 border-l border-sidebar-border flex flex-col gap-2">
                    {options.map((option, index) => (
                        <Pressable
                            key={option.id ?? index}
                            onPress={() => handleOptionClick(option)}
                            className={`
                                px-3 py-2 rounded-xl
                                ${isActive(option.id) ? 'bg-primary' : 'bg-transparent hover:bg-muted/50 active:bg-muted/50'}
                            `}
                        >
                            <Text className={`text-sm ${isActive(option.id) ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                {option.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}