const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const encuestadoresRoutes = require('./routes/encuestadoresRoutes');
const apiRoutes = require('./routes/api');
const statsRoutes = require('./routes/statsRoutes');

// ── Validación de variables de entorno críticas al arranque ──────────────────
const REQUIRED_ENV = ['JWT_SECRET', 'ALLOWED_ORIGINS'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`[ERROR] Variables de entorno faltantes: ${missingEnv.join(', ')}`);
  console.error('Define estas variables en tu archivo .env antes de iniciar el servidor.');
  process.exit(1);
}

// ── Configuración de CORS con lista blanca de orígenes ───────────────────────
// ALLOWED_ORIGINS en .env: lista separada por comas, ej:
// ALLOWED_ORIGINS=https://modulocrud.slscode.online,http://localhost:8893
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Permite peticiones sin origen (Postman, curl, apps móviles nativas)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const err = new Error(`Origen no permitido por política CORS: ${origin}`);
    err.status = 403;
    callback(err);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/encuestadores', encuestadoresRoutes);
app.use('/api', apiRoutes);
app.use('/api/stats', statsRoutes);

// Manejador global de errores (garantiza respuestas JSON, nunca HTML)
app.use((err, req, res, next) => {
  console.error('[API ERROR]', err.message);
  const statusCode = err.status || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en el puerto ${PORT}`);
});

