// Const Variabls
const computerScore = document.getElementById("computerScore");
const userScore = document.getElementById("userScore");
const gameBoard = document.querySelector(".gameBoard");
const ball = document.getElementById("ball");
const userBat = document.getElementById("userBat");
const computerBat = document.getElementById("computerBat");

const timer = document.getElementById("timer");
const upController = document.getElementById("upController");
const downController = document.getElementById("downController");

// Audios
const userHitAudio = new Audio("audio/userHit.wav");
const computerHitAudio = new Audio("audio/computerHit.wav");
const gameOverAudio = new Audio("audio/gameOver.wav");


// Script use Variabls
let gameSpeed, gameSpeedChange, heightLimit, widthLimit, userBatPosition, computerBatPosition, ballInX, ballInY, VelocityX, VelocityY, gameInterval, startTime;


let userCurrentScore = 0;
let computerCurrentScore = 0;

// Set up
function setupGame() {
    heightLimit = Number.parseInt(getComputedStyle(gameBoard).getPropertyValue("--grid-height"));
    widthLimit = Number.parseInt(getComputedStyle(gameBoard).getPropertyValue("--grid-width"));

    gameSpeed = 150;
    gameSpeedChange = 10;
    if (window.screen.width <= 500){
        gameSpeed = 200;
    }

    userBatPosition = [1, 5];
    computerBatPosition = [1, 5];
    ballInX = 0;
    ballInY = 0;

    VelocityX = randomVelocity();
    VelocityY = randomVelocity();

    gameInterval = null;
    timeStart = 0;

    setToCenter();

    setTimeout(() => {
        timer.innerText = "Click to Start";
        timer.style.display = "block";
    }, 1000);
}

// Set Bats and Ball in the center
function setToCenter() {
    let batPosition = Math.floor(heightLimit / 2) - 2;

    for (let i = 0; i < userBatPosition.length; i++) {
        userBatPosition[i] = userBatPosition[i] + batPosition;
    }

    userBat.style.gridRow = `${userBatPosition[0]} / ${userBatPosition[1]}`

    for (let i = 0; i < computerBatPosition.length; i++) {
        computerBatPosition[i] = computerBatPosition[i] + batPosition;
    }

    computerBat.style.gridRow = `${computerBatPosition[0]} / ${computerBatPosition[1]}`

    let ballX = Math.floor(heightLimit / 2);
    let ballY = Math.floor(widthLimit / 2) + 1;

    ballInX = ballX;
    ballInY = ballY;

    ball.style.gridArea = `${ballInX} / ${ballInY} / auto / auto`
}

// Set Game Score
function setScore() {
    userScore.innerText = userCurrentScore.toString().length < 2 ? "0" + userCurrentScore : userCurrentScore
    computerScore.innerText = computerCurrentScore.toString().length < 2 ? "0" + computerCurrentScore : computerCurrentScore
}

// Get random velocity
function randomVelocity() {
    let velocityArray = [1, -1];

    let random = Math.floor(Math.random() * velocityArray.length);

    let velocity = velocityArray[random];

    return velocity;
}

// Game Play Event Listeners
// Play with keyboard
window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowUp") {
        updateUserBat(-2);
    } else if (e.code == "ArrowDown") {
        updateUserBat(2);
    } else {
        console.log(e.code);
    }
})

// Play with controlers
upController.addEventListener("click", () => {
    updateUserBat(-2);
})

downController.addEventListener("click", () => {
    updateUserBat(2);
})

// Game staring timer
timer.addEventListener("click", () => {
    let timerTime = 3
    timer.innerText = timerTime;
    let interval = setInterval(() => {
        timerTime -= 1;
        if (timerTime == 0) {
            timer.innerText = "GO!"
            clearInterval(interval);
            setTimeout(() => {
                timer.style.display = "none";
                timeStart = new Date().getTime() / 1000;
                gameInterval = setInterval(initGame, gameSpeed);
            }, 1000);
        } else {
            timer.innerText = timerTime;
        }
    }, 800)
})


// Update User Bat
function updateUserBat(value) {
    if ((userBatPosition[0] == 1 && value < 0) || (userBatPosition[1] - 1 == heightLimit && value > 0)) {
        return;
    } else if (userBatPosition[1] == 25 && value > 0) {
        value = 1;
    } else if (userBatPosition[0] == 2 && value < 0) {
        value = -1;
    }

    for (let i = 0; i < userBatPosition.length; i++) {
        userBatPosition[i] = userBatPosition[i] + value;
    }

    userBat.style.gridRow = `${userBatPosition[0]} / ${userBatPosition[1]}`
}

// Update Computer Bat
function updateComputerBat() {
    if (ballInY > 14) {
        return
    }
    // if the ball hits the top, or It hits the limit of Bottom, don't move the Bat. It will overflow
    if ((ballInX == 1) || (ballInX + 1 >= heightLimit)) {
        return;
    }

    // -1, Because the bat's start position will be one grid-box before
    computerBatPosition[0] = ballInX - 1;
    // The bat's end position will go 3 position down of the ball. 1 + 3 = 4.. The ball size
    computerBatPosition[1] = ballInX + 3;

    computerBat.style.gridRow = `${computerBatPosition[0]} / ${computerBatPosition[1]}`
}

// Update User Bat Auto - When feeling boaring
function updateUserBatAuto() {
    if (ballInY < 12) {
        return
    }
    // if the ball hits the top, or It hits the limit of Bottom, don't move the Bat. It will overflow
    if ((ballInX == 1) || (ballInX + 1 >= heightLimit)) {
        return;
    }

    // -1, Because the bat's start position will be one grid-box before
    userBatPosition[0] = ballInX - 1;
    // The bat's end position will go 3 position down of the ball. 1 + 3 = 4.. The ball size
    userBatPosition[1] = ballInX + 3;

    userBat.style.gridRow = `${userBatPosition[0]} / ${userBatPosition[1]}`
}

// Update Ball position
function updateBallPosition() {
    ballInX += VelocityX;
    ballInY += VelocityY;

    ball.style.gridArea = `${ballInX} / ${ballInY} / auto / auto`
}

// Check if Ball collides with Anything
function checkBallPosition() {
    // Check if ball hit the Bats
    if ((ballInX >= computerBatPosition[0] && ballInX < computerBatPosition[1]) && (ballInY == 2)) {
        computerHitAudio.play();

        VelocityY = 2;

        setTimeout(() => {
            VelocityY = 1;
        }, gameSpeed + 50);

        if (ballInX == 1) {
            VelocityX = 1;
        } else if (ballInX == heightLimit) {
            VelocityX = -1;
        } else {
            VelocityX = randomVelocity();
        }
    } else if ((ballInX >= userBatPosition[0] && ballInX < userBatPosition[1]) && (ballInY == widthLimit - 1)) {
        userHitAudio.play();

        VelocityY = -2;

        setTimeout(() => {
            VelocityY = -1;
        }, gameSpeed + 50);

        if (ballInX == 1) {
            VelocityX = 1;
        } else if (ballInX == heightLimit) {
            VelocityX = -1;
        } else {
            VelocityX = randomVelocity();
        }
    } else if (ballInX == 1) {
        VelocityX = 2;

        setTimeout(() => {
            VelocityX = 1;
        }, gameSpeed + 50);
    } else if (ballInX == heightLimit) {
        VelocityX = -2;

        setTimeout(() => {
            VelocityX = -1;
        }, gameSpeed + 50);
    }
}

// Game Over
function gameOver() {
    if (ballInY < 1) {
        showGameOver(1)
        return true;
    } else if (ballInY > widthLimit + 1) {
        showGameOver(2)
        return true;
    }
}

// Show Game Over
function showGameOver(player) {
    gameOverAudio.play();
    // Player 1 = Computer, User's Point
    // Player 2 = User, Computer's Point
    if (player == 1) {
        timer.innerText = "User's Point";
        timer.style.display = "block";
        userCurrentScore += 1;
    } else if (player == 2) {
        timer.innerText = "Computer's Point";
        timer.style.display = "block";
        computerCurrentScore += 1;
    }
    setScore();

    clearInterval(gameInterval)
    setupGame();
}

// Inisialize Game
function initGame() {
    updateBallPosition();
    checkBallPosition();
    updateComputerBat();
    // updateUserBatAuto();
    if (gameOver()) {
        return
    };

    let timeNow = new Date().getTime() / 1000;
    if (timeNow - timeStart >= 10){
        clearInterval(gameInterval);
        gameSpeed -= gameSpeedChange;
        timeStart = new Date().getTime() / 1000;
        console.log("Speed Changed to:" + gameSpeed)
        gameInterval = setInterval(initGame, gameSpeed);
    }
}

// Setting up game for the first time
setupGame();