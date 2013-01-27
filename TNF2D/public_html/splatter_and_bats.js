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
    this.lifetime = 360;
    this.counter = 0;
    this.lastAnimFrame = 0;
    this.spritewidth = 50;
    this.size = 5 + Math.random()*10 ;
    this.alive = true;
    this.color = 'rgba(255,0,0,)';
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
    this.lifetime = 400;
    this.counter = 0;
    this.size; 50;
    this.alive = true;
}

Bat.prototype.update = function() {

    if(this.alive && this.counter < this.lifetime) {
        this.counter++;
    } else {
        this.alive = false;
    }
    if(this.alive) {
        if(this.counter > 0 && this.counter % 120 ) {
            this.lastAnimFrame++;
        }
    }
}