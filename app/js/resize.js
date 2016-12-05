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
        // GAME.Draw.rect(120,120,150,150, 'green');
        // GAME.Draw.rect(20,20,150,150, 'green');
        // GAME.Draw.rect(0,0,150,150, 'red');

        console.log("estou aca");


        makeGrid(8, 16, GAME.currentWidth/8, GAME.currentHeight/16);


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
