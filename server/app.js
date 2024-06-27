const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usageRoutes = require('./routes/usageRoutes');
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3001' }));  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/usage', usageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
