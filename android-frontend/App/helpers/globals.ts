import alertaBasica from "./alert";

interface datos {
    code: Number;
    data: Object | null | void | undefined
    error: String
    message: String
}

export function dataClean(data: datos) {
    return data.data
}

export function errorHandler(
    error: any,
    onSuccess?: () => void,
    oncancel?: () => void
) {
    if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') {
        return;
    }

    const dataServidor = error?.response?.data;
    const titulo: string = dataServidor?.error || (error?.response?.status ? `Error ${error.response.status}` : "Error de conexión");

    let mensaje: string = "";
    if (dataServidor?.message) {
        mensaje = String(dataServidor.message);
    } else if (dataServidor?.detail) {
        mensaje = String(dataServidor.detail);
    } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
        mensaje = "El servidor tardó demasiado en responder. Verifica tu conexión.";
    } else if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
        mensaje = "No fue posible conectar con el servidor. Revisa tu red o conexión Wi-Fi.";
    } else if (error?.message) {
        mensaje = String(error.message);
    } else {
        mensaje = "Ha ocurrido un error inesperado, si el problema persiste favor de contactar a soporte técnico.";
    }

    alertaBasica(titulo, mensaje, "Aceptar", "", onSuccess, oncancel);
}

export function debounce<T extends (...args: any[]) => any>(
    funcion: T,
    tiempo: number = 350,
    setLoading?: (estado: boolean) => void
) {
    let delay: ReturnType<typeof setTimeout> | null = null;

    const debounced = function (...args: Parameters<T>) {
        if (delay) clearTimeout(delay);

        setLoading?.(true);

        delay = setTimeout(async () => {
            try {
                await funcion(...args);
            } finally {
                setLoading?.(false);
                delay = null;
            }
        }, tiempo);
    };

    debounced.cancel = () => {
        if (delay) {
            clearTimeout(delay);
            delay = null;
        }
        setLoading?.(false);
    };

    debounced.flush = async (...args: Parameters<T>) => {
        if (delay) {
            clearTimeout(delay);
            delay = null;
        }
        try {
            await funcion(...args);
        } finally {
            setLoading?.(false);
        }
    };

    return debounced;
}

export const validarHorario = (tipo: string | Array<string>) => {
    // const ahora = new Date();
    // const horas = ahora.getHours();
    // const minutos = ahora.getMinutes();

    // const horaFormateada = horas + (minutos / 100);

    // const esDiurno = horaFormateada >= 6.00 && horaFormateada < 20.00;
    // const esNocturno = horaFormateada >= 18.00 && horaFormateada < 20.00;

    // if (Array.isArray(tipo)) {
    //     const resultado: { diurnos?: boolean; nocturnos?: boolean } = {};

    //     tipo.forEach((value) => {
    //         const tipoMin = value?.toLowerCase();
    //         if (tipoMin?.includes('diurno')) {
    //             resultado.diurnos = esDiurno;
    //         }
    //         if (tipoMin?.includes('nocturno')) {
    //             resultado.nocturnos = esNocturno;
    //         }
    //     });

    //     return resultado; 
    // }

    // const tipoMin = tipo?.toLowerCase();
    // if (tipoMin?.includes('diurno')) {
    //     return esDiurno;
    // }
    // if (tipoMin?.includes('nocturno')) {
    //     return esNocturno;
    // }

    return true;
};

export function formatearFecha(
    fecha?: string | number | Date | null,
    opciones: Intl.DateTimeFormatOptions = { dateStyle: 'short', timeStyle: 'short' },
    fallback: string = 'N/A',
    locale: string = 'es-MX'
): string {
    if (!fecha) return fallback;
    try {
        const d = fecha instanceof Date ? fecha : new Date(fecha);
        if (isNaN(d.getTime())) return fallback;
        return d.toLocaleString(locale, opciones);
    } catch {
        return fallback;
    }
}

export function formatField<T = any>(
    value: T,
    fallback: string = 'Sin asignar',
    transform?: (val: T) => string
): string {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string' && value.trim() === '') return fallback;
    if (transform) return transform(value);
    return String(value);
}
