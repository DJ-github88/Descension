import React, { useEffect, useState } from 'react';
import { v4 as generateUniqueId } from 'uuid';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from './context/CreatureWizardContext';
import { useCreatureLibrary, useCreatureLibraryDispatch, libraryActionCreators } from './context/CreatureLibraryContext';
import useCreatureStore from '../../store/creatureStore';
import Step1BasicInfo from './components/steps/Step1BasicInfo';
import Step2Statistics from './components/steps/Step2Statistics';
import Step3Abilities from './components/steps/Step3Abilities';
import Step4LootTable from './components/steps/Step4LootTable';
import Step5ShopConfiguration from './components/steps/Step5ShopConfiguration';
import ExternalCreaturePreview from './components/common/ExternalCreaturePreview';
import './styles/CreatureWizard.css';

import { normalizeDangerLevel, CREATURE_PRESETS } from '../books/BookTtrpgBlocks';

export const normalizeCreatureForWizard = (raw = {}) => {
  if (!raw) return null;

  const stats = raw.stats || {};
  const hp = typeof raw.hp === 'object' ? (raw.hp.max || raw.hp.current || 100) : (stats.maxHp || raw.hp || 100);
  const mana = typeof raw.mana === 'object' ? (raw.mana.max || raw.mana.current || 50) : (stats.maxMana || raw.mana || 50);
  const ap = typeof raw.ap === 'number' ? raw.ap : (stats.maxActionPoints || raw.maxActionPoints || 3);
  const rawSpeed = raw.speed || stats.speed || 30;
  const speedNum = typeof rawSpeed === 'string' ? (parseInt(rawSpeed, 10) || 30) : (Number(rawSpeed) || 30);

  // Extract type & size from creatureType or type/size
  let rawTypeStr = String(raw.type || raw.creatureType || 'humanoid').toLowerCase();
  let size = (raw.size || 'medium').toLowerCase();
  const sizeMatches = rawTypeStr.match(/\b(tiny|small|medium|large|huge|gargantuan)\b/i);
  if (sizeMatches) {
    size = sizeMatches[1].toLowerCase();
    rawTypeStr = rawTypeStr.replace(/\b(tiny|small|medium|large|huge|gargantuan)\b/i, '').trim();
  }
  // Remove trailing commas/alignments e.g. "humanoid, neutral evil" -> "humanoid"
  const cleanType = rawTypeStr.split(/[,/]/)[0].trim() || 'humanoid';

  // Build abilities list from existing abilities, traits, and actions
  let abilities = [];
  if (Array.isArray(raw.abilities) && raw.abilities.length > 0) {
    abilities = raw.abilities.map((a) => ({
      id: a.id || generateUniqueId(),
      name: a.name || a.title || 'Ability',
      type: a.type || 'melee',
      description: a.description || a.desc || '',
      actionPointCost: typeof a.actionPointCost === 'number' ? a.actionPointCost : (typeof a.cost === 'number' ? a.cost : 1),
      manaCost: Number(a.manaCost) || 0,
      damage: a.damage || { diceCount: 1, diceType: 6, bonus: 0, damageType: 'smashing' },
      range: Number(a.range) || 5,
      cooldown: Number(a.cooldown) || 0,
      effects: Array.isArray(a.effects) ? a.effects : []
    }));
  } else {
    if (Array.isArray(raw.traits)) {
      raw.traits.forEach((t) => {
        abilities.push({
          id: generateUniqueId(),
          name: t.name || 'Passive Trait',
          type: 'special',
          description: t.desc || t.description || '',
          actionPointCost: 0,
          manaCost: 0,
          damage: { diceCount: 0, diceType: 0, bonus: 0, damageType: 'none' },
          range: 0,
          cooldown: 0,
          effects: []
        });
      });
    }
    if (Array.isArray(raw.actions)) {
      raw.actions.forEach((a) => {
        const nameStr = a.name || 'Action';
        const apMatch = nameStr.match(/\((\d+)\s*AP/i);
        const apCost = apMatch ? parseInt(apMatch[1], 10) : 1;
        const cleanName = nameStr.replace(/\s*\([^)]*\)/i, '').trim() || nameStr;
        abilities.push({
          id: generateUniqueId(),
          name: cleanName,
          type: 'melee',
          description: a.desc || a.description || '',
          actionPointCost: apCost,
          manaCost: 0,
          damage: { diceCount: 1, diceType: 8, bonus: 2, damageType: 'physical' },
          range: 5,
          cooldown: 0,
          effects: []
        });
      });
    }
  }

  const tokenIcon = raw.tokenIcon || raw.icon || raw.illustration || raw.image || 'inv_misc_questionmark';
  const customImg = raw.customTokenImage || (raw.illustration || (raw.image && raw.image.startsWith('http') ? raw.image : null));

  return {
    id: raw.id || generateUniqueId(),
    name: raw.name || raw.title || 'Unnamed Creature',
    description: raw.description || raw.desc || raw.lore || '',
    type: cleanType,
    size: size || 'medium',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    tokenIcon,
    tokenBorder: raw.tokenBorder || '#d4af37',
    customTokenImage: customImg || null,
    imageTransformations: raw.imageTransformations || null,
    role: raw.role || '',
    dangerLevel: normalizeDangerLevel(raw.dangerLevel || raw.danger || raw.challenge, raw.cr),
    region: raw.region || '',
    habitat: raw.habitat || '',
    origin: raw.origin || '',
    heritage: raw.heritage || '',
    nature: raw.nature || '',
    depth: raw.depth || '',
    loreClassification: raw.loreClassification || {},
    loreCanon: raw.loreCanon || {},
    loreNote: raw.loreNote || '',
    folkloreInspiration: raw.folkloreInspiration || null,
    illustration: raw.illustration || (raw.image && raw.image.startsWith('http') ? raw.image : null),
    illustrationCaption: raw.illustrationCaption || '',
    stats: {
      strength: Number(stats.strength ?? raw.strength ?? 10) || 10,
      agility: Number(stats.agility ?? raw.agility ?? 10) || 10,
      constitution: Number(stats.constitution ?? raw.constitution ?? 10) || 10,
      intelligence: Number(stats.intelligence ?? raw.intelligence ?? 10) || 10,
      spirit: Number(stats.spirit ?? raw.spirit ?? 10) || 10,
      charisma: Number(stats.charisma ?? raw.charisma ?? 10) || 10,
      maxHp: Number(hp) || 100,
      currentHp: Number(hp) || 100,
      maxMana: Number(mana) || 50,
      currentMana: Number(mana) || 50,
      maxActionPoints: Number(ap) || 3,
      currentActionPoints: Number(ap) || 3,
      armor: Number(stats.armor ?? raw.armorClass ?? raw.armor ?? 15) || 15,
      initiative: Number(stats.initiative ?? 2) || 2,
      speed: Number(speedNum) || 30
    },
    resistances: raw.resistances || {},
    vulnerabilities: raw.vulnerabilities || {},
    abilities,
    tactics: raw.tactics || {
      combatStyle: 'balanced',
      targetPriority: 'balanced',
      abilityUsage: 'strategic',
      retreatThreshold: 30,
      notes: ''
    },
    lootTable: raw.lootTable || {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 0, max: 0 },
        silver: { min: 0, max: 0 },
        copper: { min: 0, max: 0 }
      },
      items: []
    },
    isShopkeeper: Boolean(raw.isShopkeeper),
    shopInventory: raw.shopInventory || {
      shopName: '',
      shopDescription: '',
      restockOnLongRest: false,
      buyRates: {
        default: 50,
        categories: {
          weapon: 50,
          armor: 50,
          consumable: 50,
          accessory: 50,
          container: 50,
          miscellaneous: 50
        }
      },
      items: []
    }
  };
};

const CreatureWizardApp = ({
  editMode = false,
  creatureId = null,
  initialCreature = null,
  onSave,
  onCancel,
  activeView = 'wizard'
}) => {
  const wizardState = useCreatureWizard();
  const wizardDispatch = useCreatureWizardDispatch();
  const library = useCreatureLibrary();
  const libraryDispatch = useCreatureLibraryDispatch();
  const creatureStore = useCreatureStore();
  const { windowSize } = useCreatureStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Window-size-aware layout class.
  // IMPORTANT: the creature wizard lives inside a resizable window, so viewport media queries
  // don't react when the window is resized. We use the creature window's width instead.
  const creatureWindowWidth = windowSize?.width || (activeView === 'community' ? 1100 : 900);
  const wizardSizeClass =
    creatureWindowWidth <= 650 ? 'cw-size-xs' :
    creatureWindowWidth <= 800 ? 'cw-size-sm' :
    creatureWindowWidth <= 950 ? 'cw-size-md' :
    'cw-size-lg';

  // Load creature data when editing or when initialCreature is provided
  const loadedRef = React.useRef(null);

  useEffect(() => {
    if (initialCreature && (initialCreature.name || initialCreature.id)) {
      const initKey = `init_${initialCreature.id || initialCreature.name}`;
      if (loadedRef.current !== initKey) {
        loadedRef.current = initKey;
        console.log('Loading initialCreature for wizard:', initialCreature.name);
        const normalized = normalizeCreatureForWizard(initialCreature);
        wizardDispatch(wizardActionCreators.loadCreature(normalized));
        wizardDispatch(wizardActionCreators.setEditMode(true));
      }
      return;
    }

    if (editMode && creatureId) {
      const editKey = `edit_${creatureId}`;
      if (loadedRef.current !== editKey) {
        console.log('Loading creature for editing:', creatureId);

        // Find the creature in library, customCreatures, or presets
        let creatureToEdit = (library.creatures || []).find((c) => c.id === creatureId);
        if (!creatureToEdit) {
          const storeCreatures = creatureStore.creatures || creatureStore.customCreatures || [];
          creatureToEdit = storeCreatures.find((c) => c.id === creatureId);
        }
        if (!creatureToEdit) {
          creatureToEdit = CREATURE_PRESETS.find(
            (c) => c.id === creatureId || (c.name && c.name.toLowerCase() === String(creatureId).toLowerCase())
          );
        }

        if (creatureToEdit) {
          loadedRef.current = editKey;
          console.log('Found creature to edit:', creatureToEdit);
          const normalized = normalizeCreatureForWizard(creatureToEdit);
          wizardDispatch(wizardActionCreators.loadCreature(normalized));
          wizardDispatch(wizardActionCreators.setEditMode(true));
        }
      }
    } else if (!editMode && !initialCreature) {
      if (loadedRef.current !== '__new__') {
        loadedRef.current = '__new__';
        wizardDispatch(wizardActionCreators.resetWizard());
        wizardDispatch(wizardActionCreators.setEditMode(false));
      }
    }
  }, [editMode, creatureId, initialCreature, library.creatures]);

  // Handle next step button click
  const handleNextStep = () => {
    wizardDispatch(wizardActionCreators.nextStep());
  };

  // Handle previous step button click
  const handlePrevStep = () => {
    wizardDispatch(wizardActionCreators.prevStep());
  };

  // Handle save button click
  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      // Prepare creature data
      const creatureData = {
        name: wizardState.name,
        description: wizardState.description,
        type: wizardState.type,
        size: wizardState.size,
        tags: wizardState.tags,
        tokenIcon: wizardState.tokenIcon,
        tokenBorder: wizardState.tokenBorder,
        customTokenImage: wizardState.customTokenImage || null,
        imageTransformations: wizardState.imageTransformations || null,
        stats: wizardState.stats,
        resistances: wizardState.resistances,
        vulnerabilities: wizardState.vulnerabilities,
        abilities: wizardState.abilities,
        tactics: wizardState.tactics,
        lootTable: wizardState.lootTable,
        isShopkeeper: wizardState.isShopkeeper || false,
        shopInventory: wizardState.shopInventory || null,

        // Lore and Worldbuilding fields
        role: wizardState.role || '',
        dangerLevel: wizardState.dangerLevel || 'Medium',
        region: wizardState.region || '',
        habitat: wizardState.habitat || '',
        origin: wizardState.origin || '',
        heritage: wizardState.heritage || '',
        nature: wizardState.nature || '',
        depth: wizardState.depth || '',
        loreClassification: wizardState.loreClassification || {},
        loreCanon: wizardState.loreCanon || {},
        loreNote: wizardState.loreNote || '',
        folkloreInspiration: wizardState.folkloreInspiration || null,
        illustration: wizardState.illustration || null,
        illustrationCaption: wizardState.illustrationCaption || ''
      };

      let finalSavedCreature = null;

      if (editMode || wizardState.originalCreatureId || creatureId) {
        const targetId = wizardState.originalCreatureId || creatureId || generateUniqueId();
        finalSavedCreature = {
          ...creatureData,
          id: targetId,
          lastModified: new Date().toISOString()
        };

        // 1. Update library context
        libraryDispatch(libraryActionCreators.updateCreature(targetId, finalSavedCreature));

        // 2. Update library array + all placed grid tokens in one synchronous call
        creatureStore.updateCreature(targetId, finalSavedCreature);

        // 3. Persist to Firebase (if user is logged in and not a guest)
        try {
          const useAuthStore = (await import('../../store/authStore')).default;
          const { user } = useAuthStore.getState();
          if (user?.uid && !user?.isGuest) {
            const { updateUserCreature } = await import('../../services/firebase/userCreaturesService');
            await updateUserCreature(user.uid, targetId, finalSavedCreature);
            console.log('✅ Creature updated in Firebase:', targetId);
          }
        } catch (fbErr) {
          console.warn('⚠️ Could not persist creature update to Firebase (local save succeeded):', fbErr);
        }

        console.log('Updated creature:', targetId);
      } else {
        // Generate a unique ID for the new creature
        const newCreatureId = generateUniqueId();
        finalSavedCreature = {
          ...creatureData,
          id: newCreatureId,
          dateCreated: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };

        // 1. Add to library context
        libraryDispatch(libraryActionCreators.addCreature(finalSavedCreature));

        // 2. Add to creature store (makes it immediately available for token placement)
        console.log('🔄 Adding new creature to store:', finalSavedCreature.name, finalSavedCreature.id);
        creatureStore.addCreature(finalSavedCreature);

        // 3. Persist to Firebase (if user is logged in and not a guest)
        try {
          const useAuthStore = (await import('../../store/authStore')).default;
          const { user } = useAuthStore.getState();
          if (user?.uid && !user?.isGuest) {
            const { saveUserCreature } = await import('../../services/firebase/userCreaturesService');
            await saveUserCreature(user.uid, finalSavedCreature);
            console.log('✅ New creature saved to Firebase:', finalSavedCreature.id);
          }
        } catch (fbErr) {
          console.warn('⚠️ Could not persist new creature to Firebase (local save succeeded):', fbErr);
        }

        console.log('Added new creature to library:', creatureData.name);
      }

      // Reset wizard and call onSave callback with saved creature object
      wizardDispatch(wizardActionCreators.resetWizard());
      if (onSave) {
        onSave(finalSavedCreature);
      }
    } catch (error) {
      console.error('Error saving creature:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Handle cancel button click
  const handleCancel = () => {
    wizardDispatch(wizardActionCreators.resetWizard());
    if (onCancel) {
      onCancel();
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (wizardState.currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Statistics />;
      case 3:
        return <Step3Abilities />;
      case 4:
        return <Step4LootTable />;
      case 5:
        return <Step5ShopConfiguration />;
      default:
        return <Step1BasicInfo />;
    }
  };

  // Helper function to get step status
  const getStepStatus = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    if (stepNumber === wizardState.currentStep) return 'active';
    if (stepNumber < wizardState.currentStep) return 'completed';
    return 'pending';
  };

  // Step names array for easier management
  const stepNames = [
    { name: 'Basic Info', description: 'Define creature identity and appearance' },
    { name: 'Statistics', description: 'Set creature stats and abilities' },
    { name: 'Abilities', description: 'Configure special abilities and powers' },
    { name: 'Loot Table', description: 'Set up treasure and rewards' },
    { name: 'Shop Config', description: 'Configure merchant settings' }
  ];

  return (
    <>
      <div className={`creature-wizard-layout ${wizardSizeClass}`}>
        {/* Step Navigation Header (persistent at top) */}
        <div className="creature-wizard-header">
          {/* Back button or placeholder if needed */}
          <div className="header-left-actions">
             {/* Can add a 'back' or 'cancel' here if desired */}
          </div>

          <div className="wizard-step-rail">
            {stepNames.map((step, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`wizard-step-indicator ${getStepStatus(index)}`}
                  onClick={() => wizardDispatch(wizardActionCreators.goToStep(index + 1))}
                  title={step.description}
                >
                  <div className="step-point">
                    <span className="step-num">{index + 1}</span>
                  </div>
                  <div className="step-label-container">
                    <span className="step-nav-name">{step.name}</span>
                  </div>
                </div>
                {index < stepNames.length - 1 && (
                  <div className={`wizard-step-connector ${index + 1 < wizardState.currentStep ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Navigation Buttons in Header */}
          <div className="header-right-actions">
            {wizardState.currentStep < wizardState.totalSteps ? (
              <button
                className="creature-wizard-button primary"
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                Next Step <i className="fas fa-arrow-right"></i>
              </button>
            ) : (
              <button
                className="creature-wizard-button primary"
                onClick={handleSave}
                disabled={isSubmitting || !wizardState.isValid}
              >
                {isSubmitting ? 'Saving...' : 'Save Creature'} <i className="fas fa-check"></i>
              </button>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="creature-wizard-main-content">
          {renderStep()}
        </div>
      </div>

      {/* External Creature Preview - Live preview to the right of wizard */}
      <ExternalCreaturePreview
        creatureData={wizardState}
        isOpen={true}
        activeView={activeView}
      />

    </>
  );
};

export default CreatureWizardApp;
