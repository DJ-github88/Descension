import React, { useState, useEffect, useCallback } from 'react';
import DiceSelectionBar from './DiceSelectionBar';
import PhysicsDiceScene from './PhysicsDiceScene';
import useDiceStore from '../../store/diceStore';
import useChatStore from '../../store/chatStore';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import { saveDiceRoll } from '../../services/firebase/diceRollHistoryService';
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

  const finishAllRolls = useCallback(async (results) => {
    finishRoll(results);

    const rollString = getFormattedRollString();
    const total = results.reduce((sum, result) => sum + result.value, 0);

    addNotification('combat', {
      type: 'dice_roll',
      sender: characterName || 'Player',
      rollString: rollString,
      diceResults: results,
      total: total,
      timestamp: new Date().toISOString()
    });

    if (user && !user.isGuest && currentCharacterId) {
      try {
        const rollData = {
          dice: selectedDice,
          results: results,
          total: total,
          rollString: rollString,
          rollType: 'manual',
          context: null,
          isPublic: true
        };

        await saveDiceRoll(user.uid, currentCharacterId, currentRoomId, rollData);
      } catch (error) {
        console.error('Failed to save dice roll to Firebase:', error);
      }
    }
  }, [finishRoll, getFormattedRollString, addNotification, characterName, selectedDice, user, currentCharacterId, currentRoomId]);

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

  const handleDismiss = useCallback(() => {
    setShow3DScene(false);
    setDiceToRoll([]);
  }, []);

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
