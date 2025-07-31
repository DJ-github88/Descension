# Performance Optimizations for VTT Grid System

This document outlines the performance optimizations implemented to address lag issues when drawing tiles and zooming.

## Issues Identified

1. **Excessive Re-rendering**: Grid tiles were regenerated on every camera/zoom change
2. **No Event Throttling**: Zoom and pan events triggered immediate full re-renders
3. **Canvas Redrawing**: Multiple canvas layers redrew completely on every change
4. **Large Dependency Arrays**: useEffect hooks with many dependencies caused frequent re-renders
5. **No Viewport Culling**: All tiles were processed even when not visible
6. **Missing React.memo**: Components weren't memoized to prevent unnecessary re-renders

## Optimizations Implemented

### 1. Performance Utilities (`vtt-react/src/utils/performanceUtils.js`)

Created a comprehensive performance utilities module with:

- **Throttle Function**: Limits how often functions can be called
- **Debounce Function**: Delays execution until after inactivity period
- **RAF Throttle**: RequestAnimationFrame-based throttling for smooth animations
- **Performance Monitor**: Tracks render times and logs warnings for slow operations
- **Viewport Culling**: Utility to check if rectangles are visible
- **Object Pool**: Memory-efficient object reuse system

### 2. Grid Component Optimizations (`vtt-react/src/components/Grid.jsx`)

#### Event Throttling
- Added throttled wheel handler limited to ~60fps (16ms)
- Prevents excessive zoom/pan event processing
- Maintains smooth user experience while reducing CPU load

#### Performance Monitoring
- Added performance monitors for grid rendering and tile generation
- Logs performance stats every 50 tile generations
- Helps identify performance bottlenecks

#### Optimized State Management
- Removed unused state variables and imports
- Reduced dependency arrays in useEffect hooks
- Added performance monitoring to tile generation

### 3. Level Editor Overlay Optimizations (`vtt-react/src/components/level-editor/LevelEditorOverlay.jsx`)

#### Canvas Rendering Optimization
- Implemented RAF-throttled canvas redraw function
- Added performance monitoring for canvas operations
- Logs canvas render performance every 30 frames
- Prevents excessive canvas clearing and redrawing

#### Reduced Re-renders
- Throttled canvas updates using requestAnimationFrame
- Optimized dependency arrays to prevent unnecessary re-renders

### 4. Infinite Grid System Optimizations (`vtt-react/src/utils/InfiniteGridSystem.js`)

#### Enhanced Viewport Culling
- Improved minimum tile size thresholds:
  - Zoom < 0.15: No tiles rendered
  - Zoom < 0.2: 8px minimum tile size
  - Zoom < 0.3: 4px minimum tile size
  - Zoom < 0.5: 2px minimum tile size

#### Tile Skip Factor
- Implemented dynamic tile skipping at low zoom levels
- Reduces tile density when zoomed out significantly
- Skip factor = max(1, floor(0.3 / zoomLevel)) for zoom < 0.3

#### Optimized Tile Generation
- Added skip factor to tile generation loops
- Reduced maximum tile counts for very low zoom levels
- Early exit conditions to prevent excessive tile generation

### 5. Optimized Grid Tile Component (`vtt-react/src/components/grid/OptimizedGridTile.jsx`)

Created a memoized tile component with:
- React.memo to prevent unnecessary re-renders
- GPU acceleration with `transform: translateZ(0)`
- CSS containment for layout optimization
- Conditional `willChange` property based on zoom level
- Optimized style calculations

## Performance Improvements Expected

### Zoom Performance
- **60fps throttling** prevents excessive event processing
- **Viewport culling** reduces tiles rendered at low zoom levels
- **Skip factors** dramatically reduce tile count when zoomed out

### Drawing Performance
- **RAF throttling** ensures smooth canvas updates
- **Performance monitoring** helps identify bottlenecks
- **Reduced re-renders** through optimized dependencies

### Memory Usage
- **Object pooling** reduces garbage collection
- **Memoized components** prevent unnecessary object creation
- **Optimized state management** reduces memory footprint

## Usage and Monitoring

### Performance Monitoring
The system now logs performance metrics to the console:
- Tile generation times every 50 generations
- Canvas render times every 30 frames
- Warnings for operations taking > 16.67ms (60fps threshold)

### Debugging
- Tile skip factors are included in tile objects for debugging
- Performance stats include average, min, max, and count
- Console warnings help identify performance issues

## Future Optimizations

1. **Virtual Scrolling**: Only render tiles in viewport
2. **Web Workers**: Move heavy calculations to background threads
3. **Canvas Layers**: Separate static and dynamic content
4. **Dirty Region Tracking**: Only redraw changed areas
5. **Level of Detail**: Different tile detail levels based on zoom

## Testing

To test the optimizations:
1. Open browser dev tools console
2. Zoom in/out rapidly while drawing tiles
3. Monitor console for performance logs
4. Check for smooth 60fps performance
5. Verify reduced lag during tile drawing operations

The optimizations should provide significant performance improvements, especially when:
- Zooming out to view large areas
- Drawing many tiles quickly
- Working with complex maps with many elements
