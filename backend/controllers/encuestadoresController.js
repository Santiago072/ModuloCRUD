const pool = require('../config/db');

// Obtener todos los encuestadores
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM encuestadores ORDER BY nombre ASC');
    res.json({ status: 'success', data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al obtener encuestadores' });
  }
};

// Crear un nuevo encuestador
exports.create = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ status: 'error', message: 'El nombre es obligatorio' });
  }

  try {
    const [result] = await pool.query('INSERT INTO encuestadores (nombre) VALUES (?)', [nombre]);
    res.json({ status: 'success', data: { id: result.insertId, nombre, activo: 1 } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al crear encuestador' });
  }
};

// Actualizar (ej: desactivar o cambiar nombre)
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, activo } = req.body;

  try {
    await pool.query('UPDATE encuestadores SET nombre = ?, activo = ? WHERE id = ?', [nombre, activo ? 1 : 0, id]);
    res.json({ status: 'success', message: 'Encuestador actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar encuestador' });
  }
};

// Eliminar
exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM encuestadores WHERE id = ?', [id]);
    res.json({ status: 'success', message: 'Encuestador eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar encuestador' });
  }
};
