const express = require('express');
const router = express.Router();
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Image = require('../models/Image');

const { uploadFile, getFileStream, getAllPhotos } = require('../awsS3');

router.get('/', async (req, res) => {
  try {
    const result = await getAllPhotos();
    res.send(result.Contents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:key', async (req, res) => {
  console.log(req.params.key);
  try {
    const readStream = await getFileStream(req.params.key);
    readStream.Body.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const result = await uploadFile(file);
    await Image.create({
      url: `https://shysnapsphotos.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${file.filename}`,
      name: file.originalname,
      key: file.filename,
    });
    await unlinkFile(file.path);
    res.send(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
