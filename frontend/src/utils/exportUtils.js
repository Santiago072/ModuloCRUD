import db from '../db/schema';

/**
 * Exporta todas las personas con sus contactos a un archivo CSV.
 * Usa solo APIs nativas del navegador, sin dependencias externas.
 */
export const exportToCSV = async () => {
  const personas = await db.personas.toArray();
  const contactos = await db.contactos.toArray();

  const rows = personas.map(p => {
    const pContacts = contactos
      .filter(c => c.persona_id === p.id && c.activo)
      .sort((a, b) => a.prioridad - b.prioridad);

    return [
      p.cc,
      p.nombres,
      p.apellidos,
      p.profesion || '',
      p.fecha_registro,
      pContacts[0]?.valor || '',
      pContacts[1]?.valor || '',
      pContacts[2]?.valor || '',
      p.sync_status,
    ];
  });

  const headers = ['CC', 'Nombres', 'Apellidos', 'Profesión', 'Fecha Registro', 'Contacto 1', 'Contacto 2', 'Contacto 3', 'Estado Sync'];
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  // BOM UTF-8 para que Excel abra correctamente los acentos
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `encuestas_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
