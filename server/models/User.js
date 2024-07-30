module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            birthDate: {
                type: DataTypes.DATEONLY(),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            mailingAddress: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        },
        {
            tableName: "users" 
        }
    );
    return User;
};
