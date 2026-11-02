import { crudApi, filtrarPayload } from "@/App/api/crud";

/**
 * ============================================================================
 * MÓDULO API: REGISTROS
 * ============================================================================
 * Wrapper estandarizado para las operaciones CRUD del endpoint "registros".
 * Permite interactuar con los módulos operativos (ej. "ejemplo").
 */

const endpoint = "registros";

const normalizarRespuesta = (res) => {
    if (res && typeof res === 'object' && 'data' in res && res.data !== undefined) {
        return res.data;
    }
    return res;
};

export const registrosGet = (key, payload = {}, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = key ? crudApi(`${endpoint}/${key}`) : crudApi(endpoint);
    return urlFinal.getAll(filtrarPayload(payload), {}, opts).then(normalizarRespuesta);
};

export const registrosGetId = (key, id, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.getById(id, {}, opts).then(normalizarRespuesta);
};

export const registrosPost = (key, payload = {}, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.create(filtrarPayload(payload), {}, opts).then(normalizarRespuesta);
};

export const registrosUpdate = (key, payload = {}, id, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.update(id, filtrarPayload(payload), {}, opts).then(normalizarRespuesta);
};

export const registrosPatch = (key, payload = {}, id, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.patch(id, filtrarPayload(payload), {}, opts).then(normalizarRespuesta);
};

export const registrosDelete = (key, id, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.remove(id, {}, opts).then(normalizarRespuesta);
};
