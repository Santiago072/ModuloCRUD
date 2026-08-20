import db from '../db/schema';
import * as XLSX from 'xlsx';
import { syncData } from './syncUtils';

/**
 * Exporta todas las personas con sus contactos a un archivo Excel (.xlsx) nativo real.
 * Utiliza formato binario estándar compatible con Microsoft Excel (PC/Móvil), Google Sheets y visores de Android/iOS.
 * Antes de exportar, intenta sincronizar con el servidor para asegurar que todos los datos estén presentes en el dispositivo.
 */
export const exportToCSV = async () => {
  try {
    // 1. Si hay conexión a internet, forzar sincronización inmediata antes de exportar
    if (navigator.onLine) {
      try {
        await syncData({ immediate: true });
      } catch (syncErr) {
        console.warn('Sincronización previa al exportar falló, usando datos locales:', syncErr);
      }
    }

    // 2. Obtener los registros locales de IndexedDB
    const personas = await db.personas
      .filter(p => p.sync_status !== 'deleted')
      .toArray();
    const contactos = await db.contactos.toArray();
    const encuestas = await db.encuestas.toArray();

    if (!personas || personas.length === 0) {
      alert('No hay registros de encuestas disponibles en este dispositivo para exportar.');
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
      'Estado Sync',
    ];

    const dataRows = personas.map(p => {
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
      ];
    });

    // 3. Crear hoja de cálculo con encabezados y filas
    const wsData = [headers, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Calcular ancho óptimo para cada columna automáticamente
    const colWidths = headers.map((header, colIndex) => {
      let maxLen = header.length;
      dataRows.forEach(row => {
        const val = row[colIndex] ? String(row[colIndex]) : '';
        if (val.length > maxLen) {
          maxLen = val.length;
        }
      });
      return { wch: Math.min(Math.max(maxLen + 3, 12), 40) };
    });
    ws['!cols'] = colWidths;

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Encuestas');

    // Generar buffer binario en formato .xlsx estándar
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fileName = `encuestas_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // 4. En móviles intentar Web Share API
    const file = new File([blob], fileName, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Exportación de Encuestas',
          text: `Reporte de encuestas exportado el ${new Date().toLocaleDateString('es-CO')}`
        });
        return;
      } catch (shareErr) {
        if (shareErr.name === 'AbortError') return;
        console.warn('Web Share falló, procediendo con descarga estándar:', shareErr);
      }
    }

    // 5. Fallback descarga directa
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', fileName);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 2500);

  } catch (error) {
    console.error('Error al exportar:', error);
    alert('Ocurrió un error al exportar: ' + error.message);
  }
};
