# Additional Critical Fixes Required

## Critical Issues Found

### 1. Memory Leaks and Cleanup Issues ⚠️

**Issues Found:**
- Multiple setInterval/setTimeout without proper cleanup
- Event listeners not properly removed
- Throttle maps growing without bounds
- Global event handlers accumulating

**Locations:**
- `vtt-react/src/components/combat/TurnTimer.jsx` - setInterval every 100ms
- `vtt-react/src/components/Grid.jsx` - Multiple global event listeners
- `vtt-react/src/components/multiplayer/MultiplayerApp.jsx` - Throttle map cleanup
- `server/services/memoryManager.js` - Aggressive cleanup cycles

### 2. Potential Infinite Loops ⚠️

**Issues Found:**
- Dynamic fog manager with recursive dependencies
- Spell wizard trigger system with persistent triggers
- Performance monitoring with continuous loops

**Locations:**
- `vtt-react/src/components/level-editor/DynamicFogManager.jsx`
- `vtt-react/src/components/spellcrafting-wizard/core/mechanics/triggerSystem.js`
- `server/services/performanceMonitor.js`

### 3. Unhandled Promise Rejections ⚠️

**Issues Found:**
- AI generation functions without proper error handling
- Database operations without timeout handling
- Firebase operations with incomplete error handling

**Locations:**
- `vtt-react/src/components/item-generation/QuickItemWizard.jsx`
- `server/services/databasePool.js`
- `server/services/optimizedFirebase.js`

### 4. Race Conditions ⚠️

**Issues Found:**
- Socket connection state management
- Store subscription timing issues
- Async operations without proper sequencing

**Locations:**
- `vtt-react/src/components/multiplayer/RoomLobby.jsx`
- `vtt-react/src/components/windows/InventoryWindow.jsx`
- `vtt-react/src/store/gridItemStore.js`

### 5. Performance Degradation ⚠️

**Issues Found:**
- Excessive console.log statements in production
- Redundant re-renders and state updates
- Large object deep cloning operations

**Locations:**
- Multiple files with console.log statements
- `server/services/optimizedFirebase.js` - Deep cloning
- `vtt-react/src/components/Grid.jsx` - Force re-renders

## Immediate Fixes Required

### Fix 1: Cleanup Timer Intervals
```javascript
// In TurnTimer.jsx - Add proper cleanup
useEffect(() => {
    if (!isInCombat) {
        setDisplayTime({ current: 0, total: 0 });
        return;
    }

    const updateTimer = () => {
        const timerInfo = getTimerInfo(tokenId);
        setDisplayTime({
            current: timerInfo.currentTime,
            total: timerInfo.totalTime + timerInfo.currentTime,
            isActive: timerInfo.isActive
        });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => {
        clearInterval(interval); // ✅ Already present
    };
}, [isInCombat, tokenId, getTimerInfo]);
```

### Fix 2: Prevent Infinite Loops in Dynamic Fog
```javascript
// Add dependency tracking to prevent infinite loops
const [lastUpdateHash, setLastUpdateHash] = useState('');

useEffect(() => {
    const currentHash = JSON.stringify({
        dynamicFogEnabled,
        respectLineOfSight,
        fogRevealMode,
        wallDataLength: wallData.length,
        tokensLength: tokens.length
    });
    
    if (currentHash === lastUpdateHash) return;
    setLastUpdateHash(currentHash);
    
    updateFogVisibility();
}, [/* reduced dependencies */]);
```

### Fix 3: Add Error Boundaries
```javascript
// Add error boundary for critical components
class MultiplayerErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Multiplayer error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong with multiplayer. Please refresh.</div>;
        }
        return this.props.children;
    }
}
```

### Fix 4: Optimize Console Logging
```javascript
// Create production-safe logger
const logger = {
    log: process.env.NODE_ENV === 'development' ? console.log : () => {},
    warn: console.warn,
    error: console.error
};
```

### Fix 5: Add Request Timeouts
```javascript
// Add timeouts to all fetch requests
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
};
```

## Priority Actions

1. **Immediate (Critical):**
   - Fix timer cleanup in TurnTimer
   - Add error boundaries to multiplayer components
   - Implement request timeouts

2. **High Priority:**
   - Optimize console logging for production
   - Fix dynamic fog infinite loop potential
   - Add proper error handling to AI generation

3. **Medium Priority:**
   - Optimize memory cleanup cycles
   - Reduce redundant re-renders
   - Improve store subscription management

## Testing Strategy

1. **Memory Leak Testing:**
   - Monitor memory usage during extended sessions
   - Check for growing timer/interval counts
   - Verify proper cleanup on component unmount

2. **Performance Testing:**
   - Profile render cycles and identify bottlenecks
   - Monitor console output in production
   - Test with multiple concurrent users

3. **Error Handling Testing:**
   - Simulate network failures
   - Test with invalid data inputs
   - Verify graceful degradation

## Files Requiring Updates

### High Priority:
- `vtt-react/src/components/combat/TurnTimer.jsx`
- `vtt-react/src/components/level-editor/DynamicFogManager.jsx`
- `vtt-react/src/components/item-generation/QuickItemWizard.jsx`
- `vtt-react/src/components/multiplayer/MultiplayerApp.jsx`

### Medium Priority:
- `server/services/memoryManager.js`
- `server/services/performanceMonitor.js`
- `vtt-react/src/components/Grid.jsx`
- `vtt-react/src/store/gridItemStore.js`

## Monitoring and Alerts

1. **Add performance monitoring:**
   - Track memory usage trends
   - Monitor error rates
   - Alert on performance degradation

2. **Add health checks:**
   - Socket connection health
   - Database connection status
   - Memory usage thresholds
