import React from 'react';
import { View, Text } from 'react-native';
import { LucideProps, Search } from 'lucide-react-native';
import Card from './Card';
import Icon from './Icon';

export interface EmptyProps {
    label?: React.ReactNode;
    placeholder?: React.ReactNode;
    icon?: React.ComponentType<LucideProps> | string;
}

export default function Empty({
    label = 'No hay registros disponibles',
    placeholder = 'No se encontraron resultados que coincidan con la búsqueda o filtro seleccionado.',
    icon = Search,
}: EmptyProps) {
    return (
        <Card cardStyle="bg-muted/20 border-dashed border-border my-4" padding="p-8">
            <View className="items-center justify-center">
                <View className="w-14 h-14 rounded-full bg-neutro/50 items-center justify-center mb-3 border border-border/50">
                    <Icon name={icon} size={26} colorClass="muted-foreground" />
                </View>
                {typeof label === 'string' || typeof label === 'number' ? (
                    <Text className="text-base font-bold text-foreground text-center mb-1">
                        {label}
                    </Text>
                ) : (
                    label
                )}
                {typeof placeholder === 'string' || typeof placeholder === 'number' ? (
                    <Text className="text-xs text-muted-foreground text-center max-w-[260px] leading-5">
                        {placeholder}
                    </Text>
                ) : (
                    placeholder
                )}
            </View>
        </Card>
    );
}
