function Hero(startVector) {
    this.position = startVector;
    this.turnSpeed = 1;
    this.walkingSpeed = 1.3;
    this.width = 100;
    this.height = 100;
    this.angle = 180;
    this.sprite = loader.loadImage("img/herosheet.png");
    console.log(this.sprite);

}

Hero.prototype.update = function() {
   this.turn();
  //  this.move();
}

Hero.prototype.turn = function() {
    var dx = game.painter.camera.x - keyhandler.cursorX;
    var dy = game.painter.camera.y - keyhandler.cursorY;
    var newAngle= Math.atan2(dy, dx)*(180/Math.PI);
    console.log(newAngle);

    if(newAngle > this.angle) {
        this.turnRight();
    }
    else if(newAngle < this.angle) {
        this.turnLeft();
    }
}

Hero.prototype.turnRight = function() {
    this.angle += this.turnSpeed;

}

Hero.prototype.turnLeft = function() {
    this.angle -= this.turnSpeed;
}


Hero.prototype.move = function() {
    this.position.x += Math.cos(this.angle * (Math.PI / 180)) * this.walkingSpeed;
    this.position.y += Math.sin(this.angle * (Math.PI / 180)) * this.walkingSpeed;
}