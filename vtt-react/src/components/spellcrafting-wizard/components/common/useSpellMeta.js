import { cleanFormula, mapSpellIcon } from './spellFormatterUtils';
import { getAbilityIconUrl, getCustomIconUrl } from '../../../../utils/assetManager';

const useSpellMeta = ({ spell }) => {
  const enhanceFormulaDisplay = (formula, elementType) => {
    if (!formula) return '';

    const cleanedFormula = cleanFormula(formula);

    if (elementType && elementType !== 'arcane') {
      const elementName = elementType.charAt(0).toUpperCase() + elementType.slice(1);
      return `${cleanedFormula} ${elementName} damage`;
    }

    if (cleanedFormula.match(/^\d+d\d+(\s*\+\s*\d+)?$/)) {
      return `${cleanedFormula} damage`;
    }

    if (cleanedFormula.includes('intelligence') || cleanedFormula.includes('strength') ||
        cleanedFormula.includes('agility') || cleanedFormula.includes('constitution') ||
        cleanedFormula.includes('spirit') || cleanedFormula.includes('charisma')) {
      return `${cleanedFormula} damage`;
    }

    return cleanedFormula;
  };

  const getRarityClass = () => {
    const rarityMap = {
      'common': 'rarity-common',
      'uncommon': 'rarity-uncommon',
      'rare': 'rarity-rare',
      'epic': 'rarity-epic',
      'legendary': 'rarity-legendary'
    };
    return rarityMap[spell?.rarity] || 'rarity-common';
  };

  const getSpellSchoolClass = () => {
    const schoolMap = {
      'ember': 'spell-ember',
      'rime': 'spell-rime',
      'storm': 'spell-storm',
      'arcane': 'spell-arcane',
      'primal': 'spell-primal',
      'blight': 'spell-blight',
      'wyrd': 'spell-wyrd',
      'divine': 'spell-divine',
      'physical': 'spell-physical',
      'fire': 'spell-ember',
      'frost': 'spell-rime',
      'cold': 'spell-rime',
      'ice': 'spell-rime',
      'lightning': 'spell-storm',
      'electric': 'spell-storm',
      'thunder': 'spell-storm',
      'nature': 'spell-primal',
      'shadow': 'spell-blight',
      'necrotic': 'spell-blight',
      'psychic': 'spell-wyrd',
      'chaos': 'spell-wyrd',
    };
    const school = spell?.typeConfig?.school || spell?.school || spell?.damageTypes?.[0] || spell?.elementType || 'arcane';
    return schoolMap[school.toLowerCase()] || 'spell-arcane';
  };

  const getBorderColor = () => {
    const rarityColors = {
      'common': '#9d9d9d',
      'uncommon': '#1eff00',
      'rare': '#0070dd',
      'epic': '#a335ee',
      'legendary': '#ff8000'
    };
    return rarityColors[spell?.rarity] || '#9d9d9d';
  };

  const getSpellIcon = () => {
    const iconId = spell?.icon || spell?.typeConfig?.icon;
    if (!iconId) {
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }
    if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
      return iconId;
    }
    if (iconId.includes('/') && !iconId.startsWith('http')) {
      if (iconId.match(/^[A-Z][a-zA-Z]+\/[A-Z]/)) {
        return getCustomIconUrl(iconId, 'abilities');
      }
      return getCustomIconUrl(iconId, 'abilities');
    }
    if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
      const mappedIcon = mapSpellIcon(iconId);
      if (mappedIcon) {
        return getCustomIconUrl(mappedIcon, 'abilities');
      }
      return getAbilityIconUrl(iconId);
    }
    return getCustomIconUrl('Utility/Utility', 'abilities');
  };

  return {
    enhanceFormulaDisplay,
    getRarityClass,
    getSpellSchoolClass,
    getBorderColor,
    getSpellIcon,
  };
};

export default useSpellMeta;
