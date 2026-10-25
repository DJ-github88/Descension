import React from 'react';
import useDiceStore from '../../store/diceStore';
import { CARD_THEMES } from './PhysicsCardScene';
import './CardDrawSystem.css';

const COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Card draw controls (lives in the dice panel). The hand itself is owned by
 * the dice store and rendered by DiceRollingSystem, so it stays on the table
 * when this panel closes.
 */
const CardDrawSystem = ({ onDrawn }) => {
  const [drawCount, setDrawCount] = React.useState(1);
  const cardTheme = useDiceStore((s) => s.cardTheme);
  const setCardTheme = useDiceStore((s) => s.setCardTheme);
  const revealMode = useDiceStore((s) => s.cardRevealMode);
  const setRevealMode = useDiceStore((s) => s.setCardRevealMode);
  const startCardDraw = useDiceStore((s) => s.startCardDraw);
  const drawInProgress = useDiceStore((s) => !!s.cardDraw);
  const lastDraw = useDiceStore((s) => s.lastCardDraw);

  const activeTheme = CARD_THEMES[cardTheme] || CARD_THEMES.royal_velvet;

  const handleDraw = () => {
    if (startCardDraw(drawCount) && onDrawn) onDrawn();
  };

  return (
    <div className="card-draw-system">
      <div className="card-field">
        <span className="card-field-label" id="card-count-label">Cards</span>
        <div className="card-count-picker" role="radiogroup" aria-labelledby="card-count-label">
          {COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={drawCount === n}
              className={`card-count-option ${drawCount === n ? 'active' : ''}`}
              onClick={() => setDrawCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="card-field">
        <span className="card-field-label" id="card-deck-label">Deck</span>
        <div className="card-deck-swatches" role="radiogroup" aria-labelledby="card-deck-label">
          {Object.values(CARD_THEMES).map((theme) => (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={cardTheme === theme.id}
              aria-label={theme.name}
              title={theme.name}
              className={`card-deck-swatch ${cardTheme === theme.id ? 'active' : ''}`}
              onClick={() => setCardTheme(theme.id)}
              style={{
                '--deck-a': theme.bgStart,
                '--deck-b': theme.bgEnd,
                '--deck-frame': theme.borderColor,
              }}
            >
              <span className="card-deck-back" />
            </button>
          ))}
        </div>
        <span className="card-deck-name">{activeTheme.name}</span>
      </div>

      <label className="card-reveal-toggle">
        <input
          type="checkbox"
          checked={revealMode}
          onChange={(e) => setRevealMode(e.target.checked)}
        />
        <span>Deal face down — click each card to turn it</span>
      </label>

      <div className="card-draw-footer">
        <span className="card-last-result">
          {lastDraw ? `Last draw: ${lastDraw.cards}` : 'Drawn from a shuffled 52-card deck'}
        </span>
        <button
          type="button"
          className="draw-button"
          onClick={handleDraw}
          disabled={drawInProgress}
        >
          {drawInProgress ? 'Dealing…' : `Draw ${drawCount} card${drawCount > 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
};

export default CardDrawSystem;
