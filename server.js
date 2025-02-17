require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models'); // Base de datos
const loginRoutes = require('./routes/login');
const notificacionesRoutes = require('./routes/notificaciones');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use('/login', loginRoutes);
app.use('/notificaciones', notificacionesRoutes);

// Sincronizar base de datos
db.sequelize.sync( {alter: true} )
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch((err) => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
