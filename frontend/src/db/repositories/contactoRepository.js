import db from '../schema';

/**
 * Repository de Contactos con lógica de rotación de prioridades.
 * Implementa el Algoritmo 5.2 de la Especificación de Requisitos, localmente.
 */
export const ContactoRepository = {

  /** Obtener todos los contactos activos de una persona, ordenados por prioridad */
  getByPersona: (personaId) =>
    db.contactos
      .where('persona_id').equals(personaId)
      .and(c => c.activo === true)
      .sortBy('prioridad'),

  /**
   * Agregar un nuevo contacto y rotar los existentes.
   * Reglas (Algoritmo 5.2):
   * 1. Si el valor ya existe → no hacer nada.
   * 2. Si es nuevo → nuevo pasa a prioridad 1, los demás se desplazan +1.
   * 3. Si alguno pasa de prioridad 3 → activo = false (archivado).
   */
  addContacto: async (personaId, tipo, valor) => {
    return db.transaction('rw', db.contactos, async () => {
      // Paso 1: Verificar duplicado
      const existente = await db.contactos
        .where({ persona_id: personaId, valor })
        .and(c => c.activo === true)
        .first();

      if (existente) return { changed: false, message: 'Contacto ya existe (integridad garantizada).' };

      // Paso 2: Desplazar prioridades de los contactos activos existentes
      const activos = await db.contactos
        .where('persona_id').equals(personaId)
        .and(c => c.activo === true)
        .toArray();

      for (const c of activos) {
        const nuevaPrioridad = c.prioridad + 1;
        if (nuevaPrioridad > 3) {
          await db.contactos.update(c.id, { activo: false }); // Archivar
        } else {
          await db.contactos.update(c.id, { prioridad: nuevaPrioridad }); // Desplazar
        }
      }

      // Paso 3: Insertar el nuevo como principal (prioridad 1)
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
