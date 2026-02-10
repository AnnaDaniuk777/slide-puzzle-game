const ROWS = 3;
const COLS = 3;
const IMG_PATH = 'img/';
const EMPTY_TILE = '3';

let turns = 0;
let boardState = [];

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// Find coordinates of empty tile
function findEmptyTile() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (boardState[r][c] === EMPTY_TILE) {
        return { row: r, col: c };
      }
    }
  }

  return null;
}

// Create and display the game board
function createBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';

  // Create tile numbers (1-9, where 3 is empty)
  let tileNumbers = ['1', '2', '4', '5', '6', '7', '8', '9', EMPTY_TILE];

  // Shuffle non-empty tiles, keep empty at the end
  tileNumbers = shuffleArray(tileNumbers.slice(0, 8));
  tileNumbers.push(EMPTY_TILE);

  // Initialize board state
  boardState = [];

  for (let r = 0; r < ROWS; r++) {
    boardState[r] = [];

    for (let c = 0; c < COLS; c++) {
      const index = r * COLS + c;
      const tileNumber = tileNumbers[index];
      boardState[r][c] = tileNumber;

      // Create tile element
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.row = r;
      tile.dataset.col = c;

      if (tileNumber !== EMPTY_TILE) {
        const img = document.createElement('img');
        img.src = IMG_PATH + tileNumber + '.jpg';
        img.alt = `Piece ${tileNumber}`;
        img.dataset.number = tileNumber;

        // Add click handler
        img.addEventListener('click', tileClickHandler);

        tile.appendChild(img);
      } else {
        tile.classList.add('empty');
      }

      boardElement.appendChild(tile);
    }
  }

  // Reset turn counter
  turns = 0;
  document.getElementById('turns').textContent = turns;
}

// Handle tile click
function tileClickHandler(event) {
  const clickedImg = event.target;
  const tile = clickedImg.parentElement;
  const row = parseInt(tile.dataset.row);
  const col = parseInt(tile.dataset.col);

  const emptyPos = findEmptyTile();

  // Check if tile can be moved (adjacent to empty)
  const rowDiff = Math.abs(row - emptyPos.row);
  const colDiff = Math.abs(col - emptyPos.col);

  if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
    // Swap tile with empty space
    const emptyTile = document.querySelector(`.tile[data-row="${emptyPos.row}"][data-col="${emptyPos.col}"]`);

    emptyTile.innerHTML = '';
    emptyTile.appendChild(clickedImg);
    emptyTile.classList.remove('empty');

    tile.innerHTML = '';
    tile.classList.add('empty');

    // Update board state
    boardState[emptyPos.row][emptyPos.col] = clickedImg.dataset.number;
    boardState[row][col] = EMPTY_TILE;

    // Update turn counter
    turns++;
    document.getElementById('turns').textContent = turns;

    // Check for win
    checkWin();
  }
}

// Check if puzzle is solved
function checkWin() {
  const winState = [
    ['1', '2', '4'],
    ['5', '6', '7'],
    ['8', '9', EMPTY_TILE]
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (boardState[r][c] !== winState[r][c]) {
        return false;
      }
    }
  }

  // Puzzle solved!
  setTimeout(() => {
    alert(`🎉 Congratulations! You solved the puzzle in ${turns} moves!`);
  }, 100);

  return true;
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
  createBoard();

  // Add shuffle button functionality
  document.getElementById('shuffle-btn').addEventListener('click', createBoard);
});
