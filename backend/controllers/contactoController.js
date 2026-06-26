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

    // 1. Verificar si el contacto ya existe para esta persona
    const [existentes] = await connection.query(
      'SELECT id FROM contactos WHERE persona_id = ? AND valor = ?',
      [persona_id, valor]
    );

    if (existentes.length > 0) {
      await connection.rollback();
      return res.status(200).json({ status: 'success', message: 'El contacto ya existe. No hay cambios (Integridad garantizada).' });
    }

    // 2. Desplazar prioridades existentes (1 -> 2, 2 -> 3)
    await connection.query(
      'UPDATE contactos SET prioridad = prioridad + 1 WHERE persona_id = ? AND activo = true',
      [persona_id]
    );

    // 3. Desactivar (archivar) los que pasaron a prioridad > 3
    await connection.query(
      'UPDATE contactos SET activo = false WHERE persona_id = ? AND prioridad > 3',
      [persona_id]
    );

    // 4. Insertar el nuevo contacto como el principal (prioridad = 1)
    const [insertResult] = await connection.query(
      'INSERT INTO contactos (persona_id, tipo, valor, prioridad, activo) VALUES (?, ?, ?, 1, true)',
      [persona_id, tipo, valor]
    );

    await connection.commit();
    res.status(201).json({ status: 'success', message: 'Contacto agregado y rotado exitosamente', id: insertResult.insertId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ status: 'error', message: error.message });
  } finally {
    connection.release();
  }
};
