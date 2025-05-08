// middlewares/verificarRol.js
module.exports = function (rolesPermitidos = []) {
    return (req, res, next) => {
        const rol = req.body?.rol || req.query?.rol;

        if (!rol || !rolesPermitidos.includes(rol)) {
            return res.status(403).json({ message: 'Acceso denegado: permiso insuficiente' });
        }

        next();
    };
};
