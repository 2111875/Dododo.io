const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require('cors');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const gamedirectory = path.join(__dirname, "app");
app.use(cors());
app.use(express.static(gamedirectory));

httpserver.listen(3000);
console.log('a');


io.on('connection', function(socket){
  socket.emit('UUID',uuidv4());
  socket.on("message", function(message){
    socket.broadcast.emit("message", message);
    console.log(message);
  })
})
