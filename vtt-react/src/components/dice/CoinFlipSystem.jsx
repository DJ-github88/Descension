import React, { useState, useRef, useEffect } from 'react';
import useChatStore from '../../store/chatStore';
import useCharacterStore from '../../store/characterStore';
import './CoinFlipSystem.css';

const CoinFlipSystem = () => {
  const [flipCount, setFlipCount] = useState(1);
  const [flippedCoins, setFlippedCoins] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const containerRef = useRef(null);
  const { addNotification } = useChatStore();
  const characterName = useCharacterStore((state) => state.name);

  // Flip a single coin
  const flipCoin = () => {
    // Random result: heads (0) or tails (1)
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    return result;
  };

  // Flip coins
  const handleFlip = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setFlippedCoins([]);
    
    // Create array of coins to flip
    const coinsToFlip = Array.from({ length: Math.min(flipCount, 10) }, (_, index) => ({
      id: `coin-${Date.now()}-${index}`,
      result: null,
      isFlipping: true,
      flipRotation: 0
    }));
    
    setFlippedCoins(coinsToFlip);
    
    // Store results as they're generated for notification
    const coinResults = [];
    
    // Animate each coin flip
    coinsToFlip.forEach((coin, index) => {
      // Flip animation timing - result determined immediately, animation is visual
      const result = flipCoin();
      coinResults.push({ id: coin.id, result });
      
      // Start flipping animation with result stored immediately
      setTimeout(() => {
        setFlippedCoins(prev => prev.map(c => {
          if (c.id === coin.id) {
            return {
              ...c,
              result, // Store result immediately so animation knows which side to show
              isFlipping: true
            };
          }
          return c;
        }));
      }, index * 200);
      
      // End flipping animation - result appears exactly when animation completes
      // Use animation end time (2500ms) + stagger delay
      setTimeout(() => {
        setFlippedCoins(prev => prev.map(c => {
          if (c.id === coin.id) {
            return {
              ...c,
              isFlipping: false // Animation completes, coin has landed, result appears
            };
          }
          return c;
        }));
      }, index * 300 + 2500); // Animation duration is 2.5s, result appears exactly when it lands
    });
    
    // Reset flipping state after all coins are done
    setTimeout(() => {
      setIsFlipping(false);
      
      // Add notification to combat tab using stored results
      const headsCount = coinResults.filter(c => c.result === 'heads').length;
      const tailsCount = coinResults.filter(c => c.result === 'tails').length;
      const results = coinResults.map(c => c.result === 'heads' ? 'Heads' : 'Tails').join(', ');
      
      addNotification('combat', {
        type: 'coin_flip',
        sender: characterName || 'Player',
        flipCount: coinsToFlip.length,
        headsCount,
        tailsCount,
        results,
        timestamp: new Date().toISOString()
      });
    }, coinsToFlip.length * 300 + 2700);
  };

  // Clear all coins
  const handleClear = () => {
    setFlippedCoins([]);
    setIsFlipping(false);
  };

  // Re-flip all coins
  const handleReFlip = () => {
    handleFlip();
  };

  return (
    <div className="coin-flip-system">
      {/* Controls */}
      <div className="coin-flip-controls">
        <div className="flip-count-control">
          <label>Coins to Flip:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={flipCount}
            onChange={(e) => setFlipCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="flip-count-input"
            disabled={isFlipping || flippedCoins.length > 0}
          />
        </div>
        <div className="flip-actions">
          {flippedCoins.length === 0 ? (
            <button
              className="flip-button"
              onClick={handleFlip}
              disabled={isFlipping}
            >
              {isFlipping ? 'Flipping...' : `Flip ${flipCount} Coin${flipCount > 1 ? 's' : ''}`}
            </button>
          ) : (
            <>
              <button
                className="reflip-button"
                onClick={handleReFlip}
                disabled={isFlipping}
              >
                {isFlipping ? 'Flipping...' : 'Flip Again'}
              </button>
              <button
                className="clear-button"
                onClick={handleClear}
                disabled={isFlipping}
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Coins Display */}
      <div className="coin-flip-area" ref={containerRef}>
        {flippedCoins.length === 0 ? (
          <div className="coin-flip-empty">
            <div className="coin-preview">
              <div className="coin coin-preview-coin">
                <div className="coin-side coin-heads">
                  <div className="coin-content">
                    <div className="coin-pattern coin-pattern-heads"></div>
                  </div>
                </div>
              </div>
            </div>
            <p>Click "Flip Coins" to begin</p>
          </div>
        ) : (
          <div className="flipped-coins-container">
            {flippedCoins.map((coin, index) => {
              const isFlipping = coin.isFlipping;
              const result = coin.result;
              
              return (
                <div
                  key={coin.id}
                  className={`coin-wrapper ${isFlipping ? 'flipping' : ''} ${result ? `result-${result}` : ''}`}
                  style={{ '--coin-index': index }}
                >
                  <div className="coin-flip-container">
                    {/* Coin */}
                    <div 
                      className={`coin ${isFlipping ? 'flipping' : ''} ${result ? `result-${result}` : ''}`}
                      style={!isFlipping && result ? {
                        transform: result === 'heads' ? 'rotateY(1800deg)' : 'rotateY(1980deg)'
                      } : undefined}
                    >
                      {/* Heads side */}
                      <div className="coin-side coin-heads">
                        <div className="coin-content">
                          <div className="coin-pattern coin-pattern-heads"></div>
                        </div>
                      </div>
                      
                      {/* Tails side */}
                      <div className="coin-side coin-tails">
                        <div className="coin-content">
                          <div className="coin-pattern coin-pattern-tails"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Result indicator - appears exactly when animation completes */}
                    {result && !isFlipping && (
                      <div className={`coin-result ${result} result-visible`}>
                        <span className="result-text">{result === 'heads' ? 'Heads' : 'Tails'}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Instructions */}
      {flippedCoins.length > 0 && !isFlipping && (
        <div className="coin-flip-instructions">
          <div className="coin-results-summary">
            <div className="result-count">
              <span className="result-label">Heads:</span>
              <span className="result-value heads">
                {flippedCoins.filter(c => c.result === 'heads').length}
              </span>
            </div>
            <div className="result-count">
              <span className="result-label">Tails:</span>
              <span className="result-value tails">
                {flippedCoins.filter(c => c.result === 'tails').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinFlipSystem;

