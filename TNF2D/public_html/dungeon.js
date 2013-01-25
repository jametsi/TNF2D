var mapItems = {
    EMPTY: 0,
    WALL: 1,
    PLAYER: 2,
    VAMPIRE: 3,
    DECORATION: 4,
    ITEM: 5
}
function generateDungeon(xsize, ysize) {

    var visited = initVisitedArray(xsize, ysize);
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



