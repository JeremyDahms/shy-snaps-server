const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  key: String,
  title: String,
  description: String,
  tags: [String]
});

module.exports = mongoose.model('images', ImageSchema);
