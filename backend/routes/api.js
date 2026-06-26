const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const personaController = require('../controllers/personaController');

// 1. Endpoint de prueba de conexión
router.get('/status', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: 'ok', message: 'API Node.js conectada a la Base de Datos MySQL.' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// 2. Endpoints CRUD para Personas
router.get('/personas', personaController.getAll);
router.post('/personas', personaController.create);
router.put('/personas/:id', personaController.update);
router.delete('/personas/:id', personaController.remove);

// 3. Endpoints para Contactos (Lógica de rotación)
const contactoController = require('../controllers/contactoController');
router.post('/contactos', contactoController.addContacto);

// 4. Endpoint Core: Sincronización PWA (Offline-First)
const syncController = require('../controllers/syncController');
router.post('/sync', syncController.syncOfflineData);

module.exports = router;
