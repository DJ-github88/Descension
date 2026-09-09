import React from 'react';
import PropTypes from 'prop-types';
import { getAbilityIconUrl, getIconUrl, getCustomIconUrl } from '../../utils/assetManager';
import './ActionFanOutMenu.css';

/**
 * ActionFanOutMenu
 * Renders an arc of action bubbles fanning out above an equipment slot.
 */
const ActionFanOutMenu = ({
    actions = [],
    isOpen = false,
    slotType = 'mainHand',
    onActionClick,
    onActionMouseEnter,
    onActionMouseLeave,
    onActionMouseMove
}) => {
    if (!isOpen || !actions || actions.length === 0) return null;

    // Radius of the arc fan-out in pixels (expanded to prevent overlapping)
    const radius = 94;

    // Calculate angles based on slot identity and action count to ensure clean arc spacing
    const getAngles = (slot, count) => {
        if (slot === 'mainHand') {
            // Biased upward and outward to the left, away from the central action bar scroll
            if (count === 1) return [-20];
            if (count === 2) return [-45, 5];
            if (count === 3) return [-62, -22, 16];
            if (count === 4) return [-72, -40, -10, 20];
            return [-80, -50, -22, 6, 34];
        }

        if (slot === 'ranged') {
            // Biased upward and outward to the right
            if (count === 1) return [20];
            if (count === 2) return [-5, 45];
            if (count === 3) return [-16, 22, 62];
            if (count === 4) return [-20, 10, 40, 72];
            return [-34, -6, 22, 50, 80];
        }

        // Off-hand / default: balanced vertical arc
        if (count === 1) return [0];
        if (count === 2) return [-26, 26];
        if (count === 3) return [-42, 0, 42];
        if (count === 4) return [-48, -16, 16, 48];
        return [-56, -28, 0, 28, 56];
    };

    const angles = getAngles(slotType, actions.length);

    // Resolve icon URL for an action
    const resolveActionIcon = (action) => {
        if (!action) return getCustomIconUrl('Utility/Parry', 'abilities');

        const iconId = action.typeConfig?.icon || action.icon || action.damageConfig?.icon || null;
        if (!iconId) return getCustomIconUrl('Utility/Parry', 'abilities');

        if (typeof iconId === 'string' && (iconId.startsWith('http') || iconId.startsWith('/assets/'))) {
            return iconId;
        }

        if (iconId.startsWith('Weapons/') || iconId.startsWith('Armor/') || iconId.startsWith('Misc/')) {
            return getIconUrl(iconId, 'items');
        }

        if (iconId.includes('/')) {
            return getAbilityIconUrl(iconId);
        }

        return getAbilityIconUrl(iconId);
    };

    return (
        <div className={`action-fanout-overlay slot-${slotType}`} onClick={(e) => e.stopPropagation()}>
            {actions.map((action, index) => {
                const angleDeg = angles[index] || 0;
                const angleRad = (angleDeg * Math.PI) / 180;
                // x = sin(angle) * radius, y = -cos(angle) * radius
                const x = Math.round(Math.sin(angleRad) * radius);
                const y = Math.round(-Math.cos(angleRad) * radius);

                const apCost = action.resourceCost?.actionPoints ?? 1;
                const isSpecial = action.resourceCost?.actionPoints === 2 || action.source === 'weapon_discipline';
                const iconSrc = resolveActionIcon(action);

                return (
                    <div
                        key={action.id || index}
                        className={`action-fan-bubble ${isSpecial ? 'special-action' : 'baseline-action'}`}
                        style={{
                            '--tx': `${x}px`,
                            '--ty': `${y}px`,
                            animationDelay: `${index * 35}ms`
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onActionClick) {
                                onActionClick(action, e);
                            }
                        }}
                        onMouseEnter={(e) => {
                            if (onActionMouseEnter) {
                                onActionMouseEnter(e, action);
                            }
                        }}
                        onMouseMove={(e) => {
                            if (onActionMouseMove) {
                                onActionMouseMove(e, action);
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (onActionMouseLeave) {
                                onActionMouseLeave(e, action);
                            }
                        }}
                    >
                        <div className="fan-bubble-icon-wrap">
                            <img
                                src={iconSrc}
                                alt={action.name}
                                onError={(e) => {
                                    e.target.src = getIconUrl('inv_misc_questionmark', 'items', true);
                                }}
                            />
                        </div>

                        {/* AP Badge */}
                        <div className={`fan-bubble-ap-pill ${isSpecial ? 'special-cost' : ''}`}>
                            {apCost} AP
                        </div>

                        {/* Special Glow Rim */}
                        {isSpecial && <div className="special-flourish-ring" />}
                    </div>
                );
            })}
        </div>
    );
};

ActionFanOutMenu.propTypes = {
    actions: PropTypes.array,
    isOpen: PropTypes.bool,
    slotType: PropTypes.string,
    onActionClick: PropTypes.func,
    onActionMouseEnter: PropTypes.func,
    onActionMouseLeave: PropTypes.func,
    onActionMouseMove: PropTypes.func
};

export default ActionFanOutMenu;
