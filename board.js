let board; let start; let open; let closed; let curr;

function invalidPos(x, y) { return x < 0 || x >= ROWS || y < 0 || y >= COLS; }

function getTile(x, y) {
  if (invalidPos(x, y)) { return null; }
  return board[x][y];
}

function resetBoard() {
  board = new Array(ROWS).fill(new Array(COLS).fill(1));
  board = board.map((row, x) => row.map((_, y) => new Tile(x, y)));

  open = [];
  closed = [];
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

  return Tile.isWall(tile, nextTile)
    || isOn(closed, nextTile)
    || isOn(open, nextTile);
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

function addToOpen(tile) {
  tile.parent = curr;
  tile.g = Tile.getDistance(start, tile);
  tile.h = 0;
  tile.f = tile.g + tile.h;
  // tile.color = START
  tile.step = tile.parent.step + 1;
  open.push(tile);

  if (tile.y === COLS - 1) {
    generatePath();
    return true;
  }
}
