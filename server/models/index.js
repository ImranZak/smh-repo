const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Friend = require('./Friend')(sequelize, DataTypes);
db.Message = require('./Message')(sequelize, DataTypes);
db.Notification = require('./Notification')(sequelize, DataTypes);
db.Usage = require('./Usage')(sequelize, DataTypes);

module.exports = db;
