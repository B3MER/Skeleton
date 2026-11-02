import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, Platform, Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Router from '@/App/router/index';
import { useThemeStore } from '@/App/store/useTheme';
import { themes, injectCSSForPC } from '@/assets/themes';
import { cssInterop } from 'nativewind';
import "./global.css";

cssInterop(Animated.View, {
    className: 'style',
});

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    'InteractionManager has been deprecated',
    'ImageBackground is deprecated',
]);

export default function App() {
    const isDark = useThemeStore((state) => state.isDark);

    useEffect(() => {
        injectCSSForPC();
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDark]);

    return (
        <SafeAreaProvider>
            <View 
                className="flex-1 bg-background"
                style={isDark ? themes.dark : themes.light}
            >
                <Router />
            </View>
        </SafeAreaProvider>
    );
}