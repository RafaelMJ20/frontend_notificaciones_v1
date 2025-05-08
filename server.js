require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models'); // Base de datos
const loginRoutes = require('./routes/login');
const notificacionesRoutes = require('./routes/notificaciones');

const app = express();

// 🔹 Configurar CORS correctamente
const corsOptions = {
    origin: ["http://127.0.0.1:8080"], // Agrega la URL de tu frontend en Render
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas
app.use('/login', loginRoutes);
app.use('/notificaciones', notificacionesRoutes);

// 🔹 Sincronizar base de datos con manejo de errores
db.sequelize.sync({ alter: true })
    .then(() => console.log('✅ Base de datos sincronizada'))
    .catch((err) => console.error('❌ Error al sincronizar la base de datos:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
