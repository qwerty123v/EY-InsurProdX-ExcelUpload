const mongoose = require('mongoose');
const dotenv = require('dotenv'); // For managing environment variables
dotenv.config(); // Load environment variables from .env file
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });