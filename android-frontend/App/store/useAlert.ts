import { create } from 'zustand';

interface AlertState {
    visible: boolean;
    titulo: string;
    contenido: string;
    aceptar: string;
    cancelar?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    showAlert: (params: Omit<AlertState, 'visible' | 'showAlert' | 'hideAlert'>) => void;
    hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    visible: false,
    titulo: '',
    contenido: '',
    aceptar: 'Aceptar',
    showAlert: (params) => set({ ...params, visible: true }),
    hideAlert: () => set({ visible: false })
}));