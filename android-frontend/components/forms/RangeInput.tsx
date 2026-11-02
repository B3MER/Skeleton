import React, { useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import "@/global.css";

export interface RangeInputValue {
    [key: string]: string;
}

export interface RangeInputProps {
    id: string;
    label?: string | null;
    value?: RangeInputValue;
    onChange?: (value: RangeInputValue) => void;
    type?: string;
    disabled?: boolean;
    error?: string;
    containerClass?: string;
    icon?: React.ElementType;
}

export default function RangeInput({
    id,
    label = null,
    value = {},
    onChange,
    type = 'time-range',
    disabled = false,
    error = '',
    containerClass = 'bg-background',
    icon: Icon
}: RangeInputProps) {
    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [activeInput, setActiveInput] = useState<string | null>(null);

    const baseType = useMemo(() => {
        return type.includes('date') ? 'date' : 'time';
    }, [type]);

    const formatValue = (dateObj: Date): string => {
        if (!dateObj) return '';
        if (baseType === 'time') {
            const hours = dateObj.getHours().toString().padStart(2, '0');
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } else {
            const year = dateObj.getFullYear();
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    };

    const handlePress = (prefix: string) => {
        if (disabled) return;
        setActiveInput(prefix);
        setShowPicker(true);
    };

    const handleValueChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        const validDate = selectedDate || (event instanceof Date ? event : null);

        if (validDate) {
            const formattedValue = formatValue(validDate);
            const dynamicKey = `${activeInput}_${id}`;

            const updatedValue = {
                ...value,
                [dynamicKey]: formattedValue
            };

            if (onChange) {
                onChange(updatedValue);
            }
        }
    };

    const handleDismiss = () => {
        setShowPicker(false);
    };

    const desdeValue = value[`desde_${id}`] || (baseType === 'time' ? '--:--' : 'DD/MM/YYYY');
    const hastaValue = value[`hasta_${id}`] || (baseType === 'time' ? '--:--' : 'DD/MM/YYYY');

    return (
        <View className="w-full mb-5">
            {label && (
                <Text className="block min-h-[3 rem] pb-1 font-normal text-foreground">
                    {label}
                </Text>
            )}

            <View className="flex-row items-center justify-between w-full">
                <Pressable
                    onPress={() => handlePress('desde')}
                    className={`flex-1 flex-row items-center rounded-md border border-input py-3 px-3 ${disabled ? 'opacity-50' : ''
                        } ${containerClass}`}
                >
                    {Icon && (
                        <View className="pr-2 flex justify-center items-center">
                            <Icon size={20} color="#9ca3af" />
                        </View>
                    )}
                    <Text
                        className={`flex-1 text-sm ${value[`desde_${id}`] ? 'text-foreground' : 'text-muted-foreground'}`}
                        numberOfLines={1}
                    >
                        {desdeValue}
                    </Text>
                </Pressable>

                <View className="px-2 flex justify-center items-center">
                    <View className="w-3 h-[2px] bg-gray-400 rounded-full" />
                </View>

                <Pressable
                    onPress={() => handlePress('hasta')}
                    className={`flex-1 flex-row items-center rounded-md border border-input py-3 px-3 ${disabled ? 'opacity-50' : ''
                        } ${containerClass}`}
                >
                    {Icon && (
                        <View className="pr-2 flex justify-center items-center">
                            <Icon size={20} color="#9ca3af" />
                        </View>
                    )}
                    <Text
                        className={`flex-1 text-sm ${value[`hasta_${id}`] ? 'text-foreground' : 'text-muted-foreground'}`}
                        numberOfLines={1}
                    >
                        {hastaValue}
                    </Text>
                </Pressable>
            </View>

            {!!error && (
                <Text className="text-xs text-decline mt-1">
                    {error}
                </Text>
            )}

            {showPicker && (
                <DateTimePicker
                    value={new Date()}
                    mode={baseType as 'date' | 'time'}
                    display="default"
                    onValueChange={handleValueChange}
                    onDismiss={handleDismiss}
                />
            )}
        </View>
    );
}