//  pug.initConsole();
// console.log(blockTextures.searchById(3));
const socket = io();
let player = new Player(
  game.grid,
  game.grid,
  (canvas.width / 2).roundTo(game.grid) - game.grid + 256,
  (canvas.height / 2).roundTo(game.grid) - game.grid
);
let test = new LevelEditorBlock();
socket.on('message',(msg) => {
  alert(msg);
})
async function loop() {
  requestAnimationFrame(loop);
  c.fillStyle = "#111";
  c.fillRect(0, 0, canvas.width, canvas.height);

  blocks
    .filter((item) => item.layer < player.layer)
    .filter((item) => item.draw());

  player.tick();
  blocks
    .filter((item) => item.layer > player.layer)
    .filter((item) => item.draw());

  test.draw();
  c.fillStyle = "white";
  c.font = "48px Roboto";

  c.fillText(
    /*blocks.filter(item => item.x == (mouse.x+game.camera.x-game.grid/2).roundTo(game.grid) && item.y == (mouse.y+game.camera.y-game.grid/2).roundTo(game.grid)).map(item => item.id)*/test.id,
    mouse.x,
    mouse.y
  );
  game.camera.x = player.x - game.width / 2 + 45 / 2;
  game.camera.y = player.y - game.height / 2 + 45 / 2;
}
loop();
