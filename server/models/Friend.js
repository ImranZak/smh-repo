const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Friend = sequelize.define('Friend', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        friendId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
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
        tableName: 'friends',
        timestamps: true,
    });

    // Associations
    Friend.associate = (models) => {
        Friend.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });

        Friend.belongsTo(models.User, {
            foreignKey: 'friendId',
            as: 'friendUser',
        });
    };

    return Friend;
};
