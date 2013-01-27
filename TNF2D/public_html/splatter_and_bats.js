/**
 * Created with JetBrains WebStorm.
 * User: Ville Heikkinen
 * Date: 1/27/13
 * Time: 5:27 AM
 * To change this template use File | Settings | File Templates.
 */

function Splatter(x, y) {
    this.x = x;
    this.y = y;
    this.position = new Vector(x,y);
    this.lifetime = 720;
    this.counter = 0;
    this.lastAnimFrame = 0;
    this.spritewidth = 50;
    this.alive = true;
    this.size = 5+  Math.random() * 10;
    this.color = 'rgba(255,0,0,';
}

Splatter.prototype.update = function() {
    if(this.alive) {
        this.counter++;
    }
    if(this.counter >= this.lifetime) {
        this.alive = false;
    }
}

Splatter.prototype.getColor = function() {
    var alphavalue = 1.0 - Math.round((this.counter / this.lifetime)*10)/10;
    return this.color + "" + alphavalue + ")";
}

Splatter.prototype.getSize = function() {
    return this.size *( 1.0 + Math.round((this.counter / this.lifetime)*10)/10);
}

function Bat(x, y) {
    this.x = x;
    this.y = y;
    this.position = new Vector(x,y);
    this.lifetime = 1200;
    this.animcounter = 0;
    this.counter = 0;
    this.size = 50;
    this.alive = true;
    this.sprite = loader.loadImage("img/lepakko_ph.png");
    this.spritewidth = 80;
    this.spriteheight = 50;
    this.lastAnimFrame = 0;
    this.angle = Math.random() * 360 - 180;
}

Bat.prototype.update = function() {

    if(this.alive && this.counter < this.lifetime) {
        this.counter++;
    } else {
        this.alive = false;
        console.log("dead");
    }
    if(this.alive) {
        if(this.animcounter > 0 && this.counter % 240 ) {
            this.lastAnimFrame++;

            if(this.lastAnimFrame == 3) {
                this.lastAnimFrame = 0;
            }
        }
        this.angle += Math.random()*15 -7.5;
        this.position.x += Math.cos(this.angle * (Math.PI / 180)) * (Math.random()*2);
        this.position.y += Math.sin(this.angle * (Math.PI / 180)) * (Math.random()*2);


    }
}

Bat.prototype.getSizeModifier = function() {
    return ( 1.0 + Math.round((this.counter / this.lifetime)*10)/10);
}