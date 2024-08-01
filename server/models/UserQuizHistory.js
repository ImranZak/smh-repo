module.exports = (sequelize, DataTypes) => {
    const UserQuizHistory = sequelize.define("UserQuizHistory", {
        quizid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'quizzes',
                key: 'id'
            },
            onDelete: 'CASCADE' // Ensure cascading delete
        },
        userid: {
            type: DataTypes.INTEGER, // Placeholder for user id
            allowNull: false,
            // Assuming you have a User model, you can add references here:
            // references: {
            //     model: 'users',
            //     key: 'id'
            // },
            // onDelete: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true, // Ensure the title is not empty
                len: [1, 100] // Ensure the title length is between 1 and 100 characters
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true // Ensure the description is not empty
            }
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true, // Ensure the score is an integer
                min: 0, // Ensure the score is not negative
                max: 100 // Assuming score is a percentage, ensure it does not exceed 100
            }
        }
    }, {
        tableName: 'UserQuizHistory',
        timestamps: true, // Add timestamps (createdAt and updatedAt)
        underscored: true // Use underscored column names
    });

    UserQuizHistory.associate = models => {
        UserQuizHistory.belongsTo(models.Quiz, {
            foreignKey: 'quizid',
            as: 'quiz',
            onDelete: 'CASCADE'
        });
        // Assuming you have a User model, you can add the association here:
        // UserQuizHistory.belongsTo(models.User, {
        //     foreignKey: 'userid',
        //     as: 'user',
        //     onDelete: 'CASCADE'
        // });
    };

    return UserQuizHistory;
};
