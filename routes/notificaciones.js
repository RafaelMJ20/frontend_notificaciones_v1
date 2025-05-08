const express = require('express');
const router = express.Router();
const db = require('../models');
const verificarRol = require('../middlewares/verificarRol');

const calcularEstadoYHabilitacion = (notificacion) => {
    const cutoffDate = new Date('2025-02-25T00:00:00'); // Fecha límite: 1 de febrero 2025
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

// Crear notificación → solo admin
router.post('/', verificarRol(['admin']), async (req, res) => {
    try {
        const notificacion = await db.Notificacion.create(req.body);
        res.status(201).json(notificacion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener todas las notificaciones → cualquier rol
router.get('/', async (req, res) => {
    try {
        const notificaciones = await db.Notificacion.findAll();

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

// Actualizar notificación → solo admin
router.put('/:id', verificarRol(['admin']), async (req, res) => {
    try {
        const notificacion = await db.Notificacion.findByPk(req.params.id);
        if (!notificacion) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        } 

        const cutoffDate = new Date('2025-02-01T00:00:00');
        const fechaCreacion = new Date(notificacion.fecha);

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

// Eliminar notificación → solo admin
router.delete('/:id', verificarRol(['admin']), async (req, res) => {
    try {
        await db.Notificacion.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Notificación eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para alternar estado de resuelta
router.put('/:id/resuelta', verificarRol(['admin']), async (req, res) => {
    try {
      const notificacion = await db.Notificacion.findByPk(req.params.id);
      if (!notificacion) return res.status(404).json({ error: 'No encontrada' });
  
      notificacion.resuelta = !notificacion.resuelta; // Cambiar el estado
      await notificacion.save();
  
      res.json({ message: 'Estado actualizado', resuelta: notificacion.resuelta });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar estado' });
    }
  });
  

module.exports = router;
