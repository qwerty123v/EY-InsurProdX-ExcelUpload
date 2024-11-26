// models/User.js
const mongoose = require('mongoose');

// Create a dynamic schema
const dynamicSchema = new mongoose.Schema({}, { strict: false });

const uploadExcelModel = mongoose.model('rate_transform', dynamicSchema);

module.exports = uploadExcelModel;
