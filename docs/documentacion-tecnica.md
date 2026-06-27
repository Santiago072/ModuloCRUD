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

## 3. Flujo de Datos — Offline-First
```
Usuario → PersonaForm → usePersonaStore → PersonaRepository → IndexedDB (Dexie.js)
                                                                      ↓
                                                    (sync_status = 'local')
                                                                      ↓
                                             navigator.onLine = TRUE → useSyncManager
                                                                      ↓
                                                          POST /api/sync (Node.js)
                                                                      ↓
                                                    PersonaRepository.markAsSynced()
                                                    (sync_status = 'synced')
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
