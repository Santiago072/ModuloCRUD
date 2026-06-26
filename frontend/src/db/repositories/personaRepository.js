import db from '../schema';

/**
 * Repository de Personas: Abstrae todas las operaciones de IndexedDB.
 * La capa de componentes React NUNCA llama a db directamente, siempre usa este repo.
 */
export const PersonaRepository = {

  /** Obtener todas las personas ordenadas por fecha de creación */
  getAll: () => db.personas.orderBy('id').reverse().toArray(),

  /** Obtener una persona por su ID interno */
  getById: (id) => db.personas.get(id),

  /** Obtener una persona por su Cédula */
  getByCc: (cc) => db.personas.where('cc').equals(cc).first(),

  /**
   * Crear una persona junto con su primer contacto (transacción atómica).
   * Replica la lógica de personaController.js del backend, pero en local.
   */
  create: async ({ cc, nombres, apellidos, fecha_registro, profesion, contacto }) => {
    const now = new Date().toISOString();
    return db.transaction('rw', db.personas, db.contactos, async () => {
      const personaId = await db.personas.add({
        cc, nombres, apellidos, fecha_registro, profesion,
        sync_status: 'local',
        created_at: now,
        updated_at: now,
      });

      if (contacto?.valor) {
        await db.contactos.add({
          persona_id: personaId,
          tipo: contacto.tipo || 'celular',
          valor: contacto.valor,
          prioridad: 1,
          activo: true,
          created_at: now,
        });
      }
      return personaId;
    });
  },

  /** Obtener todos los registros pendientes de sincronizar con el servidor */
  getPendingSync: () => db.personas.where('sync_status').equals('local').toArray(),

  /** Marcar un registro como sincronizado tras confirmar con el backend */
  markAsSynced: (id) => db.personas.update(id, { sync_status: 'synced', updated_at: new Date().toISOString() }),
};
