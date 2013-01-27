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
	else if(this.position.distance(hero.position) < 600*600) { // If hero is in line of sight or close or something...
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
	switch(this.direction) {
		case 'up':
			this.position.y -= this.walkingSpeed;
		break;

		case 'right':
			this.position.x += this.walkingSpeed;
		break;

		case 'down':
			this.position.y += this.walkingSpeed;
		break;

		case 'left':
			this.position.x -= this.walkingSpeed;
		break;

		default:
		break;
	}
}

Vampire.prototype.move = function() {
	this.position.x += Math.sin(this.angle * (Math.PI / 180)) * this.walkingSpeed;
    this.position.y += Math.cos(this.angle * (Math.PI / 180)) * this.walkingSpeed;
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