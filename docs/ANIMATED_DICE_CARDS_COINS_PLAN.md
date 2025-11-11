# Animated Dice, Cards & Coins - Implementation Plan

## Executive Summary

This document outlines the best approach to implement physics-based 3D dice rolling, Hearthstone-style card pack opening, and 3D coin flipping animations for the VTT.

---

## Current State Analysis

### Existing Infrastructure
- ✅ **Dice System**: Dice store (Zustand), DiceRenderer (CSS-only), DiceSelectionBar, dice utilities
- ✅ **Card System**: CardDrawVisualizer (basic CSS cards), CardSelector, card logic systems
- ✅ **Coin System**: CoinFlipVisualizer (basic), coin flip logic in resolution mechanics
- ✅ **Grid System**: Grid component with camera/zoom tracking, world coordinates
- ❌ **3D Libraries**: No Three.js, Babylon.js, or physics engines currently installed

### Technology Stack
- React 18.3.1
- Zustand for state management
- Firebase for persistence
- Socket.io for multiplayer
- CSS for current animations

---

## Recommended Technology Choices

### Option A: Three.js + React Three Fiber (RECOMMENDED)
**Pros:**
- Excellent React integration via `@react-three/fiber`
- Large ecosystem and community
- Good performance with WebGL
- Easy physics integration via `@react-three/cannon` or `@react-three/rapier`
- Proven dice libraries available (e.g., `dice-box`)
- Good documentation and examples

**Cons:**
- Learning curve for 3D concepts
- Additional bundle size (~200KB gzipped)

**Why this is best:**
- React Three Fiber provides declarative 3D scene management
- Seamless integration with existing React components
- `@react-three/cannon` or `@react-three/rapier` for physics
- Can reuse Three.js dice models or create custom geometries

### Option B: Babylon.js
**Pros:**
- Built-in physics engine (Havok)
- More features out of the box
- Great performance

**Cons:**
- Less React-native integration
- More imperative API
- Larger bundle size (~400KB gzipped)

### Option C: Canvas 2D with CSS 3D Transforms
**Pros:**
- No additional dependencies
- Smaller bundle

**Cons:**
- Limited physics simulation
- Less realistic dice rolling
- Difficult to prevent dice from rolling off grid

**Recommendation: Option A (Three.js + React Three Fiber)**

---

## Implementation Plan

## Phase 1: 3D Dice Rolling System

### 1.1 Dependencies Installation
```bash
npm install three @react-three/fiber @react-three/drei @react-three/cannon
# OR for more modern physics:
npm install three @react-three/fiber @react-three/drei @react-three/rapier
```

**Package Choices:**
- `three`: Core 3D library
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Useful helpers and abstractions
- `@react-three/cannon`: Physics (mature, stable)
- `@react-three/rapier`: Physics (newer, better performance, active development)

**Recommendation: Use `@react-three/rapier`** - better performance, actively maintained.

### 1.2 Dice 3D Models & Geometry

**Approach 1: Procedural Generation (RECOMMENDED)**
- Create dice geometries programmatically using Three.js primitives
- d4: Tetrahedron
- d6: Box (already exists)
- d8: Octahedron
- d10: Pentagonal trapezohedron (custom geometry)
- d12: Dodecahedron
- d20: Icosahedron
- d100: Sphere with number texture

**Approach 2: Use Dice Models Library**
- Consider `dice-box` library as reference
- Or use GLTF models from online sources

**Recommendation: Approach 1** - More control, smaller bundle, no external assets needed.

### 1.3 Component Architecture

```
DiceRollingSystem.jsx (existing)
  └─ DiceRenderer3D.jsx (new - replaces DiceRenderer.jsx)
      ├─ DiceCanvas.jsx (Three.js canvas container)
      ├─ DiceScene.jsx (3D scene setup)
      │   ├─ GridBoundary.jsx (invisible walls to keep dice on grid)
      │   ├─ DicePhysicsGroup.jsx (group of dice with physics)
      │   │   └─ DiceMesh.jsx (individual die component)
      │   └─ Lighting.jsx (scene lighting)
      └─ DiceResultsOverlay.jsx (shows results after roll)
```

### 1.4 Grid Integration

**Key Requirements:**
- Dice must roll within visible grid bounds
- Respect camera position and zoom level
- Dice should spawn near camera center
- Invisible boundaries prevent dice from rolling off-grid

**Implementation:**
```javascript
// Calculate grid bounds in world coordinates
const gridBounds = {
  minX: cameraX - (viewportWidth / 2 / effectiveZoom),
  maxX: cameraX + (viewportWidth / 2 / effectiveZoom),
  minY: cameraY - (viewportHeight / 2 / effectiveZoom),
  maxY: cameraY + (viewportHeight / 2 / effectiveZoom)
};

// Create invisible physics walls at grid boundaries
// Use Rapier colliders as walls
```

### 1.5 Physics Configuration

**Settings from diceStore:**
- Gravity: -9.81 (already configured)
- Restitution: 0.6 (bounciness)
- Friction: 0.4 (sliding resistance)
- Roll Force: 15 (initial throw force)
- Spin Force: 10 (rotational velocity)

**Physics Implementation:**
1. Create dice rigid bodies
2. Apply initial force and spin on roll
3. Monitor when dice come to rest (velocity < threshold)
4. Read face-up value from dice geometry
5. Report results to store and chat

### 1.6 Dice Face Detection

**Approach:**
1. After physics settles, check which face is pointing up
2. Use raycasting from top down to detect face normal
3. Match face normal to number mapping
4. For complex dice (d10, d100), use UV coordinates or custom face detection

**Alternative (Simpler):**
- Pre-determine results based on physics seed
- Show results after animation completes
- Physics animation is purely visual

### 1.7 Chat Integration

**Current System:**
- `useChatStore` with `addNotification`
- Dice results should appear in chat with formatted roll string

**Implementation:**
```javascript
// In DiceRenderer3D after roll completes
const rollString = getFormattedRollString(); // e.g., "2d20 + 1d6"
const results = rollResults.map(r => r.value).join(', ');
const total = rollResults.reduce((sum, r) => sum + r.value, 0);

addNotification('dice', {
  message: `${rollString}: [${results}] = ${total}`,
  timestamp: new Date().toISOString(),
  rollData: { notation: rollString, results, total }
});
```

---

## Phase 2: Hearthstone-Style Card Pack Opening

### 2.1 Animation Sequence

**Hearthstone Pack Opening Flow:**
1. Pack appears in center
2. Pack opens (particle effect, glow)
3. Cards fly out in arc formation
4. Cards float and rotate in 3D space
5. Cards clickable to reveal (flip animation)
6. Card flips to show front with content
7. Cards remain visible for review

### 2.2 Component Architecture

```
CardPackOpening.jsx (new main component)
  ├─ PackModel.jsx (3D pack or 2D with 3D transforms)
  ├─ CardRevealScene.jsx (manages card animations)
  │   ├─ FloatingCard.jsx (individual card component)
  │   │   ├─ CardBack.jsx (face-down card)
  │   │   └─ CardFront.jsx (revealed card content)
  │   └─ ParticleEffects.jsx (pack opening effects)
  └─ CardPackControls.jsx (draw count selector, open button)
```

### 2.3 Implementation Approach

**Option A: Three.js 3D Cards (More Realistic)**
- Create card planes in 3D space
- Use textures for card faces
- Animate rotation and position

**Option B: CSS 3D Transforms (Lighter Weight - RECOMMENDED)**
- Use CSS `transform3d` for card flips
- Framer Motion or React Spring for animations
- Simpler implementation, still impressive

**Recommendation: Option B** - Hearthstone actually uses a hybrid approach (3D transforms, 2D textures). CSS can achieve similar results with better performance.

### 2.4 Animation Libraries

**Recommended: Framer Motion**
```bash
npm install framer-motion
```

**Why:**
- Excellent React integration
- Spring animations feel natural
- Good performance
- Easy to orchestrate complex sequences

### 2.5 Card Reveal Sequence

```javascript
// Animation timeline
1. Pack appears (0ms)
2. Pack opens with particles (500ms)
3. Cards fly out in arc (800-1200ms)
4. Cards settle into floating positions (1200-2000ms)
5. Cards become clickable
6. On click: Card flips (300ms flip animation)
7. Card shows front content
```

### 2.6 Card Layout Algorithm

**Hearthstone-style positioning:**
- Cards arranged in arc/circle around center
- Each card offset by angle (360° / cardCount)
- Slight random variation for natural look
- Z-index layering for depth
- Hover effects (scale up, glow)

---

## Phase 3: 3D Coin Flip Animation

### 3.1 Coin Model

**Simple Approach:**
- Cylinder geometry with two faces
- Heads texture: one side
- Tails texture: other side
- Thin coin shape (low height, large radius)

### 3.2 Physics Animation

**Requirements:**
- Realistic flip with rotation
- Coin spins in air
- Lands on ground surface
- Result determined by which face is up

**Implementation:**
```javascript
// Using Three.js + Rapier
1. Create coin rigid body (cylinder)
2. Apply upward force and angular velocity
3. Let physics simulate flight
4. Detect when coin settles (velocity < threshold)
5. Check face orientation via raycast
6. Display result
```

### 3.3 Multiple Coin Support

**Visualization Options:**
- Single coin for single flip
- Multiple coins in grid layout for multiple flips
- All coins flip simultaneously
- Results shown individually

### 3.4 Component Structure

```
CoinFlipVisualizer3D.jsx (new)
  ├─ CoinCanvas.jsx (Three.js canvas)
  ├─ CoinScene.jsx
  │   ├─ GroundPlane.jsx (physics ground)
  │   ├─ CoinPhysics.jsx (coin rigid body)
  │   └─ ResultDisplay.jsx (shows heads/tails)
  └─ CoinFlipControls.jsx (trigger flip button)
```

---

## Technical Considerations

### Performance Optimization

**Dice Rolling:**
- Limit simultaneous dice (max 10-15 recommended)
- Use instanced rendering for same-type dice
- Remove dice from physics after settlement
- Debounce rapid roll requests

**Card Pack Opening:**
- Limit cards per pack (5-10 cards)
- Use CSS transforms instead of full 3D where possible
- Lazy load card content
- Remove cards from scene after reveal

**Coin Flipping:**
- Simple geometry (cylinder)
- Single coin or few coins at once
- Minimal texture complexity

### Accessibility

- Skip animation option (immediate results)
- Keyboard navigation for card selection
- Screen reader support for results
- Reduced motion support (prefers-reduced-motion)

### Multiplayer Considerations

**Current System:**
- Socket.io for multiplayer
- Dice results need to sync across clients

**Implementation:**
- Server validates dice rolls (prevent cheating)
- Broadcast animation trigger to all clients
- All clients run same animation with seed
- Results synced via socket events

**OR (Simpler):**
- Only trigger animation locally
- Broadcast results only
- Other clients see results in chat

### State Management Integration

**Existing Stores:**
- `useDiceStore` - already configured
- `useChatStore` - for results display
- `useGameStore` - for grid/camera info

**New Stores (if needed):**
- `useAnimationStore` - animation state, preferences
- Card/coin specific stores if complex logic needed

---

## Implementation Phases

### Phase 1: Setup & Dice (Weeks 1-2)
1. Install dependencies
2. Set up Three.js canvas in React
3. Create basic dice geometries
4. Implement physics rolling
5. Grid boundary system
6. Result detection
7. Chat integration

### Phase 2: Card Pack Opening (Week 3)
1. Install Framer Motion
2. Create card components
3. Pack opening animation
4. Card reveal system
5. Click interaction
6. Integration with existing card system

### Phase 3: Coin Flipping (Week 4)
1. Coin geometry
2. Physics flip animation
3. Result detection
4. Multiple coin support
5. Integration with coin system

### Phase 4: Polish & Testing (Week 5)
1. Performance optimization
2. Animation timing tuning
3. Multiplayer sync testing
4. Accessibility features
5. Bug fixes

---

## Alternative Simpler Approach

If the full 3D approach is too complex, consider:

### Simplified Dice:
- CSS 3D transforms with realistic rotation
- Pre-determined results (physics is visual only)
- Still looks impressive, much simpler

### Simplified Cards:
- CSS flip animations
- Framer Motion for floating
- 2D cards with 3D transforms

### Simplified Coins:
- CSS rotation animation
- Pre-determined result
- Simpler but still satisfying

**Trade-off:** Less realistic physics, but faster implementation and smaller bundle size.

---

## Recommended Libraries Summary

### Core Dependencies
```json
{
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.88.0",
  "@react-three/rapier": "^2.3.0",
  "framer-motion": "^11.0.0"
}
```

### Optional (for advanced features)
```json
{
  "leva": "^0.9.0" // for debugging 3D scenes
}
```

---

## File Structure

```
vtt-react/src/
  components/
    dice/
      DiceRenderer.jsx (existing - replace)
      DiceRenderer3D.jsx (new)
        components/
          DiceCanvas.jsx
          DiceScene.jsx
          DiceMesh.jsx
          GridBoundary.jsx
          DiceResultsOverlay.jsx
      DiceSelectionBar.jsx (existing)
      DiceRollingSystem.jsx (existing - update)
    
    cards/
      CardPackOpening.jsx (new)
        components/
          PackModel.jsx
          FloatingCard.jsx
          CardRevealScene.jsx
          ParticleEffects.jsx
    
    coins/
      CoinFlipVisualizer3D.jsx (new)
        components/
          CoinCanvas.jsx
          CoinScene.jsx
          CoinMesh.jsx
```

---

## Success Metrics

1. **Dice:**
   - Dice roll smoothly on grid
   - Dice don't roll off visible area
   - Results appear in chat within 2 seconds of roll
   - Smooth 60fps animation

2. **Cards:**
   - Pack opening feels satisfying
   - Cards float naturally
   - Card flip is smooth and responsive
   - Click interaction is intuitive

3. **Coins:**
   - Coin flip looks realistic
   - Result is clear
   - Multiple coins work correctly

---

## Risk Mitigation

### Bundle Size Concerns
- Use code splitting for 3D components
- Lazy load Three.js components
- Consider loading animations separately

### Performance on Lower-End Devices
- Provide settings to reduce animation quality
- Option to skip animations
- Limit simultaneous dice/cards

### Browser Compatibility
- Three.js supports modern browsers
- Fallback to CSS animations if WebGL unavailable
- Graceful degradation

---

## Next Steps

1. **Review this plan** with team
2. **Choose approach** (full 3D vs simplified)
3. **Create prototype** for one system (dice recommended)
4. **Test performance** on target devices
5. **Iterate based on feedback**

---

## Questions to Consider

1. **Budget for bundle size?** (3D libraries add ~200-400KB)
2. **Target devices?** (mobile vs desktop)
3. **Animation quality vs performance?**
4. **Skip animation option required?**
5. **Multiplayer sync requirements?**
6. **Custom dice models or procedural?**
7. **Card pack themes/variants needed?**

---

This plan provides a comprehensive roadmap for implementing animated dice, cards, and coins. The recommended approach balances visual quality with implementation complexity and performance.





























