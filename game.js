const BOARD_SIZE = 8;
const boardElem = document.getElementById('board');
const turnText = document.getElementById('turn-text');

let board = [];
let currentPlayer = 'black';
let selected = null;

function updateCounters() {
  let blackCount = 0;
  let whiteCount = 0;
  for(let y=0; y<BOARD_SIZE; y++) {
    for(let x=0; x<BOARD_SIZE; x++) {
      if(board[y][x] === 'black') blackCount++;
      else if(board[y][x] === 'white') whiteCount++;
    }
  }
  const blackCounter = document.getElementById('black-count');
  const whiteCounter = document.getElementById('white-count');
  if (blackCounter) blackCounter.textContent = `Black pieces: ${blackCount}`;
  if (whiteCounter) whiteCounter.textContent = `White pieces: ${whiteCount}`;
}

function updateTurnText() {
  turnText.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1) + "'s turn";
}

function initBoard() {
  board = [];
  for(let y=0; y<BOARD_SIZE; y++) {
    const row = [];
    for(let x=0; x<BOARD_SIZE; x++) {
      if (y === 0) row.push('black');
      else if (y === BOARD_SIZE-1) row.push('white');
      else row.push(null);
    }
    board.push(row);
  }
}

function renderBoard() {
  boardElem.innerHTML = '';
  for(let y=0; y<BOARD_SIZE; y++) {
    for(let x=0; x<BOARD_SIZE; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (selected && selected.x === x && selected.y === y) {
        cell.classList.add('selected');
      }

      const piece = board[y][x];
      if(piece) {
        const pieceDiv = document.createElement('div');
        pieceDiv.classList.add('piece', piece);
        cell.appendChild(pieceDiv);
      }
      boardElem.appendChild(cell);
    }
  }
  updateCounters();
  updateTurnText();
}

function isOrthogonalMove(x1, y1, x2, y2) {
  return (x1 === x2 || y1 === y2);
}

function isPathClear(x1, y1, x2, y2) {
  if (x1 === x2) {
    const step = y2 > y1 ? 1 : -1;
    for(let y = y1 + step; y !== y2; y += step) {
      if(board[y][x1] !== null) return false;
    }
  } else {
    const step = x2 > x1 ? 1 : -1;
    for(let x = x1 + step; x !== x2; x += step) {
      if(board[y1][x] !== null) return false;
    }
  }
  return true;
}

function checkCapture(x, y) {
  const opponent = currentPlayer === 'black' ? 'white' : 'black';
  const directions = [
    [0,1], [1,0], [0,-1], [-1,0]
  ];
  for(const [dx, dy] of directions) {
    const midX = x + dx;
    const midY = y + dy;
    const endX = x + dx*2;
    const endY = y + dy*2;
    if (
      midX >= 0 && midX < BOARD_SIZE && midY >= 0 && midY < BOARD_SIZE &&
      endX >= 0 && endX < BOARD_SIZE && endY >= 0 && endY < BOARD_SIZE
    ) {
      if (
        board[midY][midX] === opponent &&
        board[endY][endX] === currentPlayer
      ) {
        board[midY][midX] = null;
      }
    }
  }
}

boardElem.addEventListener('click', e => {
  const cell = e.target.closest('.cell');
  if(!cell) return;

  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);

  if(selected) {
    if(board[y][x] === null && isOrthogonalMove(selected.x, selected.y, x, y) && isPathClear(selected.x, selected.y, x, y)) {
      board[y][x] = board[selected.y][selected.x];
      board[selected.y][selected.x] = null;

      checkCapture(x, y);

      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    }
    selected = null;
    renderBoard();
  } else {
    if(board[y][x] === currentPlayer) {
      selected = {x, y};
      renderBoard();
    }
  }
});

initBoard();
renderBoard();
