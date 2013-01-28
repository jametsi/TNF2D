function SoundManager() {

    var self = this;

    this.menuTheme = loader.loadSound("snd/TNFI2D_theme");
    // Looppaus kuntoon selaimesta riipumatta
    this.menuTheme.addEventListener('ended', function() {
        game.soundManager.menuTheme.currentTime = 0;
        game.soundManager.menuTheme.play();
    }, false);


    this.ambient = loader.loadSound("audio/CaveAmbWav");
    this.ambient.volume = 0.4;
    // Looppaus kuntoon selaimesta riipumatta
    this.ambient.addEventListener('ended', function() {
        game.soundManager.ambient.currentTime = 0;
        game.soundManager.ambient.play();
    }, false);


    this.playerDead = loader.loadSound("audio/playerdead1");

    this.growls = [];
    for (var i = 1; i<5; i++) {
        this.growls.push(loader.loadSound("audio/vampirelurk"+i));
        this.growls[i-1].volume = 0.2;
    }
    this.lastGrowled = new Date();

    this.attacks = [];
    for (var i = 1; i<5; i++) {
        this.attacks.push(loader.loadSound("audio/vampireattack"+i));
        this.attacks[i-1].volume = 0.2;
    }
    this.lastAttacked = new Date();

    this.snares = [];
    for (var i = 1 ; i < 4 ; ++i) {
        this.snares.push(loader.loadSound("audio/vampireflashlight"+i));
    }
    this.lastSnared = new Date();

    this.bat = loader.loadSound("audio/BatsDemoWav");
    this.bat.volume = 0.7;
}
SoundManager.prototype.fadeOutMenuTheme = function() {
    //this.menuTheme.pause();

        var vol = 1,
            interval = 200; // 200ms interval

        var intervalID = setInterval(function() {

            if (vol > 0) {
                if (vol <= 0.05) {
                    vol = 0;
                } else { vol -= 0.05 }

                game.soundManager.menuTheme.volume = vol;
            } else {
                clearInterval(intervalID);
                game.soundManager.menuTheme.pause();
            }
        }, interval);

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
