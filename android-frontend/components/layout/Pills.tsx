import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from './Icon';

export interface OptionItem {
    label: string;
    value: string | number;
    icon?: React.ComponentType<any> | string;
}

export interface PillsProps {
    options: (string | OptionItem)[];
    value: string | number;
    onChange: (value: string | number) => void;
    scroll?: boolean;
    containerClass?: string;
}

export default function Pills({
    options = [],
    value,
    onChange,
    scroll = false,
    containerClass = "",
}: PillsProps) {
    const content = (
        <View className={`bg-card border border-input rounded-xl p-1 flex-row items-center ${!scroll ? 'w-full' : ''}`}>
            {options.map((item, index) => {
                const isObj = typeof item === 'object' && item !== null;
                const label = isObj ? item.label : item;
                const itemValue = isObj ? item.value : item;
                const itemIcon = isObj ? item.icon : undefined;
                const isActive = value === itemValue;

                return (
                    <TouchableOpacity
                        key={itemValue ?? index}
                        onPress={() => onChange(itemValue)}
                        activeOpacity={0.7}
                        className={`flex-row items-center justify-center gap-2 py-3 rounded-lg overflow-hidden ${
                            scroll ? 'px-6' : 'flex-1 px-2'
                        } ${isActive ? 'bg-primary' : 'bg-transparent'}`}
                    >
                        {itemIcon && (
                            <Icon
                                name={itemIcon}
                                size={18}
                                colorClass={isActive ? 'primary-foreground' : 'muted-foreground'}
                            />
                        )}
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className={`flex-shrink text-center text-xs sm:text-sm font-bold ${
                                isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                            }`}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    if (scroll) {
        return (
            <View className={`w-full ${containerClass}`.trim()}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {content}
                </ScrollView>
            </View>
        );
    }

    return (
        <View className={`w-full ${containerClass}`.trim()}>
            {content}
        </View>
    );
}