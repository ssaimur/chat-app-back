// external imports
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// internal imports
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const inboxRouter = require('./routers/inboxRouter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const server = require('http').createServer(app);

// socket connetion
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});
app.use(
  require('cors')({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

io.on('connection', (socket) => {
  console.log('connection ,,,');
});

global.io = io;

// request persers
app.use(express.json());
app.use(morgan('common'));
app.use((req, res, next) => {
  console.log({ rewwBody: req.body });
});

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

const mongoose = require('mongoose');
const checkAuth = require('./middlewares/checkAuth');

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

// set all the routers
app.use('/api/auth', authRouter);
// app.use(checkAuth);
app.use('/api/users', userRouter);
app.use('/api/inbox', inboxRouter);

// custom error handler middleware
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
