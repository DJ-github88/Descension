/**
 * Compact Dice Selection Bar
 * Single button that opens a dropdown popup
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useDiceStore, { DICE_TYPES, DICE_PRESETS, DICE_MATERIALS } from '../../store/diceStore';
import ChargeableRollButton from './ChargeableRollButton';
import CardDrawSystem from './CardDrawSystem';
import CoinFlipSystem from './CoinFlipSystem';
import SpellAoEPanel from '../grid/SpellAoEPanel';
import './DiceSelectionBar.css';

const DiceSelectionBar = () => {
  const location = useLocation();
  // Spell AoE templates are a live-table tool — game/room routes only
  const isGameRoute =
    location.pathname.startsWith('/game') || location.pathname.startsWith('/multiplayer');

  const {
    selectedDice,
    isRolling,
    addDice,
    removeDice,
    clearSelectedDice,
    setDiceQuantity,
    getTotalDiceCount,
    getFormattedRollString,
    startRoll,
    activePreset,
    setDicePreset,
    diceMaterial,
    setDiceMaterial
  } = useDiceStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showQuickRoll, setShowQuickRoll] = useState(false);
  const [selectedOrb, setSelectedOrb] = useState(null); // 'dice', 'cards', or null
  const dropdownRef = useRef(null);

  // ── Draggable popup state ────────────────────────────────────────────────
  // popupOffset is relative to the default CSS-positioned anchor (bottom-left).
  // When the user drags the handle we accumulate a translate3d offset so the
  // popup floats freely without fighting the fixed+absolute CSS stacking.
  const [popupOffset, setPopupOffset] = useState({ x: 0, y: 0 });
  // Mirror the state value into a ref so the stable handleDragStart callback
  // can read the current offset at pointer-down time without being in deps.
  const popupOffsetRef = useRef({ x: 0, y: 0 });
  const dragStateRef = useRef({ dragging: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  // Keep the ref in sync with state.
  popupOffsetRef.current = popupOffset;

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragStateRef.current = {
      dragging: true,
      startX: clientX,
      startY: clientY,
      // Read current offset from ref — stable, no extra deps needed.
      originX: popupOffsetRef.current.x,
      originY: popupOffsetRef.current.y,
    };

    const onMove = (ev) => {
      if (!dragStateRef.current.dragging) return;
      const cx = ev.clientX ?? ev.touches?.[0]?.clientX ?? 0;
      const cy = ev.clientY ?? ev.touches?.[0]?.clientY ?? 0;
      setPopupOffset({
        x: dragStateRef.current.originX + (cx - dragStateRef.current.startX),
        y: dragStateRef.current.originY + (cy - dragStateRef.current.startY),
      });
    };

    const onUp = () => {
      dragStateRef.current.dragging = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
  }, []); // stable — reads from refs, not from state

  // Close dropdown when clicking outside or toggle from external button
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => {
        if (!prev) setPopupOffset({ x: 0, y: 0 }); // reset position on open
        return !prev;
      });
      setSelectedOrb(null);
    };

    window.addEventListener('toggle-dice-roller', handleToggle);

    const handleClickOutside = (event) => {
      // Do not close if clicking inside a 3D scene overlay portal
      if (
        event.target &&
        event.target.closest &&
        event.target.closest(
          '.physics-card-overlay, .physics-coin-overlay, .physics-dice-overlay, .landed-coin-marker, .card-3d-result-area, .coin-3d-result-area, .spell-action-cog-btn'
        )
      ) {
        return;
      }

      // Do not close while an AoE placement is armed on the map — map clicks
      // (caster origin / confirm) land on the catcher, and the user must be
      // able to live-edit shape/size/color in this dropdown mid-placement.
      if (
        event.target &&
        event.target.closest &&
        event.target.closest('.spell-aoe-catcher, .spell-aoe-placed-chip')
      ) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedOrb(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('toggle-dice-roller', handleToggle);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const totalDice = getTotalDiceCount();
  const rollString = getFormattedRollString();

  // Handle dice type click
  const handleDiceClick = (diceType, event) => {
    event.stopPropagation();
    if (event.shiftKey) {
      removeDice(diceType);
    } else {
      addDice(diceType);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (diceType, value) => {
    const quantity = parseInt(value) || 0;
    setDiceQuantity(diceType, quantity);
  };

  // Handle roll with velocity
  const handleRoll = (throwPower = 1.0, throwDirection = { x: 0, z: 0 }) => {
    if (selectedDice.length === 0 || isRolling) return;
    startRoll({ throwPower, throwDirection });
    setIsOpen(false); // Close dropdown after rolling
  };

  // Quick roll (single die) with velocity
  const handleQuickRoll = (diceType, throwPower = 1.0, throwDirection = { x: 0, z: 0 }) => {
    clearSelectedDice();
    addDice(diceType, 1);
    startRoll({ throwPower, throwDirection });
    setIsOpen(false);
  };

  return (
    <div className="dice-roller-compact" ref={dropdownRef}>
      {/* Main Button */}
      <button
        className={`dice-button ${isOpen ? 'active' : ''} ${totalDice > 0 ? 'has-dice' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!isOpen) setPopupOffset({ x: 0, y: 0 }); // reset position on open
          setIsOpen(!isOpen);
          setSelectedOrb(null);
        }}
        title={rollString ? `Roll: ${rollString}` : 'Dice Roller'}
      >
        <i className="fas fa-cog dice-button-icon"></i>
        {totalDice > 0 && (
          <span className="dice-count-badge">{totalDice}</span>
        )}
        {isRolling && <span className="rolling-indicator"></span>}
      </button>

      {/* Orb Options - Show when button is clicked */}
      {isOpen && !selectedOrb && (
        <div className="orb-container">
          {/* Dice Orb */}
          <button
            className="orb orb-dice"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrb('dice');
            }}
            title="Dice Roller"
          >
            <i className="fas fa-dice orb-icon"></i>
          </button>

          {/* Cards Orb */}
          <button
            className="orb orb-cards"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrb('cards');
            }}
            title="Card Draw"
          >
            <span className="orb-icon">♠</span>
          </button>

          {/* Coin Orb */}
          <button
            className="orb orb-coin"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrb('coin');
            }}
            title="Coin Flip"
          >
            <i className="fas fa-coins orb-icon"></i>
          </button>

          {/* AoE Orb - game/room routes only */}
          {isGameRoute && (
            <button
              className="orb orb-aoe"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrb('aoe');
              }}
              title="Spell AoE Templates"
            >
              <span className="orb-icon">◎</span>
            </button>
          )}
        </div>
      )}

      {/* Dice Dropdown - Show when dice orb is selected */}
      {isOpen && selectedOrb === 'dice' && (
        <div
          className="dice-dropdown dice-dropdown-dice"
          style={{ transform: `translate3d(${popupOffset.x}px, ${popupOffset.y}px, 0)` }}
        >
          {/* ── Drag Handle ─────────────────────────────────────────────── */}
          <div
            className="dice-dropdown-drag-handle"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            title="Drag to reposition"
          >
            <span className="dice-drag-dots">⠿</span>
            <span className="dice-drag-label">Dice Roller</span>
            <span className="dice-drag-dots">⠿</span>
          </div>

          {/* Header */}
          <div className="dice-dropdown-header">
            <span className="dice-dropdown-title">Select Dice</span>
            {totalDice > 0 && (
              <button
                className="clear-all-button"
                onClick={clearSelectedDice}
                title="Clear all dice"
              >
                <i className="fas fa-trash-can" aria-hidden="true"></i>
                Clear
              </button>
            )}
          </div>

          {/* Scrollable body: everything except the roll action */}
          <div className="dice-dropdown-body">
            {/* Quick Roll Buttons */}
            <div className="quick-roll-section">
              <div className="quick-roll-label">Quick Roll:</div>
              <div className="quick-roll-buttons">
                {Object.values(DICE_TYPES).slice(0, 6).map(diceType => (
                  <button
                    key={diceType.id}
                    className="quick-roll-button"
                    onClick={() => handleQuickRoll(diceType.id)}
                    disabled={isRolling}
                    title={`Quick roll ${diceType.name}`}
                  >
                    <span className="dice-icon-shape" />
                    <span className="dice-btn-label">{diceType.name}</span>
                  </button>
                ))}
                <button
                  className="quick-roll-button"
                  onClick={() => handleQuickRoll('dpercent')}
                  disabled={isRolling}
                  title="Quick roll percentile (00-90)"
                >
                  D%
                </button>
                <button
                  className="quick-roll-button"
                  onClick={() => handleQuickRoll('d100')}
                  disabled={isRolling}
                  title="Quick roll D100 (percentile + d10)"
                >
                  D100
                </button>
              </div>
            </div>

            {/* Dice Selection */}
            <div className="dice-selection-section">
              <div className="dice-selection-label">Select Dice:</div>
              <div className="dice-grid">
                {Object.values(DICE_TYPES).map(diceType => {
                  const selectedDiceOfType = selectedDice.find(d => d.type === diceType.id);
                  const quantity = selectedDiceOfType ? selectedDiceOfType.quantity : 0;

                  return (
                    <div key={diceType.id} className={`dice-item ${quantity > 0 ? 'active' : ''}`}>
                      <button
                        className={`dice-select-button dice-btn-${diceType.id} ${quantity > 0 ? 'selected' : ''}`}
                        onClick={(e) => handleDiceClick(diceType.id, e)}
                        style={{ '--dice-color': diceType.color }}
                        title={`${diceType.name} (${diceType.sides} sides) — Click to add (+1), Shift+Click to remove`}
                      >
                        {quantity > 0 && (
                          <span className="dice-tile-count-badge">{quantity}</span>
                        )}
                        <span className="dice-icon-shape" />
                        <span className="dice-btn-label">{diceType.name}</span>
                      </button>
                      {quantity > 0 && (
                        <div className="dice-quantity-control">
                          <button
                            className="quantity-decrement"
                            onClick={() => removeDice(diceType.id)}
                            title="Decrease (-1)"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(diceType.id, e.target.value)}
                            className="quantity-input"
                          />
                          <button
                            className="quantity-increment"
                            onClick={() => addDice(diceType.id)}
                            title="Increase (+1)"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dice Theme Presets */}
            <div className="dice-preset-section">
              <div className="dice-preset-label">Theme:</div>
              <div className="dice-preset-grid">
                {Object.values(DICE_PRESETS).map(preset => (
                  <button
                    key={preset.id}
                    className={`dice-preset-chip ${activePreset === preset.id ? 'active' : ''}`}
                    onClick={() => setDicePreset(preset.id)}
                    title={preset.name}
                  >
                    <span
                      className="dice-preset-tile"
                      style={{
                        '--tile-base': `linear-gradient(135deg, ${preset.bodyColor}, ${preset.edgeColor})`,
                        '--tile-emissive': preset.emissive,
                        '--tile-emissive-strength': preset.emissiveIntensity,
                        '--tile-number': preset.numberColor,
                        '--tile-glow': preset.glowColor || preset.edgeColor,
                      }}
                    >
                      <span className="dice-preset-tile-number">20</span>
                    </span>
                    <span className="dice-preset-name">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dice Weight Material */}
            <div className="dice-preset-section">
              <div className="dice-preset-label">Material &amp; Weight:</div>
              <div className="dice-preset-grid dice-material-grid">
                {Object.values(DICE_MATERIALS).map(material => (
                  <button
                    key={material.id}
                    className={`dice-preset-chip dice-material-chip ${diceMaterial === material.id ? 'active' : ''}`}
                    onClick={() => setDiceMaterial(material.id)}
                    title={material.description}
                  >
                    <span
                      className="dice-preset-tile"
                      style={{
                        '--tile-base': material.tile,
                        '--tile-glow': material.glow,
                      }}
                    >
                      <i className={`${material.icon} dice-material-tile-icon`}></i>
                    </span>
                    <div className="dice-material-info">
                      <span className="dice-material-name">{material.name}</span>
                      <span className="dice-material-sub">
                        {material.id === 'steel' ? 'Heavy' : material.id === 'stone' ? 'Balanced' : material.id === 'wood' ? 'Bouncy' : 'Light'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roll summary & button — pinned footer, always visible */}
          <div className="dice-dropdown-footer">
            <div className="roll-summary-text">
              {totalDice > 0 ? (
                <>
                  <strong>{rollString}</strong>
                  <span className="roll-total-label">({totalDice} dice)</span>
                </>
              ) : (
                <span className="roll-hint">Pick dice or use Quick Roll</span>
              )}
            </div>
            <ChargeableRollButton
              className="roll-button"
              onRoll={(power, dir) => handleRoll(power, dir)}
              disabled={isRolling || totalDice === 0}
              title="Click or Hold & Release to throw with velocity"
            >
              {isRolling ? 'Rolling...' : 'Roll'}
            </ChargeableRollButton>
          </div>
        </div>
      )}

      {/* Cards Dropdown - Show when cards orb is selected */}
      {isOpen && selectedOrb === 'cards' && (
        <div className="dice-dropdown dice-dropdown-cards">
          <div className="dice-dropdown-header">
            <span className="dice-dropdown-title">Card Draw</span>
            <button
              className="clear-all-button"
              onClick={() => setSelectedOrb(null)}
              title="Back"
            >
              ←
            </button>
          </div>
          {/* Card draw component */}
          <CardDrawSystem />
        </div>
      )}

      {/* Coin Dropdown - Show when coin orb is selected */}
      {isOpen && selectedOrb === 'coin' && (
        <div className="dice-dropdown">
          <div className="dice-dropdown-header">
            <span className="dice-dropdown-title">Coin Flip</span>
            <button
              className="clear-all-button"
              onClick={() => setSelectedOrb(null)}
              title="Back"
            >
              ←
            </button>
          </div>
          {/* Coin flip component */}
          <CoinFlipSystem />
        </div>
      )}

      {/* AoE Dropdown - Show when AoE orb is selected (game/room only) */}
      {isOpen && selectedOrb === 'aoe' && isGameRoute && (
        <div className="dice-dropdown dice-dropdown-aoe">
          <div className="dice-dropdown-header">
            <span className="dice-dropdown-title">Spell Templates</span>
            <button
              className="clear-all-button"
              onClick={() => setSelectedOrb(null)}
              title="Back"
            >
              ←
            </button>
          </div>
          {/* AoE template placement component */}
          <SpellAoEPanel />
        </div>
      )}
    </div>
  );
};

export default DiceSelectionBar;
