let pug = function (context) {
    return new pug.init(context);
  };
  pug.init = function (context) {
    this.context = context;
  };
  pug.fn = pug.init.prototype;
  pug.defaultObject = function(object,defaultt) {
    if(typeof object != 'object') {
      defaultt = object;
      object = {};
    } else {
      object = object ?? {};
    }
    
    return new Proxy(object,{get(target,prop,receiver) {
      return target[prop] ?? (defaultt ?? false);
    }})
  }
  pug.math = new Proxy({},{
    get(target, prop, receiver) {
      if(['sin','cos','tan'].some(item => prop == item)) {
        return function(deg) {
          return Math[prop](deg*Math.PI/180);
      };
      }
      if(['asin','atan','acos'].some(item => prop == item)) {
        return function(num) {
          return Math[prop](num)*180/Math.PI;
        }
      }

      if(prop == 'atan2') {
          return function(num1,num2) {
              return Math[prop](num1,num2)*180/Math.PI;	
          }
      }
    }
  });
  
  pug.sleep = function(ms) {
      return new Promise(r => setTimeout(r,ms));	
  }
  Array.prototype.removeDuplicates = function() {
    return [...new Set(this)];
  }
  Number.prototype.lerp = function(y,a) {
    return this * (1 - a) + y * a;
  }
  Number.prototype.interp = Number.prototype.lerp;
  Number.prototype.roundTo = function(num) {
    return Math.round(this/num) * num;
  }
  pug.initConsole = function() {
    this.console = document.createElement('div');
    this.console.setAttribute('id','console');
    document.body.appendChild(this.console);
    window.console = {
        log: (...args) => {
          console.logs.push({ 'log': args.map(e => (typeof e == 'object' ? JSON.stringify(e) : e)).join(' '), 'type': 'log' });
          console.update();
        }, error: (...args) => {
          console.logs.push({ 'log': args.map(e => (typeof e == 'object' ? JSON.stringify(e) : e)).join(' '), 'type': 'error' });
          console.update();
        }, clear: () => { console.logs = []; console.update() }, warn: (...args) => {
          console.logs.push({ 'log': args.map(e => (typeof e == 'object' ? JSON.stringify(e) : e)).join(' '), 'type': 'warn' });
          console.update();
        }, logs: [], update: () => {
          $('#console').html('<br>');
          console.logs.length > 50 ? console.logs.shift() : null;
          console.logs.forEach((e, i) => {
            $('#console').append(`<span style='${e.type == 'log' ? 'color:white' : (e.type == 'error' ? 'color:red' : 'color:yellow')}'>${e.log}</span><br>`);
            let consolee = $('#console')[0];
            consolee.scrollTop = consolee.scrollHeight;
          })
          $('#console').append("<span id='consoleInputContainer'>&gt;<input id='consoleInput' placeholder='Your Text Here'></span>    <div id='consoleHeight'>...<!--<a>-</a>--></div>");
          $("#consoleHeight")[0].onmousedown = (e) => {
            this.consoleDrag = true;
          }
          document.onmouseup = () => {
            this.consoleDrag = false;
          }
          document.onmousemove = (e) => {
            if(this.consoleDrag) {
              $('#consoleHeight').css('bottom',Math.max($(window).height()-e.y-10,100));
              $('#console').css('height',parseFloat($("#consoleHeight").css('bottom'))-30)
            }
          }
          $("#consoleInput")[0].onkeydown = (e) => {
            if (e.key == 'Enter') {
              eval($('#consoleInput').val());
              $('#consoleInput').val('');
              $('#consoleInput').focus();
            }
          }
        }
      };
      console.update();
      window.onerror = function(message, source, line, collumn, error) {
        console.error(`An error occurred: ${message}, Line:${line}, Collumn:${collumn}`);
        // Return true to prevent the default error handling behavior
        return true;
      };
  }
  console.clear();
  
  window.pug = pug;
  window.math = pug.math;
  window.sleep = pug.sleep;