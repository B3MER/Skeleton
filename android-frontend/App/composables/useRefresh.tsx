import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RotateCw } from 'lucide-react-native';
import { Button } from '@/components';

export const useRefresh = (navigation: any, cargando: boolean, onRefresh: () => void) => {
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                cargando ? (
                    <View style={{ marginRight: 15, width: 22, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color="#0284c7" />
                    </View>
                ) : (
                    <Button
                        icon={RotateCw}
                        iconClass="chart-1"
                        iconSize={22}
                        variant="ghost"
                        size="none" 
                        containerClass="mr-[15px]" 
                        onPress={onRefresh}
                    />
                )
            ),
        });
    }, [navigation, cargando, onRefresh]);
};

