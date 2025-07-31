import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import ItemTooltip from '../item-generation/ItemTooltip';
import { RARITY_COLORS, getQualityColor } from '../../constants/itemConstants';

const QuestReward = ({ reward, type, onRemove }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Handle mouse enter for item tooltip
  const handleMouseEnter = (e) => {
    setShowTooltip(true);
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handle mouse leave for item tooltip
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Handle mouse move for item tooltip
  const handleMouseMove = (e) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Render experience reward
  if (type === 'experience') {
    return (
      <div className="quest-reward quest-reward-experience">
        <div className="quest-reward-icon-container">
          <div className="quest-reward-icon quest-reward-icon-experience"></div>
        </div>
        <div className="quest-reward-text">
          <span className="quest-reward-value">{reward} Experience</span>
        </div>
      </div>
    );
  }

  // Render currency reward
  if (type === 'currency') {
    const { gold, silver, copper } = reward;

    if (gold === 0 && silver === 0 && copper === 0) {
      return null;
    }

    return (
      <div className="quest-reward quest-reward-currency">
        {gold > 0 && (
          <div className="quest-reward-currency-item">
            <img
              src={`${WOW_ICON_BASE_URL}inv_misc_coin_01.jpg`}
              alt="Gold"
              className="quest-reward-currency-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23ffd700"/></svg>';
              }}
            />
            <span className="quest-reward-currency-value">{gold}</span>
          </div>
        )}

        {silver > 0 && (
          <div className="quest-reward-currency-item">
            <img
              src={`${WOW_ICON_BASE_URL}inv_misc_coin_03.jpg`}
              alt="Silver"
              className="quest-reward-currency-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23c0c0c0"/></svg>';
              }}
            />
            <span className="quest-reward-currency-value">{silver}</span>
          </div>
        )}

        {copper > 0 && (
          <div className="quest-reward-currency-item">
            <img
              src={`${WOW_ICON_BASE_URL}inv_misc_coin_05.jpg`}
              alt="Copper"
              className="quest-reward-currency-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23b87333"/></svg>';
              }}
            />
            <span className="quest-reward-currency-value">{copper}</span>
          </div>
        )}
      </div>
    );
  }

  // Render item reward
  if (type === 'item') {
    const qualityLower = (reward.quality || reward.rarity || 'common').toLowerCase();
    const qualityColor = getQualityColor(qualityLower);
    const borderColor = RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;

    // Get the appropriate icon
    const iconId = reward.iconId || 'inv_misc_questionmark';
    const imageUrl = reward.imageUrl || `${WOW_ICON_BASE_URL}${iconId}.jpg`;

    return (
      <div className="quest-reward-item-wrapper" style={{ display: 'inline-block', textAlign: 'center', width: '60px' }}>
        <div
          className="quest-reward quest-reward-item reward-item-hoverable"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div
            className="quest-reward-item-container"
            style={{ borderColor: qualityColor, margin: '0 auto' }}
          >
            <img
              src={imageUrl}
              alt={reward.name}
              className="quest-reward-item-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${WOW_ICON_BASE_URL}inv_misc_questionmark.jpg`;
              }}
            />
            {reward.count > 1 && (
              <div className="quest-reward-item-count">
                {reward.count}
              </div>
            )}

            {/* Remove button that appears on hover - only show if onRemove is provided */}
            {onRemove && (
              <button
                type="button"
                className="item-remove-button-hover"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                title="Remove reward"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {showTooltip && createPortal(
          <div
            className="item-tooltip-wrapper"
            style={{
              position: 'fixed',
              top: tooltipPosition.y + 20,
              left: tooltipPosition.x + 10,
              zIndex: 99999
            }}
          >
            <ItemTooltip
              item={{
                ...reward,
                // Ensure all required properties are present for proper tooltip formatting
                name: reward.name || 'Unknown Item',
                quality: reward.quality || reward.rarity || 'common',
                rarity: reward.rarity || reward.quality || 'common',
                type: reward.type || 'weapon',
                subtype: reward.subtype,
                slot: reward.slot || 'main hand',

                // Stats
                baseStats: reward.baseStats || {},
                combatStats: reward.combatStats || {
                  armorClass: { value: reward.armorClass || 0 },
                  resistances: reward.resistances || {}
                },
                utilityStats: reward.utilityStats || {},
                weaponStats: reward.weaponStats || {},

                // Other properties
                description: reward.description || '',
                iconId: iconId,
                imageUrl: imageUrl,

                // Item dimensions
                width: reward.width || 1,
                height: reward.height || 1,

                // Value - ensure it's properly formatted to prevent NaN errors
                value: reward.value && typeof reward.value === 'object'
                  ? {
                      gold: parseInt(reward.value.gold) || 0,
                      silver: parseInt(reward.value.silver) || 0,
                      copper: parseInt(reward.value.copper) || 0
                    }
                  : { gold: 0, silver: 0, copper: 0 },

                // Required level
                requiredLevel: reward.requiredLevel || 0
              }}
            />
          </div>,
          document.body
        )}
        </div>

        <div className="quest-reward-item-name" style={{
          textAlign: 'center',
          marginTop: '5px',
          fontSize: '12px',
          color: qualityColor,
          fontWeight: '600',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          width: '60px',
          margin: '5px auto 0 auto',
          wordWrap: 'break-word',
          lineHeight: '1.2',
          fontFamily: 'Bookman Old Style, Garamond, serif',
          textDecoration: 'none',
          border: 'none',
          borderBottom: 'none'
        }}>
          {(reward.name || 'Unknown Item')
            .replace(/_/g, ' ')
            .replace(/[_\u005F\u2017\u203E\u0332\u2014\u2013\u2012\u2011\u2010]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()}
        </div>
      </div>
    );
  }

  return null;
};

export default QuestReward;
