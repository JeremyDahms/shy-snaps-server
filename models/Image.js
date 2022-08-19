const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model('images', ImageSchema);
