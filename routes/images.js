const express = require('express');
const multer = require('multer');
//const sharp = require('sharp');
const crypto = require('crypto');
const Image = require('../models/Image');
const {
  uploadFile,
  getFileStream,
  getImageUrl,
  getImage,
} = require('../awsS3');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 52428800,
  },
});

const generateRandomKey = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

// GET
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().lean();
    res.send(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const original = await getImage(key);
    // const resized = await sharp(original)
    //   .jpeg({ quality: 60, force: false })
    //   .toBuffer();
    res.set('Content-Type', 'image/png');
    res.send(original);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:key/signedUrl', async (req, res) => {
  try {
    const image = await Image.findOne({ key: req.params.key }).lean();
    const url = await getImageUrl(image.key);
    res.send({ ...image, signedUrl: url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { body, file } = req;
    file.key = generateRandomKey();
    const result = await uploadFile(file);
    await Image.create({
      key: file.key,
      title: body.title,
      description: body.description,
      tags: body.tags,
    });
    res.send(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
