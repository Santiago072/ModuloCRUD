# Documentación y Especificación de Requisitos del Sistema

## 1. Descripción general del sistema
El Sistema CRUD de Encuestas es una aplicación web progresiva (PWA) diseñada para capturar, gestionar y consultar datos de personas encuestadas. El sistema opera en modo offline-first, garantizando disponibilidad total sin conexión a internet, y sincroniza los datos de forma automática cuando se restablece la conectividad.

**Decisión arquitectónica clave — ¿Por qué PWA y no Android nativo?**
Una PWA permite una única base de código que funciona en navegador web y se instala como APK en Android (mediante TWA — Trusted Web Activity). Esto elimina la necesidad de mantener dos proyectos separados, reduce el tiempo de desarrollo y garantiza que ambas plataformas siempre estén sincronizadas.

### 1.1 Control de Acceso y Visibilidad por Roles

El sistema implementa dos roles de usuario con accesos diferenciados:

* **Usuario / Encuestador (`user`):** Accede a la interfaz de campo para registrar nuevas encuestas, consultar y editar su historial de encuestas recolectadas, y exportar reportes en CSV/Excel.
* **Administrador (`admin`):** Accede al panel administrativo integral que incluye:
  - **Gestión de Usuarios:** Creación, edición de contraseñas, cambio de roles y eliminación de cuentas de encuestadores.
  - **Gestión de Encuestas:** Consulta global de todas las encuestas registradas en el sistema, registro de nuevas encuestas como administrador, edición de personas/contactos y exportación consolidada a CSV/Excel.

---

## 2. Requisitos Funcionales (RF)

### 🔐 Autenticación y Control de Acceso
* **RF01:** El sistema debe permitir el inicio de sesión mediante nombre de usuario y contraseña cifrada con Bcrypt.
* **RF02:** El sistema debe restringir el acceso a las rutas y funciones de administración únicamente a usuarios con rol de administrador mediante tokens JWT.
* **RF03:** El sistema debe permitir el cambio de contraseña del usuario autenticado desde la barra superior.
* **RF04:** El sistema debe permitir el cierre de sesión seguro invalidando el token de autenticación en el cliente.

### 📝 Captura y Gestión de Encuestas (Modo Offline-First)
* **RF05:** El sistema debe permitir capturar encuestas y datos personales (cédula, nombres, apellidos, profesión) con o sin conexión a internet.
* **RF06:** El sistema debe gestionar hasta 3 contactos telefónicos activos por persona aplicando una lógica de rotación automática donde el contacto más reciente toma la prioridad principal.
* **RF07:** El sistema debe permitir consultar y buscar encuestas en tiempo real mediante filtrado reactivo por cédula, nombres o apellidos.
* **RF08:** El sistema debe permitir editar y actualizar los datos de personas y contactos previamente registrados.
* **RF09:** El sistema debe permitir la eliminación lógica de registros y sincronizar la baja con el servidor cuando haya conexión.
* **RF10:** El sistema debe permitir exportar las encuestas a formato Excel (.xls) / CSV exclusivamente desde el módulo de Gestión de Encuestas.

### 🔄 Sincronización y Resiliencia
* **RF11:** El sistema debe guardar todos los registros inmediatamente en la base de datos local del navegador (IndexedDB) garantizando respuesta instantánea sin internet.
* **RF12:** El sistema debe detectar automáticamente el estado de la conexión a internet y sincronizar los registros pendientes hacia el servidor central.
* **RF13:** El sistema debe descargar los datos actualizados desde el servidor central hacia la base de datos local para mantener consistencia de información.
* **RF14:** El sistema debe clasificar el estado de cada registro (sincronizado, pendiente o eliminado) mediante indicadores visuales.

### 👥 Administración de Usuarios y Métricas (Solo Administrador)
* **RF15:** El sistema debe mostrar indicadores métricos en el panel de administración: total de personas censadas, total de encuestas y tabla de rendimiento por encuestador.
* **RF16:** El sistema debe permitir a los administradores crear nuevas cuentas de encuestadores asignando usuario, contraseña y rol.
* **RF17:** El sistema debe permitir a los administradores modificar el nombre de usuario y restablecer contraseñas de las cuentas existentes.
* **RF18:** El sistema debe permitir a los administradores eliminar cuentas de encuestadores con validación de seguridad para impedir la autoeliminación.

---

## 3. Requisitos No Funcionales (RNF)

* **RNF01:** El sistema debe operar bajo la arquitectura Offline-First, permitiendo el 100% de operaciones de lectura y captura de encuestas sin depender de conexión a internet.
* **RNF02:** La aplicación web debe cumplir con los estándares de Progressive Web App (PWA), permitiendo su instalación como aplicación independiente en dispositivos móviles y de escritorio.
* **RNF03:** La comunicación entre el frontend y el backend debe realizarse mediante una API REST protegida por autenticación Bearer Token (JWT).
* **RNF04:** El almacenamiento local en el cliente debe utilizar IndexedDB mediante Dexie.js para soporte estructurado y transaccional.
* **RNF05:** El servidor central debe utilizar Node.js con Express y base de datos relacional MySQL / MariaDB con consultas preparadas contra inyecciones SQL.
* **RNF06:** La interfaz de usuario debe ser responsiva y accesible, adaptándose fluidamente a pantallas móviles, tabletas y computadores de escritorio.

## 4. Arquitectura general — PWA Offline-First
### 4.1 Patrón arquitectónico
El sistema adopta el patrón Offline-First combinado con MVVM (Model-View-ViewModel) para la organización del código. Esto significa que la aplicación siempre lee y escribe primero en la base de datos local (IndexedDB), y delega la sincronización con el servidor a un proceso en segundo plano.

| Capa | Patrón | Responsabilidad |
|------|--------|-----------------|
| Presentación | Componentes React | Renderizado de UI, formularios, navegación |
| Estado | MVVM con Zustand | Estado global, lógica de negocio, validación |
| Datos locales | Repository Pattern | Abstracción sobre IndexedDB via Dexie.js |
| Sincronización | Sync Queue | Cola de operaciones pendientes para el servidor |
| Offline | Service Worker | Cache de assets, interceptación de red |

### 4.2 Flujo de datos offline-first

```mermaid
graph TB
    subgraph CLIENTE["📱 1. DISPOSITIVO DEL ENCUESTADOR (OFFLINE-FIRST)"]
        direction TB
        ACT["📝 CAPTURA EN CAMPO"]
        IDB["💾 INDEXEDDB LOCAL"]
        QUEUE["⏳ COLA SYNCQUEUE"]

        ACT --> IDB --> QUEUE
    end

    subgraph SYNC["🔄 2. DETECCIÓN DE CONECTIVIDAD"]
        direction TB
        SW["📶 SERVICE WORKER"]
    end

    subgraph SERVER["☁️ 3. SERVIDOR CENTRAL (BACKEND API)"]
        direction TB
        API["⚙️ POST /api/sync"]
        MYSQL[("🛢️ MARIADB / MYSQL")]

        API --> MYSQL
    end

    QUEUE -->|"Al detectar red"| SW
    SW -->|"Background Sync"| API

    style ACT fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#ffffff
    style IDB fill:#1e293b,stroke:#a855f7,stroke-width:2px,color:#ffffff
    style QUEUE fill:#1e293b,stroke:#fbbf24,stroke-width:2px,color:#ffffff
    style SW fill:#1e293b,stroke:#06b6d4,stroke-width:2px,color:#ffffff
    style API fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#ffffff
    style MYSQL fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#ffffff
    style CLIENTE fill:#0f172a,stroke:#334155,stroke-width:1px,color:#94a3b8
    style SYNC fill:#0f172a,stroke:#334155,stroke-width:1px,color:#94a3b8
    style SERVER fill:#0f172a,stroke:#334155,stroke-width:1px,color:#94a3b8
```


| **1. Captura en Campo** | `IndexedDB (Dexie.js)` | El encuestador llena el formulario sin internet; los datos se guardan al instante en el navegador/app con `sync_status = 'local'`. |
| **2. Detección de Red** | `Service Worker` | Monitorea el estado de conectividad en segundo plano; al recuperar señal de red, activa el proceso de sincronización. |
| **3. Servidor Central** | `Express API + MySQL` | Recibe el lote mediante `POST /api/sync`, valida el token JWT, inserta las encuestas en MySQL y actualiza el estado a `synced`. |


El flujo de operaciones garantiza que el sistema nunca bloquea al usuario por falta de conexión:
1. Usuario realiza una acción (crear, editar, eliminar registro).
2. La acción se escribe inmediatamente en IndexedDB (respuesta instantánea).
3. Si hay internet: la operación se envía también al servidor en tiempo real.
4. Si no hay internet: la operación se agrega a una cola de sincronización (SyncQueue).
5. El Service Worker detecta cuando se restaura la conexión y procesa la cola automáticamente.


**Garantía de integridad:**
Cada registro incluye un campo `sync_status` con valores: `'local'` (pendiente de subir al servidor), `'synced'` (sincronizado con el servidor) o `'deleted'` (pendiente de eliminación física en el servidor). El campo `updated_at` permite resolver conflictos de concurrencia a favor del dato más reciente.

## 5. Stack tecnológico
### 5.1 Frontend — Capa de presentación
| Tecnología | Versión | Rol en el sistema | Justificación |
|------------|---------|-------------------|---------------|
| React | 18.x | Framework de componentes UI | Ecosistema maduro, hooks, rendimiento con Virtual DOM |
| Vite | 5.x | Bundler y servidor | Rápido, plugin PWA oficial |
| vite-plugin-pwa | 0.19.x | Generación Service Worker | Integra Workbox, genera manifest automáticamente |
| Tailwind CSS | 3.x | Framework de estilos | Clases utilitarias, responsive por defecto |
| React Router | 6.x | Navegación SPA | Navegación sin recarga de página |

### 5.2 Lógica y estado
| Tecnología | Versión | Rol en el sistema | Justificación |
|------------|---------|-------------------|---------------|
| Zustand | 4.x | Estado global | Más simple que Redux, sin boilerplate |
| React Hook Form | 7.x | Gestión de formularios | Validación eficiente |

### 5.3 Capa de datos (offline)
| Tecnología | Versión | Rol en el sistema | Justificación |
|------------|---------|-------------------|---------------|
| IndexedDB | Nativa | Base de datos | API estándar del navegador para datos estructurados offline |
| Dexie.js | 3.x | ORM sobre IndexedDB | API similar a SQL con soporte transaccional |

### 5.4 Sincronización y backend
| Tecnología | Versión | Rol en el sistema | Justificación |
|------------|---------|-------------------|---------------|
| Custom SyncManager | Nativo | Sincronización proactiva | Sincronización Push/Pull con Debounce para mitigar latencia |
| Fetch API | Nativa | Llamadas HTTP | Comunicación ligera y nativa con API REST |
| Node.js + Express | 20.x | Backend API REST | Servidor central (API y Sync Queue processor) |
| MySQL (mysql2) | 3.x | Base de Datos Central | Relacional, despliegue dockerizado |
| CSV Nativo | Nativo | Exportación CSV | Conversión a Blob sin dependencias externas |

## 6. Estructura del proyecto
La organización de carpetas sigue el patrón feature-based (por funcionalidad). *(Ver repositorio para la estructura del código base).*

## 7. Modelo de datos — IndexedDB y MySQL
El modelo normaliza los contactos en una tabla independiente, eliminando las columnas fijas.

### Tabla: personas
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | number | PK auto | Identificador único |
| cc | string | UNIQUE, NOT NULL | Cédula de ciudadanía |
| nombres | string | NOT NULL | Nombres |
| apellidos | string | NOT NULL | Apellidos |
| fecha_registro | string | NOT NULL | Fecha de encuesta (ISO 8601) |
| profesion | string | NULL | Profesión u ocupación |
| sync_status | string | DEFAULT 'local' | Estado: 'local', 'synced', 'conflict' |
| created_at | string | NOT NULL | Timestamp de creación |
| updated_at | string | NOT NULL | Timestamp de modificación |

### Tabla: contactos
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | number | PK auto | Identificador único |
| persona_id | number | FK -> personas.id | Referencia a la persona |
| tipo | string | NOT NULL | 'telefono', 'celular', 'email' |
| valor | string | NOT NULL | Número o dirección |
| prioridad | number | NOT NULL (1-3) | Orden (1 = principal) |
| activo | boolean | DEFAULT true | Vigencia |
| created_at | string | NOT NULL | Timestamp de creación |

### Tabla: encuestas
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | number | PK auto | Identificador único |
| persona_id | number | FK -> personas.id | Persona encuestada |
| fecha | string | NOT NULL | Fecha de aplicación |
| encuestador | string | NOT NULL | Nombre del encuestador |
| notas | string | NULL | Observaciones |
| sync_status | string | DEFAULT 'local' | Estado sincronización |
| created_at | string | NOT NULL | Timestamp de creación |

### Tabla: encuestadores
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | number | PK auto | Identificador único |
| nombre | string | UNIQUE, NOT NULL | Nombre del encuestador |
| activo | boolean | DEFAULT true | Si puede ser seleccionado en la app |

### Tabla: usuarios (Admin)
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| id | number | PK auto | Identificador único |
| username | string | UNIQUE, NOT NULL | Nombre de usuario (ej. admin) |
| password_hash | string | NOT NULL | Hash Bcrypt de la contraseña |

### 5.2 Lógica inteligente de rotación de contactos
1. Se detecta si el nuevo número ya existe en el perfil de la persona.
2. Si **ya existe**: se promueve a `prioridad = 1` y los demás contactos se desplazan hacia abajo. Si estaba inactivo, se reactiva como principal.
3. Si es **nuevo**: el nuevo toma `prioridad = 1`.
4. Los contactos anteriores se desplazan (1 pasa a 2, 2 pasa a 3).
5. Si ya había 3 activos, el que era de prioridad 3 pasa a inactivo (`activo = false`).
