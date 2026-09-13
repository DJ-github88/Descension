import { clampPopoverPosition } from '../popoverPosition';

describe('clampPopoverPosition', () => {
  const viewport = { viewportWidth: 1000, viewportHeight: 800 };

  it('anchors the popover at the click point plus a small offset', () => {
    expect(clampPopoverPosition({ x: 400, y: 300, width: 480, height: 420, ...viewport }))
      .toEqual({ left: 400, top: 308 });
  });

  it('keeps the popover inside the right and bottom edges', () => {
    expect(clampPopoverPosition({ x: 990, y: 790, width: 480, height: 420, ...viewport }))
      .toEqual({ left: 1000 - 480 - 12, top: 800 - 420 - 12 });
  });

  it('never pushes the popover past the top-left margin', () => {
    expect(clampPopoverPosition({ x: 5, y: 5, width: 480, height: 420, ...viewport }))
      .toEqual({ left: 12, top: 13 });
  });

  it('pins to the margin when the popover is larger than the viewport', () => {
    expect(clampPopoverPosition({ x: 500, y: 400, width: 1200, height: 900, ...viewport }))
      .toEqual({ left: 12, top: 12 });
  });

  it('applies custom offsets and margins', () => {
    expect(clampPopoverPosition({ x: 100, y: 100, width: 0, height: 0, margin: 20, offsetX: 10, offsetY: 20, ...viewport }))
      .toEqual({ left: 110, top: 120 });
  });

  it('falls back safely for missing or invalid values', () => {
    expect(clampPopoverPosition()).toEqual({ left: 12, top: 12 });
    expect(clampPopoverPosition({ x: NaN, y: undefined, width: NaN, height: NaN, viewportWidth: NaN, viewportHeight: NaN }))
      .toEqual({ left: 12, top: 12 });
  });
});
