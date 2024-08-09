const { Model, DataTypes } = require('sequelize');

class Usage extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }
        }, {
            sequelize,
            tableName: 'usage',
        });
    }

    static associate(models) {
        // Define associations here if necessary
    }
}

module.exports = Usage;
