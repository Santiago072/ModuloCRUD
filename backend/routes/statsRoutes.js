const express = require('express'); 
const router = express.Router(); 
const pool = require('../config/db'); 
const { verifyToken } = require('../middlewares/authMiddleware'); 

router.get('/', verifyToken, async (req, res) => { 
  try { 
    // Auto-heal missing encuestas from personas
    await pool.query(`
      INSERT IGNORE INTO encuestas (persona_id, encuestador, fecha, usuario_id) 
      SELECT id, 'N/A', fecha_registro, usuario_id FROM personas 
      WHERE id NOT IN (SELECT persona_id FROM encuestas)
    `);

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

router.get('/encuestas', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.cc, p.nombres, p.apellidos, p.profesion, p.fecha_registro, 
             e.encuestador, e.fecha as fecha_encuesta,
             (SELECT valor FROM contactos c WHERE c.persona_id = p.id AND c.activo = 1 ORDER BY prioridad ASC LIMIT 1) as contacto
      FROM personas p
      LEFT JOIN encuestas e ON p.id = e.persona_id
      ORDER BY p.created_at DESC
    `);
    res.json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener encuestas' });
  }
});

module.exports = router;
