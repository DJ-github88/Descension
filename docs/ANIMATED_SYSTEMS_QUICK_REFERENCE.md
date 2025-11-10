# Animated Dice, Cards & Coins - Quick Reference

## TL;DR

**Recommended Approach:** Three.js + React Three Fiber + Framer Motion  
**Total Implementation Time:** ~4-5 weeks  
**Bundle Size Impact:** ~300KB (gzipped) additional  

---

## Technology Stack

```bash
# Core 3D Dependencies
npm install three @react-three/fiber @react-three/drei @react-three/rapier

# Animation (for cards)
npm install framer-motion
```

---

## Architecture Overview

### Dice System
```
DiceRollingSystem → DiceRenderer3D → Three.js Scene
  ├─ Physics Engine (Rapier)
  ├─ Grid Boundaries (invisible walls)
  ├─ Dice Models (procedural geometry)
  └─ Result Detection (raycasting)
```

### Card System  
```
CardPackOpening → CardRevealScene → Floating Cards
  ├─ Framer Motion (animations)
  ├─ CSS 3D Transforms (flip)
  └─ Click Handlers (reveal)
```

### Coin System
```
CoinFlipVisualizer3D → CoinScene → Physics Coin
  ├─ Rapier Physics
  ├─ Cylinder Geometry
  └─ Face Detection
```

---

## Key Implementation Details

### 1. Dice Rolling
- **Grid Integration:** Calculate visible bounds from camera/zoom
- **Boundaries:** Invisible physics walls prevent dice from leaving grid
- **Detection:** Raycast from top to detect face-up value
- **Chat:** Integrate with existing `useChatStore`

### 2. Card Pack Opening
- **Animation:** Hearthstone-style arc formation
- **Timing:** Pack open → Cards fly out → Float → Click to reveal
- **Library:** Framer Motion for smooth spring animations
- **Layout:** Circular/arc arrangement with random offsets

### 3. Coin Flipping
- **Model:** Simple cylinder with two faces
- **Physics:** Upward force + angular velocity
- **Detection:** Check face orientation when settled
- **Multiple:** Grid layout for multiple coins

---

## Integration Points

### Existing Stores
- `useDiceStore` - already has physics settings configured ✅
- `useChatStore` - for displaying results ✅
- `useGameStore` - for grid/camera position ✅

### Existing Components
- `DiceRenderer.jsx` - replace with 3D version
- `CardDrawVisualizer.jsx` - can reuse logic, replace UI
- `CoinFlipVisualizer.jsx` - can reuse logic, replace UI

---

## Performance Considerations

| System | Max Simultaneous | Optimization |
|--------|------------------|--------------|
| Dice | 10-15 dice | Instanced rendering |
| Cards | 5-10 cards | CSS transforms preferred |
| Coins | 1-5 coins | Simple geometry |

---

## Implementation Order

1. **Week 1-2:** Dice system (most complex, highest priority)
2. **Week 3:** Card pack opening
3. **Week 4:** Coin flipping
4. **Week 5:** Polish & testing

---

## Simplified Alternative

If full 3D is too heavy:
- **Dice:** CSS 3D transforms + pre-determined results
- **Cards:** CSS flip animations + Framer Motion floating
- **Coins:** CSS rotation animation

**Trade-off:** Less realistic physics, but ~50% smaller bundle and faster implementation.

---

## Quick Start Checklist

- [ ] Install dependencies
- [ ] Create Three.js canvas wrapper
- [ ] Implement one dice type (d6) as proof of concept
- [ ] Test grid boundaries
- [ ] Integrate with chat
- [ ] Expand to all dice types
- [ ] Move to cards
- [ ] Move to coins

---

See `ANIMATED_DICE_CARDS_COINS_PLAN.md` for full detailed plan.


























