// models/User.js
const mongoose = require('mongoose');

// Create a dynamic schema
const dynamicSchema = new mongoose.Schema({}, { strict: false });

const summeryTable = mongoose.model('summery_table', dynamicSchema);

module.exports = summeryTable;
