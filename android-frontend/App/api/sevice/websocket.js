/**
 * ============================================================================
 * MÓDULO API: WEBSOCKET SERVICE (Patrón Singleton + Pub/Sub)
 * ============================================================================
 * Gestor centralizado para conexiones WebSocket en la aplicación.
 * Evita instanciar sockets manualmente en vistas o stores y homologa la
 * lectura de paquetes bajo el estándar de response.py del backend:
 *   { error: "Éxito", message: "<evento>", code: 200 | 201, data: { ... } }
 * ============================================================================
 */

const getWsBaseUrl = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';
    return apiUrl
        .replace(/^https:\/\//i, 'wss://')
        .replace(/^http:\/\//i, 'ws://')
        .replace(/\/api\/?$/i, '')
        .replace(/\/+$/, '');
};

class WebSocketClient {
    constructor() {
        this.socket = null;
        this.currentPath = null;
        this.listeners = new Map();
    }

    /**
     * Abre conexión hacia un canal WebSocket (ej. "comision", 15 => /ws/comision/15/)
     * Si ya está conectado al mismo canal, reutiliza la conexión activa.
     */
    connect(resource, id = '') {
        const baseUrl = getWsBaseUrl();
        if (!baseUrl) return;

        const cleanResource = String(resource).replace(/^\/+|\/+$/g, '');
        const path = `/ws/${cleanResource}${id ? `/${id}` : ''}/`;

        if (this.socket && this.currentPath === path && this.socket.readyState <= 1) {
            return;
        }

        this.disconnect();

        try {
            const ws = new WebSocket(`${baseUrl}${path}`);
            this.socket = ws;
            this.currentPath = path;

            ws.onmessage = ( rawEvent ) => {
                try {
                    const payload = JSON.parse(rawEvent.data);
                    const eventName = payload?.message;
                    const data = payload?.data !== undefined ? payload.data : payload;

                    if (eventName && this.listeners.has(eventName)) {
                        this.listeners.get(eventName).forEach((cb) => cb(data, payload));
                    }

                    if (this.listeners.has('*')) {
                        this.listeners.get('*').forEach((cb) => cb(data, payload));
                    }
                } catch {
                    // Ignorar paquetes que no sean JSON válido
                }
            };

            ws.onclose = () => {
                if (this.socket === ws) {
                    this.socket = null;
                    this.currentPath = null;
                }
            };
        } catch {
            this.socket = null;
            this.currentPath = null;
        }
    }

    /**
     * Suscribe un callback a un evento específico (identificado por `message` de response.py).
     * Retorna una función para cancelar la suscripción.
     */
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);

        return () => this.off(eventName, callback);
    }

    /**
     * Elimina un callback de un evento o limpia todos los callbacks de ese evento.
     */
    off(eventName, callback) {
        if (!this.listeners.has(eventName)) return;
        if (!callback) {
            this.listeners.delete(eventName);
            return;
        }
        const set = this.listeners.get(eventName);
        set.delete(callback);
        if (set.size === 0) {
            this.listeners.delete(eventName);
        }
    }

    /**
     * Envía un mensaje JSON al servidor si el socket está abierto.
     */
    send(message, data = {}) {
        if (this.socket && this.socket.readyState === 1) {
            this.socket.send(JSON.stringify({ message, data }));
        }
    }

    /**
     * Cierra la conexión activa.
     */
    disconnect() {
        if (this.socket) {
            try {
                this.socket.close();
            } catch {
                // Ignorar error al cerrar
            }
            this.socket = null;
            this.currentPath = null;
        }
    }
}

const wsService = new WebSocketClient();

const wsConnect = (resource, id = '') => wsService.connect(resource, id);
const wsDisconnect = () => wsService.disconnect();
const wsOn = (eventName, callback) => wsService.on(eventName, callback);
const wsOff = (eventName, callback) => wsService.off(eventName, callback);
const wsSend = (message, data = {}) => wsService.send(message, data);

export {
    wsService,
    wsConnect,
    wsDisconnect,
    wsOn,
    wsOff,
    wsSend,
};
