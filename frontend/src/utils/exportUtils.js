import db from '../db/schema';
import ExcelJS from 'exceljs';
import { syncData } from './syncUtils';

/**
 * Exporta todas las personas con sus contactos a un archivo Excel (.xlsx) nativo real estilizado.
 * Incluye:
 * - Encabezados con fondo azul (#2563EB) y texto blanco en negrita.
 * - Bordes completos (thin) en todas las celdas de datos.
 * - Filas con efecto cebra (#F8FAFC / #FFFFFF).
 * - Ajuste automático de anchos de columna.
 * - Sincronización previa automática para garantizar disponibilidad de datos en móviles.
 * - Web Share API en móviles / descarga directa en escritorio.
 */
export const exportToCSV = async () => {
  try {
    // 1. Sincronizar inmediatamente si hay conexión para tener todos los datos en el dispositivo
    if (navigator.onLine) {
      try {
        await syncData({ immediate: true });
      } catch (syncErr) {
        console.warn('Sincronización previa al exportar falló, usando datos locales:', syncErr);
      }
    }

    // 2. Obtener datos de IndexedDB
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

    // 3. Crear Libro y Hoja con ExcelJS
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Módulo CRUD Encuestas';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Encuestas', {
      views: [{ showGridLines: true }]
    });

    // Fila 1: Encabezados
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 26;

    // Estilo de encabezados: Fondo Azul (#2563EB), Texto Blanco, Negrita, Centrado vertical
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' }
      };
      cell.font = {
        name: 'Segoe UI',
        size: 11,
        bold: true,
        color: { argb: 'FFFFFFFF' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left'
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF1D4ED8' } },
        left: { style: 'thin', color: { argb: 'FF1D4ED8' } },
        bottom: { style: 'medium', color: { argb: 'FF1D4ED8' } },
        right: { style: 'thin', color: { argb: 'FF1D4ED8' } }
      };
    });

    // Filas de datos con bordes y colores alternados
    dataRows.forEach((rowValues, index) => {
      const row = worksheet.addRow(rowValues);
      row.height = 20;

      const isEven = index % 2 === 0;
      const bgArgb = isEven ? 'FFF8FAFC' : 'FFFFFFFF'; // Gris muy suave y Blanco

      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgArgb }
        };
        cell.font = {
          name: 'Segoe UI',
          size: 10,
          color: { argb: 'FF1E293B' }
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left'
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      });
    });

    // 4. Ajustar ancho automático de columnas
    worksheet.columns.forEach((col, i) => {
      let maxLen = headers[i] ? headers[i].length : 10;
      dataRows.forEach(row => {
        const val = row[i] ? String(row[i]) : '';
        if (val.length > maxLen) {
          maxLen = val.length;
        }
      });
      col.width = Math.min(Math.max(maxLen + 4, 14), 45);
    });

    // 5. Generar Buffer Binario .xlsx
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fileName = `encuestas_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // 6. En móviles usar Web Share API
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

    // 7. Fallback descarga directa
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
