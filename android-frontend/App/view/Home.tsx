import React from 'react';
import { View, Text, Image } from 'react-native';
import { useUserStore } from '@/App/store';
import {Card} from '@/components/'; 

export default function WelcomeScreen() {
    const getSystemName = useUserStore((state) => state.systemName);
    const systemName = getSystemName();

    return (
        <View className="flex-1 bg-background p-4 justify-center">
            <Card 
                padding="p-6"
                cardStyle="bg-card rounded-3xl mb-0" 
            >
                <View className="items-center w-full mb-8 mt-4">
                    <Text className="text-lg font-medium text-muted-foreground mb-1">
                        Bienvenido al
                    </Text>
                    <Text className="text-3xl font-extrabold text-primary text-center mb-4">
                        {systemName}
                    </Text>
                    <Text className="text-base font-semibold text-muted-foreground text-center px-2">
                        Plantilla Base del Sistema{'\n'}Panel de Control
                    </Text>
                </View>
                <View className="w-full items-center justify-center">
                    <Image 
                        source={require('@/assets/icon.png')}
                        className="w-64 h-64 max-w-full"
                        resizeMode="contain"
                        alt="Logo de la aplicación"
                    />
                </View>
            </Card>
        </View>
    );
}