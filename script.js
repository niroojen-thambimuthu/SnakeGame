const gameCanvas = document.querySelector("#gameCanvas");
const ctx = gameCanvas.getContext('2d');
const scoreCounter = document.querySelector('#scoreCounter');
const resetButtom = document.querySelector('#resetButton');
const canvasWidth = gameCanvas.width;
const canvasHeight = gameCanvas.height;

let canvasColor = 'silver';
let snakeColor = 'white';
let snakeBorder = 'red';

let foodColor = 'red';
let foodXCoor;
let foodYCoor;

let unitSize = 25;
let gameOngoing = false;
let snakeX = unitSize;
let snakeY = 0;

let score = 0
let snake = [
    // {x:unitSize*4, y:0},
    // {x:unitSize*3, y:0},
    // {x:unitSize*2, y:0},
    // {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener('keydown', changeDirection);
resetButtom.addEventListener('click', resetGame);

gameStarted();
// createFood();
// drawFood();

function gameStarted(){
    gameOngoing = true;
    scoreCounter.textContent = score;
    createFood();
    drawFood();
    nextTick();
};

function nextTick(){
    if(gameOngoing){
        setTimeout(() =>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75)
    }
    else{
        displayGameOver();
    }
};

function clearBoard(){
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0,0, canvasWidth, canvasHeight);
};

function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max-min) + min) / unitSize) * unitSize
        return randNum;
    }
    foodXCoor = randomFood(0, canvasWidth - unitSize);
    foodYCoor = randomFood(0, canvasWidth - unitSize);
};

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodXCoor, foodYCoor, unitSize, unitSize)
};

function moveSnake(){
    const head = {x: snake[0].x + snakeX,
                y: snake[0].y + snakeY};
    snake.unshift(head);
    // if food is eaten
    if (snake[0].x == foodXCoor && snake[0].y == foodYCoor){
        score+=1;
        scoreCounter.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }
};

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    const goingUp = (snakeY == -unitSize);
    const goingDown = (snakeY == unitSize);
    const goingRight = (snakeX == unitSize);
    const goingLeft = (snakeX == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            snakeX = -unitSize;
            snakeY = 0;
            break;
        case(keyPressed == up && !goingDown):
            snakeX = 0;
            snakeY = -unitSize;
            break;
        case(keyPressed == right && !goingLeft):
            snakeX = unitSize;
            snakeY = 0;
            break;
        case(keyPressed == down && !goingUp):
            snakeX = 0;
            snakeY = unitSize;
            break;
        
    }
    // console.log(keyPressed);

};

function checkGameOver(){
    // check if snake hits canvas bounds
    switch(true){
        case (snake[0].x < 0):
            gameOngoing = false;
            break;
        case (snake[0].x >= canvasWidth):
            gameOngoing = false;
            break;
        case (snake[0].y < 0):
            gameOngoing = false;
            break;
        case (snake[0].y >= canvasHeight):
            gameOngoing = false;
            break;
    }
    // check if snake touches itself
    for(let i = 1; i < snake.length; i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            gameOngoing = false;
        }
    }
};


function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", canvasWidth / 2, canvasHeight / 2); // in the middle
    gameOngoing = false;
};


function resetGame(){
    score = 0;
    snakeX = unitSize;
    snakeY = 0;
    snake = [
        // {x:unitSize * 4, y:0},
        // {x:unitSize * 3, y:0},
        // {x:unitSize * 2, y:0},
        // {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStarted();
};

