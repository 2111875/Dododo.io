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
  socket.on('ping',() => {
    socket.emit('ping');
  })
  socket.on("joinRoom",(room,username,callback) => {


    if(!rooms[room] ?? true) rooms[room] = {players:0,started:false};
     if(rooms[room].started) {
      callback('Started');
      return};
    socket.join(room);
    //console.log('A user with id: '+socket.id+' joined room: '+room);
    rooms[room].players++
   // console.log('Amount of players in room \"'+room+'\": '+rooms[room].players);
    io.to(room).emit('message',`${username} Joined The Game`);
    console.log(rooms);
    if(rooms[room].players == 1) {
      callback('Host');
    } else {
      callback('Player')
    }
  })

  socket.on('gameStart',() => {
    let room = Array.from(socket.rooms)[1];
    rooms[room].started = true;
    console.log(rooms);
    console.log(rooms[room].started);
    //rooms[room].started = true;
    io.to(room).emit('gameStart',room);
  }) 
  socket.on("player", function(message){
    let room = Array.from(socket.rooms)[1];

    socket.to(room).emit("player", message);
   // console.log(message);
  })
  socket.on("message",function(msg) {
    let room = Array.from(socket.rooms)[1];
   io.to(room).emit("message",msg);
  })
  socket.on('leave',function(uuid)  {
    console.log('A user left with id: '+socket.id)
    let room = Array.from(socket.rooms)[1];
    socket.to(room).emit('leave',uuid);
    socket.leave(room);
    if(!rooms[room] ?? true) return;
    rooms[room].players--;
    if(rooms[room].players < 1) {
      rooms[room].started = false;
      rooms[room].players = 0;
    }
  })
  
})
