# 📊 Módulo CRUD - Sistema de Encuestas (PWA Offline-First)

Bienvenido al **Módulo CRUD**. Es un sistema moderno de recolección de datos y encuestas en campo, diseñado bajo una arquitectura de **Aplicación Web Progresiva (PWA)** que garantiza un funcionamiento 100% sin conexión a internet (Offline-First). El sistema se sincroniza automáticamente con un servidor central cuando recupera la conectividad, asegurando la integridad total de los datos.

---

| Documento | Descripción |
|-----------|-------------|
| 👤 [Manual de Usuario](docs/MANUAL_USUARIO.md) | Guía de uso de la aplicación para usuarios finales |
| 📜 [Registro de Cambios](docs/CHANGELOG.md) | Historial de versiones y modificaciones del sistema (v1.3.1) |
| 📋 [Plan de Implementación](docs/PLAN_IMPLEMENTACION.md) | Fases del proyecto, stack tecnológico y arquitectura de sincronización |
| 📖 [Documentación Técnica](docs/documentacion-tecnica.md) | Arquitectura de carpetas, endpoints API, seguridad, CI/CD y flujo offline-first |
| 📋 [Especificación de Requisitos](docs/Especificacion_Requisitos.md) | Objetivos, RNF, modelo de datos y justificaciones de diseño |
| 🚀 [Manual de Despliegue VPS](docs/DESPLIEGUE_VPS.md) | Guía paso a paso para instalar y actualizar en el VPS con Docker y Nginx |
| 🏗️ [Arquitectura y Componentes](docs/ARQUITECTURA.md) | Diagramas Mermaid: componentes, flujo offline-first, seguridad y Docker |
| 🤝 [Guía para Colaboradores](docs/CONTRIBUTING.md) | Configuración local, convenciones de commits y checklist de PR |
| ⚖️ [Licencia MIT](LICENSE) | Términos legales de propiedad intelectual y uso abierto |


---

### 📱 Portal App (PWA Frontend)
* **Arquitectura Offline-First de Alta Seguridad:** Los datos se guardan instantáneamente en el dispositivo (usando `IndexedDB` y `Dexie.js`) permitiendo continuar el trabajo sin internet. Incluye un sistema de Autenticación Offline (LockScreen con cifrado SHA-256 local) y bloqueo automático por inactividad.
* **Componentes UI:** Interfaz construida con **React 18** y **Tailwind CSS** para un diseño responsivo, limpio y rápido.
* **Panel de Administración Avanzado (v1.2.0):** Dashboard integrado para la gestión de encuestadores (alta, baja, listado) y gestión total de encuestas (vista de tarjetas unificada, edición local-first), protegido mediante autenticación JWT.
* **Manejo Dinámico de Encuestadores:** Sincronización automática del listado de encuestadores al cliente offline, autocompletado y memoria local persistente para máxima agilidad en campo.

### ⚙️ Servidor Central (Backend API)
* **API RESTful:** Desarrollada íntegramente en **Node.js** con **Express**, proporcionando un ecosistema homogéneo (JavaScript en cliente y servidor).
* **Base de Datos Normalizada:** Estructura relacional estricta (Usuarios -> Personas -> Contactos -> Encuestas) que permite un historial infinito de encuestas vinculadas a encuestadores específicos.
* **Sincronización Inteligente:** El servidor recibe lotes de datos desde el `Background Sync` de los Service Workers, evaluando marcas de tiempo (`updated_at`) para evitar conflictos de sobreescritura.
* **Seguridad Avanzada:** Autenticación por Bearer Tokens, encriptación de contraseñas mediante `bcrypt` y protección de rutas administrativas.

---

## 🛠️ Tecnologías Utilizadas
* **Frontend:** React, Vite, Tailwind CSS, Zustand, Dexie.js
* **Backend:** Node.js, Express.js, JWT, bcrypt
* **Base de Datos:** IndexedDB (Local) / MySQL (VPS)
* **Infraestructura:** Docker Compose, Nginx, Let's Encrypt (Certbot)

---

## 🚀 Instalación y Despliegue (Docker)

El proyecto está completamente dockerizado para facilitar su despliegue en entornos locales y en producción (VPS).

### Prerrequisitos
- Docker y Docker Compose instalados.
- Archivo `.env` configurado (ver `.env.example`).

### Iniciar el proyecto localmente
1. Clonar el repositorio.
2. Copiar `.env.example` a `.env` y configurar las credenciales.
3. Ejecutar el script automatizado:
   ```bash
   bash deploy.sh
   ```
4. El Frontend (PWA) estará disponible en `http://localhost:8893`.
5. La API del Backend estará en `http://localhost:3000/api`.

---

## 📅 Estado del Proyecto: Cloud Survey System v1.3.0 (Completado ✅)

El sistema ha superado con éxito todas las fases de desarrollo y se encuentra en etapa de producción activa:
* **Fases 1 a 4:** Arquitectura Offline-First, Backend Node.js, y motor de sincronización proactivo completados (Versión Base).
* **Fase 5:** Despliegue en VPS (Nginx + Let's Encrypt + Docker) 100% estable con SPA Routing.
* **Actualización v1.1.0:** Integración de Panel Administrativo, Control de Accesos por JWT y selector dinámico offline.
* **Actualización v1.2.0:** Gestión de Encuestas Total, motor de autocuración (Healing Script) de estadísticas, refactorización de layouts y sincronización local para administradores.
* **Actualización v1.3.0 (Nueva):** Módulo de Seguridad Offline. Bloqueo por inactividad (Auto-Lock), autenticación criptográfica offline (SHA-256), indicador dinámico de red y sesión JWT extendida a 30 días para zonas sin conectividad.
