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
    <>
      <h3 className="wow-heading quality-text">
        <FaShieldAlt style={{ marginRight: '8px' }} />
        Chance on Being Hit Effects
      </h3>

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
    </>
  );
};

export default StepChanceOnHit;
