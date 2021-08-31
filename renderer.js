function clearCanvas() {
  const [_, ctx] = getCanvas();
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

  for (let tile of path.slice().reverse()) {
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
