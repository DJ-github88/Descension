/**
 * useCharacterSpells Hook
 * 
 * Aggregates all spells, talent abilities, racial traits, discipline path abilities,
 * skill abilities, general actions, and custom spells available to a character.
 */

import { useMemo } from 'react';
import useCharacterStore from '../store/characterStore';
import useInventoryStore from '../store/inventoryStore';
import { ALL_CLASS_SPELLS } from '../data/classSpellGenerator';
import { TALENT_TREES } from '../data/talentTreeData';
import { convertTalentSpellToLibrarySpell } from '../data/talentTrees/talentSystem.mjs';
import { getRacialSpells, getDisciplineSpells, isPassiveStatModifier } from '../utils/raceDisciplineSpellUtils';
import { getSkillAbilitiesForSpellbook } from '../utils/skillAbilitiesIntegration';
import { GENERAL_CATEGORIES } from '../data/generalSpellsData';

// Sanitize discipline resource costs
const sanitizeDisciplineResourceCost = (cost) => {
  if (!cost || typeof cost !== 'object') return cost;
  const allowed = {};
  ['mana', 'health', 'actionPoints'].forEach(key => {
    if (cost[key] !== undefined && cost[key] !== null) {
      allowed[key] = cost[key];
    }
  });
  return Object.keys(allowed).length > 0 ? allowed : { actionPoints: cost?.actionPoints ?? 0 };
};

const sanitizeDisciplineSpell = (spell) => {
  const baseCost = spell.resourceCost || {};
  return {
    ...spell,
    resourceCost: sanitizeDisciplineResourceCost(baseCost)
  };
};

export function useCharacterSpells(characterId = null) {
  const characters = useCharacterStore(state => state.characters);
  const currentCharacterId = useCharacterStore(state => state.currentCharacterId);
  const charStore = useCharacterStore(state => state);
  const inventoryItems = useInventoryStore(state => state.items);

  const activeCharId = characterId || currentCharacterId;
  const activeChar = (characters && characters.find(c => c.id === activeCharId)) || charStore;

  const characterClass = activeChar?.class || charStore.class;
  const characterLevel = Number(activeChar?.level || charStore.level || 1);
  const race = activeChar?.race || charStore.race;
  const subrace = activeChar?.subrace || charStore.subrace;
  const path = activeChar?.path || charStore.path;
  const talents = activeChar?.talents || charStore.talents || {};
  const knownSpells = activeChar?.class_spells?.known_spells || charStore.class_spells?.known_spells || [];
  const skillRanks = activeChar?.skill_ranks || activeChar?.skills || charStore.skill_ranks || charStore.skills || {};

  return useMemo(() => {
    const spellList = [];
    const seenIds = new Set();

    const addSpell = (spell, category, sourceLabel) => {
      if (!spell) return;
      const spellId = spell.id || spell.name;
      if (!spellId || seenIds.has(spellId)) return;
      seenIds.add(spellId);

      const mana = Number(spell.manaCost || spell.resourceCost?.mana || spell.resourceCost?.resourceValues?.mana || 0);
      const ap = Number(spell.apCost || spell.resourceCost?.actionPoints || spell.resourceCost?.resourceValues?.actionPoints || (spell.spellType === 'PASSIVE' ? 0 : (spell.spellType === 'FREE_ACTION' ? 0 : 1)));

      spellList.push({
        ...spell,
        id: spellId,
        name: spell.name || 'Unnamed Spell',
        category: category || 'general',
        sourceLabel: sourceLabel || 'Spell',
        spellType: spell.spellType || (spell.passive ? 'PASSIVE' : 'ACTION'),
        icon: spell.icon || spell.typeConfig?.icon || spell.damageConfig?.icon || spell.healingConfig?.icon || null,
        manaCost: mana,
        apCost: ap,
        damageFormula: spell.damageFormula || spell.damageConfig?.formula || spell.primaryDamage?.dice || null,
        healingFormula: spell.healingFormula || spell.healingConfig?.formula || spell.healing?.dice || null,
        description: spell.description || spell.mechanicsText || ''
      });
    };

    // 1. Class Spells
    if (characterClass && ALL_CLASS_SPELLS[characterClass]) {
      const classSpellsRaw = ALL_CLASS_SPELLS[characterClass];
      const knownSet = new Set(knownSpells);
      const hasKnownFilter = knownSet.size > 0;

      classSpellsRaw.forEach(spell => {
        const id = spell.id?.toLowerCase() || '';
        const name = spell.name?.toLowerCase() || '';
        if (
          id === 'universal_attack' ||
          name === 'attack (melee or ranged)' ||
          id.includes('cast_minor') ||
          id.includes('cast_major') ||
          name.includes('cast minor') ||
          name.includes('cast major')
        ) {
          return;
        }

        // If known spells exist, only include known spells; otherwise include spells up to character level
        if (hasKnownFilter) {
          if (knownSet.has(spell.id)) {
            addSpell(spell, 'class', characterClass);
          }
        } else {
          const sLevel = Number(spell.level || 1);
          if (sLevel <= characterLevel) {
            addSpell(spell, 'class', characterClass);
          }
        }
      });
    }

    // 2. Talent Tree Spells & Abilities
    if (characterClass && TALENT_TREES[characterClass] && talents) {
      const classTreeData = TALENT_TREES[characterClass];
      Object.entries(talents).forEach(([talentId, rank]) => {
        if (!rank || rank <= 0) return;
        for (const treeKey of Object.keys(classTreeData)) {
          const tree = classTreeData[treeKey];
          if (Array.isArray(tree)) {
            const node = tree.find(t => t.id === talentId);
            if (node && node.spell) {
              const talentSpell = convertTalentSpellToLibrarySpell(node, rank);
              if (talentSpell) {
                addSpell(talentSpell, 'talent', 'Talent');
              }
              break;
            }
          }
        }
      });
    }

    // 3. Racial Abilities
    if (race || subrace) {
      const racial = getRacialSpells(race, subrace).filter(s => !isPassiveStatModifier(s));
      racial.forEach(spell => {
        addSpell(spell, 'racial', `${subrace || race} Trait`);
      });
    }

    // 4. Discipline Path Abilities
    if (path) {
      const discipline = getDisciplineSpells(path).map(sanitizeDisciplineSpell);
      discipline.forEach(spell => {
        addSpell(spell, 'discipline', `${path} Discipline`);
      });
    }

    // 5. Skill Abilities
    if (skillRanks && typeof skillRanks === 'object') {
      const skillAbilities = getSkillAbilitiesForSpellbook(skillRanks);
      skillAbilities.forEach(spell => {
        addSpell(spell, 'skill', `${spell.sourceSkill ? spell.sourceSkill.toUpperCase() : 'Skill'}`);
      });
    }

    // 6. General Combat Actions
    if (Array.isArray(GENERAL_CATEGORIES)) {
      GENERAL_CATEGORIES.forEach(cat => {
        if (Array.isArray(cat.spells)) {
          cat.spells.forEach(spell => {
            const id = spell.id?.toLowerCase() || '';
            const name = spell.name?.toLowerCase() || '';
            if (
              id === 'universal_attack' ||
              name === 'attack (melee or ranged)' ||
              id.includes('cast_minor') ||
              id.includes('cast_major')
            ) {
              return;
            }
            addSpell(spell, 'general', cat.name || 'General');
          });
        }
      });
    }

    // 7. Custom Spells from localStorage or Character customSpells
    try {
      const customSaved = localStorage.getItem('mythrill-custom-spells');
      if (customSaved) {
        const parsed = JSON.parse(customSaved);
        if (Array.isArray(parsed)) {
          parsed.forEach(s => addSpell(s, 'custom', 'Custom Spell'));
        }
      }
    } catch (e) {}

    if (Array.isArray(activeChar?.customSpells)) {
      activeChar.customSpells.forEach(s => addSpell(s, 'custom', 'Custom Spell'));
    }

    if (Array.isArray(activeChar?.spells)) {
      activeChar.spells.forEach(s => addSpell(s, 'general', 'Spellbook'));
    }

    // 8. Consumables from Inventory
    const consumables = (inventoryItems || [])
      .filter(item => item && (item.type === 'consumable' || item.category === 'consumables' || item.isConsumable))
      .map(item => ({
        id: item.id || item.originalItemId,
        name: item.name,
        icon: item.iconId || item.icon || 'inv_potion_51',
        type: 'consumable',
        category: 'consumable',
        sourceLabel: 'Inventory',
        originalItemId: item.originalItemId || item.id,
        quality: item.quality || item.rarity || 'common',
        rarity: item.rarity || item.quality || 'common',
        quantity: item.quantity || 1,
        description: item.description || ''
      }));

    return {
      allSpells: spellList,
      consumables: consumables,
      counts: {
        all: spellList.length,
        class: spellList.filter(s => s.category === 'class').length,
        talent: spellList.filter(s => s.category === 'talent').length,
        racial: spellList.filter(s => s.category === 'racial' || s.category === 'discipline').length,
        skill: spellList.filter(s => s.category === 'skill').length,
        general: spellList.filter(s => s.category === 'general').length,
        custom: spellList.filter(s => s.category === 'custom').length,
        consumable: consumables.length
      }
    };
  }, [
    activeCharId,
    activeChar,
    characterClass,
    characterLevel,
    race,
    subrace,
    path,
    talents,
    knownSpells,
    skillRanks,
    inventoryItems
  ]);
}

export default useCharacterSpells;