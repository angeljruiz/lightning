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
}
