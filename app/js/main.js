//pug.initConsole();//
// console.log(blockTextures.searchById(3));

let player = new Player(
  game.grid,
  game.grid,
  (canvas.width / 2).roundTo(game.grid) - game.grid + 256,
  (canvas.height / 2).roundTo(game.grid) - game.grid
);
player.uuid = crypto.randomUUID();
let otherplayers = {};
//let test = new LevelEditorBlock();
async function loop() {
  requestAnimationFrame(loop);
  c.fillStyle = "#111";
  c.fillRect(0, 0, canvas.width, canvas.height);

  blocks
    .filter((item) => item.layer < player.layer)
    .filter((item) => item.draw());

  player.tick();
  
  Object.keys(otherplayers).forEach(item => {
    let e= otherplayers[item];
    c.drawImage(player.costumes[0],e.x-game.camera.x,e.y-game.camera.y,e.width,e.height);
    c.fillStyle = "white";
    c.font = "12px Roboto";
  
    c.fillText(
      e.name
      /*blocks.filter(item => item.x == (mouse.x+game.camera.x-game.grid/2).roundTo(game.grid) && item.y == (mouse.y+game.camera.y-game.grid/2).roundTo(game.grid)).map(item => item.id)*/,
      e.x-game.camera.x+e.width/2-c.measureText(e.name).width/2,
      e.y-game.camera.y
    );
  })
  blocks
    .filter((item) => item.layer > player.layer)
    .filter((item) => item.draw());

  //test.draw();
 
  
  

  game.camera.x = player.x - game.width / 2 + 45 / 2;
  game.camera.y = player.y - game.height / 2 + 45 / 2;
}
loop();

socket.on('player',(message) => {
  let msguuid = Object.keys(message)[0];
 // alert(message);
  otherplayers[msguuid] = message[msguuid];
})
socket.on("message",(msg) => {
  $('#msgs').append('<br>'+msg);
  let msgs = $('#msgs')[0];
  msgs.scrollTop = msgs.scrollHeight;
})
socket.on('leave',(uuid) => {
  delete otherplayers[uuid];
})
window.onbeforeunload = function()  {
  socket.emit('leave',player.uuid);
  player = undefined;
}
$('#messageInput')[0].onkeydown = function(e)  {
  if(e.key == 'Enter') {
    socket.emit('message',$('#messageInput').val());
    $('#msgs').append('<br>'+$('#messageInput').val());
    let msgs = $('#msgs')[0];
    msgs.scrollTop = msgs.scrollHeight;
    $('#messageInput').val("");
    $('#messageInput').blur();
    
  }
}