const gameCanvas = document.querySelector("#gameCanvas");
const scoreCounter = document.querySelector('#scoreCounter');
const highScoreCounter = document.querySelector('#highScoreCounter');




const ctx = gameCanvas.getContext('2d');
const canvasWidth = gameCanvas.width;
const canvasHeight = gameCanvas.height;

// Game canvas square 500px/side, each unit is 25px square
let canvasColor = 'silver', snakeColor = 'white', snakeBorder = 'red', foodColor = 'red';
let foodXCoor, foodYCoor, score, snake;
let unitSize = 25, snakeX = unitSize, snakeY = 0, gameOngoing = false, snakeSpeed = 75, pauseCheck = false;

///////////////////////////
ctx.font = "20px MV Boli";
ctx.fillStyle = "black";
ctx.textAlign = "center";
ctx.fillText("HIT ENTER TO START GAME!", canvasWidth / 2, canvasHeight / 2); // in the middle

window.addEventListener('keydown', keyClicked);

console.log("TEST HIGHSCORE" + highScoreCounter.textContent)


// add snake speed, snake size, highscore(cookie???), bug where food is randomized within snake
// https://www.javascripttutorial.net/javascript-dom/javascript-radio-button/#:~:text=Introduction%20to%20the%20JavaScript%20Radio,is%20called%20a%20radio%20group.

function gameStarted(){
    // Reset Game Stats
    gameOngoing = true;
    // pauseCheck = true;
    score = 0;
    snakeX = unitSize;
    snakeY = 0;
    snake = [{x:0, y:0}];
    scoreCounter.textContent = score;

    // Make Snake Food and Start
    createFood();
    updateCanvas();
    nextCanvasMove();
};

function nextCanvasMove(){
    if(gameOngoing == true && pauseCheck == false ){ // Game ongoing
        setTimeout(() =>{
            updateCanvas();
            moveSnake();
            snakeCanvas();
            snakeRules();
            nextCanvasMove();
        }, snakeSpeed)
    }
    else if(gameOngoing == false && pauseCheck == true){
        ctx.fillText("Pause", canvasWidth / 2, canvasHeight / 2); // Game has Paused
    }
    else{ // Game has ended
        // displayGameOver();
        //GAME OVER 
        // ctx.font = "50px MV Boli";
        // ctx.fillStyle = "black";
        // ctx.textAlign = "center";
        // ctx.fillStyle = 'white';
        ctx.fillText("GAME OVER! HIT ENTER TO PlAY AGAIN!", canvasWidth / 2, canvasHeight / 2); // in the middle
        gameOngoing = false;
    }
};

function createFood(){
    // Randomly assign food location using x/y coordinates
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max-min) + min) / unitSize) * unitSize
        return randNum;
    }
    foodXCoor = randomFood(0, canvasWidth - unitSize);
    foodYCoor = randomFood(0, canvasWidth - unitSize);
};

function updateCanvas(){
    // Update canvas and Food location
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0,0, canvasWidth, canvasHeight);
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodXCoor, foodYCoor, unitSize, unitSize)
};

function moveSnake(){
    const head = {x: snake[0].x + snakeX, y: snake[0].y + snakeY};
    snake.unshift(head);
    // if food is eaten
    if (snake[0].x == foodXCoor && snake[0].y == foodYCoor){
        score+=1;
        scoreCounter.textContent = score;
        createFood();

        if( score > highScoreCounter.textContent){
            highScoreCounter.textContent = score;
        }

    }
    else{
        snake.pop();
    }
};

function snakeCanvas(){
    // Display Snake based on coordinates, 25px square
    ctx.fillStyle = snakeColor;
    // ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

function keyClicked(event){
    // FYI: snake cannot go opposite direction during game
    // X/Y Coordinates
    const keyPressed = event.keyCode;
    switch(true){
        case(keyPressed == 13 && gameOngoing == false && pauseCheck == false): // key Enter to Start game
            gameStarted();
            break;
        case(keyPressed == 13 && gameOngoing == true && pauseCheck == false): // key Enter to pause game
            pauseCheck = true;
            gameOngoing = false;
            break;
        case(keyPressed == 13 && gameOngoing == false && pauseCheck == true): // key Enter to Resume game
            pauseCheck = false;
            gameOngoing = true;
            updateCanvas();
            nextCanvasMove();
            break;
        case(keyPressed == 37 && !(snakeX == unitSize)): // key left
            snakeX = -unitSize;
            snakeY = 0;
            break;
        case(keyPressed == 38 && !(snakeY == unitSize)): // key up
            snakeX = 0;
            snakeY = -unitSize;
            break;
        case(keyPressed == 39 && !(snakeX == -unitSize)): // key right
            snakeX = unitSize;
            snakeY = 0;
            break;
        case(keyPressed == 40 && !(snakeY == -unitSize)): // key down
            snakeX = 0;
            snakeY = unitSize;
            break;
    }
};

function snakeRules(){
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