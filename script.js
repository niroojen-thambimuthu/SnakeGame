const gameCanvas = document.querySelector("#gameCanvas");
const scoreCounter = document.querySelector('#scoreCounter');
const highScoreCounter = document.querySelector('#highScoreCounter');
const snakeSpeedToggle = document.querySelectorAll('input[type=radio][name="snakeSpeed"');
const ctx = gameCanvas.getContext('2d');
const canvasWidth = gameCanvas.width;
const canvasHeight = gameCanvas.height;

// Game canvas square 600px/side, each unit is 30px square
let foodXCoor, foodYCoor, score, snake, snakeSpeed = 75;
let unitSize = 30, snakeX = unitSize, snakeY = 0, gameOngoing = false, pauseCheck = false;

// Main Screen
ctx.fillStyle = "#202C37";
ctx.fillRect(0,0, canvasWidth, canvasHeight);
ctx.fillStyle = "white";
ctx.font = "20px Franklin Gothic Medium";
ctx.textAlign = "center";
// ctx.fillText("HIT ENTER TO START GAME!", canvasWidth / 2, canvasHeight / 2); // in the middle
ctx.fillText("HIT ENTER TO START/PAUSE SNAKEGAME!", canvasWidth / 2, (canvasHeight / 2)-15); 
// ctx.fillText("HIT ENTER IN GAME TO PAUSE", canvasWidth / 2, (canvasHeight / 2) +15);

// Event listener for keys clicked and radio-buttons
window.addEventListener('keydown', keyClicked);
snakeSpeedToggle.forEach(radio => radio.addEventListener('change', () => snakeSpeed = parseInt(radio.value, 10)));

function gameStarted(){
    // Reset Game Stats
    gameOngoing = true;
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

function createFood(){
    // Randomly assign food location to x/y coordinates
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max-min) + min) / unitSize) * unitSize
        return randNum;
    }
    foodXCoor = randomFood(0, canvasWidth - unitSize);
    foodYCoor = randomFood(0, canvasWidth - unitSize);

    // Bug: If food is assigned within snake, create food again
    for(let i = 0; i < snake.length; i++){
        if(snake[i].x == foodXCoor && snake[i].y == foodYCoor){
            createFood();
        }
    }
};

function updateCanvas(){
    // Update canvas and Food location
    // two-tone grid color
    for(let i=0; i<21; i++) {
        for(let j=0; j<21; j++) {
          ctx.fillStyle = ((i+j)%2==0) ? "#283547":"#202C37";
          ctx.fillRect(j*unitSize, i*unitSize, unitSize, unitSize);
        }
    }
    // food at location    
    ctx.beginPath();
    ctx.arc((foodXCoor+(unitSize/2)), (foodYCoor+(unitSize/2)), 13, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff8c00";
    ctx.fill();
};

function nextCanvasMove(){
    // Game ongoing
    if(gameOngoing == true && pauseCheck == false ){
        setTimeout(() =>{
            updateCanvas();
            moveSnake();
            snakeCanvas();
            snakeRules();
            nextCanvasMove();
        }, snakeSpeed)
    }
    // Game has Paused
    else if(gameOngoing == false && pauseCheck == true){
        ctx.fillStyle = "white";
        ctx.fillText("PAUSE", canvasWidth / 2, canvasHeight / 2);
    }
    // Game has ended
    else{
        ctx.fillStyle = "#202C37";
        ctx.fillRect(0,0, canvasWidth, canvasHeight);
        ctx.fillStyle = "white";
        ctx.font = "20px Franklin Gothic Medium";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER!", canvasWidth / 2, (canvasHeight / 2)-15); 
        ctx.fillText("HIT ENTER TO PLAY AGAIN!", canvasWidth / 2, (canvasHeight / 2) +15);
        gameOngoing = false;
    }
};

function moveSnake(){
    // Check if food is eaten by snake head
    const head = {x: snake[0].x + snakeX, y: snake[0].y + snakeY};
    snake.unshift(head);
    if (snake[0].x == foodXCoor && snake[0].y == foodYCoor){
        score+=1;
        scoreCounter.textContent = score;
        createFood();
        // Record Highscore
        if( score > highScoreCounter.textContent){
            highScoreCounter.textContent = score;
        }
    }
    else{
        snake.pop();
    }
};

function snakeCanvas(){
    // Display Snake based on coordinates, 30px square
    ctx.fillStyle = 'silver';
    ctx.strokeRect(snake[0].x, snake[0].y, unitSize, unitSize);
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
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