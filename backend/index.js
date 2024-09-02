const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React app URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Handle signaling data sent from clients
  socket.on('signal', (data) => {
    io.to(data.to).emit('signal', data);
  });

  // Listen for incoming messages
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server listening on http://localhost:5000');
});


// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // React app's URL
//     methods: ["GET", "POST"]
//   }
// });

// app.use(cors());

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Listen for incoming messages
//   socket.on('chatMessage', (msg) => {
//     io.emit('chatMessage', msg);
//   });

//   // Handle disconnect
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// server.listen(4000, () => {
//   console.log('Server is running on port 4000');
// });
