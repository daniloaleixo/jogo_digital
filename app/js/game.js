
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

    numSquaresHorizontal: 8,
    numSquaresVertical: 8,
    sizeSquare: 1,
    fontSizeTitle : 26,
    wannaPlay: false,
    
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
        SW.loop();

    },
    
    update: function() {
        var i;
    
        SW.nextTile -= SW.speed;
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
								if (SW.entities[i].rot != SW.entities[i].cc){
									SW.lives--;
									if (SW.lives == 0) alert ("Perdeu!");
								} 
								if ((i+1)%4 == 0) {
									SW.score += SW.dist;
									if (SW.score%500 == 0 && SW.score != 0) {
										SW.speed += 0.2;
										SW.prob -= 0.01;
									}
									//console.log('here', SW.score);
								}
                SW.entities.splice(i, 1);
						}
        }
    },
    
    render: function() {
        var i;

       SW.Draw.rect(0, 0, SW.WIDTH, SW.HEIGHT, 'grey');
    
        // cycle through all entities and render to canvas
        for (i = 0; i < SW.entities.length; i += 1) {
            SW.entities[i].render(SW.entities[i].rot != SW.entities[i].cc);
        } 
    },
    
    loop: function() {

        requestAnimFrame( SW.loop );

        if(!SW.wannaPlay)
            SW.FrontPage.update();
        else {
            SW.update();
            SW.render();
        }

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

        SW.sizeSquare = (SW.canvas.width / 8)
        SW.numSquaresVertical = SW.canvas.height / SW.sizeSquare;
        SW.fontSizeTitle = SW.canvas.width/12;


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
        SW.ctx.font = 'Fredoka1, Sanserif'+size+'px Monospace';
        SW.ctx.fillStyle = col;
        SW.ctx.fillText(string, x, y);
    }

};

SW.matrix = [];
SW.rotate = [];
SW.lives = 3;
SW.score = 0;
SW.dist = 20;
SW.speed = 1;
SW.prob = 0.95;

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
		var cc;
    for (var i = 0; i < 8; i++) {
			var img = SW.matrix[c][i%4];
			if ((c+(i%4))%2 == 1) {
				this.rot = -1;
				cc = this.rot;
			} else {
				var r = Math.random();
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
				cc = this.rot;
				if (r > SW.prob) {
					this.rot = 8*Math.floor(Math.random()*4);
					img = SW.rotate[this.rot];
				}
			}
        SW.entities.push(new SW.Tile(this.rot, img, i, cc));  
    }
};

SW.Tile = function(rot, matrix, i, cc) {

    this.type = 'tile';
    this.size = SW.canvas.width/8;
		this.rot = rot;
    this.img = matrix;
    this.x = this.size*i;
    this.y = -40;
    this.isRot = 0;
		this.cc = cc;


    this.remove = false;

    this.update = function() {
				

        if (this.isRot > 0) {
            this.isRot -= 1;
            this.rot += 1;
            this.rot %= 32;
            this.img = SW.rotate[this.rot];
        }

        // move down the screen by 1 pixel
        this.y += SW.speed;

        // if off screen, flag for removal
        if (this.y > SW.HEIGHT + 10) {
            this.remove = true;
        }

    };

    this.render = function(wrong) {
        SW.ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
				SW.Draw.text ("Score: "+SW.score, 30, 30, 12, "#ff5252"); 
				for (var i = 0; i < SW.lives; i++) {
					SW.Draw.circle (200+i*15, 25, 5, "#ff5252"); 
				}
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

    if(SW.wannaPlay){
        for(var i = 0; i < SW.entities.length; i++) {
            if(SW.entities[i].isHit(_event)) {
                SW.entities[i].isRot = 8;
            }
        }
    } else {

        var clickedX = (320*_event.clientX)/SW.currentWidth;
        var clickedY = (480*_event.clientY)/SW.currentHeight;

        //  Button to play
        if(_event.clientX >= SW.canvas.width/SW.numSquaresHorizontal * 4 && 
            _event.clientX <= SW.canvas.width/SW.numSquaresHorizontal * 4 + SW.sizeSquare * 2 &&
            _event.clientY < SW.canvas.height/SW.numSquaresVertical * 9)
        {
            SW.wannaPlay = true;
        }
    }

});

SW.canvas.addEventListener('touchstart', function(_event) {
    for(var i = 0; i < SW.entities.length; i++) {
        if(SW.entities[i].isHit(_event.touches[0])) {
            SW.entities[i].isRot = 8;
        }
    }
});

SW.canvas.addEventListener('touchend', function(_event) {
    for(var i = 0; i < SW.entities.length; i++) {
			_event.preventDefault();
    }
});

SW.canvas.addEventListener('touchmove', function(_event) {
    for(var i = 0; i < SW.entities.length; i++) {
			_event.preventDefault();
    }
});

SW.FrontPage = {

    update: function(){
        SW.FrontPage.clear();
        SW.FrontPage.move();
        SW.FrontPage.draw();
    },

    clear: function(){
        SW.ctx.clearRect(0, 0, SW.WIDTH, SW.HEIGHT);
    },

    move: function(){

    },

    draw: function(){
        SW.FrontPage.drawBG();
        SW.FrontPage.drawTitle();
        SW.FrontPage.drawLogo();
        SW.FrontPage.drawTapContinue();
        SW.FrontPage.drawBottomMenu();
    },

    drawBG: function(){

        for(var i = 0; i < SW.numSquaresHorizontal * SW.sizeSquare; i += SW.sizeSquare )
        {
            for (var j = 0; j < SW.numSquaresVertical * SW.sizeSquare; j += SW.sizeSquare){
                SW.ctx.drawImage (SW.matrix[0][3], i, j, SW.sizeSquare, SW.sizeSquare);
            }
        }

    },

    drawTitle: function(){
        SW.ctx.font="bold " + SW.fontSizeTitle + "px Georgia";
        SW.ctx.textAlign = "center";
        SW.ctx.fillStyle = "#607d8b"
        SW.ctx.fillText("Nome",SW.canvas.width/2,
                            SW.canvas.height/SW.numSquaresVertical * 2);
        SW.ctx.fillText("do Jogo",SW.canvas.width/2,
                    SW.canvas.height/SW.numSquaresVertical * 2 + SW.fontSizeTitle);
    },

    drawLogo: function(){
        SW.ctx.drawImage(SW.matrix[0][0], SW.canvas.width/SW.numSquaresHorizontal * 2 + SW.sizeSquare/2, 
                            SW.canvas.height/SW.numSquaresVertical * 4, SW.sizeSquare, SW.sizeSquare);
        SW.ctx.drawImage(SW.matrix[0][1], SW.canvas.width/SW.numSquaresHorizontal * 3 + SW.sizeSquare/2,  
                            SW.canvas.height/SW.numSquaresVertical * 4, SW.sizeSquare, SW.sizeSquare);
        SW.ctx.drawImage(SW.matrix[1][3], SW.canvas.width/SW.numSquaresHorizontal * 3 + SW.sizeSquare/2,     
                            SW.canvas.height/SW.numSquaresVertical * 5, SW.sizeSquare, SW.sizeSquare);

        SW.ctx.drawImage(SW.matrix[0][2], SW.canvas.width/SW.numSquaresHorizontal * 4 + SW.sizeSquare/2, 
                            SW.canvas.height/SW.numSquaresVertical * 4, SW.sizeSquare, SW.sizeSquare);
        SW.ctx.drawImage(SW.matrix[0][1], SW.canvas.width/SW.numSquaresHorizontal * 4 + SW.sizeSquare/2, 
                            SW.canvas.height/SW.numSquaresVertical * 5, SW.sizeSquare, SW.sizeSquare);
        SW.ctx.drawImage(SW.matrix[1][3], SW.canvas.width/SW.numSquaresHorizontal * 5 + SW.sizeSquare/2, 
                            SW.canvas.height/SW.numSquaresVertical * 5, SW.sizeSquare, SW.sizeSquare);

        SW.ctx.strokeStyle = "#ff5252";
        SW.ctx.lineWidth=SW.sizeSquare/5;
        SW.ctx.globalAlpha = 0.8;
        SW.ctx.strokeRect(SW.canvas.width/SW.numSquaresHorizontal * 3 + SW.sizeSquare/2 - SW.sizeSquare/10,
            SW.canvas.height/SW.numSquaresVertical * 5 - SW.sizeSquare/10,
            SW.sizeSquare + SW.sizeSquare/5,
            SW.sizeSquare+SW.sizeSquare/5);
        SW.ctx.globalAlpha = 1.0;
    },

    drawTapContinue: function(){
        SW.ctx.font="bold " + SW.fontSizeTitle/2 + "px Georgia";
        SW.ctx.textAlign = "center";
        SW.ctx.fillStyle = "#607d8b";
        SW.ctx.fillText("Toque para continuar",SW.canvas.width/2,
                        SW.canvas.height/SW.numSquaresVertical * 7);
    },

    drawBottomMenu: function(){
        SW.ctx.font="bold " + SW.fontSizeTitle/1.8 + "px Georgia";
        SW.ctx.textAlign = "center";
        SW.ctx.fillStyle = "#607d8b"
        SW.ctx.fillText("Ajustes",SW.canvas.width/2 - SW.fontSizeTitle/1.8 * 5,
                                SW.canvas.height/SW.numSquaresVertical * 9);
        SW.ctx.fillText("Sobre",SW.canvas.width/2,SW.canvas.height/ SW.numSquaresVertical * 9);
        SW.ctx.fillText("Créditos",SW.canvas.width/2 + SW.fontSizeTitle/1.8 * 5,
                                SW.canvas.height/ SW.numSquaresVertical * 9);
    },
}
