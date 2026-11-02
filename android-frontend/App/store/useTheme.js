import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export const useThemeStore = create(
    persist(
        (set, get) => ({
            isDark: Appearance.getColorScheme() === 'dark',

            toggleTheme: () => {
                set({ isDark: !get().isDark });
            },
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);