const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de la Base de Datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'modulocrud'
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Endpoint de prueba de conexión y estado del servidor
app.get('/api/status', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: 'ok', message: 'API Node.js conectada a la Base de Datos.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Fallo al conectar con la Base de Datos.', error: error.message });
  }
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en el puerto ${PORT}`);
});
