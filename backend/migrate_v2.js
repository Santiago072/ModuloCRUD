const pool = require('./config/db');

const migrate = async () => {
  try {
    console.log('Migrando base de datos a V2...');
    
    try {
      await pool.query('ALTER TABLE encuestas ADD COLUMN usuario_id INT');
      console.log('Columna usuario_id añadida a encuestas');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') throw e;
      console.log('Columna usuario_id ya existe en encuestas');
    }

    try {
      await pool.query('ALTER TABLE personas ADD COLUMN usuario_id INT');
      console.log('Columna usuario_id añadida a personas');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') throw e;
      console.log('Columna usuario_id ya existe en personas');
    }

    await pool.query('DROP TABLE IF EXISTS encuestadores');
    console.log('Tabla encuestadores eliminada');

    console.log('Migración completada.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};
migrate();
