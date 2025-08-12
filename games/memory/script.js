const icons = ["🍕", "🚀", "👾", "🎮", "🐱", "🍄", "🌟", "💣"];
let cards = [...icons, ...icons];
let board = document.getElementById('game-board');
let moves = 0;
let flippedCards = [];
let matchedPairs = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  shuffle(cards);
  board.innerHTML = '';
  moves = 0;
  matchedPairs = 0;
  flippedCards = [];
  document.getElementById('moves').textContent = "Moves: 0";

  cards.forEach((icon, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.icon = icon;
    card.dataset.index = index;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard(e) {
  const clicked = e.target;
  if (clicked.classList.contains('revealed') || flippedCards.length === 2) return;

  clicked.textContent = clicked.dataset.icon;
  clicked.classList.add('revealed');
  flippedCards.push(clicked);

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById('moves').textContent = `Moves: ${moves}`;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.icon === card2.dataset.icon) {
    matchedPairs++;
    flippedCards = [];

    if (matchedPairs === icons.length) {
      setTimeout(() => alert(`You win in ${moves} moves!`), 200);
    }
  } else {
    setTimeout(() => {
      card1.textContent = '';
      card2.textContent = '';
      card1.classList.remove('revealed');
      card2.classList.remove('revealed');
      flippedCards = [];
    }, 800);
  }
}

document.getElementById('restart').addEventListener('click', createBoard);
createBoard();
