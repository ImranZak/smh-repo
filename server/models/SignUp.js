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
            allowNull: false,
            references: {
                model: 'events',
                key: 'id'
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    }, {
        tableName: 'signup'
    });

    SignUp.associate = models => {
        SignUp.belongsTo(models.Event, {
            foreignKey: 'eventId',  // Ensure consistency here
            as: 'event',
            onDelete: 'CASCADE'
        });
        SignUp.belongsTo(models.User, {
            foreignKey: 'userId',  // Ensure consistency here
            as: 'user',
            onDelete: 'CASCADE'
        });
    };

    return SignUp;
};