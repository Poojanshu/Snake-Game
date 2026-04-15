let direction = {x: 0, y: 0};

const foodsound = new Audio('foodsound.mp3');
const gameover = new Audio('gameover.mp3');
const movesound = new Audio('movesound.mp3');
const musicsound = new Audio('bgmusic.mp3');

let speed = 5;
let score = 0;
let lastPaintTime = 0;

let snakeArr = [
    {x: 13, y: 15}
];

let food = {x: 6, y: 7};

// SCORE UPDATE
function updateScore(){
    document.getElementById("scoreBox").innerText = "Score: " + score;
}

// SHOW GAME OVER
function showGameOver(){
    document.getElementById("gameOverBox").style.display = "block";
    document.getElementById("finalScore").innerText = score;
}

// RESTART GAME
function restartGame(){
    location.reload();
}

// MAIN LOOP
function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// 🔹 COLLISION CHECK
function isCollide(sarr) {
    // Self collision
    for (let i = 1; i < sarr.length; i++) {
        if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) {
            return true;
        }
    }

    // Wall collision
    if (sarr[0].x >= 18 || sarr[0].x <= 0 || sarr[0].y >= 18 || sarr[0].y <= 0) {
        return true;
    }

    return false;
}

// GAME ENGINE
function gameEngine() {

    let board = document.querySelector('.board');
    board.innerHTML = "";

    // GAME OVER
    if (isCollide(snakeArr)) {
        gameover.play();
        musicsound.pause();
        direction = {x: 0, y: 0};

        showGameOver();   
        return;
    }

    // FOOD EATEN
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodsound.play();

        score += 10;
        speed += 0.5;
        updateScore();   

        snakeArr.unshift({
            x: snakeArr[0].x + direction.x,
            y: snakeArr[0].y + direction.y
        });

        let a = 2;
        let b = 16;

        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // MOVE SNAKE
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = {...snakeArr[i]};
    }

    snakeArr[0].x += direction.x;
    snakeArr[0].y += direction.y;

    // DISPLAY SNAKE
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');

        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }

        board.appendChild(snakeElement);
    });

    //  DISPLAY FOOD
    let foodElement = document.createElement('div');

    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;

    foodElement.classList.add('food');

    board.appendChild(foodElement);
}

// START GAME
window.requestAnimationFrame(main);

// CONTROLS
window.addEventListener('keydown', e => {

    movesound.play();

    if (direction.x === 0 && direction.y === 0) {
        musicsound.play();
        direction = {x: 0, y: 1}; // Start game
    }

    switch (e.key) {

        case "ArrowUp":
            if (direction.y !== 1) {
                direction = { x: 0, y: -1 };
            }
            break;

        case "ArrowDown":
            if (direction.y !== -1) {
                direction = { x: 0, y: 1 };
            }
            break;

        case "ArrowLeft":
            if (direction.x !== 1) {
                direction = { x: -1, y: 0 };
            }
            break;

        case "ArrowRight":
            if (direction.x !== -1) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
});