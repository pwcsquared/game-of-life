'use strict';

const length = 300;
let previousBoardState = [];
let gameboard = createGameBoard(length);
let intervalID;
const canvasConfig = {
    fillColor: 'dodgerblue',
    size: 3,
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = canvasConfig.fillColor;
let neighbors = generateNeighbors();
console.log('neighbors', neighbors);

function createGameBoard(dimension) {
    var board = [];
    for (let i = 0; i < dimension; i++) {
        board.push([]);
        for (var j = 0; j < dimension; j++) {
            board[i].push(Math.round(Math.random()));
        }
    }

    return board;
};

function generateNeighbors() {
    return gameboard.map(function(row, i) {
        return row.map(function(_cell, j) {
            return getNeighbors(i,j);
        })
    })
};

function getNeighbors(col, row) {
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

function wrapIndex(val) {
    if (val >= length) {
        return 0;
    } else if (val < 0) {
        return length - 1;
    } else {
        return val;
    }
};

function getLifeCount(neighbors) {
    // neighbors are a pair of coordinates [col, row]
    return neighbors.reduce((acc, val) => acc + gameboard[val[0]][val[1]], 0);
};

function willLive(isAlive, lifeCount) {
    if (isAlive) {
        return (lifeCount === 2 || lifeCount === 3);
    }
    return (lifeCount === 3);
};

function updateGameboard() {
    previousBoardState = Array.from(gameboard);
    gameboard = gameboard.map(function(row, i) {
        return row.map(function(cell, j) {
            let lifeCount = getLifeCount(neighbors[i][j]);
            return Number(willLive(cell, lifeCount));
        });
    });
};

function writeout(boardState, {size}, isPrev){
    boardState.forEach(function(item, index) {
        item.forEach(function(_cell, deeperIndex) {
            let xPos = index * size;
            let yPos = deeperIndex * size;
            if (isPrev){
                if (boardState[index][deeperIndex] === 1) {
                    ctx.fillRect(xPos, yPos, size, size);  // for live cells
                } else {
                    ctx.clearRect(xPos, yPos, size, size); // for dead cells            
                }
            }
            else if (boardState[index][deeperIndex] !== previousBoardState[index][deeperIndex]){
                if (boardState[index][deeperIndex] === 1) {
                    ctx.fillRect(xPos, yPos, size, size);  // for live cells
                } else {
                    ctx.clearRect(xPos, yPos, size, size); // for dead cells            
                }
            }
            // ctx.strokeRect(xPos, yPos, size, size);
        });
    });
};

function updateGame () {
    updateGameboard();
    writeout(gameboard, canvasConfig, false);
};

function stepBackwards(){
    writeout(previousBoardState, canvasConfig, true);
    gameboard = previousBoardState;
}

function runGame(){
    updateGameboard();
    writeout(gameboard, canvasConfig);

    intervalID = window.requestAnimationFrame(runGame);
};

function play(doIt = false) {
    if (doIt) {
        runGame();
    } else {
        window.cancelAnimationFrame(intervalID);
    }
}
