class Player {
  constructor(h, w, x, y) {
    this.hitbox = pug.defaultObject(0);

    this.hitbox.width = w;
    this.hitbox.height = h * 0.3;
    this._height = h;
    this._width = w;

    this._x = x;
    this._y = y;

    this.hitbox.x = x;
    this.hitbox.y = y + this._height * 0.5;
    this.layer = 3;
    //this.x = x;
    // this.y = y;
    this.vy = 0;
    this.vx = 0;
    this.friction = 0.8;
    this.tickNum = 0;
    this.acceleration = 1.5;
    this.dir = 0;
    this.name = Math.round(Math.random()*100);
    // messing around

    //keybinds
    document.addEventListener("keydown", async (e) => {
     
     });
    //costumes
    this.costumes = [];
    this.costumes.push(new Image());
    this.costumes[this.costumes.length - 1].src = `./images/icon.png`;
    this.costumeNumber = 0;
  }
  // Widths and Heights gets and sets
  get width() {
    return this._width;
  }
  set width(w) {
    this._width = w;
    this.hitbox.width = w;
  }
  set height(h) {
    this._height = h;
    this.hitbox.height = h * 0.3;
  }
  get height() {
    return this._height;
  }
  // Position gets and sets
  get x() {
    return this._x;
  }
  set x(x) {
    this._x = x;
    this.hitbox.x = x;

    if (this.isTouching(blocks)) {
      while (this.isTouching(blocks)) {
        this.x -= Math.sign(this.vx) * 0.25 * game.time;
      }
      this.vx = 0;
    }
  }
  set y(y) {
    this._y = y;
    this.hitbox.y = y + this.height * 0.4;
    if (this.isTouching(blocks)) {
      while (this.isTouching(blocks)) {
        this.y -= Math.sign(this.vy) * 0.25 * game.time;
      }
      this.vy = 0;
    }
  }
  get y() {
    return this._y;
  }
  draw() {
   
   

    // Saves the canvas's rotation and tranlation but not the content

    c.save();

    // Moves the canvas so the top left would be where the player is.

    c.translate(
      this.x - game.camera.x + this.width / 2,
      this.y - game.camera.y + this.height / 2
    );

    // Rotates the canvas around the top left of it

    c.rotate((this.dir * Math.PI) / 180);

    // Renders the player at the top left of the canvas

    c.drawImage(
      this.costumes[this.costumeNumber],
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    //Moves the canvas back to where it was without having to translate it back or rotate it back

    c.restore();

    // Renders the hitbox(remove later)

    c.fillStyle = "rgba(255,0,0,.5)";
    c.fillRect(
      this.hitbox.x - game.camera.x,
      this.hitbox.y - game.camera.y,
      this.hitbox.width,
      this.hitbox.height
    );
  }
  isTouching(obj) {
    //Iterate over every object/block provided.
    for (let i = 0; i < obj.length; i++) {
      for (let t = 0; t < obj[i].hitboxes.length; t++) {

        if (isTouching(this.hitbox, obj[i].hitboxes[t]) && obj[i].isCollider) {
          // Returns the value that it is touching it, if it is not, it will continue through the loop in case another obj is touching it.
          return true;
        }
      }

      //Check if it is actually touching the obj and if the obj should have collision
      /* if (isTouching(this.hitbox, obj[i].hitbox) && obj[i].isCollider) {
         // Returns the value that it is touching it, if it is not, it will continue through the loop in case another obj is touching it.
         return true;
       }*/
    }
  }
  tick() {
    //Testin
    socket.emit('player',{[uuid]:{x:this.x,y:this.y,width:this.width,height:this.height,name:this.name}},room);


    


    //Increments the tick Number by timespeed
    this.tickNum += game.time;

    // If the game time is one then reset it to be a integer

    game.time < 1 ? null : (this.tickNum = Math.round(this.tickNum));
    this.draw();

    // Set velocity

    this.vy += keyBindings.walkY * this.acceleration;
    this.vy *= this.friction;

    this.vx += keyBindings.walkX * this.acceleration /** game.time*/;
    this.vx *= this.friction;

    //Move the player

    this.y += this.vy * game.time;

    this.x += this.vx * game.time;



    // point towards cursor from center of screen
    /*this.dir = math.atan2(
      mouse.y+this.height/2-game.camera.y+this.y-game.height ,
      mouse.x+this.width/2-game.camera.x-game.width+this.x
    ) + 90;*/
  }
}
