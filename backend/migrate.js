const pool = require('./config/db');

const migrate = async () => {
  try {
    console.log('Iniciando migración de base de datos...');

    const queries = [
      `CREATE TABLE IF NOT EXISTS encuestas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          persona_id INT NOT NULL,
          fecha DATE NOT NULL,
          encuestador VARCHAR(100) NOT NULL,
          notas TEXT DEFAULT NULL,
          sync_status ENUM('local', 'synced', 'conflict') DEFAULT 'synced',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          rol ENUM('admin', 'user') DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS encuestadores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          activo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `INSERT IGNORE INTO usuarios (username, password_hash, rol) VALUES ('admin', '$2b$10$.pH9Y/LD7xuFevs9sZ08cu2aDF5tUcRiaQC4llY2tHUea/4lID5o2', 'admin')`
    ];

    for (let i = 0; i < queries.length; i++) {
      await pool.query(queries[i]);
      console.log(`[OK] Query ${i + 1} ejecutada con éxito.`);
    }

    console.log('¡Migración completada exitosamente! Ya tienes las tablas de administrador.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
};

migrate();
