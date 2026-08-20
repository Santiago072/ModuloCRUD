import db from '../db/schema';

/**
 * Exporta todas las personas con sus contactos a un archivo CSV estándar UTF-8 con BOM.
 * Compatible con navegadores de escritorio, visores móviles (Android/iOS), Google Sheets y Excel.
 * En dispositivos móviles con soporte para Web Share API, permite compartir o guardar el archivo directamente.
 */
export const exportToCSV = async () => {
  try {
    // Excluir los registros marcados para borrar (soft-delete)
    const personas = await db.personas
      .filter(p => p.sync_status !== 'deleted')
      .toArray();
    const contactos = await db.contactos.toArray();
    const encuestas = await db.encuestas.toArray();

    if (!personas || personas.length === 0) {
      alert('No hay registros de encuestas disponibles para exportar.');
      return;
    }

    const headers = [
      'Documento',
      'Nombres',
      'Apellidos',
      'Profesión',
      'Fecha Registro',
      'Contacto Principal',
      'Contacto 2',
      'Contacto 3',
      'Encuestador',
      'Estado Sincronización',
    ];

    // Función para escapar celdas en formato estándar CSV RFC 4180
    const escapeCsvCell = (val) => {
      const str = String(val ?? '').trim();
      // Si contiene comas, comillas dobles, saltos de línea o punto y coma, envolver entre comillas dobles
      if (/[",\n\r;]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const rows = personas.map(p => {
      const pContacts = contactos
        .filter(c => c.persona_id === p.id && c.activo)
        .sort((a, b) => a.prioridad - b.prioridad);

      const pEncuesta = encuestas.find(e => e.persona_id === p.id);
      const encuestador = pEncuesta ? pEncuesta.encuestador : 'Sin asignar';

      const fecha = p.fecha_registro
        ? String(p.fecha_registro).slice(0, 10)
        : '';

      const estadoMap = { synced: 'Sincronizado', local: 'Pendiente', deleted: 'Eliminado' };
      const estado = estadoMap[p.sync_status] ?? p.sync_status;

      return [
        p.cc,
        p.nombres,
        p.apellidos,
        p.profesion || '',
        fecha,
        pContacts[0]?.valor || '',
        pContacts[1]?.valor || '',
        pContacts[2]?.valor || '',
        encuestador,
        estado,
      ].map(escapeCsvCell).join(';');
    });

    const csvContent = [
      headers.map(escapeCsvCell).join(';'),
      ...rows
    ].join('\r\n');

    // BOM UTF-8 (\uFEFF) para que Excel y visores móviles reconozcan tildes y caracteres especiales automáticamente
    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const fileName = `encuestas_${new Date().toISOString().slice(0, 10)}.csv`;

    // Intentar Web Share API si está disponible en móviles
    const file = new File([blob], fileName, { type: 'text/csv;charset=utf-8;' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Exportación de Encuestas',
          text: `Reporte de encuestas exportado el ${new Date().toLocaleDateString('es-CO')}`
        });
        return;
      } catch (shareErr) {
        // Si el usuario cancela la ventana de compartir, no hacer nada; si falla, pasar al fallback de descarga
        if (shareErr.name === 'AbortError') return;
        console.warn('Web Share falló, procediendo con descarga estándar:', shareErr);
      }
    }

    // Fallback estándar de descarga por enlace Blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', fileName);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    // Retardo para revocar la URL y evitar que en Android/iOS se cancele la descarga antes de finalizar
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 2000);

  } catch (error) {
    console.error('Error al exportar CSV:', error);
    alert('Ocurrió un error al generar el archivo de exportación: ' + error.message);
  }
};
