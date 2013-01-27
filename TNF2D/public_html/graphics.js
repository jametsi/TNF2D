function Painter(){
    this.camera = new Vector(Math.floor(game.canvas.width/2),Math.floor(game.canvas.height/2));
    //  console.log(this.camera);
    this.MIN = new Vector(0,0);
    this.MAX = new Vector(0,0);
    this.counter = 0;
    this.animcount = 20;
    this.flashLightImage = new Image();
    this.flashLightImage.src = 'img/valokeila_fixed.png';
    this.splatters = [];
    this.MAX_SPLATTER = 30;

    this.widthInTiles = (game.canvas.width/400)/2+1;
    this.heightInTiles = (game.canvas.height/400)/2+1;

    this.spotlight = new spotlight({
        steps: 1,
        size: 200,
        blurRadius: 80
    });
    this.firstrender = true;
    this.bats = [];
}

Painter.prototype.draw = function() {
    this.clearScreen();
    //  this.updateCameraPosition();
    this.updateDrawableLimits();
    this.drawDungeonTiles();
    this.drawHero();
    this.drawSplatters();
    this.drawVampires();
    if(this.firstrender) {
        this.addSetofBats();
        game.soundManager.playBats();
        this.firstrender = false;
    }
    this.drawFlashLight();
    this.drawBats();
    // this.drawTiles();
//    this.drawMiniMap();
}

Painter.prototype.drawFlashLight = function() {
    var clip_offset_x = game.hero.lastAnimFrame*game.hero.spritewidth;
    var translatepaskex = this.camera.x;
    var translatepaskey = this.camera.y;

    // Piirretään SpotLight
    this.spotlight.move(translatepaskex,translatepaskey);

    var height = this.flashLightImage.height;
    var width = this.flashLightImage.width;

    game.overlay.globalCompositeOperation = "lighter";
    //  game.overlay.globalAlpha = 0.5;
    game.overlay.translate(translatepaskex, translatepaskey);
    game.overlay.rotate(-game.hero.angle * Math.PI / 180 + Math.PI/2);
    game.overlay.drawImage(this.flashLightImage, -100, -220, width, height);
    game.overlay.rotate(game.hero.angle* Math.PI / 180 - Math.PI/2);
    game.overlay.translate(-(translatepaskex), -(translatepaskey));
    //   game.overlay.globalAlpha = 1.0;

}

Painter.prototype.updateDrawableLimits = function() {

    var half_x = game.canvas.width  / 2;
    var half_y = game.canvas.height / 2;
    this.MIN.x = Math.floor(game.hero.position.x - half_x);
    this.MAX.x = Math.ceil(game.hero.position.x + half_x);
    this.MIN.y = Math.floor(game.hero.position.y - half_y);
    this.MAX.y = Math.ceil(game.hero.position.x + half_y);

};

Painter.prototype.vectorWithinBounds = function(vector) {
    return this.xbounds(vector.x) && this.ybounds(vector.y)
};

Painter.prototype.tileWithinBounds = function(maptile) {
    var posvec = game.hero.getTile();

    var retx = false;
    var rety = false;

    if(posvec.x-this.widthInTiles < maptile.x && maptile.x < posvec.x+this.widthInTiles) {
        retx = true;
    }

    if(posvec.y-this.heightInTiles < maptile.y && maptile.y < posvec.y+this.heightInTiles) {
        rety = true;
    }

    return retx && rety;
}

Painter.prototype.updateCameraPosition = function() {
    updateDrawableLimit();

}

Painter.prototype.drawDungeonTiles = function() {
    for(var i = 0 ; i < dungeon.map.length ; ++i) {
        for(var j = 0 ; j< dungeon.map[0].length ; ++j) {
            var tile = dungeon.map[i][j];
            if(this.tileWithinBounds(tile)) {
                this.drawTile(tile);
            }
        }
    }
}

Painter.prototype.drawTile = function(tile) {
    var drawPos = tile.getPosition().subtract(this.MIN);
    game.context.drawImage(tile.floorimage, drawPos.x, drawPos.y, tile.sizex, tile.sizey);
    game.context.drawImage(tile.image, drawPos.x, drawPos.y, tile.sizex, tile.sizey);
}

Painter.prototype.clearScreen = function() {
    game.context.clearRect(0,0,game.canvas.width,game.canvas.height);
}

Painter.prototype.updateMinimumDrawAreas = function() {

    var half_x = game.canvas.width / 2;
    var half_y = game.canvas.height / 2;
    this.MIN.x = Math.floor(this.camera.x - half_x);
    this.MAX.x = Math.ceil(this.camera.x + half_x);
    this.MIN.y = Math.floor(this.camera.y - half_y);
    this.MAX.y = Math.ceil(this.camera.y + half_y);

}

Painter.prototype.drawHero = function() {

    var clip_offset_x = game.hero.lastAnimFrame*game.hero.spritewidth;
    var translatepaskex = this.camera.x;
    var translatepaskey = this.camera.y;

    game.context.translate(translatepaskex, translatepaskey);
    var turnangle = game.hero.angle * Math.PI / 180;
    var piHalf = + Math.PI/2
    game.context.rotate(-turnangle + piHalf);
    game.context.drawImage(game.hero.sprite, clip_offset_x, 0, 100, 100, -50, -50, game.hero.width, game.hero.height);
    game.context.rotate(turnangle - piHalf);
    game.context.translate(-(translatepaskex), -(translatepaskey));

    if(this.counter == this.animcount) {
        if(game.hero.walking) {
            game.hero.changeFrame();
        }
        this.counter = 1;
    } else {
        this.counter++;
    }

    // Debug-viiva kursorille
/*    game.context.strokeStyle= 'rgb(0,0,255)';
    game.context.beginPath();
    game.context.moveTo(this.camera.x,this.camera.y);
    game.context.lineTo(keyhandler.cursorX,keyhandler.cursorY);
    game.context.closePath();
    game.context.stroke();*/

    // DEBUG-ympyrätranslate-paskalle
    /*    game.context.beginPath();
     game.context.arc(translatepaskex,translatepaskey, 10, 2 * Math.PI, false);
     game.context.closePath();
     game.context.fillStyle = 'rgb(255,0,0)';
     game.context.fill();*/
}

Painter.prototype.drawVampires = function() {
    for(var vampire in game.vampires.list) {

        var distance = game.vampires.list[vampire].position.subtract(game.hero.position).length();
        if( distance <= 30){
            game.hero.takeDamage();
            this.addSplatter(game.vampires.list[vampire]);
        }
        //  if(this.vectorWithinBounds(game.vampires.list[vampire].position)) {
        this.drawVampire(game.vampires.list[vampire]);
        //  }
    }
}

Painter.prototype.addSplatter = function(vampire) {
    if (this.splatters.length < this.MAX_SPLATTER && this.counter <= this.animcount/4) {
        var objectpos = game.hero.position;
        var rnd_x = Math.random()*80-40;
        var rnd_y = Math.random()*80-40;
        this.splatters.push(new Splatter(objectpos.x+rnd_x, objectpos.y+rnd_y));
    }
}
Painter.prototype.drawSplatters = function() {
    for (var i in this.splatters) {
        var position = this.splatters[i].position.subtract(this.MIN);
        game.context.beginPath();
        game.context.arc(position.x, position.y, this.splatters[i].getSize(), 2 * Math.PI, false);
        game.context.closePath();
        game.context.fillStyle = this.splatters[i].getColor();
        game.context.fill();
        this.splatters[i].update();
    }

    while (this.splatters.length > 0 && !this.splatters[0].alive) {
        this.splatters.shift();
    }
}

Painter.prototype.addSetofBats = function() {

    for(var i = 0 ; i < 10 ; ++i) {
        var objectpos = game.hero.position;
        var rnd_x = Math.random()*100-50;
        var rnd_y = Math.random()*100-50;
        this.bats.push(new Bat(objectpos.x+rnd_x, objectpos.y+rnd_y));
    }
}

Painter.prototype.drawBats = function() {
    for (var i in this.bats) {
        var bat = this.bats[i];
        var drawPos = bat.position.subtract(this.MIN);
        var clip_offset_x = bat.lastAnimFrame * bat.spritewidth;
        var translatepaskex = drawPos.x;
        var translatepaskey = drawPos.y;
        var sizemod = bat.getSizeModifier();

        game.context.translate(translatepaskex, translatepaskey);
        game.context.rotate(-bat.angle * Math.PI / 180 + Math.PI/2);
        game.context.drawImage(bat.sprite, clip_offset_x, 0, 80, 50, -25, -25, 50*sizemod, 50*sizemod);
        game.context.rotate(bat.angle* Math.PI / 180 - Math.PI/2);
        game.context.translate(-(translatepaskex), -(translatepaskey));
        bat.update();

    }
    while (this.bats.length > 0 && !this.bats[0].alive) {
        this.bats.shift();
    }
}

Painter.prototype.drawVampire = function(vampire) {
    var clip_offset_x = vampire.lastAnimFrame*game.vampires.spritewidth;
    var drawPos = vampire.position.subtract(this.MIN);
    var translatepaskex = drawPos.x;
    var translatepaskey = drawPos.y;

    game.context.translate(translatepaskex, translatepaskey);
    var turnangle = vampire.angle * Math.PI / 180 + Math.PI;
    game.context.rotate(-turnangle);
    game.context.drawImage(game.vampires.sprite, clip_offset_x, 0, 100, 100, -50, -50, game.vampires.width, game.vampires.height);
    game.context.rotate(turnangle);
    game.context.translate(-(translatepaskex), -(translatepaskey));

    // if(this.counter == this.animcount) {
    //     vampire.changeFrame();
    //     this.counter = 1;
    // } else {
    //     this.counter++;
    // }

}

Painter.prototype.drawMiniMap = function() {
    var minimapXoffset = game.canvas.width/2-200;
    var minimapYoffset = game.canvas.height/2;

    game.overlay.fillStyle = "rgba(150, 255, 200, 0.2)";
    game.overlay.fillRect(minimapXoffset, minimapYoffset, 100, 100);

    game.overlay.fillStyle = "rgba(255, 50, 50, 0.5)";

    for(vampire in game.vampires.list) {
        game.overlay.fillRect(minimapXoffset+(game.vampires.list[vampire].position.x/400)*10-3, minimapYoffset+(game.vampires.list[vampire].position.y/400)*10-3, 6, 6);

    }

    game.overlay.fillStyle = "rgba(50, 50, 255, 0.5)";
    game.overlay.fillRect(minimapXoffset+(game.hero.position.x/400)*10-3, minimapYoffset+(game.hero.position.y/400)*10-3, 6, 6);



}