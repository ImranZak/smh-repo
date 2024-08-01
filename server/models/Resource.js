module.exports = (sequelize, DataTypes) => {
    const Resource = sequelize.define("Resource", {
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tag: {
            type: DataTypes.ENUM('waste reduction', 'energy conservation', 'water management', 'green living tips'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive'), // Adjust the type to STRING
            allowNull: false,
            validate: {
                isIn: [['Active', 'Inactive']] // Enforce the allowed values at the database level
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Resource'
    });

    Resource.associate = models => {
        Resource.hasMany(models.ResourceContent, {
            foreignKey: 'resourceId',
            as: 'ResourceContent',
            onDelete: 'CASCADE',
            hooks: true
        });
    };

    return Resource;
};
