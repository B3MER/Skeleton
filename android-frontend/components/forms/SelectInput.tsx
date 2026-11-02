import "@/global.css";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Sheet from '../layout/Sheet';
import Empty from '../layout/Empty';

interface SelectInputProps {
    id?: string;
    label?: string;
    value?: string | number | null;
    placeholder?: string;
    options?: Record<string, any[]>;
    disabled?: boolean;
    error?: string;
    edit?: string | number | null;
    required?: boolean;
    containerClass?: string;
    icon?: React.ElementType;
    open?: boolean;
    isLoading?: boolean;
    onClose?: () => void;
    onChange?: (value: any, item?: any) => void;
    onFocus?: (data: any) => void;
    size?: 1 | 2 | 3 | 4;
}

export default function SelectInput({
    id = '',
    label,
    placeholder = '',
    value = '',
    options = {},
    disabled = false,
    error = '',
    edit = '',
    required = false,
    containerClass = '',
    icon: Icon,
    open: openProp,
    isLoading = false,
    size,
    onClose,
    onChange,
    onFocus,
}: SelectInputProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);

    const currentFocusedId = useRef<string | null>(null);

    const isControlled = openProp !== undefined;
    const modalVisible = isControlled ? openProp : internalOpen;

    const currentOptions = options[id] || [];

    useEffect(() => {
        setUserInteracted(false);
    }, [edit]);

    const selectedItem = useMemo(() => {
        return currentOptions.find((item: any) => item.id === value || item.label === value);
    }, [value, currentOptions]);

    let displayText = placeholder;
    if (selectedItem) {
        displayText = selectedItem.label;
    } else if (edit && !userInteracted) {
        displayText = String(edit);
    } else if (value && typeof value === 'string' && isNaN(Number(value))) {
        displayText = value;
    }

    const isEmpty = !selectedItem && !(edit && !userInteracted) && !value;

    const handlePress = () => {
        if (disabled) return;

        if (!isControlled) setInternalOpen(true);

        if (onFocus) {
            onFocus({ id, label, value });
        }
    };

    const handleClose = () => {
        if (isControlled && onClose) {
            onClose();
        } else {
            setInternalOpen(false);
        }
    };

    const handleSelect = (item: any) => {
        setUserInteracted(true);
        if (onChange) onChange(item.id, item);
        handleClose();
    };

    return (
        <View className={`relative w-full mb-5 ${containerClass}`}>
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

            <View className="relative justify-center">
                <Pressable
                    onPress={handlePress}
                    className={`flex-row items-center w-full rounded-md border bg-background py-3 pl-3 pr-10 text-sm ${disabled ? 'opacity-50' : ''} ${error ? 'border-decline' : 'border-input'}`}
                >
                    {Icon && (
                        <View className="pr-2 flex justify-center items-center">
                            <Icon size={20} color="#9ca3af" />
                        </View>
                    )}

                    <Text
                        className={`flex-1 text-sm ${isEmpty ? 'text-muted-foreground' : 'text-foreground'}`}
                        numberOfLines={1}
                    >
                        {displayText}
                    </Text>
                </Pressable>

                <View className="pointer-events-none absolute inset-y-0 right-0 flex-row items-center pr-3">
                    <ChevronDown size={16} color="#9ca3af" />
                </View>
            </View>

            {!!error && (
                <Text className="text-xs text-decline mt-1">
                    {error}
                </Text>
            )}

            <Sheet
                visible={modalVisible}
                onClose={handleClose}
                title="Selecciona una opción"
                scrollable={false}
                size={size}
                loadingSkeleton={isLoading}
            >
                <FlatList
                    data={currentOptions}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="flex w-full flex-row items-center py-4 border-b border-card-foreground/15"
                            onPress={() => handleSelect(item)}
                        >
                            <Text className="text-base text-foreground">
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <Empty
                            label="Sin opciones"
                            placeholder="No hay opciones disponibles en este momento."
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </Sheet>
        </View>
    );
}