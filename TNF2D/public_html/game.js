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

    init: function() {
        // TODO init game
        game.context = $('#gamecanvas')[0].getContext('2d');

        // Näytetään päämenu
        $('.gamelayer').hide();
        $('#startscreen').show();
    },
    start: function() {

    }
}

var levels = {
   definitions: [{

   }]
}

var entities = {
    definitions: [{
        name: "blank",
        type: "blank",
        width:0,
        height:0
    }],
    create: function() {

    },
    draw: function(entity) {

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

