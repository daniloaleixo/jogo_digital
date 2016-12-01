
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var WIDTH = 400;
var HEIGHT = 400;
var rects = new Array();
var numSquaresHor = 8, numSquaresVer = 8;
var sizeSquare = 50;


var mainGame = null;

var frames = 30;
var timerId = 0;
 
timerId = setInterval(update, 1000/frames);

var bgImage = new Image();
var playImage = new Image();
var instructImage = new Image();
bgImage.src = "assets/visual/sprites/@4x/sprite-w.png"
playImage.src = "assets/visual/sprites/@2x/sprite-tr.png"
instructImage.src = "assets/visual/sprites/@2x/sprite-tl.png"

var buttonX = [40,140,249];
var buttonY = [240,240,240];
var buttonWidth = [96,260,182];
var buttonHeight = [40,40,40];

bgImage.onload = function(){
    context.drawImage(bgImage, 0, 0);
};
playImage.onload = function(){
    context.drawImage(playImage, buttonX[0], buttonY[0]);
};
instructImage.onload = function(){
    context.drawImage(instructImage, buttonX[1], buttonY[1]);
};

function update() {
    clear();
    move();
    draw();
}

function clear(){
    context.clearRect(0, 0, WIDTH, HEIGHT);
}

var backgroundY = 0;
var speed = 1;

function move(){
    backgroundY += speed;
    if(backgroundY == -1 * HEIGHT){
        backgroundY = 0;
    }
}

function draw(){
	//context.drawImage(bgImage, 0, backgroundY);
	//context.drawImage(bgImage, 0, 0);
	drawBG();
	context.drawImage(playImage, buttonX[0], buttonY[0]);
	context.drawImage(instructImage, buttonX[1], buttonY[1]);
}

function drawBG(){
	clear (0, 0, WIDTH, HEIGHT);
	for (var i = 0; i < numSquaresHor * sizeSquare ; i+=sizeSquare) {
		for(var j = 0; j < numSquaresVer * sizeSquare; j+= sizeSquare)
			context.drawImage (bgImage, i, j, 50, 50);
	}
}