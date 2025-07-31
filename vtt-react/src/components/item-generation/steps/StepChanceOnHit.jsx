import React from 'react';
import ChanceOnBeingHitConfig from '../ChanceOnBeingHitConfig';
import { FaShieldAlt } from 'react-icons/fa';
import '../../../styles/item-wizard.css';

/**
 * StepChanceOnHit component
 * Dedicated step for configuring chance-on-being-hit effects in the item wizard
 *
 * @param {Object} props
 * @param {Object} props.itemData - The current item data
 * @param {Function} props.updateItemData - Function to update item data
 */
const StepChanceOnHit = ({ itemData, updateItemData }) => {
  return (
    <div className="wizard-step">
      <h3 className="wow-heading quality-text">
        <FaShieldAlt style={{ marginRight: '8px' }} />
        Chance on Being Hit Effects
      </h3>
      
      <div className="wow-flavor-text" style={{ marginBottom: '20px', fontStyle: 'italic', color: '#aaa' }}>
        Configure effects that have a chance to trigger when the wearer takes damage.
        These defensive mechanisms can provide protection or reactive effects to the bearer.
      </div>

      <div className="chance-on-hit-step-content">
        <ChanceOnBeingHitConfig
          config={itemData.combatStats.onHitEffects}
          onConfigChange={(onHitConfig) => {
            updateItemData({
              combatStats: {
                ...itemData.combatStats,
                onHitEffects: onHitConfig
              }
            });
          }}
        />
      </div>

      <div className="chance-on-hit-tips">
        <h4 className="wow-section-header" style={{ color: '#ffd100', marginTop: '20px' }}>Tips</h4>
        <ul className="wow-tips-list">
          <li>Effects can trigger based on dice rolls, card draws, or coin flips</li>
          <li>Higher thresholds for dice rolls mean lower proc chances</li>
          <li>You can select any spell from your library to trigger when taking damage</li>
          <li>Consider using rollable tables for more varied effects</li>
        </ul>
      </div>
    </div>
  );
};

export default StepChanceOnHit;
