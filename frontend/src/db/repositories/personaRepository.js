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

  getPendingSync: async () => {
    const personas = await db.personas.where('sync_status').equals('local').toArray();
    for (let p of personas) {
      p.contactos = await db.contactos.where('persona_id').equals(p.id).toArray();
    }
    return personas;
  },

  markAsSynced: (id) => db.personas.update(id, { sync_status: 'synced', updated_at: new Date().toISOString() }),

  /** Sincronización desde el servidor (Pull) */
  syncFromServer: async (serverPersonas, serverContactos) => {
    return db.transaction('rw', db.personas, db.contactos, async () => {
      // 1. Guardar o actualizar personas
      for (const sp of serverPersonas) {
        const local = await db.personas.where('cc').equals(sp.cc).first();
        if (local) {
          // Actualizamos solo si es más reciente
          if (new Date(sp.updated_at) > new Date(local.updated_at)) {
            await db.personas.update(local.id, { ...sp, id: local.id, sync_status: 'synced' });
          }
        } else {
          // No podemos usar el ID del servidor directamente porque Dexie usa AutoIncrement local.
          // Pero podemos guardarla, y Dexie le asignará un ID local.
          // Para mantener el enlace con los contactos, guardaremos el server_id original en el contacto.
          // Mejor: Si usamos el ID del servidor, forzamos que el ID local sea el mismo (peligroso si hay colisión).
          // La forma más fácil: ignorar el ID local autoincremental si viene del servidor, o forzarlo.
          // Como la CC es única, usamos la CC como clave lógica.
          
          await db.personas.put({ ...sp, sync_status: 'synced' });
        }
      }

      // 2. Limpiar y recrear contactos del servidor para evitar desajustes
      if (serverContactos && serverContactos.length > 0) {
        await db.contactos.clear();
        for (const sc of serverContactos) {
          await db.contactos.put(sc);
        }
      }
    });
  }
};
