const mongoose = require('mongoose');
const dotenv = require('dotenv'); // For managing environment variables
dotenv.config(); // Load environment variables from .env file
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });