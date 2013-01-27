function SoundManager() {

    var self = this;

    this.theme = loader.loadSound("audio/CaveAmbWav");
    this.theme.volume = 0.4;

    this.theme.loop = true;

    this.theme.play();

    this.growls = [];
    for (var i = 1; i<5; i++) {
        this.growls.push(loader.loadSound("audio/vampirelurk"+i));
        this.growls[i-1].volume = 0.5;
    }
    this.lastGrowled = new Date();

    this.attacks = [];
    for (var i = 1; i<5; i++) {
        this.attacks.push(loader.loadSound("audio/vampireattack"+i));
        this.attacks[i-1].volume = 0.5;
    }
    this.lastAttacked = new Date();

    this.bat = loader.loadSound("audio/BatsDemoWav");
    this.bat.volume = 0.1;
}
SoundManager.prototype.playGrowl = function() {
    if (new Date() - this.lastGrowled > 4000) {
        var growl = Math.floor(Math.random()*4);
        this.growls[growl].play();
        this.lastGrowled = new Date();
    }
}
SoundManager.prototype.playAttack = function() {
    if (new Date() - this.lastAttacked > 4000) {
        var attack = Math.floor(Math.random()*4);
        this.attacks[attack].play();
        this.lastAttacked = new Date();
    }
}
SoundManager.prototype.playBats = function() {
    this.bat.play();
}
