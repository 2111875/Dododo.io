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


io.on('connection', function(socket){
  socket.on("joinRoom",(room) => {
    socket.join(room);
  })
  socket.on("player", function(message,room){
    socket.to(room).emit("player", message);
   // console.log(message);
  })
  socket.on("message",function(msg,room) {
   socket.to(room).emit("message",msg);
  })
  socket.on('leave',function(uuid,room)  {
    socket.to(room).emit('leave',uuid);
  })
})
