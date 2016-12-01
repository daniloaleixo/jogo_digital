
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var WIDTH = 400;
var HEIGHT = 400;
var rects = new Array();
var numSquaresHor = 8, numSquaresVer = 8;
var sizeSquare = 50;
var fontSizeTitle = WIDTH/12;


var mainGame = null;

var frames = 30;
var timerId = 0;
 
timerId = setInterval(update, 1000/frames);

var bgImage = new Image();
var spriteTL = new Image();
var spriteB = new Image();
var spriteTR = new Image();
var spriteBR = new Image();
bgImage.src = "assets/visual/sprites/@2x/sprite-w.png"
spriteTL.src = "assets/visual/sprites/@2x/sprite-tl.png"
spriteB.src = "assets/visual/sprites/@2x/sprite-b.png"
spriteTR.src = "assets/visual/sprites/@2x/sprite-tr.png"
spriteBR.src = "assets/visual/sprites/@2x/sprite-br.png"

var buttonX = [40,140,249];
var buttonY = [240,240,240];
var buttonWidth = [96,260,182];
var buttonHeight = [40,40,40];

bgImage.onload = function(){
    context.drawImage(bgImage, 0, 0);
};
spriteTL.onload = function(){
    context.drawImage(spriteTL, buttonX[0], buttonY[0]);
};
spriteB.onload = function(){
    context.drawImage(spriteB, buttonX[1], buttonY[1]);
};
spriteTR.onload = function(){
    context.drawImage(spriteTR, buttonX[1], buttonY[1]);
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
	drawTitle();
	drawLogo();
	drawTapContinue();
	drawBottomMenu();
}

function drawBG(){
	clear (0, 0, WIDTH, HEIGHT);
	for (var i = 0; i < numSquaresHor * sizeSquare ; i+=sizeSquare) {
		for(var j = 0; j < numSquaresVer * sizeSquare; j+= sizeSquare)
			context.drawImage (bgImage, i, j, sizeSquare, sizeSquare);
	}
}

function drawTitle(){
	context.font="bold " + fontSizeTitle + "px Georgia";
	context.textAlign = "center";
	context.fillStyle = "#607d8b"
	context.fillText("Nome",WIDTH/2,HEIGHT/5);
	context.fillText("do Jogo",WIDTH/2,HEIGHT/5+fontSizeTitle);
}

function drawLogo(){
	context.drawImage(spriteTL, WIDTH/numSquaresHor * 2 + sizeSquare/2, 
								HEIGHT/numSquaresVer * 3, sizeSquare, sizeSquare);
	context.drawImage(spriteB, WIDTH/numSquaresHor * 3 + sizeSquare/2, 	
								HEIGHT/numSquaresVer * 3, sizeSquare, sizeSquare);
	context.drawImage(spriteTR, WIDTH/numSquaresHor * 3 + sizeSquare/2, 	
								HEIGHT/numSquaresVer * 4, sizeSquare, sizeSquare);

	context.drawImage(spriteTR, WIDTH/numSquaresHor * 4 + sizeSquare/2, 
								HEIGHT/numSquaresVer * 3, sizeSquare, sizeSquare);
	context.drawImage(spriteB, WIDTH/numSquaresHor * 4 + sizeSquare/2, 
								HEIGHT/numSquaresVer * 4, sizeSquare, sizeSquare);
	context.drawImage(spriteBR, WIDTH/numSquaresHor * 5 + sizeSquare/2, 
								HEIGHT/numSquaresVer * 4, sizeSquare, sizeSquare);

	context.strokeStyle = "#ff5252";
	context.lineWidth=sizeSquare/5;
	context.globalAlpha = 0.8;
	context.strokeRect(WIDTH/numSquaresHor * 3 + sizeSquare/2 - sizeSquare/10,
		HEIGHT/numSquaresVer * 4 - sizeSquare/10,
		sizeSquare + sizeSquare/5,
		sizeSquare+sizeSquare/5);
	context.globalAlpha = 1.0;
}

function drawTapContinue(){
	context.font="bold " + fontSizeTitle/2 + "px Georgia";
	context.textAlign = "center";
	context.fillStyle = "#607d8b"
	context.fillText("Toque para continuar",WIDTH/2,HEIGHT/10 * 7);
}


function drawBottomMenu(){
	context.font="bold " + fontSizeTitle/1.8 + "px Georgia";
	context.textAlign = "center";
	context.fillStyle = "#607d8b"
	context.fillText("Ajustes",WIDTH/2 - fontSizeTitle/1.8 * 5 ,HEIGHT/7 * 6);
	context.fillText("Sobre",WIDTH/2,HEIGHT/7 * 6);
	context.fillText("Créditos",WIDTH/2 + fontSizeTitle/1.8 * 5,HEIGHT/7 * 6);
}