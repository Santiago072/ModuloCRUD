import db from '../schema';

export const ContactoRepository = {
  getByPersona: (personaId) =>
    db.contactos
      .where('persona_id').equals(personaId)
      .and(c => c.activo === true)
      .sortBy('prioridad'),

  /** Algoritmo 5.2 — Rotación de prioridades */
  addContacto: async (personaId, tipo, valor) => {
    return db.transaction('rw', db.contactos, db.personas, async () => {
      const existente = await db.contactos
        .where({ persona_id: personaId, valor })
        .first();

      if (existente && existente.activo && existente.prioridad === 1) {
        return { changed: false, message: 'El contacto ya es el principal.' };
      }

      const activos = await db.contactos
        .where('persona_id').equals(personaId)
        .and(c => c.activo === true)
        .toArray();

      const p_existente = (existente && existente.activo) ? existente.prioridad : 999;

      for (const c of activos) {
        if (c.id === existente?.id) continue;

        if (c.prioridad < p_existente) {
          const nuevaPrioridad = c.prioridad + 1;
          if (nuevaPrioridad > 3) {
            await db.contactos.update(c.id, { activo: false });
          } else {
            await db.contactos.update(c.id, { prioridad: nuevaPrioridad });
          }
        }
      }

      let newId;
      if (existente) {
        await db.contactos.update(existente.id, {
          prioridad: 1,
          activo: true,
          updated_at: new Date().toISOString()
        });
        newId = existente.id;
      } else {
        newId = await db.contactos.add({
          persona_id: personaId,
          tipo,
          valor,
          prioridad: 1,
          activo: true,
          created_at: new Date().toISOString(),
        });
      }

      // ¡Importante! Marcar la persona como local para que el SyncManager suba los contactos actualizados
      await db.personas.update(personaId, { sync_status: 'local', updated_at: new Date().toISOString() });

      return { changed: true, id: newId };
    });
  },
};
