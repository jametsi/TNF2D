// vampires.js

function VampireManager() {
	this.list = [];
	this.sprite = loader.loadImage("img/vampire_spritesheet_final_katseylos.png");

	this.spritewidth = 100;
    this.spriteheight = 100;

	this.width = 100;
    this.height = 100;
	
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
    this.walkingSpeed = 1.3;
    
    this.lastAnimFrame = 0;
    this.angle = 10;

    this.width = 100;
    this.height = 100;
    
    this.walking = true;
}

Vampire.prototype.update = function(hero) {
	if(Math.sqrt(this.position.squaredLength(hero)) < 800) { // If hero is in line of sight or close or something...
		this.attack(hero);
	}
	
	else {
		this.attack(hero);
		//this.roam();
	}

	this.move();
}

Vampire.prototype.roam = function() {
	this.walkingSpeed = 0.3;

	var posvec = this.getTile();

	var tile = dungeon.map[posvec.x][posvec.y];

	if(tile === undefined) {
		return;
	}

	var qPi = Math.PI/2;

	if(tile.TOPWALL == false && dungeon.map[posvec.x][posvec.y-1] !== undefined) {
		this.angle = 90;
	} else if (tile.RIGHTWALL == false && dungeon.map[posvec.x-1] !== undefined && dungeon.map[posvec.x-1][posvec.y] !== undefined) {
		this.angle = 180;
	} else if (tile.BOTTOMWALL == false && dungeon.map[posvec.x][posvec.y+1] !== undefined) {
		this.angle = 270;
	} else if (tile.LEFTWALL == false && dungeon.map[posvec.x+1][posvec.y] !== undefined) {
		this.angle = 0;
	}
}

Vampire.prototype.move = function() {
	this.position.x += Math.sin(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;
    this.position.y += Math.cos(this.angle * (Math.PI / 180)+ Math.PI/2) * this.walkingSpeed;
}

Vampire.prototype.getTile = function() {
    return new Vector(Math.floor(this.position.x/400),Math.floor(this.position.y/400))
}

Vampire.prototype.attack = function(hero) {
	this.angle = this.position.angle(hero.position) - Math.PI;
}

Vampire.prototype.changeFrame = function() {
    var max = 3;
    this.walking = (this.walking + 1) % max;
}