const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Usage = sequelize.define('Usage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['energy', 'water']],
        },
    },
    usage: {
        type: DataTypes.FLOAT,
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
    },
});

module.exports = Usage;
