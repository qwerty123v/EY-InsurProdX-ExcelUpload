const express = require('express');
require("./db/connection");
const app = express();
const dotenv = require('dotenv'); // For managing environment variables
dotenv.config(); // Load environment variables from .env file
const PORT = parseInt(process.env.PORT) || 8080;
const route=require('./routes/uploadRoutes');
const cors= require('cors');

const corsOptions = {
  origin: 'https://bd3b2096-4a05-4bd3-816e-8bdada54b7d6.e1-us-east-azure.choreoapps.dev',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
};

app.use(cors(corsOptions));
// app.use(cors())

app.use('/excelupload',route);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});