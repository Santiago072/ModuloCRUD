import db from '../schema';

export const ContactoRepository = {
  getByPersona: (personaId) =>
    db.contactos
      .where('persona_id').equals(personaId)
      .and(c => Boolean(c.activo))
      .sortBy('prioridad'),

  /** Algoritmo 5.2 — Rotación de prioridades */
  addContacto: async (personaId, tipo, valor) => {
    const valorLimpio = valor.trim();
    if (!valorLimpio) return { changed: false };

    return db.transaction('rw', db.contactos, db.personas, async () => {
      // 1. Buscar si el contacto ya existe para esta persona (activo o inactivo)
      const existente = await db.contactos
        .where('persona_id').equals(personaId)
        .and(c => c.valor === valorLimpio)
        .first();

      // Si ya existe, está activo y ya es el principal (prioridad 1), no se rota
      if (existente && (existente.activo === true || existente.activo === 1) && existente.prioridad === 1) {
        return { changed: false, message: 'El contacto ya es el principal.' };
      }

      // 2. Obtener los contactos activos actuales de la persona
      const activos = await db.contactos
        .where('persona_id').equals(personaId)
        .and(c => c.activo === true || c.activo === 1)
        .sortBy('prioridad');

      // Si ya existía y estaba activo, solo los que estaban por encima de él deben bajar una posición
      const p_existente = (existente && (existente.activo === true || existente.activo === 1))
        ? existente.prioridad
        : 999;

      // 3. Rotar prioridades de los demás contactos activos
      for (const c of activos) {
        if (existente && c.id === existente.id) continue;

        if (c.prioridad < p_existente) {
          const nuevaPrioridad = c.prioridad + 1;
          if (nuevaPrioridad > 3) {
            await db.contactos.update(c.id, { activo: false, updated_at: new Date().toISOString() });
          } else {
            await db.contactos.update(c.id, { prioridad: nuevaPrioridad, updated_at: new Date().toISOString() });
          }
        }
      }

      // 4. Asignar al contacto actual la prioridad 1 (Principal)
      let newId;
      const now = new Date().toISOString();
      if (existente) {
        await db.contactos.update(existente.id, {
          prioridad: 1,
          activo: true,
          updated_at: now,
        });
        newId = existente.id;
      } else {
        newId = await db.contactos.add({
          persona_id: personaId,
          tipo: tipo || 'celular',
          valor: valorLimpio,
          prioridad: 1,
          activo: true,
          created_at: now,
          updated_at: now,
        });
      }

      // 5. Marcar persona como local para sincronizar con el servidor
      await db.personas.update(personaId, { sync_status: 'local', updated_at: now });

      return { changed: true, id: newId };
    });
  },
};
