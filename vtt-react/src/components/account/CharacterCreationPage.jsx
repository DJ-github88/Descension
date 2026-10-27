// Character creation page - wrapper for character creation with routing
import React, { useState, useEffect } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import CharacterCreationWizard from '../character-creation-wizard/CharacterCreationWizard';
import useCharacterStore from '../../store/characterStore';
import useAuthStore from '../../store/authStore';
import subscriptionService from '../../services/subscriptionService';
import { subscribeBootstrapGate } from '../../persistence/bootstrapPrivacyGate';
import { createEmptyEquipment } from '../../utils/equipmentUtils';
import './styles/CharacterCreationPage.css';
import './styles/AdventurerWorkspace.css';

const CharacterCreationPage = ({ user, isEditing = false }) => {
  const navigate = useNavigate();
  const { characterId } = useParams();
  const { createCharacter, updateCharacter, characters, loadCharacters } = useCharacterStore();
  const { userData } = useAuthStore();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [existingCharacter, setExistingCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditing);

  // Load existing character data when editing. A cold page load can reach
  // this effect before the private scope hydrates the roster, so retry until
  // the owner's characters arrive instead of declaring "not found" early.
  useEffect(() => {
    if (!isEditing || !characterId) return undefined;

    let cancelled = false;
    let pollTimer = null;
    let running = false;
    let unsubscribe = () => {};
    const deadline = Date.now() + 10000;

    const attempt = async () => {
      if (cancelled || running) return false;
      running = true;
      try {
        await loadCharacters();
        if (cancelled) return true;
        const freshCharacters = useCharacterStore.getState().characters;
        const character = freshCharacters.find(c => c.id === characterId);
        if (character) {
          setExistingCharacter(character);
          setError(null);
          setIsLoading(false);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error loading character:', error);
        if (!cancelled) {
          setError('Failed to load character data');
          setIsLoading(false);
        }
        return true;
      } finally {
        running = false;
      }
    };

    const poll = async () => {
      if (cancelled) return;
      const settled = await attempt();
      if (settled || cancelled) return;
      if (Date.now() >= deadline) {
        setError('Character not found');
        setIsLoading(false);
        return;
      }
      pollTimer = setTimeout(poll, 400);
    };

    setIsLoading(true);
    poll();
    unsubscribe = subscribeBootstrapGate(() => {
      if (!cancelled) attempt();
    });

    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
      unsubscribe();
    };
  }, [isEditing, characterId, loadCharacters]);

  const handleCharacterCreationComplete = async (characterData) => {
    setIsCreating(true);
    setError(null);

    try {
      if (isEditing && existingCharacter) {
        // Update existing character
        const updatedCharacterData = {
          ...existingCharacter,
          ...characterData,
          lore: {
            ...(existingCharacter.lore || {}),
            ...(characterData.lore || {}),
            characterImage: characterData.characterImage || null,
            imageTransformations: characterData.imageTransformations || null,
            characterIcon: characterData.characterIcon || null,
            iconBackgroundColor: characterData.iconBackgroundColor || '#f8f5eb',
            iconBorderColor: characterData.iconBorderColor || '#d4af37',
            iconBackgroundImage: characterData.iconBackgroundImage || null,
            iconScale: characterData.iconScale || 1,
            iconOffsetX: characterData.iconOffsetX || 0,
            iconOffsetY: characterData.iconOffsetY || 0,
            iconBackgroundScale: characterData.iconBackgroundScale || 2.5,
            iconBackgroundOffsetX: characterData.iconBackgroundOffsetX || 0,
            iconBackgroundOffsetY: characterData.iconBackgroundOffsetY || 0
          },
          updatedAt: new Date().toISOString(),
        };

        const savedCharacter = await updateCharacter(characterId, updatedCharacterData);
        console.log('Character updated successfully:', savedCharacter);

        navigate('/account', {
          state: {
            message: `${characterData.name} has been updated successfully!`,
            updatedCharacterId: characterId,
            activeTab: 'characters'
          }
        });
      } else {
        // Check character limits before creating new character
        const limitInfo = await subscriptionService.canCreateCharacter(characters.length, user?.uid);

        if (!limitInfo.canCreate) {
          const tierName = limitInfo.tierName;
          const limit = limitInfo.limit;
          const isUnlimited = limitInfo.isUnlimited;

          if (!isUnlimited) {
            setError(`Character limit reached!\n\nYour ${tierName} membership allows ${limit} character${limit === 1 ? '' : 's'}.\nYou currently have ${limitInfo.currentCount} character${limitInfo.currentCount === 1 ? '' : 's'}.\n\nUpgrade your membership to create more characters.`);
            setIsCreating(false);
            return;
          }
        }

        // Create new character
        const completeCharacterData = {
          ...characterData,
          userId: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          level: 1,
          experience: 0,
          // Health will be calculated based on constitution in character store
          hitPoints: characterData.hitPoints || (characterData.stats?.constitution || 10) * 5,
          maxHitPoints: characterData.maxHitPoints || (characterData.stats?.constitution || 10) * 5,
          armor: characterData.armor || 10,
          // Add default stats if not provided
          stats: characterData.stats || {
            strength: 10,
            agility: 10,
            constitution: 10,
            intelligence: 10,
            spirit: 10,
            charisma: 10
          },
          // Add lore section with character image, transformations, and icon
          lore: {
            ...(characterData.lore || {}),
            characterImage: characterData.characterImage || null,
            imageTransformations: characterData.imageTransformations || null,
            characterIcon: characterData.characterIcon || null,
            iconBackgroundColor: characterData.iconBackgroundColor || '#f8f5eb',
            iconBorderColor: characterData.iconBorderColor || '#d4af37',
            iconBackgroundImage: characterData.iconBackgroundImage || null,
            iconScale: characterData.iconScale || 1,
            iconOffsetX: characterData.iconOffsetX || 0,
            iconOffsetY: characterData.iconOffsetY || 0,
            iconBackgroundScale: characterData.iconBackgroundScale || 2.5,
            iconBackgroundOffsetX: characterData.iconBackgroundOffsetX || 0,
            iconBackgroundOffsetY: characterData.iconBackgroundOffsetY || 0
          },
          // Add inventory with selected equipment and remaining currency
          inventory: {
            items: characterData.selectedEquipment || [],
            currency: characterData.remainingCurrency || {
              platinum: 0,
              gold: 0,
              silver: 0,
              copper: 0
            }
          },
          equipment: createEmptyEquipment(),
          // Add empty spells and abilities
          spells: [],
          abilities: [],
          // Add character preferences
          preferences: {
            theme: userData?.preferences?.theme || 'pathfinder',
            autoSave: true
          }
        };

        const savedCharacter = await createCharacter(completeCharacterData);
        console.log('Character created successfully:', savedCharacter);

        // CRITICAL FIX: Reload characters after creation to ensure they appear in character management
        await loadCharacters();

        navigate('/account', {
          state: {
            message: `${characterData.name} has been created successfully!`,
            newCharacterId: savedCharacter.id,
            activeTab: 'characters'
          }
        });
      }

    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} character:`, error);
      setError(`Failed to ${isEditing ? 'update' : 'create'} character. Please try again.`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCharacterCreationCancel = () => {
    navigate('/account');
  };

  return (
    <div className="character-creation-page">

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {(isCreating || isLoading) && (
        <div className="creation-overlay">
          <div className="creation-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>{isLoading ? 'Loading character data...' : `${isEditing ? 'Updating' : 'Creating'} your character...`}</p>
          </div>
        </div>
      )}



      {/* Character Creation Wizard */}
      <main className="creation-main">
        <CharacterCreationWizard
          onComplete={handleCharacterCreationComplete}
          onCancel={handleCharacterCreationCancel}
          isLoading={isCreating}
          existingCharacter={existingCharacter}
          isEditing={isEditing}
        />
      </main>
    </div>
  );
};

export default CharacterCreationPage;
