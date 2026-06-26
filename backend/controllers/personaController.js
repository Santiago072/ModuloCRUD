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

// Crear una nueva persona y su contacto principal (Transacción)
exports.create = async (req, res) => {
  const { cc, nombres, apellidos, fecha_registro, profesion, contacto } = req.body;
  const connection = await pool.getConnection();
  
  try {
    // Iniciamos transacción para asegurar que se guarda la persona Y su contacto, o nada.
    await connection.beginTransaction();

    // 1. Insertar persona
    const [personResult] = await connection.query(
      'INSERT INTO personas (cc, nombres, apellidos, fecha_registro, profesion) VALUES (?, ?, ?, ?, ?)',
      [cc, nombres, apellidos, fecha_registro, profesion]
    );
    const personaId = personResult.insertId;

    // 2. Si viene un contacto principal, lo insertamos con prioridad 1
    if (contacto && contacto.valor) {
      await connection.query(
        'INSERT INTO contactos (persona_id, tipo, valor, prioridad) VALUES (?, ?, ?, ?)',
        [personaId, contacto.tipo || 'celular', contacto.valor, 1]
      );
    }

    // Confirmamos la transacción
    await connection.commit();
    res.status(201).json({ status: 'success', message: 'Persona creada exitosamente', id: personaId });
  } catch (error) {
    // Si hay error (ej. Cédula duplicada), revertimos todo
    await connection.rollback();
    res.status(400).json({ status: 'error', message: error.message });
  } finally {
    connection.release();
  }
};
