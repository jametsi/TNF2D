function Painter(){
    this.camera = new Vector(Math.floor(game.canvas.width/2),Math.floor(game.canvas.height/2));
    console.log(this.camera);
    this.MIN = new Vector(0,0);
    this.MAX = new Vector(0,0);
}

Painter.prototype.draw = function() {
    this.clearScreen();
  //  this.updateCameraPosition();
  //  this.updateMinimumDrawAreas();

    this.drawDungeonTiles();
    this.drawHero();
   // this.drawTiles();
}

Painter.prototype.updateCameraPosition = function() {

}

Painter.prototype

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
    game.context.fillStyle = 'rgb(255,0,0)';;
    game.context.fill();
}
