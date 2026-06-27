# 📋 Plan de Implementación: Módulo CRUD (PWA + Node.js)

Este documento describe la hoja de ruta para la construcción del Módulo CRUD, basándose en los diagramas de arquitectura PWA, normalización de base de datos y requisitos de trabajo offline.

---

## 🛠️ Stack Tecnológico Definitivo
* **Frontend (PWA):** React 18, Vite, Tailwind CSS, Zustand (Estado), React Hook Form + Zod (Validación).
* **Almacenamiento Local (Offline):** IndexedDB a través de Dexie.js.
* **Backend (API REST):** Node.js con Express.js.
* **Base de Datos Central:** MySQL o PostgreSQL (En el VPS).
* **Despliegue:** VPS Ubuntu/Debian, Nginx (Proxy inverso), PM2 (Manejo de Node.js), Let's Encrypt (HTTPS).
* **Android:** Empaquetado a APK usando TWA / Bubblewrap.

---

## 📅 Fases de Desarrollo

### Fase 1: Inicialización y Arquitectura Base (📍 Actual)
- [x] Definición de arquitectura (PWA Offline-First + API Node.js).
- [x] Configuración de subdominio (`modulocrud.slscode.online`).
- [x] Creación de documentación base y repositorio.
- [x] Inicializar proyecto Frontend (React + Vite).
- [x] Inicializar proyecto Backend (Node.js + Express).
- [x] Configuración de Docker (docker-compose, Dockerfiles y deploy.sh).

### Fase 2: Diseño de Base de Datos y Backend (API)
- [x] **Modelado BD Central (MySQL/PG):**
  - Crear tabla `personas` (id, cc, nombres, apellidos, profesion...).
  - Crear tabla `contactos` (1:N, reemplazando las columnas fijas para rotación dinámica).
  - Crear tabla `encuestas` (1:N).
- [x] **Desarrollo API REST (Node.js):**
  - Configurar conexión a BD.
  - Endpoints CRUD para encuestas/personas.
  - Endpoint especial `/api/sync` para recibir lotes de datos offline.

### Fase 3: Desarrollo Frontend (PWA) y Offline-First
- [x] **Configuración Local (Dexie.js):**
  - Esquema de tablas en `src/db/schema.js`.
  - Repositories: `personaRepository.js` (con transacciones), `contactoRepository.js` (rotación).
- [x] **Interfaz de Usuario (UI):**
  - `PersonaForm.jsx`: Formulario con React Hook Form + Zod.
  - `PersonaList.jsx`: Lista reactiva con `useLiveQuery` de Dexie.
  - Indicador visual de red: `NetworkStatus.jsx`.
- [x] **Configuración PWA:**
  - Plugin `vite-plugin-pwa` instalado y configurado en `vite.config.js`.
  - Web Manifest con nombre, colores, iconos y modo standalone.
  - Service Worker configurado con Workbox.

### Fase 4: Sincronización (Capa de Conectividad)
- [x] **Background Sync:**
  - Hook `useNetworkStatus.js` detecta `navigator.onLine` en tiempo real.
  - Hook `useSyncManager.js`: Guarda en Dexie → detecta internet → POST `/api/sync` → `markAsSynced()`.
  - Campo `sync_status` ('local'/'synced'/'conflict') garantiza integridad y detección de conflictos.
- [x] **Exportación de Datos:**
  - Exportación nativa a CSV implementada (sin dependencias extra).

### Fase 5: Despliegue y Empaquetado Android
- [x] **VPS (Docker + Nginx):**
  - `docker-compose.yml` orquesta 3 contenedores: `db`, `backend`, `frontend`.
  - `.env.example` con todas las variables de entorno requeridas.
  - `deploy.sh` mejorado: valida `.env`, reconstruye y muestra estado de contenedores.
  - `nginx/modulocrud.conf`: Proxy inverso — Frontend en puerto 8893, API en 3000.
  - Documentación completa en `docs/DESPLIEGUE_VPS.md` (primer deploy, actualizaciones, diagnóstico).
- [ ] **Android APK:**
  - Pendiente: usar Bubblewrap para convertir la PWA a `.apk` instalable.
