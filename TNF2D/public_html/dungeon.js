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
        }
        else if(this.TOPWALL == false && this.BOTTOMWALL== false && this.RIGHTWALL && this.LEFTWALL) {
            this.image = mapItemImages["LEFT_RIGHT"];
        }
        else if(this.TOPWALL == false && this.BOTTOMWALL && this.RIGHTWALL && this.LEFTWALL ) {
            this.image = mapItemImages["LEFT_BOTTOM_RIGHT"];
        }
        else if(this.TOPWALL && this.BOTTOMWALL == false&& this.RIGHTWALL && this.LEFTWALL ) {
            this.image = mapItemImages["TOP_LEFT_RIGHT"];
        }
        else if(this.TOPWALL && this.BOTTOMWALL  && this.RIGHTWALL && this.LEFTWALL== false ) {
            this.image = mapItemImages["TOP_RIGHT_BOTTOM"];
        }
        else if(this.TOPWALL && this.BOTTOMWALL  && this.RIGHTWALL == false && this.LEFTWALL ) {
            this.image = mapItemImages["TOP_LEFT_BOTTOM"];
        }
        else {
            this.image =mapItemImages["EMPTY"];
        }
    }


    this.draw = function(drawx, drawy) {
        game.context.drawImage(this.image, drawx, drawy, 200, 200);
    },

    this.getPosition = function() {
        return new Vector(this.x*this.sizex, this.y*this.sizey);
    }

}

var mapItemImageUrls = {
    "TOP"               : "img/wall_top.png",
    "BOTTOM"            : "img/wall_bottom.png",
    "TOP_BOTTOM"        : 'img/wall_top_bottom.png',
    "LEFT"              : 'img/wall_left.png',
    "RIGHT"             : 'img/wall_right.png',
    "LEFT_RIGHT"        : 'img/wall_left_right.png',
    "LEFT_BOTTOM_RIGHT" : 'img/wall_left_bottom_right.png',
    "TOP_LEFT_RIGHT"    : 'img/wall_top_left_right.png',
    "TOP_RIGHT_BOTTOM"  : 'img/wall_top_right_bottom.png',
    "TOP_LEFT_BOTTOM"   : 'img/wall_top_left_bottom.png',
    "EMPTY"             : 'img/wall_fail.png'

}

var mapItemImages = {}

var dungeon = {

    map: {},
    totalcells: {},
    initialvisits: 0,
    startPosition: {},


    generateLevel: function (xsize, ysize) {
        var startx = 0;
        var starty =  Math.floor(Math.random() * ysize - 1);
        var finishx = xsize - 1;
        var finishy = Math.floor(Math.random() * ysize - 1);



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
        console.log("current: " + x + " y " + y);
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
                else {
                    line += '*';
                }
            }
            console.log(line);
            line = "";
        }
    }
}



