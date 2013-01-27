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
		this.list[i].update();
	}
}

function Vampire(px,py) {
	var x = px || 0;
	var y = py || 0;
	this.position = new Vector(x,y);
    this.walkingSpeed = 1.3;
    
    this.lastAnimFrame = 0;
    this.angle = 0;

    this.width = 100;
    this.height = 100;
    
    this.walking = true;
}

Vampire.prototype.update = function(hero) {
	if(false) { // If hero is in line of sight or close or something...
		this.attack();
	}
	
	else {
		this.roam();
	}
}

Vampire.prototype.roam = function(hero) {
	
}

Vampire.prototype.attack = function(hero) {
	this.angle = this.position.angle(hero.position);
}

Vampire.prototype.changeFrame = function() {
    var max = 3;
    this.walking = (this.walking + 1) % max;
}