const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const Image = require('../models/Image');
const { uploadFile, getFileStream, getImageUrl } = require('../awsS3');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const generateRandomKey = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

// GET
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().lean();
    const signedImages = await Promise.all(
      images.map(async (image) => {
        const url = await getImageUrl(image.name);
        return { ...image, signedUrl: url };
      })
    );
    res.send(signedImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const image = await Image.findOne({ name: req.params.key }).lean();
    const url = await getImageUrl(image.name);
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
      name: file.key,
      description: body.description,
    });
    res.send(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
