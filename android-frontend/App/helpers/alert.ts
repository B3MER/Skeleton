import { useAlertStore } from '@/App/store/useAlert';

const alertaBasica = (
    titulo: string = 'Titulo',
    contenido: string = 'Contenido',
    aceptar: string = 'Aceptar',
    cancelar?: string,
    onSuccess?: () => any,
    onCancel?: () => any,
): void => {
    useAlertStore.getState().showAlert({
        titulo,
        contenido,
        aceptar,
        cancelar,
        onSuccess,
        onCancel,
    });
};

export default alertaBasica;