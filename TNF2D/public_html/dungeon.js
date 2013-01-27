var mapItems = {
    "EMPTY": 0,
    "FLOOR": 1,
    "WALL": 2,
    "PLAYER": 3,
    "VAMPIRE": 4,
    "DECORATION": 5,
    "ITEM": 6,
    "START": 7,
    "FINISH": 8,
    "WHITE": 9
}

var AMOUNT_OF_VAMPIRES = 0.05;

mapTile = function(type, x, y)  {
    this.TOPWALL = true;
    this.BOTTOMWALL = true;
    this.RIGHTWALL = true;
    this.LEFTWALL = true;
    this.type = type;
    this.x = x;
    this.y = y;
    this.sizex = 400;
    this.sizey = 400;
    this.image;
    this.floorimage;

    this.determineImage = function() {
        if(this.TOPWALL && this.BOTTOMWALL == false && this.RIGHTWALL == false && this.LEFTWALL == false) {
            this.image = mapItemImages["TOP"];
        }
        else if(this.TOPWALL == false && this.BOTTOMWALL && this.RIGHTWALL == false && this.LEFTWALL == false) {
            this.image = mapItemImages["BOTTOM"];
        }
        else if(this.TOPWALL && this.BOTTOMWALL && this.RIGHTWALL == false && this.LEFTWALL == false) {
            this.image = mapItemImages["TOP_BOTTOM"];
        }
        else if(this.TOPWALL == false && this.BOTTOMWALL == false&& this.RIGHTWALL == false && this.LEFTWALL) {
            this.image = mapItemImages["LEFT"];
        }
        else if(this.TOPWALL == false && this.BOTTOMWALL== false && this.RIGHTWALL && this.LEFTWALL == false) {
            this.image = mapItemImages["RIGHT"];
            if(this.type== mapItems["FINISH"]) {
                this.image = mapItemImages["RIGHT_OUT"];
            }
        }
        else if(this.TOPWALL == false && this.BOTTOMWALL== false && this.RIGHTWALL && this.LEFTWALL) {
            this.image = mapItemImages["LEFT_RIGHT"];
            if(this.type== mapItems["FINISH"]) {
                console.log("exit is there");
                this.image = mapItemImages["LEFT_RIGHT_OUT"];
            }
        }
        else if(this.TOPWALL == false && this.BOTTOMWALL && this.RIGHTWALL && this.LEFTWALL ) {
            this.image = mapItemImages["LEFT_BOTTOM_RIGHT"];
            if(this.type== mapItems["FINISH"]) {
                console.log("exit is there");
                this.image = mapItemImages["LEFT_BOTTOM_RIGHT_OUT"];
            }
        }
        else if(this.TOPWALL && this.BOTTOMWALL == false&& this.RIGHTWALL && this.LEFTWALL ) {
            this.image = mapItemImages["TOP_LEFT_RIGHT"];
            if(this.type== mapItems["FINISH"]) {
                console.log("exit is there");
                this.image = mapItemImages["TOP_LEFT_RIGHT_OUT"];
            }
        }
        else if(this.TOPWALL && this.BOTTOMWALL  && this.RIGHTWALL && this.LEFTWALL== false ) {
            this.image = mapItemImages["TOP_RIGHT_BOTTOM"];
            if(this.type== mapItems["FINISH"]) {
                console.log("exit is there");
                this.image = mapItemImages["TOP_RIGHT_BOTTOM_OUT"];
            }
        }
        else if(this.TOPWALL && this.BOTTOMWALL  && this.RIGHTWALL == false && this.LEFTWALL ) {
            this.image = mapItemImages["TOP_LEFT_BOTTOM"];
        }
        else if(this.TOPWALL == false && this.BOTTOMWALL  && this.RIGHTWALL&& this.LEFTWALL == false  ) {
            this.image = mapItemImages["RIGHT_BOTTOM"];
            if(this.type== mapItems["FINISH"]) {
                console.log("exit is there");
                this.image = mapItemImages["RIGHT_BOTTOM_OUT"];
            }
        }
        else if(this.TOPWALL  && this.BOTTOMWALL== false  && this.RIGHTWALL && this.LEFTWALL == false  ) {
            this.image = mapItemImages["TOP_RIGHT"];
            if(this.type== mapItems["FINISH"]) {
                console.log("exit is there");
                this.image = mapItemImages["TOP_RIGHT_OUT"];
            }
        }
        else if(this.TOPWALL  == false  && this.BOTTOMWALL  && this.RIGHTWALL == false && this.LEFTWALL ) {
            this.image = mapItemImages["LEFT_BOTTOM"];
        }
        else if(this.TOPWALL && this.BOTTOMWALL  == false   && this.RIGHTWALL == false && this.LEFTWALL ) {
            this.image = mapItemImages["TOP_LEFT"];
        }
        else {
            this.image =mapItemImages["EMPTY"];
        }
        if(Math.random() > 0.5) {
            this.floorimage = mapItemImages["FLOOR1"];
        }
        else {
            this.floorimage = mapItemImages["FLOOR2"];
        }
    }


    this.draw = function(drawx, drawy) {
        game.context.drawImage(this.image, drawx, drawy, 200, 200);
    },

        this.collidesHorizontal = function(positionX, positionY) {
            if (this.LEFTWALL) {
                if (positionX+xMovement <= 60 && positionX+xMovement >= 0) {
                    xMovement = 0;
                }
                if(positionX+xMovement <= 60 && (positionY+yMovement >= 0 && positionY+yMovement <= 400)) {
                    yMovement = 0;
                }
            }
            if (this.RIGHTWALL) {
                if (positionX+xMovement >= 340 && positionX+xMovement <= 400) {
                    xMovement = 0;
                }
                if (positionX+xMovement >= 340 && (positionY+yMovement >= 0 && positionY+yMovement <= 400)) {
                    yMovement = 0;
                }
            }

            if (this.TOPWALL) {
                if (positionY+yMovement <= 60 && positionY+yMovement >= 0) {
                    yMovement = 0;
                }
                if (positionY+yMovement <= 60 && (positionX+xMovement >= 0 && positionX+xMovement <= 400)) {
                    xMovement = 0;
                }
            }
            if (this.BOTTOMWALL) {
                if (positionY+yMovement >= 340 && positionY+yMovement <= 400) {
                    yMovement = 0;
                }
                if (positionY+yMovement >= 340 && (positionX+xMovement >= 0 && positionX+xMovement <= 400)) {
                    xMovement = 0;
                }
            }
        }

    this.getPosition = function() {
        return new Vector(this.x*this.sizex, this.y*this.sizey);
    }

}

var mapItemImageUrls = {
    "TOP"                   : "img/seina_yla.png",
    "BOTTOM"                : "img/seina_ala.png",
    "TOP_BOTTOM"            : 'img/seina_alayla.png',
    "LEFT"                  : 'img/seina_vasen.png',
    "RIGHT"                 : 'img/seina_oikea.png',
    "RIGHT_OUT"             : 'img/seinat_ulos_oikea.png',
    "LEFT_RIGHT"            : 'img/seina_vasenoikea.png',
    "LEFT_RIGHT_OUT"        : 'img/seinat_ulos_oikeavasen.png',
    "LEFT_BOTTOM_RIGHT"     : 'img/seina_vasenalaoikea.png',
    "LEFT_BOTTOM_RIGHT_OUT" : 'img/seinat_ulos_oikeavasenala.png',
    "TOP_LEFT_RIGHT"        : 'img/seina_vasenylaoikea.png',
    "TOP_LEFT_RIGHT_OUT"    : 'img/seinat_ulos_oikeavasenyla.png',
    "TOP_RIGHT_BOTTOM"      : 'img/seina_oikeaalayla.png',
    "TOP_RIGHT_BOTTOM_OUT"  : 'img/seinat_ulos_oikeaylaala.png',
    "TOP_LEFT_BOTTOM"       : 'img/seina_vasenalayla.png',
    "RIGHT_BOTTOM"          : 'img/seina_oikeaala.png',
    "RIGHT_BOTTOM_OUT"      : 'img/seinat_ulos_oikeaala.png',
    "TOP_RIGHT"             : 'img/seina_oikeayla.png',
    "TOP_RIGHT_OUT"         : 'img/seinat_ulos_oikeayla.png',
    "LEFT_BOTTOM"           : 'img/seina_vasenala.png',
    "TOP_LEFT"              : 'img/seina_vasenyla.png',
    "FLOOR1"                : 'img/floortile1_tummennettu.png',
    "FLOOR2"                : 'img/floortile1_tummennettu.png',
    "EMPTY"                 : 'img/floortile2.png'

}

var mapItemImages = {}

var dungeon = {

    map: {},
    totalcells: {},
    initialvisits: 0,
    startPosition: {},


    generateLevel: function (xsize, ysize) {
        var startx = 0;
        var starty =  Math.floor(Math.random() * ysize);
        var finishx = xsize - 1;
        var finishy = Math.floor(Math.random() * ysize);



        dungeon.map = dungeon.initArray(xsize, ysize);
        dungeon.totalcells = xsize*ysize;

        dungeon.map[startx][starty]= new mapTile(mapItems["START"], startx, starty);
        dungeon.map[finishx][finishy] = new mapTile(mapItems["FINISH"], finishx, finishy);
        var tilesize = dungeon.map[startx][starty].sizex;

        dungeon.startPosition = new Vector(startx*tilesize+(tilesize/2), starty*tilesize+(tilesize/2));
        dungeon.printArray(dungeon.map);
        dungeon.generateMazePaths(startx, starty);
    },

    initArray: function (xsize, ysize) {
        var levelArray = new Array(xsize);
        for (var i = 0; i < levelArray.length; ++i) {
            levelArray[i] = new Array(ysize);
            for (var j = 0; j < levelArray[i].length; ++j) {
                levelArray[i][j] = new mapTile(mapItems["EMPTY"], i, j);
            }
        }
        return levelArray;
    },

    generateMazePaths: function(x, y) {
        var current = dungeon.map[x][y];
     //   console.log("current: " + x + " y " + y);
        var stack = [];
        dungeon.initialvisits = 1;

        while(dungeon.initialvisits < dungeon.totalcells) {
            var neighs = dungeon.findNeigh(current.x, current.y);
            //   alert("neighs: " + neighs.length +  "current: " +  current.x, " , " + current.y);
            if(neighs.length > 0) {
                var randomindex = Math.floor(Math.random()*neighs.length);
                var next_coords = neighs[randomindex];
                var nextnode = dungeon.map[next_coords.x][next_coords.y];
                dungeon.removeWall(current, nextnode);
                stack.push(current);
                current = nextnode;
                if(current.type != mapItems["FINISH"] && current.type != mapItems["START"]) {
                    current.type = mapItems["FLOOR"];
                    if(Math.random() < AMOUNT_OF_VAMPIRES) {
                        if(!((current.LEFTWALL && current.RIGHTWALL) && (current.TOPWALL && current.BOTTOMWALL))) {
                            current.type = mapItems["VAMPIRE"];
                            console.log("Added vampire!");
                            game.vampires.list.push(new Vampire(current.x * 400 +200, current.y*400 +200));
                        }
                    }
                }
                dungeon.initialvisits++;

            }
            else if (stack.length > 0) {
                current = stack.pop();
            }
        }
    },

    initImages: function() {
        for(var imagename in mapItemImageUrls) {
            mapItemImages[imagename] = loader.loadImage(mapItemImageUrls[imagename]);
            console.log(mapItemImages[imagename]);
        }
        for(var i = 0 ; i < dungeon.map[0].length; ++i) {
            for(var j = 0 ; j < dungeon.map.length; ++j) {
                dungeon.map[i][j].determineImage();
            }
        }
    },

    removeWall: function(cell, other) {
        if(cell.x - other.x == -1) {
            cell.RIGHTWALL = false;
            other.LEFTWALL = false;
        }
        if(cell.x - other.x == 1) {
            cell.LEFTWALL = false;
            other.RIGHTWALL = false;
        }
        else if(cell.y - other.y == -1) {
            cell.BOTTOMWALL = false;
            other.TOPWALL = false;
        }
        else if(cell.y - other.y == 1) {
            cell.TOPWALL = false;
            other.BOTTOMWALL = false;
        }

    },

    findNeigh: function(x, y) {
        var neighs = [];
        //    console.log("current x and y finding: ", x, " y: ", y);
        if(dungeon.withinBoundaries(x-1, y) && (dungeon.map[x-1][y].type == mapItems["EMPTY"] || dungeon.map[x-1][y].type == mapItems["FINISH"])) {
            neighs.push(new Vector(x-1, y));
        }
        if(dungeon.withinBoundaries(x+1, y) && (dungeon.map[x+1][y].type == mapItems["EMPTY"] || dungeon.map[x+1][y].type == mapItems["FINISH"])) {
            neighs.push(new Vector(x+1, y));
        }
        if(dungeon.withinBoundaries(x, y-1) && (dungeon.map[x][y-1].type == mapItems["EMPTY"] || dungeon.map[x][y-1].type == mapItems["FINISH"])){
            neighs.push(new Vector(x, y-1));
        }
        if(dungeon.withinBoundaries(x, y+1) && (dungeon.map[x][y+1].type == mapItems["EMPTY"] || dungeon.map[x][y+1].type == mapItems["FINISH"])) {
            neighs.push(new Vector(x, y+1));
        }
        //   console.log("")
        //   console.log("found " + neighs.length);
        return neighs;
    },

    withinBoundaries: function(x, y) {
        if(x < 0 || x > dungeon.map[0].length-1) {
            return false;
        }
        if(y < 0 || y > dungeon.map[0].length-1) {
            return false;
        }
        //    console.log("within");
        return true;
    },

    draw: function() {
        for(var i = 0 ; i < dungeon.map.length ; ++i) {
            for(var j = 0 ; j < dungeon.map[0].length; ++j) {
                var current = dungeon.map[i][j];
                var drawx = current.x * current.sizex - game.camera.x;
                var drawy = current.y * current.sizey - game.camera.y;
                if(dungeon.withinDrawBoundaries(drawx, drawy)) {
                    current.draw(drawx, drawy);
                }
            }
        }
    },

    withinDrawBoundaries: function(x, y) {

        return (xbounds(x) && ybounds(y))

        function xbounds(x) {
            return (x >= game.DRAW_MIN.x && x<= game.DRAW_MAX.x);
        }

        function ybounds(y) {
            return (y >= game.DRAW_MIN.y && x<= game.DRAW_MAX.y);
        }
    },
    printArray: function () {
        var line = "";
        for (var j = 0; j < dungeon.map.length; ++j) {
            for (var i = 0; i < dungeon.map[0].length; i++) {
                if(dungeon.map[i][j].type == mapItems["EMPTY"]) {
                    line += '.';
                }else if(dungeon.map[i][j].type == mapItems["FLOOR"]) {
                    line += '-';
                }
                else if(dungeon.map[i][j].type == mapItems["VAMPIRE"]) {
                    line += 'v';
                }
                else {
                    line += '*';
                }
            }
            console.log(line);
            line = "";
        }
    }
}



