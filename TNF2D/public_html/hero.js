function Hero(startVector) {
    this.position = startVector;
    this.turnSpeed = 1;
    this.walkingSpeed = 1.3;
    this.width = 100;
    this.height = 100;
    this.lastAnimFrame = 0;
    this.angle = 0;
    this.sprite = loader.loadImage("img/hahmp_spritesheet_final.png");
    this.spritewidth = 100;
    this.spriteheight = 100;
    this.walking = false;
    console.log(this.sprite);

}

Hero.prototype.update = function() {
    this.turn();
    if(keyhandler.up) {
        this.walking = true;
        this.move();
    } else {
        this.walking = false;
    }
}

Hero.prototype.changeFrame = function() {
    var max = 3;
    if(this.walking) {
        this.lastAnimFrame++;
    }
    if(this.lastAnimFrame == max) {
        this.lastAnimFrame = 0;
    }

}

Hero.prototype.turn = function() {
    var dx = keyhandler.cursorX - game.canvas.width/2;
    var dy = keyhandler.cursorY - game.canvas.height/2;
    var newAngle = -(Math.atan2(dy, dx)*(180/Math.PI));

    if(newAngle > this.angle % 360) {
        this.turnRight();
    }
    else if(newAngle < this.angle % 360) {
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
    this.position.x += Math.sin(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;
    this.position.y += Math.cos(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;
}