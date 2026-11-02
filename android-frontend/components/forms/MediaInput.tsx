import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Trash2 } from 'lucide-react-native';
import Icon from '@/components/layout/Icon';
import { errorHandler } from '@/App/helpers';

export interface MediaFile {
    uri: string;
    name: string;
    type: string;
}

interface MediaInputProps {
    label?: string;
    value?: MediaFile | string | null;
    onChange?: (file: MediaFile | null) => void;
    error?: string;
    disabled?: boolean;
}

export default function MediaInput({
    label = 'Fotografía / Evidencia',
    value,
    onChange,
    error,
    disabled = false,
}: MediaInputProps) {
    const [cargando, setCargando] = useState(false);

    const uriPreview = typeof value === 'string'
        ? value
        : value?.uri || null;

    const tomarFoto = async () => {
        if (disabled) return;
        try {
            setCargando(true);
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const fileName = asset.fileName || `foto_${Date.now()}.jpg`;
                const mimeType = asset.mimeType || 'image/jpeg';
                onChange?.({
                    uri: asset.uri,
                    name: fileName,
                    type: mimeType,
                });
            }
        } catch (err) {
            errorHandler(err);
        } finally {
            setCargando(false);
        }
    };

    const elegirGaleria = async () => {
        if (disabled) return;
        try {
            setCargando(true);
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const fileName = asset.fileName || `foto_${Date.now()}.jpg`;
                const mimeType = asset.mimeType || 'image/jpeg';
                onChange?.({
                    uri: asset.uri,
                    name: fileName,
                    type: mimeType,
                });
            }
        } catch (err) {
            errorHandler(err);
        } finally {
            setCargando(false);
        }
    };

    const limpiar = () => {
        onChange?.(null);
    };

    return (
        <View className="mb-4">
            {!!label && (
                <Text className="text-sm font-semibold text-foreground mb-2">
                    {label}
                </Text>
            )}

            {uriPreview ? (
                <View className="relative rounded-2xl overflow-hidden border border-border bg-card">
                    <Image
                        source={{ uri: uriPreview }}
                        className="w-full h-44 bg-muted"
                        resizeMode="cover"
                    />
                    <View className="flex-row justify-between items-center p-2.5 bg-card/90 border-t border-border">
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={tomarFoto}
                                disabled={disabled || cargando}
                                className="flex-row items-center bg-secondary px-3 py-1.5 rounded-lg active:opacity-70"
                            >
                                <Icon name={Camera} size={15} colorClass="secondary-foreground" />
                                <Text className="text-xs font-semibold text-secondary-foreground ml-1.5">
                                    Retomar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={elegirGaleria}
                                disabled={disabled || cargando}
                                className="flex-row items-center bg-secondary px-3 py-1.5 rounded-lg active:opacity-70"
                            >
                                <Icon name={ImageIcon} size={15} colorClass="secondary-foreground" />
                                <Text className="text-xs font-semibold text-secondary-foreground ml-1.5">
                                    Galería
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={limpiar}
                            disabled={disabled || cargando}
                            className="flex-row items-center bg-destructive/15 px-3 py-1.5 rounded-lg active:opacity-70"
                        >
                            <Icon name={Trash2} size={15} colorClass="destructive" />
                            <Text className="text-xs font-semibold text-destructive ml-1.5">
                                Quitar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View className="border-2 border-dashed border-border rounded-2xl p-4 bg-card/50 items-center justify-center">
                    <Text className="text-xs text-muted-foreground mb-3 text-center">
                        Agrega una fotografía o evidencia
                    </Text>
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={tomarFoto}
                            disabled={disabled || cargando}
                            className="flex-row items-center bg-primary px-4 py-2 rounded-xl active:opacity-70 shadow-sm"
                        >
                            <Icon name={Camera} size={16} colorClass="primary-foreground" />
                            <Text className="text-xs font-semibold text-primary-foreground ml-2">
                                Tomar Foto
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={elegirGaleria}
                            disabled={disabled || cargando}
                            className="flex-row items-center bg-secondary px-4 py-2 rounded-xl active:opacity-70 border border-border"
                        >
                            <Icon name={ImageIcon} size={16} colorClass="secondary-foreground" />
                            <Text className="text-xs font-semibold text-secondary-foreground ml-2">
                                Galería
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {!!error && (
                <Text className="text-xs text-decline mt-1.5 font-medium">
                    {error}
                </Text>
            )}
        </View>
    );
}
