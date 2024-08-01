const { Sequelize } = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

sequelize.authenticate()
  .then(() => console.log('Connection to the database has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Sync models without forcing or altering
sequelize.sync()
  .then(() => {
    console.log('Models have been synchronized without altering existing tables.');
  })
  .catch(err => console.error('Error synchronizing models:', err));

module.exports = sequelize;
