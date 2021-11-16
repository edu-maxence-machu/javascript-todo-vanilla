const mongoose = require('mongoose');

const clickSchema = mongoose.Schema({
  timestamp: { type: Date, required: true },
  sessionid: { type: String, required: true },
  userid: { type: String, required: true },
});

module.exports = mongoose.model('Click', clickSchema);