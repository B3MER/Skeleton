import React from 'react';
import { Modal, View, Text } from 'react-native';
import Button from '../buttons/Button';
import Card from './Card';
import { useAlertStore } from '@/App/store/useAlert';

export default function CustomAlert() {
    const {
        visible, titulo, contenido, aceptar, cancelar,
        onSuccess, onCancel, hideAlert
    } = useAlertStore();

    const handleAccept = () => {
        hideAlert();
        if (onSuccess) onSuccess();
    };

    const handleCancel = () => {
        hideAlert();
        if (onCancel) onCancel();
    };

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View className="flex-1 justify-center items-center bg-black/50 px-6">
                <Card
                    title={titulo}
                    titleClass="text-[20px] font-bold mb-2"
                    padding="p-6"
                    divider={true}
                    cardStyle="bg-card shadow-2xl w-full max-w-sm"
                >
                    <Text className="text-muted-foreground text-base mb-6">
                        {contenido}
                    </Text>

                    {/* Botones */}
                    <View className="flex-row justify-end gap-x-3 mt-2">
                        {cancelar && (
                            <Button
                                label={cancelar}
                                variant="ghost"
                                onPress={handleCancel}
                                containerClass="flex-1 border border-border bg-secondary"
                                size="md"
                            />
                        )}
                        <Button
                            label={aceptar}
                            onPress={handleAccept}
                            containerClass="bg-primary flex-1"
                            size="md"
                        />
                    </View>
                </Card>
            </View>
        </Modal>
    );
}