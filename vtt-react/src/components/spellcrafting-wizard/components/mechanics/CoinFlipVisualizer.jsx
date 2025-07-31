import React, { useState, useEffect } from 'react';
import { FaCoins } from 'react-icons/fa';
import '../../styles/CoinFlipVisualizer.css';

const CoinFlipVisualizer = ({ 
  onFlip, 
  critRule = 'all_heads',
  coinCount = 3
}) => {
  const [coins, setCoins] = useState([]);
  const [flipping, setFlipping] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  
  const flipCoins = () => {
    setFlipping(true);
    setCoins([]);
    
    // Simulate flipping animation
    let currentFlip = 0;
    const flipInterval = setInterval(() => {
      if (currentFlip < coinCount) {
        setCoins(prev => {
          const newCoins = [...prev];
          newCoins[currentFlip] = { 
            side: Math.random() < 0.5 ? 'heads' : 'tails',
            flipping: true
          };
          return newCoins;
        });
        
        // Stop flipping animation after a delay
        setTimeout(() => {
          setCoins(prev => {
            const newCoins = [...prev];
            if (newCoins[currentFlip]) {
              newCoins[currentFlip] = { 
                ...newCoins[currentFlip],
                flipping: false
              };
            }
            return newCoins;
          });
        }, 1000);
        
        currentFlip++;
      } else {
        clearInterval(flipInterval);
        setFlipping(false);
        
        // Check if critical based on the rule
        setTimeout(() => {
          const flippedCoins = coins.map(coin => coin.side);
          let critical = false;
          
          switch (critRule) {
            case 'all_heads':
              critical = flippedCoins.every(side => side === 'heads');
              break;
            case 'all_tails':
              critical = flippedCoins.every(side => side === 'tails');
              break;
            case 'sequence':
              // Example: heads, tails, heads
              const targetSequence = ['heads', 'tails', 'heads'].slice(0, coinCount);
              critical = flippedCoins.every((side, index) => side === targetSequence[index]);
              break;
            case 'majority':
              const headsCount = flippedCoins.filter(side => side === 'heads').length;
              critical = headsCount > coinCount / 2;
              break;
            default:
              critical = false;
          }
          
          setIsCritical(critical);
          
          if (onFlip) {
            onFlip(flippedCoins, critical);
          }
        }, 100);
      }
    }, 500);
  };
  
  const resetFlip = () => {
    setCoins([]);
    setIsCritical(false);
  };
  
  const getCriticalDescription = () => {
    switch (critRule) {
      case 'all_heads': return 'All heads are critical';
      case 'all_tails': return 'All tails are critical';
      case 'sequence': return 'Specific sequence is critical';
      case 'majority': return 'Majority heads are critical';
      default: return '';
    }
  };
  
  return (
    <div className={`coin-flip-visualizer ${flipping ? 'flipping' : ''} ${isCritical ? 'critical' : ''}`}>
      <div className="coin-flip-info">
        <div className="coin-rule">{getCriticalDescription()}</div>
      </div>
      
      <div className="coin-flip-area">
        {coins.length > 0 ? (
          <div className="flipped-coins">
            {coins.map((coin, index) => (
              <div 
                key={index} 
                className={`coin ${coin.side} ${coin.flipping ? 'flipping-animation' : ''}`}
              >
                <div className="coin-side coin-heads">H</div>
                <div className="coin-side coin-tails">T</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="coin-placeholder">
            <FaCoins className="coin-icon" />
            <div className="coin-count">{coinCount} coins</div>
          </div>
        )}
      </div>
      
      <div className="coin-flip-controls">
        {coins.length === 0 ? (
          <button 
            className="flip-button"
            onClick={flipCoins}
            disabled={flipping}
          >
            Flip {coinCount > 1 ? `${coinCount} Coins` : 'a Coin'}
          </button>
        ) : (
          <button 
            className="reset-button"
            onClick={resetFlip}
            disabled={flipping}
          >
            Reset
          </button>
        )}
      </div>
      
      {coins.length > 0 && !flipping && (
        <div className="flip-status">
          {isCritical ? 'CRITICAL HIT!' : 'Normal hit'}
        </div>
      )}
    </div>
  );
};

export default CoinFlipVisualizer;
