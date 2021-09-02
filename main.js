let canvas; let ctx; let path;

function inspectMove(x, y) {
  if (invalidMove(curr, x, y)) return;
  const tile = getTile(curr.x + x, curr.y + y);

  if (addToOpen(tile)) return true;
}

function step() {
  setNextTile();

  for (let offset = 1; offset >= -1; offset--) if (inspectMove(0, offset) || inspectMove(offset, 0)) return true;

  open.sort((a, b) => (a.f > b.f ? -1 : 1));
  // if (open.length > 0) open[open.length - 1].color = CURRENT
}

async function init() {
  canvas = document.getElementById('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'white';

  resetBoard();

  while (open.length >= 1) {
    if (step()) break;
  }

  if (open.length === 0) return init();
}

init();
