import React, { useState, useRef, useEffect, useCallback } from 'react';
import SpellTooltip from '../spellcrafting-wizard/components/common/SpellTooltip';
import { UNIVERSAL_SPELL_MAP } from '../../data/universalCombatSpells';
import { ALL_GENERAL_SPELLS } from '../../data/generalSpellsData';
import { getAbilityIconUrl, getCustomIconUrl } from '../../utils/assetManager';

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
    // Note: 'general_attack' has been removed - Attack (Unarmed) is now dynamically generated
    if (spellId === 'general_attack') {
      // Return null for removed spell
      return null;
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

  // Helper function to map WoW icon IDs to local ability icons for spells
  const mapSpellIcon = (wowIconId) => {
    const iconMapping = {
      // Combat/Attack icons
      'ability_meleedamage': 'General/Combat Downward Strike',
      'ability_warrior_savageblow': 'General/Combat Downward Strike',
      'ability_warrior_charge': 'General/Combat Downward Strike',
      'ability_warrior_revenge': 'General/Combat Downward Strike',
      'ability_warrior_cleave': 'General/Combat Downward Strike',
      'ability_warrior_riposte': 'Utility/Parry',
      'ability_warrior_shieldbash': 'Utility/Shield',
      'ability_rogue_evasion': 'Utility/Speed Dash',
      'ability_rogue_feint': 'Utility/Parry',
      'ability_rogue_sprint': 'Utility/Speed Dash',
      'ability_rogue_tricksofthetrade': 'Utility/Speed Dash',
      'ability_stealth': 'Utility/Hide',
      'ability_hunter_snipershot': 'Utility/Target Crosshair',
      'ability_hunter_markedshot': 'Utility/Target Crosshair',
      'ability_hunter_markedfordeath': 'Utility/Target Crosshair',
      
      // Defensive icons
      'inv_shield_05': 'Utility/Shield',
      'inv_shield_04': 'Utility/Shield',
      'ability_warrior_defensivestance': 'Utility/Shield',
      'spell_holy_powerwordshield': 'Utility/Shield',
      'spell_holy_devotionaura': 'Radiant/Divine Blessing',
      
      // Healing/Support icons
      'spell_holy_greaterheal': 'Healing/Golden Heart',
      'spell_holy_heal02': 'Healing/Golden Heart',
      'spell_holy_flashheal': 'Healing/Golden Heart',
      'spell_holy_renew': 'Healing/Renewal',
      
      // Utility icons
      'spell_arcane_portaldalaran': 'Utility/Utility',
      'spell_arcane_teleportundercity': 'Utility/Utility',
      'spell_arcane_arcanetorrent': 'Arcane/Arcane Blast',
      'inv_misc_questionmark': 'Utility/Utility',
      'inv_misc_book_07': 'Utility/Utility',
      'inv_misc_bag_08': 'Utility/Utility',
      
      // Magic/Damage icons
      'spell_fire_fireball02': 'Fire/Swirling Fireball',
      'spell_fire_flamebolt': 'Fire/Flame Burst',
      'spell_frost_frostbolt02': 'Frost/Frozen in Ice',
      'spell_arcane_blast': 'Arcane/Magical Sword',
      'spell_shadow_shadowbolt': 'Shadow/Shadow Darkness',
      'spell_holy_holysmite': 'Radiant/Divine Blessing',
      'spell_nature_lightning': 'Lightning/Lightning Bolt',
      
      // Control icons
      'spell_frost_chainsofice': 'Frost/Frozen in Ice',
      'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',
      
      // Buff icons
      'spell_holy_divineillumination': 'Radiant/Divine Blessing',
      'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',
      
      // Summoning icons
      'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',
      'spell_shadow_summoninfernal': 'Utility/Summon Minion',
      
      // Transformation icons
      'ability_druid_catform': 'Utility/Utility',
      
      // Trap icons
      'spell_fire_selfdestruct': 'Utility/Explosive Detonation',
      
      // Wild magic icons
      'spell_arcane_arcane04': 'Arcane/Magical Sword'
    };
    
    return iconMapping[wowIconId] || null;
  };

  // Get spell icon URL using local ability icons
  const getSpellIconUrl = () => {
    const iconId = spell.typeConfig?.icon || spell.icon || null;
    
    // If no icon is set, use default
    if (!iconId) {
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }

    // If it's already a full URL (ability icon), return as-is
    if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
      return iconId;
    }

    // If it's already an ability icon path (e.g., "Fire/Flame Burst"), use it directly
    if (iconId.includes('/') && !iconId.startsWith('http')) {
      // Check if it's using the new folder structure (e.g., "Fire/Flame Burst")
      if (iconId.match(/^[A-Z][a-zA-Z]+\/[A-Z]/)) {
        return getCustomIconUrl(iconId, 'abilities');
      }
      // Otherwise try to use it as-is
      return getCustomIconUrl(iconId, 'abilities');
    }

    // If it's a WoW icon ID, try to map it to a local ability icon
    if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
      const mappedIcon = mapSpellIcon(iconId);
      if (mappedIcon) {
        return getCustomIconUrl(mappedIcon, 'abilities');
      }
      // If no mapping found, use default instead of getAbilityIconUrl (which adds creature- prefix)
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }

    // Default fallback
    return getCustomIconUrl('Utility/Utility', 'abilities');
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
          src={getSpellIconUrl()}
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
            e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
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

