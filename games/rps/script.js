const choices = document.querySelectorAll(".choice");
const playerScore = document.getElementById("player-score");
const cpuScore = document.getElementById("cpu-score");
const resultDiv = document.getElementById("result");

let player = 0;
let cpu = 0;

choices.forEach(button => {
  button.addEventListener("click", () => {
    const playerChoice = button.dataset.choice;
    const cpuChoice = getCPUChoice();
    const result = getResult(playerChoice, cpuChoice);
    displayResult(playerChoice, cpuChoice, result);
    updateScore(result);
  });
});

function getCPUChoice() {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * 3)];
}

function getResult(player, cpu) {
  if (player === cpu) return "draw";
  if (
    (player === "rock" && cpu === "scissors") ||
    (player === "paper" && cpu === "rock") ||
    (player === "scissors" && cpu === "paper")
  ) {
    return "win";
  } else {
    return "lose";
  }
}

function displayResult(player, cpu, result) {
  let message = `You chose ${emoji(player)}, CPU chose ${emoji(cpu)}. `;

  if (result === "win") {
    message += "You Win!";
  } else if (result === "lose") {
    message += "You Lose!";
  } else {
    message += "It's a Draw!";
  }

  resultDiv.textContent = message;
}

function emoji(choice) {
  return choice === "rock" ? "✊" : choice === "paper" ? "✋" : "✌️";
}

function updateScore(result) {
  if (result === "win") {
    player++;
    playerScore.textContent = player;
  } else if (result === "lose") {
    cpu++;
    cpuScore.textContent = cpu;
  }

  if (player === 5 || cpu === 5) {
    setTimeout(() => {
      alert(`${player === 5 ? "You" : "CPU"} win the game!`);
      player = 0;
      cpu = 0;
      playerScore.textContent = 0;
      cpuScore.textContent = 0;
      resultDiv.textContent = "";
    }, 100);
  }
}
