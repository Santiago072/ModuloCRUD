import db from '../schema';

export const PersonaRepository = {
  getAll: () => db.personas.orderBy('id').reverse().toArray(),
  getById: (id) => db.personas.get(id),
  getByCc: (cc) => db.personas.where('cc').equals(cc).first(),

  /** Crea persona con hasta 3 contactos iniciales en una transacción atómica */
  create: async ({ cc, nombres, apellidos, fecha_registro, profesion, contactos = [] }) => {
    const now = new Date().toISOString();
    return db.transaction('rw', db.personas, db.contactos, async () => {
      const personaId = await db.personas.add({
        cc, nombres, apellidos, fecha_registro,
        profesion: profesion || '',
        sync_status: 'local',
        created_at: now,
        updated_at: now,
      });
      // Insertar contactos iniciales con sus prioridades (1, 2, 3)
      for (let i = 0; i < contactos.length; i++) {
        const c = contactos[i];
        if (c?.valor?.trim()) {
          await db.contactos.add({
            persona_id: personaId,
            tipo: c.tipo || 'celular',
            valor: c.valor.trim(),
            prioridad: i + 1,
            activo: true,
            created_at: now,
          });
        }
      }
      return personaId;
    });
  },

  /** Actualiza los datos de una persona */
  update: async (id, data) => {
    const now = new Date().toISOString();
    return db.personas.update(id, { ...data, sync_status: 'local', updated_at: now });
  },

  /** Elimina la persona y todos sus contactos (CASCADE local) */
  remove: async (id) => {
    return db.transaction('rw', db.personas, db.contactos, db.encuestas, async () => {
      await db.contactos.where('persona_id').equals(id).delete();
      await db.encuestas.where('persona_id').equals(id).delete();
      await db.personas.delete(id);
    });
  },

  /** Obtiene una persona con sus contactos activos ordenados por prioridad */
  getWithContacts: async (id) => {
    const persona = await db.personas.get(id);
    if (!persona) return null;
    const contactos = await db.contactos
      .where('persona_id').equals(id)
      .and(c => c.activo === true)
      .sortBy('prioridad');
    return { ...persona, contactos };
  },

  getPendingSync: () => db.personas.where('sync_status').equals('local').toArray(),
  markAsSynced: (id) => db.personas.update(id, { sync_status: 'synced', updated_at: new Date().toISOString() }),
};
