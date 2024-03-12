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

let rooms = {};
io.on('connection', function(socket){

  console.log('A user joined with id: '+socket.id);
  socket.on("joinRoom",(room) => {
    socket.join(room);
    console.log('A user with id: '+socket.id+' joined room: '+room);
    rooms[room] ? rooms[room]++ : rooms[room] = 1;
    console.log('Amount of players in room \"'+room+'\": '+rooms[room]);
    io.to(room).emit('message','Teddy LOVES FEET');
    if(rooms[room] == 1) {
      socket.emit('meHost',room);
    }
  })

  socket.on('gameStart',(room) => {
    io.to(room).emit('gameStart',room);
  }) 
  socket.on("player", function(message,room){
    socket.to(room).emit("player", message);
   // console.log(message);
  })
  socket.on("message",function(msg,room) {
   io.to(room).emit("message",msg);
  })
  socket.on('leave',function(uuid,room)  {
    socket.to(room).emit('leave',uuid);
    socket.leave(room);
  })
})
