import './styles.scss';
import tetrominoes from './tetrominoes';
import Sound from "./audio";

// TODO: Implement/improve UI
// TODO: Implement level ring css
// TODO: Implement drop location hint and space bar for instant drop down

const game = document.getElementById("game");
const gamePoints = document.getElementById("point-value");
const gameLevel = document.getElementById("level-value");
const gameXpNext = document.getElementById("xp-to-next");

const numberOfRows = 20;
const numberOfColumns = 10;
const clearPoints = [0, 40, 100, 300, 1200];

const moveSound = new Sound("./assets/pop.wav");
const clearSound = new Sound("./assets/line-clear.wav");

const bgm = new Sound("./assets/tetris-bgm.wav");
bgm.self.loop = true;

const cells = new Array<HTMLElement[]>(numberOfRows);
let currentBlock: Tetromino;
let points = 0;
let level = 0, xp = 0;
let gravityInterval = 1000;

class Tetromino {
    position: Array<[number, number]>;
    color: string;

    constructor(worldRowPos: number, worldColPos: number) {
        const type = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
        this.color = type.color;
        this.position = [];

        // Translate from local space to world space
        for (let row = 0; row < type.shape.length; row++) 
            for (let col = 0; col < type.shape[row].length; col++)
                if (type.shape[row][col] == 1) {
                    this.position.push([worldColPos + col, worldRowPos + row]);
                }
        
        // Render
        this.render();
    }

    move(action: "down" | "left" | "right" | "rotateLeft" | "rotateRight") {
        let targetPosition: Array<[number, number]>;
        switch (action) {
            case "down":
                targetPosition = this.position.map(([x, y]) => [x, y + 1]);
                break;

            case "left":
                targetPosition = this.position.map(([x, y]) => [x - 1, y]);
                break;

            case "right":
                targetPosition = this.position.map(([x, y]) => [x + 1, y]);
                break;

            case "rotateLeft":
            case "rotateRight":
                const coordsX = this.position.map(coord => coord[0]);
                const coordsY = this.position.map(coord => coord[1]);

                const left = Math.min(...coordsX);
                const top = Math.min(...coordsY);

                switch (action) {
                    case "rotateLeft":
                        const right = Math.max(...coordsX);
                        const width = right - left;
                        const newBottom = top + width;
                        
                        targetPosition = this.position.map(([x, y]) => {
                            const diffX = x - left;
                            const diffY = y - top;
                            return [left + diffY, newBottom - diffX];
                        });
                        break;

                    case "rotateRight":
                        const bottom = Math.max(...coordsY);
                        const height = bottom - top;
                        const newRight = left + height;

                        targetPosition = this.position.map(([x, y]) => {
                            const diffX = x - left;
                            const diffY = y - top;
                            return [newRight - diffY, top + diffX];
                        });
                        break;
                }
                break;
        }

        // The position to check = target position - current position.
        const checkPosition = targetPosition.filter((targetPos) => {
            let a = JSON.stringify(this.position);
            let b = JSON.stringify(targetPos);
            return a.indexOf(b) == -1;
        });

        // Check if the position is within the grid and a block is not present.
        if (checkPosition.every(([x, y]) => 
            typeof cells[y] != 'undefined' && typeof cells[y][x] != 'undefined' &&
            cells[y][x].style.backgroundColor === "")) {

            // Play sound
            if (action != 'down') moveSound.play();

            // Unrender
            this.position.forEach(([x, y]) => {
                cells[y][x].style.backgroundColor = "";
            });

            // Move to the new position and render.
            this.position = targetPosition;
            this.render();
        }
        else {
            // Check if the block can no longer move downwards
            if (action == "down") {
                checkRows();
                spawnBlock();
            }
        }
    }

    render() {
        this.position.forEach(([x, y]) => {
            cells[y][x].style.backgroundColor = this.color;
        });
    }
}

function spawnBlock() {
    // TODO: randomize position and rotation.
    currentBlock = new Tetromino(0, 3);
}

function checkRows() {
    let clears = 0;
    cells.forEach((row, rowIndex) => {
        if (row.every(cell => cell.style.backgroundColor != "")) {
            // Play sound.
            clearSound.play();

            // Clear the row.
            row.forEach(cell => cell.style.backgroundColor = "");

            // Cascade all cells above the row downwards.
            for(let y = rowIndex; y > 0; y--) {
                cells[y - 1].forEach((cell, i) => {
                    cells[y][i].style.backgroundColor = cell.style.backgroundColor;
                    cell.style.backgroundColor = "";
                });
            }
            clears++;
        }
    });
    addPoints(clears);
    addLevel(clears);
}

function addPoints(clears: number) {
    const clearValue = clearPoints[clears] * (level + 1);
    points += clearValue;
    gamePoints.innerText = String(points);
}

function addLevel(clears: number) {
    xp += clears;
    if (xp >= 10) {
        gameLevel.innerText = String(++level);
        xp -= 10;
    }
    gameXpNext.innerHTML = `Lines to clear: ${10 - xp}`;
}

const gravity = function() {
    setTimeout(() => {
        currentBlock.move("down");
        gravity();
    }, gravityInterval - (80 * level)); //  TODO: temporary
}

// Controls

window.onkeydown = (e: KeyboardEvent) => {
    if (e.code == "ArrowDown") currentBlock.move("down");
    if (e.code == "ArrowLeft") currentBlock.move("left");
    if (e.code == "ArrowRight") currentBlock.move("right");
    if (e.code == "KeyZ") currentBlock.move("rotateLeft");
    if (e.code == "KeyX") currentBlock.move("rotateRight");
    // Add space for instant drop down.
}

// Game begins here

for (let row = 0; row < cells.length; row++) {
    const tr = document.createElement("tr");
    cells[row] = new Array<HTMLElement>(numberOfColumns);

    for (let col = 0; col < cells[row].length; col++) {
        cells[row][col] = document.createElement("td");
        tr.appendChild(cells[row][col]);
    }
    game.appendChild(tr);
}

bgm.play();
spawnBlock();
gravity();
