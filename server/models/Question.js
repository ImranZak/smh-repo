module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'quizzes',
                key: 'id'
            },
            onDelete: 'CASCADE' // Ensure cascading delete at the database level
        },
        question_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        question_type: {
            type: DataTypes.ENUM('multiple_choice', 'Open_Ended'),
            allowNull: false
        },
        answer_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        tableName: 'questions'
    });

    Question.associate = models => {
        Question.belongsTo(models.Quiz, {
            foreignKey: 'quizId',
            as: 'quiz',
            onDelete: 'CASCADE' // Ensure cascading delete
        });
    };

    return Question;
};
