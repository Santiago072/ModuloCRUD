const pool = require('../config/db');

// Obtener todas las personas registradas
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM personas ORDER BY created_at DESC');
    res.json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Crear una nueva persona con hasta 3 contactos (Transacción)
exports.create = async (req, res) => {
  const { cc, nombres, apellidos, fecha_registro, profesion, contactos = [] } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [personResult] = await connection.query(
      'INSERT INTO personas (cc, nombres, apellidos, fecha_registro, profesion) VALUES (?, ?, ?, ?, ?)',
      [cc, nombres, apellidos, fecha_registro, profesion]
    );
    const personaId = personResult.insertId;

    // Insertar hasta 3 contactos con sus prioridades
    for (let i = 0; i < contactos.length; i++) {
      const c = contactos[i];
      if (c?.valor?.trim()) {
        await connection.query(
          'INSERT INTO contactos (persona_id, tipo, valor, prioridad) VALUES (?, ?, ?, ?)',
          [personaId, c.tipo || 'celular', c.valor.trim(), i + 1]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ status: 'success', message: 'Persona creada exitosamente', id: personaId });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ status: 'error', message: error.message });
  } finally {
    connection.release();
  }
};

/** Actualizar datos de una persona */
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, profesion, fecha_registro } = req.body;
  try {
    await pool.query(
      'UPDATE personas SET nombres=?, apellidos=?, profesion=?, fecha_registro=?, updated_at=NOW() WHERE id=?',
      [nombres, apellidos, profesion, fecha_registro, id]
    );
    res.json({ status: 'success', message: 'Persona actualizada.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/** Eliminar una persona y sus registros relacionados */
exports.remove = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM contactos WHERE persona_id = ?', [id]);
    await connection.query('DELETE FROM encuestas WHERE persona_id = ?', [id]);
    await connection.query('DELETE FROM personas WHERE id = ?', [id]);
    await connection.commit();
    res.json({ status: 'success', message: 'Persona eliminada.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ status: 'error', message: error.message });
  } finally {
    connection.release();
  }
};
