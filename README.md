# Skeleton (Base Boilerplate)

Plantilla base para proyectos full-stack compuestos por **Backend (Django REST Framework + PostgreSQL)** y **Frontend Móvil (React Native + Expo para Android)**.

---

# Backend

## Sistema Base - API REST

Plantilla base para la arquitectura y servicios backend.

---

## Requisitos Previos

- Docker (v20+ o superior)
- Docker Compose (v2+)

---

## 1. Configuración de Variables de Entorno

Antes de iniciar los contenedores, crea o edita el archivo de entorno en la ruta `backend/.env`:

```env
# -------------- Backend ------------------
DEBUG=True

# Claves de seguridad
SECRET_KEY=clave_secreta_para_desarrollo

# Conexión a la base de datos PostgreSQL
POSTGRES_DB=skeleton_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=contraseña_segura
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

---

## 2. Construir y Levantar los Servicios

Desde la raíz del proyecto (`Skeleton/`):

### 1. Construir la imagen del backend:

```bash
docker compose build
```

### 2. Levantar los contenedores en segundo plano:

```bash
docker compose up -d
```

### 3. Verificar el estado de los contenedores:

```bash
docker compose ps
```

### 4. Apagar un contenedor:

```bash
docker stop [nombre_del_contenedor]
```

### 5. Encender un contenedor:

```bash
docker start [nombre_del_contenedor]
```

Ambos servicios (`skeleton_back` y `skeleton_db`) deben encontrarse en estado **Up / healthy**.

Los nombres de los contenedores se encuentran definidos mediante `container_name` en `docker-compose.yml`:

- `skeleton_db`: Contenedor con PostgreSQL 17.
- `skeleton_back`: Contenedor con la aplicación Django en Daphne / Gunicorn.

---

## 3. Inicialización de la Base de Datos

### Opción A: Si inicias con una base de datos limpia

Ejecuta las migraciones y crea el usuario administrador:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

---

### Opción B: Si se realiza un respaldo (.dump de PostgreSQL)

Restaura el archivo directamente al contenedor de base de datos:

```bash
docker compose exec -T db pg_restore -U postgres -d skeleton_db --no-owner --clean --if-exists < /ruta/hacia/el_backup.dump
```

Luego aplica las migraciones recientes para sincronizar columnas nuevas:

```bash
docker compose exec backend python manage.py migrate
```

---

## 4. Accesos del Sistema

Una vez arriba el sistema:

- **API REST:** `http://localhost:8008/api/v1/`
- **Documentación ReDoc:** `http://localhost:8008/api/v1/schema/redoc/`
- **Documentación Swagger UI:** `http://localhost:8008/api/v1/schema/swagger-ui/`
- **Administrador Django:** `http://localhost:8008/admin/`

---

## Comandos Útiles del Backend

| Acción | Comando |
| :--- | :--- |
| Ver logs del backend | `docker compose logs -f backend` |
| Ver logs de la base de datos | `docker compose logs -f db` |
| Entrar a la consola de Django | `docker compose exec backend bash` |
| Entrar a la base de datos (psql) | `docker compose exec db psql -U postgres -d skeleton_db` |
| Detener contenedores (sin borrar datos) | `docker compose stop` |
| Reanudar contenedores | `docker compose start` |
| Apagar contenedores | `docker compose down` |
| Reconstruir tras cambios en código | `docker compose up -d --build backend` |

---

# Frontend (Android)

Aplicación móvil desarrollada con **React Native**, **Expo**, **TypeScript** y estilos con **NativeWind / Tailwind CSS**.

---

## Requisitos Previos

- **Node.js** (v18 o superior recomendado, compatible con Node v20/v22)
- **npm** (gestor de paquetes de Node)
- Dispositivo Android con la aplicación **Expo Go** instalada, o un emulador de Android configurado con Android Studio.

---

## 1. Instalación de Dependencias

Ingresa a la carpeta del frontend y ejecuta la instalación:

```bash
cd android-frontend
npm install
```

---

## 2. Iniciar en Modo Desarrollo

Para arrancar el servidor de desarrollo de Metro/Expo:

```bash
npm run start
```

Una vez levantado el servidor:
- **En dispositivo físico:** Escanea el código QR mostrado en la terminal desde la app **Expo Go** (asegúrate de estar en la misma red Wi-Fi).
- **En emulador Android:** Presiona la tecla `a` en la terminal o ejecuta directamente:
  ```bash
  npm run android
  ```

---

## 3. Generar Build para Android (APK / AAB)

Existen dos métodos para compilar la aplicación para Android:

### Opción A: Compilación con EAS Build (Recomendado)

Utiliza la infraestructura en la nube de Expo para generar el instalador `.apk` sin requerir Android Studio configurado localmente:

1. **Instalar EAS CLI globalmente:**
   ```bash
   npm install -g eas-cli
   ```

2. **Iniciar sesión en Expo:**
   ```bash
   eas login
   ```

3. **Configurar el proyecto (solo la primera vez):**
   ```bash
   eas build:configure
   ```

4. **Generar APK instalable:**
   ```bash
   eas build -p android --profile preview
   ```
   *Al finalizar, la terminal te proporcionará el enlace directo para descargar el archivo `.apk`.*

---

### Opción B: Compilación Local (Requiere Android Studio y Java JDK)

Si prefieres compilar directamente en tu equipo con Gradle:

1. **Generar la carpeta nativa de Android:**
   ```bash
   npm run prebuild
   ```

2. **Compilar el archivo APK con Gradle:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. El archivo `.apk` resultante se encontrará en:
   ```text
   android/app/build/outputs/apk/release/app-release.apk
   ```
