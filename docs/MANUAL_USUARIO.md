# 📖 Manual de Usuario — Módulo CRUD Encuestas

**Sistema:** Módulo CRUD de Encuestas (PWA Offline-First)  
**Plataforma:** Web / Android (PWA instalable)  
**URL:** [modulocrud.slscode.online](https://modulocrud.slscode.online)

---

## 1. Introducción

El **Módulo CRUD de Encuestas** es una aplicación diseñada para registrar, consultar, actualizar y eliminar encuestas de personas en campo. Funciona **con o sin internet**:

- ✅ **Con internet:** Los datos se guardan localmente y se sincronizan al servidor en tiempo real.
- ✅ **Sin internet:** Los datos se guardan en el dispositivo y se sincronizan automáticamente cuando se recupere la señal.

---

## 2. Acceso al Sistema

### Desde el navegador (PC o Celular)
1. Abra su navegador web (Chrome recomendado).
2. Ingrese la URL: **`modulocrud.slscode.online`**
3. La aplicación cargará automáticamente.

### Instalación como aplicación en Android
1. Abra Chrome en su celular y acceda a la URL.
2. Chrome mostrará un banner **"Agregar a pantalla de inicio"** — pulse **Instalar**.
3. La app aparecerá en su pantalla de inicio como cualquier aplicación nativa.

> **Nota:** Si no aparece el banner, pulse el menú (⋮) de Chrome y seleccione "Agregar a pantalla de inicio".

---

## 3. Pantalla Principal

Al abrir la aplicación verá la pantalla principal con:

| Elemento | Descripción |
|----------|-------------|
| **Indicador de red** | Esquina superior derecha: muestra `🛜 En línea` (verde) u `Offline` (rojo) |
| **Encuestas registradas** | Lista de todas las personas encuestadas |
| **Buscador** | Campo de búsqueda por CC, nombre o apellido |
| **Exportar CSV** | Botón para descargar todos los datos en formato CSV |
| **+ Nueva Encuesta** | Botón para crear un nuevo registro |

---

## 4. Crear una Nueva Encuesta

1. Pulse el botón **"+ Nueva Encuesta"**.
2. Se desplegará el formulario de captura.

### Campos del formulario

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| **Cédula (CC)** | ✅ Sí | Número de cédula de ciudadanía |
| **Nombres** | ✅ Sí | Nombre(s) de la persona |
| **Apellidos** | ✅ Sí | Apellido(s) de la persona |
| **Fecha de Encuesta** | ✅ Sí | Fecha en que se realizó la encuesta |
| **Profesión** | ❌ No | Ocupación o profesión |
| **Número de contacto** | ❌ No | Número de celular o teléfono |

### Autocompletado por CC
El sistema busca la CC en tiempo real mientras usted escribe:

- Si la CC **ya existe**, se rellenan automáticamente los campos con los datos guardados. Puede editar los campos o agregar un nuevo número de contacto.
- Si la CC **no existe**, los campos quedan vacíos para ingresar un nuevo registro.
- Si borra o cambia la CC, los campos se **limpian automáticamente**.

3. Complete los campos y pulse **"Guardar Encuesta"** (o **"Actualizar Encuesta"** si la CC ya existía).

---

## 5. Ver el Detalle de una Encuesta

1. En la lista principal, pulse sobre el nombre de cualquier persona.
2. Se abrirá un **modal de detalle** con:
   - Datos personales (nombre, CC, profesión, fecha).
   - Lista de **números de contacto** ordenados por prioridad.
   - Estado de sincronización (Sincronizado / Pendiente).
   - Fecha de última actualización.

---

## 6. Editar una Encuesta

Desde el modal de detalle:

1. Pulse el botón **"Editar"** (esquina inferior derecha).
2. Los campos pasarán a modo edición.
3. Modifique los datos que desee.
4. Pulse **"Guardar"** para confirmar o **"Cancelar"** para descartar.

---

## 7. Agregar un Número de Contacto

El sistema permite registrar hasta **3 números de contacto activos** por persona, con rotación automática de prioridades:

1. Abra el detalle de una encuesta.
2. Pulse el botón **"⊕ Agregar"** junto a "Números de contacto".
3. Ingrese el nuevo número y pulse **"Guardar"**.

### Lógica de rotación de prioridades
| Situación | Resultado |
|-----------|-----------|
| No hay contactos | El nuevo número queda como **Principal** (prioridad 1) |
| Hay 1 contacto | El nuevo pasa a **Principal**, el anterior a Contacto 2 |
| Hay 2 contactos | El nuevo pasa a **Principal**, los anteriores rotan (1→2, 2→3) |
| Hay 3 contactos | El nuevo pasa a **Principal**, el de prioridad 3 se **archiva** (queda inactivo) |

---

## 8. Eliminar una Encuesta

1. Abra el detalle de la encuesta que desea eliminar.
2. Pulse el botón rojo **"🗑 Eliminar"**.
3. Aparecerá una confirmación: pulse **"Sí"** para confirmar o **"No"** para cancelar.

> ⚠️ **Importante:** La eliminación es permanente. Al confirmar, el registro se borra del dispositivo y del servidor central en cuanto haya conexión.

---

## 9. Buscar Encuestas

Utilice el buscador en la parte superior de la lista:

- Puede buscar por **CC**, **nombre** o **apellido**.
- La búsqueda es **en tiempo real** (no necesita pulsar Enter).
- Para ver todos los registros nuevamente, borre el texto del buscador.

---

## 10. Exportar a CSV

1. Pulse el botón **"⬇ Exportar CSV"** en la pantalla principal.
2. Se descargará un archivo `.csv` con todos los registros actuales.
3. Puede abrirlo con Excel, Google Sheets o cualquier programa de hojas de cálculo.

---

## 11. Estado de Sincronización

Cada encuesta muestra su estado junto al nombre:

| Indicador | Significado |
|-----------|-------------|
| 🟢 **Sincronizado** | El registro está confirmado en el servidor central |
| 🟡 **Pendiente** | El registro está guardado localmente, pendiente de subir al servidor |

> El sistema sincroniza automáticamente en cuanto detecta conexión a internet. Normalmente el cambio de "Pendiente" a "Sincronizado" ocurre en **menos de 1 segundo** con buena señal.

---

## 12. Uso Sin Conexión

El sistema funciona completamente sin internet:

- Puede **crear, editar y consultar** encuestas sin señal.
- Los datos se guardan de forma segura en su dispositivo.
- Al reconectarse, la app **sincroniza automáticamente** todos los cambios pendientes.
- Las encuestas creadas en un dispositivo aparecerán en los demás al reconectarse.

---

## 13. Solución de Problemas Comunes

### ❓ Las encuestas no aparecen en mi celular
- Verifique que tiene conexión a internet.
- Recargue la página (deslice hacia abajo para refrescar en móvil).
- Si persiste, borre la caché de la app: en Chrome, vaya a **Información del sitio → Borrar y restablecer**.

### ❓ Una encuesta sigue en "Pendiente" a pesar de tener internet
- Espere unos segundos y recargue la página.
- Si sigue igual, cierre y vuelva a abrir la aplicación.
- El sistema reiniciará la sincronización automáticamente.

### ❓ Instalé la app en Android pero no actualiza
- Abra la app, cierre y vuelva a abrir.
- Si el problema persiste, desinstale la app PWA, borre los datos del sitio en Chrome y vuelva a instalarla desde la URL.

---

## 14. Glosario

| Término | Definición |
|---------|------------|
| **PWA** | Aplicación Web Progresiva — funciona en el navegador e instalable como app nativa |
| **Offline-First** | Arquitectura que prioriza el funcionamiento sin internet |
| **CC** | Cédula de Ciudadanía — identificador único de cada persona |
| **Sincronizado** | Dato confirmado en el servidor central y visible desde cualquier dispositivo |
| **Pendiente** | Dato guardado localmente, aún no enviado al servidor |
| **Rotación de Contactos** | Sistema que gestiona hasta 3 números activos por persona, archivando el más antiguo |

---

*Última actualización: 2026-06-27*
