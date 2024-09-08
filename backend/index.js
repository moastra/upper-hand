const express = require('express');
// const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 3001;

const app = express();
// const server = http.createServer(app);

// Use CORS to allow frontend connection
app.use(cors({
  origin: "http://localhost:3000", // React app URL
  methods: ["GET", "POST"],
}));

const http = app.listen(3001, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

// const io = new Server(http);

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000", // React app URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (client) => {
  console.log('a user connected:', client.id);

  // Handle signaling data sent from clients
  client.on('signal', (data) => {
    io.to(data.to).emit('signal', data);
  });

  // Listen for incoming messages
  client.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
  });

  client.on('disconnect', () => {
    console.log('user disconnected:', client.id);
  });
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
