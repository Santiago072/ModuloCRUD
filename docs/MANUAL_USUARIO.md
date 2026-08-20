# Manual de Usuario - Módulo CRUD Encuestas (Versión 1.3.2)

Bienvenido al Módulo CRUD para Encuestas. Esta aplicación (PWA) está diseñada para funcionar **incluso sin internet** (offline-first), permitiendo a los encuestadores recolectar datos en campo y sincronizarlos automáticamente cuando se recupere la conexión.

## 📱 Instalación (PWA)

La aplicación puede instalarse en su teléfono móvil o computadora como una aplicación nativa:

**Desde el Celular (Android/Chrome):**
1. Abra el navegador Chrome y visite la URL de la aplicación.
2. Toque el menú de opciones (tres puntos verticales) en la esquina superior derecha.
3. Seleccione **"Instalar aplicación"** o **"Añadir a la pantalla de inicio"**.
4. ¡Listo! Ahora tendrá un ícono de la aplicación en su menú y podrá abrirla sin entrar al navegador.

**Desde el PC:**
1. Visite la URL en Google Chrome o Edge.
2. Verá un ícono de instalación (una pantalla con una flecha hacia abajo) en la parte derecha de la barra de direcciones.
3. Haga clic y seleccione **"Instalar"**.

---

## ⚡ Funcionamiento Básico y Sesiones Offline

La principal característica de este sistema es su capacidad de trabajar sin internet hasta por **30 días**. 

* **Inicio de Sesión y Garantía Offline**: Inicie sesión en la pantalla principal antes de salir a campo (con internet). El sistema guardará un "Hash" (clave segura) en su dispositivo. Durante los siguientes 30 días, si la aplicación se bloquea por inactividad o la cierra por accidente, podrá **desbloquear su sesión sin necesidad de internet** simplemente ingresando su misma contraseña.
* **Pantalla de Bloqueo Automática**: Por su seguridad, tras 15 minutos de inactividad, la pantalla se bloquea automáticamente. Al desbloquear, puede usar el **ícono del ojo** para verificar que ingresó la contraseña correctamente.
  * _Nota: Si cambió su contraseña en otro dispositivo o perdió la sesión local, la pantalla de bloqueo verificará de manera inteligente (híbrida) con el servidor si cuenta con conexión a internet para restaurar el acceso sin hacerle perder su información._
* **Sin conexión (Offline):** Puede seguir agregando encuestas, editando información de contactos y eliminando personas. Todos los cambios se guardan en la memoria local de su dispositivo de forma 100% segura y se marcan con una etiqueta de **Pendiente (Color Amarillo)**.
* **Con conexión (Online) y Auto-Sync:** La aplicación implementa sincronización en segundo plano. Apenas se detecte conexión, el sistema sincronizará los registros de manera invisible. En cuanto se guarden, la etiqueta pasará inmediatamente a **Sincronizado (Color Verde)**.

**Importante:** Nunca borre los datos de navegación, caché, o presione "Cerrar Sesión (Borrar Datos)" si tiene registros en estado "Pendiente", ya que no se han subido al servidor y se perderán irremediablemente.

---

## 👥 Gestión de Personas y Contactos

### 1. Registrar una nueva Encuesta
1. Haga clic en el botón morado **"Nueva Encuesta"**.
2. Llene los datos básicos obligatorios (Documento, Nombres, Apellidos y Fecha).
3. **Seleccione su nombre de Encuestador** en la lista desplegable. El sistema recordará su selección automáticamente.
4. Ingrese el número de contacto principal (Celular, Fijo, WhatsApp, etc.).
5. Haga clic en **Guardar**.

### 2. Buscar Personas
En la pantalla principal, utilice la barra de búsqueda para encontrar registros. Esta lista maneja **paginación automática de 10 en 10**. Puede buscar por:
* Número de Cédula (CC).
* Nombres o Apellidos.

### 3. Ver Detalles e Historial
Para ver toda la información, haga clic sobre la tarjeta de un usuario:
* Sus datos básicos, profesión y el **Encuestador** responsable.
* Su lista de contactos (Principal, Contacto 2, Contacto 3).
* El estado de sincronización real.

### 4. Actualizar o Eliminar Registros
* **Para Editar:** En el detalle, presione **"Editar"** en la esquina inferior derecha. Modifique los campos y guarde.
* **Para Eliminar:** Presione **"Eliminar"** en la esquina inferior izquierda. Le pedirá confirmación. Una vez confirmado, desaparecerá y se borrará del servidor en la próxima sincronización.
* **Para Añadir contactos:** En el detalle, haga clic en **"+ Agregar"** al lado de "Números de contacto". El nuevo número se rotará para ser el contacto principal (Prioridad 1).

---

## 🔒 Panel de Administración

Los administradores tienen acceso a un panel de control avanzado (protegido) para gestionar a los encuestadores y ver métricas globales.

1. **Gestión de Encuestas:** La pestaña "Gestión de Encuestas" replica la experiencia de la PWA pero reuniendo todos los registros de todos los encuestadores para ser auditados en tiempo real con capacidades locales de alto rendimiento (Dexie.js).
2. **Dashboard de Estadísticas:** Muestra contadores totales de encuestas, encuestados y un "Top de Encuestadores" (Ranking), todo auto-reparado desde la base de datos central.
3. **Gestión de Usuarios (Paginada):** En esta tabla puede añadir y editar usuarios. La tabla cuenta con **paginación de 10 usuarios por hoja** para mantener la eficiencia visual.
4. **Cambio de Contraseñas:** Modal dedicado para el cambio rápido y encriptado de las claves de acceso de los encuestadores o del propio administrador.

---

## 📊 Exportación de Reportes
 
Para generar reportes y entregar consolidados:
1. Desde el módulo **Gestión de Encuestas** (o desde la pantalla principal si tiene permisos), haga clic en el botón blanco **"Exportar CSV"**.
2. El sistema sincronizará de forma automática e inmediata con el servidor para garantizar que se incluyan todos los datos actualizados.
3. **En Celulares / PWA:** Se abrirá el menú nativo de su teléfono para que pueda guardar el archivo directamente en su carpeta de **Descargas/Archivos** o compartirlo al instante por **WhatsApp, Correo electrónico o Google Drive**.
4. **En el PC:** Se descargará automáticamente un archivo de Excel nativo (`.xlsx`) profesional con encabezados en azul corporativo, bordes completos, filas de lectura alternadas y anchos de columna automáticos.

---

## 🔧 Soporte Técnico y Errores Comunes

*   **¿Por qué mis registros dicen "Pendiente"?**
    Significa que no tiene conexión a internet o la conexión es inestable. Asegúrese de tener datos móviles encendidos o estar conectado a un Wi-Fi; el sistema intentará auto-sincronizar de fondo.
*   **Contraseña local incorrecta en pantalla bloqueada**
    Asegúrese de usar el botón del ojo ("👁️") para verificar que escribió correctamente la clave. Si cambió la clave en otro equipo recientemente y está sin internet, el sistema no tendrá cómo enterarse de ese cambio de clave hasta que vuelva a conectarse.
*   **¿Por qué no veo los cambios que hizo mi compañero?**
    La aplicación sincroniza los cambios cada vez que la abre o recupera internet. Refresque la aplicación (`Ctrl + F5`) para forzar la sincronización (Pull) del servidor.
