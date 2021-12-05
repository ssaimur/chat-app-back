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

const { Server } = require('socket.io');

const io = new Server(server, {
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

// io.on('connection', (socket) => {
//   console.log('connection ,,,');
// });

// global.io = io;

// testing ... delete later

io.on('connection', (socket) => {
  //for a new user joining the room
  console.log('userco');
  socket.on('joinRoom', ({ username, roomname }) => {
    //* create user
    const p_user = join_User(socket.id, username, roomname);
    console.log(socket.id, '=id');
    socket.join(p_user.room);

    //display a welcome message to the user who have joined a room
    socket.emit('message', {
      userId: p_user.id,
      username: p_user.username,
      text: `Welcome ${p_user.username}`,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(p_user.room).emit('message', {
      userId: p_user.id,
      username: p_user.username,
      text: `${p_user.username} has joined the chat`,
    });
  });

  //user sending message
  socket.on('chat', (text) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);

    io.to(p_user.room).emit('message', {
      userId: p_user.id,
      username: p_user.username,
      text: text,
    });
  });
});
// request persers
app.use(express.json());
app.use(morgan('common'));

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
app.use(checkAuth);
app.use('/api/users', userRouter);
app.use('/api/inbox', inboxRouter);

// custom error handler middleware
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
