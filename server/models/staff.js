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
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        role: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        salary: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName: 'staff'
    });
    return Staff;
}
