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
  const knownSpells = useCharacterStore(state => state.class_spells?.known_spells || []);

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
        class: activeCharacter.class,
        class_spells: activeCharacter.class_spells
      } : null,
      currentClass,
      resolvedCharacterClass: characterClass,
      knownSpellsFromStore: knownSpells,
      knownSpellsCount: knownSpells.length
    });
  }, [currentCharacterId, activeCharacter?.id, activeCharacter?.class, currentClass, characterClass, knownSpells]);

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
      
      console.log(`🔍 Loading spells for ${className}:`, {
        spellsInALL_CLASS_SPELLS: ALL_CLASS_SPELLS[className]?.length || 0,
        availableClasses: Object.keys(ALL_CLASS_SPELLS),
        spellsForClass: spellsForClass.length,
        firstFewSpells: spellsForClass.slice(0, 3).map(s => ({ 
          name: s.name, 
          id: s.id, 
          specialization: s.specialization 
        }))
      });

      // Create categories for this class
      const categories = createSpellLibraryCategoriesForClass(className);

      console.log(`📚 Loaded ${spellsForClass.length} spells in ${categories.length} categories for ${className}`, {
        categoryIds: categories.map(c => c.id)
      });

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
        const specializationId = category.id.replace(`${className.toLowerCase()}_`, '');
        const specializationSpells = spellsForClass.filter(spell => {
          const matches = spell.specialization === specializationId;
          if (!matches && spell.specialization) {
            console.log(`🔍 Spell ${spell.name} (specialization: ${spell.specialization}) doesn't match category ${category.id} (specializationId: ${specializationId})`);
          }
          return matches;
        });

        console.log(`📚 Category ${category.name} (${category.id}): Found ${specializationSpells.length} spells`, {
          specializationId,
          spellNames: specializationSpells.map(s => s.name),
          spellIds: specializationSpells.map(s => s.id)
        });

        return {
          ...category,
          spells: specializationSpells
        };
      });

      setClassSpells(spellsForClass);
      setSpellCategories(organizedCategories);

      // If the character doesn't know any spells yet, assign starter spells for this class
      try {
        const store = require('../store/characterStore').default;
        const assigned = await store.getState().ensureClassStarterSpells(className);
        if (assigned) {
          console.log(`✨ Assigned starter spells for ${className}`);
        }
      } catch (e) {
        console.warn('Could not ensure starter spells:', e);
      }
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
   * Returns only known spells if the character has learned any
   * Otherwise returns empty array (spellbook should only show learned spells)
   */
  const getAllSpells = useCallback(() => {
    const allSpells = [];
    spellCategories.forEach(category => {
      allSpells.push(...category.spells);
    });

    console.log('📚 getAllSpells Debug:', {
      totalSpellsInCategories: allSpells.length,
      knownSpellsCount: knownSpells.length,
      knownSpells: knownSpells,
      allSpellIds: allSpells.map(s => s.id)
    });

    // Filter to only show spells the character has learned
    // The spellbook should only display spells the character knows
    if (knownSpells.length > 0) {
      const filtered = allSpells.filter(spell => knownSpells.includes(spell.id));
      console.log('📚 Filtered to known spells for spellbook:', {
        filteredCount: filtered.length,
        filteredSpells: filtered.map(s => ({ id: s.id, name: s.name })),
        knownSpellIds: knownSpells,
        allSpellIds: allSpells.map(s => s.id),
        missingSpells: knownSpells.filter(id => !allSpells.some(s => s.id === id))
      });
      return filtered;
    }

    // If no known spells, return empty array (character hasn't learned any spells yet)
    console.log('📚 No known spells, returning empty array for spellbook');
    return [];
  }, [spellCategories, knownSpells]);

  /**
   * Get spells by category
   * Returns only known spells in the category (spellbook should only show learned spells)
   */
  const getSpellsByCategory = useCallback((categoryId) => {
    const category = spellCategories.find(cat => cat.id === categoryId);
    const categorySpells = category ? category.spells : [];

    // Filter to only show spells the character has learned
    if (knownSpells.length > 0) {
      return categorySpells.filter(spell => knownSpells.includes(spell.id));
    }

    // If no known spells, return empty array
    return [];
  }, [spellCategories, knownSpells]);

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
    // Consider character active if we have a class set (either from activeCharacter or currentClass)
    hasActiveCharacter: !!activeCharacter || !!characterClass,
    hasClassSpells: classSpells.length > 0,
    categoryCount: spellCategories.length,
    totalSpellCount: getAllSpells().length
  };
};
