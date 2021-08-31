function generateType() {
  const chance = Math.random();

  if (chance <= 0.4) return Math.random() >= 0.5 ? RIGHT : LEFT;
  if (chance <= 0.75) return Math.random() >= 0.5 ? TOP : BOTTOM;
  return EMPTY;
}

function findStartingPoint() {
  let currTile = board[parseInt(ROWS / 2, 10)][0];
  if (currTile.type === EMPTY) return currTile;

  while (board[currTile.x - 1] && board[currTile.x - 1][0].type !== EMPTY) {
    currTile = board[currTile.x - 1][0];
  }
  if (currTile.type === EMPTY) return currTile;
  return null;
}

function resetBoard() {
  board = [];
  open = [];
  closed = [];

  for (let x = 0; x < ROWS; x++) {
    board.push([]);
    for (let y = 0; y < COLS; y++) {
      const newTile = new Tile(x, y, generateType());
      board[x].push(newTile);
    }
  }

  start = findStartingPoint();
  if (!start) return resetBoard();
  window.board = board;

  open.push(start);

  drawBoard();
}

function getCanvas() {
  const canvas = document.getElementById('canvas');
  return [canvas, canvas.getContext('2d')];
}

function clearCanvas() {
  const [c, ctx] = getCanvas();
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  return ctx;
}

function drawSides() {
  const [_, ctx] = getCanvas();

  ctx.moveTo(0, 0);
  ctx.lineTo(0, HEIGHT);
  ctx.stroke();

  ctx.moveTo(WIDTH, 0);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.stroke();
}

function drawBoard() {
  const ctx = clearCanvas();

  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLS; y++) {
      const selectedTile = board[x][y];
      ctx.beginPath();
      drawTile(selectedTile, ctx);
      ctx.closePath();
    }
  }

  drawSides();
}

function setColor(tile, ctx) {
  switch (tile.color) {
    case START:
      ctx.fillStyle = 'green';
      break;
    case END:
      ctx.fillStyle = 'red';
      break;
    case WALL:
      ctx.fillStyle = 'blue';
      break;
    case CLOSED:
      ctx.fillStyle = 'red';
      break;
    case OPEN:
      ctx.fillStyle = 'yellow';
      break;
    case CURRENT:
      ctx.fillStyle = 'violet';
      break;
  }
}

function drawTile(tile, ctx) {
  ctx.strokeStyle = 'white';
  switch (tile.type) {
    case TOP:
      ctx.moveTo(tile.x * TILE_SIZE, tile.y * TILE_SIZE);
      ctx.lineTo(tile.x * TILE_SIZE + TILE_SIZE, tile.y * TILE_SIZE);
      ctx.stroke();
      break;
    case RIGHT:
      ctx.moveTo(tile.x * TILE_SIZE + TILE_SIZE, tile.y * TILE_SIZE);
      ctx.lineTo(tile.x * TILE_SIZE + TILE_SIZE, tile.y * TILE_SIZE + TILE_SIZE);
      ctx.stroke();
      break;
    case BOTTOM:
      ctx.moveTo(tile.x * TILE_SIZE, tile.y * TILE_SIZE + TILE_SIZE);
      ctx.lineTo(tile.x * TILE_SIZE + TILE_SIZE, tile.y * TILE_SIZE + TILE_SIZE);
      ctx.stroke();
      break;
    case LEFT:
      ctx.moveTo(tile.x * TILE_SIZE, tile.y * TILE_SIZE);
      ctx.lineTo(tile.x * TILE_SIZE, tile.y * TILE_SIZE + TILE_SIZE);
      ctx.stroke();
      break;

    default:
      break;
  }

  if (tile.color !== EMPTY) {
    setColor(tile, ctx);
    ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  // ctx.fillStyle = 'white';
  // ctx.fillText(tile.x, tile.x * TILE_SIZE, tile.y * TILE_SIZE + 8)
  // ctx.fillText(tile.y, tile.x * TILE_SIZE +12, tile.y * TILE_SIZE + 8)
}

function getTile(x, y) {
  return board[parseInt(x / TILE_SIZE, 10)][parseInt(y / TILE_SIZE, 10)];
}

function changeType(x, y, type) {
  getTile(x, y).type = type;
}

function invalidPos(x, y) {
  return x < 0 || x >= ROWS || y < 0 || y >= COLS;
}

function getDistance(a, b) {
  let x = Math.abs(a.x - b.x);
  let y = Math.abs(a.y - b.y);
  let total = 0;

  while (x > 0 && y > 0) {
    total += 14;
    x -= 1;
    y -= 1;
  }
  total += x * 10;
  total += y * 10;

  return total;
}

function isOn(list, tile) { return list.find((t) => t === tile); }

function isWall(tile, x, y) {
  const currTile = board[x][y];

  if (tile.y < y) {
    return !!(tile.type === BOTTOM || currTile.type === TOP);
  } if (tile.y > y) {
    return !!(tile.type === TOP || currTile.type === BOTTOM);
  } if (tile.x < x) {
    return !!(tile.type === RIGHT || currTile.type === LEFT);
  } if (tile.x > x) {
    return !!(tile.type === LEFT || currTile.type === RIGHT);
  }
}

function isOrigin(x, y) { return x === 0 && y === 0; }

function invalidMove(x, y, offsetX, offsetY) {
  if (invalidPos(x + offsetX, y + offsetY)) return true;

  const tile = board[x + offsetX][y + offsetY];

  return isWall(tile, x, y)
    || isOn(closed, tile)
    || isOn(open, tile);
}

function addToOpen(tile) {
  tile.parent = curr;
  tile.g = getDistance(start, tile);
  tile.h = 0;
  tile.f = tile.g + tile.h;
  // tile.color = START
  tile.step = tile.parent.step + 1;
  open.push(tile);
}

let board; let start; let open; let closed; let
  curr;
