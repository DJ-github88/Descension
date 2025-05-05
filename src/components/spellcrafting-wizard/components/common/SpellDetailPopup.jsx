import React from 'react';
import WowWindow from '../../../windows/WowWindow';
import LibraryStyleSpellCard from './LibraryStyleSpellCard';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import '../../styles/ConsolidatedSpellCard.css';

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
    <WowWindow
      isOpen={isOpen}
      onClose={onClose}
      title={`Spell Details: ${spell.name}`}
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
          <LibraryStyleSpellCard spell={spell} />
        </div>

        {/* Action buttons */}
        <div className="spell-detail-actions" style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            className="wow-button secondary"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'rgba(30, 30, 46, 0.7)',
              border: '1px solid #313244',
              borderRadius: '4px',
              color: '#cdd6f4',
              cursor: 'pointer'
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
              padding: '8px 16px',
              background: 'rgba(30, 64, 175, 0.7)',
              border: '1px solid #1e40af',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            Select Spell
          </button>
        </div>
      </div>
    </WowWindow>
  );
};

export default SpellDetailPopup;
