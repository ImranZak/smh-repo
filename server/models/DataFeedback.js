const { Model, DataTypes } = require('sequelize');

class DataFeedback extends Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            ranking: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            best: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            improvement: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'datafeedback',
        });
    }

    static associate(models) {
        // Define associations here if necessary
    }
}

module.exports = DataFeedback;
