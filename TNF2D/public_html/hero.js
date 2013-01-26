function Hero(startVector) {
    this.position = startVector;
    this.turnSpeed = 1;
    this.walkingSpeed = 1.3;
    this.width = 100;
    this.height = 100;
    this.angle = 0;
    this.sprite = loader.loadImage("img/herosheet.png");
    console.log(this.sprite);

}

Hero.prototype.update = function() {
    this.turn();
    if(keyhandler.up) {
        this.move();
    }
}

Hero.prototype.turn = function() {
    var dx = keyhandler.cursorX - game.canvas.width/2;
    var dy = keyhandler.cursorY - game.canvas.height/2;
    var newAngle = -(Math.atan2(dy, dx)*(180/Math.PI));


    this.angle = newAngle;
    /* Yritelmä korjata kääntyminen ... ei ihan onnistunut mutta jätetään tänne <3<3<3 LOVEE KAIKILLE ;)
    var temp_sin = Math.sqrt(dx*dx+dy*dy)/dy

    if(newAngle - this.angle > Math.PI) {
        if(temp_sin > 0) {
            this.turnRight();
        }
        else {
            this.turnLeft();
        }
    } else {
        if(temp_sin < 0) {
            this.turnRight();
        }
        else {
            this.turnLeft();
        }
    } */

    /*
    if(newAngle > this.angle % 360) {
        this.turnRight();
    }
    else if(newAngle < this.angle % 360) {
        this.turnLeft();
    }*/
    
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