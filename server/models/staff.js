module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define("Staff", {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        role: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'staff'
    });
    return Staff;
}
