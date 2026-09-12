const pool = require('../config/db');

// Lógica de rotación de contactos (Requisito 5.2 de la Documentación)
exports.addContacto = async (req, res) => {
  const { persona_id, tipo, valor } = req.body;
  
  if (!persona_id || !valor || !tipo) {
    return res.status(400).json({ status: 'error', message: 'Faltan datos requeridos (persona_id, tipo, valor).' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Verificar si el contacto ya existe para esta persona (activo o inactivo)
    const [existentes] = await connection.query(
      'SELECT id, prioridad, activo FROM contactos WHERE persona_id = ? AND valor = ?',
      [persona_id, valor]
    );

    const existente = existentes.length > 0 ? existentes[0] : null;

    // Si ya existe, está activo y ya es prioridad 1, no hacer nada
    if (existente && (existente.activo === 1 || existente.activo === true) && existente.prioridad === 1) {
      await connection.rollback();
      return res.status(200).json({ status: 'success', message: 'El contacto ya es el principal.' });
    }

    const pExistente = (existente && (existente.activo === 1 || existente.activo === true))
      ? existente.prioridad
      : 999;

    // 2. Rotar prioridades de los que estaban antes que él
    await connection.query(
      'UPDATE contactos SET prioridad = prioridad + 1 WHERE persona_id = ? AND (activo = 1 OR activo = true) AND prioridad < ?',
      [persona_id, pExistente]
    );

    // 3. Desactivar los que pasaron de prioridad 3
    await connection.query(
      'UPDATE contactos SET activo = 0 WHERE persona_id = ? AND prioridad > 3',
      [persona_id]
    );

    // 4. Si existía, reactivarlo y ponerlo en 1; si no, insertarlo en 1
    let contactoId;
    if (existente) {
      await connection.query(
        'UPDATE contactos SET prioridad = 1, activo = 1, updated_at = NOW() WHERE id = ?',
        [existente.id]
      );
      contactoId = existente.id;
    } else {
      const [insertResult] = await connection.query(
        'INSERT INTO contactos (persona_id, tipo, valor, prioridad, activo) VALUES (?, ?, ?, 1, 1)',
        [persona_id, tipo, valor]
      );
      contactoId = insertResult.insertId;
    }

    await connection.commit();
    res.status(201).json({ status: 'success', message: 'Contacto agregado y rotado exitosamente', id: contactoId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ status: 'error', message: error.message });
  } finally {
    connection.release();
  }
};
