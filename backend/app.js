const express = require('express');
const sequelize = require('./utils/database');
const usageRoutes = require('./routes/usageRoutes');

const app = express();

app.use(express.json());
app.use('/api/usage', usageRoutes);

sequelize.sync()
    .then(result => {
        app.listen(3000, () => console.log('Server is running on port 3000'));
    })
    .catch(err => console.log(err));
