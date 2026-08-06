# 🏗️ Arquitectura y Componentes — Módulo CRUD

Este documento valida visualmente la arquitectura implementada, mostrando los componentes,
sus responsabilidades y cómo se relacionan entre sí.

---

## Diagrama de Componentes

```mermaid
graph TB
    subgraph DISPOSITIVO["📱 Dispositivo del Encuestador"]
        direction TB
        PWA["React 18 (PWA)\nTailwind CSS · Zustand"]
        SW["Service Worker\nvite-plugin-pwa"]
        IDB["IndexedDB\nDexie.js"]
        LOCK["Auto-Lock\nSHA-256 offline auth"]

        PWA -- "lee/escribe datos locales" --> IDB
        PWA -- "gestiona sesión y bloqueo" --> LOCK
        SW -- "intercepta fetch + Background Sync" --> PWA
    end

    subgraph VPS["🖥️ VPS (Docker)"]
        direction TB
        NGINX_HOST["Nginx\nProxy Inverso\n:443 HTTPS"]

        subgraph DOCKER["Docker Network: crud_network"]
            direction TB
            FRONT["Frontend Container\nNginx · React build\n:8893"]
            BACK["Backend Container\nNode.js · Express\n:8894 → :3000"]
            DB["DB Container\nMariaDB 10.11\n:3306 interno"]
        end

        NGINX_HOST --> FRONT
        NGINX_HOST --> BACK
        BACK -- "mysql2 driver" --> DB
    end

    SW -- "Background Sync\n(cuando hay red)" --> NGINX_HOST
    PWA -- "fetch API + JWT Bearer" --> NGINX_HOST
```

---

## Responsabilidades por Componente

| Componente | Tecnología | Responsabilidad principal |
|---|---|---|
| **React PWA** | React 18, Vite | UI, formularios, navegación, estado global |
| **Zustand Store** | Zustand | Estado global: sesión, lock, conectividad |
| **IndexedDB** | Dexie.js | Persistencia local offline de encuestas y datos |
| **Service Worker** | vite-plugin-pwa | Caché de assets, Background Sync, instalabilidad |
| **Auto-Lock** | JS nativo + SHA-256 | Bloqueo por inactividad (15min), auth offline |
| **Nginx Proxy** | Nginx | Terminación TLS, enrutamiento `/api` vs SPA |
| **Express API** | Node.js + Express | Endpoints REST, validación, lógica de negocio |
| **JWT Middleware** | jsonwebtoken | Autenticación de rutas protegidas vía Bearer token |
| **Motor de Sync** | Node.js scripts | Merge de lotes offline, Healing Script de estadísticas |
| **MariaDB** | MariaDB 10.11 | Persistencia centralizada, fuente de verdad |

---

## Flujo Offline-First

```mermaid
sequenceDiagram
    participant E as Encuestador
    participant PWA as React PWA
    participant IDB as IndexedDB (Dexie)
    participant SW as Service Worker
    participant API as Backend API

    Note over E,IDB: 📵 Fase offline — sin internet
    E->>PWA: Registra encuesta
    PWA->>IDB: Guarda localmente (sync_status=pending)
    IDB-->>PWA: ✅ Guardado offline
    PWA-->>E: Confirmación instantánea en pantalla

    Note over SW,API: 🌐 Fase de reconexión — internet disponible
    SW->>SW: Evento 'online' detectado
    SW->>IDB: Consulta registros con sync_status=pending
    IDB-->>SW: Lote de registros pendientes
    SW->>API: Background Sync — POST /api/sync
    API-->>SW: 200 OK
    SW->>IDB: Actualiza sync_status=synced
    SW->>PWA: Notifica sincronización completada
```

---

## Capas de Seguridad

```mermaid
graph LR
    A["🔒 TLS / HTTPS\nNginx + Let's Encrypt"] --> B["🛡️ CORS\nLista blanca de orígenes\nALLOWED_ORIGINS en .env"]
    B --> C["🎫 JWT Bearer Token\nHS256, 30 días\nJWT_SECRET obligatorio"]
    C --> D["🔐 bcrypt\nHash de contraseñas\nen base de datos"]
    D --> E["📵 Auto-Lock\nSHA-256 local\nTimeout 15 min"]
```

---

## Estructura de Contenedores Docker

```mermaid
graph TD
    INTERNET["🌐 Internet / Usuario"]
    NGINX_H["Nginx Host\npuerto :443 HTTPS · :80 HTTP\n(corre en el VPS)"]

    INTERNET -- "petición HTTPS" --> NGINX_H

    subgraph NET["crud_network (bridge) — red interna Docker"]
        F["modulocrud_frontend\npuerto interno :80\nbind: 127.0.0.1:8893"]
        B["modulocrud_backend\npuerto interno :3000\nbind: 127.0.0.1:8894"]
        D["modulocrud_db\npuerto interno :3306\nVolumen: modulocrud_db_data"]
    end

    NGINX_H -- "proxy → :8893 (SPA)" --> F
    NGINX_H -- "proxy /api → :8894" --> B
    B -- "mysql2 + healthcheck" --> D
```

> Los puertos están bindeados a `127.0.0.1` (no `0.0.0.0`), por lo que solo
> Nginx del host puede acceder a los contenedores — nunca expuestos directamente a internet.
