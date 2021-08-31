class Tile {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.f = -1;
    this.g = -1;
    this.h = -1;
    this.type = type;
    this.step = 0;
    this.color = 0;
    this.parent = null;
  }

  static generateType() {
    const chance = Math.random();

    if (chance <= 0.4) return Math.random() >= 0.5 ? RIGHT : LEFT;
    if (chance <= 0.75) return Math.random() >= 0.5 ? TOP : BOTTOM;
    return EMPTY;
  }

  static getDistance(a, b) {
    let x = Math.abs(a.x - b.x);
    let y = Math.abs(a.y - b.y);
    let total = 0;

    while (x > 0 && y > 0) {
      total += 14;
      x -= 1;
      y -= 1;
    }
    total += x * 10;
    total += y * 10;

    return total;
  }

  static isWall(tile, x, y) {
    const currTile = board[x][y];

    if (tile.y < y) {
      return !!(tile.type === BOTTOM || currTile.type === TOP);
    } if (tile.y > y) {
      return !!(tile.type === TOP || currTile.type === BOTTOM);
    } if (tile.x < x) {
      return !!(tile.type === RIGHT || currTile.type === LEFT);
    } if (tile.x > x) {
      return !!(tile.type === LEFT || currTile.type === RIGHT);
    }

    return false;
  }

  static isOrigin(x, y) { return x === 0 && y === 0; }
}
