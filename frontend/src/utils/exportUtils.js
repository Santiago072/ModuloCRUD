import db from '../db/schema';

/**
 * Exporta todas las personas con sus contactos en formato Excel (.xls) estilizado con colores y bordes.
 * En móviles utiliza Web Share API (o descarga diferida) para asegurar compatibilidad total con la app móvil y PC.
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
      'Estado Sync',
    ];

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
      ];
    });

    // Escapar caracteres HTML para evitar fallos de formato
    const esc = (val) =>
      String(val ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const headerHtml = headers
      .map(h => `<th style="background-color:#2563eb;color:#ffffff;font-weight:bold;padding:10px 14px;border:1px solid #1d4ed8;text-align:left;font-size:12px;">${esc(h)}</th>`)
      .join('');

    const rowsHtml = rows
      .map((row, idx) => {
        const bg = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
        const cells = row
          .map(v => `<td style="padding:8px 12px;border:1px solid #cbd5e1;background-color:${bg};font-size:11px;color:#1e293b;">${esc(v)}</td>`)
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    const fechaExport = new Date().toLocaleDateString('es-CO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]><xml>
          <x:ExcelWorkbook><x:ExcelWorksheets>
            <x:ExcelWorksheet><x:Name>Encuestas</x:Name>
            <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets></x:ExcelWorkbook>
        </xml><![endif]-->
      </head>
      <body>
        <table border="1" cellspacing="0" cellpadding="0"
               style="font-family:Segoe UI,Calibri,Arial,sans-serif;border-collapse:collapse;">
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <p style="font-family:Segoe UI,Calibri;font-size:10px;color:#64748b;margin-top:12px;">
          Reporte generado el ${fechaExport} — Módulo CRUD de Encuestas
        </p>
      </body>
      </html>`;

    // BOM UTF-8 (\ufeff) con MIME type oficial de Excel
    const blob = new Blob(['\ufeff' + html], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    });

    const fileName = `encuestas_${new Date().toISOString().slice(0, 10)}.xls`;

    // 1. Soporte en móvil a través de Web Share API
    const file = new File([blob], fileName, { type: 'application/vnd.ms-excel' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Exportación de Encuestas',
          text: `Reporte de encuestas con diseño (${fechaExport})`
        });
        return;
      } catch (shareErr) {
        if (shareErr.name === 'AbortError') return;
        console.warn('Web Share falló, procediendo con descarga estándar:', shareErr);
      }
    }

    // 2. Fallback de descarga directa para navegadores
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
