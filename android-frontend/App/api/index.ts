export { 
    registrosDelete,
    registrosGet,
    registrosGetId,
    registrosPatch,
    registrosPost,
    registrosUpdate,
} from './sevice/registros';

export { 
    catalogosDelete,
    catalogosGet,
    catalogosGetId,
    catalogosPatch,
    catalogosPost,
    catalogosUpdate,
} from './sevice/catalogos';

export {
    wsService,
    wsConnect,
    wsDisconnect,
    wsOn,
    wsOff,
    wsSend,
} from './sevice/websocket';
