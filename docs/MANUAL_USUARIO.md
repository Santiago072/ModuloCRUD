# Manual de Usuario - Módulo CRUD Encuestas (Versión 1.1.0)

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

## ⚡ Funcionamiento Básico (Offline-First)

La principal característica de este sistema es su capacidad de trabajar sin internet.

*   **Sin conexión (Offline):** Puede seguir agregando encuestas, editando información de contactos y eliminando personas. Todos los cambios se guardan en la memoria local de su dispositivo y se marcan con una etiqueta de **Pendiente (Color Amarillo)**.
*   **Con conexión (Online):** Al momento de detectar conexión a internet, la aplicación enviará todos los datos pendientes al servidor central. Una vez guardados con éxito, la etiqueta cambiará a **Sincronizado (Color Verde)**.

**Importante:** Nunca cierre sesión, borre los datos de navegación o desinstale la aplicación mientras tenga registros en estado "Pendiente", ya que esa información no ha llegado al servidor y se perderá.

---

## 👥 Gestión de Personas y Contactos

### 1. Registrar una nueva Encuesta
1. Haga clic en el botón morado **"Nueva Encuesta"**.
2. Llene los datos básicos obligatorios (Documento, Nombres, Apellidos y Fecha).
3. **Seleccione su nombre de Encuestador** en la lista desplegable. El sistema recordará su selección automáticamente para las próximas encuestas.
4. Ingrese el número de contacto principal (Celular, Fijo, WhatsApp, etc.).
5. Haga clic en **Guardar**.

### 2. Buscar Personas
En la pantalla principal, utilice la barra de búsqueda para encontrar registros rápidamente. Puede buscar por:
*   Número de Cédula (CC).
*   Nombres.
*   Apellidos.

### 3. Ver Detalles e Historial
Para ver toda la información de un usuario, simplemente haga clic sobre su tarjeta en la lista principal. Se abrirá una ventana con:
*   Sus datos básicos, profesión y el **Encuestador** responsable.
*   Su lista de contactos (Principal, Contacto 2, Contacto 3).
*   El estado de sincronización.

### 4. Actualizar o Eliminar Registros
*   **Para Editar:** Dentro del detalle de la persona, presione el botón **"Editar"** en la esquina inferior derecha. Modifique los campos necesarios y presione **"Guardar"**.
*   **Para Eliminar:** En la misma ventana de detalle, presione **"Eliminar"** en la esquina inferior izquierda. Le pedirá confirmación. Una vez confirmado, desaparecerá de su pantalla y se borrará del servidor en la próxima sincronización.
*   **Para Añadir más números de teléfono:** En el detalle de la persona, al lado del título "Números de contacto", haga clic en **"+ Agregar"**. Tenga en cuenta que el nuevo número pasará a ser el contacto principal, y los demás se desplazarán hacia abajo.

---

## 🔒 Panel de Administración (NUEVO)

Los administradores tienen acceso a un panel de control avanzado para gestionar a los encuestadores del sistema:

1. **Ingreso:** En la esquina superior derecha de la pantalla principal, presione el botón **"Admin"**.
2. **Dashboard:** Aquí podrá ver la lista de todos los encuestadores registrados.
3. **Añadir Encuestadores:** Presione el botón "+ Nuevo Encuestador", escriba el nombre completo y presione guardar. Este nombre aparecerá automáticamente en los celulares de los encuestadores en campo (siempre y cuando tengan conexión a internet para descargar la lista actualizada).
4. **Desactivar o Eliminar:** Puede pausar a un encuestador (Desactivar) para que no salga en la lista sin borrar su historial, o eliminarlo permanentemente.
5. **Cambio de Contraseñas:** En la esquina superior derecha del panel, los administradores pueden cambiar su propia contraseña en cualquier momento por motivos de seguridad.

---

## 📊 Exportación de Reportes

Para generar reportes y entregar los consolidados de las encuestas:
1. Asegúrese de tener buena conexión a internet para que la aplicación descargue todos los datos actualizados del equipo.
2. En la pantalla principal, clic en el botón blanco **"Exportar CSV"**.
3. Se generará automáticamente un archivo de Excel (`.xls`) con todas las personas, sus múltiples contactos y su estado de sincronización.

---

## 🔧 Soporte Técnico y Errores Comunes

*   **¿Por qué mis registros dicen "Pendiente"?**
    Significa que no tiene conexión a internet o la conexión es inestable. Asegúrese de tener datos móviles encendidos o estar conectado a un Wi-Fi y recargue la página.
*   **No aparece mi nombre en la lista de encuestadores**
    El administrador debe agregarlo primero en el Panel de Control. Si ya lo agregó, conéctese a internet un momento y refresque la página para que el celular descargue la lista nueva.
*   **¿Por qué no veo los cambios que hizo mi compañero?**
    La aplicación sincroniza los cambios cada vez que la abre o recupera el internet. Si acaba de abrir la app y no los ve, deslice hacia abajo (en el celular) o presione `F5` (en el PC) para forzar la sincronización.
