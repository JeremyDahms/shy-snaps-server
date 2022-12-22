require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to Database'));

app.use(cors());
app.use(express.json());

const contactsRouter = require('./routes/contacts');
app.use('/contacts', contactsRouter);

const imagesRouter = require('./routes/images');
app.use('/images', imagesRouter);

const newsletterSignUpsRouter = require('./routes/newsletterSignUps');
app.use('/newsletterSignUps', newsletterSignUpsRouter);

app.listen(8080, () => console.log('Server Started'));

// function paginatedResults(model) {
//   return async (req, res, next) => {
//     const page = parseInt(req.query.page);
//     const limit = req.query.limit;

//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const results = {};

//     if (endIndex < (await model.countDocuments().exec())) {
//       results.next = { page: page + 1, limit };
//     }
//     if (startIndex > 0) {
//       results.previous = { page: page - 1, limit };
//     }

//     try {
//       results.results = await model.find().limit(limit).skip(startIndex).exec();
//       res.paginatedResults = results;
//       next();
//     } catch (e) {
//       res.status(500).json({ message: e.message });
//     }
//   };
// }
