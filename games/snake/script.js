const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, apple, dx, dy, score, gameOver;
let interval;

function initGame() {
  snake = [{ x: 10, y: 10 }];
  apple = { x: 5, y: 5 };
  dx = 0;
  dy = 0;
  score = 0;
  gameOver = false;
  updateScore();
  clearInterval(interval);
  interval = setInterval(gameLoop, 150);
}

function gameLoop() {
  if (gameOver) return;

  moveSnake();

  if (checkCollision()) {
    gameOver = true;
    alert("Game Over! Your Score: " + score);
    return;
  }

  if (snake[0].x === apple.x && snake[0].y === apple.y) {
    snake.push({}); // grow
    placeApple();
    score++;
    updateScore();
    increaseSpeed();
  }

  draw();
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  snake.pop();
}

function checkCollision() {
  const head = snake[0];
  return (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.slice(1).some(s => s.x === head.x && s.y === head.y)
  );
}

function placeApple() {
  apple = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // snake
  ctx.fillStyle = "#0f0";
  snake.forEach(part =>
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize)
  );

  // apple
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function updateScore() {
  scoreDisplay.textContent = "Score: " + score;
}

function increaseSpeed() {
  clearInterval(interval);
  const speed = Math.max(50, 150 - score * 5);
  interval = setInterval(gameLoop, speed);
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case "ArrowDown":
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case "ArrowLeft":
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case "ArrowRight":
      if (dx === 0) { dx = 1; dy = 0; }
      break;
  }
});

resetBtn.addEventListener("click", initGame);

initGame();
