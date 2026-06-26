import db from '../schema';

export const ContactoRepository = {
  getByPersona: (personaId) =>
    db.contactos
      .where('persona_id').equals(personaId)
      .and(c => c.activo === true)
      .sortBy('prioridad'),

  /** Algoritmo 5.2 — Rotación de prioridades */
  addContacto: async (personaId, tipo, valor) => {
    return db.transaction('rw', db.contactos, async () => {
      const existente = await db.contactos
        .where({ persona_id: personaId, valor })
        .and(c => c.activo === true)
        .first();
      if (existente) return { changed: false, message: 'Contacto ya existe.' };

      const activos = await db.contactos
        .where('persona_id').equals(personaId)
        .and(c => c.activo === true)
        .toArray();

      for (const c of activos) {
        const nuevaPrioridad = c.prioridad + 1;
        if (nuevaPrioridad > 3) {
          await db.contactos.update(c.id, { activo: false });
        } else {
          await db.contactos.update(c.id, { prioridad: nuevaPrioridad });
        }
      }

      const newId = await db.contactos.add({
        persona_id: personaId,
        tipo,
        valor,
        prioridad: 1,
        activo: true,
        created_at: new Date().toISOString(),
      });
      return { changed: true, id: newId };
    });
  },
};
