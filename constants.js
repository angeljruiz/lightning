const WIDTH = 320;
const HEIGHT = 640;
const TILE_SIZE = 16;
const ROWS = WIDTH / TILE_SIZE;
const COLS = HEIGHT / TILE_SIZE;
const [START, CURRENT, OPEN, CLOSED, END] = [1, 2, 3, 4, 5];
const TOP = 1;
const RIGHT = 2;
const BOTTOM = 3;
const LEFT = 4;
const EMPTY = 0;
function getCanvas() {
  const canvas = document.getElementById('canvas');
  return [canvas, canvas.getContext('2d')];
}
