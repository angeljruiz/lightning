function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawLine(x, y, toX, toY) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.closePath();
}

function drawSides() {
  drawLine(0, 0, 0, HEIGHT);
  drawLine(WIDTH, 0, WIDTH, HEIGHT);
}

function setColor(tile) {
  switch (tile.color) {
    case START:
      ctx.fillStyle = 'green';
      break;
    case END:
      ctx.fillStyle = 'red';
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
    default:
      ctx.fillStyle = 'violet';
  }
}

function fillNodes(nodes) {
  if (!Array.isArray(nodes)) nodes = [nodes];
  nodes.forEach((tile) => ctx.fillRect(tile.xPosition(), tile.yPosition(), TILE_SIZE, TILE_SIZE));
}

function drawTile(tile) {
  const {
    xPosition, fullXPosition, yPosition, fullYPosition,
  } = tile;
  ctx.fillStyle = 'white';
  let coords = {};

  switch (tile.type) {
    case TOP:
      coords = {
        x: xPosition(), y: yPosition(), toX: fullXPosition(), toY: yPosition(),
      };
      break;
    case RIGHT:
      coords = {
        x: fullXPosition(), y: yPosition(), toX: fullXPosition(), toY: fullYPosition(),
      };
      break;
    case BOTTOM:
      coords = {
        x: xPosition(), y: fullYPosition(), toX: fullXPosition(), toY: fullYPosition(),
      };
      break;
    case LEFT:
      coords = {
        x: xPosition(), y: yPosition(), toX: xPosition(), toY: fullYPosition(),
      };
      break;

    default:
      break;
  }
  drawLine(...Object.values(coords));

  if (tile.color !== EMPTY) {
    setColor(tile);
    fillNodes(tile);
  }

  // ctx.fillText(tile.x, tile.xPosition(), tile.yPosition() + 8)
  // ctx.fillText(tile.y, tile.xPosition() +12, tile.yPosition() + 8)
}

function drawBoard() {
  board.forEach((row, x) => row.forEach((__, y) => drawTile(getTile(x, y))));

  drawSides();
}

function createDelay(callback, delay, sDelay) {
  return new Promise((resolve) => setTimeout(async () => {
    if (callback) {
      callback();
      await new Promise((r) => setTimeout(r, delay * 4));
    }
    clearCanvas();
    drawBoard();
    if (sDelay) await new Promise((r) => setTimeout(r, sDelay));
    resolve();
  }, delay));
}

function setFadedColor(max, fadedness) { ctx.fillStyle = `rgba(255, 255, 255, ${1 - (0.25 * (max - fadedness))})`; }

async function animatePath() {
  for (const node of path) {
    const { step: currStep } = node;
    await createDelay(() => {
      fillNodes(node);

      for (let step = currStep - 1; step >= currStep - 5 && step >= 1; step--) {
        setFadedColor(currStep, step);
        board.forEach((row) => fillNodes(row.filter((tile) => tile.step === step)));
      }
    }, 13);
  }

  for (const tile of path.slice().reverse()) {
    fillNodes(tile);
    await createDelay(null, 12);
  }

  for (let index = 0; index < 6; index++) {
    fillNodes(path);
    await createDelay(null, index === 5 ? 450 : 10, index === 5 ? null : 50);
  }
}
