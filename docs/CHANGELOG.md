# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere al [Versionamiento Semántico](https://semver.org/lang/es/).

## [v1.2.0] - 2026-07-24
### Módulo Gestión de Encuestas (Admin) y Mejoras de Arquitectura
- **Gestión Avanzada para Administradores**: Se implementó una nueva pestaña "Gestión de Encuestas" en el Panel Administrativo que permite a los administradores visualizar, buscar y editar todas las encuestas en tiempo real, de la misma forma y con la misma experiencia offline que los encuestadores.
- **Sincronización Local para Admin**: Ahora el administrador aprovecha todo el potencial del motor offline Dexie.js descargando los datos de todos los encuestadores para realizar búsquedas instantáneas y ediciones "local-first".
- **Auto-reparación de Estadísticas (Healing Script)**: Incorporada lógica en el backend (statsRoutes) para detectar y rellenar automáticamente registros huérfanos generados en versiones anteriores, garantizando que los contadores estadísticos de "Total Encuestas" sean 100% precisos de forma retroactiva.
- **UX/UI Mejoras**: Refactorización del "Admin Header" separando la lógica modal del cambio de contraseña para que esté globalmente accesible. Las etiquetas "Sincronizado" y "Encuestador" en la vista de tarjetas fueron reubicadas optimizando la lectura. Formato de fechas estandarizado a YYYY-MM-DD.
- **Fixes de Despliegue (Nginx 404)**: Corrección de rutas anidadas para evitar el error `404 Not Found` en Nginx cuando los usuarios recargaban la página en sub-rutas (SPA Routing Fix).

## [v1.1.0] - 2026-07-02
### Panel de Administración y Gestión de Encuestadores
- **Panel Administrativo Web**: Se creó el área `/admin` (protegida con JWT y autenticación encriptada) para la gestión completa de los trabajadores en campo.
- **Gestión Dinámica de Encuestadores**: Funcionalidad CRUD para añadir, desactivar y eliminar encuestadores. Los nombres ahora se controlan desde la base de datos central.
- **Seguridad y Accesos**: Endpoint y UI con Modal para el cambio seguro de contraseñas de administrador (mediante bcrypt). Botón de navegación integrado en el inicio para acceso rápido al panel.
- **Sincronización de Base de Datos PWA**: La tabla local de Dexie se actualizó a la `v2` para soportar la sincronización en segundo plano de la lista de encuestadores. Se corrigió un bug crítico donde la tabla de encuestas no se actualizaba durante el proceso de PULL (descarga) en nuevos dispositivos.
- **Formulario Inteligente y Persistente**: El formulario de `Nueva Encuesta` ahora tiene un selector dinámico para asociar cada encuesta a su encuestador, almacenando la selección en `localStorage` para evitar selecciones repetitivas en campo. Se optimizó la lógica de actualización manteniendo una relación estricta 1 a 1 entre Persona y Encuesta, asegurando que cuando se autocompleta una Cédula existente y se actualiza, la base de datos se mantenga limpia sin generar historiales redundantes.
- **Experiencia de Usuario (UI) y Rendimiento**: Se introdujo un sistema de **Paginación** en la lista principal (10 encuestas por página), mejorando drásticamente el rendimiento en dispositivos móviles al manejar grandes volúmenes de datos. Además, la búsqueda reactiva ("Live Search") ahora reinicia inteligentemente la paginación para una navegación fluida. El panel de administración fue rediseñado completamente con colores *slate* y *blue*, incluyendo tarjetas de métricas enriquecidas.
- **Rotación Inteligente de Contactos**: Implementado el Algoritmo 5.2. Ahora, si se ingresa un contacto existente para un encuestado, automáticamente se convierte en el "Contacto Principal" (Prioridad 1) sin duplicarse.
- **Dashboard Estadístico Analítico**: Nuevo endpoint `/api/stats` para el panel administrativo que entrega conteos globales de encuestados, encuestas totales, y el Top 5 de los encuestadores con más registros ingresados.
- **Exportación Excel Mejorada**: El archivo generado `.xls` ahora incluye dinámicamente la columna "Encuestador", lo que facilita el trabajo de revisión y auditoría en hojas de cálculo.

## [v1.0.0] - 2026-07-02
### Lanzamiento Oficial (Stable Release)
- **Motor de Sincronización Offline-First**: Implementación robusta de sincronización bidireccional (PULL/PUSH) con soporte para reconexión inteligente, previniendo sobreescrituras (fantasmas) y garantizando la integridad de datos en escenarios sin conexión a internet.
- **Módulo CRUD Completo**: Capacidad total para crear, leer, actualizar y realizar borrados lógicos (Soft-Delete) en registros de Personas y Contactos directamente en la PWA y en el servidor central.
- **Interfaz y Experiencia de Usuario**: Interfaz de usuario responsiva construida con Tailwind CSS, optimizada para el uso rápido y eficiente en campo (dispositivos móviles).
- **Exportación de Datos**: Función nativa para exportar la base de datos local a un archivo Excel (`.xls`), incluyendo todos los contactos y el estado de sincronización de cada registro.
- **Documentación de Usuario Final**: Agregado el [Manual de Usuario Oficial](MANUAL_USUARIO.md) detallando el uso de la PWA, la instalación en dispositivos y el comportamiento offline.
- **Correcciones de Estabilidad**: Se mitigaron errores críticos de transacciones en la base de datos local (Dexie.js) que bloqueaban la sincronización en clientes de escritorio, asegurando actualizaciones consistentes entre PWA y Servidor.
