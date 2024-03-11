const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require('cors');
const path = require("path");

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const gamedirectory = path.join(__dirname, "app");
app.use(cors());
app.use(express.static(gamedirectory));

httpserver.listen(3000);
console.log('a');


io.on('connection', function(socket){
  socket.on("message", function(message){
    socket.emit("message", message);
    console.log(message);
  })
})
