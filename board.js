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
      const newTile = new Tile(x, y, Tile.generateType());
      board[x].push(newTile);
    }
  }

  start = findStartingPoint();
  if (!start) return resetBoard();
  window.board = board;

  open.push(start);

  drawBoard();
}

function invalidPos(x, y) {
  return x < 0 || x >= ROWS || y < 0 || y >= COLS;
}

function isOn(list, tile) { return list.find((t) => t === tile); }

function invalidMove(x, y, offsetX, offsetY) {
  if (invalidPos(x + offsetX, y + offsetY)) return true;

  const tile = board[x + offsetX][y + offsetY];

  return Tile.isWall(tile, x, y)
    || isOn(closed, tile)
    || isOn(open, tile);
}

function addToOpen(tile) {
  tile.parent = curr;
  tile.g = Tile.getDistance(start, tile);
  tile.h = 0;
  tile.f = tile.g + tile.h;
  // tile.color = START
  tile.step = tile.parent.step + 1;
  open.push(tile);
}

function generatePath() {
  path = [open[open.length - 1]];
  let curr = path[0];
  // curr.color = END

  while (curr.parent !== null) {
    path.push(curr.parent);
    // curr.parent.color = END
    curr = curr.parent;
  }
  path = path.reverse();
}

let board; let start; let open; let closed; let
  curr;
