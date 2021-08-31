class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.f = -1;
    this.g = -1;
    this.h = -1;
    this.type = Tile.generateType();
    this.step = 0;
    this.color = 0;
    this.parent = null;
    this.xPosition = this.xPosition.bind(this);
    this.yPosition = this.yPosition.bind(this);
    this.fullXPosition = this.fullXPosition.bind(this);
    this.fullYPosition = this.fullYPosition.bind(this);
  }

  xPosition() { return this.x * TILE_SIZE; }

  fullXPosition() { return this.xPosition() + TILE_SIZE; }

  yPosition() { return this.y * TILE_SIZE; }

  fullYPosition() { return this.yPosition() + TILE_SIZE; }

  static generateType() {
    const chance = Math.random();

    if (chance <= 0.45) return Math.random() >= 0.5 ? RIGHT : LEFT;
    if (chance <= 0.85) return Math.random() >= 0.5 ? TOP : BOTTOM;
    return EMPTY;
  }

  static getDistance(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }

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
