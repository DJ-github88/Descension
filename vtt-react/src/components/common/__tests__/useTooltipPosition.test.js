import { renderHook, act } from '@testing-library/react';
import { useTooltipPosition } from '../useTooltipPosition';

describe('useTooltipPosition', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    window.innerWidth = 1920;
    window.innerHeight = 1080;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
  });

  it('positions tooltip above anchor point in the lower half of the viewport so it never overflows the bottom', () => {
    const position = { x: 450, y: 1000 };
    const { result } = renderHook(() =>
      useTooltipPosition(position, true, {
        estimateHeight: 450,
        estimateWidth: 380,
        offsetX: 16
      })
    );

    const { adjustedPosition } = result.current;
    // With viewportHeight 1080 and estimateHeight 450:
    // Tooltip must sit cleanly above position.y and its bottom must not exceed viewportHeight - padding
    expect(adjustedPosition.y).toBeLessThan(1000);
    expect(adjustedPosition.y + 450).toBeLessThanOrEqual(1080);
    expect(adjustedPosition.y).toBeGreaterThanOrEqual(24);
  });

  it('clamps horizontally so tooltip never extends beyond the right screen edge', () => {
    const position = { x: 1850, y: 500 };
    const { result } = renderHook(() =>
      useTooltipPosition(position, true, {
        estimateHeight: 300,
        estimateWidth: 380,
        offsetX: 16
      })
    );

    const { adjustedPosition } = result.current;
    expect(adjustedPosition.x + 380).toBeLessThanOrEqual(1920);
    expect(adjustedPosition.x).toBeGreaterThanOrEqual(16);
  });

  it('clamps horizontally so tooltip never extends beyond the left screen edge', () => {
    const position = { x: 5, y: 500 };
    const { result } = renderHook(() =>
      useTooltipPosition(position, true, {
        estimateHeight: 300,
        estimateWidth: 380,
        offsetX: 16
      })
    );

    const { adjustedPosition } = result.current;
    expect(adjustedPosition.x).toBeGreaterThanOrEqual(16);
  });

  it('supports explicit anchor="above" regardless of vertical position', () => {
    const position = { x: 500, y: 300 }; // upper screen
    const { result } = renderHook(() =>
      useTooltipPosition(position, true, {
        estimateHeight: 200,
        estimateWidth: 300,
        anchor: 'above'
      })
    );

    const { adjustedPosition } = result.current;
    expect(adjustedPosition.y).toBeLessThan(300);
    expect(adjustedPosition.y + 200).toBeLessThanOrEqual(300);
  });

  it('positions tooltip adjacent below cursor when there is ample space below in auto mode', () => {
    const position = { x: 500, y: 300 };
    const { result } = renderHook(() =>
      useTooltipPosition(position, true, {
        estimateHeight: 250,
        estimateWidth: 300
      })
    );

    const { adjustedPosition } = result.current;
    expect(adjustedPosition.y).toBe(312);
  });

  it('keeps tooltip adjacent to cursor in lower viewport instead of catapulting it far away', () => {
    // When hovering near bottom (e.g. y = 620) on an 800px viewport with a 350px tooltip:
    window.innerHeight = 800;
    const position = { x: 450, y: 620 };
    const { result } = renderHook(() =>
      useTooltipPosition(position, true, {
        estimateHeight: 350,
        estimateWidth: 300,
        offsetX: 16
      })
    );

    const { adjustedPosition } = result.current;
    // Clamped against bottom edge: maxY = 800 - 350 - 24 = 426
    expect(adjustedPosition.y).toBe(426);
    // Distance between cursor (620) and tooltip top (426) is 194px, meaning cursor sits alongside
    // the tooltip body (426..776), NOT catapulted 362px away (which would have been 258px)
    expect(adjustedPosition.y).toBeGreaterThan(258);
  });
});

