require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const contactsRouter = require('./routes/contacts');
const imagesRouter = require('./routes/images');
const newsletterSignUpsRouter = require('./routes/newsletterSignUps');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to Database'));

const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(helmet());

// Required for EBS (Elastic Beanstalk)
app.get('/', (req, res) => {
  res.send('OK');
});
app.get('/health', (req, res) => {
  res.send('OK');
});

app.use('/contacts', contactsRouter);
app.use('/images', imagesRouter);
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
