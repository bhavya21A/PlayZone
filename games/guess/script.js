let randomNumber;
let maxGuesses;
let guessesLeft;
let hintsLeft;

const guessInput = document.getElementById("guess");
const guessButton = document.getElementById("guess-btn");
const message = document.getElementById("message");
const difficultySelect = document.getElementById("difficulty");
const attemptsDisplay = document.getElementById("attempts");
const rangeDisplay = document.getElementById("range-display");
const resetButton = document.getElementById("reset-btn");
const hintButton = document.getElementById("hint-btn");

function generateRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}

function startGame() {
    const difficulty = difficultySelect.value;

    if (difficulty === "easy") {
        randomNumber = generateRandomNumber(10);
        maxGuesses = 5;
        rangeDisplay.textContent = "(1-10)";
    } else if (difficulty === "medium") {
        randomNumber = generateRandomNumber(50);
        maxGuesses = 7;
        rangeDisplay.textContent = "(1-50)";
    } else {
        randomNumber = generateRandomNumber(100);
        maxGuesses = 10;
        rangeDisplay.textContent = "(1-100)";
    }

    guessesLeft = maxGuesses;
    hintsLeft = 3;

    attemptsDisplay.textContent = `Attempts Left: ${guessesLeft} | Hints Left: ${hintsLeft}`;

    message.textContent = "Game started! Make your guess.";
    message.className = "";

    guessInput.value = "";
    guessInput.disabled = false;
    guessButton.disabled = false;
    hintButton.disabled = false;
    resetButton.disabled = false;
    resetButton.style.display = "inline-block";
}

function checkGuess() {
    const userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess)) {
        showMessage("Please enter a valid number!", "error");
        return;
    }

    guessesLeft--;
    attemptsDisplay.textContent = `Attempts Left: ${guessesLeft} | Hints Left: ${hintsLeft}`;

    if (userGuess === randomNumber) {
        showMessage(`🎉 Correct! The number was ${randomNumber}`, "success");
        endGame();
    } else if (guessesLeft === 0) {
        showMessage(`❌ Game Over! The number was ${randomNumber}`, "error");
        endGame();
    } else {
        showMessage(userGuess > randomNumber ? "📉 Too high!" : "📈 Too low!", "error");
    }

    guessInput.value = "";
    guessInput.focus();
}

function giveHint() {
    if (hintsLeft <= 0) {
        showMessage("⚠ No hints left!", "warning");
        return;
    }

    let hint = "";
    if (hintsLeft === 3) {
        hint = randomNumber % 2 === 0 ? "The number is even." : "The number is odd.";
    } else if (hintsLeft === 2) {
        hint = isPrime(randomNumber) ? "The number is prime." : "The number is not prime.";
    } else if (hintsLeft === 1) {
        hint = randomNumber > (getRangeMax() / 2) ? "The number is in the upper half of the range." : "The number is in the lower half of the range.";
    }

    hintsLeft--;
    attemptsDisplay.textContent = `Attempts Left: ${guessesLeft} | Hints Left: ${hintsLeft}`;
    showMessage(`💡 Hint: ${hint}`, "info");
}

function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function getRangeMax() {
    if (difficultySelect.value === "easy") return 10;
    if (difficultySelect.value === "medium") return 50;
    return 100;
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

function endGame() {
    guessInput.disabled = true;
    guessButton.disabled = true;
    hintButton.disabled = true;
}

function resetGame() {
    startGame();
}

guessButton.addEventListener("click", checkGuess);
difficultySelect.addEventListener("change", startGame);
resetButton.addEventListener("click", resetGame);
hintButton.addEventListener("click", giveHint);

// Initialize game on page load
startGame();
