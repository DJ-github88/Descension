import { v4 as uuidv4 } from 'uuid';
import { getTokenTemplateById, getTokensForCharacter, getUnlockedTokens } from '../data/summonableTokens';
import useCreatureStore from '../store/creatureStore';
import useCharacterStore from '../store/characterStore';
import useGameStore from '../store/gameStore';

const SUMMON_SOURCE_TYPE = 'summon';

const rollDiceString = (str) => {
  if (typeof str !== 'string') return typeof str === 'number' ? str : 1;
  const match = str.match(/^(\d+)d(\d+)$/);
  if (!match) return parseInt(str) || 1;
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
};

const resolveCasterStats = (template, character) => {
  const stats = { ...template.creature.stats };
  if (stats.maxHp === 'same_as_caster' && character) {
    stats.maxHp = character.stats?.maxHp || character.currentHp || 50;
  }
  if (stats.maxMana === 'same_as_caster' && character) {
    stats.maxMana = character.stats?.maxMana || character.currentMana || 30;
  }
  return stats;
};

const resolveQuantity = (template) => {
  if (typeof template.quantity === 'string') {
    return rollDiceString(template.quantity);
  }
  return template.quantity || 1;
};

export const templateToCreatureData = (template, character, overrides = {}) => {
  const stats = resolveCasterStats(template, character);
  const resolvedHp = typeof stats.maxHp === 'string' ? rollDiceString(stats.maxHp) : (stats.maxHp || 10);

  return {
    id: overrides.id || `summon-${template.id}-${uuidv4().substring(0, 8)}`,
    name: overrides.name || template.creature.name,
    description: template.description,
    type: (template.creature.type || 'CONSTRUCT').toLowerCase(),
    size: (template.creature.size || 'MEDIUM').toLowerCase(),
    tags: ['summoned', template.controlType, template.creature.type?.toLowerCase() || 'construct'],
    tokenIcon: template.creature.tokenIcon || 'inv_misc_questionmark',
    stats: {
      strength: 10,
      agility: 10,
      constitution: 10,
      intelligence: 10,
      spirit: 10,
      charisma: 10,
      maxHp: resolvedHp,
      currentHp: resolvedHp,
      maxMana: typeof stats.maxMana === 'number' ? stats.maxMana : 0,
      currentMana: typeof stats.maxMana === 'number' ? stats.maxMana : 0,
      maxActionPoints: 6,
      currentActionPoints: 6,
      speed: stats.speed || 0,
      initiative: 0,
      sightRange: 60,
    },
    abilities: (template.creature.abilities || []).map((a, i) => ({
      id: `${template.id}-ability-${i}`,
      name: typeof a === 'string' ? a : a.name,
      description: typeof a === 'string' ? a : a.description || '',
    })),
    tactics: {
      combatStyle: template.controlType === 'autonomous' ? 'balanced' : 'passive',
      targetPriority: 'nearest',
      abilityUsage: 'strategic',
      retreatThreshold: 0,
      notes: `Summoned token. Duration: ${template.duration.value} ${template.duration.unit}. Control: ${template.controlType}`,
    },
    _summonMeta: {
      sourceType: SUMMON_SOURCE_TYPE,
      templateId: template.id,
      templateName: template.name,
      duration: { ...template.duration },
      roundsRemaining: template.duration.unit === 'rounds' ? template.duration.value : null,
      controlType: template.controlType,
      concentration: template.duration.concentration || false,
      spellId: template.spellId,
      ownerId: null,
      ownerName: null,
      placedAt: Date.now(),
    },
    state: {
      ownerId: null,
    },
    ...overrides,
  };
};

export const summonTokenFromTemplate = (templateId, position, character, overrides = {}) => {
  const template = getTokenTemplateById(templateId);
  if (!template) {
    console.error(`[tokenSummonService] Template not found: ${templateId}`);
    return null;
  }

  const quantity = resolveQuantity(template);
  const creatureStore = useCreatureStore.getState();
  const gameStore = useGameStore.getState();
  const ownerSocketId = gameStore.multiplayerSocket?.id || gameStore.playerId || 'local_player';
  const ownerName = character?.name || character?.characterName || 'Player';

  const tokens = [];

  if (template.subTypes && template.subTypes.length > 0) {
    for (const subType of template.subTypes) {
      for (let i = 0; i < (subType.quantity || 1); i++) {
        const totalSubTypes = template.subTypes.length;
        const offset = totalSubTypes > 1 || (subType.quantity || 1) > 1
          ? {
              x: position.x + (i % 3) * 30 - 30,
              y: position.y + Math.floor(i / 3) * 30 - 15,
            }
          : position;
        const subOverrides = {
          name: subType.name,
          stats: { maxHp: subType.stats?.maxHp || 10 },
          size: subType.size?.toLowerCase() || 'medium',
        };
        const creatureData = templateToCreatureData(template, character, subOverrides);
        creatureData._summonMeta.ownerId = ownerSocketId;
        creatureData._summonMeta.ownerName = ownerName;
        creatureData.state = { ...creatureData.state, ownerId: ownerSocketId };

        creatureStore.addCreatureToken(creatureData, offset, true, null, false, null);
        tokens.push(creatureData);
      }
    }
  } else {
    for (let i = 0; i < quantity; i++) {
      const offset = quantity > 1
        ? {
            x: position.x + (i % 3) * 30 - 30,
            y: position.y + Math.floor(i / 3) * 30 - 15,
          }
        : position;
      const creatureData = templateToCreatureData(template, character, overrides);
      creatureData._summonMeta.ownerId = ownerSocketId;
      creatureData._summonMeta.ownerName = ownerName;
      creatureData.state = { ...creatureData.state, ownerId: ownerSocketId };
      if (quantity > 1) {
        creatureData.name = `${template.creature.name} ${i + 1}`;
      }

      creatureStore.addCreatureToken(creatureData, offset, true, null, false, null);
      tokens.push(creatureData);
    }
  }

  return tokens;
};

export const dismissSummonedToken = (tokenId) => {
  const creatureStore = useCreatureStore.getState();
  const tokens = creatureStore.creatureTokens || [];
  const token = tokens.find(t => t.id === tokenId);

  if (!token) return false;

  creatureStore.removeCreatureToken(tokenId);

  const gameStore = useGameStore.getState();
  if (gameStore.isInMultiplayer && gameStore.multiplayerSocket?.connected) {
    gameStore.multiplayerSocket.emit('token_dismissed', {
      tokenId,
      roomId: gameStore.multiplayerRoom?.id,
    });
  }

  return true;
};

export const getActiveSummonsForPlayer = (playerId) => {
  const creatureStore = useCreatureStore.getState();
  const tokens = creatureStore.creatureTokens || [];
  return tokens.filter(t =>
    t._summonMeta?.sourceType === SUMMON_SOURCE_TYPE &&
    (t._summonMeta?.ownerId === playerId || t.state?.ownerId === playerId)
  );
};

export const getActiveSummonCountByTemplate = (templateId, playerId) => {
  const summons = getActiveSummonsForPlayer(playerId);
  return summons.filter(t => t._summonMeta?.templateId === templateId).length;
};

export const decrementSummonDurations = () => {
  const creatureStore = useCreatureStore.getState();
  const tokens = creatureStore.creatureTokens || [];
  const expired = [];

  for (const token of tokens) {
    if (!token._summonMeta?.sourceType === SUMMON_SOURCE_TYPE) continue;
    if (!token._summonMeta?.duration) continue;
    if (token._summonMeta.duration.unit !== 'rounds') continue;
    if (token._summonMeta.roundsRemaining === null) continue;

    const newRounds = token._summonMeta.roundsRemaining - 1;
    if (newRounds <= 0) {
      expired.push(token.id);
    } else {
      creatureStore.updateCreatureState(token.id, {
        _summonMeta: {
          ...token._summonMeta,
          roundsRemaining: newRounds,
        },
      }, false);
    }
  }

  for (const tokenId of expired) {
    dismissSummonedToken(tokenId);
  }

  return expired;
};

export const getSummonableTokensForCharacter = (character) => {
  if (!character) return { unlocked: [], locked: [], all: [] };

  const allTokens = getTokensForCharacter(character);
  const level = character?.level || 1;

  const unlocked = allTokens.filter(t => t.level <= level);
  const locked = allTokens.filter(t => t.level > level);

  return { unlocked, locked, all: allTokens };
};

export default {
  summonTokenFromTemplate,
  dismissSummonedToken,
  getActiveSummonsForPlayer,
  getActiveSummonCountByTemplate,
  decrementSummonDurations,
  getSummonableTokensForCharacter,
  templateToCreatureData,
};
