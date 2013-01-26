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

    init: function() {
        game.canvas = $('#gamecanvas')[0];
        game.context = game.canvas.getContext('2d');
        game.canvas.height = window.innerHeight;
        game.canvas.width = window.innerWidth;

        // Ladataan pelimusiikki
        game.theme = loader.loadSound("snd/TNFI2D_theme");
        game.theme.play();
        // Näytetään päämenu
        $('.gamelayer').hide();
        $('#startscreen').show();
    },
    playTutorial: function() {
        $('.gamelayer').fadeToggle(4000, function() {
            $('#tutorialpage').fadeIn(4000, function() {
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
                    $('#tutorialpage').fadeOut(10000, game.start);

                });
            });
        });
    },
    start: function() {

        for (var entity in level.entities) {
            entities.create(level.entities[entity]);
        }
        game.ended = false;

        keyhandler.init();

        // Näytetään pelicanvas ja startataan animaatio
        $('.gamelayer').hide();
        $('#gamecanvas').show();
        game.animate();
    },

    step: function() {

        if (keyhandler.up) {

            game.hero.walking = true;

            var dx = game.hero.x+game.hero.width/2 - keyhandler.cursorX;
            var dy = game.hero.y+game.hero.height/2 - keyhandler.cursorY;
            game.hero.angle = Math.atan2(dy, dx)*(180/Math.PI);
            game.hero.x += Math.cos(game.hero.angle*(Math.PI/180))*-game.hero.walkSpeed;
            game.hero.y += Math.sin(game.hero.angle*(Math.PI/180))*-game.hero.walkSpeed;

        }
        else {
            game.hero.walking = false;
        }

    },
    animate: function() {

        // Siivotaan canvas
        game.context.clearRect(0,0,game.canvas.width,game.canvas.height);

        game.step();
        game.drawAllEntities();

        if (game.ended) {
            //TODO näytä loppuruutu
        }
        else {
            game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
        }
    },
    drawAllEntities: function() {
        // Piirretään pelaaja
        entities.draw(game.hero);

        for (var entity in game.entities) {
            entities.draw(game.entities[entity]);
        }
    }
}

var level = {
    definition:{},
    entities:[{type: "hero", x: 10, y: 10}]
}

var entities = {
    definitions: {
        "hero": {
            name: "blank",
            type: "hero",
            width:100,
            height:100,
            walkSpeed: 1.3
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
                game.context.translate(entity.x+entity.width/2, entity.y+entity.height/2);
                game.context.rotate(entity.angle*Math.PI/180);

                game.context.fillStyle = 'rgb(255,0,0)';
                game.context.drawImage(entity.sprite, 0, 0, 100, 100, 0-entity.width/2, 0-entity.height/2, entity.width, entity.height);

                game.context.rotate(-entity.angle*Math.PI/180);
                game.context.translate(-(entity.x+entity.width/2), -(entity.y+entity.height/2));

                // Debug-viiva kursorille
                game.context.strokeStyle= 'rgb(0,0,255)';
                game.context.beginPath();
                game.context.moveTo(entity.x+entity.width/2,entity.y+entity.height/2);
                game.context.lineTo(keyhandler.cursorX,keyhandler.cursorY);
                game.context.closePath();
                game.context.stroke();
        }

    }
}

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

