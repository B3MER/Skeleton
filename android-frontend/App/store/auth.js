import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      token: null,
      userData: null,
      edicion: null,

      // --- ACTIONS ---
      letEdit: (data) => {
        set({
          edicion: data
        })
      },

      login: (data) => {
        set({
          token: data.token,
          userData: data,
        });
      },

      updateProfile: (data) => {
        set({ userData: data });
      },

      logout: () => {
        set({ token: null, userData: null });
        // Si tienes otros items manuales en storage:
        AsyncStorage.removeItem('permisos_check');
      },

      // --- GETTERS (Se definen como funciones dentro del store) ---
      isLoggedIn: () => !!get().token,
      
      username: () => get().userData?.username || '',
      
      isSuperUser: () => get().userData?.is_superuser || false,
      
      groups: () => get().userData?.groups || [],

      hasGroup: (groupName) => {
        const { userData } = get();
        if (userData?.is_superuser) return true;
        return userData?.groups?.includes(groupName) || false;
      },

      systemName: () => {
        const userData = get().userData;
        const userGroups = userData?.groups || [];
        const Sistema1 = ['Guardia', 'Movil', 'Admin'];

        if (userData?.is_superuser) return 'Panel de Control General';
        if (userGroups.some((grupo) => Sistema1.includes(grupo))) {
          return 'Sistema de Inventario Vehicular';
        }
        return 'Sistema Estándar';
      },
    }),
    {
      name: 'auth-storage', // Nombre de la llave en AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);