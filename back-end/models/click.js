const mongoose = require('mongoose');

const clickSchema = mongoose.Schema({
  timestamp: { type: Number, required: true },
  sessionid: { type: String, required: true },
});

module.exports = mongoose.model('Click', clickSchema);