/**
 * Clamp a floating popover's top-left position so the whole panel stays inside
 * the viewport. The book editor's Insert Block palette opens at the click
 * point; clamping keeps its lower-right options reachable near screen edges.
 */
export function clampPopoverPosition({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  viewportWidth = 0,
  viewportHeight = 0,
  margin = 12,
  offsetX = 0,
  offsetY = 8
} = {}) {
  const vw = Number.isFinite(viewportWidth) ? viewportWidth : 0;
  const vh = Number.isFinite(viewportHeight) ? viewportHeight : 0;
  const panelWidth = Number.isFinite(width) ? Math.max(0, width) : 0;
  const panelHeight = Number.isFinite(height) ? Math.max(0, height) : 0;
  const safeMargin = Number.isFinite(margin) ? Math.max(0, margin) : 0;

  const clickX = Number.isFinite(x) ? x : 0;
  const clickY = Number.isFinite(y) ? y : 0;

  const maxLeft = Math.max(safeMargin, vw - panelWidth - safeMargin);
  const maxTop = Math.max(safeMargin, vh - panelHeight - safeMargin);

  return {
    left: Math.min(Math.max(safeMargin, clickX + offsetX), maxLeft),
    top: Math.min(Math.max(safeMargin, clickY + offsetY), maxTop)
  };
}
