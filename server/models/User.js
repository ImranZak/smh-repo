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
            timestamps: true,  // Ensure timestamps are automatically managed
        }
    );

    // Define the association between User and UserQuizHistory
    User.associate = models => {
        User.hasMany(models.UserQuizHistory, {
            foreignKey: 'userId',
            as: 'quizHistories',
            onDelete: 'CASCADE'
        });
        User.hasMany(models.SignUp, {
            foreignKey: 'userId',
            as: 'signups',
            onDelete: 'CASCADE'
        });
    };

    return User;
};
