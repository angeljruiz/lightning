function clearCanvas() {
  const [_, ctx] = getCanvas();
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  return ctx;
}

function drawLine(x, y, toX, toY) {
  const [_, ctx] = getCanvas();
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

function setColor(tile, ctx) {
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

function drawTile(tile) {
  const [_, ctx] = getCanvas();
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
    setColor(tile, ctx);
    ctx.fillRect(xPosition(), yPosition(), TILE_SIZE, TILE_SIZE);
  }

  // ctx.fillStyle = 'white';
  // ctx.fillText(tile.x, tile.xPosition(), tile.yPosition() + 8)
  // ctx.fillText(tile.y, tile.xPosition() +12, tile.yPosition() + 8)
}

function drawBoard() {
  const [_] = getCanvas();
  board.forEach((row, x) => row.forEach((__, y) => drawTile(getTile(x, y))));

  drawSides();
}

function fillNodes(nodes, ctx) {
  nodes.forEach((tile) => ctx.fillRect(tile.xPosition(), tile.yPosition(), TILE_SIZE, TILE_SIZE));
}

function createDelay(callback, delay) {
  return new Promise((resolve) => setTimeout(() => {
    callback();
    resolve();
  }, delay));
}

async function delayedClearAndDraw(delay) {
  await createDelay(() => {
    clearCanvas();
    drawBoard();
  }, delay);
}

async function animatePath() {
  const [_, ctx] = getCanvas();

  for (const node of path) {
    await createDelay(async () => {
      ctx.fillRect(node.xPosition(), node.yPosition(), TILE_SIZE, TILE_SIZE);

      for (let step = node.step - 1; step >= node.step - 4 && step >= 1; step--) {
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - (0.3 * (node.step - step))})`;

        board.forEach((row) => fillNodes(row.filter((tile) => tile.step === step), ctx));
      }

      await delayedClearAndDraw(150);
    }, 50);
  }

  for (const tile of path.slice().reverse()) {
    ctx.fillRect(tile.xPosition(), tile.yPosition(), TILE_SIZE, TILE_SIZE);
    await delayedClearAndDraw(12);
  }

  for (let index = 0; index < 5; index++) {
    fillNodes(path, ctx);
    await delayedClearAndDraw(10);

    await createDelay(() => {}, 50);
  }

  fillNodes(path, ctx);
  await delayedClearAndDraw(450);
}
