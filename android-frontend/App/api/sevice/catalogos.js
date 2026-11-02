import { crudApi, filtrarPayload } from "@/App/api/crud";

/**
 * ============================================================================
 * MÓDULO API: CATÁLOGOS
 * ============================================================================
 * Wrapper estandarizado para las operaciones CRUD del endpoint "catalogos".
 * Todas las funciones comparten el mismo flujo: construyen la URL dinámica, 
 * ejecutan la petición correspondiente y manejan la resolución/rechazo de 
 * la promesa devolviendo los datos directamente o a través de callbacks.
 * * --- DICCIONARIO DE PARÁMETROS ---
 * @param {string} key - Sub-catálogo a consultar (ej. "roles"). En GET puede ser nulo para ir a la raíz.
 * @param {object} payload - Datos de envío (Query string en GET, Body en POST/PUT/PATCH). Pasa por filtrarPayload().
 * @param {string|number} id - Identificador único del registro para operaciones directas.
 * @param {function} onSuccess - Callback opcional. Si existe, procesa la data exitosa; si no, la función retorna la data.
 * @param {function} onError - Callback opcional. Si existe, procesa el error; si no, la función hace un 'throw' del error.
 * * --- MAPEO DE FUNCIONES ---
 * catalogosGet     (key, payload, onSuccess, onError)     => GET general (getAll)
 * catalogosGetId   (key, id, onSuccess, onError)          => GET por ID (getById)
 * catalogosPost    (key, payload, onSuccess, onError)     => POST (create)
 * catalogosUpdate  (key, payload, id, onSuccess, onError) => PUT (update completo)
 * catalogosPatch   (key, payload, id, onSuccess, onError) => PATCH (update parcial)
 * catalogosDelete  (key, id, onSuccess, onError)          => DELETE (remove)
 * ============================================================================
 */

const endpoint = "catalogos";

const normalizarRespuesta = (res) => {
    if (res && typeof res === 'object' && 'data' in res && res.data !== undefined) {
        return res.data;
    }
    return res;
};

const catalogosGet = (key, payload = {}, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = key ? crudApi(`${endpoint}/${key}`) : crudApi(endpoint);
    return urlFinal.getAll(filtrarPayload(payload), {}, opts).then(normalizarRespuesta);
};

const catalogosGetId = (key, id, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.getById(id, {}, opts).then(normalizarRespuesta);
};

const catalogosPost = (key, payload = {}, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.create(filtrarPayload(payload), {}, opts).then(normalizarRespuesta);
};

const catalogosUpdate = (key, payload = {}, id, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.update(id, filtrarPayload(payload), {}, opts).then(normalizarRespuesta);
};

const catalogosPatch = (key, payload = {}, id, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.patch(id, filtrarPayload(payload), {}, opts).then(normalizarRespuesta);
};

const catalogosDelete = (key, id, options = {}) => {
    const opts = (typeof options === 'object' && options !== null && typeof options !== 'function') ? options : {};
    const urlFinal = crudApi(`${endpoint}/${key}`);
    return urlFinal.remove(id, {}, opts).then(normalizarRespuesta);
};

export {
    catalogosGet,
    catalogosGetId,
    catalogosPost,
    catalogosUpdate,
    catalogosPatch,
    catalogosDelete
};