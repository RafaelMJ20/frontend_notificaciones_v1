// backend/routes/login.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Correo electrónico no encontrado' });
        }

        // Comparar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Si todo es correcto, enviar la respuesta de éxito
        return res.json({ message: 'Inicio de sesión exitoso' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
