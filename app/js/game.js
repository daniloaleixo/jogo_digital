// namespace our game
var GAME = {

    // set up some initial values
    WIDTH: 320, 
    HEIGHT:  480, 
    // we'll set the rest of these
    // in the init function
    RATIO:  null,
    currentWidth:  null,
    currentHeight:  null,
    canvas: null,
    ctx:  null,

    // let's keep track of scale
    // along with all initial declarations
    // at the start of the program
    scale:  1,
    // the position of the canvas
    // in relation to the screen
    offset: {top: 0, left: 0},

    init: function() {

        // the proportion of width to height
        GAME.RATIO = GAME.WIDTH / GAME.HEIGHT;

        // these will change when the screen is resized
        GAME.currentWidth = GAME.WIDTH;
        GAME.currentHeight = GAME.HEIGHT;

        // this is our canvas element
        GAME.canvas = document.getElementsByTagName('canvas')[0];

        // setting this is important
        // otherwise the browser will
        // default to 320 x 200
        GAME.canvas.width = GAME.WIDTH;
        GAME.canvas.height = GAME.HEIGHT;

        // the canvas context enables us to 
        // interact with the canvas api
        GAME.ctx = GAME.canvas.getContext('2d');

        // we need to sniff out Android and iOS
        // so that we can hide the address bar in
        // our resize function
        GAME.ua = navigator.userAgent.toLowerCase();
        GAME.android = GAME.ua.indexOf('android') > -1 ? true : false;
        GAME.ios = ( GAME.ua.indexOf('iphone') > -1 || GAME.ua.indexOf('ipad') > -1  ) ? 
            true : false;

        // we're ready to resize
        GAME.resize();

        // include this at the end of GAME.init function
        GAME.Draw.clear();
        GAME.Draw.rect(120,120,150,150, 'green');
        GAME.Draw.circle(100, 100, 50, 'rgba(255,0,0,0.5)');
        GAME.Draw.text('Hello World', 100, 100, 10, '#000');

    },

    resize: function() {

        GAME.currentHeight = window.innerHeight;
        // resize the width in proportion
        // to the new height
        GAME.currentWidth = GAME.currentHeight * GAME.RATIO;

        // this will create some extra space on the
        // page, allowing us to scroll past
        // the address bar, thus hiding it.
        if (GAME.android || GAME.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }

        // set the new canvas style width and height
        // note: our canvas is still 320 x 480, but
        // we're essentially scaling it with CSS
        GAME.canvas.style.width = GAME.currentWidth + 'px';
        GAME.canvas.style.height = GAME.currentHeight + 'px';

        // add this to the resize function.
        GAME.scale = GAME.currentWidth / GAME.WIDTH;
        console.log(GAME.canvas);
        GAME.offset.top = GAME.canvas.offsetTop;
        GAME.offset.left = GAME.canvas.offsetLeft;

        // we use a timeout here because some mobile
        // browsers don't fire if there is not
        // a short delay
        window.setTimeout(function() {
                window.scrollTo(0,1);
        }, 1);
    }

};

// abstracts various canvas operations into
// standalone functions
GAME.Draw = {

    clear: function() {
        GAME.ctx.clearRect(0, 0, GAME.WIDTH, GAME.HEIGHT);
    },

    rect: function(x, y, w, h, col) {
        GAME.ctx.fillStyle = col;
        GAME.ctx.fillRect(x, y, w, h);
    },

    circle: function(x, y, r, col) {
        GAME.ctx.fillStyle = col;
        GAME.ctx.beginPath();
        GAME.ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
        GAME.ctx.closePath();
        GAME.ctx.fill();
    },

    text: function(string, x, y, size, col) {
        GAME.ctx.font = 'bold '+size+'px Monospace';
        GAME.ctx.fillStyle = col;
        GAME.ctx.fillText(string, x, y);
    }

};

window.addEventListener('load', GAME.init, false);
window.addEventListener('resize', GAME.resize, false);


// + add this at the bottom of your code,
// before the window.addEventListeners
GAME.Input = {

    x: 0,
    y: 0,
    tapped :false,

    set: function(data) {

        var offsetTop = GAME.canvas.offsetTop,
            offsetLeft = GAME.canvas.offsetLeft;
            // scale = GAME.currentWidth / GAME.WIDTH;

        this.x = ( data.pageX - offsetLeft ) / GAME.scale;
        this.y = ( data.pageY - offsetTop ) / GAME.scale;
        this.tapped = true; 

        GAME.Draw.circle(this.x, this.y, 10, 'red');
    }

};


// listen for clicks
window.addEventListener('click', function(e) {
    e.preventDefault();
    GAME.Input.set(e);
}, false);

// listen for touches
window.addEventListener('touchstart', function(e) {
    e.preventDefault();
    // the event object has an array
    // named touches; we just want
    // the first touch
    GAME.Input.set(e.touches[0]);
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