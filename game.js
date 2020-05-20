function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

let grid;
let cols;
let rows;
let resolution = 20;

let wrapAround = true;

let started = false;

function setup() {
    var canvas = createCanvas(600, 400);
    canvas.parent('sketch-holder');
    background(0);
    cols = width / resolution;
    rows = height / resolution;

    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0;
        }
    }

    frameRate(18);
    //noLoop();
}

function draw() {

    putOnBoard();

    if (started) {
        nextFrame();
    }
}

function nextFrame() {
    next = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            next[i][j] = 0;
        }
    }

    // compute next based on grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {

            // count live neighbors
            let neighbors = countNeighbors(grid, i, j);

            // state = 1 means alive, state = 0 means dead.
            let state = grid[i][j];

            // -- Rules: (from wikipedia)
            if (state == 1) {
                // 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
                if (neighbors < 2) next[i][j] = 0;
                // 2. Any live cell with two or three live neighbours lives on to the next generation.
                if (neighbors == 2 || neighbors == 3) next[i][j] = 1;
                // 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
                if (neighbors > 3) next[i][j] = 0;
            } else {
                // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                if (neighbors == 3) next[i][j] = 1;
            }
        }
    }
    
    grid = [...next];
}

function putOnBoard() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;

            if (grid[i][j] == 1) {
                fill(255);
                stroke(0);
                rect(x, y, resolution-1, resolution-1);
            }

            else {
                if (started) {
                    // active color
                    fill(0);
                    stroke(0);
                }
                else {
                    // paused color
                    fill(82, 49, 45);
                    stroke(82, 49, 45);
                }
                rect(x, y, resolution-1, resolution-1);
            }
        }
    }
}

function countNeighbors(grid, x, y) {
    let sum = 0;

    if (!wrapAround) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (typeof grid[x+i] != 'undefined' && typeof grid[x+i][y+j] != 'undefined')
                    sum += grid[x+i][y+j];
            }
        }
    }

    else {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let a = (x + i + cols) % cols;
                let b = (y + j + rows) % rows;
                sum += grid[a][b];
            }
        }
    }
    sum -= grid[x][y]; // do not count self
    return sum;
}

function mousePressed() {
    if (!started) {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                pixelX = i * resolution;
                pixelY = j * resolution;
                if (mouseX > pixelX && mouseX <= pixelX + resolution){
                    if (mouseY > pixelY && mouseY <= pixelY + resolution) {
                        if (grid[i][j] == 1) grid[i][j] = 0;
                        else grid[i][j] = 1;
                    }
                }
            }
        }
    }
}

function keyPressed() {
    if (key == " ")
        started = !started;
    if (key == "r")
        randomize();
    if (key == "w")
        wrapAround = !wrapAround;
}

function randomize() {
    if (!started)
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j] = Math.round(Math.random());
            }
        }
}