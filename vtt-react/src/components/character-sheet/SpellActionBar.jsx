import React, { useState, useEffect, useRef } from 'react';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import useDiceStore from '../../store/diceStore';
import useChatStore from '../../store/chatStore';
import useConditionStore from '../../store/conditionStore';
import { getCustomIconUrl, getIconUrl } from '../../utils/assetManager';
import { mapSpellIcon } from '../spellcrafting-wizard/components/common/spellFormatterUtils';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import ItemTooltip from '../item-generation/ItemTooltip';
import { ALL_CLASS_SPELLS } from '../../data/classSpellGenerator';
import { RARITY_COLORS } from '../../constants/itemConstants';
import { migrateBlockId } from '../../utils/arcanoneerMigration';
import { createDeck, drawCards } from '../spellcrafting-wizard/core/mechanics/cardSystem';
import { flipCoin, flipMultipleCoins } from '../spellcrafting-wizard/core/mechanics/coinSystem';
import './SpellActionBar.css';

const DEFAULT_SLOT_COUNT = 10;
const HOTKEY_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const CANONICAL_SPHERE_SET = new Set(['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd']);

const SPHERE_KEY_MAP = {
  arcane: 'arcane', arcane_sphere: 'arcane', force: 'arcane',
  sacred: 'sacred', holy_sphere: 'sacred', radiant_sphere: 'sacred', light: 'sacred', holy: 'sacred', radiant: 'sacred',
  blight: 'blight', shadow_sphere: 'blight', necrotic_sphere: 'blight', shadow: 'blight', necrotic: 'blight',
  ember: 'ember', fire_sphere: 'ember', fire: 'ember', heat: 'ember',
  rime: 'rime', ice_sphere: 'rime', frost_sphere: 'rime', ice: 'rime', frost: 'rime', cold: 'rime',
  primal: 'primal', nature_sphere: 'primal', nature: 'primal', spark: 'primal',
  storm: 'storm', healing_sphere: 'storm', flesh_sphere: 'storm', lightning: 'storm', healing: 'storm', flesh: 'storm',
  wyrd: 'wyrd', chaos_sphere: 'wyrd', chaos: 'wyrd'
};

export const toCanonicalSphere = (rawKey) => {
  if (!rawKey || typeof rawKey !== 'string') return null;
  const clean = rawKey.trim().toLowerCase();
  // Filter out non-sphere resource names explicitly
  if (['mana', 'health', 'hp', 'mp', 'ap', 'actionpoints', 'action_points', 'time_shards', 'time_shard', 'timeshards', 'devotion', 'inferno', 'cooldown'].includes(clean)) {
    return null;
  }
  if (CANONICAL_SPHERE_SET.has(clean)) return clean;
  if (SPHERE_KEY_MAP[clean]) return SPHERE_KEY_MAP[clean];
  const migrated = migrateBlockId(clean);
  if (CANONICAL_SPHERE_SET.has(migrated)) return migrated;
  return null;
};

export const extractSphereRequirementsAndGains = (spellData) => {
  if (!spellData) return { costs: [], gains: [] };
  const costs = [];
  const gains = [];

  // 1. Check spellData.elements (Arcanoneer formulation)
  if (Array.isArray(spellData.elements)) {
    spellData.elements.forEach(el => {
      const canon = toCanonicalSphere(String(el));
      if (canon) costs.push(canon);
    });
  }

  // 2. Check spellData.resourceCost.spheres
  if (Array.isArray(spellData.resourceCost?.spheres)) {
    spellData.resourceCost.spheres.forEach(s => {
      const canon = toCanonicalSphere(String(s));
      if (canon) costs.push(canon);
    });
  }

  // 3. Check spellData.sphereCost
  if (spellData.sphereCost) {
    if (Array.isArray(spellData.sphereCost)) {
      spellData.sphereCost.forEach(s => {
        const canon = toCanonicalSphere(String(s));
        if (canon) costs.push(canon);
      });
    } else if (typeof spellData.sphereCost === 'string') {
      const parts = spellData.sphereCost.split(/[+,/&]/);
      parts.forEach(part => {
        const match = part.trim().match(/^(\d+)?\s*([a-zA-Z]+)/);
        if (match) {
          const count = match[1] ? parseInt(match[1], 10) : 1;
          const sphereId = toCanonicalSphere(match[2]);
          if (sphereId) {
            for (let i = 0; i < count; i++) {
              costs.push(sphereId);
            }
          }
        }
      });
    }
  }

  // 4. Check spellData.resourceCost.resourceValues
  if (spellData.resourceCost?.resourceValues && typeof spellData.resourceCost.resourceValues === 'object') {
    Object.entries(spellData.resourceCost.resourceValues).forEach(([key, val]) => {
      const count = Number(val) || 0;
      if (count <= 0) return;
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('generate') || lowerKey.includes('gain')) {
        const cleanKey = lowerKey.replace(/(_generate|_gain|generate_|gain_)/g, '');
        const mapped = toCanonicalSphere(cleanKey);
        if (mapped) {
          for (let i = 0; i < count; i++) gains.push(mapped);
        }
      } else {
        const mapped = toCanonicalSphere(lowerKey);
        if (mapped && !costs.includes(mapped)) {
          for (let i = 0; i < count; i++) costs.push(mapped);
        }
      }
    });
  }

  // 5. Check spellData.resourceCost.resourceTypes
  if (Array.isArray(spellData.resourceCost?.resourceTypes)) {
    spellData.resourceCost.resourceTypes.forEach(rt => {
      const mapped = toCanonicalSphere(rt);
      if (mapped && !costs.includes(mapped)) {
        costs.push(mapped);
      }
    });
  }

  // 6. Check sphere gains / generation from specialMechanics or resourceGain
  const gainArr = spellData.sphereGenerate || spellData.sphereGain || spellData.resourceGain?.spheres;
  if (Array.isArray(gainArr)) {
    gainArr.forEach(s => {
      const canon = toCanonicalSphere(String(s));
      if (canon) gains.push(canon);
    });
  }

  if (spellData.resourceGain?.resourceValues && typeof spellData.resourceGain.resourceValues === 'object') {
    Object.entries(spellData.resourceGain.resourceValues).forEach(([key, val]) => {
      const count = Number(val) || 0;
      if (count <= 0) return;
      const cleanKey = key.toLowerCase().replace(/(_generate|_gain|generate_|gain_)/g, '');
      const mapped = toCanonicalSphere(cleanKey);
      if (mapped) {
        for (let i = 0; i < count; i++) gains.push(mapped);
      }
    });
  }

  // 7. Check description/flavor text for generated spheres
  const fullText = `${spellData.description || ''} ${spellData.mechanicsText || ''} ${spellData.flavorText || ''}`;
  if (fullText && gains.length === 0) {
    const genMatch = fullText.match(/generat(?:ing|es?|e)\s+(\d+)?\s*(?:elemental\s+)?(wyrd|rime|ember|arcane|sacred|blight|primal|storm|frost|fire|chaos|light|shadow|nature|force)/i);
    if (genMatch) {
      const count = genMatch[1] ? parseInt(genMatch[1], 10) : 1;
      const sphereId = toCanonicalSphere(genMatch[2]);
      if (sphereId) {
        for (let i = 0; i < count; i++) gains.push(sphereId);
      }
    }
  }

  return { costs, gains };
};

export const getSpellTooltipCostSummary = (spellData) => {
  if (!spellData) return '';
  const { costs: sphereCosts, gains: sphereGains } = extractSphereRequirementsAndGains(spellData);
  const parts = [];

  const sphereCostCounts = {};
  sphereCosts.forEach(s => {
    const name = s.charAt(0).toUpperCase() + s.slice(1);
    sphereCostCounts[name] = (sphereCostCounts[name] || 0) + 1;
  });
  Object.entries(sphereCostCounts).forEach(([name, count]) => {
    parts.push(`${count} ${name}`);
  });

  const sphereGainCounts = {};
  sphereGains.forEach(s => {
    const name = s.charAt(0).toUpperCase() + s.slice(1);
    sphereGainCounts[name] = (sphereGainCounts[name] || 0) + 1;
  });
  Object.entries(sphereGainCounts).forEach(([name, count]) => {
    parts.push(`+${count} ${name}`);
  });

  const mana = Number(spellData.manaCost || spellData.resourceCost?.mana || spellData.resourceCost?.resourceValues?.mana || 0);
  if (mana > 0) parts.push(`${mana} MP`);

  const ap = Number(spellData.apCost || spellData.resourceCost?.actionPoints || spellData.resourceCost?.resourceValues?.actionPoints || (spellData.spellType === 'PASSIVE' ? 0 : (spellData.spellType === 'FREE_ACTION' ? 0 : 1)));
  if (ap > 0) parts.push(`${ap} AP`);

  if (spellData.damageFormula) parts.push(spellData.damageFormula);
  if (spellData.healingFormula) parts.push(`Heal: ${spellData.healingFormula}`);

  return parts.join(' • ');
};

// Dynamic Formula Evaluator with primary attributes and elemental spell powers
export const resolveDynamicSpellFormula = (spellData, charStore) => {
  if (!spellData) return null;

  // 1. Primary character attributes
  const rawAttrs = charStore?.attributes || charStore?.stats || {};
  const getScore = (keys) => {
    for (const k of keys) {
      if (typeof rawAttrs[k] === 'number') return rawAttrs[k];
      if (typeof rawAttrs[k]?.value === 'number') return rawAttrs[k].value;
      if (typeof charStore?.[k] === 'number') return charStore[k];
    }
    return 10;
  };

  const str = getScore(['strength', 'str']);
  const agi = getScore(['agility', 'agi', 'dexterity', 'dex']);
  const con = getScore(['constitution', 'con']);
  const int = getScore(['intelligence', 'int', 'intellect']);
  const spir = getScore(['spirit', 'spir', 'wisdom', 'wis']);
  const cha = getScore(['charisma', 'cha']);

  const getMod = (score) => Math.floor((score - 10) / 2);
  const intMod = getMod(int);
  const strMod = getMod(str);
  const agiMod = getMod(agi);
  const spirMod = getMod(spir);
  const chaMod = getMod(cha);
  const conMod = getMod(con);

  // 2. Spell powers / elemental damage bonuses
  const rawSpellPower = charStore?.spellPower || charStore?.stats?.spellPower || {};
  const getPower = (keys) => {
    for (const k of keys) {
      if (typeof rawSpellPower[k] === 'number') return rawSpellPower[k];
      if (typeof charStore?.stats?.[`${k}_spell_power`] === 'number') return charStore.stats[`${k}_spell_power`];
      if (typeof charStore?.stats?.[k] === 'number') return charStore.stats[k];
    }
    return 0;
  };

  // 3. Find base formulas across spell definition
  const rawFormula = spellData.damageFormula ||
                     spellData.healingFormula ||
                     spellData.damageConfig?.formula ||
                     spellData.healingConfig?.formula ||
                     (spellData.primaryDamage?.dice ? `${spellData.primaryDamage.dice}${spellData.primaryDamage.scalingAttribute ? ` + ${spellData.primaryDamage.scalingAttribute}` : ''}` : null) ||
                     spellData.formula ||
                     null;

  if (!rawFormula) return null;

  // Determine school / damage type
  const schoolOrElement = String(spellData.damageType || spellData.school || spellData.element || spellData.typeConfig?.element || '').toLowerCase();

  let elementalBonus = 0;
  let elementLabel = '';
  if (schoolOrElement.includes('storm') || schoolOrElement.includes('lightning')) {
    elementalBonus = getPower(['storm', 'lightning', 'storm_spell_power', 'lightning_spell_power']);
    elementLabel = 'Storm Power';
  } else if (schoolOrElement.includes('ember') || schoolOrElement.includes('fire')) {
    elementalBonus = getPower(['ember', 'fire', 'ember_spell_power', 'fire_spell_power']);
    elementLabel = 'Ember Power';
  } else if (schoolOrElement.includes('rime') || schoolOrElement.includes('frost') || schoolOrElement.includes('ice') || schoolOrElement.includes('cold')) {
    elementalBonus = getPower(['rime', 'frost', 'ice', 'rime_spell_power', 'frost_spell_power']);
    elementLabel = 'Rime Power';
  } else if (schoolOrElement.includes('arcane') || schoolOrElement.includes('force')) {
    elementalBonus = getPower(['arcane', 'force', 'arcane_spell_power']);
    elementLabel = 'Arcane Power';
  } else if (schoolOrElement.includes('primal') || schoolOrElement.includes('nature')) {
    elementalBonus = getPower(['primal', 'nature', 'primal_spell_power', 'nature_spell_power']);
    elementLabel = 'Primal Power';
  } else if (schoolOrElement.includes('blight') || schoolOrElement.includes('necrotic') || schoolOrElement.includes('shadow') || schoolOrElement.includes('poison')) {
    elementalBonus = getPower(['blight', 'necrotic', 'shadow', 'blight_spell_power', 'necrotic_spell_power']);
    elementLabel = 'Blight Power';
  } else if (schoolOrElement.includes('wyrd') || schoolOrElement.includes('chaos') || schoolOrElement.includes('psychic')) {
    elementalBonus = getPower(['wyrd', 'chaos', 'psychic', 'wyrd_spell_power']);
    elementLabel = 'Wyrd Power';
  } else if (schoolOrElement.includes('sacred') || schoolOrElement.includes('holy') || schoolOrElement.includes('radiant')) {
    elementalBonus = getPower(['sacred', 'holy', 'radiant', 'sacred_spell_power', 'holy_spell_power']);
    elementLabel = 'Sacred Power';
  }

  // Parse dice part (e.g. 3d6, 2d8, 1d10)
  const diceMatch = rawFormula.match(/(\d+d\d+)/i);
  const dicePart = diceMatch ? diceMatch[1] : '1d20';

  // Parse flat numbers in formula
  const flatMatches = rawFormula.replace(/\d+d\d+/gi, '').match(/([+-]?\s*\d+)/g) || [];
  let baseFlat = 0;
  flatMatches.forEach(m => {
    const num = parseInt(m.replace(/\s+/g, ''), 10);
    if (!isNaN(num)) baseFlat += num;
  });

  // Check attribute keywords in formula
  const lowerFormula = rawFormula.toLowerCase();
  let attrBonus = 0;
  let attrLabel = '';

  if (lowerFormula.includes('intelligence') || lowerFormula.includes('int')) {
    attrBonus += intMod;
    attrLabel = `+${intMod} (INT)`;
  } else if (lowerFormula.includes('spirit') || lowerFormula.includes('spir') || lowerFormula.includes('wis')) {
    attrBonus += spirMod;
    attrLabel = `+${spirMod} (SPI)`;
  } else if (lowerFormula.includes('strength') || lowerFormula.includes('str')) {
    attrBonus += strMod;
    attrLabel = `+${strMod} (STR)`;
  } else if (lowerFormula.includes('agility') || lowerFormula.includes('agi') || lowerFormula.includes('dex')) {
    attrBonus += agiMod;
    attrLabel = `+${agiMod} (AGI)`;
  } else if (lowerFormula.includes('charisma') || lowerFormula.includes('cha')) {
    attrBonus += chaMod;
    attrLabel = `+${chaMod} (CHA)`;
  } else if (lowerFormula.includes('constitution') || lowerFormula.includes('con')) {
    attrBonus += conMod;
    attrLabel = `+${conMod} (CON)`;
  }

  const totalBonus = baseFlat + attrBonus + elementalBonus;
  const finalRollableFormula = totalBonus !== 0
    ? `${dicePart}${totalBonus >= 0 ? `+${totalBonus}` : totalBonus}`
    : dicePart;

  const breakdownParts = [dicePart];
  if (baseFlat !== 0) breakdownParts.push(`${baseFlat >= 0 ? `+${baseFlat}` : baseFlat} (Base)`);
  if (attrLabel) breakdownParts.push(attrLabel);
  if (elementalBonus !== 0) breakdownParts.push(`+${elementalBonus} (${elementLabel})`);

  const damageTypeLabel = spellData.damageType || (schoolOrElement ? schoolOrElement.charAt(0).toUpperCase() + schoolOrElement.slice(1) : '');

  return {
    rawFormula,
    dicePart,
    totalBonus,
    finalRollableFormula,
    breakdownText: `${breakdownParts.join(' ')}${damageTypeLabel ? ` ${damageTypeLabel} Damage` : ''}`,
    damageType: damageTypeLabel
  };
};

export const getSpellSlotIconUrl = (spell) => {
  if (!spell) return getCustomIconUrl('Utility/Utility', 'abilities');
  const iconId = spell?.typeConfig?.icon || spell?.icon || spell?.damageConfig?.icon || spell?.healingConfig?.icon || null;
  if (!iconId) return getCustomIconUrl('Utility/Utility', 'abilities');
  if (typeof iconId === 'string' && iconId.startsWith('/assets/')) return iconId;
  if (iconId.includes('/') && !iconId.startsWith('http')) return getCustomIconUrl(iconId, 'abilities');
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
    const mapped = mapSpellIcon(iconId);
    if (mapped) return getCustomIconUrl(mapped, 'abilities');
  }
  return getCustomIconUrl('Utility/Utility', 'abilities');
};

// Resolve the icon for a slot item (spell or consumable)
export const getSlotItemIconUrl = (item) => {
  if (!item) return getCustomIconUrl('Utility/Utility', 'abilities');
  if (item.type === 'consumable') {
    return getIconUrl(item.icon || 'inv_potion_51', 'items');
  }
  return getSpellSlotIconUrl(item);
};

// Rarity border color for consumable slots (WoW-style)
export const getRarityBorderColor = (item) => {
  if (!item || item.type !== 'consumable') return null;
  const quality = item.quality || item.rarity || 'common';
  const qualityLower = quality.toLowerCase();
  return RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;
};

export default function SpellActionBar({ characterId, allSpells = [] }) {
  const character = useCharacterStore(state => state.character);
  const inventoryItems = useInventoryStore(state => state.items);
  const activeCharId = characterId || character?.id || 'default';
  const storageKey = `mythrill_spell_action_bar_${activeCharId}`;

  const [slots, setSlots] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_SLOT_COUNT) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load spell action bar from storage', e);
    }
    return Array(DEFAULT_SLOT_COUNT).fill(null);
  });
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [quickAssignSlotIndex, setQuickAssignSlotIndex] = useState(null);
  const [inspectingSpell, setInspectingSpell] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [pendingConsumable, setPendingConsumable] = useState(null);
  const [pendingSpellCast, setPendingSpellCast] = useState(null);
  const [resolutionResult, setResolutionResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dragSourceSlotRef = useRef(null);

  // Auto-dismiss resolution toast after 8 seconds
  useEffect(() => {
    if (!resolutionResult) return;
    const timer = setTimeout(() => setResolutionResult(null), 8000);
    return () => clearTimeout(timer);
  }, [resolutionResult]);

  // Save to localStorage when slots change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(slots));
    } catch (e) {
      console.warn('Could not save spell action bar to storage', e);
    }
  }, [slots, storageKey]);

  // Handle Drag Over
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverSlot !== index) {
      setDragOverSlot(index);
    }
  };

  const handleDragLeave = (e, index) => {
    if (dragOverSlot === index) {
      setDragOverSlot(null);
    }
  };

  // Handle Drop onto a Slot
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDragOverSlot(null);

    try {
      // Check if dragging from another slot
      if (dragSourceSlotRef.current !== null) {
        const sourceIndex = dragSourceSlotRef.current;
        dragSourceSlotRef.current = null;
        if (sourceIndex === targetIndex) return;

        setSlots(prev => {
          const next = [...prev];
          const temp = next[targetIndex];
          next[targetIndex] = next[sourceIndex];
          next[sourceIndex] = temp;
          return next;
        });
        return;
      }

      // Dropped from SpellLibrary
      const rawData = e.dataTransfer.getData('application/json');
      if (rawData) {
        const spellData = JSON.parse(rawData);

        setSlots(prev => {
          const next = [...prev];
          next[targetIndex] = {
            ...spellData,
            id: spellData.id,
            name: spellData.name,
            icon: spellData.icon || spellData.typeConfig?.icon,
            spellType: spellData.spellType || 'ACTION',
            description: spellData.description || '',
            manaCost: spellData.resourceCost?.mana || spellData.manaCost || 0,
            apCost: spellData.resourceCost?.actionPoints || spellData.apCost || 1,
            damageFormula: spellData.damageConfig?.formula || spellData.primaryDamage?.dice || null,
            healingFormula: spellData.healingConfig?.formula || spellData.healing?.dice || null
          };
          return next;
        });
        return;
      }

      // Dropped from Inventory (consumable items)
      const itemData = e.dataTransfer.getData('text/plain');
      if (itemData) {
        const data = JSON.parse(itemData);

        // Check if it's an inventory item and if it's consumable
        if (data.type === 'inventory-item' && data.item && data.item.type === 'consumable') {
          const item = data.item;
          setSlots(prev => {
            const next = [...prev];
            next[targetIndex] = {
              id: item.id,
              name: item.name,
              icon: item.iconId || item.icon || 'inv_potion_51',
              type: 'consumable',
              originalItemId: item.originalItemId || item.id,
              quality: item.quality || item.rarity || 'common',
              rarity: item.rarity || item.quality || 'common',
              description: item.description || ''
            };
            return next;
          });
        }
      }
    } catch (err) {
      console.error('Error dropping into action bar:', err);
    }
  };

  // Handle Drag Start from an existing filled slot
  const handleSlotDragStart = (e, index) => {
    if (!slots[index]) return;
    dragSourceSlotRef.current = index;
    e.dataTransfer.setData('application/json', JSON.stringify(slots[index]));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Clear a single slot
  const handleClearSlot = (e, index) => {
    e?.stopPropagation?.();
    setSlots(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  // Clear all slots - opens custom modal
  const handleClearAll = () => {
    setConfirmClearOpen(true);
  };

  const confirmClearAll = () => {
    setSlots(Array(DEFAULT_SLOT_COUNT).fill(null));
    setConfirmClearOpen(false);
  };

  // Assign a spell from quick assign modal
  const handleAssignSpell = (spell, targetSlotIndex = quickAssignSlotIndex) => {
    if (targetSlotIndex === null) return;
    setSlots(prev => {
      const next = [...prev];
      next[targetSlotIndex] = {
        ...spell,
        id: spell.id,
        name: spell.name,
        icon: spell.icon || spell.typeConfig?.icon,
        spellType: spell.spellType || 'ACTION',
        description: spell.description || '',
        manaCost: spell.resourceCost?.mana || spell.manaCost || 0,
        apCost: spell.resourceCost?.actionPoints || spell.apCost || 1,
        damageFormula: spell.damageConfig?.formula || spell.primaryDamage?.dice || null,
        healingFormula: spell.healingConfig?.formula || spell.healing?.dice || null
      };
      return next;
    });
    setQuickAssignSlotIndex(null);
    setSearchQuery('');
  };

  // Filter available spells for quick assign
  const availableSpells = (allSpells && allSpells.length > 0)
    ? allSpells
    : (character?.spells || []);

  // Helper to get current quantity of a consumable item in the inventory
  const getItemQuantity = (itemId) => {
    const item = inventoryItems.find(invItem =>
      invItem.originalItemId === itemId || invItem.id === itemId
    );
    return item ? (item.quantity || 1) : 0;
  };

  // Helper to retrieve the full inventory item for a consumable slot
  const getFullConsumableItem = (slotItem) => {
    if (!slotItem) return null;
    return inventoryItems.find(invItem =>
      invItem.originalItemId === slotItem.originalItemId || invItem.id === slotItem.originalItemId
    ) || null;
  };

  // Helper to retrieve full spell data for unified card inspection
  const getFullSpellData = (slotSpell) => {
    if (!slotSpell) return null;
    if (slotSpell.effects || slotSpell.damageConfig || slotSpell.healingConfig || slotSpell.typeConfig) {
      return slotSpell;
    }
    const foundInAvailable = availableSpells.find(s => s.id === slotSpell.id);
    if (foundInAvailable) return { ...foundInAvailable, ...slotSpell };

    if (ALL_CLASS_SPELLS && typeof ALL_CLASS_SPELLS === 'object') {
      for (const classSpellsList of Object.values(ALL_CLASS_SPELLS)) {
        if (Array.isArray(classSpellsList)) {
          const match = classSpellsList.find(s => s.id === slotSpell.id || s.name === slotSpell.name);
          if (match) return { ...match, ...slotSpell };
        }
      }
    }
    return slotSpell;
  };

  // Extract buff/duration data from consumable
  const extractItemBuffData = (item) => {
    if (!item) return null;
    let durationSeconds = 0;
    if (typeof item.duration === 'number' && item.duration > 0) {
      durationSeconds = item.duration;
    } else if (item.utilityStats?.duration) {
      const dVal = Number(item.utilityStats.duration.value) || 0;
      const dType = (item.utilityStats.duration.type || '').toUpperCase();
      if (dType === 'MINUTES') durationSeconds = dVal * 60;
      else if (dType === 'ROUNDS') durationSeconds = dVal * 6;
      else durationSeconds = dVal;
    } else if (item.useEffects?.duration) {
      const dVal = Number(item.useEffects.duration.value) || 0;
      const dType = (item.useEffects.duration.type || '').toUpperCase();
      if (dType === 'MINUTES') durationSeconds = dVal * 60;
      else if (dType === 'ROUNDS') durationSeconds = dVal * 6;
      else durationSeconds = dVal;
    }

    const effects = {};
    if (item.baseStats && typeof item.baseStats === 'object') {
      Object.assign(effects, item.baseStats);
    }
    if (item.statModifiers && typeof item.statModifiers === 'object') {
      Object.assign(effects, item.statModifiers);
    }
    if (item.combatStats && typeof item.combatStats === 'object') {
      ['armor', 'spellPower', 'physicalDamage', 'magicDamage', 'critChance', 'speed', 'evasion', 'strength', 'agility', 'intelligence', 'spirit', 'constitution', 'charisma'].forEach(k => {
        if (item.combatStats[k] && typeof item.combatStats[k] === 'number') {
          effects[k] = item.combatStats[k];
        }
      });
    }

    const hasAnyBuff = durationSeconds > 0 || Object.keys(effects).length > 0 || item.buffEffect;
    if (!hasAnyBuff) return null;

    if (durationSeconds <= 0) {
      durationSeconds = 300; // default 5 minutes
    }

    return {
      name: item.name,
      icon: item.iconId || item.icon || 'inv_potion_51',
      description: item.description || `Buff from ${item.name}`,
      duration: durationSeconds,
      durationType: 'seconds',
      durationValue: durationSeconds,
      effects: effects,
      source: 'consumable',
      targetId: 'player',
      targetType: 'player'
    };
  };

  // Open Consume Confirmation Modal
  const handleUseConsumable = (slotItem, slotIndex) => {
    if (!slotItem) return;
    const fullItem = getFullConsumableItem(slotItem) || slotItem;
    const currentQty = getItemQuantity(slotItem.originalItemId);

    if (currentQty <= 0 && (!fullItem.quantity || fullItem.quantity <= 0)) {
      useChatStore.getState().addCombatNotification?.({
        type: 'system',
        sender: 'Inventory',
        content: `⚠️ You have no more ${slotItem.name} left in your inventory!`,
        timestamp: new Date().toISOString()
      });
      return;
    }

    setPendingConsumable({ item: fullItem, slotIndex });
  };

  // Execute Confirmed Consumption
  const executeConfirmConsume = () => {
    if (!pendingConsumable?.item) return;
    const fullItem = pendingConsumable.item;

    // Deduct 1 from inventory
    const itemIdToRemove = fullItem.id || fullItem.originalItemId || fullItem.id;
    useInventoryStore.getState().removeItem(itemIdToRemove, 1);

    // Apply restoration effects
    const charStore = useCharacterStore.getState();
    const hpRestore = Number(fullItem.combatStats?.healthRestore?.value ?? fullItem.combatStats?.healthRestore ?? fullItem.healthRestore ?? 0) || 0;
    const mpRestore = Number(fullItem.combatStats?.manaRestore?.value ?? fullItem.combatStats?.manaRestore ?? fullItem.manaRestore ?? 0) || 0;
    const apRestore = Number(fullItem.combatStats?.apRestore?.value ?? fullItem.combatStats?.actionPointRestore?.value ?? fullItem.combatStats?.apRestore ?? 0) || 0;

    const effectsApplied = [];

    if (hpRestore !== 0) {
      const curHP = charStore.health?.current ?? 45;
      const maxHP = charStore.health?.max ?? 50;
      const newHP = Math.max(0, Math.min(maxHP, curHP + hpRestore));
      charStore.updateResource('health', newHP);
      effectsApplied.push(`${hpRestore > 0 ? '+' : ''}${hpRestore} HP`);
    }

    if (mpRestore !== 0) {
      const curMP = charStore.mana?.current ?? 45;
      const maxMP = charStore.mana?.max ?? 50;
      const newMP = Math.max(0, Math.min(maxMP, curMP + mpRestore));
      charStore.updateResource('mana', newMP);
      effectsApplied.push(`${mpRestore > 0 ? '+' : ''}${mpRestore} Mana`);
    }

    if (apRestore !== 0) {
      const curAP = charStore.actionPoints?.current ?? 1;
      const maxAP = charStore.actionPoints?.max ?? 3;
      const newAP = Math.max(0, Math.min(maxAP, curAP + apRestore));
      charStore.updateResource('actionPoints', newAP);
      effectsApplied.push(`${apRestore > 0 ? '+' : ''}${apRestore} AP`);
    }

    // Apply Buff / Condition to conditionStore if item has duration/buffs
    const buffData = extractItemBuffData(fullItem);
    if (buffData) {
      useConditionStore.getState().addCondition('buff', buffData);
      effectsApplied.push(`✨ ${buffData.name} (${Math.round(buffData.duration)}s)`);
    }

    const playerName = charStore.name || 'Player';
    const effectStr = effectsApplied.length > 0 ? ` (${effectsApplied.join(', ')})` : '';
    useChatStore.getState().addCombatNotification?.({
      type: 'combat',
      sender: playerName,
      content: `🍷 ${playerName} used ${fullItem.name}${effectStr}.`,
      timestamp: new Date().toISOString()
    });

    setPendingConsumable(null);
    if (inspectingSpell && inspectingSpell.type === 'consumable') {
      setInspectingSpell(null);
    }
  };

  // Execute Confirmed Spell Cast
  const executeConfirmCast = () => {
    if (!pendingSpellCast?.spell) return;
    const success = handleCastSpell(pendingSpellCast.spell);
    if (success) {
      setPendingSpellCast(null);
    }
  };

  // Handle Dice Rolling
  const handleRollDice = (spell, customFormula = null) => {
    const spellData = getFullSpellData(spell) || spell;
    const formula = customFormula || spellData.damageFormula || spellData.healingFormula || spellData.damageConfig?.formula || spellData.healingConfig?.formula || '1d20';
    const charStore = useCharacterStore.getState();
    const playerName = charStore.name || 'Player';

    if (typeof useDiceStore?.getState?.().rollDiceDirectly === 'function') {
      useDiceStore.getState().rollDiceDirectly(formula, `${spellData.name} (${spellData.spellType || 'Spell'})`);
    }

    useChatStore.getState().addCombatNotification?.({
      type: 'combat',
      sender: playerName,
      content: `🎲 ${playerName} rolled ${formula} for ${spellData.name}`,
      timestamp: new Date().toISOString()
    });

    setResolutionResult({
      type: 'dice',
      title: `${spellData.name} - Dice Roll`,
      formula: formula,
      timestamp: Date.now()
    });
  };

  // Handle Card Drawing
  const handleDrawCards = (spell, count = 1, deckType = 'standard', showToast = true) => {
    const spellData = getFullSpellData(spell) || spell;
    const charStore = useCharacterStore.getState();
    const playerName = charStore.name || 'Player';

    try {
      const deck = createDeck(deckType);
      const { cards } = drawCards(deck, count);

      const SUIT_ICONS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
      const formattedCards = cards.map(c => {
        const icon = SUIT_ICONS[c.suit] || '';
        return `${c.rank || c.name || ''}${icon}`;
      });

      let outcome = count === 1 ? 'Card Drawn' : 'Cards Drawn';
      if (cards.length > 1) {
        const ranks = cards.map(c => c.rank);
        const hasPair = ranks.some((r, i) => ranks.indexOf(r) !== i);
        const allRed = cards.every(c => c.suit === 'hearts' || c.suit === 'diamonds');
        const allBlack = cards.every(c => c.suit === 'spades' || c.suit === 'clubs');
        if (hasPair) outcome = 'Pair Detected! (Empowered)';
        else if (allRed) outcome = 'All Red! (Radiant Alignment)';
        else if (allBlack) outcome = 'All Black! (Shadow Alignment)';
      }

      useChatStore.getState().addCombatNotification?.({
        type: 'combat',
        sender: playerName,
        content: `🎴 ${playerName} drew ${count} card${count > 1 ? 's' : ''} for ${spellData.name}: [ ${formattedCards.join(', ')} ] (${outcome})`,
        timestamp: new Date().toISOString()
      });

      if (showToast) {
        setResolutionResult({
          type: 'card',
          title: `${spellData.name} - Card Draw`,
          cards: cards,
          outcome: outcome,
          timestamp: Date.now()
        });
      }
    } catch (e) {
      console.warn('Error drawing cards:', e);
    }
  };

  // Handle Coin Flipping
  const handleFlipCoins = (spell, count = 3, coinType = 'STANDARD', showToast = true) => {
    const spellData = getFullSpellData(spell) || spell;
    const charStore = useCharacterStore.getState();
    const playerName = charStore.name || 'Player';

    try {
      const flips = flipMultipleCoins(coinType, count);
      const results = flips.map(f => f.sideName || (f.result === 0 ? 'heads' : 'tails'));

      const headsCount = results.filter(r => r === 'heads').length;
      let outcome = `${headsCount}/${count} Heads`;
      if (headsCount === count) outcome = `All Heads! (Critical Success)`;
      else if (headsCount === 0) outcome = `All Tails! (Fumble)`;
      else if (headsCount > count / 2) outcome = `Majority Heads (Success)`;

      const coinIcons = results.map(r => r === 'heads' ? '🪙 [Heads]' : '🪙 [Tails]').join(', ');

      useChatStore.getState().addCombatNotification?.({
        type: 'combat',
        sender: playerName,
        content: `🪙 ${playerName} flipped ${count} coin${count > 1 ? 's' : ''} for ${spellData.name}: ${coinIcons} (${outcome})`,
        timestamp: new Date().toISOString()
      });

      if (showToast) {
        setResolutionResult({
          type: 'coin',
          title: `${spellData.name} - Coin Flip`,
          flips: results,
          outcome: outcome,
          timestamp: Date.now()
        });
      }
    } catch (e) {
      console.warn('Error flipping coins:', e);
    }
  };

  // Handle Casting a Spell with complete Resource Cost / Gain logic
  const handleCastSpell = (slotSpell) => {
    if (!slotSpell) return;
    const spellData = getFullSpellData(slotSpell);
    const charStore = useCharacterStore.getState();
    const playerName = charStore.name || 'Player';

    // 1. Calculate costs
    const manaCost = Number(spellData.manaCost || spellData.resourceCost?.mana || spellData.resourceCost?.resourceValues?.mana || 0);
    const apCost = Number(spellData.apCost || spellData.resourceCost?.actionPoints || spellData.resourceCost?.resourceValues?.actionPoints || (spellData.spellType === 'PASSIVE' ? 0 : (spellData.spellType === 'FREE_ACTION' ? 0 : 1)));
    const healthCost = Number(spellData.healthCost || spellData.resourceCost?.health || 0);

    // 2. Check Action Points
    const curAP = charStore.actionPoints?.current ?? 0;
    if (apCost > 0 && curAP < apCost) {
      useChatStore.getState().addCombatNotification?.({
        type: 'system',
        sender: 'Combat',
        content: `⚠️ Not enough Action Points to cast ${spellData.name}! (Requires ${apCost} AP, have ${curAP})`,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 3. Check Mana
    const curMana = charStore.mana?.current ?? 0;
    if (manaCost > 0 && curMana < manaCost) {
      useChatStore.getState().addCombatNotification?.({
        type: 'system',
        sender: 'Combat',
        content: `⚠️ Not enough Mana to cast ${spellData.name}! (Requires ${manaCost} Mana, have ${curMana})`,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 4. Check Health
    const curHP = charStore.health?.current ?? 0;
    if (healthCost > 0 && curHP <= healthCost) {
      useChatStore.getState().addCombatNotification?.({
        type: 'system',
        sender: 'Combat',
        content: `⚠️ Cannot cast ${spellData.name}: Health cost (${healthCost} HP) would be fatal!`,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 5. Check Arcanoneer Elemental Spheres (only if character uses elemental spheres)
    const classRes = charStore.classResource || {};
    const isArcanoneer = classRes.type === 'elementalSpheres' || Array.isArray(classRes.spheres);
    const { costs: sphereCosts, gains: sphereGains } = extractSphereRequirementsAndGains(spellData);
    let sphereBankCopy = [];

    if (isArcanoneer && (sphereCosts.length > 0 || sphereGains.length > 0)) {
      const currentSpheres = Array.isArray(classRes.spheres) ? classRes.spheres.map(toCanonicalSphere).filter(Boolean) : [];
      sphereBankCopy = [...currentSpheres];
      const missingSpheres = [];

      for (const req of sphereCosts) {
        const idx = sphereBankCopy.indexOf(req);
        if (idx === -1) {
          missingSpheres.push(req.charAt(0).toUpperCase() + req.slice(1));
        } else {
          sphereBankCopy.splice(idx, 1);
        }
      }

      if (missingSpheres.length > 0) {
        useChatStore.getState().addCombatNotification?.({
          type: 'system',
          sender: 'Combat',
          content: `⚠️ Cannot cast ${spellData.name}: Missing ${missingSpheres.join(', ')} sphere(s)!`,
          timestamp: new Date().toISOString()
        });
        return false;
      }
    }

    // 6. Check Pyrofiend Inferno Veil
    const infernoReq = Number(spellData.infernoRequired || spellData.resourceCost?.resourceValues?.inferno_required || 0);
    const currentInferno = Number(classRes.current || 0);
    if (infernoReq > 0 && currentInferno < infernoReq) {
      useChatStore.getState().addCombatNotification?.({
        type: 'system',
        sender: 'Combat',
        content: `⚠️ Requires Inferno Level ${infernoReq} to cast ${spellData.name}!`,
        timestamp: new Date().toISOString()
      });
      return false;
    }

    // 7. Check Martyr Devotion
    const devCost = Number(spellData.devotionCost || spellData.resourceCost?.resourceValues?.devotion_cost || 0);
    const devReq = Number(spellData.devotionRequired || spellData.resourceCost?.resourceValues?.devotion_required || 0);
    const currentDev = Number(classRes.current || 0);
    if (devReq > 0 && currentDev < devReq) {
      useChatStore.getState().addCombatNotification?.({
        type: 'system',
        sender: 'Combat',
        content: `⚠️ Requires Devotion Level ${devReq} to cast ${spellData.name}!`,
        timestamp: new Date().toISOString()
      });
      return false;
    }
    if (devCost > 0 && currentDev < devCost) {
      useChatStore.getState().addCombatNotification?.({
        type: 'system',
        sender: 'Combat',
        content: `⚠️ Not enough Devotion (${devCost} required, have ${currentDev})!`,
        timestamp: new Date().toISOString()
      });
      return false;
    }

    // All checks passed! Apply Resource Deductions & Gains
    const changesLog = [];

    // AP
    if (apCost > 0) {
      charStore.updateResource('actionPoints', Math.max(0, curAP - apCost));
      changesLog.push(`-${apCost} AP`);
    }

    // Mana
    if (manaCost > 0) {
      charStore.updateResource('mana', Math.max(0, curMana - manaCost));
      changesLog.push(`-${manaCost} Mana`);
    }

    // Health
    if (healthCost > 0) {
      charStore.updateResource('health', Math.max(0, curHP - healthCost));
      changesLog.push(`-${healthCost} HP`);
    }

    // Spheres (only if Arcanoneer)
    if (isArcanoneer && (sphereCosts.length > 0 || sphereGains.length > 0)) {
      let updatedSpheres = [...sphereBankCopy, ...sphereGains];
      const maxBank = classRes.max || 12;
      if (updatedSpheres.length > maxBank) {
        updatedSpheres = updatedSpheres.slice(0, maxBank);
      }
      charStore.updateClassResource('spheres', updatedSpheres);

      const sphereCostCounts = {};
      sphereCosts.forEach(s => {
        const name = s.charAt(0).toUpperCase() + s.slice(1);
        sphereCostCounts[name] = (sphereCostCounts[name] || 0) + 1;
      });
      Object.entries(sphereCostCounts).forEach(([name, count]) => {
        changesLog.push(`-${count} ${name} Sphere${count > 1 ? 's' : ''}`);
      });

      const sphereGainCounts = {};
      sphereGains.forEach(s => {
        const name = s.charAt(0).toUpperCase() + s.slice(1);
        sphereGainCounts[name] = (sphereGainCounts[name] || 0) + 1;
      });
      Object.entries(sphereGainCounts).forEach(([name, count]) => {
        changesLog.push(`+${count} ${name} Sphere${count > 1 ? 's' : ''}`);
      });
    }

    // Inferno Veil
    const infernoAscend = Number(spellData.infernoAscend || spellData.resourceCost?.resourceValues?.inferno_ascend || 0);
    const infernoDescend = Number(spellData.infernoDescend || spellData.resourceCost?.resourceValues?.inferno_descend || 0);
    if (infernoAscend > 0) {
      charStore.gainClassResource(infernoAscend);
      changesLog.push(`+${infernoAscend} Inferno`);
    } else if (infernoDescend > 0) {
      charStore.consumeClassResource(infernoDescend);
      changesLog.push(`-${infernoDescend} Inferno`);
    }

    // Devotion
    const devGain = Number(spellData.devotionGain || spellData.resourceCost?.resourceValues?.devotion_gain || 0);
    if (devCost > 0) {
      charStore.consumeClassResource(devCost);
      changesLog.push(`-${devCost} Devotion`);
    }
    if (devGain > 0) {
      charStore.gainClassResource(devGain);
      changesLog.push(`+${devGain} Devotion`);
    }

    // Time Shards
    const shardCost = Number(spellData.timeShardCost || spellData.resourceCost?.resourceValues?.time_shard_cost || 0);
    const shardGain = Number(spellData.timeShardGenerate || spellData.resourceCost?.resourceValues?.time_shard_generate || 0);
    if (shardCost > 0) {
      charStore.consumeClassResource(shardCost);
      changesLog.push(`-${shardCost} Time Shard${shardCost > 1 ? 's' : ''}`);
    }
    if (shardGain > 0) {
      charStore.gainClassResource(shardGain);
      changesLog.push(`+${shardGain} Time Shard${shardGain > 1 ? 's' : ''}`);
    }

    // Execute Resolution Mechanics (Cards, Coins, Dice)
    const isCardSpell = spellData.resolutionType === 'CARDS' || spellData.resolutionType === 'card' || !!spellData.cardConfig;
    const isCoinSpell = spellData.resolutionType === 'COINS' || spellData.resolutionType === 'coin' || !!spellData.coinConfig;

    const resolvedFormulaData = resolveDynamicSpellFormula(spellData, charStore);
    let resolutionLogStr = '';

    if (isCardSpell) {
      const count = Number(spellData.cardConfig?.count || spellData.cardCount || 1);
      const deckType = spellData.cardConfig?.deckType || 'standard';
      handleDrawCards(spellData, count, deckType, true);
    } else if (isCoinSpell) {
      const count = Number(spellData.coinConfig?.count || spellData.coinCount || 3);
      const coinType = (spellData.coinConfig?.coinType || 'STANDARD').toUpperCase();
      handleFlipCoins(spellData, count, coinType, true);
    }

    if (resolvedFormulaData) {
      if (typeof useDiceStore?.getState?.().rollDiceDirectly === 'function') {
        useDiceStore.getState().rollDiceDirectly(
          resolvedFormulaData.finalRollableFormula,
          `${spellData.name} (${resolvedFormulaData.breakdownText || spellData.spellType || 'Action'})`
        );
      }
      resolutionLogStr = ` • [Rolled ${resolvedFormulaData.finalRollableFormula} (${resolvedFormulaData.breakdownText})]`;
    }

    // Post to chat / combat log
    const changesStr = changesLog.length > 0 ? ` (${changesLog.join(', ')})` : '';
    useChatStore.getState().addCombatNotification?.({
      type: 'combat',
      sender: playerName,
      content: `✨ ${playerName} cast ${spellData.name}${changesStr}${resolutionLogStr}.`,
      timestamp: new Date().toISOString()
    });

    return true;
  };

  // Slot Click: either assign or show full spell card / consumable modal
  const handleSlotClick = (index) => {
    const spell = slots[index];
    if (!spell) {
      setQuickAssignSlotIndex(index);
      return;
    }

    if (spell.type === 'consumable') {
      handleUseConsumable(spell, index);
      return;
    }

    // Inspect spell on click (opens full UnifiedSpellCard with Cast button)
    setInspectingSpell({ ...spell, slotIndex: index });
  };

  const filteredQuickSpells = availableSpells.filter(s => {
    if (!searchQuery) return true;
    return s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.spellType?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="spell-action-bar-container">
      <div className="spell-action-bar-header">
        <h4 className="spell-action-bar-title">
          <i className="fas fa-wand-sparkles"></i>
          <span>Prepared Action Bar</span>
        </h4>
        <span className="spell-action-bar-hint">
          Drag spells or consumable items here, or tap an empty slot to assign
        </span>
        <div className="spell-action-bar-actions">
          <button
            type="button"
            className="spell-bar-btn"
            onClick={() => setConfirmClearOpen(true)}
            title="Clear Action Bar"
          >
            <i className="fas fa-trash-can"></i>
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="spell-action-slots-wrapper">
        <div className="spell-action-slots-row">
          {slots.map((spell, index) => {
            const hotkey = HOTKEY_LABELS[index] || (index + 1);
            const isDragOver = dragOverSlot === index;
            const isHovered = hoveredSlot === index;
            const isConsumable = spell && spell.type === 'consumable';
            const rarityBorderColor = isConsumable ? getRarityBorderColor(spell) : null;
            const quantity = isConsumable ? getItemQuantity(spell.originalItemId) : 0;
            const fullSpell = spell && !isConsumable ? getFullSpellData(spell) : null;
            const tooltipSummary = fullSpell ? getSpellTooltipCostSummary(fullSpell) : '';

            return (
              <div
                key={`action-slot-${index}`}
                className={`spell-action-slot ${spell ? 'has-spell' : ''} ${isDragOver ? 'drag-over' : ''}`}
                style={rarityBorderColor ? { borderColor: rarityBorderColor } : undefined}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={(e) => handleDragLeave(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                draggable={!!spell}
                onDragStart={(e) => handleSlotDragStart(e, index)}
                onClick={() => handleSlotClick(index)}
                onMouseEnter={() => setHoveredSlot(index)}
                onMouseLeave={() => setHoveredSlot(null)}
                title={spell ? (isConsumable ? `${spell.name} (Consumable • Click to Inspect / Hover to Use)` : `${spell.name} (Click to Inspect / Hover to Cast)`) : `Slot ${hotkey} (Empty)`}
              >
                <span className="spell-slot-key">{hotkey}</span>

                {spell ? (
                  <>
                    <img
                      src={getSlotItemIconUrl(spell)}
                      alt={spell.name}
                      className="spell-slot-icon-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = isConsumable
                          ? getIconUrl('inv_potion_51', 'items')
                          : getCustomIconUrl('Utility/Utility', 'abilities');
                      }}
                    />
                    {!isConsumable && spell.manaCost > 0 && (
                      <span className="spell-slot-cost">{spell.manaCost} MP</span>
                    )}
                    {isConsumable && (
                      <span className={`spell-slot-quantity ${quantity === 0 ? 'out-of-stock' : ''}`}>{quantity}</span>
                    )}

                    {/* Clear button on hover */}
                    <button
                      type="button"
                      className="spell-slot-clear-btn"
                      onClick={(e) => handleClearSlot(e, index)}
                      title={`Remove ${spell.name} from action bar`}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </>
                ) : (
                  <i className="fas fa-plus spell-slot-empty"></i>
                )}

                {/* Hover Tooltip */}
                {isHovered && spell && (
                  <div className="spell-slot-tooltip">
                    <span className="spell-slot-tooltip-name">{spell.name}</span>
                    <span className="spell-slot-tooltip-type">
                      {isConsumable
                        ? `Consumable • ${quantity} in bag • Click USE to consume`
                        : `${spell.spellType || 'Action'} ${tooltipSummary ? `• ${tooltipSummary}` : ''}`}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Integrated Dice Roller Cog Button */}
          <button
            type="button"
            className="spell-action-cog-btn"
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('toggle-dice-roller'));
            }}
            title="Dice Roller / Tools"
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </div>

      {/* Quick Assign Modal (Mobile & Tap friendly) */}
      {quickAssignSlotIndex !== null && (
        <div className="spell-quick-assign-overlay" onClick={() => setQuickAssignSlotIndex(null)}>
          <div className="spell-quick-assign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="spell-quick-assign-header">
              <h3>Assign Spell to Slot {HOTKEY_LABELS[quickAssignSlotIndex] || (quickAssignSlotIndex + 1)}</h3>
              <button
                type="button"
                className="spell-quick-assign-close"
                onClick={() => setQuickAssignSlotIndex(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="spell-quick-assign-search">
              <input
                type="text"
                className="spell-quick-assign-input"
                placeholder="Search spells by name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="spell-quick-assign-list">
              {filteredQuickSpells.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#c4a482', fontStyle: 'italic', padding: '16px' }}>
                  No matching spells found.
                </p>
              ) : (
                filteredQuickSpells.map((spell) => (
                  <div
                    key={spell.id || spell.name}
                    className="spell-quick-assign-item"
                    onClick={() => handleAssignSpell(spell, quickAssignSlotIndex)}
                  >
                    <img
                      src={getSpellSlotIconUrl(spell)}
                      alt={spell.name}
                      className="spell-quick-assign-icon"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                      }}
                    />
                    <div className="spell-quick-assign-info">
                      <span className="spell-quick-assign-name">{spell.name}</span>
                      <span className="spell-quick-assign-type">
                        {spell.spellType || 'Action'} {spell.manaCost > 0 ? `• ${spell.manaCost} Mana` : ''}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {confirmClearOpen && (
        <div className="spell-confirm-overlay" onClick={() => setConfirmClearOpen(false)}>
          <div className="spell-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="spell-confirm-title">
              <i className="fas fa-triangle-exclamation"></i>
              <span>Clear Prepared Action Bar?</span>
            </h3>
            <p className="spell-confirm-body">
              This will unassign all spells and consumables from your action bar. You can re-assign them anytime from your spellbook or inventory.
            </p>
            <div className="spell-confirm-buttons">
              <button
                type="button"
                className="spell-confirm-btn cancel"
                onClick={() => setConfirmClearOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="spell-confirm-btn confirm"
                onClick={confirmClearAll}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spell/Item Inspection Popup */}
      {inspectingSpell && (
        <div className="spell-inspect-overlay" onClick={() => setInspectingSpell(null)}>
          <div className="spell-inspect-popup" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="spell-inspect-popup-close"
              onClick={() => setInspectingSpell(null)}
              title="Close"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="spell-inspect-popup-content">
              {inspectingSpell.type === 'consumable' ? (() => {
                const fullItem = getFullConsumableItem(inspectingSpell);
                const quantity = getItemQuantity(inspectingSpell.originalItemId);
                const displayItem = fullItem ? { ...fullItem, quantity: (quantity !== undefined && quantity !== null) ? quantity : fullItem.quantity } : inspectingSpell;
                return (
                  <div className="spell-inspect-item-wrap">
                    <ItemTooltip item={displayItem} />
                    {!fullItem && (
                      <p className="spell-inspect-consumable-missing">
                        <i className="fas fa-triangle-exclamation"></i> This item is no longer in your inventory.
                      </p>
                    )}
                  </div>
                );
              })() : (
                <div className="spell-inspect-spell-wrap">
                  <UnifiedSpellCard
                    spell={getFullSpellData(inspectingSpell)}
                    variant="wizard"
                    showActions={false}
                    showDescription={true}
                    showStats={true}
                    showTags={true}
                  />
                </div>
              )}
            </div>

            <div className="spell-inspect-actions-bar">
              {inspectingSpell.type === 'consumable' ? (
                <button
                  type="button"
                  className="spell-inspect-btn use-item"
                  onClick={() => {
                    handleUseConsumable(inspectingSpell, inspectingSpell.slotIndex);
                  }}
                >
                  <i className="fas fa-flask"></i>
                  <span>Use Consumable</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="spell-inspect-btn cast"
                  onClick={() => {
                    const fullSpell = getFullSpellData(inspectingSpell);
                    setInspectingSpell(null);
                    setPendingSpellCast({ spell: fullSpell });
                  }}
                >
                  <i className="fas fa-wand-magic-sparkles"></i>
                  <span>Cast Spell</span>
                </button>
              )}



              <button
                type="button"
                className="spell-inspect-btn remove"
                onClick={(e) => {
                  handleClearSlot(e, inspectingSpell.slotIndex);
                  setInspectingSpell(null);
                }}
              >
                <i className="fas fa-trash-can"></i>
                <span>Remove from Bar</span>
              </button>
              <button
                type="button"
                className="spell-inspect-btn close"
                onClick={() => setInspectingSpell(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consumable Confirmation Modal */}
      {pendingConsumable && (
        <div className="spell-confirm-overlay" onClick={() => setPendingConsumable(null)}>
          <div className="spell-consume-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="spell-consume-confirm-header">
              <img
                src={getIconUrl(pendingConsumable.item.iconId || pendingConsumable.item.icon || 'inv_potion_51', 'items')}
                alt={pendingConsumable.item.name}
                className="spell-consume-confirm-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getIconUrl('inv_potion_51', 'items');
                }}
              />
              <div className="spell-consume-confirm-title-block">
                <h3 className="spell-consume-confirm-name">{pendingConsumable.item.name}</h3>
                <span className="spell-consume-confirm-rarity" style={{ color: getRarityBorderColor(pendingConsumable.item) || '#d4af37' }}>
                  {(pendingConsumable.item.quality || pendingConsumable.item.rarity || 'Common').toUpperCase()} CONSUMABLE • {getItemQuantity(pendingConsumable.item.originalItemId || pendingConsumable.item.id)} IN BAG
                </span>
              </div>
              <button
                type="button"
                className="spell-quick-assign-close"
                onClick={() => setPendingConsumable(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="spell-consume-confirm-body">
              {pendingConsumable.item.description && (
                <p className="spell-consume-confirm-desc">{pendingConsumable.item.description}</p>
              )}

              <div className="spell-consume-preview-section">
                <h4 className="spell-consume-preview-title">
                  <i className="fas fa-sparkles"></i>
                  <span>Resource & Stat Effects Preview</span>
                </h4>

                {/* Health Diff */}
                {(() => {
                  const hpRestore = Number(pendingConsumable.item.combatStats?.healthRestore?.value ?? pendingConsumable.item.combatStats?.healthRestore ?? pendingConsumable.item.healthRestore ?? 0) || 0;
                  const charStore = useCharacterStore.getState();
                  const curHP = charStore.health?.current ?? 45;
                  const maxHP = charStore.health?.max ?? 50;
                  const nextHP = Math.min(maxHP, curHP + hpRestore);
                  const isEffective = hpRestore !== 0;

                  return isEffective ? (
                    <div className="spell-consume-diff-row health">
                      <div className="diff-label">
                        <i className="fas fa-heart"></i>
                        <span>Health</span>
                      </div>
                      <div className="diff-values">
                        <span className="diff-before">{curHP}</span>
                        <i className="fas fa-arrow-right diff-arrow"></i>
                        <span className="diff-after">{nextHP}</span>
                        <span className="diff-max">/ {maxHP}</span>
                        <span className="diff-gain">({hpRestore > 0 ? `+${hpRestore}` : hpRestore} HP)</span>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Mana Diff */}
                {(() => {
                  const mpRestore = Number(pendingConsumable.item.combatStats?.manaRestore?.value ?? pendingConsumable.item.combatStats?.manaRestore ?? pendingConsumable.item.manaRestore ?? 0) || 0;
                  const charStore = useCharacterStore.getState();
                  const curMP = charStore.mana?.current ?? 45;
                  const maxMP = charStore.mana?.max ?? 50;
                  const nextMP = Math.min(maxMP, curMP + mpRestore);
                  const isEffective = mpRestore !== 0;

                  return isEffective ? (
                    <div className="spell-consume-diff-row mana">
                      <div className="diff-label">
                        <i className="fas fa-flask"></i>
                        <span>Mana</span>
                      </div>
                      <div className="diff-values">
                        <span className="diff-before">{curMP}</span>
                        <i className="fas fa-arrow-right diff-arrow"></i>
                        <span className="diff-after">{nextMP}</span>
                        <span className="diff-max">/ {maxMP}</span>
                        <span className="diff-gain">({mpRestore > 0 ? `+${mpRestore}` : mpRestore} MP)</span>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* AP Diff */}
                {(() => {
                  const apRestore = Number(pendingConsumable.item.combatStats?.apRestore?.value ?? pendingConsumable.item.combatStats?.actionPointRestore?.value ?? pendingConsumable.item.combatStats?.apRestore ?? 0) || 0;
                  const charStore = useCharacterStore.getState();
                  const curAP = charStore.actionPoints?.current ?? 1;
                  const maxAP = charStore.actionPoints?.max ?? 3;
                  const nextAP = Math.min(maxAP, curAP + apRestore);
                  const isEffective = apRestore !== 0;

                  return isEffective ? (
                    <div className="spell-consume-diff-row ap">
                      <div className="diff-label">
                        <i className="fas fa-bolt"></i>
                        <span>Action Points</span>
                      </div>
                      <div className="diff-values">
                        <span className="diff-before">{curAP}</span>
                        <i className="fas fa-arrow-right diff-arrow"></i>
                        <span className="diff-after">{nextAP}</span>
                        <span className="diff-max">/ {maxAP}</span>
                        <span className="diff-gain">({apRestore > 0 ? `+${apRestore}` : apRestore} AP)</span>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Buff / Duration Preview */}
                {(() => {
                  const buffData = extractItemBuffData(pendingConsumable.item);
                  if (!buffData) return null;
                  const formatDuration = (secs) => {
                    if (secs >= 60) {
                      const mins = Math.floor(secs / 60);
                      const rem = secs % 60;
                      return rem > 0 ? `${mins}m ${rem}s` : `${mins} Minute${mins > 1 ? 's' : ''}`;
                    }
                    return `${secs} Seconds`;
                  };

                  return (
                    <div className="spell-consume-buff-preview">
                      <div className="buff-preview-header">
                        <i className="fas fa-star"></i>
                        <span>Grants Buff: <strong>{buffData.name}</strong></span>
                      </div>
                      <div className="buff-preview-duration">
                        <i className="fas fa-clock"></i>
                        <span>Duration: <strong>{formatDuration(buffData.duration)}</strong> (Live Countdown)</span>
                      </div>
                      {Object.keys(buffData.effects || {}).length > 0 && (
                        <div className="buff-preview-stats">
                          {Object.entries(buffData.effects).map(([stat, val]) => (
                            <span key={stat} className="buff-stat-pill">
                              +{val} {stat.charAt(0).toUpperCase() + stat.slice(1)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <p className="spell-consume-remaining-hint">
                <i className="fas fa-info-circle"></i> Consuming this will use 1 item from your bag ({getItemQuantity(pendingConsumable.item.originalItemId || pendingConsumable.item.id)} → {Math.max(0, getItemQuantity(pendingConsumable.item.originalItemId || pendingConsumable.item.id) - 1)} remaining).
              </p>
            </div>

            <div className="spell-confirm-buttons">
              <button
                type="button"
                className="spell-confirm-btn cancel"
                onClick={() => setPendingConsumable(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="spell-confirm-btn confirm-consume"
                onClick={executeConfirmConsume}
              >
                <i className="fas fa-flask"></i>
                <span>Drink / Consume</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spell Cast Confirmation & Resource Diff Modal */}
      {pendingSpellCast && (
        <div className="spell-confirm-overlay" onClick={() => setPendingSpellCast(null)}>
          <div className="spell-consume-confirm-modal spell-cast-modal" onClick={(e) => e.stopPropagation()}>
            <div className="spell-consume-confirm-header">
              <img
                src={getSlotItemIconUrl(pendingSpellCast.spell)}
                alt={pendingSpellCast.spell.name}
                className="spell-consume-confirm-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                }}
              />
              <div className="spell-consume-confirm-title-block">
                <h3 className="spell-consume-confirm-name">{pendingSpellCast.spell.name}</h3>
                <span className="spell-consume-confirm-rarity" style={{ color: '#d97706' }}>
                  {(pendingSpellCast.spell.spellType || 'ACTION').toUpperCase()} • {pendingSpellCast.spell.school || pendingSpellCast.spell.element || 'PREPARED SPELL'}
                </span>
              </div>
              <button
                type="button"
                className="spell-quick-assign-close"
                onClick={() => setPendingSpellCast(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="spell-consume-confirm-body">
              {pendingSpellCast.spell.description && (
                <p className="spell-consume-confirm-desc">{pendingSpellCast.spell.description}</p>
              )}

              <div className="spell-consume-preview-section">
                <h4 className="spell-consume-preview-title">
                  <i className="fas fa-sparkles"></i>
                  <span>Resource & Casting Cost Preview</span>
                </h4>

                {/* Mana Cost Diff */}
                {(() => {
                  const manaCost = Number(pendingSpellCast.spell.manaCost || pendingSpellCast.spell.resourceCost?.mana || pendingSpellCast.spell.resourceCost?.resourceValues?.mana || 0);
                  if (manaCost <= 0) return null;
                  const charStore = useCharacterStore.getState();
                  const curMP = charStore.mana?.current ?? 45;
                  const maxMP = charStore.mana?.max ?? 50;
                  const nextMP = Math.max(0, curMP - manaCost);

                  return (
                    <div className="spell-consume-diff-row mana">
                      <div className="diff-label">
                        <i className="fas fa-flask"></i>
                        <span>Mana</span>
                      </div>
                      <div className="diff-values">
                        <span className="diff-before">{curMP}</span>
                        <i className="fas fa-arrow-right diff-arrow"></i>
                        <span className={`diff-after ${curMP < manaCost ? 'insufficient' : ''}`}>{nextMP}</span>
                        <span className="diff-max">/ {maxMP}</span>
                        <span className="diff-cost">(-{manaCost} MP)</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Action Points Diff */}
                {(() => {
                  const apCost = Number(pendingSpellCast.spell.apCost || pendingSpellCast.spell.resourceCost?.actionPoints || pendingSpellCast.spell.resourceCost?.resourceValues?.actionPoints || (pendingSpellCast.spell.spellType === 'PASSIVE' ? 0 : (pendingSpellCast.spell.spellType === 'FREE_ACTION' ? 0 : 1)));
                  if (apCost <= 0) return null;
                  const charStore = useCharacterStore.getState();
                  const curAP = charStore.actionPoints?.current ?? 3;
                  const maxAP = charStore.actionPoints?.max ?? 3;
                  const nextAP = Math.max(0, curAP - apCost);

                  return (
                    <div className="spell-consume-diff-row ap">
                      <div className="diff-label">
                        <i className="fas fa-bolt"></i>
                        <span>Action Points</span>
                      </div>
                      <div className="diff-values">
                        <span className="diff-before">{curAP}</span>
                        <i className="fas fa-arrow-right diff-arrow"></i>
                        <span className={`diff-after ${curAP < apCost ? 'insufficient' : ''}`}>{nextAP}</span>
                        <span className="diff-max">/ {maxAP}</span>
                        <span className="diff-cost">(-{apCost} AP)</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Health Cost Diff */}
                {(() => {
                  const healthCost = Number(pendingSpellCast.spell.healthCost || pendingSpellCast.spell.resourceCost?.health || 0);
                  if (healthCost <= 0) return null;
                  const charStore = useCharacterStore.getState();
                  const curHP = charStore.health?.current ?? 50;
                  const maxHP = charStore.health?.max ?? 50;
                  const nextHP = Math.max(0, curHP - healthCost);

                  return (
                    <div className="spell-consume-diff-row health">
                      <div className="diff-label">
                        <i className="fas fa-heart"></i>
                        <span>Health Cost</span>
                      </div>
                      <div className="diff-values">
                        <span className="diff-before">{curHP}</span>
                        <i className="fas fa-arrow-right diff-arrow"></i>
                        <span className={`diff-after ${curHP <= healthCost ? 'insufficient' : ''}`}>{nextHP}</span>
                        <span className="diff-max">/ {maxHP}</span>
                        <span className="diff-cost">(-{healthCost} HP)</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Elemental Spheres (Arcanoneer ONLY) */}
                {(() => {
                  const charStore = useCharacterStore.getState();
                  const classRes = charStore.classResource || {};
                  const isArcanoneer = classRes.type === 'elementalSpheres' || Array.isArray(classRes.spheres);
                  if (!isArcanoneer) return null;

                  const { costs: sphereCosts, gains: sphereGains } = extractSphereRequirementsAndGains(pendingSpellCast.spell);
                  if (sphereCosts.length === 0 && sphereGains.length === 0) return null;

                  const currentSpheres = Array.isArray(classRes.spheres) ? classRes.spheres.map(toCanonicalSphere).filter(Boolean) : [];

                  const costCounts = {};
                  sphereCosts.forEach(s => {
                    const name = s.charAt(0).toUpperCase() + s.slice(1);
                    costCounts[name] = (costCounts[name] || 0) + 1;
                  });
                  const gainCounts = {};
                  sphereGains.forEach(s => {
                    const name = s.charAt(0).toUpperCase() + s.slice(1);
                    gainCounts[name] = (gainCounts[name] || 0) + 1;
                  });

                  return (
                    <div className="spell-cast-sphere-preview">
                      <div className="sphere-preview-header">
                        <i className="fas fa-gem"></i>
                        <span>Elemental Spheres</span>
                        <span className="sphere-bank-count">Bank: {currentSpheres.length} / {classRes.max || 12}</span>
                      </div>
                      <div className="sphere-pills-row">
                        {Object.entries(costCounts).map(([sphere, count]) => (
                          <span key={`cost-${sphere}`} className="sphere-pill cost">
                            -{count} {sphere}
                          </span>
                        ))}
                        {Object.entries(gainCounts).map(([sphere, count]) => (
                          <span key={`gain-${sphere}`} className="sphere-pill gain">
                            +{count} {sphere}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Time Shards (Chronomancer) */}
                {(() => {
                  const shardCost = Number(pendingSpellCast.spell.timeShardCost || pendingSpellCast.spell.resourceCost?.resourceValues?.time_shard_cost || 0);
                  const shardGain = Number(pendingSpellCast.spell.timeShardGenerate || pendingSpellCast.spell.resourceCost?.resourceValues?.time_shard_generate || 0);
                  if (shardCost === 0 && shardGain === 0) return null;

                  const charStore = useCharacterStore.getState();
                  const classRes = charStore.classResource || {};
                  const currentShards = Number(classRes.current ?? classRes.timeShards ?? 0);
                  const maxShards = Number(classRes.max || 10);
                  const nextShards = Math.min(maxShards, Math.max(0, currentShards - shardCost + shardGain));

                  return (
                    <div className="spell-consume-diff-row ap">
                      <div className="diff-label">
                        <i className="fas fa-hourglass-half" style={{ color: '#06b6d4' }}></i>
                        <span>Time Shards</span>
                      </div>
                      <div className="diff-values">
                        <span className="diff-before">{currentShards}</span>
                        <i className="fas fa-arrow-right diff-arrow"></i>
                        <span className="diff-after">{nextShards}</span>
                        <span className="diff-max">/ {maxShards}</span>
                        {shardCost > 0 && <span className="diff-cost">(-{shardCost} Shard{shardCost > 1 ? 's' : ''})</span>}
                        {shardGain > 0 && <span className="diff-gain" style={{ color: '#06b6d4', fontWeight: 700 }}>(+{shardGain} Shard{shardGain > 1 ? 's' : ''})</span>}
                      </div>
                    </div>
                  );
                })()}

                {/* Devotion (Martyr) */}
                {(() => {
                  const devCost = Number(pendingSpellCast.spell.devotionCost || pendingSpellCast.spell.resourceCost?.resourceValues?.devotion_cost || 0);
                  const devGain = Number(pendingSpellCast.spell.devotionGain || pendingSpellCast.spell.resourceCost?.resourceValues?.devotion_gain || 0);
                  if (devCost === 0 && devGain === 0) return null;

                  const charStore = useCharacterStore.getState();
                  const classRes = charStore.classResource || {};
                  const currentDev = Number(classRes.current || 0);
                  const maxDev = Number(classRes.max || 100);
                  const nextDev = Math.min(maxDev, Math.max(0, currentDev - devCost + devGain));

                  return (
                    <div className="spell-consume-diff-row devotion">
                      <div className="diff-label">
                        <i className="fas fa-cross" style={{ color: '#eab308' }}></i>
                        <span>Devotion</span>
                      </div>
                      <div className="diff-values">
                        <span className="diff-before">{currentDev}</span>
                        <i className="fas fa-arrow-right diff-arrow"></i>
                        <span className="diff-after">{nextDev}</span>
                        <span className="diff-max">/ {maxDev}</span>
                        {devCost > 0 && <span className="diff-cost">(-{devCost} Devotion)</span>}
                        {devGain > 0 && <span className="diff-gain" style={{ color: '#eab308', fontWeight: 700 }}>(+{devGain} Devotion)</span>}
                      </div>
                    </div>
                  );
                })()}

                {/* Dynamic Evaluated Formula Breakdown */}
                {(() => {
                  const charStore = useCharacterStore.getState();
                  const resolved = resolveDynamicSpellFormula(pendingSpellCast.spell, charStore);
                  if (!resolved) return null;

                  return (
                    <div className="spell-cast-formula-preview">
                      <i className="fas fa-dice-d20"></i>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                        <span style={{ fontWeight: 700, color: '#3b1810' }}>
                          Dice Roll: <strong>{resolved.finalRollableFormula}</strong> ({resolved.damageType || 'Spell Effect'})
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#8b4513', fontStyle: 'italic' }}>
                          Breakdown: {resolved.breakdownText}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="spell-confirm-buttons">
              <button
                type="button"
                className="spell-confirm-btn cancel"
                onClick={() => setPendingSpellCast(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="spell-confirm-btn confirm-cast"
                onClick={executeConfirmCast}
              >
                <i className="fas fa-wand-magic-sparkles"></i>
                <span>Confirm & Cast</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Spell Resolution Toast (Dice, Card, Coin) */}
      {resolutionResult && (
        <div className="spell-resolution-toast">
          <div className="spell-resolution-header">
            <span className="spell-resolution-title">
              {resolutionResult.type === 'dice' && <i className="fas fa-dice-d20" style={{ color: '#ffd700', marginRight: '6px' }}></i>}
              {resolutionResult.type === 'card' && <i className="fas fa-clone" style={{ color: '#818cf8', marginRight: '6px' }}></i>}
              {resolutionResult.type === 'coin' && <i className="fas fa-coins" style={{ color: '#facc15', marginRight: '6px' }}></i>}
              {resolutionResult.title}
            </span>
            <button
              type="button"
              className="spell-resolution-close"
              onClick={() => setResolutionResult(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="spell-resolution-body">
            {resolutionResult.type === 'card' && Array.isArray(resolutionResult.cards) && (
              <div className="resolution-cards-container">
                {resolutionResult.cards.map((c, i) => {
                  const isRed = c.suit === 'hearts' || c.suit === 'diamonds';
                  const suitSymbol = c.suit === 'hearts' ? '♥' : (c.suit === 'diamonds' ? '♦' : (c.suit === 'clubs' ? '♣' : '♠'));
                  return (
                    <div key={i} className={`resolution-card-item ${isRed ? 'red' : 'black'}`}>
                      <span className="resolution-card-rank">{c.rank || c.name || 'A'}</span>
                      <span className="resolution-card-suit">{suitSymbol}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {resolutionResult.type === 'coin' && Array.isArray(resolutionResult.flips) && (
              <div className="resolution-coins-container">
                {resolutionResult.flips.map((side, i) => (
                  <div key={i} className="resolution-coin-item" title={side}>
                    <i className={side === 'heads' ? 'fas fa-crown' : 'fas fa-feather'}></i>
                    <span>{side === 'heads' ? 'H' : 'T'}</span>
                  </div>
                ))}
              </div>
            )}

            {resolutionResult.outcome && (
              <div className="resolution-outcome-badge">
                {resolutionResult.outcome}
              </div>
            )}

            {resolutionResult.formula && (
              <div className="resolution-outcome-badge">
                Rolled Formula: <strong>{resolutionResult.formula}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
