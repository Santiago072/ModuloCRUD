const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'Faltan credenciales' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ? LIMIT 1', [username]);
    
    if (rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET || 'supersecret_modulocrud_key',
      { expiresIn: '8h' }
    );

    res.json({
      status: 'success',
      token,
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};
