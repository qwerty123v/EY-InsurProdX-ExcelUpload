// models/User.js
const mongoose = require('mongoose');

// Create a dynamic schema
const dynamicSchema = new mongoose.Schema({}, { strict: false });

const criteriaMaster = mongoose.model('criteria_master', dynamicSchema);

module.exports = criteriaMaster;
