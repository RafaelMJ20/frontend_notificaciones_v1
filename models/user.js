module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rol: {
            type: DataTypes.ENUM('admin', 'viewer'),
            allowNull: false,
            defaultValue: 'viewer'
          }
    });

    return User;
};
