/**
 * Enhanced Dice Service
 * Provides Roll20-like dice rolling functionality with multiplayer integration
 */

import useDiceStore from '../store/diceStore';
import useChatStore from '../store/chatStore';
import useGameStore from '../store/gameStore';

const DIFFICULTY_DIE_LADDER = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

class EnhancedDiceService {
  constructor() {
    this.rollHistory = [];
    this.maxHistorySize = 100;
    this.socket = null;
  }

  /**
   * Apply the Milestone of Mastery rule: when an attribute modifier reaches +5 or
   * higher, the difficulty die steps down one size before the roll.
   * @param {number} modifier - The attribute modifier (e.g. +5 for STR 20)
   * @param {string} currentDie - Current difficulty die (e.g. 'd10')
   * @returns {{ die: string, stepped: boolean }} The stepped-down die and whether a step occurred
   */
  applyMilestoneOfMastery(modifier, currentDie) {
    if (modifier < 5) return { die: currentDie, stepped: false };
    const idx = DIFFICULTY_DIE_LADDER.indexOf(currentDie);
    if (idx <= 0) return { die: currentDie, stepped: false };
    return { die: DIFFICULTY_DIE_LADDER[idx - 1], stepped: true };
  }

  /**
   * Handle weapon durability damage on a combat fumble.
   * Reduces the equipped weapon's durability by 1d4 and shows a notification.
   * @param {string} weaponItemId - The item ID of the equipped weapon
   * @param {string} weaponName - Display name of the weapon
   * @returns {{ durabilityLost: number, newDurability: number, broken: boolean } | null}
   */
  handleWeaponFumble(weaponItemId, weaponName) {
    if (!weaponItemId) return null;
    try {
      const itemStore = require('../store/itemStore').default;
      const item = itemStore.getState().items.find(i => i.id === weaponItemId);
      if (!item || item.durability === undefined) return null;

      const diceSteps = ['broken', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20'];
      const isDiceBased = typeof item.durability === 'string' && String(item.durability).toLowerCase().startsWith('d');

      let newDurability;
      let durabilityLost;
      let isBroken = false;

      if (isDiceBased) {
        // Dice-based: step down 1-2 die sizes on fumble
        const stepsLost = Math.floor(Math.random() * 2) + 1;
        const currentIdx = diceSteps.indexOf(item.durability.toLowerCase());
        const newIdx = Math.max(0, currentIdx - stepsLost);
        newDurability = diceSteps[newIdx];
        durabilityLost = stepsLost;
        isBroken = newDurability === 'broken';
      } else {
        // Numeric legacy system
        durabilityLost = Math.floor(Math.random() * 4) + 1;
        newDurability = Math.max(0, item.durability - durabilityLost);
        isBroken = newDurability === 0;
      }

      itemStore.getState().updateItemDurability(weaponItemId, newDurability);
      if (typeof window !== 'undefined') {
        if (!document.querySelector('#durability-notification-styles')) {
          const style = document.createElement('style');
          style.id = 'durability-notification-styles';
          style.textContent = '@keyframes fadeInOut{0%{opacity:0;transform:translateX(-50%) scale(0.8)}20%{opacity:1;transform:translateX(-50%) scale(1)}80%{opacity:1;transform:translateX(-50%) scale(1)}100%{opacity:0;transform:translateX(-50%) scale(0.8)}}';
          document.head.appendChild(style);
        }
        const notification = document.createElement('div');
        notification.textContent = isDiceBased
          ? `${weaponName} chips on the fumble! Degraded to ${newDurability.toUpperCase()}`
          : `${weaponName} chips on the fumble! -${durabilityLost} Durability`;
        notification.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);background:rgba(139,69,19,0.95);color:#ffcc80;padding:10px 18px;border-radius:6px;border:1px solid #d2691e;font-family:Cinzel,serif;font-size:14px;font-weight:600;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.5);animation:fadeInOut 2.5s ease-in-out forwards;';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2600);
      }
      return { durabilityLost, newDurability, broken: isBroken };
    } catch (e) {
      return null;
    }
  }

  /**
   * Initialize with multiplayer socket
   */
  initialize(socket) {
    this.socket = socket;
    
    if (socket) {
      // Listen for dice rolls from other players
      socket.on('dice_roll_result', (data) => {
        this.handleRemoteDiceRoll(data);
      });
    }
  }

  /**
   * Parse and execute dice notation (e.g., "2d20+5", "1d8+3", "4d6kh3")
   */
  async rollDice(notation, options = {}) {
    const {
      playerName = 'Player',
      characterName = null,
      rollType = 'general',
      isPrivate = false,
      advantage = false,
      disadvantage = false,
      modifier = 0,
      description = ''
    } = options;

    try {
      // Parse the dice notation
      const parsedRoll = this.parseDiceNotation(notation);
      if (!parsedRoll) {
        throw new Error(`Invalid dice notation: ${notation}`);
      }

      // Apply advantage/disadvantage for d20 rolls
      if (parsedRoll.sides === 20 && (advantage || disadvantage)) {
        parsedRoll.count = 2;
        parsedRoll.keepHighest = advantage ? 1 : null;
        parsedRoll.keepLowest = disadvantage ? 1 : null;
      }

      // Execute the roll
      const rollResult = this.executeRoll(parsedRoll);
      
      // Add modifier
      const finalTotal = rollResult.total + modifier;

      // Create roll data
      const rollData = {
        id: `roll_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        timestamp: new Date().toISOString(),
        playerName,
        characterName,
        notation: notation,
        originalNotation: notation,
        modifier: modifier,
        rollType,
        isPrivate,
        advantage,
        disadvantage,
        description,
        results: rollResult.results,
        total: rollResult.total,
        finalTotal: finalTotal,
        breakdown: this.createRollBreakdown(rollResult, modifier),
        isCritical: this.checkCritical(rollResult, parsedRoll),
        isFumble: this.checkFumble(rollResult, parsedRoll)
      };

      // Add to local history
      this.addToHistory(rollData);

      // Send to chat
      this.sendRollToChat(rollData);

      // Send to multiplayer if connected
      if (this.socket && useGameStore.getState().isInMultiplayer) {
        this.socket.emit('dice_roll', rollData);
      }

      return rollData;

    } catch (error) {
      console.error('Dice roll error:', error);
      throw error;
    }
  }

  /**
   * Parse dice notation into components
   */
  parseDiceNotation(notation) {
    // Enhanced regex to handle complex dice notation
    const diceRegex = /^(\d+)?d(\d+)(?:(kh|kl|k)(\d+))?(?:([+-])(\d+))?$/i;
    const match = notation.trim().match(diceRegex);

    if (!match) {
      return null;
    }

    const [, count = '1', sides, keepType, keepCount, modifierSign, modifierValue] = match;

    return {
      count: parseInt(count),
      sides: parseInt(sides),
      keepType: keepType?.toLowerCase(),
      keepCount: keepCount ? parseInt(keepCount) : null,
      modifier: modifierSign && modifierValue ? 
        (modifierSign === '+' ? 1 : -1) * parseInt(modifierValue) : 0
    };
  }

  /**
   * Execute the actual dice roll
   */
  executeRoll(parsedRoll) {
    const { count, sides, keepType, keepCount } = parsedRoll;
    const results = [];

    // Roll all dice
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      results.push({
        value: roll,
        sides: sides,
        kept: true // Will be updated if we're keeping only some
      });
    }

    // Handle keep highest/lowest
    if (keepType && keepCount) {
      // Sort results
      const sortedResults = [...results].sort((a, b) => 
        keepType === 'kh' ? b.value - a.value : a.value - b.value
      );

      // Mark which dice to keep
      results.forEach(result => result.kept = false);
      for (let i = 0; i < Math.min(keepCount, results.length); i++) {
        const originalIndex = results.findIndex(r => 
          r.value === sortedResults[i].value && !r.kept
        );
        if (originalIndex !== -1) {
          results[originalIndex].kept = true;
        }
      }
    }

    // Calculate total from kept dice
    const total = results
      .filter(result => result.kept)
      .reduce((sum, result) => sum + result.value, 0);

    return { results, total };
  }

  /**
   * Create a human-readable breakdown of the roll
   */
  createRollBreakdown(rollResult, modifier) {
    const keptResults = rollResult.results.filter(r => r.kept);
    const droppedResults = rollResult.results.filter(r => !r.kept);
    
    let breakdown = `[${keptResults.map(r => r.value).join(', ')}]`;
    
    if (droppedResults.length > 0) {
      breakdown += ` (dropped: [${droppedResults.map(r => r.value).join(', ')}])`;
    }
    
    if (modifier !== 0) {
      breakdown += ` ${modifier >= 0 ? '+' : ''}${modifier}`;
    }
    
    return breakdown;
  }

  /**
   * Check if roll is critical (natural 20 on d20)
   */
  checkCritical(rollResult, parsedRoll) {
    if (parsedRoll.sides !== 20) return false;
    return rollResult.results.some(r => r.value === 20 && r.kept);
  }

  /**
   * Check if roll is fumble (natural 1 on d20)
   */
  checkFumble(rollResult, parsedRoll) {
    if (parsedRoll.sides !== 20) return false;
    return rollResult.results.some(r => r.value === 1 && r.kept);
  }

  /**
   * Send roll result to chat
   */
  sendRollToChat(rollData) {
    const { addNotification } = useChatStore.getState();
    
    const rollMessage = this.formatRollMessage(rollData);
    
    addNotification('dice', {
      id: rollData.id,
      sender: {
        name: rollData.characterName || rollData.playerName,
        class: 'player',
        level: 1
      },
      content: rollMessage,
      type: rollData.isPrivate ? 'whisper' : 'dice',
      timestamp: rollData.timestamp,
      rollData: rollData
    });
  }

  /**
   * Format roll message for chat display
   */
  formatRollMessage(rollData) {
    let message = '';
    
    if (rollData.description) {
      message += `**${rollData.description}**\n`;
    }
    
    message += `🎲 **${rollData.originalNotation}** = **${rollData.finalTotal}**`;
    
    if (rollData.isCritical) {
      message += ' 🎯 **CRITICAL!**';
    } else if (rollData.isFumble) {
      message += ' 💥 **FUMBLE!**';
    }
    
    message += `\n${rollData.breakdown}`;
    
    if (rollData.advantage) {
      message += ' (Advantage)';
    } else if (rollData.disadvantage) {
      message += ' (Disadvantage)';
    }
    
    return message;
  }

  /**
   * Handle dice roll from another player
   */
  handleRemoteDiceRoll(rollData) {
    // Add to local history
    this.addToHistory(rollData);
    
    // Add to chat if not already there
    const { addNotification } = useChatStore.getState();
    const rollMessage = this.formatRollMessage(rollData);
    
    addNotification('dice', {
      id: rollData.id,
      sender: {
        name: rollData.characterName || rollData.playerName,
        class: 'player',
        level: 1
      },
      content: rollMessage,
      type: rollData.isPrivate ? 'whisper' : 'dice',
      timestamp: rollData.timestamp,
      rollData: rollData,
      isRemote: true
    });
  }

  /**
   * Add roll to history
   */
  addToHistory(rollData) {
    this.rollHistory.unshift(rollData);
    if (this.rollHistory.length > this.maxHistorySize) {
      this.rollHistory.pop();
    }
  }

  /**
   * Get roll history
   */
  getHistory() {
    return this.rollHistory;
  }

  /**
   * Quick roll presets for common D&D rolls
   */
  getQuickRolls() {
    return {
      'Attack Roll': '1d20',
      'Damage (Sword)': '1d8',
      'Damage (Greatsword)': '2d6',
      'Healing Potion': '2d4+2',
      'Ability Check': '1d20',
      'Saving Throw': '1d20',
      'Initiative': '1d20',
      'Skill Check': '1d20',
      'Death Save': '1d20',
      'Hit Die (d6)': '1d6',
      'Hit Die (d8)': '1d8',
      'Hit Die (d10)': '1d10',
      'Hit Die (d12)': '1d12'
    };
  }
}

// Create singleton instance
const enhancedDiceService = new EnhancedDiceService();

export default enhancedDiceService;
export { DIFFICULTY_DIE_LADDER };
