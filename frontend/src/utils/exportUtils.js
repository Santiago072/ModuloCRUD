import db from '../db/schema';

/**
 * Exporta todas las personas con sus contactos a un archivo CSV.
 * Usa separador de TABULACIÓN para que Excel en Latinoamérica
 * abra correctamente las columnas sin configuración adicional.
 */
export const exportToCSV = async () => {
  // Excluir los registros marcados para borrar (soft-delete)
  const personas = await db.personas
    .filter(p => p.sync_status !== 'deleted')
    .toArray();
  const contactos = await db.contactos.toArray();

  const SEP = '\t'; // Tabulación: Excel universal (español e inglés)

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

    // Formatear fecha sin la hora ni la Z (ej: 2026-06-26T00:00:00.000Z → 2026-06-26)
    const fecha = p.fecha_registro
      ? String(p.fecha_registro).slice(0, 10)
      : '';

    // Traducir estado sync a español
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
    ].map(v => String(v).replace(/\t/g, ' ')); // Sanitizar tabulaciones internas
  });

  const csvContent = [
    headers.join(SEP),
    ...rows.map(row => row.join(SEP)),
  ].join('\r\n'); // CRLF: compatibilidad Windows/Excel

  // BOM UTF-8 para que Excel abra correctamente los caracteres especiales
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/tab-separated-values;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `encuestas_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
