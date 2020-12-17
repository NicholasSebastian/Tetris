import './styles.scss';
import tetrominoes from './tetrominoes';

// TODO: Implement rotation matrix
// TODO: Implement row clearing
// TODO: Implement points system and other game mechanics
// TODO: Implement/improve UI

const numberOfRows = 20;
const numberOfColumns = 10;

// Initialization

const game = document.getElementById("game");
const cells = new Array<HTMLElement[]>(numberOfRows);

for (let row = 0; row < cells.length; row++) {
    const tr = document.createElement("tr");
    cells[row] = new Array<HTMLElement>(numberOfColumns);

    for (let col = 0; col < cells[row].length; col++) {
        cells[row][col] = document.createElement("td");
        tr.appendChild(cells[row][col]);
    }
    game.appendChild(tr);
}

let currentBlock: Tetromino;

// Definitions

function spawnBlock() {
    currentBlock = new Tetromino(0, 3);
}

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

    move(direction: "down" | "left" | "right" | "rotate") {
        let targetPosition: Array<[number, number]>;
        switch (direction) {
            case "down":
                targetPosition = this.position.map(([x, y]) => [x, y + 1]);
                break;
            case "left":
                targetPosition = this.position.map(([x, y]) => [x - 1, y]);
                break;
            case "right":
                targetPosition = this.position.map(([x, y]) => [x + 1, y]);
                break;
            case "rotate":
                // Get two opposite corners of the shape.
                const topLeft = this.position.reduce(([x1, y1], [x2, y2]) => 
                    [Math.min(x2, x1), Math.min(y2, y1)], 
                    [Number.MAX_VALUE, Number.MAX_VALUE]);
                
                const bottomRight = this.position.reduce(([x1, y1], [x2, y2]) => 
                    [Math.max(x2, x1), Math.max(y2, y1)], 
                    [Number.MIN_VALUE, Number.MIN_VALUE]);

                // Calculate the width and height of the shape.
                const width = (bottomRight[0] - topLeft[0]) + 1;
                const height = (bottomRight[1] - topLeft[1]) + 1;
                
                // Rotate the points anti-clockwise.
                targetPosition = this.position.map(([x, y]) => {
                    return [x, y]; // TODO
                });
                break;
            default:
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
            (cells[y][x].style.backgroundColor == "transparent" || cells[y][x].style.backgroundColor === ""))) {

            // Unrender
            this.position.forEach(([x, y]) => {
                cells[y][x].style.backgroundColor = "transparent";
            });

            // Move to the new position and render.
            this.position = targetPosition;
            this.render();
        }
        else {
            // Check if the block can no longer move downwards
            if (direction == "down") {
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

// Controls

window.onkeydown = (e: KeyboardEvent) => {
    if (e.code == "KeyW") currentBlock.move("rotate");
    if (e.code == "KeyS") currentBlock.move("down");
    if (e.code == "KeyA") currentBlock.move("left");
    if (e.code == "KeyD") currentBlock.move("right");
}

// Game loop

const gravityInterval = 1000;
setInterval(() => currentBlock.move("down"), gravityInterval);

spawnBlock();