# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere al [Versionamiento Semántico](https://semver.org/lang/es/).

## [v1.0.0] - 2026-07-02
### Lanzamiento Oficial (Stable Release)
- **Motor de Sincronización Offline-First**: Implementación robusta de sincronización bidireccional (PULL/PUSH) con soporte para reconexión inteligente, previniendo sobreescrituras (fantasmas) y garantizando la integridad de datos en escenarios sin conexión a internet.
- **Módulo CRUD Completo**: Capacidad total para crear, leer, actualizar y realizar borrados lógicos (Soft-Delete) en registros de Personas y Contactos directamente en la PWA y en el servidor central.
- **Interfaz y Experiencia de Usuario**: Interfaz de usuario responsiva construida con Tailwind CSS, optimizada para el uso rápido y eficiente en campo (dispositivos móviles).
- **Exportación de Datos**: Función nativa para exportar la base de datos local a un archivo Excel (`.xls`), incluyendo todos los contactos y el estado de sincronización de cada registro.
- **Documentación de Usuario Final**: Agregado el [Manual de Usuario Oficial](MANUAL_USUARIO.md) detallando el uso de la PWA, la instalación en dispositivos y el comportamiento offline.
- **Correcciones de Estabilidad**: Se mitigaron errores críticos de transacciones en la base de datos local (Dexie.js) que bloqueaban la sincronización en clientes de escritorio, asegurando actualizaciones consistentes entre PWA y Servidor.
