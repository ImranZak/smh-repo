module.exports = (sequelize, DataTypes) => {
    const ResourceContent = sequelize.define("ResourceContent", {
        resourceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Resource', // Assuming there's a 'Resource' model
                key: 'id'
            }
        },
        type: {
            type: DataTypes.ENUM('text', 'image', 'videoLink', 'video', 'file'),
            allowNull: false
        },
        data: {
            type: DataTypes.TEXT,
        },
    }, {
        tableName: 'ResourceContent'
    });

    ResourceContent.associate = models => {
        ResourceContent.belongsTo(models.Resource, {
            foreignKey: 'resourceId',
            as: 'Resource',
            onDelete: 'CASCADE'
        });
    };

    return ResourceContent;
};