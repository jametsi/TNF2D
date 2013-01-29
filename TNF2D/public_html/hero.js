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
    this.health = 100;
    //console.log(this.sprite);

}

Hero.prototype.update = function() {
    this.turn();
    if(keyhandler.up || keyhandler.down) {
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


    var flashLightX = Math.sin(this.angle * (Math.PI / 180)+ Math.PI/2) * 240;
    var flashLightY = Math.cos(this.angle * (Math.PI / 180)+ Math.PI/2) * 240;
    var flashLightX1 = Math.sin(this.angle * (Math.PI / 180)+ Math.PI/2) * 180;
    var flashLightY1 = Math.cos(this.angle * (Math.PI / 180)+ Math.PI/2) * 180;
    var flashLightX2 = Math.sin(this.angle * (Math.PI / 180)+ Math.PI/2) * 90;
    var flashLightY2 = Math.cos(this.angle * (Math.PI / 180)+ Math.PI/2) * 90;

    for(var i = 0 ; i < game.vampires.list.length ; ++i ) {
        var vampire = game.vampires.list[i]; {
            var flashlight = new Vector(this.position.x+flashLightX, this.position.y+flashLightY);
            var flashlight1 = new Vector(this.position.x+flashLightX1, this.position.y+flashLightY1);
            var flashlight2 = new Vector(this.position.x+flashLightX2, this.position.y+flashLightY2);
            if(vampire.position.subtract(flashlight).length() <= 50) {
                game.soundManager.playSnare();
                vampire.flashed = true;
            }
            else if(vampire.position.subtract(flashlight1).length() <= 80) {
                game.soundManager.playSnare();
                vampire.flashed = true;
            }
            else if(vampire.position.subtract(flashlight2).length() <= 50) {
                game.soundManager.playSnare();
                vampire.flashed = true;
            }
            else {
                vampire.flashed = false;
            }
        }
    }

}

Hero.prototype.takeDamage = function() {
    game.hero.health -= .2;
    if (game.hero.health < 0) {
        game.ended = "DEATH";
    }
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

    var position = new Vector(0,0);

    position.x = Math.floor((this.position.x/400-(Math.floor(this.position.x/400)))*400);
    position.y = Math.floor((this.position.y/400-(Math.floor(this.position.y/400)))*400);

    var movement = new Vector(0,0);
    movement.x = Math.sin(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;
    movement.y = Math.cos(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;

    if(keyhandler.down) {
        movement = movement.multiply(-0.5);
    }

    if(dungeon.map[x][y].type==mapItems["FINISH"]) {
        if(dungeon.map[x][y].isCharlieSheenBiWinning(this.position.add(movement))) {
            game.ended = "WIN";
        }
    }


    movement = dungeon.map[x][y].collisionCheck(this.position, movement);
    console.log("movement:", movement.x, " ", movement.y);
    this.position = this.position.add(movement);

}