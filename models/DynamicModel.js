// models/DynamicModel.js
const mongoose = require("mongoose");

const createDynamicModel = (collectionName) => {
  const dynamicSchema = new mongoose.Schema({}, { strict: false });
  return mongoose.models[collectionName] || mongoose.model(collectionName, dynamicSchema, collectionName);
};

module.exports = createDynamicModel;
