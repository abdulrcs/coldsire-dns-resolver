const mongoose = require('mongoose');

const DomainSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  is_valid: Boolean,
  spf: String,
  dkim: String,
  dmarc: String,
  error: String,
  last_checked: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Domain', DomainSchema);
