import db from '../db/schema';

/**
 * Exporta todas las personas con sus contactos a un archivo Excel (.xls).
 * Usa formato HTML-table que Excel lee de forma nativa, garantizando
 * columnas correctas en cualquier configuración regional (español/inglés).
 */
export const exportToCSV = async () => {
  // Excluir los registros marcados para borrar (soft-delete)
  const personas = await db.personas
    .filter(p => p.sync_status !== 'deleted')
    .toArray();
  const contactos = await db.contactos.toArray();

  const headers = [
    'CC',
    'Nombres',
    'Apellidos',
    'Profesión',
    'Fecha Registro',
    'Contacto Principal',
    'Contacto 2',
    'Contacto 3',
    'Estado Sync',
  ];

  const rows = personas.map(p => {
    const pContacts = contactos
      .filter(c => c.persona_id === p.id && c.activo)
      .sort((a, b) => a.prioridad - b.prioridad);

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
      estado,
    ];
  });

  // Escapar caracteres HTML para evitar inyecciones
  const esc = (val) =>
    String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const headerHtml = headers
    .map(h => `<th style="background:#4f46e5;color:#fff;font-weight:bold;padding:8px 12px;border:1px solid #3730a3;">${esc(h)}</th>`)
    .join('');

  const rowsHtml = rows
    .map((row, idx) => {
      const bg = idx % 2 === 0 ? '#f8f7ff' : '#ffffff';
      const cells = row
        .map(v => `<td style="padding:6px 12px;border:1px solid #e5e7eb;background:${bg};">${esc(v)}</td>`)
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  const fecha = new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
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
             style="font-family:Calibri,Arial,sans-serif;font-size:12px;border-collapse:collapse;">
        <thead><tr>${headerHtml}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <p style="font-family:Calibri;font-size:10px;color:#9ca3af;margin-top:8px;">
        Exportado el ${fecha} — Módulo CRUD Encuestas
      </p>
    </body>
    </html>`;

  // BOM UTF-8 para caracteres especiales
  const blob = new Blob(['\ufeff' + html], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `encuestas_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
