import Dexie from 'dexie';

// Instancia única de la base de datos local (IndexedDB)
export const db = new Dexie('ModuloCRUD');

// Versión 3: Añadido usuario_id para aislamiento de datos por usuario (Offline-first)
db.version(3).stores({
  personas:  '++id, &cc, nombres, apellidos, usuario_id, sync_status, updated_at',
  contactos: '++id, persona_id, valor, prioridad, activo',
  encuestas: '++id, persona_id, fecha, usuario_id, encuestador, sync_status',
});

export default db;
