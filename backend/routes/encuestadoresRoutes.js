const express = require('express');
const router = express.Router();
const encuestadoresController = require('../controllers/encuestadoresController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Obtener la lista pública (para el select del PWA, no requiere token)
router.get('/', encuestadoresController.getAll);

// Rutas protegidas (solo para el panel de administración)
router.post('/', verifyToken, encuestadoresController.create);
router.put('/:id', verifyToken, encuestadoresController.update);
router.delete('/:id', verifyToken, encuestadoresController.remove);

module.exports = router;
