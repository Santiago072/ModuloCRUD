const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const encuestadoresRoutes = require('./routes/encuestadoresRoutes');
const apiRoutes = require('./routes/api');
const statsRoutes = require('./routes/statsRoutes');

// ── Fallbacks para variables de entorno críticas (previene caídas y 502 Bad Gateway) ──
if (!process.env.JWT_SECRET) {
  console.warn('[WARN] JWT_SECRET no definido en .env, usando clave por defecto');
  process.env.JWT_SECRET = 'supersecret_modulocrud_key_2026_jwt_token_auth_secret';
}
if (!process.env.ALLOWED_ORIGINS) {
  console.warn('[WARN] ALLOWED_ORIGINS no definido en .env, usando lista por defecto');
  process.env.ALLOWED_ORIGINS = 'https://modulocrud.slscode.online,http://localhost:8893,http://localhost:5173,http://localhost:3000,http://127.0.0.1:8893,http://127.0.0.1:5173';
}

// ── Configuración de CORS con lista blanca de orígenes ───────────────────────
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

