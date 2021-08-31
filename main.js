async function init() {
  const [canvas] = getCanvas();
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  resetBoard();
  while (open.length >= 1) {
    if (step()) break;
  }

  if (open.length === 0) return init();

  generatePath();
}

function step() {
  curr = open.pop();
  closed.push(curr);

  for (let offset = 1; offset >= -1; offset--) {
    if (!Tile.isOrigin(0, offset) && !invalidMove(curr.x, curr.y, 0, offset)) {
      const selectedTileY = board[curr.x][curr.y + offset];

      addToOpen(selectedTileY);
      if (selectedTileY.y === COLS - 1) {
        generatePath();
        stop();
        return true;
      }
    }

    if (!Tile.isOrigin(offset, 0) && !invalidMove(curr.x, curr.y, offset, 0)) {
      const selectedTileX = board[curr.x + offset][curr.y];
      addToOpen(selectedTileX);
    }
  }

  open.sort((a, b) => (a.f > b.f ? -1 : 1));
  // if (open.length > 0) open[open.length - 1].color = CURRENT
}

function run() {
  loop = setInterval(() => {
    step();
  }, 1);
}

function stop() {
  clearInterval(loop);
}

let loop; let
  path;

init();
