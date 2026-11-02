import axios from "axios";
import { useUserStore } from '@/App/store/auth';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL, 
    timeout: 30000,
});

// Intercepta la petición
api.interceptors.request.use(
    (config) => {
        // Obtener el token del estado actual
        const token = useUserStore.getState().token;
        
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }

        if (config.customHeader && Object.keys(config.customHeader).length > 0) {
            Object.assign(config.headers, config.customHeader);
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// Intercepta la respuesta
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Validación del error devuelto por el servidor
        if (error.response && error.response.data) {
            const dataDelServidor = error.response.data;
            const httpStatus = error.response.status;

            if (httpStatus === 401 || dataDelServidor.code === 401) {
                useUserStore.getState().logout(); 
            }
        }
        return Promise.reject(error);
    }
);

export default api;