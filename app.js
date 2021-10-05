// external imports
const express = require('express');
const { GridFsStorage } = require('multer-gridfs-storage');
const methodOverride = require('method-override');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// internal imports
const authRouter = require('./routers/authRouter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// request persers
app.use(express.json());
app.use(morgan('common'));
app.use(methodOverride('_method'));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

const mongoose = require('mongoose');

const url = process.env.MONGO_URI;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connect to the database
connect.then(
  () => {
    console.log('Connected to Database...');
  },
  (err) => console.log(err)
);

/* 
    GridFs Configuration
*/

// create storage engine
const storage = new GridFsStorage({
  db: connect,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

app.use('/api/auth', authRouter);

// custom error handler middleware
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
