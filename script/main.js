const ROWS = 3;
const COLS = 3;
const IMG_PATH = 'img/';
const EMPTY_TILE = '3';

let turns = 0;
let boardState = [];
let draggedTile = null;

/* ================== UTILS ================== */

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isAdjacent(r1, c1, r2, c2) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

function findEmptyTile() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (boardState[r][c] === EMPTY_TILE) {
        return { row: r, col: c };
      }
    }
  }
}

/* ================== CORE MOVE LOGIC ================== */

function moveTile(fr, fc, tr, tc, img) {
  const fromTile = document.querySelector(`.tile[data-row="${fr}"][data-col="${fc}"]`);
  const toTile = document.querySelector(`.tile[data-row="${tr}"][data-col="${tc}"]`);

  img.style.transform = 'scale(1.05)';

  setTimeout(() => {
    toTile.innerHTML = '';
    toTile.appendChild(img);
    toTile.classList.remove('empty');

    fromTile.innerHTML = '';
    fromTile.classList.add('empty');

    img.style.transform = '';

    boardState[tr][tc] = img.dataset.number;
    boardState[fr][fc] = EMPTY_TILE;

    turns++;
    document.getElementById('turns').textContent = turns;

    checkWin();
  }, 50);

  highlightMoves();
  vibrate();
}

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
}

/* ================== EVENTS ================== */

function handleDragStart(e) {
  draggedTile = e.target;
  draggedTile.classList.add('dragging');
}

function handleDragEnd() {
  draggedTile?.classList.remove('dragging');
  draggedTile = null;
}

function handleDrop(e) {
  e.preventDefault();
  if (!draggedTile) return;

  const fromTile = draggedTile.parentElement;
  const toTile = e.currentTarget;

  if (!toTile.classList.contains('empty')) return;

  const fr = +fromTile.dataset.row;
  const fc = +fromTile.dataset.col;
  const tr = +toTile.dataset.row;
  const tc = +toTile.dataset.col;

  if (isAdjacent(fr, fc, tr, tc)) {
    moveTile(fr, fc, tr, tc, draggedTile);
  }

  draggedTile.classList.remove('dragging');
  draggedTile = null;
}

function handleClick(e) {
  const img = e.target;
  const tile = img.parentElement;

  const r = +tile.dataset.row;
  const c = +tile.dataset.col;

  const empty = findEmptyTile();

  if (isAdjacent(r, c, empty.row, empty.col)) {
    moveTile(r, c, empty.row, empty.col, img);
  }
}

/* ================== TILE / BOARD ================== */

function createTile(r, c, number) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.dataset.row = r;
  tile.dataset.col = c;

  tile.addEventListener('dragover', e => e.preventDefault());
  tile.addEventListener('drop', handleDrop);

  if (number === EMPTY_TILE) {
    tile.classList.add('empty');
    return tile;
  }

  const img = document.createElement('img');
  img.src = `${IMG_PATH}${number}.jpg`;
  img.alt = `Piece ${number}`;
  img.dataset.number = number;
  img.draggable = true;

  img.addEventListener('dragstart', handleDragStart);
  img.addEventListener('dragend', handleDragEnd);
  img.addEventListener('click', handleClick);

  tile.appendChild(img);
  return tile;
}

function createBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  let tiles = shuffleArray(['1', '2', '4', '5', '6', '7', '8', '9']);
  tiles.push(EMPTY_TILE);

  boardState = [];
  turns = 0;
  document.getElementById('turns').textContent = turns;

  for (let r = 0; r < ROWS; r++) {
    boardState[r] = [];
    for (let c = 0; c < COLS; c++) {
      const num = tiles[r * COLS + c];
      boardState[r][c] = num;
      board.appendChild(createTile(r, c, num));
    }
  }

  highlightMoves();
}

function highlightMoves() {
  document.querySelectorAll('.tile').forEach(t => t.classList.remove('hint'));

  const empty = findEmptyTile();

  const dirs = [
    [1, 0], [-1, 0],
    [0, 1], [0, -1]
  ];

  dirs.forEach(([dr, dc]) => {
    const r = empty.row + dr;
    const c = empty.col + dc;

    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      const tile = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
      tile?.classList.add('hint');
    }
  });
}


/* ================== WIN CHECK ================== */

function checkWin() {
  const winState = [
    ['1', '2', '4'],
    ['5', '6', '7'],
    ['8', '9', EMPTY_TILE]
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (boardState[r][c] !== winState[r][c]) return;
    }
  }

  document.getElementById('board').classList.add('win');

  setTimeout(() => {
    alert(`🎉 Congratulations! You solved the puzzle in ${turns} moves!`);
  }, 300);
}

/* ================== INIT ================== */

document.addEventListener('DOMContentLoaded', () => {
  createBoard();
  document.getElementById('shuffle-btn').addEventListener('click', createBoard);
});
