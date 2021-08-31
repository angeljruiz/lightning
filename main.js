let path;

function step() {
  setNextTile();
  for (let offset = 1; offset >= -1; offset--) {
    if (!invalidMove(curr, 0, offset)) {
      const selectedTileY = getTile(curr.x, curr.y + offset);

      if (addToOpen(selectedTileY)) return true;
    }

    if (!invalidMove(curr, offset, 0)) {
      const selectedTileX = getTile(curr.x + offset, curr.y);
      addToOpen(selectedTileX);
    }
  }

  open.sort((a, b) => (a.f > b.f ? -1 : 1));
  // if (open.length > 0) open[open.length - 1].color = CURRENT
}

async function init() {
  const [canvas, ctx] = getCanvas();
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx.strokeStyle = 'white';

  resetBoard();

  while (open.length >= 1) {
    if (step()) break;
  }

  if (open.length === 0) return init();
}

init();
