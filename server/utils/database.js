const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('smh', 'smh_user', 'password', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
