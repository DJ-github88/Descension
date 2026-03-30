import React, { useState, useRef, useEffect, useCallback } from 'react';
import SpellTooltip from '../spellcrafting-wizard/components/common/SpellTooltip';
import { SKILL_ABILITIES, getSkillAbilities } from '../../data/skillAbilitiesData';
import { getIconUrl } from '../../utils/assetManager';

/**
 * SkillAbilityIconTooltip Component
 * 
 * Renders a skill ability icon with a hover tooltip showing the full spell card.
 * Used in rules tables to show skill-based abilities next to skill names.
 */

// Map skill names (as they appear in rules table) to skill IDs
const SKILL_NAME_TO_ID = {
  'Acrobatics': 'acrobatics',
  'Animal Handling': 'animalHandling',
  'Arcana': 'arcana',
  'Athletics': 'athletics',
  'Deception': 'deception',
  'History': 'history',
  'Insight': 'insight',
  'Intimidation': 'intimidation',
  'Investigation': 'investigation',
  'Medicine': 'medicine',
  'Nature': 'nature',
  'Perception': 'perception',
  'Performance': 'performance',
  'Persuasion': 'persuasion',
  'Religion': 'religion',
  'Sleight of Hand': 'sleightOfHand',
  'Stealth': 'stealth',
  'Survival': 'survival'
};

const SkillAbilityIconTooltip = ({ skillName, className = '', style = {} }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const iconRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);

  // Get skill ID from skill name
  const skillId = SKILL_NAME_TO_ID[skillName];
  
  // Get the first ability for this skill (most skills have one ability)
  const abilities = skillId ? getSkillAbilities(skillId) : [];
  const ability = abilities.length > 0 ? abilities[0] : null;

  // If no ability found, return null
  if (!ability) {
    return null;
  }

  // Get ability icon
  const getAbilityIcon = () => {
    return ability.typeConfig?.icon || ability.icon || 'inv_misc_questionmark';
  };

  // Handle mouse enter with delay
  const handleMouseEnter = useCallback((e) => {
    // Mark as hovering
    isHoveringRef.current = true;
    
    // Clear any existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Set hover timeout
    hoverTimeoutRef.current = setTimeout(() => {
      if (isHoveringRef.current && iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        const tooltipX = rect.right + 10;
        const tooltipY = rect.top;
        
        setTooltipPosition({ x: tooltipX, y: tooltipY });
        setShowTooltip(true);
      }
    }, 300); // 300ms delay before showing tooltip
  }, []);

  // Handle mouse move to update tooltip position
  const handleMouseMove = useCallback((e) => {
    if (showTooltip && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const tooltipX = rect.right + 10;
      const tooltipY = rect.top;
      
      setTooltipPosition({ x: tooltipX, y: tooltipY });
    }
  }, [showTooltip]);

  // Handle mouse leave with delay
  const handleMouseLeave = useCallback(() => {
    // Mark as not hovering
    isHoveringRef.current = false;
    
    // Clear hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Set hide timeout
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 200); // 200ms delay before hiding tooltip
  }, []);

  // Cleanup timeouts on unmount and ensure tooltip is hidden
  useEffect(() => {
    return () => {
      // Mark as not hovering
      isHoveringRef.current = false;
      
      // Clear all timeouts
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      
      // Hide tooltip if showing
      setShowTooltip(false);
    };
  }, []);

  return (
    <>
      <span
        ref={iconRef}
        className={`skill-ability-icon-tooltip-trigger ${className}`}
        style={{
          display: 'inline-block',
          cursor: 'pointer',
          flexShrink: 0,
          ...style
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        title={ability.name}
      >
        <img
          src={getIconUrl(getAbilityIcon(), 'abilities')}
          alt={ability.name}
          style={{
            width: '28px',
            height: '28px',
            verticalAlign: 'middle',
            border: '2px solid #d4af37',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(139, 69, 19, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 3px 8px rgba(139, 69, 19, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)';
            e.target.style.borderColor = '#f4d03f';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 6px rgba(139, 69, 19, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = '#d4af37';
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getIconUrl('Utility/Utility', 'abilities');
          }}
        />
      </span>

      {/* Tooltip with Full Spell Card */}
      {showTooltip && (
        <SpellTooltip
          spell={ability}
          position={tooltipPosition}
          onMouseEnter={() => {
            // Keep tooltip visible when hovering over it
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  );
};

export default SkillAbilityIconTooltip;

