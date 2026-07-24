const pool = require('./config/db');

const resetDB = async () => {
  try {
    console.log('Vaciando tablas...');
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE contactos');
    await pool.query('TRUNCATE TABLE encuestas');
    await pool.query('TRUNCATE TABLE personas');
    await pool.query("DELETE FROM usuarios WHERE username != 'admin'");
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Tablas vaciadas. Solo queda el usuario admin.');
    process.exit(0);
  } catch (error) {
    console.error('Error vaciando tablas:', error);
    process.exit(1);
  }
};

resetDB();
