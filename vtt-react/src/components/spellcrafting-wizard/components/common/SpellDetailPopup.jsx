import React from 'react';
import MythrillWindow from '../../../windows/MythrillWindow';
import UnifiedSpellCard from './UnifiedSpellCard';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
// Pathfinder styles imported via main.css

/**
 * SpellDetailPopup component
 * Displays a popup window with detailed information about a spell
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the popup is open
 * @param {Function} props.onClose - Callback when the popup is closed
 * @param {string} props.spellId - ID of the spell to display
 * @param {Function} props.onSelectSpell - Callback when the spell is selected
 */
const SpellDetailPopup = ({ isOpen, onClose, spellId, onSelectSpell }) => {
  // Get spell library context
  const spellLibrary = useSpellLibrary();

  // Find the spell in the library
  const spell = spellLibrary?.spells?.find(s => s.id === spellId);

  if (!isOpen || !spell) return null;

  return (
    <MythrillWindow
      isOpen={isOpen}
      onClose={onClose}
      title={`Spell Details: ${spell.name}`}
      modal={true}
      centered={true}
      defaultSize={{ width: 500, height: 700 }}
      defaultPosition={{ x: 200, y: 100 }}
    >
      <div className="spell-detail-popup-content" style={{
        padding: '15px',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {/* Spell card */}
        <div className="spell-card-container" style={{ flex: 1 }}>
          <UnifiedSpellCard
            spell={spell}
            variant="wizard"
            showActions={false}
            showDescription={true}
            showStats={true}
            showTags={true}
          />
        </div>

        {/* Action buttons */}
        <div className="spell-detail-actions" style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 0 0 0',
          borderTop: '1px solid #c4baa6'
        }}>
          <button
            className="wow-button secondary"
            onClick={onClose}
            style={{
              padding: '9px 20px',
              background: '#e8e2d4',
              border: '1px solid #9c8970',
              borderRadius: '6px',
              color: '#34251a',
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(40, 30, 20, 0.1)'
            }}
          >
            Cancel
          </button>

          <button
            className="wow-button primary"
            onClick={() => {
              onSelectSpell(spellId);
              onClose();
            }}
            style={{
              padding: '9px 22px',
              background: 'linear-gradient(180deg, #663c32 0%, #522d25 100%)',
              border: '1px solid #421e17',
              borderRadius: '6px',
              color: '#fdf8ee',
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(60, 20, 15, 0.25)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)'
            }}
          >
            Select Spell
          </button>
        </div>
      </div>
    </MythrillWindow>
  );
};

export default SpellDetailPopup;
