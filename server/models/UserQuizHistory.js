module.exports = (sequelize, DataTypes) => {
    const UserQuizHistory = sequelize.define("UserQuizHistory", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Since quizid already exists in the database, we define it without trying to re-add the foreign key constraints
        quizid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        // Associations are kept without attempting to add the foreign key constraint
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
