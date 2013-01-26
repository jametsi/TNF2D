function Painter(){
    this.camera = new Vector(Math.floor(game.canvas.width/2),Math.floor(game.canvas.height/2));
    console.log(this.camera);
    this.MIN = new Vector(0,0);
    this.MAX = new Vector(0,0);
}

Painter.prototype.draw = function() {
    this.clearScreen();
    //  this.updateCameraPosition();
    this.updateDrawableLimits();

    this.drawDungeonTiles();
    this.drawHero();
    // this.drawTiles();
}

Painter.prototype.updateDrawableLimits = function() {

    var half_x = game.canvas.width  / 2;
    var half_y = game.canvas.width / 2;
    this.MIN.x = Math.floor(game.hero.position.x - half_x);
    this.MAX.x = Math.ceil(game.hero.position.x + half_x);
    this.MIN.y = Math.floor(game.hero.position.y - half_y);
    this.MAX.y = Math.ceil(game.hero.position.x + half_y);

};

Painter.prototype.vectorWithinBounds = function(vector) {
    return this.xbounds(vector.x) && this.ybounds(vector.y)
};

Painter.prototype.xbounds = function(x, modifier) {
    if (typeof modifier === 'undefined') {
        modifier = 1;
        if (x >= this.MIN.x && x <= this.MAX.x) {
            return true;
        }
        return false;
    }
    if (x >= this.MIN.x + (1 / modifier) * this.MIN.y && x <= this.MAX.x * modifier) {
        return true;
    }
};

Painter.prototype.ybounds = function(y, modifier) {
    if (typeof modifier === 'undefined') {
        if (y >= this.MIN.y && y <= this.MAX.y) {
            return true;
        }
        return false;
    }
    if (y >= this.MIN.y + (1 / modifier) * this.MIN.y && y <= this.MAX.y * modifier) {
        return true;
    }
    return false;
};

Painter.prototype.tileWithinBounds = function(maptile) {
    var x = false, y = false;
    var position = new Vector(maptile.x + maptile.sizex/2, maptile.y + maptile.sizey/2)
    if (this.vectorWithinBounds(position)) {
        x = true;
        y = true;
    }
    else if (this.xbounds(position.x - maptile.sizex) || this.xbounds(position.x )) {
        x = true;
    }
    if (x && (this.ybounds(position.y - maptile.sizey) || this.xbounds(position.y))) {
        y = true;
    }
    return x && y;
};

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

    var translatepaskex = this.camera.x;
    var translatepaskey = this.camera.y;

    game.context.translate(translatepaskex, translatepaskey);
    game.context.rotate(game.hero.angle * Math.PI / 180);
    game.context.drawImage(game.hero.sprite, 0, 0, 100, 100, -50, -50, game.hero.width, game.hero.height);
    game.context.rotate(-game.hero.angle* Math.PI / 180);
    game.context.translate(-(translatepaskex), -(translatepaskey));

    // Debug-viiva kursorille
    game.context.strokeStyle= 'rgb(0,0,255)';
    game.context.beginPath();
    game.context.moveTo(this.camera.x,this.camera.y);
    game.context.lineTo(keyhandler.cursorX,keyhandler.cursorY);
    game.context.closePath();
    game.context.stroke();

    game.context.beginPath();
    game.context.arc(translatepaskex,translatepaskey, 10, 2 * Math.PI, false);
    game.context.closePath();
    game.context.fillStyle = 'rgb(255,0,0)';
    game.context.fill();
}
