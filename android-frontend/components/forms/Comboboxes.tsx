import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, Pressable, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { ChevronDown, X, Search } from 'lucide-react-native';
import Sheet from '../layout/Sheet';
import Empty from '../layout/Empty';
import ListSkeleton from '../skeletons/ListSkeleton';
import { debounce } from '@/App/helpers';

interface OptionItem {
    id: string | number;
    label: string;
    [key: string]: any;
}

interface ComboboxesProps {
    id?: string;
    label?: string;
    value?: any;
    placeholder?: string;
    options?: Record<string, OptionItem[]>;
    disabled?: boolean;
    error?: string;
    edit?: string | number | null;
    required?: boolean;
    containerClass?: string;
    icon?: React.ElementType;
    open?: boolean;
    onClose?: () => void;
    onChange?: (item: OptionItem) => void;
    isLoading?: boolean;
    fetchData?: (text: string) => Promise<any> | void;
    type?: 'select-num' | 'select-text' | string;
    maxLength?: number;
    debounceMs?: number;
}

export default function Comboboxes({
    id = '',
    label,
    placeholder = 'Selecciona una opción...',
    value = '',
    options = {},
    disabled = false,
    error = '',
    edit = '',
    required = false,
    containerClass = '',
    icon: Icon,
    open: openProp,
    onClose,
    onChange,
    isLoading = false,
    fetchData,
    type = 'select-text',
    maxLength = 0,
    debounceMs = 350,
}: ComboboxesProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const isControlled = openProp !== undefined;
    const modalVisible = isControlled ? openProp : internalOpen;

    const currentOptions = options[id] || [];

    const debouncedFetchRef = useRef<ReturnType<typeof debounce> | null>(null);

    useEffect(() => {
        debouncedFetchRef.current = debounce(
            async (text: string) => {
                if (fetchData) {
                    try {
                        await fetchData(text);
                    } catch (err) {
                    }
                }
            },
            debounceMs,
            setIsSearching
        );

        return () => {
            debouncedFetchRef.current?.cancel();
        };
    }, [fetchData, debounceMs]);

    useEffect(() => {
        if (!modalVisible) {
            debouncedFetchRef.current?.cancel();
            setSearchQuery('');
            setIsSearching(false);
        }
    }, [modalVisible]);

    const selectedItem = useMemo(() => {
        if (typeof value === 'object' && value !== null) return value;
        return currentOptions.find((item: any) => item.id === value || item.label === value);
    }, [value, currentOptions]);

    const displayText = selectedItem
        ? selectedItem.label
        : (value && typeof value === 'string' && isNaN(Number(value)) ? value : (edit || placeholder));

    const handlePress = () => {
        if (disabled) return;
        if (!isControlled) setInternalOpen(true);
    };

    const handleClose = () => {
        if (isControlled && onClose) onClose();
        else setInternalOpen(false);
    };

    const handleSelect = (item: any) => {
        if (onChange) onChange(item);
        handleClose();
    };

    const handleSearchInput = (text: string) => {
        const cleanedText = type === 'select-num' ? text.replace(/[^0-9]/g, '') : text;
        if (maxLength > 0 && cleanedText.length > maxLength) return;
        setSearchQuery(cleanedText);

        if (!cleanedText.trim()) {
            debouncedFetchRef.current?.cancel();
            setIsSearching(false);
            if (fetchData) fetchData(cleanedText);
            return;
        }

        debouncedFetchRef.current?.(cleanedText);
    };

    const effectiveLoading = isLoading || isSearching;

    return (
        <View className={`w-full mb-5 ${containerClass}`}>
            <View className="flex-row items-end mb-1">
                {label && <Text className="font-medium text-foreground">{label}</Text>}
                {required && <Text className="pl-1 font-normal text-decline">*</Text>}
            </View>

            <View className="relative justify-center">
                <Pressable
                    onPress={handlePress}
                    className={`flex-row items-center w-full rounded-md border bg-background py-3 pl-3 pr-10 ${disabled ? 'opacity-50' : ''} ${error ? 'border-decline' : 'border-input'}`}
                >
                    {Icon && (
                        <View className="pr-2 justify-center items-center">
                            <Icon size={20} color="#9ca3af" />
                        </View>
                    )}
                    <Text className="flex-1 text-sm text-foreground" numberOfLines={1}>
                        {displayText}
                    </Text>
                </Pressable>
                <View className="absolute inset-y-0 right-0 justify-center pr-3 pointer-events-none">
                    <ChevronDown size={16} color="#9ca3af" />
                </View>
            </View>

            {!!error && (
                <Text className="text-xs text-decline mt-1">{error}</Text>
            )}

            <Sheet
                visible={modalVisible}
                onClose={handleClose}
                title={placeholder.endsWith("...") ? placeholder.slice(0, -3) : placeholder}
                scrollable={false}
            >
                <View className={`flex-row items-center w-full rounded-md border bg-background px-3 h-12 mb-4 ${error ? 'border-decline' : 'border-input'}`}>
                    <Search size={18} color="#9ca3af" style={{ marginRight: 8 }} />
                    <TextInput
                        style={{ flex: 1, paddingVertical: 0, margin: 0, height: 40 }}
                        className="text-sm text-foreground"
                        placeholder="Escribe para buscar..."
                        placeholderTextColor="#9ca3af"
                        value={searchQuery}
                        onChangeText={handleSearchInput}
                        autoCorrect={false}
                        autoFocus={true}
                        textAlignVertical="center"
                        underlineColorAndroid="transparent"
                        keyboardType={type === 'select-num' ? 'number-pad' : 'default'}
                        maxLength={maxLength > 0 ? maxLength : undefined}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearchInput('')} className="p-2">
                            <X size={16} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>

                {effectiveLoading ? (
                    <ListSkeleton count={5} />
                ) : (
                    <FlatList
                        data={currentOptions}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="flex w-full flex-row items-center py-4 border-b border-border active:bg-muted/50"
                                onPress={() => handleSelect(item)}
                            >
                                <Text className="text-base text-foreground">{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <Empty
                                label={searchQuery.trim().length === 0 ? "Escribe para buscar" : "Sin coincidencias"}
                                placeholder={searchQuery.trim().length === 0
                                    ? "Ingresa texto para consultar las opciones disponibles."
                                    : "No se encontraron registros que coincidan con la búsqueda."}
                                icon={Search}
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    />
                )}
            </Sheet>
        </View>
    );
}
