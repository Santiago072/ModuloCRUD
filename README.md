# Módulo CRUD - Sistema de Encuestas (PWA + API)

Este repositorio contiene el código fuente y la documentación para el sistema "Módulo CRUD", diseñado con una arquitectura moderna de Aplicación Web Progresiva (PWA) y una API RESTful.

## 🏗️ Arquitectura del Sistema

El sistema utiliza una arquitectura **Cliente-Servidor (API-Driven)**, separando completamente el frontend del backend.

### 1. Frontend: PWA (Aplicación Web Progresiva)
- **Tecnologías:** React 18, Vite, Tailwind CSS.
- **Patrón:** Basado en Componentes.
- **Almacenamiento Local (Offline-First):** IndexedDB manejado a través de **Dexie.js**.
- **Manejo de Estado:** Zustand.
- **Sincronización:** Service Workers y Background Sync para enviar datos cuando haya conexión a internet.
- **Despliegue:** Se compilará y puede ser servido estáticamente o convertido a APK mediante TWA/Bubblewrap.

### 2. Backend: API RESTful (Servidor Central en VPS)
- **Patrón Interno:** **MVC (Modelo-Vista-Controlador)**.
  - *Modelo:* Interactúa con la base de datos central (MySQL/PostgreSQL).
  - *Vista:* Retorna respuestas en formato **JSON** (no renderiza HTML).
  - *Controlador:* Maneja la lógica de negocio y las validaciones.
- **Dominio:** `modulocrud.slscode.online` (Configurado con registro A apuntando a la IP del VPS).
- **Seguridad:** Autenticación por Tokens (JWT) y conexión segura (HTTPS).

## 🗄️ Modelo de Datos (Relacional)

Para solucionar el problema de "múltiples contactos", la base de datos central (y la local en IndexedDB) estará normalizada:

- `personas`: (id, cc, nombres, apellidos, profesion, created_at, updated_at)
- `contactos`: (id, persona_id, numero, prioridad, created_at)
- `encuestas`: (id, persona_id, fecha, datos_formulario, created_at)

## 🚀 Siguientes Pasos
1. Inicializar el proyecto Frontend (React + Vite).
2. Inicializar el proyecto Backend (API).
3. Configurar la conexión HTTPS en el VPS para `modulocrud.slscode.online`.
