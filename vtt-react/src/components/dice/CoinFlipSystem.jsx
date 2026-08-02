import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../store/chatStore';
import useCharacterStore from '../../store/characterStore';
import PhysicsCoinScene, { COIN_THEMES } from './PhysicsCoinScene';
import './CoinFlipSystem.css';

const CoinFlipSystem = () => {
  const [flipCount, setFlipCount] = useState(1);
  const [coinTheme, setCoinTheme] = useState('ancient_gold');
  const [flippedCoins, setFlippedCoins] = useState([]);
  const [show3DScene, setShow3DScene] = useState(false);

  const { addNotification } = useChatStore();
  const characterName = useCharacterStore((state) => state.name);

  // Trigger 3D Coin Flip Overlay
  const handleFlip = () => {
    const coinsToFlip = Array.from({ length: Math.min(Math.max(1, flipCount), 10) }, (_, index) => ({
      id: `coin-${Date.now()}-${index}`,
      result: Math.random() < 0.5 ? 'heads' : 'tails',
    }));

    setFlippedCoins(coinsToFlip);
    setShow3DScene(true);
  };

  // Called when 3D Scene animation settles
  const handleFlipComplete = (results) => {
    setFlippedCoins(results);
    const headsCount = results.filter((c) => c.result === 'heads').length;
    const tailsCount = results.filter((c) => c.result === 'tails').length;
    const resultString = results.map((c) => (c.result === 'heads' ? 'Heads' : 'Tails')).join(', ');

    addNotification('combat', {
      type: 'coin_flip',
      sender: characterName || 'Player',
      flipCount: results.length,
      headsCount,
      tailsCount,
      results: resultString,
      theme: COIN_THEMES[coinTheme]?.name || coinTheme,
      timestamp: new Date().toISOString(),
    });
  };

  const handleDismiss = () => {
    setShow3DScene(false);
  };

  const headsCount = flippedCoins.filter((c) => c.result === 'heads').length;
  const tailsCount = flippedCoins.filter((c) => c.result === 'tails').length;

  return (
    <div className="coin-flip-system">
      {/* Controls */}
      <div className="coin-flip-controls">
        <div className="flip-count-control">
          <label>Coins to Flip:</label>
          <div className="count-stepper-group">
            <button
              type="button"
              className="count-step-btn"
              onClick={() => setFlipCount((prev) => Math.max(1, prev - 1))}
              title="Decrease count"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max="10"
              value={flipCount}
              onChange={(e) => setFlipCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="flip-count-input"
            />
            <button
              type="button"
              className="count-step-btn"
              onClick={() => setFlipCount((prev) => Math.min(10, prev + 1))}
              title="Increase count"
            >
              +
            </button>
          </div>
        </div>

        <div className="quick-count-presets">
          {[1, 2, 3, 4, 5, 10].map((num) => (
            <button
              key={num}
              type="button"
              className={`quick-count-btn ${flipCount === num ? 'active' : ''}`}
              onClick={() => setFlipCount(num)}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Theme Picker */}
        <div className="coin-theme-section">
          <label className="coin-theme-label">Coin Look:</label>
          <div className="coin-theme-grid">
            {Object.values(COIN_THEMES).map((theme) => (
              <button
                key={theme.id}
                className={`coin-theme-btn ${coinTheme === theme.id ? 'active' : ''}`}
                onClick={() => setCoinTheme(theme.id)}
                title={theme.name}
              >
                <span
                  className="coin-theme-swatch"
                  style={{
                    background: `radial-gradient(circle, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    borderColor: theme.edgeColor,
                  }}
                />
                <span className="theme-title">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flip-actions">
          <button className="flip-button" onClick={handleFlip}>
            Flip {flipCount} Coin{flipCount > 1 ? 's' : ''} in 3D
          </button>
        </div>
      </div>

      {/* Latest Result Summary if available */}
      {flippedCoins.length > 0 && !show3DScene && (
        <div className="coin-flip-instructions">
          <div className="coin-results-summary">
            <div className="result-count">
              <span className="result-label">Heads:</span>
              <span className="result-value heads">{headsCount}</span>
            </div>
            <div className="result-count">
              <span className="result-label">Tails:</span>
              <span className="result-value tails">{tailsCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen 3D Coin Flip Scene via Portal */}
      {show3DScene &&
        ReactDOM.createPortal(
          <PhysicsCoinScene
            coinsToFlip={flippedCoins}
            coinTheme={coinTheme}
            onFlipComplete={handleFlipComplete}
            onDismiss={handleDismiss}
            isVisible={show3DScene}
          />,
          document.body
        )}
    </div>
  );
};

export default CoinFlipSystem;
