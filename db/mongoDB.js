const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"; // Fallback to localhost if env variable is not set
console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // connectTimeoutMS: 10000,
  // socketTimeoutMS: 45000,
  // serverSelectionTimeoutMS: 30000
});

module.exports = client;
