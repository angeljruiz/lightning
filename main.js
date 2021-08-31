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
    if (!isOrigin(0, offset) && !invalidMove(curr.x, curr.y, 0, offset)) {
      const selectedTileY = board[curr.x][curr.y + offset];

      addToOpen(selectedTileY);
      if (selectedTileY.y === COLS - 1) {
        generatePath();
        stop();
        return true;
      }
    }

    if (!isOrigin(offset, 0) && !invalidMove(curr.x, curr.y, offset, 0)) {
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

  return path;
}

function fillNodes(nodes, ctx) {
  nodes.forEach((tile) => {
    ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });
}

async function animatePath() {
  const [_, ctx] = getCanvas();
  for (const node of path) {
    await new Promise((resolve) => setTimeout(async () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(node.x * TILE_SIZE, node.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      for (let step = node.step - 1; step >= node.step - 4 && step >= 1; step--) {
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - (0.3 * (node.step - step))})`;

        board.forEach((row) => fillNodes(row.filter((tile) => tile.step === step), ctx));
      }

      await new Promise((resolve) => setTimeout(() => {
        clearCanvas();
        drawBoard();
        resolve();
      }, 125));
      resolve();
    }, 50));
  }
  ctx.fillStyle = 'white';

  for (const tile of path.slice().reverse()) {
    ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    await new Promise((resolve) => setTimeout(() => {
      clearCanvas();
      drawBoard();
      resolve();
    }, 15));
  }

  for (let index = 0; index < 5; index++) {
    fillNodes(path, ctx);
    await new Promise((resolve) => setTimeout(() => {
      clearCanvas();
      drawBoard();
      resolve();
    }, 10));

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  fillNodes(path, ctx);
  await new Promise((resolve) => setTimeout(() => {
    clearCanvas();
    drawBoard();
    resolve();
  }, 450));
}

let loop; let
  path;

init();
