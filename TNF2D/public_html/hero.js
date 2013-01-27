function Hero(startVector) {
    this.position = startVector;
    this.turnSpeed = 1;
    this.walkingSpeed = 1.3;
    this.width = 100;
    this.height = 100;
    this.lastAnimFrame = 0;
    this.angle = 0;
    this.sprite = loader.loadImage("img/hahmo_spritesheet_final_katseylos.png");
    this.spritewidth = 100;
    this.spriteheight = 100;
    this.walking = false;
    //console.log(this.sprite);

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

Hero.prototype.turn = function() {
    var dx = keyhandler.cursorX - game.canvas.width/2;
    var dy = keyhandler.cursorY - game.canvas.height/2;
    var newAngle = -(Math.atan2(dy, dx)*(180/Math.PI));
    //console.log(newAngle);
    /*
    if(newAngle > this.angle % 360) {
        this.turnRight();
    }
    else if(newAngle < this.angle % 360) {
        this.turnLeft();
    }*/
    this.angle = newAngle;
}

Hero.prototype.turnRight = function() {
    this.angle += this.turnSpeed;

}

Hero.prototype.turnLeft = function() {
    this.angle -= this.turnSpeed;
}

Hero.prototype.changeFrame = function() {
    this.lastAnimFrame = (this.lastAnimFrame + 1) % 3
}

Hero.prototype.getTile = function() {
    return new Vector(Math.floor(this.position.x/400),Math.floor(this.position.y/400))
}

Hero.prototype.move = function() {
    var x = Math.floor(this.position.x/400);
    var y = Math.floor(this.position.y/400);

    var positionX = Math.floor((this.position.x/400-(Math.floor(this.position.x/400)))*400);
    var positionY = Math.floor((this.position.y/400-(Math.floor(this.position.y/400)))*400);

    var xMovement = Math.sin(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;
    var yMovement = Math.cos(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;

    if (dungeon.map[x][y].LEFTWALL) {
        if (positionX+xMovement <= 60 && positionX+xMovement >= 0) {
            xMovement = 0;
        }
        if(positionY+yMovement <= 0 && positionY+yMovement >= 400) {
            yMovement = 0;
        }
    }
    if (dungeon.map[x][y].RIGHTWALL) {
        if (positionX+xMovement >= 340 && positionX+xMovement <= 400) {
            xMovement = 0;
        }
    }
    if (dungeon.map[x][y].TOPWALL) {
        if (positionY+yMovement <= 60 && positionY+yMovement >= 0) {
            yMovement = 0;
        }
    }
    if (dungeon.map[x][y].BOTTOMWALL) {
        if (positionY+yMovement >= 340 && positionY+yMovement <= 400) {
            yMovement = 0;
        }
    }

    if(dungeon.map[x][y].BOTTOMWALL  && dungeon.map[x][y].RIGHTWALL) {
        if((positionX+xMovement >= 0 && positionX+xMovement <= 60) && (positionY+yMovement >= 0 && positionY+yMovement <= 60)) {
            xMovement = 0;
            yMovement = 0;
        }
    }

    if(dungeon.map[x][y].BOTTOMWALL  && dungeon.map[x][y].LEFTWALL) {
        if((positionX+xMovement >= 340 && positionX+xMovement <= 400) && (positionY+yMovement >= 0 && positionY+yMovement <= 60)) {
            xMovement = 0;
            yMovement = 0;
        }
    }

    if(dungeon.map[x][y].TOPWALL  && dungeon.map[x][y].LEFTWALL) {
        if((positionX+xMovement >= 340 && positionX+xMovement <= 400) && (positionY+yMovement >= 340 && positionY+yMovement <= 400)) {
            xMovement = 0;
            yMovement = 0;
        }
    }

    if(dungeon.map[x][y].TOPWALL  && dungeon.map[x][y].RIGHTWALL) {
        if((positionX+xMovement >= 0 && positionX+xMovement <= 60) && (positionY+yMovement >= 340 && positionY+yMovement <= 400)) {
            xMovement = 0;
            yMovement = 0;
        }
    }


    this.position.x += xMovement;
    this.position.y += yMovement;
}