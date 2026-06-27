const pool = require('../config/db');

// GET: Descargar todos los datos desde el servidor hacia el cliente (Pull)
exports.pullData = async (req, res) => {
  try {
    const [personas] = await pool.query('SELECT * FROM personas');
    const [contactos] = await pool.query('SELECT * FROM contactos WHERE activo = 1');
    
    res.json({
      status: 'success',
      data: {
        personas,
        contactos
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error descargando datos del servidor', error: error.message });
  }
};

// POST: Recibir cola de sincronización desde el cliente (Push)
exports.syncOfflineData = async (req, res) => {
  const { registros_offline } = req.body; 
  
  if (!Array.isArray(registros_offline)) {
    return res.status(400).json({ status: 'error', message: 'Payload inválido. Se esperaba un array "registros_offline".' });
  }

  const connection = await pool.getConnection();
  let syncSuccess = 0;
  let syncErrors = 0;

  try {
    await connection.beginTransaction();

    for (const p of registros_offline) {
      try {
        // 1. UPSERT Persona (basado en la CC que es única)
        const [existing] = await connection.query('SELECT id, updated_at FROM personas WHERE cc = ?', [p.cc]);
        
        let personaId;
        if (existing.length > 0) {
          personaId = existing[0].id;
          // Si el registro del cliente es más reciente (o igual), actualizamos.
          // En caso de que no tengamos lógica compleja, sobreescribimos.
          await connection.query(
            'UPDATE personas SET nombres=?, apellidos=?, profesion=?, fecha_registro=?, updated_at=NOW() WHERE id=?',
            [p.nombres, p.apellidos, p.profesion, p.fecha_registro, personaId]
          );
        } else {
          // Si no existe, usamos el ID que venga o dejamos que MySQL auto-incremente.
          // Recomendado: dejar que MySQL auto-incremente o forzar el ID si coinciden.
          // Usaremos el mismo ID de Dexie para simplificar la consistencia (si no choca).
          // Pero es más seguro dejar el autoincrement.
          const [result] = await connection.query(
            'INSERT INTO personas (id, cc, nombres, apellidos, fecha_registro, profesion) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nombres=VALUES(nombres), apellidos=VALUES(apellidos), profesion=VALUES(profesion), fecha_registro=VALUES(fecha_registro)',
            [p.id, p.cc, p.nombres, p.apellidos, p.fecha_registro, p.profesion]
          );
          personaId = p.id;
        }

        // 2. Reemplazar contactos para esa persona
        if (p.contactos && p.contactos.length > 0) {
          await connection.query('DELETE FROM contactos WHERE persona_id = ?', [personaId]);
          for (const c of p.contactos) {
            await connection.query(
              'INSERT INTO contactos (persona_id, tipo, valor, prioridad, activo) VALUES (?, ?, ?, ?, ?)',
              [personaId, c.tipo || 'celular', c.valor, c.prioridad || 1, c.activo ? 1 : 0]
            );
          }
        }
        
        syncSuccess++;
      } catch (err) {
        console.error('Error insertando persona CC ' + p.cc, err);
        syncErrors++;
      }
    }

    await connection.commit();
    res.status(200).json({ 
      status: 'success', 
      message: 'Sincronización procesada', 
      stats: { synced: syncSuccess, errors: syncErrors }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ status: 'error', message: 'Error en la sincronización', error: error.message });
  } finally {
    connection.release();
  }
};
