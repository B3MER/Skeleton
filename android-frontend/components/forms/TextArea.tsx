import React from 'react';
import { View, Text, TextInput } from 'react-native';
import "@/global.css"

interface TextAreaProps {
    id?: string;
    label?: string;
    value?: string | null;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    error?: string;
    edit?: string | null;
    required?: boolean;
    containerClass?: string;
    icon?: React.ElementType;
    onChange?: (value: string, item?: any) => void;
}

export default function TextArea({
    id,
    label = "Descripción",
    value = '',
    placeholder = "Escriba aquí...",
    disabled = false,
    maxLength,
    error = '',
    edit = '',
    required = false,
    containerClass = '',
    icon: Icon,
    onChange
}: TextAreaProps) {
    const effectivePlaceholder = (edit !== null && edit !== undefined && edit !== '')
        ? String(edit)
        : placeholder;

    const effectiveValue = (value !== null && value !== undefined) ? String(value) : '';

    const currentLength = effectiveValue.length;

    return (
        <View className={`w-full mb-5 ${containerClass}`}>
            <View className="flex-row items-end mb-1">
                {label && (
                    <Text className="block font-normal text-foreground">
                        {label}
                    </Text>
                )}
                {required && (
                    <Text className="pl-1 font-normal text-decline">*</Text>
                )}
            </View>

            <View className="relative w-full">
                {Icon && (
                    <View className="absolute left-3 top-3 z-10 flex justify-center items-center">
                        <Icon size={20} color="#9ca3af" />
                    </View>
                )}

                <TextInput
                    value={effectiveValue}
                    onChangeText={(text) => onChange && onChange(text)}
                    multiline={true}
                    numberOfLines={4}
                    placeholder={effectivePlaceholder}
                    placeholderTextColor="#9ca3af"
                    editable={!disabled}
                    maxLength={maxLength}
                    textAlignVertical="top"
                    className={`block w-full min-h-[100px] rounded-md border bg-background py-2 px-3 text-sm text-foreground ${Icon ? 'pl-10' : ''} ${disabled ? 'opacity-50' : ''} ${error ? 'border-decline' : 'border-input'}`}
                />
            </View>

            {maxLength ? (
                <View className={`flex-row mt-1 flex-wrap items-center ${error ? 'justify-between' : 'justify-end'}`}>
                    {!!error && (
                        <Text className="text-xs text-decline">
                            {error}
                        </Text>
                    )}
                    <Text className="text-xs text-muted-foreground">
                        {currentLength} / {maxLength}
                    </Text>
                </View>
            ) : (
                !!error && (
                    <Text className="text-xs text-decline mt-1">
                        {error}
                    </Text>
                )
            )}
        </View>
    );
}