module.exports = (sequelize, DataTypes) => {
    const SignUp = sequelize.define("SignUp", {
        user_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(16),
            allowNull: false
        },
        nric: {
            type: DataTypes.STRING(12),
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'events',
                key: 'id'
            },
            allowNull: false
        }
    }, {
        tableName: 'signups'
    });
    return SignUp;
}
