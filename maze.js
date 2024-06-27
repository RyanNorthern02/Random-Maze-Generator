document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const generateMazeBtn = document.getElementById('generateMazeBtn');
    const rows = 10;
    const cols = 10;
    const cellSize = 30;

    // Set canvas dimensions based on the number of rows and columns
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    // Add event listener to the button to generate a new maze when clicked
    generateMazeBtn.addEventListener('click', generateMaze);

    // Function to generate a new maze
    function generateMaze() {
        let grid = createGrid(rows, cols);
        let stack = [];
        let current = grid[0][0];
        current.visited = true;
        stack.push(current);

        // Depth-First Search algorithm to generate the maze
        while (stack.length > 0) {
            let next = getUnvisitedNeighbor(current, grid);
            if (next) {
                next.visited = true;
                stack.push(current);
                removeWalls(current, next);
                current = next;
            } else {
                current = stack.pop();
            }
        }

        // Set entry and exit points
        grid[0][0].walls[3] = false; // Remove left wall of the entry point
        grid[rows - 1][cols - 1].walls[1] = false; // Remove right wall of the exit point

        drawMaze(grid);
    }

    // Function to create a grid of cells
    function createGrid(rows, cols) {
        let grid = [];
        for (let row = 0; row < rows; row++) {
            let newRow = [];
            for (let col = 0; col < cols; col++) {
                // Each cell has a row, col, visited flag, and walls (top, right, bottom, left)
                newRow.push({
                    row: row,
                    col: col,
                    visited: false,
                    walls: [true, true, true, true]
                });
            }
            grid.push(newRow);
        }
        return grid;
    }

    // Function to get a random unvisited neighbor of a cell
    function getUnvisitedNeighbor(cell, grid) {
        let neighbors = [];
        let { row, col } = cell;

        // Check each direction for unvisited neighbors and add them to the list
        if (row > 0 && !grid[row - 1][col].visited) neighbors.push(grid[row - 1][col]);
        if (col < cols - 1 && !grid[row][col + 1].visited) neighbors.push(grid[row][col + 1]);
        if (row < rows - 1 && !grid[row + 1][col].visited) neighbors.push(grid[row + 1][col]);
        if (col > 0 && !grid[row][col - 1].visited) neighbors.push(grid[row][col - 1]);

        // Return a random unvisited neighbor if any exist
        if (neighbors.length > 0) {
            return neighbors[Math.floor(Math.random() * neighbors.length)];
        }
        return undefined;
    }

    // Function to remove walls between the current cell and the next cell
    function removeWalls(current, next) {
        let x = current.col - next.col;
        let y = current.row - next.row;

        // Determine which wall to remove based on the relative position of next to current
        if (x === 1) {
            current.walls[3] = false; // Remove left wall of current
            next.walls[1] = false; // Remove right wall of next
        } else if (x === -1) {
            current.walls[1] = false; // Remove right wall of current
            next.walls[3] = false; // Remove left wall of next
        }

        if (y === 1) {
            current.walls[0] = false; // Remove top wall of current
            next.walls[2] = false; // Remove bottom wall of next
        } else if (y === -1) {
            current.walls[2] = false; // Remove bottom wall of current
            next.walls[0] = false; // Remove top wall of next
        }
    }

   // Function to draw the maze on the canvas
function drawMaze(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // Draw each cell's walls using path construction
    for (let row of grid) {
        for (let cell of row) {
            let x = cell.col * cellSize;
            let y = cell.row * cellSize;

            ctx.beginPath();

            // Draw top wall
            if (cell.walls[0]) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + cellSize, y);
            }

            // Draw right wall
            if (cell.walls[1]) {
                ctx.moveTo(x + cellSize, y);
                ctx.lineTo(x + cellSize, y + cellSize);
            }

            // Draw bottom wall
            if (cell.walls[2]) {
                ctx.moveTo(x + cellSize, y + cellSize);
                ctx.lineTo(x, y + cellSize);
            }

            // Draw left wall
            if (cell.walls[3]) {
                ctx.moveTo(x, y + cellSize);
                ctx.lineTo(x, y);
            }

            ctx.stroke();
            }
        }
    }
});