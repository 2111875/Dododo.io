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
  socket.join("ROOM")
  socket.on("player", function(message){
    socket.to("ROOM").emit("player", message);
   // console.log(message);
  })
  socket.on("message",function(msg) {
   socket.to("ROOM").emit("message",msg);
  })
  socket.on('leave',function(uuid)  {
    socket.to("ROOM").emit('leave',uuid);
  })
})
