require('dotenv').config();  // Esto cargará las variables del archivo .env
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.Notificacion = require('./notificacion')(sequelize, Sequelize);

// Importar el modelo User
db.User = require('./user')(sequelize, DataTypes);

module.exports = db;
