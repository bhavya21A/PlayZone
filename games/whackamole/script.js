const holes = document.querySelectorAll('.hole');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const progress = document.getElementById('progress');
const difficultySelect = document.getElementById('difficulty');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again');

let score = 0;
let timeUp = false;
let gameDuration = 30000; // 30 seconds
let moleTimer;
let moleInterval = 800;

function randomHole() {
  const index = Math.floor(Math.random() * holes.length);
  return holes[index];
}

function showMole() {
  if (timeUp) return;

  const hole = randomHole();
  const mole = document.createElement('div');
  mole.classList.add('mole');

  mole.style.width = window.innerWidth < 600 ? '60px' : '90px';
  mole.style.height = mole.style.width;

  mole.addEventListener('click', () => {
    if (!mole.classList.contains('whacked')) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      mole.classList.add('whacked');
      mole.remove();
    }
  });

  hole.appendChild(mole);

  setTimeout(() => {
    mole.remove();
  }, moleInterval - 100);
}

function startGame() {
  score = 0;
  timeUp = false;
  scoreEl.textContent = 'Score: 0';
  startBtn.disabled = true;
  progress.style.width = '100%';
  gameOverScreen.style.display = 'none';

  const difficulty = difficultySelect.value;
  if (difficulty === 'easy') moleInterval = 900;
  else if (difficulty === 'medium') moleInterval = 700;
  else moleInterval = 500;

  let startTime = Date.now();

  moleTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;

    if (elapsed >= gameDuration) {
      timeUp = true;
      clearInterval(moleTimer);
      startBtn.disabled = false;
      progress.style.width = '0%';
      finalScoreEl.textContent = score;
      gameOverScreen.style.display = 'flex';
      return;
    }

    showMole();

    const timeLeftPercent = 100 - (elapsed / gameDuration) * 100;
    progress.style.width = `${timeLeftPercent}%`;
  }, moleInterval);
}

startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);
