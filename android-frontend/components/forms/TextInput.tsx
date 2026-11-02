import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Eye, EyeOff } from 'lucide-react-native';
import { errorHandler } from "@/App/helpers";

export type SelectedFile = DocumentPicker.DocumentPickerAsset;

interface InputProps {
    id?: string;
    label?: string;
    value?: string | number | null;
    type?: 'text' | 'password' | 'file' | 'num' | 'number' | 'math' | 'mayusc' | 'minusc' | 'date' | 'time' | 'time-date' | 'date-time';
    placeholder?: string;
    icon?: React.ElementType;
    maxLength?: number;
    disabled?: boolean;
    error?: string;
    containerClass?: string;
    edit?: string | number | null;
    required?: boolean;
    accept?: string;
    onChange?: (value: any, item?: any) => void;
    onFileSelect?: (file: SelectedFile) => void;
}

export default function Input({
    id,
    label,
    value = '',
    type = 'text',
    placeholder = '',
    icon: Icon,
    maxLength,
    disabled = false,
    error = '',
    edit = '',
    required = false,
    accept = '*/*',
    containerClass = '',
    onChange,
    onFileSelect
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [tempDate, setTempDate] = useState<Date | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const effectivePlaceholder = (edit !== null && edit !== undefined && edit !== '')
        ? String(edit)
        : placeholder;

    const effectiveValue = (value !== null && value !== undefined) ? String(value) : '';

    const isNumeric = type === 'num' || type === 'number' || type === 'math';
    const isPressable = type === 'file' || type === 'date' || type === 'time' || type === 'time-date' || type === 'date-time';

    const handleInput = (text: string) => {
        if (isPressable) return;
        if (text === undefined || text === null) return;

        let val = text;
        if (type === 'num' || type === 'number') {
            val = val.replace(/[^0-9.]/g, '');
        } else if (type === 'math') {
            val = val.replace(/[^0-9+\-*/().]/g, '');
        } else if (type === 'mayusc') {
            val = val.toUpperCase();
        } else if (type === 'minusc') {
            val = val.toLowerCase();
        }

        if (maxLength && val.length > maxLength) {
            val = val.slice(0, maxLength);
        }

        if (onChange) onChange(val);
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: accept,
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                if (onFileSelect) onFileSelect(file);
                else if (onChange) onChange(file.name, file);
            }
        } catch (err) {
            errorHandler(err);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (event?.type === 'dismissed') {
            setShowPicker(false);
            setTempDate(null);
            return;
        }

        const validDate = selectedDate || (event instanceof Date ? event : null);

        if (!validDate) {
            setShowPicker(false);
            setTempDate(null);
            return;
        }

        if (type === 'date') {
            setShowPicker(false);
            const year = validDate.getFullYear();
            const month = String(validDate.getMonth() + 1).padStart(2, '0');
            const day = String(validDate.getDate()).padStart(2, '0');
            if (onChange) onChange(`${year}-${month}-${day}`);
        } else if (type === 'time') {
            setShowPicker(false);
            const hours = String(validDate.getHours()).padStart(2, '0');
            const minutes = String(validDate.getMinutes()).padStart(2, '0');
            if (onChange) onChange(`${hours}:${minutes}`);
        } else if (type === 'time-date' || type === 'date-time') {
            if (pickerMode === 'date') {
                setTempDate(validDate);
                setShowPicker(false);
                setTimeout(() => {
                    setPickerMode('time');
                    setShowPicker(true);
                }, 100);
            } else {
                setShowPicker(false);
                const baseDate = tempDate || new Date();
                const year = baseDate.getFullYear();
                const month = String(baseDate.getMonth() + 1).padStart(2, '0');
                const day = String(baseDate.getDate()).padStart(2, '0');
                const hours = String(validDate.getHours()).padStart(2, '0');
                const minutes = String(validDate.getMinutes()).padStart(2, '0');
                const seconds = String(validDate.getSeconds() || 0).padStart(2, '0');
                const combined = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                if (onChange) onChange(combined);
                setTempDate(null);
            }
        }
    };

    const handleDismiss = () => {
        setShowPicker(false);
        setTempDate(null);
    };

    const getPickerDate = () => {
        if (tempDate && pickerMode === 'time') {
            return tempDate;
        }
        const currentDate = new Date();
        if (value && typeof value === 'string') {
            if (type === 'time' && value.includes(':')) {
                const [h, m] = value.split(':');
                currentDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
                return currentDate;
            } else if (type === 'date') {
                const parts = value.split('-');
                if (parts.length === 3) {
                    currentDate.setFullYear(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                    return currentDate;
                }
            } else if (type === 'time-date' || type === 'date-time') {
                const parsed = new Date(value);
                if (!isNaN(parsed.getTime())) {
                    return parsed;
                }
            }
        }
        return currentDate;
    };

    const handlePress = () => {
        if (type === 'file') {
            handlePickDocument();
        } else if (type === 'time-date' || type === 'date-time') {
            setPickerMode('date');
            setTempDate(null);
            setShowPicker(true);
        } else if (type === 'date') {
            setPickerMode('date');
            setShowPicker(true);
        } else if (type === 'time') {
            setPickerMode('time');
            setShowPicker(true);
        }
    };

    const getDisplayPlaceholder = () => {
        if (type === 'file') return 'Seleccionar archivo...';
        if (type === 'date') return 'YYYY-MM-DD';
        if (type === 'time') return 'HH:mm';
        if (type === 'time-date' || type === 'date-time') return 'YYYY-MM-DD   HH:mm:ss';
        return '';
    };

    const getDisplayText = () => {
        if (effectiveValue === '') {
            return effectivePlaceholder || getDisplayPlaceholder();
        }
        if (type === 'time-date' || type === 'date-time') {
            if (effectiveValue.includes('T')) {
                const [d, t] = effectiveValue.split('T');
                const cleanTime = t ? t.replace('Z', '') : '';
                return `${d}   ${cleanTime}`;
            }
        }
        return effectiveValue;
    };

    return (
        <View className={`w-full mb-5 ${containerClass}`}>
            <View className="flex-row items-end mb-2">
                {label ? (
                    <Text className="text-sm font-medium text-foreground">
                        {label}
                    </Text>
                ) : null}
                {required ? (
                    <Text className="pl-1 text-sm font-normal text-decline">*</Text>
                ) : null}
            </View>

            <View
                className={`w-full pb-2 flex-row items-center border-b ${error ? 'border-decline' : isFocused ? 'border-blue-500' : 'border-gray-400'
                    } ${disabled ? 'opacity-50' : 'opacity-100'}`}
            >
                {Icon ? (
                    <View className="pr-2 flex justify-center items-center">
                        <Icon size={22} color={isFocused ? "#3b82f6" : "#9ca3af"} />
                    </View>
                ) : null}

                {!isPressable ? (
                    <TextInput
                        className="flex-1 text-base text-foreground p-0 m-0 min-h-[24px]"
                        placeholder={effectivePlaceholder}
                        placeholderTextColor="#9ca3af"
                        value={effectiveValue}
                        onChangeText={handleInput}
                        maxLength={maxLength}
                        editable={!disabled}
                        secureTextEntry={type === 'password' && !showPassword}
                        keyboardType={isNumeric ? 'numeric' : 'default'}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        underlineColorAndroid="transparent"
                        autoCapitalize={type === 'mayusc' ? 'characters' : 'none'}
                    />
                ) : (
                    <TouchableOpacity
                        disabled={disabled}
                        onPress={handlePress}
                        className="justify-center flex-1 min-h-[24px]"
                    >
                        <Text className={`text-base ${effectiveValue !== '' ? 'text-foreground' : 'text-gray-400'}`} numberOfLines={1}>
                            {getDisplayText()}
                        </Text>
                    </TouchableOpacity>
                )}

                {type === 'password' ? (
                    <TouchableOpacity
                        onPress={() => setShowPassword(prev => !prev)}
                        className="pl-2 flex justify-center items-center"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        {showPassword
                            ? <EyeOff size={20} color={isFocused ? "#3b82f6" : "#9ca3af"} />
                            : <Eye size={20} color={isFocused ? "#3b82f6" : "#9ca3af"} />
                        }
                    </TouchableOpacity>
                ) : null}
            </View>

            <View className="flex-row mt-1 justify-between items-start min-h-[18px]">
                <View className="flex-1 pr-2">
                    {error ? (
                        <Text className="text-decline text-xs">
                            {Array.isArray(error) ? error[0] : (typeof error === 'object' ? JSON.stringify(error) : String(error))}
                        </Text>
                    ) : null}
                </View>

                {maxLength && !isPressable ? (
                    <Text className="text-foreground text-xs opacity-70 text-right">
                        {String(value || '').length} / {maxLength}
                    </Text>
                ) : null}
            </View>

            {showPicker && (
                <DateTimePicker
                    value={getPickerDate()}
                    mode={pickerMode}
                    display="default"
                    onValueChange={handleDateChange}
                    onDismiss={handleDismiss}
                />
            )}
        </View>
    );
}