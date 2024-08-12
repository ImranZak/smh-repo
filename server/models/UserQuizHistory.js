module.exports = (sequelize, DataTypes) => {
    const UserQuizHistory = sequelize.define("UserQuizHistory", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'quizzes',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 0,
                max: 100
            }
        },
        dateTaken: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true
            }
        }
    }, {
        tableName: 'user_quiz_histories',
        timestamps: true,
    });

    UserQuizHistory.associate = models => {
        UserQuizHistory.belongsTo(models.Quiz, {
            foreignKey: 'quizId',
            as: 'quiz',
            onDelete: 'CASCADE'
        });
        UserQuizHistory.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
            onDelete: 'CASCADE'
        });
    };

    return UserQuizHistory;
};