const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// GET
router.get('/', async (req, res) => {
  try {
    const signUps = await Contact.find({});
    res.send(signUps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const email = req.body;
    await Contact.create(email);
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
