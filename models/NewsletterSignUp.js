const mongoose = require('mongoose');

const NewsletterSignUpSchema = new mongoose.Schema({
  email: String,
});

module.exports = mongoose.model('NewsletterSignUp', NewsletterSignUpSchema);
