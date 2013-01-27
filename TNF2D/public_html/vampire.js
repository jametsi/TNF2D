// vampires.js

function VampireManager() {
	this.list = [];
	this.sprite = loader.loadImage("img/vampire_spritesheet_final_katseylos.png");

	this.spritewidth = 100;
    this.spriteheight = 100;

	this.width = 100;
    this.height = 100;

    this.movingToBlock = false;
}

VampireManager.prototype.update = function(hero) {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].update(hero);
	}
}

function Vampire(px,py) {
	var x = px || 0;
	var y = py || 0;
	this.position = new Vector(x,y);
    this.walkingSpeed = 0.9;
    this.direction = 'right';
    
    this.lastAnimFrame = 0;
    this.angle = 0;

    this.width = 100;
    this.height = 100;
    
    this.walking = true;

    this.animTick = 0; // max 20
}

Vampire.prototype.update = function(hero) {

    if(this.position.distance(hero.position) < 50*50) { // If hero is in line of sight or close or something...
        game.soundManager.playAttack();
    }
	else if(this.position.distance(hero.position) < 350*350) { // If hero is in line of sight or close or something...
        game.soundManager.playGrowl();
        this.attack(hero);
	}
	else {
		this.roam();
	}

	this.changeFrame();
}

Vampire.prototype.roam = function() {
	this.walkingSpeed = 0.3;

	var posvec = this.getTile();

	if(dungeon.map[posvec.x] != undefined) {
		var tile = dungeon.map[posvec.x][posvec.y];
	}
	

	if(tile === undefined) {
		return;
	}

	var qPi = Math.PI/2;

	if(this.movingToBlock == false) {
		if(tile.TOPWALL == false && dungeon.map[posvec.x][posvec.y-1] !== undefined) {
			this.direction = 'up';
			this.movingToBlock = true;
			this.angle = 90;
		} else if (tile.RIGHTWALL == false && dungeon.map[posvec.x-1] !== undefined && dungeon.map[posvec.x-1][posvec.y] !== undefined) {
			this.direction = 'right';
			this.movingToBlock = true;
			this.angle = 180;
		} else if (tile.BOTTOMWALL == false && dungeon.map[posvec.x][posvec.y+1] !== undefined) {
			this.direction = 'down';
			this.movingToBlock = true;
			this.angle = 270;
		} else if (tile.LEFTWALL == false && dungeon.map[posvec.x+1][posvec.y] !== undefined) {
			this.direction = 'left';
			this.movingToBlock = true;
			this.angle = 0;
		}
	} else {
		this.moveToBlock(this.direction);
	}
}

Vampire.prototype.moveToBlock = function() {

    var movement = this.disableMovement();

    if (movement[1]) {
        switch(this.direction) {
            case 'up':
                this.position.y -= this.walkingSpeed;
            break;

            case 'down':
                this.position.y += this.walkingSpeed;
            break;
        }
    }

    if (movement[0]) {
        switch(this.direction) {
            case 'right':
                this.position.x += this.walkingSpeed;
            break;

            case 'left':
                this.position.x -= this.walkingSpeed;
            break;
        }
    }

}
Vampire.prototype.disableMovement = function() {
    var x = Math.floor(this.position.x/400);
    var y = Math.floor(this.position.y/400);

    if (dungeon.map[x] == undefined || dungeon.map[x][y] == undefined) {
        return;
    }


    var positionX = Math.floor((this.position.x/400-(Math.floor(this.position.x/400)))*400);
    var positionY = Math.floor((this.position.y/400-(Math.floor(this.position.y/400)))*400);

    var xMovement = Math.sin(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;
    var yMovement = Math.cos(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;

    if (dungeon.map[x][y].LEFTWALL) {
        if (positionX+xMovement-5 <= 60 && positionX+xMovement+5 >= 0) {
            xMovement = 0;
        }
        if(positionY+yMovement-5 <= 0 && positionY+yMovement+5 >= 400) {
            yMovement = 0;
        }
    }
    if (dungeon.map[x][y].RIGHTWALL) {
        if (positionX+xMovement+5 >= 340 && positionX+xMovement-5 <= 400) {
            xMovement = 0;
        }
        if (positionX+xMovement+5 >= 340 && (positionY+yMovement+5 >= 0 && positionY+yMovement-5 <= 400)) {
            yMovement = 0;
        }
    }

    if (dungeon.map[x][y].TOPWALL) {
        if (positionY+yMovement-5 <= 60 && positionY+yMovement+5 >= 0) {
            yMovement = 0;
        }
        if (positionY+yMovement-5 <= 60 && (positionX+xMovement+5 >= 0 && positionX+xMovement-5 <= 400)) {
            xMovement = 0;
        }
    }
    if (dungeon.map[x][y].BOTTOMWALL) {
        if (positionY+yMovement+5 >= 340 && positionY+yMovement-5 <= 400) {
            yMovement = 0;
        }
        if (positionY+yMovement+5 >= 340 && (positionX+xMovement+5 >= 0 && positionX+xMovement-5 <= 400)) {
            xMovement = 0;
        }
    }

    if (xMovement == 0) {
        xMovement = false
    } else { xMovement = true }
    if (yMovement ==     0) {
        yMovement = false;
    } else { yMovement = false}

    return [xMovement, yMovement];
}

Vampire.prototype.move = function() {
    var movement = this.disableMovement();

    if (movement[0]) {
	    this.position.x += Math.sin(this.angle * (Math.PI / 180)) * this.walkingSpeed;
    }
    if (movement[1]) {
        this.position.y += Math.cos(this.angle * (Math.PI / 180)) * this.walkingSpeed;
    }
}

Vampire.prototype.getTile = function() {
    return new Vector(Math.floor(this.position.x/400),Math.floor(this.position.y/400))
}

Vampire.prototype.attack = function(hero) {
	this.walkingSpeed = 1.1;
	this.angle = this.position.angle(hero.position);
	this.move();
}

Vampire.prototype.changeFrame = function() {
	this.animTick = (this.animTick + 1) % 20;
	if(this.animTick == 0) {
		this.lastAnimFrame = (this.lastAnimFrame + 1) % 3;
	}   
}