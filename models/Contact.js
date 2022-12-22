const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  state: String,
  message: String,
});

module.exports = mongoose.model('ContactSchema', ContactSchema);
