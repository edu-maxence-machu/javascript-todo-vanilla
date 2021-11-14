const mongoose = require('mongoose');

const demoSchema = mongoose.Schema({
  customId: { type: String, required: true },
});

module.exports = mongoose.model('Demo', demoSchema);
