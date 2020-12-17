type Solid = 0 | 1;

interface Tetromino {
    "color": string,
    "shape": Array<Array<Solid>>
}

const tetrominoes: Tetromino[] = [
    {
        "color": "cyan",
        "shape": [
            [1, 1, 1, 1]
        ]
    },
    {
        "color": "blue",
        "shape": [
            [1, 1, 1],
            [1]
        ]
    },
    {
        "color": "orange",
        "shape": [
            [1],
            [1, 1, 1]
        ]
    },
    {
        "color": "yellow",
        "shape": [
            [1, 1],
            [1, 1]
        ]
    },
    {
        "color": "green",
        "shape": [
            [0, 1, 1],
            [1, 1]
        ]
    },
    {
        "color": "purple",
        "shape": [
            [0, 1, 0],
            [1, 1, 1]
        ]
    },
    {
        "color": "red",
        "shape": [
            [1, 1],
            [0, 1, 1]
        ]
    }
];

export default tetrominoes;