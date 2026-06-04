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

  const finishAllRolls = useCallback(async (results) => {
    const diceStoreState = useDiceStore.getState();
    const rollContext = diceStoreState.rollContext;

    finishRoll(results);

    const rollString = getFormattedRollString();
    const total = results.reduce((sum, result) => sum + result.value, 0);

    // If it's a skill check, handle it with its own beautiful logic!
    if (rollContext && rollContext.type === 'skill') {
      const { skillId, skillName, rollType, tableId, weaponType, dieSize } = rollContext;

      if (rollType === 'simple') {
        // Calculate explosion programmatically if we rolled the max on the die
        let finalTotal = total;
        let rolls = [total];
        let exploded = (total === dieSize);
        let rollCount = 0;
        
        while (exploded && rollCount < 10) {
          const extra = Math.floor(Math.random() * dieSize) + 1;
          rolls.push(extra);
          finalTotal += extra;
          exploded = (extra === dieSize);
          rollCount++;
        }

        const resultType = finalTotal >= 10 ? 'success' : finalTotal >= 5 ? 'normal' : 'failure';
        const rollLabel = rolls.length > 1
          ? `${rolls.join(' + ')} = ${finalTotal}`
          : `${finalTotal}`;

        // Save skill outcome to the Zustand store so PhysicsDiceScene renders it!
        useDiceStore.setState({
          skillOutcome: {
            skillName,
            message: `Rolled ${rollLabel} on d${dieSize}${rolls.length > 1 ? ' (exploded!)' : ''}`,
            flavor: resultType.toUpperCase(),
            type: resultType
          }
        });



        // Add to combat chat log with custom message
        addNotification('combat', {
          id: `skill_roll_${Date.now()}`,
          type: 'combat_resource',
          attacker: characterName || 'Player',
          message: `${characterName || 'Player'} rolled ${rollLabel} on d${dieSize} for ${skillName}${rolls.length > 1 ? ' (exploded!)' : ''}! Outcome: ${resultType.toUpperCase()}`,
          timestamp: new Date().toISOString()
        });
      } else if (rollType === 'table') {
        const table = ROLLABLE_TABLES[tableId];
        
        if (table) {
          const entry = table.table.find(e =>
            total >= e.roll[0] && total <= e.roll[1]
          );

          if (entry) {
            let resultText = entry.result;
            // Retrieve custom weapon flavor if it's weapon mastery
            if (skillId === 'weaponMastery') {
              const faceText = WEAPON_FACE_TEXT[weaponType]?.[Math.min(8, Math.max(1, total))];
              resultText = faceText || entry.result;
            }

            // Save skill outcome to the Zustand store so PhysicsDiceScene renders it!
            useDiceStore.setState({
              skillOutcome: {
                skillName,
                message: `Rolled ${total} on ${skillName}`,
                flavor: resultText,
                type: entry.type
              }
            });



            // Add to combat chat log with custom message
            addNotification('combat', {
              id: `skill_roll_${Date.now()}`,
              type: 'combat_resource',
              attacker: characterName || 'Player',
              message: `${characterName || 'Player'} rolled ${total} on ${skillName} Table (${table.name}): "${resultText}"`,
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
