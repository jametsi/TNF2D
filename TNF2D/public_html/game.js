/**
 * Created with JetBrains WebStorm.
 * User: jami
 * Date: 25.1.2013
 * Time: 22:52
 * To change this template use File | Settings | File Templates.
 */

// RequestAnimationFrame polyfill
(function() {
    var lastTime=0;
    var vendors=['ms', 'moz', 'webkit', 'o'];
    for (var x=0; x<vendors.length && !window.requestAnimationFrame; x++) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] ||
                window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime.timeToCall); },
                timeToCall);
            lastTime = currTime+timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


$(document).ready(function() {
    game.init();
});

var game = {

    context: {},
    hero: {},
    entities: [],
    painter: {},
    vampires: 0,

    init: function() {
        game.vampires = new VampireManager();

        game.canvas = $('#gamecanvas')[0];
        game.overlaycanvas = $('#overlaycanvas')[0];
        game.context = game.canvas.getContext('2d');
        game.overlay = game.canvas.getContext('2d');

        game.canvas.height = window.innerHeight;
        game.canvas.width = window.innerWidth;
        game.overlay.height = window.innerHeight;
        game.overlay.width = window.innerWidth;


        // Ladataan pelimusiikki
        game.theme = loader.loadSound("snd/TNFI2D_theme");
        game.theme.play();
        // Näytetään päämenu
        $('.gamelayer').hide();
        $('#startscreen').show();
    },
    playTutorial: function() {
        $('.gamelayer').fadeToggle(100, function() {
            $('#tutorialpage').fadeIn(100, function() {
                $('#tutorialpage').click(function() {

                    // Feidataan teemamusiikki pois
                    $(game.theme).on('timeupdate', function () {
                        var vol = 1,
                            interval = 250;
                        if (game.theme.volume == 1) {
                            var intervalID = setInterval(function () {
                                if (vol > 0) {
                                    vol -= 0.02;
                                    game.theme.volume = vol.toFixed(2);
                                } else {
                                    clearInterval(intervalID);
                                }
                            }, interval);
                        }
                    });

                    // Feidataan tutoriaalisivu pois, ja startataan peli
                    $('#tutorialpage').fadeOut(100, game.start);

                });
            });
        });


    },

    start: function() {
        game.painter = new Painter();
        game.soundManager = new SoundManager();
        loader.init();
        dungeon.generateLevel(4, 4);
        dungeon.initImages();
        game.hero = new Hero(dungeon.startPosition);
        dungeon.printArray();
        //console.log(dungeon.map);

/*        for (var entity in level.entities) {
            entities.create(level.entities[entity]);
        }*/
        game.ended = false;

        keyhandler.init();

        // Näytetään pelicanvas ja startataan animaatio
        $('.gamelayer').hide();
        $('#gamecanvas').show();
        game.animate();
    },

    step: function() {

        game.hero.update();
        game.vampires.update(game.hero);

    },
    animate: function() {

        // Siivotaan canvas
        game.step();
        game.painter.draw();
       // game.drawAllEntities();

        if (game.ended == "WIN") {
            $('.gamelayer').hide();
            $('#endingscreen').fadeIn(300, function() {
                $('#endingscreen').css("width", "100%");
                $('#endingscreen').css("height", "100%");
            });
        }
        else if (game.ended == "DEATH") {
            game.soundManager.playerDead.play();
            $('.gamelayer').hide();
            $('#endingscreen h1').html("YOU ARE DEAD!")
            $('#endingscreen').fadeIn(300);
        }
        else {
            game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
        }
    }
}

var level = {
    definition:{},
    entities:[  {type: "hero", x: 10, y: 10, angle: 0}]
}

/*var entities = {
    definitions: {
        "hero": {
            name: "blank",
            type: "hero",
            width:100,
            height:100,
            walkSpeed: 1.3,
            turnSpeed: 2,
            angle: 0
        }
    },
    create: function(entity) {

        var definition = entities.definitions[entity.type];
        if (!definition) {
            console.log ("Undefined entity type ", entity.type);
            return;
        }

        switch(entity.type) {
            case "hero":
                entity.width = definition.width;
                entity.height = definition.height;
                entity.walkSpeed = definition.walkSpeed;
                entity.sprite = loader.loadImage("img/herosheet.png");
                game.hero = entity;
        }
    },
    draw: function(entity) {

        switch(entity.type) {
            case "hero":
                // console.log(game.camera);
                //   console.log(game.camera.x);

        }

    }
}*/

var keyhandler = {

    up: false,
    down: false,
    left: false,
    right: false,
    cursorX: 0,
    cursorY: 0,

    init: function() {
        $(window).keydown(function(e) {
            var code = e.keyCode;
            //    console.log(code);
            if(code == 37 || code == 65) { // Vasen
                e.preventDefault();
                keyhandler.left = true;
            }
            if(code == 39 || code == 68) { // Oikea
                e.preventDefault();
                keyhandler.right = true;
            }
            if(code == 38 || code == 87) { // Ylös
                e.preventDefault();
                keyhandler.up = true;
            }
            if(code == 40 || code == 83) { // Alas
                e.preventDefault();
                keyhandler.down = true;
            }
        });
        $(window).keyup(function(e) {
            var code = e.keyCode;
            //    console.log(code);
            if(code == 37 || code == 65) { // Vasen
                e.preventDefault();
                keyhandler.left = false;
            }
            if(code == 39 || code == 68) { // Oikea
                e.preventDefault();
                keyhandler.right = false;
            }
            if(code == 38 || code == 87) { // Ylös
                e.preventDefault();
                keyhandler.up = false;
            }
            if(code == 40 || code == 83) { // Alas
                e.preventDefault();
                keyhandler.down = false;
            }
        });
        $(document).mousemove(function(e){
            keyhandler.cursorX = e.pageX;
            keyhandler.cursorY = e.pageY;
        });
    }
}

var loader = {

    loaded: true,
    loadedCount: 0,
    totalCount: 0,

    init: function() {
        var mp3Support, oggSupport;
        var audio = document.createElement('audio');
        if (audio.canPlayType) {
            mp3Support = "" !=audio.canPlayType('audio/meg');
            oggSupport = "" !=audio.canPlayType('audio/ogg; codecs="vorbis"');
        } else {
            mp3Support = false;
            oggSupport = false;
        }

        loader.soundFileExtn = oggSupport?".ogg":mp3Support?".mp3":undefined;
    },

    loadImage: function(url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var image = new Image();
        image.src=url;
        image.onload=loader.itemLoaded;
        return image;
    },

    soundFileExtn:".ogg",

    loadSound: function(url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var audio = new Audio();
        audio.src=url+loader.soundFileExtn;
        audio.addEventListener("canplaythrough", loader.itemLoaded, false);
        return audio;
    },

    itemLoaded: function() {
        loader.loadedCount++;
        $('#loadingmessage').html('Loaded ' +loader.loadedCount+' of '+loader.totalCount);
        if (loader.loadedCount === loader.totalCount) {
            // Loader on valmis
            loader.loaded = true;
            // Piilotetaan latausviesti
            $('#loadingscreen').hide();
            // Kutsutaan loader.onloadia, jos sellainen löytyy
            if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }

        }
    }
}

