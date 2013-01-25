/**
 * Created with JetBrains WebStorm.
 * User: jami
 * Date: 25.1.2013
 * Time: 22:52
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    game.init();
});

var game = {

    context: {},
    hero: {},

    init: function() {
        // TODO init game
        game.context = $('#gamecanvas')[0].getContext('2d');
    },
    start: function() {

    }
}

var entities = {
    create: function() {

    },
    draw: function(entity) {

    }
}