import api from "@/App/api/config";

const crudApi = (resource) => {
    const buildUrl = (id = "") => `/${resource}${id ? `/${id}/` : "/"}`;

    return {
        getAll: (params, customHeader = {}, options = {}) => {
            return api.get(buildUrl(), { params, ...options, customHeader });
        },

        getById: (id, customHeader = {}, options = {}) => {
            return api.get(buildUrl(id), { ...options, customHeader });
        },

        create: (data, customHeader = {}, options = {}) => {
            return api.post(buildUrl(), data, { ...options, customHeader });
        },

        update: (id, data, customHeader = {}, options = {}) => {
            return api.put(buildUrl(id), data, { ...options, customHeader });
        },

        patch: (id, data, customHeader = {}, options = {}) => {
            return api.patch(buildUrl(id), data, { ...options, customHeader });
        },

        remove: (id, customHeader = {}, options = {}) => {
            return api.delete(buildUrl(id), { ...options, customHeader });
        },
    };
};
//limpia el objeto dado como payload [En eliminacion, dentro de pruebas]
const filtrarPayload = (formData) => {
    console.log(formData);
    
    // 1. Evita filtrar los archivos dentro de un FormData
    if (formData instanceof FormData) {
        if (!formData.has('activo')){
            formData.append('activo', true)
        }
        return formData;
    }

    // 2. SOPORTE BULK (DRY): Si es un arreglo de registros, mapea y filtra cada uno individualmente
    if (Array.isArray(formData)) {
        return formData.map(item => filtrarPayload(item));
    }

    // 3. Tu lógica original para limpiar objetos individuales
    const datosFiltrados = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value === "" || value === null) {
            return acc;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            Object.entries(value).forEach(([innerKey, innerValue]) => {
                if (innerValue !== "" && innerValue !== null) {
                    acc[innerKey] = innerValue;
                }
            });
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});

    return datosFiltrados;
};

export { crudApi, filtrarPayload };