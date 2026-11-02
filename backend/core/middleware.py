import logging
import time
from datetime import datetime
from typing import Any

logger = logging.getLogger("core.request")

# Códigos de color ANSI para terminales / Docker
GRAY = "\033[90m"
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

METHOD_COLORS = {
    "GET": CYAN,
    "POST": GREEN,
    "PUT": YELLOW,
    "PATCH": YELLOW,
    "DELETE": RED,
    "OPTIONS": GRAY,
    "HEAD": GRAY,
}

SENSITIVE_KEYS = {"password", "token", "access_token", "refresh_token", "secret"}


def sanitize_data(data: Any) -> Any:
    """Oculta información sensible (contraseñas, tokens) en los logs."""
    if isinstance(data, dict):
        return {
            k: "***" if str(k).lower() in SENSITIVE_KEYS else sanitize_data(v)
            for k, v in data.items()
        }
    if isinstance(data, list):
        return [sanitize_data(item) for item in data]
    return data


def get_client_ip(request) -> str:
    """Obtiene la IP real del cliente considerando proxies / X-Forwarded-For."""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "127.0.0.1")


class ColoredRequestLoggingMiddleware:
    """
    Middleware que homologa los logs HTTP de todas las peticiones:
    Formato: [Fecha Hora] [IP] [MÉTODO] [URL] [CÓDIGO] (tiempo)
    Con códigos de color ANSI y desglose de errores 4xx / 5xx.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.monotonic()

        response = self.get_response(request)

        duration_ms = (time.monotonic() - start_time) * 1000

        self.log_request(request, response, duration_ms)

        return response

    def log_request(self, request, response, duration_ms: float) -> None:
        try:
            timestamp = datetime.now().strftime("%d/%b/%Y %H:%M:%S")
            ip = get_client_ip(request)
            method = request.method
            path = request.get_full_path()
            status_code = response.status_code
            reason = getattr(response, "reason_phrase", "")

            # Colores según método
            m_color = METHOD_COLORS.get(method, CYAN)

            # Colores según código HTTP
            if status_code < 300:
                s_color = GREEN
            elif status_code < 400:
                s_color = CYAN
            elif status_code < 500:
                s_color = YELLOW
            else:
                s_color = f"{RED}{BOLD}"

            # Línea principal homologada: [Fecha] [IP] MÉTODO RUTA STATUS (tiempo)
            line = (
                f"{GRAY}[{timestamp}] {ip:<15}{RESET} "
                f"{m_color}{method:<6}{RESET} "
                f"{path} "
                f"{s_color}{status_code} {reason} ({duration_ms:.0f}ms){RESET}"
            )

            # Si es un error (4xx o 5xx), anexar detalles de forma atómica
            if status_code >= 400 and hasattr(response, "data") and response.data:
                clean_errors = sanitize_data(response.data)

                if isinstance(clean_errors, dict) and "data" in clean_errors and clean_errors.get("data") is not None:
                    error_detail = clean_errors.get("data")
                else:
                    error_detail = clean_errors

                prefix_color = YELLOW if status_code < 500 else RED
                line += f"\n   {prefix_color}[DETALLES]:{RESET} {error_detail}"

            # Emisión usando el logger estándar (garantiza atomicidad de línea entre workers)
            if status_code >= 500:
                logger.error(line)
            elif status_code >= 400:
                logger.warning(line)
            else:
                logger.info(line)

        except Exception:
            # Nunca interrumpir el flujo de la petición por un error de logging
            pass

