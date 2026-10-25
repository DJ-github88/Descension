import React, { useState } from 'react';
import useDiceStore from '../../store/diceStore';
import { COIN_THEMES } from './PhysicsCoinScene';
import './CoinFlipSystem.css';

const COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Coin flip controls (lives in the dice panel). The flip itself is owned by
 * the dice store and rendered by DiceRollingSystem, so it keeps running when
 * this panel closes.
 */
const CoinFlipSystem = ({ onFlipped }) => {
  const [flipCount, setFlipCount] = useState(1);
  const coinTheme = useDiceStore((s) => s.coinTheme);
  const setCoinTheme = useDiceStore((s) => s.setCoinTheme);
  const startCoinFlip = useDiceStore((s) => s.startCoinFlip);
  const flipInProgress = useDiceStore((s) => !!s.coinFlip);
  const lastFlip = useDiceStore((s) => s.lastCoinFlip);

  const activeTheme = COIN_THEMES[coinTheme] || COIN_THEMES.ancient_gold;

  const handleFlip = () => {
    if (startCoinFlip(flipCount) && onFlipped) onFlipped();
  };

  return (
    <div className="coin-flip-system">
      <div className="coin-field">
        <span className="coin-field-label" id="coin-count-label">Coins</span>
        <div className="coin-count-picker" role="radiogroup" aria-labelledby="coin-count-label">
          {COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={flipCount === n}
              className={`coin-count-option ${flipCount === n ? 'active' : ''}`}
              onClick={() => setFlipCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="coin-field">
        <span className="coin-field-label" id="coin-look-label">Coin</span>
        <div className="coin-swatches" role="radiogroup" aria-labelledby="coin-look-label">
          {Object.values(COIN_THEMES).map((theme) => (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={coinTheme === theme.id}
              aria-label={theme.name}
              title={theme.name}
              className={`coin-swatch ${coinTheme === theme.id ? 'active' : ''}`}
              onClick={() => setCoinTheme(theme.id)}
              style={{
                '--coin-light': theme.primaryColor,
                '--coin-dark': theme.secondaryColor,
                '--coin-edge': theme.edgeColor,
              }}
            >
              <span className="coin-swatch-face" />
            </button>
          ))}
        </div>
        <span className="coin-swatch-name">{activeTheme.name}</span>
      </div>

      <div className="coin-flip-footer">
        <span className="coin-last-result">
          {lastFlip
            ? lastFlip.count === 1
              ? `Last flip: ${lastFlip.heads ? 'Heads' : 'Tails'}`
              : `Last flip: ${lastFlip.heads} heads · ${lastFlip.tails} tails`
            : 'Fair coins, 50 / 50'}
        </span>
        <button
          type="button"
          className="flip-button"
          onClick={handleFlip}
          disabled={flipInProgress}
        >
          {flipInProgress ? 'Flipping…' : `Flip ${flipCount} coin${flipCount > 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
};

export default CoinFlipSystem;
