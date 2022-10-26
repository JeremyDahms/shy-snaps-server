const express = require('express');
const NewsletterSignUp = require('../models/NewsletterSignUp');

const router = express.Router();

// GET
router.get('/', async (req, res) => {
  try {
    const signUps = await NewsletterSignUp.find({});
    res.send(signUps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const email = req.body;
    if (!(await NewsletterSignUp.exists(email))) {
      await NewsletterSignUp.create(email);
    }
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
