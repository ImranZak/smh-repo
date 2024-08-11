module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            birthDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
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
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            tableName: "users",
            timestamps: true,
        }
    );

    User.associate = models => {
        // Association with Friend model for the user who sent the friend request
        User.hasMany(models.Friend, {
            foreignKey: 'userId',
            as: 'sentFriendRequests',
            onDelete: 'CASCADE',
        });

        // Association with Friend model for the user who received the friend request
        User.hasMany(models.Friend, {
            foreignKey: 'friendId',
            as: 'receivedFriendRequests',
            onDelete: 'CASCADE',
        });

        // BelongsToMany association for getting all friends of a user
        User.belongsToMany(models.User, {
            through: models.Friend,
            as: 'friends',
            foreignKey: 'userId',
            otherKey: 'friendId'
        });

        User.belongsToMany(models.User, {
            through: models.Friend,
            as: 'friendOf',
            foreignKey: 'friendId',
            otherKey: 'userId'
        });
    };

    return User;
};
