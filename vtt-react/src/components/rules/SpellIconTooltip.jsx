import React, { useState, useRef, useEffect, useCallback } from 'react';
import SpellTooltip from '../spellcrafting-wizard/components/common/SpellTooltip';
import { UNIVERSAL_SPELL_MAP } from '../../data/universalCombatSpells';
import { ALL_GENERAL_SPELLS } from '../../data/generalSpellsData';

/**
 * SpellIconTooltip Component
 * 
 * Renders a spell icon with a hover tooltip showing the full spell card.
 * Used in rules tables to replace text with interactive spell icons.
 */
const SpellIconTooltip = ({ spellId, className = '', style = {} }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const iconRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);

  // Get spell data - check universal spells first, then general spells
  let spell = UNIVERSAL_SPELL_MAP[spellId];
  
  // If not found in universal spells, check general spells
  if (!spell) {
    // For general spells, match by id or name
    // Special case: 'general_attack' maps to the Attack spell
    if (spellId === 'general_attack') {
      spell = ALL_GENERAL_SPELLS.find(s => s.name === 'Attack');
    } else {
      spell = ALL_GENERAL_SPELLS.find(s => 
        s.id === spellId || 
        s.name === spellId
      );
    }
  }

  // If spell not found, return null or fallback
  if (!spell) {
    console.warn(`Spell not found: ${spellId}`);
    return null;
  }

  // Get spell icon
  const getSpellIcon = () => {
    return spell.typeConfig?.icon || spell.icon || 'inv_misc_questionmark';
  };

  // Handle mouse enter with delay
  const handleMouseEnter = useCallback((e) => {
    // Mark that we're hovering
    isHoveringRef.current = true;
    
    // Clear any existing hide timeout immediately
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Store the current mouse position for initial tooltip placement
    const currentMouseX = e.clientX;
    const currentMouseY = e.clientY;

    // Set show timeout
    hoverTimeoutRef.current = setTimeout(() => {
      // Only show if we're still hovering
      if (isHoveringRef.current && hoverTimeoutRef.current) {
        // Use mouse position for tooltip placement
        const tooltipX = currentMouseX + 15;
        const tooltipY = currentMouseY - 10;

        setTooltipPosition({ x: tooltipX, y: tooltipY });
        setShowTooltip(true);
      }
    }, 200); // 200ms delay before showing tooltip
  }, []);

  // Handle mouse move to update tooltip position
  const handleMouseMove = useCallback((e) => {
    // Update position immediately if tooltip is showing
    if (showTooltip) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const tooltipX = mouseX + 15;
      const tooltipY = mouseY - 10;

      setTooltipPosition({ x: tooltipX, y: tooltipY });
    }
  }, [showTooltip]);

  // Handle mouse leave - hide immediately
  const handleMouseLeave = useCallback(() => {
    // Mark that we're no longer hovering
    isHoveringRef.current = false;
    
    // Clear any existing show timeout immediately
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Hide tooltip immediately when mouse leaves
    setShowTooltip(false);
    
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
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
        className={`spell-icon-tooltip-trigger ${className}`}
        style={{
          display: 'inline-block',
          cursor: 'pointer',
          ...style
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        title={spell.name}
      >
        <img
          src={`https://wow.zamimg.com/images/wow/icons/large/${getSpellIcon()}.jpg`}
          alt={spell.name}
          style={{
            width: '32px',
            height: '32px',
            verticalAlign: 'middle',
            marginRight: '4px',
            border: '2px solid #8b4513',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
          }}
        />
      </span>

      {/* Tooltip with Full Spell Card */}
      {showTooltip && (
        <SpellTooltip
          spell={spell}
          position={tooltipPosition}
          onMouseEnter={() => {
            // Keep tooltip visible when hovering over it
            // Clear any pending hide operations
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
            // Cancel any pending show timeout (already shown)
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            // Hide immediately when leaving tooltip
            setShowTooltip(false);
            // Clear any pending timeouts
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
          }}
        />
      )}
    </>
  );
};

export default SpellIconTooltip;

