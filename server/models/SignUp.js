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
<<<<<<< HEAD
=======
        eventId: {
            type: DataTypes.INTEGER,
<<<<<<< Updated upstream
            references: {
                model: 'events',
                key: 'id'
            },
            allowNull: false
        }
=======
            allowNull: false,
            references: {
                model: 'events',
                key: 'id',
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
>>>>>>> Stashed changes
>>>>>>> events
    }, {
        tableName: 'signup'
    });

    SignUp.associate = models => {
        SignUp.belongsTo(models.Event, {
            foreignKey: 'eventid',
            as: 'event',
            onDelete: 'CASCADE'
        });
        SignUp.belongsTo(models.User, {
            foreignKey: 'userid',
            as: 'user',
            onDelete: 'CASCADE'
        });
    };
    return SignUp;
}