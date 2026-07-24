const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ status: 'error', message: 'Faltan credenciales' });

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ? LIMIT 1', [username]);
    if (rows.length === 0) return res.status(401).json({ status: 'error', message: 'Usuario no encontrado' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET || 'supersecret_modulocrud_key',
      { expiresIn: '8h' }
    );

    res.json({
      status: 'success',
      token,
      user: { id: user.id, username: user.username, rol: user.rol }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) return res.status(400).json({ status: 'error', message: 'Faltan datos' });

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) return res.status(401).json({ status: 'error', message: 'La contraseña actual es incorrecta' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE usuarios SET password_hash = ? WHERE id = ?', [hashedNewPassword, userId]);

    res.json({ status: 'success', message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

// USER MANAGEMENT PARA ADMIN
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, rol, created_at FROM usuarios WHERE rol = "user"');
    res.json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ status: 'error', message: 'Faltan datos' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO usuarios (username, password_hash, rol) VALUES (?, ?, "user")', [username, hashedPassword]);
    res.json({ status: 'success', message: 'Usuario creado' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ status: 'error', message: 'El usuario ya existe' });
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id = ? AND rol = "user"', [req.params.id]);
    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { username, password } = req.body;
  const userId = req.params.id;
  if (!username) return res.status(400).json({ status: 'error', message: 'El nombre de usuario es obligatorio' });

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('UPDATE usuarios SET username = ?, password_hash = ? WHERE id = ? AND rol = "user"', [username, hashedPassword, userId]);
    } else {
      await pool.query('UPDATE usuarios SET username = ? WHERE id = ? AND rol = "user"', [username, userId]);
    }
    res.json({ status: 'success', message: 'Usuario actualizado' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ status: 'error', message: 'El nombre de usuario ya está en uso' });
    res.status(500).json({ status: 'error', message: error.message });
  }
};
