window.game = {};
game.time = 1;
game.grid = 45;
game.camera = {};
game.camera.x = 0;
game.camera.y = 0;
Number.prototype.interp = function(y,a) {
  a *= game.time;
  return this * (1 - a) + y * a;
}
let canvas = document.createElement("canvas");
canvas.height = $(window).height().roundTo(game.grid);

canvas.width = ((canvas.height * 16) / 9).roundTo(game.grid);
game.width = canvas.width;
game.height = canvas.height;
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = true;
document.documentElement.appendChild(canvas);
window.key = pug.defaultObject();
window.mouse = pug.defaultObject(0);
window.keyBindings = {
  get walkX() {
    return (key.d || key.ArrowRight) - (key.a || key.ArrowLeft);
  },
  get walkY() {
    return (key.s || key.ArrowDown) - (key.w || key.ArrowUp)
  }
};
document.onmousemove = function (e) {
  mouse.x = e.x-parseFloat($(canvas).offset().left)+.5;
  mouse.y = e.y-parseFloat($(canvas).offset().top);
  mouse.down = e.buttons;
};
document.oncontextmenu = function(e) {
  e.preventDefault();
}
document.onmousedown = document.onmousemove;
document.onmouseup = document.onmousedown;
document.onkeydown = function (e) {
  window.key[e.key] = true;
};
document.onkeyup = function (e) {
  window.key[e.key] = false;
};
window.isTouching = function (obj1, obj2) {
  if(obj2 == undefined) {
    return;
  }
  let accuracy = 0.2;
  let width2 = obj2.width - accuracy;
  let height2 = obj2.height - accuracy;
  let width1 = obj1.width - accuracy;
  let height1 = obj1.height - accuracy;
  return (
    obj2.x + width2 > obj1.x &&
    obj2.x < obj1.x + width1 &&
    obj2.y + height2 > obj1.y &&
    obj1.y + height1 > obj2.y
  );
};
