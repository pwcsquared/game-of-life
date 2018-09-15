'use strict';

const length = 100;
let previousBoardState = [];

const createGameBoard = function(dimension) {
    var board = [];
    for (let i = 0; i < dimension; i++) {
        board.push([]);
        for (var j = 0; j < dimension; j++) {
            board[i].push(Math.round(Math.random()));
        }
    }

    return board;
};

const wrapIndex = function(val) {
    if (val >= length) {
        return 0;
    } else if (val < 0) {
        return length - 1;
    } else {
        return val;
    }
};

const getNeighbors = function(col, row) {
    var neighbors = [];
    for (let i = col - 1; i <= col + 1; i++) {
        for (let j = row - 1; j <= row + 1; j++) {
            if (!(i === col && j === row)) {
                neighbors.push([i, j].map(wrapIndex));
            }
        }
    }

    return neighbors;
};

const getLifeCount = function(neighbors) {
    // neighbors are a pair of coordinates [col, row]
    return neighbors.reduce((acc, val) => acc + gameboard[val[0]][val[1]], 0);
};

const willLive = function(isAlive, lifeCount) {
    if (isAlive) {
        return (lifeCount === 2 || lifeCount === 3);
    }
    return (lifeCount === 3);
};

const updateGameboard = function() {
    previousBoardState = Array.from(gameboard);
    gameboard = gameboard.map(function(row, i) {
        return row.map(function(cell, j) {
            var neighbors = getNeighbors(i, j);
            var lifeCount = getLifeCount(neighbors);
            return Number(willLive(cell, lifeCount));
        });
    });
};

const canvasConfig = {
    fillColor: 'dodgerblue',
    size: 5,
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = canvasConfig.fillColor;

var writeout = function(boardState, {size}){
    boardState.forEach(function(item, index) {
        item.forEach(function(_cell, deeperIndex) {
            let xPos = index * size;
            let yPos = deeperIndex * size;
            if (boardState[index][deeperIndex] === 1) {
                ctx.fillRect(xPos, yPos, size, size);  // for live cells
            } else {
                ctx.clearRect(xPos, yPos, size, size); // for dead cells            
            }
        });
    });
};

let gameboard = createGameBoard(length);

function* updateGame () {
    while(true) {
        updateGameboard();
        yield writeout(gameboard, canvasConfig);
    }
}

let intervalID;

function play(shouldPlay) {    
    if (shouldPlay) {
        intervalID = window.setInterval(() => updateGame().next(), 1000);
    } else {
        window.clearInterval(intervalID);
    }
}
