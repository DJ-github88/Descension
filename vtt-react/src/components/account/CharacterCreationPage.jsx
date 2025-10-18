// Character creation page - wrapper for character creation with routing
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CharacterCreationWizard from '../character-creation-wizard/CharacterCreationWizard';
import useCharacterStore from '../../store/characterStore';
import useAuthStore from '../../store/authStore';
import subscriptionService from '../../services/subscriptionService';
import './styles/CharacterCreationPage.css';

const CharacterCreationPage = ({ user, isEditing = false }) => {
  const navigate = useNavigate();
  const { characterId } = useParams();
  const { createCharacter, updateCharacter, characters, loadCharacters } = useCharacterStore();
  const { userData } = useAuthStore();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [existingCharacter, setExistingCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditing);

  // Load existing character data when editing
  useEffect(() => {
    const loadExistingCharacter = async () => {
      if (isEditing && characterId) {
        setIsLoading(true);
        try {
          await loadCharacters();
          // Get fresh characters from the store after loading
          const freshCharacters = useCharacterStore.getState().characters;
          const character = freshCharacters.find(c => c.id === characterId);
          if (character) {
            setExistingCharacter(character);
          } else {
            setError('Character not found');
          }
        } catch (error) {
          console.error('Error loading character:', error);
          setError('Failed to load character data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExistingCharacter();
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
          // Add lore section with character image and transformations
          lore: {
            ...(characterData.lore || {}),
            characterImage: characterData.characterImage || null,
            imageTransformations: characterData.imageTransformations || null
          },
          // Add empty inventory and equipment
          inventory: [],
          equipment: {
            weapon: null,
            armor: null,
            shield: null,
            accessories: []
          },
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
