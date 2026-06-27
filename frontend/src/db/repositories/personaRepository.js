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

  /** Elimina la persona de la UI y la marca para borrar en el servidor */
  remove: async (id) => {
    return db.personas.update(id, { sync_status: 'deleted', updated_at: new Date().toISOString() });
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
    const personas = await db.personas.where('sync_status').anyOf('local', 'deleted').toArray();
    for (let p of personas) {
      p.contactos = await db.contactos.where('persona_id').equals(p.id).toArray();
    }
    return personas;
  },

  markAsSynced: async (id) => {
    const p = await db.personas.get(id);
    if (p && p.sync_status === 'deleted') {
      await db.transaction('rw', db.personas, db.contactos, db.encuestas, async () => {
        await db.contactos.where('persona_id').equals(id).delete();
        await db.encuestas.where('persona_id').equals(id).delete();
        await db.personas.delete(id);
      });
    } else {
      await db.personas.update(id, { sync_status: 'synced', updated_at: new Date().toISOString() });
    }
  },

  /** Sincronización desde el servidor (Pull) */
  syncFromServer: async (serverPersonas, serverContactos) => {
    return db.transaction('rw', db.personas, db.contactos, async () => {
      // Mapa para asociar el ID del servidor con el ID local de Dexie
      const serverToLocalId = {};

      // 1. Guardar o actualizar personas
      for (const sp of serverPersonas) {
        const local = await db.personas.where('cc').equals(sp.cc).first();
        if (local) {
          serverToLocalId[sp.id] = local.id; // Mapeamos
          
          // Si estaba marcado para borrar, ignoramos cualquier actualización del servidor
          if (local.sync_status === 'deleted') continue;
          
          if (new Date(sp.updated_at) > new Date(local.updated_at)) {
            await db.personas.update(local.id, { ...sp, id: local.id, sync_status: 'synced' });
          } else if (local.sync_status !== 'local') {
             await db.personas.update(local.id, { sync_status: 'synced' });
          }
        } else {
          // Es nueva desde el servidor, la guardamos
          const newId = await db.personas.put({ ...sp, sync_status: 'synced' });
          serverToLocalId[sp.id] = newId;
        }
      }

      // 1.5 Borrar localmente las que estaban sincronizadas pero ya no existen en el servidor
      const serverCcSet = new Set(serverPersonas.map(p => p.cc));
      const locales = await db.personas.toArray();
      for (const loc of locales) {
        if (loc.sync_status === 'synced' && !serverCcSet.has(loc.cc)) {
          await db.contactos.where('persona_id').equals(loc.id).delete();
          await db.encuestas.where('persona_id').equals(loc.id).delete();
          await db.personas.delete(loc.id);
        }
      }

      // 2. Limpiar y recrear contactos usando los IDs locales
      if (serverContactos && serverContactos.length > 0) {
        const localIdsToUpdate = Object.values(serverToLocalId);
        if (localIdsToUpdate.length > 0) {
          await db.contactos.where('persona_id').anyOf(localIdsToUpdate).delete();
        }

        for (const sc of serverContactos) {
          const localPersonaId = serverToLocalId[sc.persona_id];
          if (localPersonaId) {
            const { id, ...contactData } = sc;
            // Forzar a booleano porque MySQL lo devuelve como 1 o 0
            contactData.activo = contactData.activo === 1 || contactData.activo === true;
            await db.contactos.put({ ...contactData, persona_id: localPersonaId });
          }
        }
      }
    });
  }
};
