/**
 * Class Spell Library Hook
 * 
 * Manages dynamic loading of class-specific spells based on active character
 */

import { useState, useEffect, useCallback } from 'react';
import useCharacterStore from '../store/characterStore';
import { ALL_CLASS_SPELLS } from '../data/classSpellGenerator';
import { createSpellLibraryCategoriesForClass, getClassSpecializations } from '../data/classSpellCategories';

export const useClassSpellLibrary = () => {
  const [classSpells, setClassSpells] = useState([]);
  const [spellCategories, setSpellCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get character store data
  const currentCharacterId = useCharacterStore(state => state.currentCharacterId);
  const characters = useCharacterStore(state => state.characters);
  const currentClass = useCharacterStore(state => state.class);

  // Get active character
  const activeCharacter = characters.find(char => char.id === currentCharacterId);
  const characterClass = activeCharacter?.class || currentClass;

  // Debug logging (when character or class changes)
  useEffect(() => {
    console.log('🔍 useClassSpellLibrary - Character State:', {
      currentCharacterId,
      activeCharacter: activeCharacter ? {
        id: activeCharacter.id,
        name: activeCharacter.name,
        class: activeCharacter.class
      } : null,
      currentClass,
      resolvedCharacterClass: characterClass
    });
  }, [currentCharacterId, activeCharacter?.id, activeCharacter?.class, currentClass, characterClass]);

  /**
   * Load spells for a specific class
   */
  const loadSpellsForClass = useCallback(async (className) => {
    if (!className || className === 'Class') {
      setClassSpells([]);
      setSpellCategories([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get class spells from generated data
      const spellsForClass = ALL_CLASS_SPELLS[className] || [];

      // Create categories for this class
      const categories = createSpellLibraryCategoriesForClass(className);

      console.log(`📚 Loaded ${spellsForClass.length} spells in ${categories.length} categories for ${className}`);

      // Organize spells into categories
      const organizedCategories = categories.map(category => {
        if (category.id === 'custom_spells') {
          // Custom spells will be handled separately
          return {
            ...category,
            spells: []
          };
        }

        // Find spells for this specialization
        const specializationSpells = spellsForClass.filter(spell => 
          spell.specialization === category.id.replace(`${className.toLowerCase()}_`, '')
        );

        return {
          ...category,
          spells: specializationSpells
        };
      });

      setClassSpells(spellsForClass);
      setSpellCategories(organizedCategories);
    } catch (err) {
      console.error('Error loading class spells:', err);
      setError(`Failed to load spells for ${className}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a custom spell to the custom spells category
   */
  const addCustomSpell = useCallback((spell) => {
    setSpellCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === 'custom_spells') {
          return {
            ...category,
            spells: [...category.spells, spell]
          };
        }
        return category;
      })
    );
  }, []);

  /**
   * Remove a custom spell
   */
  const removeCustomSpell = useCallback((spellId) => {
    setSpellCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === 'custom_spells') {
          return {
            ...category,
            spells: category.spells.filter(spell => spell.id !== spellId)
          };
        }
        return category;
      })
    );
  }, []);

  /**
   * Get all spells (class + custom) as a flat array
   */
  const getAllSpells = useCallback(() => {
    const allSpells = [];
    spellCategories.forEach(category => {
      allSpells.push(...category.spells);
    });
    return allSpells;
  }, [spellCategories]);

  /**
   * Get spells by category
   */
  const getSpellsByCategory = useCallback((categoryId) => {
    const category = spellCategories.find(cat => cat.id === categoryId);
    return category ? category.spells : [];
  }, [spellCategories]);

  /**
   * Get category information
   */
  const getCategoryInfo = useCallback((categoryId) => {
    return spellCategories.find(cat => cat.id === categoryId);
  }, [spellCategories]);

  /**
   * Check if a class has spells available
   */
  const hasSpellsForClass = useCallback((className) => {
    return ALL_CLASS_SPELLS[className] && ALL_CLASS_SPELLS[className].length > 0;
  }, []);

  /**
   * Get available classes that have spells
   */
  const getAvailableClasses = useCallback(() => {
    return Object.keys(ALL_CLASS_SPELLS);
  }, []);

  /**
   * Reset the spell library
   */
  const resetLibrary = useCallback(() => {
    setClassSpells([]);
    setSpellCategories([]);
    setError(null);
  }, []);

  // Load spells when character class changes
  useEffect(() => {
    console.log('🔄 useClassSpellLibrary - Class change detected:', {
      characterClass,
      isValidClass: characterClass && characterClass !== 'Class'
    });

    if (characterClass && characterClass !== 'Class') {
      console.log(`📚 Loading spells for class: ${characterClass}`);
      loadSpellsForClass(characterClass);
    } else {
      console.log('🧹 Resetting spell library (no valid class)');
      resetLibrary();
    }
  }, [characterClass, loadSpellsForClass, resetLibrary]);

  // Load custom spells from localStorage on mount
  useEffect(() => {
    const loadCustomSpells = () => {
      try {
        const savedCustomSpells = localStorage.getItem('mythrill-custom-spells');
        if (savedCustomSpells) {
          const customSpells = JSON.parse(savedCustomSpells);
          customSpells.forEach(spell => addCustomSpell(spell));
        }
      } catch (err) {
        console.error('Error loading custom spells:', err);
      }
    };

    loadCustomSpells();
  }, [addCustomSpell]);

  // Save custom spells to localStorage when they change
  useEffect(() => {
    const customCategory = spellCategories.find(cat => cat.id === 'custom_spells');
    if (customCategory && customCategory.spells.length > 0) {
      try {
        localStorage.setItem('mythrill-custom-spells', JSON.stringify(customCategory.spells));
      } catch (err) {
        console.error('Error saving custom spells:', err);
      }
    }
  }, [spellCategories]);

  return {
    // Data
    classSpells,
    spellCategories,
    characterClass,
    activeCharacter,
    
    // State
    isLoading,
    error,
    
    // Methods
    loadSpellsForClass,
    addCustomSpell,
    removeCustomSpell,
    getAllSpells,
    getSpellsByCategory,
    getCategoryInfo,
    hasSpellsForClass,
    getAvailableClasses,
    resetLibrary,
    
    // Computed
    hasActiveCharacter: !!activeCharacter,
    hasClassSpells: classSpells.length > 0,
    categoryCount: spellCategories.length,
    totalSpellCount: getAllSpells().length
  };
};
