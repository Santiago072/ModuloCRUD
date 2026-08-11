# Documentación Técnica del Sistema

| Documento | Descripción |
|-----------|-------------|
| 📋 [Especificación de Requisitos](Especificacion_Requisitos.md) | Objetivos, RNF, modelo de datos, justificaciones de stack |
| 📋 [Plan de Implementación](PLAN_IMPLEMENTACION.md) | Fases del proyecto y estado actual |

---

## 1. Arquitectura de Carpetas (Estado actual del proyecto)
```text
ModuloCRUD/
├── frontend/                    # PWA — React + Vite
│   └── src/
│       ├── components/          # Componentes reutilizables (NetworkStatus)
│       ├── db/                  # Capa de datos local (Dexie.js / IndexedDB)
│       │   ├── schema.js        # Definición de tablas (personas, contactos, encuestas)
│       │   └── repositories/    # Abstracción CRUD por entidad (Repository Pattern)
│       │       ├── personaRepository.js
│       │       └── contactoRepository.js
│       ├── features/            # Módulos por funcionalidad
│       │   └── personas/
│       │       ├── PersonaForm.jsx   # Formulario con autocompletado y validación
│       │       ├── PersonaList.jsx   # Lista reactiva con Live Search
│       │       └── PersonaDetail.jsx # Modal de detalles, edición y eliminación
│       ├── hooks/               # Custom hooks
│       │   ├── useNetworkStatus.js  # Detecta estado de red (online/offline)
│       │   └── useSyncManager.js    # Sincronización automática al reconectar
│       ├── pages/               # Páginas / vistas principales
│       │   └── HomePage.jsx     # Página principal
│       ├── store/               # Estado global Zustand (MVVM — ViewModel)
│       │   └── usePersonaStore.js
│       └── utils/               # Utilidades
│           ├── validationSchemas.js # Esquemas Zod compartibles
│           └── exportUtils.js       # Utilidad para exportación a CSV nativa
├── backend/                     # API REST — Node.js + Express
│   ├── config/db.js             # Pool de conexiones MySQL (mysql2)
│   ├── controllers/             # Lógica de negocio
│   │   ├── personaController.js # CRUD personas (con transacción + primer contacto)
│   │   ├── contactoController.js# Algoritmo de rotación de prioridades (1→2→3→archivo)
│   │   └── syncController.js    # Endpoint POST /api/sync (recibe cola offline)
│   ├── routes/api.js            # Definición de todas las rutas
│   ├── index.js                 # Punto de entrada del servidor Express
│   └── Dockerfile               # Imagen Docker del backend
├── docker-compose.yml           # Orquestación de 3 servicios (db, backend, frontend)
├── deploy.sh                    # Script de actualización en el VPS
├── BD.txt                       # Script SQL inicial de la base de datos
└── docs/                        # Documentación del proyecto
```

---

## 2. API REST — Endpoints disponibles

### Base URL: `http://localhost:3000/api` (local) / `https://modulocrud.slscode.online/api` (VPS)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/status` | Verifica conexión de la API con la BD |
| `GET` | `/api/personas` | Lista todas las personas registradas |
| `POST` | `/api/personas` | Crea una persona y sus contactos iniciales |
| `PUT` | `/api/personas/:id` | Actualiza los datos de una persona |
| `DELETE` | `/api/personas/:id` | Elimina una persona y sus contactos (Cascade) |
| `POST` | `/api/contactos` | Agrega un contacto con rotación de prioridades |
| `POST` | `/api/sync` | Recibe lote de registros offline del Service Worker |
| `POST` | `/api/auth/login` | Inicia sesión en el panel de administrador (JWT) |
| `PUT` | `/api/auth/password` | Cambia la contraseña del administrador (Bcrypt) |
| `GET` | `/api/encuestadores` | Lista los encuestadores activos e inactivos |
| `POST` | `/api/encuestadores` | Crea un nuevo encuestador |
| `PUT` | `/api/encuestadores/:id` | Habilita/Deshabilita el estado de un encuestador |
| `DELETE`| `/api/encuestadores/:id` | Elimina lógicamente un encuestador |
| `GET` | `/api/stats` | Obtiene estadísticas (Total personas, ranking encuestadores) |

### Ejemplo — POST `/api/personas`
```json
{
  "cc": "1023456789",
  "nombres": "Juan Carlos",
  "apellidos": "Pérez García",
  "fecha_registro": "2026-06-26",
  "profesion": "Ingeniero",
  "contacto": { "tipo": "celular", "valor": "3001234567" }
}
```

### Ejemplo — POST `/api/contactos` (Rotación automática)
```json
{
  "persona_id": 1,
  "tipo": "celular",
  "valor": "3109876543"
}
```
> El contacto anterior (prioridad 1) pasa a prioridad 2. Si ya hay 3, el de prioridad 3 se archiva (`activo = false`).

---

## 3. Flujo de Datos Bidireccional — Offline-First Avanzado

El sistema utiliza un enfoque híbrido donde IndexedDB (mediante Dexie.js) actúa como la única fuente de la verdad para el Frontend, y MySQL en el VPS es el repositorio central histórico.

### Fase 1: Pull (Descarga completa / Reconexión / Limpieza)
Cuando el usuario abre la aplicación o recupera la conexión a Internet (`navigator.onLine = TRUE`):
```text
syncData() (Frontend) 
       ↓ 
GET /api/sync (Node.js extrae TODO de MySQL) 
       ↓ 
PersonaRepository.syncFromServer (Inyecta/Actualiza en IndexedDB)
       ↓
(Lógica de limpieza): Borra localmente las encuestas que fueron eliminadas en otros dispositivos.
```
Esto asegura que un celular que recién se conecta vea exactamente las mismas encuestas que se registraron desde un PC.

### Fase 2: Push Proactivo (Subida ultra-rápida de trabajo offline)
Para evitar bloqueos y lentitud, al guardar, crear o eliminar una persona/contacto, el sistema ejecuta un *Debounce de 500ms* y lanza un **Push Exclusivo** (sin necesidad de hacer Pull previo):
```text
PersonaRepository.getPendingSync (Busca registros 'local' y 'deleted')
       ↓
POST /api/sync (Envía lote al Node.js)
       ↓
syncController.syncOfflineData:
  1. Si es 'deleted', elimina de MySQL (Soft Delete local -> Hard Delete remoto)
  2. Si es 'local', hace UPSERT en MySQL (basado en CC) y reemplaza contactos.
       ↓
PersonaRepository.markAsSynced (Actualiza a 'synced' o elimina de IndexedDB si era 'deleted')
```

---

## 4. Despliegue en VPS (Puerto 8893)
```bash
# Clonar el repositorio
git clone https://github.com/Santiago072/ModuloCRUD.git
cd ModuloCRUD

# Dar permisos y desplegar
chmod +x deploy.sh
./deploy.sh
```

Configurar Nginx para el subdominio `modulocrud.slscode.online` con los puertos del VPS:
```nginx
server {
    listen 80;
    server_name modulocrud.slscode.online;

    location / {
        proxy_pass http://127.0.0.1:8893; # Frontend
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://127.0.0.1:8894; # Backend
        proxy_set_header Host $host;
    }
}
```
Luego activar HTTPS con: `sudo certbot --nginx -d modulocrud.slscode.online`

---

## 5. Seguridad del Sistema (v1.3.1)

### 5.1 CORS — Lista Blanca de Orígenes

El servidor Express acepta peticiones cross-origin **solo** de los dominios definidos en
`ALLOWED_ORIGINS` dentro del archivo `.env`:

```env
# Separados por coma, sin espacios
ALLOWED_ORIGINS=https://modulocrud.slscode.online,http://localhost:8893
```

**Comportamiento:**
| Tipo de petición | Resultado |
|---|---|
| Origen en la lista blanca | ✅ Permitida |
| Origen desconocido (otro dominio) | ❌ Error CORS |
| Sin cabecera `Origin` (Postman, curl, PWA nativa) | ✅ Permitida |

**¿Por qué importa?** Sin esta restricción cualquier sitio web podría hacer peticiones
a la API usando las credenciales del usuario víctima desde su navegador.

---

### 5.2 JWT — Autenticación por Token

Cada encuestador o administrador que hace login recibe un **JSON Web Token (JWT)**
firmado con la clave `JWT_SECRET`. Este token dura **30 días** para soportar trabajo
en zonas rurales sin conexión prolongada.

```env
# Generarlo con:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=tu_clave_de_512_bits_aqui
```

**Reglas críticas:**
- ❌ **Nunca** usar el mismo `JWT_SECRET` en desarrollo y producción.
- ❌ **Nunca** subir `.env` al repositorio (ya está en `.gitignore`).
- ✅ Si el servidor arranca sin `JWT_SECRET`, **termina con error** (fail-safe).

---

### 5.3 Seguridad Offline — SHA-256 y Auto-Lock

Los datos en `IndexedDB` (Dexie.js) están protegidos localmente por:

1. **Hash SHA-256 de contraseña**: Al hacer login offline, la app verifica el hash
   local sin necesidad de llamar al servidor.
2. **Auto-Lock por inactividad**: Tras 15 minutos sin actividad (mouse, teclado o táctil)
   la pantalla se bloquea automáticamente mostrando el componente `LockScreen`.

---

### 5.4 Variables de Entorno Requeridas

Al clonar el repositorio, el primer paso es crear el `.env`:

```bash
cp .env.example .env
# Luego editar .env con valores reales
```

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DB_HOST` | ✅ | Host de la base de datos (generalmente `db` en Docker) |
| `DB_NAME` | ✅ | Nombre de la base de datos |
| `DB_USER` | ✅ | Usuario de MySQL/MariaDB |
| `DB_PASSWORD` | ✅ | Contraseña de MySQL/MariaDB |
| `PORT` | ✅ | Puerto del servidor Node.js (default: `3000`) |
| `JWT_SECRET` | ✅ | Clave criptográfica de 512 bits para firmar JWT |
| `ALLOWED_ORIGINS` | ✅ | Dominios permitidos en CORS (separados por coma) |
| `VITE_API_URL` | ✅ | URL de la API usada durante el build de React |

> **El backend no arrancará si `JWT_SECRET` o `ALLOWED_ORIGINS` están ausentes.**

---

## 5. Pruebas Automatizadas (Unit & Integration Testing)

El backend incluye una suite de pruebas automatizadas utilizando el test runner nativo de **Node.js 20 (`node:test` y `node:assert`)** para garantizar rendimiento y eliminar dependencias pesadas:

| Suite | Archivo | Pruebas | Cobertura / Qué valida |
|---|---|:---:|---|
| **Auth & Bcrypt/JWT** | `backend/tests/auth.test.js` | 4 | Hashing Bcrypt, comparación de contraseñas, firma y decodificación de tokens JWT, rechazo de tokens alterados y expirados |
| **Seguridad CORS** | `backend/tests/cors.test.js` | 4 | Verificación estricta de lista blanca (`ALLOWED_ORIGINS`), autorización de dominios de producción/locales y rechazo (403) de orígenes no autorizados |
| **Auth Middleware** | `backend/tests/middleware.test.js` | 3 | Respuestas 403 ante ausencia de header `Authorization`, 401 ante tokens malformados y paso exitoso `next()` con adjunto de `req.user` |

### Comandos de Ejecución

```bash
# Backend (Pruebas unitarias nativas)
cd backend
npm test

# Frontend (Análisis estático y compilación)
cd frontend
npm run lint
npm run build
```

---

## 6. CI/CD — Integración Continua (GitHub Actions)

El archivo [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) define un pipeline
automático que se ejecuta en cada `push` o `pull_request` a la rama `main`.


### Jobs del Pipeline

```
Push a main
    ├── Job: backend (Ubuntu)
    │       ├── Checkout del repo
    │       ├── Node.js 20 + caché npm
    │       ├── npm ci  ← instalación reproducible
    │       └── npm test
    │
    └── Job: frontend (Ubuntu)
            ├── Checkout del repo
            ├── Node.js 20 + caché npm
            ├── npm ci  ← instalación reproducible
            ├── npm run lint  ← análisis estático con oxlint
            └── npm run build  ← compilación Vite de producción
```

### ¿Por qué se usa `npm ci` en lugar de `npm install`?

`npm ci` instala **exactamente** las versiones del `package-lock.json`, garantizando
que el CI use las mismas dependencias que el desarrollador. `npm install` puede actualizar
versiones menores automáticamente, lo que puede introducir bugs inesperados.

### Ver resultados del CI

Ir a: `https://github.com/Santiago072/ModuloCRUD/actions`

Un ✅ verde confirma que el push pasó lint, tests y build. Un ❌ rojo indica qué
paso falló y muestra el log completo.

---

## 7. Convenciones del Proyecto

### Estructura del árbol de archivos actualizado (v1.3.1)

```text
ModuloCRUD/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI — GitHub Actions
├── frontend/                   # PWA — React + Vite
│   └── src/ ...                # (ver sección 1)
├── backend/                    # API REST — Node.js + Express
│   ├── config/db.js
│   ├── controllers/
│   ├── middlewares/
│   │   └── authMiddleware.js   # Verificación de JWT en rutas protegidas
│   ├── routes/
│   ├── index.js                # Entrada: CORS + validación de env + rutas
│   └── Dockerfile
├── docs/
│   ├── ARQUITECTURA.md         # Diagramas Mermaid de componentes y flujos
│   ├── CHANGELOG.md            # Historial de versiones
│   ├── CONTRIBUTING.md         # Guía para colaboradores
│   ├── DESPLIEGUE_VPS.md
│   ├── documentacion-tecnica.md
│   ├── Especificacion_Requisitos.md
│   ├── MANUAL_USUARIO.md
│   └── PLAN_IMPLEMENTACION.md
├── nginx/                      # Configuración del proxy inverso
├── .env.example                # Plantilla de variables de entorno
├── .gitignore                  # Excluye: .env, node_modules, dist, .vscode
├── BD.txt                      # Script SQL inicial (montado en Docker)
├── deploy.sh                   # Script de actualización en VPS
├── docker-compose.yml          # Orquestación de 3 servicios
├── LICENSE                     # Licencia MIT
└── README.md                   # Punto de entrada principal
```
