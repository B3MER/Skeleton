import React, { useEffect } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@/App/store/useTheme';
import * as NavigationBar from 'expo-navigation-bar';
import { Home, Contact } from 'lucide-react-native';

import { Alert } from '@/components';
import Sidebar from '@/components/sidebar/Sidebar';
import Login from '@/App/view/Login';
import PantallaHome from '@/App/view/Home';
import Profile from '../view/Profile';

import { useUserStore } from '../store/auth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Define las rutas principales para la navegación por pestañas/sidebar
const RUTAS_TABS = [
    { name: 'home', component: PantallaHome, title: 'Inicio', icon: Home },
    { name: 'perfil', component: Profile, title: 'USUARIO', icon: Contact },
    // Agrega aquí las pantallas de tu nuevo proyecto
];

const RUTAS_STACK = [
    { name: 'Login', component: Login }
];

function MiMenuInferior() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-background">
            <Tab.Navigator
                initialRouteName="home"
                tabBar={(props) => <Sidebar {...props} />}
            >
                {RUTAS_TABS.map((ruta, index) => (
                    <Tab.Screen
                        key={index}
                        name={ruta.name}
                        component={ruta.component}
                        options={{
                            headerShown: true,
                            title: ruta.title || '',
                            tabBarIcon: () => ruta?.icon
                        }}
                    />
                ))}
            </Tab.Navigator>
        </View>
    );
}

export default function Router() {
    const isDark = useThemeStore((state) => state.isDark);
    const baseTheme = isDark ? DarkTheme : DefaultTheme;
    const token = useUserStore((state) => state.token);
    const appTheme = {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            background: 'transparent'
        }
    };

    useEffect(() => {
        if (Platform.OS === 'android') {
            const estiloBotones = isDark ? 'light' : 'dark';
            NavigationBar.setStyle(estiloBotones);
        }
    }, [isDark]);

    return (
        <NavigationContainer theme={appTheme}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent={true}
            />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {token ? (
                    <Stack.Screen name="Main" component={MiMenuInferior} />
                ) : (
                    RUTAS_STACK.map((ruta, index) => (
                        <Stack.Screen
                            key={index}
                            name={ruta.name}
                            component={ruta.component}
                        />
                    ))
                )}
            </Stack.Navigator>
            <Alert />
        </NavigationContainer>
    );
}