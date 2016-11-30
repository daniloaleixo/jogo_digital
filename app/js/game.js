
var canvas;
var ctx;
var WIDTH = 400;
var HEIGHT = 400;
var rects = new Array();

function rect (x, y, w, h) {
	ctx.beginPath();
	ctx.rect (x, y, w, h);
	ctx.closePath();
	ctx.fill ();
	ctx.stroke ();
}

function clear (i, j, w, h) {
	ctx.clearRect (i, j, w, h);
}

function init() {
	canvas = document.getElementById ("canvas");
	ctx = canvas.getContext ("2d");
	createGrid ();
}

function createGrid () {
	clear (0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = "white";
	rect (0, 0, WIDTH, HEIGHT);
	for (var i = -40000; i < 400; i += 40) {	
		for (var j = 0; j < WIDTH; j += 40) {
			var tmp = new Object();
			tmp = {
             x : j,
						 y : i,
						 w : 40,
						 h : 40,
						 directionY: 1
			}
			rects.push(tmp);
			//rect (i, j, 40, 40);
		}
			//github.com/daniloaleixo/jogo_digital.gitonsole.log("here");
		draw ();
	}
}

function draw () {
	clear (0, 0, WIDTH, HEIGHT);
	for (var i = 0; i < rects.length; i++) {
		var tmp = rects[i];
		ctx.strokeRect (tmp.x, tmp.y, tmp.w, tmp.w);
	}
}
requestAnimationFrame (animate);

function animate (time) {
	for (var i = 0; i < rects.length; i++) {
		rects[i].y += rects[i].directionY;
	}

	draw (rects);

	requestAnimationFrame (animate);
}

function relMouseCoords (event) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = this;

	do {
		totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
		totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
	}
	while (currentElement = currentElement.offsetParent)

		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

	if (event.offsetX !== undefined && event.offsetY !== undefined) {
		//	return {x:event.offsetX, y:event.offsetY};
		console.log ('x: ', event.offsetX, ' y: ', event.offsetY);
		canvasX = event.offsetX; 
		canvasY = event.offsetY;
	}
	changeColor (canvasX-canvasX%40, canvasY-canvasY%40);
}

function changeColor (xx, yy) {
	ctx.fillStyle = "yellow";
	console.log ('posicaoes :', xx, yy);
	rect (xx, yy, 40, 40);
	console.log ('click');
}

init();
window.addEventListener ('click', relMouseCoords, true);
