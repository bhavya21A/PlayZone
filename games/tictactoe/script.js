const cells = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessage = document.getElementById("winningMessage");
const winningText = document.getElementById("winningText");
const restartButton = document.getElementById("restartButton");

let circleTurn;
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  circleTurn = false;
  cells.forEach(cell => {
    cell.textContent = ""; // Clear the X or O
    cell.classList.remove("X", "O");
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  winningMessage.classList.remove("show");
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? "O" : "X";
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}

function placeMark(cell, currentClass) {
  cell.textContent = currentClass; // ✅ Actually show "X" or "O"
  cell.classList.add(currentClass); // Optional: use this for custom styling
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function endGame(draw) {
  if (draw) {
    winningText.innerText = "Draw!";
  } else {
    winningText.innerText = `${circleTurn ? "O" : "X"} Wins!`;
  }
  winningMessage.classList.add("show");
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.classList.contains("X") || cell.classList.contains("O");
  });
}
