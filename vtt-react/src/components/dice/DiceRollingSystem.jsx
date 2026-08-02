import React, { useState, useEffect, useCallback } from 'react';
import DiceSelectionBar from './DiceSelectionBar';
import PhysicsDiceScene from './PhysicsDiceScene';
import useDiceStore from '../../store/diceStore';
import useChatStore from '../../store/chatStore';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import { saveDiceRoll } from '../../services/firebase/diceRollHistoryService';
import { ROLLABLE_TABLES } from '../../constants/rollableTables';
import { WEAPON_FACE_TEXT } from '../character-sheet/Skills';
import './DiceRollingSystem.css';

const DiceRollingSystem = () => {
  const {
    selectedDice,
    isRolling,
    diceColor,
    activePreset,
    startRoll,
    finishRoll,
    getFormattedRollString
  } = useDiceStore();

  const { addNotification } = useChatStore();
  const characterName = useCharacterStore((state) => state.name);
  const currentCharacterId = useCharacterStore((state) => state.currentCharacterId);
  const currentRoomId = useGameStore((state) => state.currentRoomId);
  const { user } = useAuthStore();

  const [show3DScene, setShow3DScene] = useState(false);
  const [diceToRoll, setDiceToRoll] = useState([]);

  const handleDismiss = useCallback(() => {
    setShow3DScene(false);
    setDiceToRoll([]);
  }, []);

  // Independent explosion for a single die's initial roll.
  // Returns the post-explosion total and the chain of contributing rolls.
  // Each die is checked on its own face value (not the running sum), so a
  // non-max roll that happens to bring the sum over the die size does NOT
  // trigger another explosion.
  const explodeDie = (initial, dieSize) => {
    if (initial !== dieSize) return { value: initial, rolls: [initial], exploded: false };
    let lastRoll = initial;
    const rolls = [initial];
    let guard = 0;
    while (lastRoll === dieSize && guard++ < 20) {
      const extra = Math.floor(Math.random() * dieSize) + 1;
      rolls.push(extra);
      lastRoll = extra;
    }
    return { value: rolls.reduce((s, r) => s + r, 0), rolls, exploded: rolls.length > 1 };
  };

  // Table entry "quality" priority for advantage/disadvantage on table rolls.
  // Higher number = better outcome. Falls back to numeric range midpoint.
  const entryPriority = (entry) => {
    const rank = { 'total-failure': 0, failure: 1, normal: 2, success: 3, critical: 4 };
    if (entry?.type && rank[entry.type] !== undefined) return rank[entry.type];
    if (entry?.roll) return (entry.roll[0] + entry.roll[1]) / 200;
    return 0;
  };

  const finishAllRolls = useCallback(async (results) => {
    const diceStoreState = useDiceStore.getState();
    const rollContext = diceStoreState.rollContext;

    finishRoll(results);

    const rollString = getFormattedRollString();
    const total = results.reduce((sum, result) => sum + result.value, 0);

    // If it's a skill check, handle it with its own beautiful logic!
    if (rollContext && rollContext.type === 'skill') {
      const { skillId, skillName, rollType, tableId, weaponType, dieSize, dieKey, mode } = rollContext;
      const isAdv = mode === 'advantage' || mode === 'double-advantage';
      const isDis = mode === 'disadvantage' || mode === 'double-disadvantage';
      const isMulti = isAdv || isDis; // any mode that picks 1 of N

      // Human-readable mode label for the chip / breakdown message.
      const MODE_LABEL = {
        'normal':              '',
        'advantage':           ' (Advantage)',
        'disadvantage':        ' (Disadvantage)',
        'double-advantage':    ' (Double Advantage)',
        'double-disadvantage': ' (Double Disadvantage)',
      };

      if (rollType === 'simple') {
        // Explode each die independently. Then aggregate per the roll mode:
        //  normal               -> sum (single die value when quantity=1)
        //  advantage            -> max of the post-explosion values
        //  disadvantage         -> min of the post-explosion values
        //  double-advantage      -> max of 3 post-explosion values
        //  double-disadvantage   -> min of 3 post-explosion values
        const exploded = results.map((r) => {
          const size = parseInt(String(r.type).replace('d', ''), 10) || dieSize;
          return { type: r.type, raw: r.value, ...explodeDie(r.value, size) };
        });

        let chosen;
        let discarded = []; // array of discarded exploded-die entries
        if (!isMulti || exploded.length === 1) {
          const summed = exploded.reduce((s, e) => s + e.value, 0);
          const allRolls = exploded.flatMap((e) => e.rolls);
          const explodedAny = exploded.some((e) => e.exploded);
          chosen = { value: summed, label: exploded.length > 1 ? allRolls.join(' + ') + ' = ' + summed : String(summed), rolls: allRolls, exploded: explodedAny, source: mode };
        } else {
          const sorted = [...exploded].sort((a, b) => a.value - b.value);
          // Keep the highest (advantage) or lowest (disadvantage). All other
          // dice are discarded and listed in the breakdown.
          const keepIdx = isAdv ? sorted.length - 1 : 0;
          const kept = sorted[keepIdx];
          chosen = { value: kept.value, label: kept.rolls.length > 1 ? kept.rolls.join(' + ') + ' = ' + kept.value : String(kept.value), rolls: kept.rolls, exploded: kept.exploded, source: mode };
          discarded = sorted.filter((_, i) => i !== keepIdx);
        }

        // No auto-outcome: a 2 on a d4 isn't inherently a "failure" — the GM
        // and player decide what the number means against the chosen DC. The
        // chip just shows the rolled value; the breakdown message explains
        // advantage/disadvantage + explosion.

        const modeLabel = MODE_LABEL[mode] || '';
        const discardedNote = discarded.length > 0
          ? ` Kept ${chosen.value} over ${discarded.map((d) => d.value).join(', ')}.`
          : '';
        const message = `Rolled ${chosen.label} on d${dieSize}${chosen.exploded ? ' (exploded!)' : ''}${modeLabel}.${discardedNote}`;

        // Save skill outcome to the Zustand store so PhysicsDiceScene renders it!
        // type: 'rolled' is the neutral marker (no success/failure/crit styling).
        useDiceStore.setState({
          skillOutcome: {
            skillName,
            message,
            flavor: '',
            type: 'rolled',
            mode: mode, // 'normal' | 'advantage' | 'double-advantage' | 'disadvantage' | 'double-disadvantage'
            chosenValue: chosen.value,
            // Kept for backward compat: first discarded value (if any).
            discardedValue: discarded[0]?.value ?? null,
            // New: all discarded values for double modes.
            discardedValues: discarded.map((d) => d.value),
            dieSize
          }
        });

        // Add to combat chat log with custom message
        addNotification('combat', {
          id: `skill_roll_${Date.now()}`,
          type: 'combat_resource',
          attacker: characterName || 'Player',
          message: `${characterName || 'Player'} rolled ${chosen.label} on d${dieSize} for ${skillName}${modeLabel}${discardedNote}!`,
          timestamp: new Date().toISOString()
        });
      } else if (rollType === 'table') {
        const table = ROLLABLE_TABLES[tableId];

        if (table) {
          // Look up the table entry for EACH die independently. The die size
          // for weapon mastery is always d8 (single lookup range), but for
          // other table skills each die contributes its face value to a total
          // that is then mapped to a [lo,hi] range.
          const lookupEntryFor = (total) => table.table.find((e) => total >= e.roll[0] && total <= e.roll[1]);

          const candidates = results.map((r) => {
            const totalForDie = r.value; // d8 table: each die = its face
            const entry = lookupEntryFor(totalForDie);
            return { value: totalForDie, entry };
          }).filter((c) => c.entry);

          if (candidates.length > 0) {
            let chosen;
            let discarded = []; // all discarded candidates
            if (!isMulti || candidates.length === 1) {
              chosen = candidates[0];
            } else {
              const sorted = [...candidates].sort((a, b) => entryPriority(a.entry) - entryPriority(b.entry));
              const keepIdx = isAdv ? sorted.length - 1 : 0;
              chosen = sorted[keepIdx];
              discarded = sorted.filter((_, i) => i !== keepIdx);
            }

            let resultText = chosen.entry.result;
            if (skillId === 'weaponMastery') {
              const faceText = WEAPON_FACE_TEXT[weaponType]?.[Math.min(8, Math.max(1, chosen.value))];
              resultText = faceText || chosen.entry.result;
            }

            const modeLabel = MODE_LABEL[mode] || '';
            const discardedNote = discarded.length > 0
              ? ` Kept ${chosen.value} (${chosen.entry.type}) over ${discarded.map((d) => `${d.value} (${d.entry.type})`).join(', ')}.`
              : '';
            const message = `Rolled ${chosen.value} on ${skillName} Table${modeLabel}.${discardedNote}`;

            // Save skill outcome to the Zustand store so PhysicsDiceScene renders it!
            useDiceStore.setState({
              skillOutcome: {
                skillName,
                message,
                flavor: resultText,
                type: chosen.entry.type,
                mode: mode,
                chosenValue: chosen.value,
                discardedValue: discarded[0]?.value ?? null,
                discardedValues: discarded.map((d) => d.value),
                dieSize
              }
            });

            // Add to combat chat log with custom message
            addNotification('combat', {
              id: `skill_roll_${Date.now()}`,
              type: 'combat_resource',
              attacker: characterName || 'Player',
              message: `${characterName || 'Player'} rolled ${chosen.value} on ${skillName} Table (${table.name})${modeLabel}${discardedNote}: "${resultText}"`,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
    } else {
      // Default notification for manual rolls
      addNotification('combat', {
        type: 'dice_roll',
        sender: characterName || 'Player',
        rollString: rollString,
        diceResults: results,
        total: total,
        timestamp: new Date().toISOString()
      });
    }

    if (user && !user.isGuest && currentCharacterId) {
      try {
        const rollData = {
          dice: diceStoreState.selectedDice,
          results: results,
          total: total,
          rollString: rollString,
          rollType: rollContext ? 'skill' : 'manual',
          context: rollContext,
          isPublic: true
        };

        await saveDiceRoll(user.uid, currentCharacterId, currentRoomId, rollData);
      } catch (error) {
        console.error('Failed to save dice roll to Firebase:', error);
      }
    }
  }, [finishRoll, getFormattedRollString, addNotification, characterName, user, currentCharacterId, currentRoomId, handleDismiss]);

  useEffect(() => {
    if (isRolling && selectedDice.length > 0) {
      const expandedDice = selectedDice.flatMap(die => {
        const diceArray = [];
        for (let i = 0; i < die.quantity; i++) {
          if (die.type === 'd100') {
            diceArray.push({
              id: `${die.id}_${i}_pct`,
              type: 'dpercent',
              quantity: 1,
              isPercentilePair: true,
              pairIndex: 0
            });
            diceArray.push({
              id: `${die.id}_${i}_d10`,
              type: 'd10',
              quantity: 1,
              isPercentilePair: true,
              pairIndex: 1
            });
          } else {
            diceArray.push({
              id: `${die.id}_${i}`,
              type: die.type,
              quantity: 1
            });
          }
        }
        return diceArray;
      });
      setDiceToRoll(expandedDice);
      setShow3DScene(true);
    }
  }, [isRolling, selectedDice]);

  const handleRollComplete = useCallback((results) => {
    finishAllRolls(results);
  }, [finishAllRolls]);


  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape' && show3DScene) {
        setShow3DScene(false);
        setDiceToRoll([]);
        if (isRolling) {
          finishRoll([]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [show3DScene, isRolling, finishRoll]);

  return (
    <div className="dice-rolling-system">
      <DiceSelectionBar />

      <PhysicsDiceScene
        diceToRoll={diceToRoll}
        diceColor={diceColor}
        activePreset={activePreset}
        onRollComplete={handleRollComplete}
        onDismiss={handleDismiss}
        isVisible={show3DScene && diceToRoll.length > 0}
      />
    </div>
  );
};

export default DiceRollingSystem;
