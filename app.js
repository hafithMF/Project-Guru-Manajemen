const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const AuthRoute = require('./Routes/AuthRoutes');
const CrudRoute = require('./Routes/CrudRoutes');
app.use("/api/guru", AuthRoute);
app.use("/api", CrudRoute);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
