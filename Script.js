const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const jumpSound = new Audio("jump.mp3");
const bgMusic = new Audio("music.mp3");
// Bird
const bird = {
  x: 80,
  y: 250,
  width: 30,
  height: 30,
  velocity: 0,
  gravity: 0.5,
  jump: -8
};

// Pipes
let pipes = [];
const pipeWidth = 60;
const pipeGap = 170;
const pipeSpeed = 2;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let wingUp = true;
let gameStarted = false;
let gameOver = false;
// Pipe Create
function createPipe() {
  const topHeight = Math.floor(Math.random() * 250) + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - pipeGap,
    passed: false
  });
}

setInterval(createPipe, 1800);

// Bird
function drawBird() {
  ctx.beginPath();
  ctx.arc(
    bird.x + bird.width / 2,
    bird.y + bird.height / 2,
    15,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "yellow";
  ctx.fill();
// Wing
// Wing
ctx.beginPath();

if (wingUp) {
  ctx.arc(bird.x + 8, bird.y + 10, 8, 0, Math.PI * 2);
} else {
  ctx.arc(bird.x + 8, bird.y + 20, 8, 0, Math.PI * 2);
}

ctx.fillStyle = "gold";
ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bird.x + 20, bird.y + 10, 3, 0, Math.PI * 2);
  ctx.fill();
// Eye Highlight
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(bird.x + 21, bird.y + 9, 1, 0, Math.PI * 2);
ctx.fill();
  ctx.fillStyle = "orange";
  ctx.fillRect(bird.x + 28, bird.y + 12, 10, 6);
  // Tail
ctx.fillStyle = "yellow";
ctx.beginPath();
ctx.moveTo(bird.x - 2, bird.y + 15);
ctx.lineTo(bird.x - 10, bird.y + 10);
ctx.lineTo(bird.x - 10, bird.y + 20);
ctx.fill();
}

// Pipes
function drawPipes() {
  ctx.fillStyle = "green";

  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillStyle = "#2E8B57";
ctx.fillRect(pipe.x - 5, pipe.top - 15, pipeWidth + 10, 15);
    ctx.fillRect(
      pipe.x,
      canvas.height - pipe.bottom,
      pipeWidth,
      pipe.bottom
    );
    ctx.fillStyle = "#2E8B57";
ctx.fillRect(
  pipe.x - 5,
  canvas.height - pipe.bottom,
  pipeWidth + 10,
  15
);
  });
}

// Update Bird
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y < 0) bird.y = 0;

  if (bird.y > canvas.height - bird.height) {
    bird.y = canvas.height - bird.height;
  }
}

// Update Pipes
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
      if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
}
    }
  });

  pipes = pipes.filter(pipe => pipe.x > -pipeWidth);
}

// Score
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("High: " + highScore, 10, 60);
}
function drawStartScreen() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "35px Arial";
  ctx.fillText("FLAPPY BIRD", 70, 220);

  ctx.font = "22px Arial";
  ctx.fillText("Tap to Start", 120, 280);
}
function checkCollision() {

  pipes.forEach(pipe => {

    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (
        bird.y < pipe.top ||
        bird.y + bird.height > canvas.height - pipe.bottom
      )
    ) {
      gameOver = true;
    }

  });

}
// Jump
// Jump
document.addEventListener("click", () => {

  if (gameOver) {
    location.reload();
    return;
  }

  if (!gameStarted) {
    gameStarted = true;
  }
bgMusic.loop = true;
bgMusic.play();
  bird.velocity = bird.jump;
jumpSound.play();
});

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Clouds
ctx.fillStyle = "white";

ctx.beginPath();
ctx.arc(70, 80, 20, 0, Math.PI * 2);
ctx.arc(90, 70, 25, 0, Math.PI * 2);
ctx.arc(115, 80, 20, 0, Math.PI * 2);
ctx.fill();

ctx.beginPath();
ctx.arc(270, 130, 18, 0, Math.PI * 2);
ctx.arc(290, 120, 22, 0, Math.PI * 2);
ctx.arc(315, 130, 18, 0, Math.PI * 2);
ctx.fill();
// Ground
ctx.fillStyle = "#4CAF50";
ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
if (!gameStarted) {
  drawBird();
  drawStartScreen();
  requestAnimationFrame(gameLoop);
  return;
}
  updateBird();
  updatePipes();

  drawBird();
  drawPipes();
  drawScore();
checkCollision();

if (gameOver) {
  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  ctx.fillText("GAME OVER", 60, 280);

  ctx.font = "22px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Tap to Restart", 100, 330);

  return;
}
  requestAnimationFrame(gameLoop);
}

gameLoop();
