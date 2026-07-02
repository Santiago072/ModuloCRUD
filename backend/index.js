const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const encuestadoresRoutes = require('./routes/encuestadoresRoutes');
const apiRoutes = require('./routes/api');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/encuestadores', encuestadoresRoutes);
app.use('/api', apiRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en el puerto ${PORT}`);
});
