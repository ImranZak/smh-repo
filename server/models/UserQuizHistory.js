module.exports = (sequelize, DataTypes) => {
    const UserQuizHistory = sequelize.define("UserQuizHistory", {
        quizid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'quizzes',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
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
        tableName: 'UserQuizHistory',
        timestamps: true,
    });

    UserQuizHistory.associate = models => {
        UserQuizHistory.belongsTo(models.Quiz, {
            foreignKey: 'quizid',
            as: 'quiz',
            onDelete: 'CASCADE'
        });
        UserQuizHistory.belongsTo(models.User, {
            foreignKey: 'userid',
            as: 'user',
            onDelete: 'CASCADE'
        });
    };

    return UserQuizHistory;
};
