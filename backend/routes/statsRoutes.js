const express = require('express'); 
const router = express.Router(); 
const pool = require('../config/db'); 
const { verifyToken } = require('../middlewares/authMiddleware'); 

router.get('/', verifyToken, async (req, res) => { 
  try { 
    const [totalEncuestas] = await pool.query('SELECT COUNT(*) as total FROM encuestas'); 
    const [totalPersonas] = await pool.query('SELECT COUNT(*) as total FROM personas'); 
    const [ranking] = await pool.query(`
      SELECT u.username as encuestador, COUNT(e.id) as cantidad 
      FROM encuestas e
      LEFT JOIN usuarios u ON e.usuario_id = u.id
      GROUP BY u.id
      ORDER BY cantidad DESC 
      LIMIT 5
    `); 
    
    res.json({ 
      status: 'success', 
      data: { 
        totalEncuestas: totalEncuestas[0].total, 
        totalPersonas: totalPersonas[0].total, 
        ranking 
      } 
    }); 
  } catch (error) { 
    res.status(500).json({ status: 'error', message: 'Error al obtener estadísticas' }); 
  } 
}); 

module.exports = router;
