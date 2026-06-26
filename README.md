# 📊 Módulo CRUD - Sistema de Encuestas (PWA Offline-First)

Bienvenido al **Módulo CRUD**. Es un sistema moderno de recolección de datos y encuestas en campo, diseñado bajo una arquitectura de **Aplicación Web Progresiva (PWA)** que garantiza un funcionamiento 100% sin conexión a internet (Offline-First). El sistema se sincroniza automáticamente con un servidor central cuando recupera la conectividad, asegurando la integridad total de los datos.

---

| Documento | Descripción |
|-----------|-------------|
| 📋 [Plan de Implementación](docs/PLAN_IMPLEMENTACION.md) | Fases del proyecto, stack tecnológico y arquitectura de sincronización |
| 📖 [Documentación Técnica](docs/documentacion-tecnica.md) | Arquitectura de carpetas, endpoints API, flujo offline-first y guía de despliegue VPS |
| 📋 [Especificación de Requisitos](docs/Especificacion_Requisitos.md) | Objetivos, RNF, modelo de datos y justificaciones de decisiones de diseño |

---

### 📱 Portal App (PWA Frontend)
* **Arquitectura Offline-First:** Los datos se guardan instantáneamente en el dispositivo (usando `IndexedDB` y `Dexie.js`) permitiendo continuar el trabajo sin interrupciones aunque se pierda la señal celular.
* **Componentes UI:** Interfaz construida con **React 18** y **Tailwind CSS** para un diseño responsivo, limpio y rápido.
* **Validación Robusta:** Formularios gestionados con `React Hook Form` y esquemas de validación estrictos usando `Zod`.
* **Empaquetado Android:** Capacidad de ser instalada directamente desde el navegador o compilada como un `.apk` nativo mediante TWA (Trusted Web Activity).

### ⚙️ Servidor Central (Backend API)
* **API RESTful:** Desarrollada íntegramente en **Node.js** con **Express**, proporcionando un ecosistema homogéneo (JavaScript en cliente y servidor).
* **Base de Datos Normalizada:** Estructura relacional estricta (Personas -> Contactos -> Encuestas) que permite un historial infinito de contactos y su rotación de prioridades sin límite de columnas.
* **Sincronización Inteligente:** El servidor recibe lotes de datos desde el `Background Sync` de los Service Workers, evaluando marcas de tiempo (`updated_at`) para evitar conflictos de sobreescritura.
* **Dominio Integrado:** Listo para despliegue en VPS bajo el subdominio `modulocrud.slscode.online` con encriptación HTTPS.

---

## 🛠️ Tecnologías Utilizadas
* **Frontend:** React, Vite, Tailwind CSS, Zustand, Dexie.js
* **Backend:** Node.js, Express.js
* **Base de Datos:** IndexedDB (Local) / MySQL o PostgreSQL (VPS)
* **Infraestructura:** Nginx, PM2, Let's Encrypt (Certbot)

---

## 🚀 Instalación y Desarrollo (Próximamente)

El código fuente del Frontend y Backend será estructurado en este repositorio durante la [Fase 1](docs/PLAN_IMPLEMENTACION.md) del proyecto.
