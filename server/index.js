const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT || '3001';

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);

  // Drawing logic goes here
  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("clear", () => {
    io.emit("clear");
  })

  socket.on('disconnected', () => {
    cosole.log(`user disconnected ${socket.id}`)
  });

});

server.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT 3001");
});
