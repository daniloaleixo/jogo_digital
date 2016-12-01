
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
        
        

        // we're ready to resize
        SW.resize();
        
        // listen for clicks
        window.addEventListener('click', function(e) {
            e.preventDefault();
            SW.Input.set(e);
        }, false);
        
        // listen for touches
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
            SW.currentTile += 1;
            // put a new instance of bubble into our entities array
            SW.tileRow(SW.currentTile%2);
            // reset the counter with a random value
            SW.nextTile = 39;
        }
    
        // spawn a new instance of Touch
        // if the user has tapped the screen
        if (SW.Input.tapped) {
            /*SW.entities.push(new SW.Touch(SW.Input.x, SW.Input.y));*/
            // set tapped back to false
            // to avoid spawning a new touch
            // in the next cycle
            SW.Input.tapped = false;
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
            SW.entities[i].render();
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

    rect: function(x, y, w, h, col) {
        SW.ctx.fillStyle = col;
        SW.ctx.fillRect(x, y, w, h);
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

// + add this at the bottom of your code,
// before the window.addEventListeners
SW.Input = {

    x: 0,
    y: 0,
    tapped :false,

    set: function(data) {
        this.x = (data.pageX - SW.offset.left) / SW.scale;
        this.y = (data.pageY - SW.offset.top) / SW.scale;
        this.tapped = true; 

    }

};

/*SW.Touch = function(x, y) {

    this.type = 'touch';    // we'll need this later
    this.x = x;             // the x coordinate
    this.y = y;             // the y coordinate
    this.r = 5;             // the radius
    this.opacity = 1;       // initial opacity; the dot will fade out
    this.fade = 0.05;       // amount by which to fade on each game tick
    this.remove = false;    // flag for removing this entity. SW.update
                            // will take care of this

    this.update = function() {
        // reduce the opacity accordingly
        this.opacity -= this.fade; 
        // if opacity if 0 or less, flag for removal
        this.remove = (this.opacity < 0) ? true : false;
    };
    this.render = function() {
        SW.Draw.circle(this.x, this.y, this.r, 'rgba(255,0,0,'+this.opacity+')');
    };

};*/

SW.tileRow = function(c) {
    for (var i = 0; i < 8; i++) {
        SW.entities.push(new SW.Tile(i, c));  
    }
};

SW.Tile = function(i, c) {

    this.type = 'tile';
    this.size = SW.canvas.width/8;
    if ((c+i)%2 == 0) {
        this.color = "black";
    }
    else {
        this.color = "white";
    }
    this.x = this.size*i;
    this.y = -40;
    

    this.remove = false;

    this.update = function() {

        // move down the screen by 1 pixel
        this.y += 1;

        // if off screen, flag for removal
        if (this.y > SW.HEIGHT + 10) {
            this.remove = true;
        }

    };

    this.render = function() {
        SW.Draw.rect(this.x, this.y, this.size, this.size, this.color);
    };

    this.isHit = function(_event) {
    	console.log(SW.currentWidth, SW.currentHeight)

    	var clickedX = (320*_event.clientX)/SW.currentWidth;
    	var clickedY = (480*_event.clientY)/SW.currentHeight;
        if(this.x < clickedX && (this.x+this.size) > clickedX && this.y < clickedY && (this.y+this.size) > clickedY) {
            console.log(_event.clientX, " ", _event.clientY)
            return true;
        }
    };

};

SW.canvas.addEventListener('click', function(_event) {
    for(var i = 0; i < SW.entities.length; i++) {
        if(SW.entities[i].isHit(_event)) {
            SW.entities[i].color = "red";    
        }
    }
});