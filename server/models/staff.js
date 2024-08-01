module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define(
        "Staff",
        {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            birthDate: {
                type: DataTypes.DATEONLY(),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            homeAddress: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
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
            joinDate: {
                type: DataTypes.DATEONLY(),
                allowNull: false,
            },
        },
        {
            tableName: "staff",
        }
    );
    return Staff;
};
