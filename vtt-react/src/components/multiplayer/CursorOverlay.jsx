import React, { useEffect } from 'react';
import useGameStore from '../../store/gameStore';
import './styles/CursorOverlay.css';

const CursorOverlay = ({ cursors }) => {
  const { cursorFadeTime } = useGameStore();

  // Clean up old cursors
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      // This would be handled by the parent component clearing old cursors
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!cursors || Object.keys(cursors).length === 0) {
    return null;
  }

  return (
    <div className="cursor-overlay">
      {Object.entries(cursors).map(([playerId, cursor]) => {
        const now = Date.now();
        const age = now - cursor.lastUpdate;
        const isFading = age > (cursorFadeTime - 1000); // Start fading 1 second before full fade

        return (
          <div
            key={playerId}
            className={`player-cursor ${isFading ? 'fading' : ''}`}
            style={{
              left: cursor.x,
              top: cursor.y,
              opacity: isFading ? Math.max(0, (cursorFadeTime - age) / 1000) : 1
            }}
          >
            <div className="cursor-pointer">
              <div className="cursor-name">{cursor.playerName || 'Player'}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CursorOverlay;
