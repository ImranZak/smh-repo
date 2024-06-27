const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usageRoutes = require('./routes/usageRoutes'); // Adjust the path as necessary

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', usageRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
