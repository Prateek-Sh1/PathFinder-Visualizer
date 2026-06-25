const grid = document.getElementById("grid");

let rows = 20;
let cols = 20;

let cells = [];

let start = null;
let end = null;

for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");

        grid.appendChild(cell);
        row.push(cell);
    }
    cells.push(row);
}

let info1=document.querySelector(".info1");
let info=document.querySelector(".info");
let info2=document.querySelector(".info2");

info1.addEventListener("click",function(){
    info.style.display="flex";
    info2.style.display="flex";
    info1.style.display="none";
});

info2.addEventListener("click",function(){
    info1.style.display="flex";
    info.style.display="none";
    info2.style.display="none";
});


function bfs() {
    if (!start || !end) {
        alert("Please select start and end nodes!");
        return;
    }

    let queue = [];
    let visited = Array(rows).fill(0).map(() => Array(cols).fill(false));
    let parent = Array(rows).fill(0).map(() => Array(cols).fill(null));

    let delay = 0;

    queue.push(start);
    visited[start[0]][start[1]] = true;

    while (queue.length > 0) {
        let [x, y] = queue.shift();

        if (x === end[0] && y === end[1]) {
            drawPath(parent);
            return;
        }

        let directions = [[1,0],[-1,0],[0,1],[0,-1]];

        for (let [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;

            if (
                nx >= 0 && ny >= 0 &&
                nx < rows && ny < cols &&
                !visited[nx][ny] &&
                !cells[nx][ny].classList.contains("wall")
            ) {
                visited[nx][ny] = true;
                parent[nx][ny] = [x, y];
                queue.push([nx, ny]);

                setTimeout(() => {
                    if (
                            !(nx === start[0] && ny === start[1]) &&
                            !(nx === end[0] && ny === end[1])
                        ) {
                            cells[nx][ny].classList.add("visited");
                        }
                }, delay);

                let speed = 20;
                delay += speed;
            }
        }
    }
}

function dfs() {
    if (!start || !end) {
        alert("Please select start and end nodes!");
        return;
    }
    let visited = Array(rows).fill().map(() => Array(cols).fill(false));
    let parent = Array(rows).fill(0).map(() => Array(cols).fill(null));
    let found = false;

    function dfsHelper(x, y) {
        if (found) return;

        visited[x][y] = true;

        setTimeout(() => {
            if (!isStartOrEnd(x, y)) {
                cells[x][y].classList.add("visited");
            }
        }, delay);
        delay += 20;

        if (x === end[0] && y === end[1]) {
            found = true;
            return;
        }

        let directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0]
        ];

        for (let [dx, dy] of directions) {
            let nx = x + dx;
            let ny = y + dy;

            if (
                nx >= 0 && ny >= 0 &&
                nx < rows && ny < cols &&
                !visited[nx][ny] &&
                !cells[nx][ny].classList.contains("wall")
            ) {
                parent[nx][ny] = [x, y];
                dfsHelper(nx, ny);
            }
        }
    }

    let delay = 0;

    dfsHelper(start[0], start[1]);

    setTimeout(() => {
        drawPath(parent);
    }, delay + 100);
}


function drawPath(parent) {
    let path = [];
    let curr = end;

    while (curr) {
        path.push(curr);
        curr = parent[curr[0]][curr[1]];
    }

    path.reverse();

    let delay = 0;

    for (let [x, y] of path) {
        setTimeout(() => {
            if (
            !(x === start[0] && y === start[1]) &&
            !(x === end[0] && y === end[1])
        ) {
            cells[x][y].classList.add("path");
        }

    }, delay);

        delay += 30;
    }
}


function resetGrid() {
    cells.forEach(row => {
        row.forEach(cell => {
            cell.className = "cell";
        });
    });

    start = null;
    end = null;
}


let isMouseDown = false;

document.body.onmousedown = () => isMouseDown = true;
document.body.onmouseup = () => isMouseDown = false;


cells.forEach((row, i) => {
    row.forEach((cell, j) => {

        cell.addEventListener("click", () => handleCell(i, j));

        cell.addEventListener("mouseover", () => {
            if (isMouseDown) handleCell(i, j);
        });

    });
});


function handleCell(i, j) {
    let cell = cells[i][j];

    if (!start) {
        cell.classList.add("start");
        start = [i, j];
    } 
    else if (!end) {
        cell.classList.add("end");
        end = [i, j];
    } 
    else {
        cell.classList.toggle("wall");
    }
}


