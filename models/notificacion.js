module.exports = (sequelize, DataTypes) => {
    const Notificacion = sequelize.define('Notificacion', {
        fecha: { type: DataTypes.DATE},
        numero: { type: DataTypes.STRING, allowNull: false },
        folio: { type: DataTypes.STRING, allowNull: false },
        nombre: { type: DataTypes.STRING, allowNull: false },
        ubicacion: { type: DataTypes.STRING, allowNull: false },
        comunidad: { type: DataTypes.STRING, allowNull: false },
        referencia: { type: DataTypes.STRING, allowNull: false },
        sup_aproximada: { type: DataTypes.FLOAT, allowNull: false },
        niveles: {type: DataTypes.INTEGER, allowNull: false},
        caracteristicas: { type: DataTypes.STRING }, // Lista separada por comas
        estado: { type: DataTypes.STRING},
        resuelta: { type: DataTypes.BOOLEAN, defaultValue: false },
        habilitado: { type: DataTypes.BOOLEAN, defaultValue: false }
    });

    // Hook para asignar el valor de "numero" a "estado"
    Notificacion.beforeCreate((notificacion) => {
        notificacion.estado = notificacion.numero.toString(); // Convertir a String
    });

    return Notificacion;
};
