var mapItems = {
    EMPTY: 0,
    FLOOR: 1,
    WALL: 2,
    PLAYER: 3,
    VAMPIRE: 4,
    DECORATION: 5,
    ITEM: 6,
    START: 7,
    FINISH: 8
}
function generateDungeon(xsize, ysize) {
    var visited = initVisitedArray(xsize * 2, ysize * 2);
    var levelarray = generateLevelArray(xsize * 2, ysize * 2);
}

function initVisitedArray(xsize, ysize) {
    var visited;
    for (var j = 0; j < ysize; ++j) {
        for (var i = 0; i < xsize; ++i) {
            visited[i][j] = false;
        }
    }
    return visited;
}

function generateLevelArray(xsize, ysize) {
    var startx = 1;
    var starty = Math.floor(Math.random() * ysize);
    var finishx = xsize - 1;
    var finishy = Math.floor(Math.random() * ysize);

    var levelArray = new Array[xsize][ysize];

    levelArray[startx][starty] = mapItems[START];
    levelArray[endx][endy] = mapItems[FINISH];

    generateLevel(levelArray, startx, starty);
    
    return levelArray;
}

function generateLevel(levelArray, x, y) {

    if(levelArray[x][y] != mapItems[START] || levelArray[x][y] != mapItems[FINISH]) {
        levelArray[x][y] = mapItems[FLOOR];
    }
    var neighborghs = getUnivisitedNeighborghs(levelarray, x, y);
    while(neighborghs.length > 0) {
        var randomindex = Math.floor(Math.random() * neighborghs.length);
        var nextnode = neighborghs[randomindex];
        if(levelArray[nextnode.x, nextnode.y] != mapItems[FINISH]) {
            generateLevel(levelArray, nextnode.x, nextnode.y);
        }
    }
    
}

function getUnivisitedNeighborghs(levelarray, x, y) {
    var neighborghs = [];

    for (var i = -1; i < 2; ++i) {
        for (var j = -1; j < 2; ++j) {
            if (x - i <= 1 || y - j <= 1 || x + i >= levelarray[0].length-1 || y + j >= levelarray.length-1 || (i == 0 && j == 0)) {
                continue;
            }
            if (levelArray[i][j] === mapItems[EMPTY]) {
                neighborghs.push(new Vector(i, j));
            }
        }
    }
    return neighborghs;
}

function printArray(array) {
    var line = "";
    for (var j = 0; j < array.length; ++j) {
        for (var i = 0; i < array[0].length; i++) {
            line += array[i][j];
        }
        console.log(line);
        line = "";
    }
}

var levelArray = generateLevel(50, 50);

printArray(levelArray);



