// Infinite Grid System for VTT
export class InfiniteGridSystem {
  constructor(gridSize = 50) {
    this.gridSize = gridSize;
    this.viewportWidth = 0;
    this.viewportHeight = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  setViewport(width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  setOffset(x, y) {
    this.offsetX = x;
    this.offsetY = y;
  }

  getVisibleGridBounds() {
    const startX = Math.floor(-this.offsetX / this.gridSize) - 1;
    const startY = Math.floor(-this.offsetY / this.gridSize) - 1;
    const endX = Math.ceil((this.viewportWidth - this.offsetX) / this.gridSize) + 1;
    const endY = Math.ceil((this.viewportHeight - this.offsetY) / this.gridSize) + 1;

    return { startX, startY, endX, endY };
  }

  getGridLines() {
    const bounds = this.getVisibleGridBounds();
    const lines = [];

    // Vertical lines
    for (let x = bounds.startX; x <= bounds.endX; x++) {
      const xPos = x * this.gridSize + this.offsetX;
      lines.push({
        type: 'vertical',
        x: xPos,
        y1: bounds.startY * this.gridSize + this.offsetY,
        y2: bounds.endY * this.gridSize + this.offsetY
      });
    }

    // Horizontal lines
    for (let y = bounds.startY; y <= bounds.endY; y++) {
      const yPos = y * this.gridSize + this.offsetY;
      lines.push({
        type: 'horizontal',
        x1: bounds.startX * this.gridSize + this.offsetX,
        x2: bounds.endX * this.gridSize + this.offsetX,
        y: yPos
      });
    }

    return lines;
  }

  snapToGrid(x, y) {
    return {
      x: Math.round(x / this.gridSize) * this.gridSize,
      y: Math.round(y / this.gridSize) * this.gridSize
    };
  }

  getGridCoordinates(x, y) {
    return {
      gridX: Math.floor(x / this.gridSize),
      gridY: Math.floor(y / this.gridSize)
    };
  }
}

// Factory function to create grid system
export function createGridSystem(gameStore) {
  return new InfiniteGridSystem(gameStore.getState().gridSize || 50);
}

// Get existing grid system instance
export function getGridSystem() {
  if (!window.gridSystem) {
    window.gridSystem = new InfiniteGridSystem(50);
  }
  return window.gridSystem;
}

export default InfiniteGridSystem;
