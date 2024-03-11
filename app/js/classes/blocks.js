window.blockTextures = {};

window.blocks = [];
blockTextures.searchById = function (id) {
  return this[Object.keys(this)[Math.round(id / 2)]];
};
game.map = {
  cols: 9,
  rows: 9,
  tsize: 12,
  tiles: [
    [],
    [],
    [],
    [null, null, null, null, null, null, null, null, null, null, 11, 12],
    [null, null, null, null, null, null, null, null, null, 42, 43, 44, 45],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      null,
      null,
      null,
      563,
      564,
      565,
      566,
      567,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      106,
      107,
      108,
      109,
      110,
      111,
      112,
      null,
      null,
      null,
      595,
      596,
      597,
      598,
      599,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      137,
      138,
      139,
      140,
      141,
      142,
      143,
      144,
      null,
      null,
      null,
      627,
      628,
      null,
      630,
      631,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      169,
      170,
      171,
      172,
      173,
      174,
      175,
      null,
      null,
      null,
      null,
      659,
      660,
      661,
      662,
      663,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      201,
      202,
      203,
      204,
      205,
      206,
      207,
      null,
      null,
      null,
      null,
      691,
      692,
      693,
      694,
      695,
    ],
  ],
  getTile: function (col, row) {
    return this.tiles[row][col];
  },
};

/*blockTextures.block = document.createElement("img");
blockTextures.block.src = "./images/block.png";*/
let tile1 = "./images/tiles.png";
let tile2 = "./images/First Asset pack.png";
blockTextures.tileMap = document.createElement("img");
blockTextures.tileMap.src = tile2;

blocksColliders = [
  {
    id: [203,171],
    hitboxes: [{ width: game.grid / 2, height: game.grid, y: 0, x: -1 }],
  },
  {
    id: [204,172],
    hitboxes: [{ width: game.grid / 2, height: game.grid , y: 0, x: 24 }],
  },
  {
    id: [205,202,170,173],
    hitboxes: [{ width: game.grid, height: game.grid, y: 0, x: 0 }]
  },
  {
    id: [12],
    hitboxes: [{ width: game.grid/4, height: game.grid/10, y: 30, x: 0 }]
  },
  {
    id: [11],
    hitboxes: [{ width: game.grid/4, height: game.grid/10, y: 30, x: 33 }]
  },
  {
    id: [106,107,108,109],
    hitboxes: [{ width: game.grid, height: game.grid/10, y: 0, x: 0 }]
  }

];

class Block {
  constructor(x, y, id = 1, layer = 0) {
    this.x = x.roundTo(game.grid);
    this.y = y.roundTo(game.grid);
    this.width = game.grid;
    this.height = game.grid;

    this.isCollider = blocksColliders.some((item) => {
      if (typeof item.id == 'object') {
        return item.id.includes(id);
        
      } else {
        return item.id == id;
      }
    });
    this.blockCollider = blocksColliders.filter((item) => {
      if (typeof item.id == 'object') {
        return item.id.includes(id);
      } else {
        return item.id == id;
      }
    })[0];
    this.id = id;
    this.dir = 0;
    this.layer = layer;
    this.hitboxes = [];
    if (this.isCollider) {
      this.blockCollider.hitboxes.forEach((e) => {
        let hitbox = pug.defaultObject(0);
        hitbox.y = this.y + e.y;
        hitbox.x = this.x + e.x;
        hitbox.width = e.width;
        hitbox.height = e.height;
        this.hitboxes.push(hitbox);
      });
      // window.open('','_blank').document.write(JSON.stringify());
    }
  }
  draw() {
    c.imageSmoothingEnabled = false;
    //this.layer = (this.y < player.y ? 0 : 4);
    this.layer = [171, 172,138,139,140,141,106,107,108,109,110,111,74,75,76,77,78,79,42,43,44,45].includes(this.id) ? 4 : 0;
    c.save();
    c.translate(
      this.x - game.camera.x + this.width / 2,
      this.y - game.camera.y + this.height / 2
    );
    c.rotate((this.dir * Math.PI) / 180);

    c.drawImage(
      blockTextures.tileMap,
      ((this.id - 1) % 32) * game.map.tsize,
      (((this.id - 1) / 32) | 0) * game.map.tsize,
      game.map.tsize,
      game.map.tsize,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    c.restore();
    this.hitboxes.forEach((e) => {
      c.fillStyle = "rgba(0, 0, 255, 0.5)"; // Semi-transparent black
      c.fillRect(e.x - game.camera.x, e.y - game.camera.y, e.width, e.height);
    });

    c.imageSmoothingEnabled = true;
  }
}
class LevelEditorBlock {
  constructor() {
    this.width = game.grid;
    this.height = game.grid;
    this.x = 0;
    this.y = 0;
    this.id = 10;
    document.addEventListener("mousedown", (e) => {
      if (e.buttons == 1) {
        let tileY = this.y / game.grid;
        let tileX = this.x / game.grid;
        if (!game.map.tiles[tileY]) {
          game.map.tiles[tileY] = [];
        }
        game.map.tiles[tileY][tileX] = this.id;
        renderLevel();
        /*let blockOn = blocks.filter(item => item.x == this.x && item.y == this.y)[0];
        blocks.splice(blocks.indexOf(blockOn),1)
        blocks.push(new Block(this.x,this.y,this.id));*/
      }
      if (e.buttons == 2) {
        window
          .open("", "_blank")
          .document.write(JSON.stringify(game.map.tiles));
      }
    });
    canvas.addEventListener("wheel", (e) => {
      if (e.shiftKey) {
        this.id -= Math.sign(e.deltaY) * 32;
      } else {
        this.id -= Math.sign(e.deltaY);
      }
    });
  }
  draw() {
    c.imageSmoothingEnabled = false;
    this.y = (mouse.y - this.height / 2 + game.camera.y).roundTo(game.grid);
    this.x = (mouse.x - this.width / 2 + game.camera.x).roundTo(game.grid);
    c.drawImage(
      blockTextures.tileMap,
      ((this.id - 1) % 32) * game.map.tsize,
      (((this.id - 1) / 32) | 0) * game.map.tsize,
      game.map.tsize,
      game.map.tsize,
      this.x - game.camera.x,
      this.y - game.camera.y,
      this.width,
      this.height
    );
    c.imageSmoothingEnabled = true;
    //c.drawImage(blockTextures.tileMap,this.x-game.camera.x,this.y-game.camera.y);
  }
}
function renderLevel() {
  blocks = [];

  blocks.push(new Block(0, 0, 166, 4));
  /*for(let r =0;r<game.map.rows;r++) {
    for(let c = 0;c<game.map.cols;c++) {
      let tile = game.map.getTile(c,r);
      blocks.push(new Block(c*game.grid,r*game.grid,tile))
    }
  }*/
  game.map.tiles.forEach((e, r) => {
    e.forEach((ee, c) => {
      if (ee) {
        blocks.push(new Block(c * game.grid, r * game.grid, ee, 0));
      }
    });
  });
}
renderLevel();
