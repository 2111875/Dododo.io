const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require('cors');
const path = require("path");
const { SocketAddress } = require("net");
const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver, {
  cors: {
    origin: "https://example.com",
    methods: ["GET", "POST"]
  }
});

const gamedirectory = path.join(__dirname, "app");
app.use(cors());
app.use(express.static(gamedirectory));

httpserver.listen(3000);


io.on('connection', function(socket){
  console.log('A user joined with id: '+socket.id);
  socket.on("joinRoom",(room) => {
    socket.join(room);
    console.log('A user with id: '+socket.id+' joined room: '+room);
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
    socket.leave(room);
  })
})
