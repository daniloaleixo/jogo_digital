
// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// namespace our game
var SW = {

    // set up some initial values
    WIDTH: 320, 
    HEIGHT:  480, 
    
    entities: [],
    
    nextTile: 100,
    currentTile: 0,
    
    scale:  1,
    offset: {top: 0, left: 0},
    
    // we'll set the rest of these
    // in the init function
    RATIO:  null,
    currentWidth:  null,
    currentHeight:  null,
    canvas: document.getElementsByTagName('canvas')[0],
    ctx:  null,

    init: function() {

        // the proportion of width to height
        SW.RATIO = SW.WIDTH / SW.HEIGHT;
        // these will change when the screen is resized
        SW.currentWidth = SW.WIDTH;
        SW.currentHeight = SW.HEIGHT;
        // this is our canvas element
        SW.canvas = document.getElementsByTagName('canvas')[0];
        // setting this is important
        // otherwise the browser will
        // default to 320 x 200
        SW.canvas.width = SW.WIDTH;
        SW.canvas.height = SW.HEIGHT;
        // the canvas context enables us to 
        // interact with the canvas api
        SW.ctx = SW.canvas.getContext('2d');

        SW.images();        
        

        // we're ready to resize
        SW.resize();
        
        listen for clicks
        window.addEventListener('click', function(e) {
            e.preventDefault();
            SW.Input.set(e);
        }, false);
        
        listen for touches
        window.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // the event object has an array
            // named touches; we just want
            // the first touch
            SW.Input.set(e.touches[0]);
        }, false);
        window.addEventListener('touchmove', function(e) {
            // we're not interested in this,
            // but prevent default behaviour
            // so the screen doesn't scroll
            // or zoom
            e.preventDefault();
        }, false);
        window.addEventListener('touchend', function(e) {
            // as above
            e.preventDefault();
        }, false);
        
        SW.loop();

    },
    
    update: function() {
        var i;
    
        SW.nextTile -= 1;
        if (SW.nextTile < 0) {
            SW.currentTile += 3;
            SW.currentTile %= 4;
            // put a new instance of bubble into our entities array
            SW.tileRow(SW.currentTile);
            // reset the counter with a random value
            SW.nextTile = 39;
        }

        // cycle through all entities and update as necessary
        for (i = 0; i < SW.entities.length; i += 1) {
            SW.entities[i].update();
    
            // delete from array if remove property
            // flag is set to true
            if (SW.entities[i].remove) {
                SW.entities.splice(i, 1);
            }
        }
    },
    
    render: function() {
        var i;

       SW.Draw.rect(0, 0, SW.WIDTH, SW.HEIGHT, 'grey');
    
        // cycle through all entities and render to canvas
        for (i = 0; i < SW.entities.length; i += 1) {
            SW.entities[i].render(SW.entities[i].rot >= 0);
        } 
    },
    
    loop: function() {

        requestAnimFrame( SW.loop );

        SW.update();
        SW.render();
    },

    resize: function() {

        SW.currentHeight = window.innerHeight;
        // resize the width in proportion
        // to the new height
        SW.currentWidth = SW.currentHeight * SW.RATIO;

        // this will create some extra space on the
        // page, allowing us to scroll past
        // the address bar, thus hiding it.
        if (SW.android || SW.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }

        // set the new canvas style width and height
        // note: our canvas is still 320 x 480, but
        // we're essentially scaling it with CSS
        SW.canvas.style.width = SW.currentWidth + 'px';
        SW.canvas.style.height = SW.currentHeight + 'px';
        
        SW.scale = SW.currentWidth / SW.WIDTH;
        SW.offset.top = SW.canvas.offsetTop;
        SW.offset.left = SW.canvas.offsetLeft;

        // we use a timeout here because some mobile
        // browsers don't fire if there is not
        // a short delay
        window.setTimeout(function() {
                window.scrollTo(0,1);
        }, 1);
    }

};

window.addEventListener('load', SW.init, false);
window.addEventListener('resize', SW.resize, false);

SW.ua = navigator.userAgent.toLowerCase();
SW.android = SW.ua.indexOf('android') > -1 ? true : false;
SW.ios = ( SW.ua.indexOf('iphone') > -1 || SW.ua.indexOf('ipad') > -1  ) ? 
    true : false;
    
// abstracts various canvas operations into
// standalone functions
SW.Draw = {

    clear: function() {
        SW.ctx.clearRect(0, 0, SW.WIDTH, SW.HEIGHT);
    },

    fillRect: function(x, y, w, h, col) {
        SW.ctx.fillStyle = col;
        SW.ctx.fillRect(x, y, w, h);
    },

    rect: function(x, y, w, h, col, width) {
        SW.ctx.beginPath();
        SW.ctx.lineWidth=width;
        SW.ctx.strokeStyle=col;
        SW.ctx.rect(x+(width/2),y+(width/2),w-width,h-width); 
        SW.ctx.stroke();
    },

    circle: function(x, y, r, col) {
        SW.ctx.fillStyle = col;
        SW.ctx.beginPath();
        SW.ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
        SW.ctx.closePath();
        SW.ctx.fill();
    },

    text: function(string, x, y, size, col) {
        SW.ctx.font = 'bold '+size+'px Monospace';
        SW.ctx.fillStyle = col;
        SW.ctx.fillText(string, x, y);
    }

};

SW.matrix = [];
SW.rotate = [];

SW.images = function() {
    b = new Image();
    b.src = 'assets/visual/sprites/@2x/sprite-b.png';
    bl = new Image();
    bl.src = 'assets/visual/sprites/@2x/sprite-bl.png';
    br = new Image();
    br.src = 'assets/visual/sprites/@2x/sprite-br.png';
    tl = new Image();
    tl.src = 'assets/visual/sprites/@2x/sprite-tl.png';
    tr = new Image();
    tr.src = 'assets/visual/sprites/@2x/sprite-tr.png';
    w = new Image();
    w.src = 'assets/visual/sprites/@2x/sprite-w.png';
    SW.matrix[0] = [tl, b, tr, w];
    SW.matrix[1] = [w, bl, b, br];
    SW.matrix[2] = [tr, w, tl, b];
    SW.matrix[3] = [b, br, w, bl];
    for (var i = 0; i < 32; i++) {
        x = new Image();
        x.src = 'assets/visual/sprites/@2x/rots/sp'+i+'.png';
        SW.rotate[i] = x;
    }
};

SW.tileRow = function(c) {
    for (var i = 0; i < 8; i++) {
        SW.entities.push(new SW.Tile(i, c));  
    }
};

SW.Tile = function(i, c) {

    this.type = 'tile';
    this.size = SW.canvas.width/8;
    this.img = SW.matrix[c][i%4];
    this.x = this.size*i;
    this.y = -40;
    if ((c+(i%4))%2 == 1) {
        this.rot = -1;
    }
    else {
        if (c == 0) {
            this.rot = (i%4 == 0) ? 0 : 8;
        }
        else if (c == 1) {
            this.rot = (i%4 == 1) ? 24 : 16;
        }
        else if (c == 2) {
            this.rot = (i%4 == 0) ? 8 : 0;
        }
        else {
            this.rot = (i%4 == 1) ? 16 : 24
        }
    }
    this.isRot = 0;

    this.remove = false;

    this.update = function() {

        if (this.isRot > 0) {
            this.isRot -= 1;
            this.rot += 1;
            this.rot %= 32;
            this.img = SW.rotate[this.rot];
        }

        // move down the screen by 1 pixel
        this.y += 1;

        // if off screen, flag for removal
        if (this.y > SW.HEIGHT + 10) {
            this.remove = true;
        }

    };

    this.render = function(wrong) {
        SW.ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
        if (wrong) {
            SW.Draw.rect(this.x, this.y, this.size, this.size, "#ff5252", 3);
        }
    };

    this.isHit = function(_event) {

    	var clickedX = (320*_event.clientX)/SW.currentWidth;
    	var clickedY = (480*_event.clientY)/SW.currentHeight;
        if(this.rot >= 0 && this.isRot <= 0 && this.x < clickedX && (this.x+this.size) > clickedX && this.y < clickedY && (this.y+this.size) > clickedY) {
            return true;
        }
    };
};

SW.canvas.addEventListener('click', function(_event) {
    for(var i = 0; i < SW.entities.length; i++) {
        if(SW.entities[i].isHit(_event)) {
            SW.entities[i].isRot = 8;
        }
    }
});