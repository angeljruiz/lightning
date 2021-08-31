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

    if (chance <= 0.45) return Math.random() >= 0.5 ? RIGHT : LEFT;
    if (chance <= 0.85) return Math.random() >= 0.5 ? TOP : BOTTOM;
    return EMPTY;
  }

  static getDistance(a, b) {
    const x = Math.abs(a.x - b.x);
    const y = Math.abs(a.y - b.y);
    let total = 0;

    total += x * 10;
    total += y * 10;

    return total;
  }

  static isWall(tile, nextTile) {
    if (tile.y < nextTile.y) {
      return !!(tile.type === BOTTOM || nextTile.type === TOP);
    } if (tile.y > nextTile.y) {
      return !!(tile.type === TOP || nextTile.type === BOTTOM);
    } if (tile.x < nextTile.x) {
      return !!(tile.type === RIGHT || nextTile.type === LEFT);
    } if (tile.x > nextTile.x) {
      return !!(tile.type === LEFT || nextTile.type === RIGHT);
    }

    return false;
  }

  static isOrigin(x, y) { return x === 0 && y === 0; }
}
