module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define(
        "Staff",
        {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            // TODO: birth date
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            // TODO: homeAddress
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            role: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            department: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            // TODO: date joined
        },
        {
            tableName: "staff",
        }
    );
    return Staff;
};
