document.addEventListener('DOMContentLoaded', () => {
  const gridSize = 4;
  let grid = [];
  let score = 0;

  const gridContainer = document.getElementById('grid');
  const scoreElement = document.getElementById('score');
  const restartBtn = document.getElementById('restart');

  if (!gridContainer) {
    console.error('Error: #grid element not found. Check your HTML id.');
    return;
  }
  if (!scoreElement) console.warn('Warning: #score element not found.');
  if (!restartBtn) console.warn('Warning: #restart button not found.');

  // Initialize/Reset grid and score
  function initGrid() {
    score = 0;
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    addRandomTile();
    addRandomTile();
    updateGrid();
    updateScore();
    console.log('Game initialized');
  }

  // Render the grid (simple grid cells — CSS grid handles layout)
  function updateGrid() {
    gridContainer.innerHTML = '';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const value = grid[r][c];
        if (value !== 0) {
          cell.textContent = value;
          cell.setAttribute('data-value', value);
        } else {
          cell.textContent = '';
          cell.removeAttribute('data-value');
        }
        gridContainer.appendChild(cell);
      }
    }
  }

  // Score UI
  function updateScore() {
    if (scoreElement) scoreElement.textContent = score;
  }

  // Place a random 2 or 4 in an empty cell
  function addRandomTile() {
    const empties = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === 0) empties.push({ r, c });
      }
    }
    if (empties.length === 0) return false;
    const { r, c } = empties[Math.floor(Math.random() * empties.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  // Slide+merge logic for a single array (left)
  function slideAndMergeRow(row) {
    // filter zeros, merge adjacents, then pad with zeros
    let arr = row.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr[i + 1] = 0;
        i++; // skip next since it was merged
      }
    }
    arr = arr.filter(v => v !== 0);
    while (arr.length < gridSize) arr.push(0);
    return arr;
  }

  // Move left
  function moveLeft() {
    let moved = false;
    for (let r = 0; r < gridSize; r++) {
      const oldRow = grid[r].slice();
      const newRow = slideAndMergeRow(oldRow);
      if (newRow.toString() !== oldRow.toString()) {
        moved = true;
        grid[r] = newRow;
      }
    }
    return moved;
  }

  // Move right
  function moveRight() {
    let moved = false;
    for (let r = 0; r < gridSize; r++) {
      const oldRow = grid[r].slice();
      const reversed = oldRow.slice().reverse();
      const newReversed = slideAndMergeRow(reversed);
      const newRow = newReversed.reverse();
      if (newRow.toString() !== oldRow.toString()) {
        moved = true;
        grid[r] = newRow;
      }
    }
    return moved;
  }

  // Move up
  function moveUp() {
    let moved = false;
    for (let c = 0; c < gridSize; c++) {
      const col = [];
      for (let r = 0; r < gridSize; r++) col.push(grid[r][c]);
      const newCol = slideAndMergeRow(col);
      for (let r = 0; r < gridSize; r++) {
        if (grid[r][c] !== newCol[r]) moved = true;
        grid[r][c] = newCol[r];
      }
    }
    return moved;
  }

  // Move down
  function moveDown() {
    let moved = false;
    for (let c = 0; c < gridSize; c++) {
      const col = [];
      for (let r = 0; r < gridSize; r++) col.push(grid[r][c]);
      const reversed = col.slice().reverse();
      const newReversed = slideAndMergeRow(reversed);
      const newCol = newReversed.reverse();
      for (let r = 0; r < gridSize; r++) {
        if (grid[r][c] !== newCol[r]) moved = true;
        grid[r][c] = newCol[r];
      }
    }
    return moved;
  }

  // Check if any move or merge is possible (game over)
  function canMove() {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === 0) return true;
        if (c + 1 < gridSize && grid[r][c] === grid[r][c + 1]) return true;
        if (r + 1 < gridSize && grid[r][c] === grid[r + 1][c]) return true;
      }
    }
    return false;
  }

  // Check win
  function checkWin() {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === 2048) return true;
      }
    }
    return false;
  }

  // Handle key input
  function handleKey(e) {
    let moved = false;
    switch (e.key) {
      case 'ArrowLeft':
        moved = moveLeft();
        break;
      case 'ArrowRight':
        moved = moveRight();
        break;
      case 'ArrowUp':
        moved = moveUp();
        break;
      case 'ArrowDown':
        moved = moveDown();
        break;
      default:
        return; // ignore other keys
    }
    if (!moved) {
      console.log('No tiles moved for key:', e.key);
      return;
    }
    // after a valid move:
    addRandomTile();
    updateGrid();
    updateScore();

    if (checkWin()) {
      setTimeout(() => alert('🎉 You reached 2048! You win!'), 50);
    } else if (!canMove()) {
      setTimeout(() => alert('Game Over! No more moves.'), 50);
    }
  }

  // Restart button
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      initGrid();
    });
  }

  // Keyboard listener
  window.addEventListener('keydown', handleKey);

  // start
  initGrid();

  // For debugging: expose grid in console
  window._2048 = {
    getGrid: () => JSON.parse(JSON.stringify(grid)),
    init: initGrid
  };
});
