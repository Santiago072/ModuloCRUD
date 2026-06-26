import Dexie from 'dexie';

// Instancia única de la base de datos local (IndexedDB)
export const db = new Dexie('ModuloCRUD');

// Versión 1: Define el esquema de todas las tablas
// El símbolo '++' indica autoincremento. '&' indica campo único.
db.version(1).stores({
  personas:  '++id, &cc, nombres, apellidos, sync_status, updated_at',
  contactos: '++id, persona_id, valor, prioridad, activo',
  encuestas: '++id, persona_id, fecha, sync_status',
});

export default db;
