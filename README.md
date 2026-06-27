# 📊 Módulo CRUD - Sistema de Encuestas (PWA Offline-First)

Bienvenido al **Módulo CRUD**. Es un sistema moderno de recolección de datos y encuestas en campo, diseñado bajo una arquitectura de **Aplicación Web Progresiva (PWA)** que garantiza un funcionamiento 100% sin conexión a internet (Offline-First). El sistema se sincroniza automáticamente con un servidor central cuando recupera la conectividad, asegurando la integridad total de los datos.

---

| Documento | Descripción |
|-----------|-------------|
| 📋 [Plan de Implementación](docs/PLAN_IMPLEMENTACION.md) | Fases del proyecto, stack tecnológico y arquitectura de sincronización |
| 📖 [Documentación Técnica](docs/documentacion-tecnica.md) | Arquitectura de carpetas, endpoints API, flujo offline-first |
| 📋 [Especificación de Requisitos](docs/Especificacion_Requisitos.md) | Objetivos, RNF, modelo de datos y justificaciones de diseño |
| 🚀 [Manual de Despliegue VPS](docs/DESPLIEGUE_VPS.md) | Guía paso a paso para instalar y actualizar en el VPS con Docker y Nginx |

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

## 📅 Estado del Proyecto: Fase 5 (Completado ✅)

El sistema ha superado con éxito todas las fases de desarrollo y se encuentra en etapa de producción:
* **Fase 1 & 2:** Arquitectura, Backend Node.js y MySQL completados.
* **Fase 3:** Frontend PWA con React y Dexie.js finalizado.
* **Fase 4 (Completada):** Motor de sincronización proactivo con Debounce (Push) y limpieza de fantasmas (Pull) estable. Implementación de Soft-Deletes local/remoto funcional.
* **Fase 5 (Actual):** Despliegue en VPS (Nginx + Let's Encrypt) exitoso. Empaquetado a Android APK (Bubblewrap/TWA) pendiente como paso final opcional para distribución en tiendas.
