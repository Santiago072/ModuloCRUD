const pool = require('../config/db');

// Recibir cola de sincronización desde el Background Sync (PWA Offline)
exports.syncOfflineData = async (req, res) => {
  const { registros_offline } = req.body; 
  
  if (!Array.isArray(registros_offline)) {
    return res.status(400).json({ status: 'error', message: 'Payload inválido. Se esperaba un array "registros_offline".' });
  }

  const connection = await pool.getConnection();
  let syncSuccess = 0;
  let syncErrors = 0;

  try {
    // Procesamos toda la cola en una transacción para mantener integridad
    await connection.beginTransaction();

    for (const registro of registros_offline) {
      // Aquí el algoritmo evaluaría qué tipo de registro es (Persona, Encuesta)
      // y compararía el campo 'updated_at' del cliente vs el del servidor
      // para resolver conflictos (como se detalla en el documento de Arquitectura).
      
      // Simulación de procesamiento:
      syncSuccess++;
    }

    await connection.commit();
    res.status(200).json({ 
      status: 'success', 
      message: 'Sincronización masiva procesada.', 
      stats: { synced: syncSuccess, errors: syncErrors }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ status: 'error', message: 'Error en la sincronización masiva', error: error.message });
  } finally {
    connection.release();
  }
};
