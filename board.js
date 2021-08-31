let board; let start; let open; let closed;
let curr;

function invalidPos(x, y) {
  return x < 0 || x >= ROWS || y < 0 || y >= COLS;
}

function getTile(x, y) {
  if (invalidPos(x, y)) { return null; }
  return board[x][y];
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

  start = getTile(parseInt(ROWS / 2, 10), 0);

  open.push(start);

  drawBoard();
}

function isOn(list, tile) { return list.find((t) => t === tile); }

function setNextTile() {
  curr = open.pop();
  closed.push(curr);
}

function invalidMove(tile, offsetX, offsetY) {
  const nextTile = getTile(tile.x + offsetX, tile.y + offsetY);

  if (Tile.isOrigin(offsetX, offsetY) || !nextTile) return true;

  return Tile.isWall(nextTile, tile)
    || isOn(closed, nextTile)
    || isOn(open, nextTile);
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
  [curr] = path;
  // curr.color = END

  while (curr.parent !== null) {
    path.push(curr.parent);
    // curr.parent.color = END
    curr = curr.parent;
  }
  path = path.reverse();
}
