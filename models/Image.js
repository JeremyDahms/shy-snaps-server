const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: String,
  name: String,
  key: String,
});

module.exports = mongoose.model('images', ImageSchema);
