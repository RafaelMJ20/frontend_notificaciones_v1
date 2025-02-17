const express = require('express');
const router = express.Router();
const db = require('../models');

const calcularEstadoYHabilitacion = (notificacion) => {
    const cutoffDate = new Date('2025-02-01T00:00:00'); // Fecha límite: 1 de febrero 2025
    const fechaCreacion = new Date(notificacion.fecha);

    // Si la notificación es anterior al 1 de febrero 2025, retorna valores originales
    if (fechaCreacion < cutoffDate) {
        return {
            estado: notificacion.estado,
            habilitado: notificacion.habilitado
        };
    }

    // Cálculo solo para notificaciones posteriores al 1 de febrero 2025
    const now = new Date();
    const diasTranscurridos = Math.floor((now - fechaCreacion) / (1000 * 60 * 60 * 24));

    let numero = notificacion.numero;
    let estado = notificacion.estado;
    let habilitado = false;

    if (diasTranscurridos >= 9) {
        numero = 'Inspección';
        estado = 'Inspección';
        habilitado = true;
    } else if (diasTranscurridos >= 6) {
        numero = '3ra notificación';
        estado = '3ra notificación';
        habilitado = true;
    } else if (diasTranscurridos >= 3) {
        numero = '2da notificación';
        estado = '2da notificación';
        habilitado = true;
    }

    return { numero, estado, habilitado };
};

// Crear notificación
router.post('/', async (req, res) => {
    try {
        const notificacion = await db.Notificacion.create(req.body);
        res.status(201).json(notificacion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener todas las notificaciones
router.get('/', async (req, res) => {
    try {
        const notificaciones = await db.Notificacion.findAll();

        // Calcular el estado y habilitación para cada notificación
        const notificacionesActualizadas = notificaciones.map(notificacion => {
            const { estado, habilitado } = calcularEstadoYHabilitacion(notificacion);
            return {
                ...notificacion.toJSON(),
                estado,
                habilitado,
            };
        });

        res.json(notificacionesActualizadas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const notificacion = await db.Notificacion.findByPk(req.params.id);
        if (!notificacion) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        } 

        const cutoffDate = new Date('2025-02-01T00:00:00');
        const fechaCreacion = new Date(notificacion.fecha);

        // Si es anterior al 1 de febrero 2025, no permite cambios de estado/habilitado
        if (fechaCreacion < cutoffDate) {
            return res.status(400).json({ 
                error: 'No se pueden editar notificaciones anteriores al 1 de febrero 2025' 
            });
        }

        const { numero, estado, habilitado } = calcularEstadoYHabilitacion(notificacion);

        if (!habilitado) {
            return res.status(400).json({ error: 'La notificación no está habilitada para editar' });
        }

        await notificacion.update({ numero, estado, ...req.body });
        res.json({ message: 'Notificación actualizada correctamente', notificacion });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Eliminar notificación
router.delete('/:id', async (req, res) => {
    try {
        await db.Notificacion.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Notificación eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
