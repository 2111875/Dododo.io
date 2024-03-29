//pug.initConsole();//
// console.log(blockTextures.searchById(3));

let player = new Player(
  game.grid,
  game.grid,
  (canvas.width / 2).roundTo(game.grid) - game.grid + 256,
  (canvas.height / 2).roundTo(game.grid) - game.grid
);
player.name = window.username;
let otherplayers = {};
//let test = new LevelEditorBlock();
async function loop() {
  requestAnimationFrame(loop);
  c.fillStyle = "#111";
  c.fillRect(0, 0, canvas.width, canvas.height);

  blocks
    .filter((item) => item.layer < player.layer)
    .filter((item) => item.draw());
    Object.keys(otherplayers).forEach(item => {
      let e = otherplayers[item];
      c.drawImage(player.costumes[0], e.x - game.camera.x, e.y - game.camera.y, e.width, e.height);
      c.fillStyle = "white";
      c.font = "12px Roboto";
  
      c.fillText(
        e.name
        /*blocks.filter(item => item.x == (mouse.x+game.camera.x-game.grid/2).roundTo(game.grid) && item.y == (mouse.y+game.camera.y-game.grid/2).roundTo(game.grid)).map(item => item.id)*/,
        e.x - game.camera.x + e.width / 2 - c.measureText(e.name).width / 2,
        e.y - game.camera.y
      );
    })
  player.tick();

  
  blocks
    .filter((item) => item.layer > player.layer)
    .filter((item) => item.draw());



  game.camera.x = player.x - game.width / 2 + 45 / 2;
  game.camera.y = player.y - game.height / 2 + 45 / 2;
}
loop();

socket.on('player', (message) => {
  let msguuid = Object.keys(message)[0];
  if (!otherplayers[msguuid]) otherplayers[msguuid] = message[msguuid];
  else {
    otherplayers[msguuid].x = otherplayers[msguuid].x.interp(message[msguuid].x, .1);
    otherplayers[msguuid].y = otherplayers[msguuid].y.interp(message[msguuid].y, .1);
    otherplayers[msguuid].width = message[msguuid].width;
    otherplayers[msguuid].height = message[msguuid].height;
    otherplayers[msguuid].name = message[msguuid].name;
  }

})
socket.on("message", (msg) => {
  let element = document.createElement('p');
  $(element).text(msg);
  $('#msgs').append(element);
  let msgs = $('#msgs')[0];
  msgs.scrollTop = msgs.scrollHeight;
})
socket.on('leave', (uuid) => {
  $('#msgs').append('<br>' + otherplayers[uuid].name+" Left For The Milk Like Your Dad");
  let msgs = $('#msgs')[0];
  msgs.scrollTop = msgs.scrollHeight;
  delete otherplayers[uuid];  
})
window.onbeforeunload = function () {
  socket.emit('leave', uuid);
  player = undefined;
}
$('#messageInput')[0].onkeydown = function (e) {
  if (e.key == 'Enter') {
    socket.emit('message',player.name+':'+ $('#messageInput').val());
    /*$('#msgs').append('<br>' + $('#messageInput').val());
    let msgs = $('#msgs')[0];
    msgs.scrollTop = msgs.scrollHeight;*/
    $('#messageInput').val("");
    $('#messageInput').blur();
    canvas.focus();
  }
}
$('#msgs').on('click',(e) => {
  canvas.focus();
})