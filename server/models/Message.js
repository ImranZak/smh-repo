// Message.js (Updated)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Message = sequelize.define('Message', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        senderId: { // The sender's user ID
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recipientId: { // The recipient's user ID
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: { // The actual message content
            type: DataTypes.STRING,
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
    }, {
        tableName: 'messages',
        timestamps: true,
    });

    return Message;
};
