import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../store/chatStore';
import useCharacterStore from '../../store/characterStore';
import PhysicsCardScene, { CARD_THEMES } from './PhysicsCardScene';
import './CardDrawSystem.css';

const CardDrawSystem = () => {
  const [drawCount, setDrawCount] = useState(1);
  const [cardTheme, setCardTheme] = useState('royal_velvet');
  const [manualFlip, setManualFlip] = useState(false);
  const [drawnCards, setDrawnCards] = useState([]);
  const [show3DScene, setShow3DScene] = useState(false);

  const { addNotification } = useChatStore();
  const characterName = useCharacterStore((state) => state.name);

  const suits = [
    { name: 'Spades', symbol: '♠', isRed: false },
    { name: 'Hearts', symbol: '♥', isRed: true },
    { name: 'Diamonds', symbol: '♦', isRed: true },
    { name: 'Clubs', symbol: '♣', isRed: false },
  ];

  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const handleDraw = () => {
    const cards = [];
    const count = Math.min(Math.max(1, drawCount), 10);

    for (let i = 0; i < count; i++) {
      const suitObj = suits[Math.floor(Math.random() * suits.length)];
      const rank = ranks[Math.floor(Math.random() * ranks.length)];

      cards.push({
        id: `card-${Date.now()}-${i}`,
        suit: suitObj.name,
        suitSymbol: suitObj.symbol,
        rank,
        value: rank,
        name: `${rank} of ${suitObj.name}`,
      });
    }

    setDrawnCards(cards);
    setShow3DScene(true);
  };

  const handleDrawComplete = (cards) => {
    const cardStrings = cards.map((c) => `${c.rank}${c.suitSymbol}`).join(', ');

    addNotification('combat', {
      type: 'card_draw',
      sender: characterName || 'Player',
      drawCount: cards.length,
      cards: cardStrings,
      theme: CARD_THEMES[cardTheme]?.name || cardTheme,
      timestamp: new Date().toISOString(),
    });
  };

  const handleDismiss = () => {
    setShow3DScene(false);
  };

  return (
    <div className="card-draw-system">
      {/* Controls */}
      <div className="card-draw-controls">
        <div className="draw-count-control">
          <label>Cards to Draw:</label>
          <div className="count-stepper-group">
            <button
              type="button"
              className="count-step-btn"
              onClick={() => setDrawCount((prev) => Math.max(1, prev - 1))}
              title="Decrease count"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max="10"
              value={drawCount}
              onChange={(e) => setDrawCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="draw-count-input"
            />
            <button
              type="button"
              className="count-step-btn"
              onClick={() => setDrawCount((prev) => Math.min(10, prev + 1))}
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
              className={`quick-count-btn ${drawCount === num ? 'active' : ''}`}
              onClick={() => setDrawCount(num)}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Reveal Mode Checkbox */}
        <div className="manual-flip-control">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={manualFlip}
              onChange={(e) => setManualFlip(e.target.checked)}
              className="manual-flip-checkbox"
            />
            <span className="checkbox-text">Click to Reveal</span>
          </label>
        </div>

        {/* Card Theme Picker */}
        <div className="card-theme-section">
          <label className="card-theme-label">Deck Theme:</label>
          <div className="card-theme-grid">
            {Object.values(CARD_THEMES).map((theme) => (
              <button
                key={theme.id}
                className={`card-theme-btn ${cardTheme === theme.id ? 'active' : ''}`}
                onClick={() => setCardTheme(theme.id)}
                title={theme.name}
              >
                <span
                  className="card-theme-swatch"
                  style={{
                    background: `linear-gradient(135deg, ${theme.bgStart}, ${theme.bgEnd})`,
                    borderColor: theme.borderColor,
                  }}
                >
                  <span className="swatch-symbol">{theme.backSymbol}</span>
                </span>
                <span className="theme-title">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="draw-actions">
          <button className="draw-button" onClick={handleDraw}>
            Draw {drawCount} Card{drawCount > 1 ? 's' : ''} in 3D
          </button>
        </div>
      </div>

      {/* Results summary if available */}
      {drawnCards.length > 0 && !show3DScene && (
        <div className="card-draw-summary">
          <div className="summary-label">Last Draw:</div>
          <div className="summary-cards">
            {drawnCards.map((card) => (
              <span key={card.id} className="summary-card-badge">
                {card.rank}{card.suitSymbol}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Full Screen 3D Card Draw Scene via Portal */}
      {show3DScene &&
        ReactDOM.createPortal(
          <PhysicsCardScene
            cardsToDraw={drawnCards}
            cardTheme={cardTheme}
            manualFlip={manualFlip}
            onDrawComplete={handleDrawComplete}
            onDismiss={handleDismiss}
            isVisible={show3DScene}
          />,
          document.body
        )}
    </div>
  );
};

export default CardDrawSystem;
