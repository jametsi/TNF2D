function SoundManager() {

    var self = this;

    this.theme = loader.loadSound("audio/CaveAmbWav");
    this.theme.volume = 0.4;

    this.theme.loop = true;

    this.theme.play();

    this.playerDead = loader.loadSound("audio/playerdead1");

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

    this.snares = [];
    for (var i = 1 ; i < 4 ; ++i) {
        this.snares.push(loader.loadSound("audio/vampireflashlight"+i));
    }
    this.lastSnared = new Date();

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
SoundManager.prototype.playSnare = function() {
    if (new Date() - this.lastAttacked > 4000) {
        var snare = Math.floor(Math.random()*3);
        this.snares[snare].play();
        this.lastSnared = new Date();
    }
}
SoundManager.prototype.playBats = function() {
    this.bat.play();
}
