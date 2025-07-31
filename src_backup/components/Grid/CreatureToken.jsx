import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useCreatureStore from '../../../vtt-react/src/store/creatureStore';
import '../../styles/creature-token.css';

// Helper function to get icon URL
const getIconUrl = (iconId) => {
  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};

const CreatureToken = ({ tokenId, position, onRemove }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const contextMenuRef = useRef(null);
  const tokenRef = useRef(null);

  const { tokens, creatures, updateTokenPosition, updateTokenState, removeToken } = useCreatureStore();

  // Find the token and creature data
  console.log('CreatureToken component received props:', { tokenId, position });
  console.log('Current tokens in store:', tokens);
  console.log('Current creatures in store:', creatures);

  const token = tokens.find(t => t.id === tokenId);
  console.log('Found token:', token);

  const creature = token ? creatures.find(c => c.id === token.creatureId) : null;
  console.log('Found creature:', creature);

  // Handle context menu
  const handleContextMenu = (e) => {
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;

    setContextMenuPosition({ x, y });
    setShowContextMenu(true);
  };

  // Handle mouse enter (show tooltip)
  const handleMouseEnter = (e) => {
    if (!tokenRef.current) return;

    const rect = tokenRef.current.getBoundingClientRect();

    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    });

    setShowTooltip(true);
  };

  // Handle mouse leave (hide tooltip)
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Handle click outside to close context menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle token removal
  const handleRemoveToken = () => {
    if (onRemove) {
      onRemove(tokenId);
    } else {
      removeToken(tokenId);
    }
    setShowContextMenu(false);
  };

  // Handle damage token
  const handleDamageToken = (amount) => {
    if (!token) return;

    const currentHp = token.state.currentHp;
    const newHp = Math.max(0, currentHp - amount);

    updateTokenState(tokenId, {
      currentHp: newHp
    });

    setShowContextMenu(false);
  };

  // Handle heal token
  const handleHealToken = (amount) => {
    if (!token || !creature) return;

    const currentHp = token.state.currentHp;
    const maxHp = creature.stats.maxHp;
    const newHp = Math.min(maxHp, currentHp + amount);

    updateTokenState(tokenId, {
      currentHp: newHp
    });

    setShowContextMenu(false);
  };

  // If token not found, don't render anything
  if (!token) {
    console.error('Token not found with ID:', tokenId);
    return null;
  }

  // If creature not found, render a placeholder token
  if (!creature) {
    console.error('Creature not found with ID:', token.creatureId);
    return (
      <div
        className="creature-token placeholder"
        style={{
          left: position ? position.x : token.position.x,
          top: position ? position.y : token.position.y,
          backgroundColor: 'red',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontWeight: 'bold',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
        }}
      >
        ?
      </div>
    );
  }

  // Calculate health percentage for the health bar
  const healthPercentage = (token.state.currentHp / creature.stats.maxHp) * 100;

  // Determine health bar color based on percentage
  const getHealthBarColor = (percentage) => {
    if (percentage > 60) return '#4CAF50'; // Green
    if (percentage > 30) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button

    e.stopPropagation();

    const rect = tokenRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    setIsDragging(true);
    setShowTooltip(false);
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      // Calculate new position
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;

      // Update token position
      updateTokenPosition(tokenId, { x, y });
    };

    const handleMouseUp = (e) => {
      if (!isDragging) return;

      // Calculate final position
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;

      // Snap to grid
      const tileSize = 50; // Same as in Grid component
      const snappedX = Math.round(x / tileSize) * tileSize + (tileSize / 2);
      const snappedY = Math.round(y / tileSize) * tileSize + (tileSize / 2);

      // Update token position with snapped coordinates
      updateTokenPosition(tokenId, { x: snappedX, y: snappedY });

      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, tokenId, updateTokenPosition]);

  return (
    <>
      <div
        ref={tokenRef}
        className={`creature-token ${isDragging ? 'dragging' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          borderColor: creature.tokenBorder,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
      >
        <div
          className="token-icon"
          style={{ backgroundImage: `url(${getIconUrl(creature.tokenIcon)})` }}
        ></div>

        <div className="token-health-bar">
          <div
            className="health-fill"
            style={{
              width: `${healthPercentage}%`,
              backgroundColor: getHealthBarColor(healthPercentage)
            }}
          ></div>
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && createPortal(
        <div
          ref={contextMenuRef}
          className="creature-token-context-menu"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y
          }}
        >
          <div className="context-menu-header">
            <div className="creature-name">{creature.name}</div>
            <div className="creature-hp">
              HP: {token.state.currentHp}/{creature.stats.maxHp}
            </div>
          </div>

          <div className="context-menu-section">
            <div className="section-title">Combat</div>
            <button className="context-menu-button" onClick={() => handleDamageToken(5)}>
              <i className="fas fa-minus-circle"></i> Damage (5)
            </button>
            <button className="context-menu-button" onClick={() => handleDamageToken(10)}>
              <i className="fas fa-minus-circle"></i> Damage (10)
            </button>
            <button className="context-menu-button" onClick={() => handleHealToken(5)}>
              <i className="fas fa-plus-circle"></i> Heal (5)
            </button>
            <button className="context-menu-button" onClick={() => handleHealToken(10)}>
              <i className="fas fa-plus-circle"></i> Heal (10)
            </button>
          </div>

          <div className="context-menu-section">
            <button className="context-menu-button danger" onClick={handleRemoveToken}>
              <i className="fas fa-trash"></i> Remove Token
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Tooltip */}
      {showTooltip && createPortal(
        <div
          className="creature-token-tooltip"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y
          }}
        >
          <div className="tooltip-header">
            <div className="tooltip-name">{creature.name}</div>
            <div className="tooltip-type">{creature.size} {creature.type}</div>
          </div>

          <div className="tooltip-stats">
            <div className="tooltip-stat">
              <span className="stat-label">HP:</span>
              <span className="stat-value">{token.state.currentHp}/{creature.stats.maxHp}</span>
            </div>

            {creature.stats.maxMana > 0 && (
              <div className="tooltip-stat">
                <span className="stat-label">Mana:</span>
                <span className="stat-value">{token.state.currentMana}/{creature.stats.maxMana}</span>
              </div>
            )}

            <div className="tooltip-stat">
              <span className="stat-label">AC:</span>
              <span className="stat-value">{creature.stats.armorClass}</span>
            </div>

            <div className="tooltip-stat">
              <span className="stat-label">Speed:</span>
              <span className="stat-value">{creature.stats.speed}</span>
            </div>
          </div>

          {creature.abilities && creature.abilities.length > 0 && (
            <div className="tooltip-abilities">
              <div className="section-title">Abilities</div>
              <ul className="abilities-list">
                {creature.abilities.slice(0, 3).map((ability, index) => (
                  <li key={index} className="ability-item">
                    {ability.name}
                    {ability.damage && <span className="ability-damage"> ({typeof ability.damage === 'object'
                      ? `${ability.damage.diceCount}d${ability.damage.diceType}${ability.damage.bonus > 0 ? `+${ability.damage.bonus}` : ''} ${ability.damage.damageType || ''}`
                      : ability.damage})</span>}
                  </li>
                ))}
                {creature.abilities.length > 3 && (
                  <li className="ability-item more">+{creature.abilities.length - 3} more...</li>
                )}
              </ul>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default CreatureToken;
