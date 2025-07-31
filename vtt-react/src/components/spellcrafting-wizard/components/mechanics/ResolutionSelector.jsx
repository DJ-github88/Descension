import React from 'react';
import { FaDice, FaClone, FaCoins } from 'react-icons/fa6';
import '../../styles/ResolutionSelector.css';

/**
 * ResolutionSelector component
 * Allows selecting between different resolution methods (dice, cards, coins)
 *
 * @param {Object} props
 * @param {string} props.selectedResolution - Currently selected resolution type
 * @param {Function} props.onResolutionChange - Callback when resolution type changes
 */
const ResolutionSelector = ({
  selectedResolution = 'DICE',
  onResolutionChange
}) => {
  // Resolution types with icons and descriptions
  const resolutionTypes = [
    {
      id: 'DICE',
      name: 'Dice',
      description: 'Resolve effects using dice rolls',
      icon: FaDice
    },
    {
      id: 'CARDS',
      name: 'Cards',
      description: 'Resolve effects using card draws',
      icon: FaClone
    },
    {
      id: 'COINS',
      name: 'Coins',
      description: 'Resolve effects using coin flips',
      icon: FaCoins
    }
  ];

  return (
    <div className="resolution-selector">
      <div className="resolution-options">
        {resolutionTypes.map(resolution => (
          <div
            key={resolution.id}
            className={`resolution-option ${selectedResolution === resolution.id ? 'selected' : ''}`}
            onClick={() => onResolutionChange(resolution.id)}
          >
            <div className="resolution-icon">
              <resolution.icon />
            </div>
            <div className="resolution-info">
              <div className="resolution-name">{resolution.name}</div>
              <div className="resolution-description">{resolution.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionSelector;
