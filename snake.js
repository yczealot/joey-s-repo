const gameBoard = document.getElementById('game-board');
const scoreElem = document.getElementById('score');
const bestScoreElem = document.getElementById('bestScore');
const timerElem = document.getElementById('timer');
const gridSize = 30;
const tileSize = 10;
let bestScore = 0;
let snake, dir, fruit, score, startTime, elapsedTime, gameOver;

function init() {
    snake = [{x: 10, y: 10}, {x: 11, y: 10}];
    dir = {x: 0, y: -1};
    fruit = newFruit();
    score = 0;
    startTime = Date.now();
    elapsedTime = 0;
    gameOver = false;

    scoreElem.textContent = score;
    timerElem.textContent = elapsedTime;
}

function gameLoop() {
    if (!gameOver) {
        moveSnake();
        checkCollision();
        eatFruit();
        updateTimer();
        draw();
        setTimeout(gameLoop, 100);
    } else {
        if (score > bestScore) {
            bestScore = score;
            bestScoreElem.textContent = bestScore;
        }
        setTimeout(() => {
            init();
            gameLoop();
        }, 2000);
    }
}

function moveSnake() {
    let head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    const [head, ...body] = snake;
    if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize
    || body.some(dot => dot.x === head.x && dot.y === head.y)) {
        gameOver = true;
    }
}

function draw() {
    gameBoard.innerHTML = '';

    snake.forEach(dot => {
        const dotElement = document.createElement('div');
        dotElement.style.left = `${dot.x * tileSize}px`;
        dotElement.style.top = `${dot.y * tileSize}px`
        dotElement.classList.add('dot');
        gameBoard.append(dotElement);
    });

    const fruitElement = document.createElement('div');
    fruitElement.style.left = `${fruit.x * tileSize}px`;
    fruitElement.style.top = `${fruit.y * tileSize}px`;
    fruitElement.classList.add('fruit');
    gameBoard.append(fruitElement);
}

function newFruit() {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (snake.some(dot => dot.x === x && dot.y === y)) {
        return newFruit(); // 如果随机生成的果实位置在蛇身上，重新生成一个
    }

    return {x, y};
}

function eatFruit() {
    if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
        snake.push({});
        fruit = newFruit();
        score++;
        scoreElem.textContent = score;
    }
}

function changeDirection(event) {
    const keyDirectionMap = {
        ArrowUp: {x: 0, y: -1},
        ArrowDown: {x: 0, y: 1},
        ArrowLeft: {x: -1, y: 0},
        ArrowRight: {x: 1, y: 0}
    };

    const newDirection = keyDirectionMap[event.key]; if (newDirection && (newDirection.x === 0 || dir.x === 0) && (newDirection.y === 0 || dir.y === 0)) { dir = newDirection; } }

function updateTimer() { elapsedTime = Math.floor((Date.now() - startTime) / 1000); timerElem.textContent = elapsedTime; }

document.addEventListener('keydown', changeDirection);
// 新增：监听触摸事件
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

// 新增：添加处理触摸事件的函数和变量
let touchStartX = null;
let touchStartY = null;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;
    let touchDeltaX = touchStartX - touchEndX;
    let touchDeltaY = touchStartY - touchEndY;

    if (Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
        // 左右滑动
        if (touchDeltaX > 0) {
            changeDirection({key: "ArrowLeft"});
        } else {
            changeDirection({key: "ArrowRight"});
        }
    } else {
        // 上下滑动
        if (touchDeltaY > 0) {
            changeDirection({key: "ArrowUp"});
        } else {
            changeDirection({key: "ArrowDown"});
        }
    }

    // 重置滑动状态
    touchStartX = null;
    touchStartY = null;
}


init();
gameLoop();