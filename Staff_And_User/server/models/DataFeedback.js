module.exports = (sequelize, DataTypes) => {
    const DataFeedback = sequelize.define(
        "DataFeedback", { 
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
        }, 
        { tableName: 'datafeedback'}); 
        
        return DataFeedback; 
    }