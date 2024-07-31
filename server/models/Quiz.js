module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define("Quiz", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive'), // Adjust the type to STRING
            allowNull: false,
            validate: {
                isIn: [['Active', 'Inactive']] // Enforce the allowed values at the database level
            }
        },
        tag: {
            type: DataTypes.ENUM('waste reduction', 'energy conservation', 'water management', 'green living tips'), // Adjust the type to STRING
            allowNull: false,
            validate: {
                isIn: [['waste reduction', 'energy conservation', 'water management', 'green living tips']] // Enforce the allowed values at the database level
            }
        }
    }, {
        tableName: 'quizzes'
    });

    Quiz.associate = models => {
        Quiz.hasMany(models.Question, {
            foreignKey: 'quizId',
            as: 'questions',
            onDelete: 'CASCADE', // This ensures cascading delete
            hooks: true // This ensures Sequelize handles the delete cascade properly
        });
    };

    return Quiz;
};
