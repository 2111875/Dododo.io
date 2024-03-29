window.game = {};
window.socket = io();
game.time = 1;
game.grid = 45;
game.camera = {};
game.camera.x = 0;
game.camera.y = 0;
window.key = pug.defaultObject();
window.mouse = pug.defaultObject(0);
window.uuid = crypto.randomUUID();

window.room = false;

let pingTime = new Date();
let ping = 0;
async function getPingLoop() {
  pingTime = new Date();
  socket.emit('ping');
  await sleep(1000);
  getPingLoop();

}
getPingLoop();
socket.on('ping',() => {
  ping = (new Date()) - (pingTime);
  $('#pingCounter').text(ping+'ms')
})

window.search = function () {
  //return '1';
  return location.search.replace('?', '');
}
function waiting(rooom,user) {
  window.username = user;
  window.room = rooom;
  socket.emit('joinRoom', room,username, function(outcome) {
    if(outcome == 'Host') {
    $('#waitingMenu').append(`<button id='hostButton'>Start Match</button>`);
    $('#hostButton').on('click', (item) => {
      socket.emit('gameStart', room);
      $('#hostButton').slideUp('normal',() => {$('#hostButton')[0].remove()});
    })
  } else if(outcome == 'Started') {
    alert('Game already started!');
    location.reload();
  }
  });
  $('#startMenu')[0].remove();
  document.body.appendChild($(`<div id='waitingMenu' class='menu'>Send this link to your friends!<a onclick='navigator.clipboard.writeText(location+"?"+room);'>${location+'?'+room}</a></div>`)[0]);
  $('#waitingMenu').append(`<button id='waitingJoinBtn'>Join</button>`);
  $('#waitingJoinBtn').hide();

  $('#usernameInput').css('width', 400 - $('#waitingJoinBtn').width() - 28);  
  
  $('#waitingMenu').append(`<div id='waitingChatBox'></div><input id='waitingInputBox' placeholder='Message'>`);
  $('#waitingJoinBtn').on('click', function (e) {
    if (window.username) {
      start();
    } else {
      alert('please input valid username');
    }
  })
  $('#waitingInputBox').on('keydown', function (e) {
    if (e.key == 'Enter') {
      socket.emit('message', username + ':' + $('#waitingInputBox').val());
      $('#waitingInputBox').val("");
    }
  })
  socket.on('message', (message) => {
    $('#waitingChatBox').append(message + '<br>');
    $('#waitingChatBox')[0].scrollTop = $('#waitingChatBox')[0].scrollHeight;
  })
  socket.on('gameStart', (e) => {
    $('#waitingJoinBtn').slideDown();
  })
  document.body.appendChild($(`<button id='leaveButton' onclick=" confirm('Are you sure you want to leave?') ? location.search = '' : null;">Leave</button>`)[0]);
}
function start() {
  $('#leaveButton').remove();
  socket.off('gameStart');
  socket.off('meHost');
  socket.off('message');
  socket.off('leave');
  $('#waitingMenu').remove();
  window.canvas = document.createElement("canvas");
  canvas.height = $(window).height().roundTo(game.grid);
  canvas.tabIndex = 1;
  canvas.width = ((canvas.height * 16) / 9).roundTo(game.grid);
  game.width = canvas.width;
  game.height = canvas.height;
  window.c = canvas.getContext("2d");
  c.imageSmoothingEnabled = true;
  document.documentElement.appendChild(canvas);
  document.onmousemove = function (e) {
    mouse.x = e.x - parseFloat($(canvas).offset().left) + .5;
    mouse.y = e.y - parseFloat($(canvas).offset().top);
    mouse.down = e.buttons;
  };
  document.onkeydown = function (e) {
    // if(document.activeElement != document.getElementById('messageInput')) 
    if (e.key == 't' && document.activeElement !== document.getElementById('messageInput')) {
      $('#messageInput').focus();
      e.preventDefault(); // Prevent the default action of the 't' key
    }
  };
  document.onmousedown = document.onmousemove;
  document.onmouseup = document.onmousedown;

  canvas.focus();
  canvas.onkeydown = function (e) {
    window.key[e.key] = true;
  }
  //Append the message box
  document.body.appendChild($(`<div id="messageBox">
  <div id="msgs"></div><input id="messageInput" placeholder="Press [T] to chat">
</div>`)[0]);

  //make the script to load the blocks

  let blockScript = document.createElement('script');

  // Set the src
  blockScript.src = './js/classes/blocks.js';

  // Add the script
  document.head.appendChild(blockScript);

  // When the script is loaded, load the player script
  blockScript.onload = function (e) {

    // Same things
    let playerscript = document.createElement('script');
    playerscript.src = './js/classes/player.js';
    document.head.appendChild(playerscript);
    playerscript.onload = function (e) {
      let mainScript = document.createElement('script');
      mainScript.src = "./js/main.js";
      document.documentElement.appendChild(mainScript);
      mainScript.onload = function (e) {
        document.body.appendChild($(`<button id='leaveButton'>Leave</button>`)[0]);
        $('#leaveButton').click(function (e) {
          confirm('Are you sure you want to leave?') ? location.search = '' : null;
        })
      }
    }
  }
}


Number.prototype.interp = function (y, a) {
  a *= game.time;
  return this * (1 - a) + y * a;
}



window.keyBindings = {
  get walkX() {
    return (key.d || key.ArrowRight) - (key.a || key.ArrowLeft);
  },
  get walkY() {
    return (key.s || key.ArrowDown) - (key.w || key.ArrowUp)
  }
};


window.onload = function (e) {
  if (search()) {
    //alert('a');
    waiting(search());
  }
  $('#roomToJoin').on('keydown',(e) => {
    if(e.key == 'Enter') {
      waiting($('#roomToJoin').val(),$('#usernameInput').val());
    }
  })
}

//socket.emit('joinRoom',room());
window.onblur = function (e) {
  for (let key in window.key) {
    if (window.key.hasOwnProperty(key)) {
      window.key[key] = false;
    }
  }
}
document.onkeyup = function (e) {
  window.key[e.key] = false;
};

window.isTouching = function (obj1, obj2) {
  if (obj2 == undefined) {
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
document.oncontextmenu = function (e) {
  e.preventDefault();
}