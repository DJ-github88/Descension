/**
 * Validate All Spells Script
 *
 * Run this script to validate all spells in the system and identify issues.
 *
 * Usage: node validate-all-spells.mjs
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the validator
import validator from './src/utils/spellDataValidator.mjs';
const { validateSpells, printValidationReport, getSuggestedFixes } = validator;

async function validateAllSpells() {
  console.log('Loading spell data...\n');

  try {

    // Import all spell data files
    const spellLibraryData = await import('./src/data/spellLibraryData.js').catch(() => ({ LIBRARY_SPELLS: [] }));
    const enhancedSpellLibrary = await import('./src/data/enhancedSpellLibrary.js').catch(() => ({ ENHANCED_SPELL_LIBRARY: [] }));
    const generalSpellsData = await import('./src/data/generalSpellsData.js').catch(() => ({ GENERAL_SPELLS: [] }));
    const classSpellTemplates = await import('./src/data/classSpellTemplates.js').catch(() => ({ CLASS_SPELL_TEMPLATES: {} }));
    const backgroundAbilities = await import('./src/data/backgroundAbilities.js').catch(() => ({ BACKGROUND_ABILITIES: {} }));
    const enhancedBackgroundData = await import('./src/data/enhancedBackgroundData.js').catch(() => ({ ENHANCED_BACKGROUNDS: {} }));

    // Collect all spells
    const allSpells = [];

    // Add spells from spell library
    if (spellLibraryData.LIBRARY_SPELLS) {
      allSpells.push(...spellLibraryData.LIBRARY_SPELLS);
      console.log(`Loaded ${spellLibraryData.LIBRARY_SPELLS.length} spells from spellLibraryData`);
    }

    // Add spells from enhanced spell library
    if (enhancedSpellLibrary.ENHANCED_SPELL_LIBRARY) {
      allSpells.push(...enhancedSpellLibrary.ENHANCED_SPELL_LIBRARY);
      console.log(`Loaded ${enhancedSpellLibrary.ENHANCED_SPELL_LIBRARY.length} spells from enhancedSpellLibrary`);
    }

    // Add general spells
    if (generalSpellsData.GENERAL_SPELLS) {
      allSpells.push(...generalSpellsData.GENERAL_SPELLS);
      console.log(`Loaded ${generalSpellsData.GENERAL_SPELLS.length} spells from generalSpellsData`);
    }

    // Add class spell templates
    if (classSpellTemplates.CLASS_SPELL_TEMPLATES) {
      Object.values(classSpellTemplates.CLASS_SPELL_TEMPLATES).forEach(classSpells => {
        if (Array.isArray(classSpells)) {
          allSpells.push(...classSpells);
        } else if (typeof classSpells === 'object') {
          Object.values(classSpells).forEach(pathSpells => {
            if (Array.isArray(pathSpells)) {
              allSpells.push(...pathSpells);
            }
          });
        }
      });
      console.log(`Loaded class spell templates`);
    }

    // Convert background abilities to spell format for validation
    if (enhancedBackgroundData.ENHANCED_BACKGROUNDS) {
      Object.values(enhancedBackgroundData.ENHANCED_BACKGROUNDS).forEach(background => {
        if (background.subBackgrounds) {
          Object.values(background.subBackgrounds).forEach(subBg => {
            if (subBg.abilities && Array.isArray(subBg.abilities)) {
              // Convert abilities to spell-like format for validation
              const abilitySpells = subBg.abilities.map(ability => ({
                id: ability.id,
                name: ability.name,
                description: ability.description,
                icon: ability.icon,
                damageTypes: ability.effects?.damage?.type ? [ability.effects.damage.type] : [],
                damageConfig: ability.effects?.damage ? {
                  formula: ability.effects.damage.formula,
                  elementType: ability.effects.damage.type
                } : undefined,
                buffConfig: ability.effects?.buff ? {
                  statusEffects: ability.effects.buff.effects?.map(e => ({
                    name: e,
                    description: e
                  })) || []
                } : undefined,
                debuffConfig: ability.effects?.debuff ? {
                  statusEffects: ability.effects.debuff.effects?.map(e => ({
                    name: e,
                    description: e
                  })) || []
                } : undefined,
                source: `background:${background.id}:${subBg.id}`
              }));
              allSpells.push(...abilitySpells);
            }
          });
        }
      });
      console.log(`Loaded background abilities`);
    }

    console.log(`\nTotal spells to validate: ${allSpells.length}\n`);

    // Validate all spells
    const validationResult = validateSpells(allSpells);

    // Print report
    printValidationReport(validationResult);

    // Print suggested fixes for invalid spells
    if (validationResult.invalid > 0) {
      console.log('\n=== SUGGESTED FIXES ===\n');
      validationResult.invalidSpells.forEach(result => {
        const spell = allSpells.find(s => (s.name || s.id) === result.spellName);
        if (spell) {
          const fixes = getSuggestedFixes(spell, result.issues);
          if (fixes.length > 0) {
            console.log(`\n${result.spellName}:`);
            fixes.forEach(fix => {
              console.log(`  → ${fix}`);
            });
          }
        }
      });
      console.log('\n');
    }

    // Exit with error code if there are invalid spells
    if (validationResult.invalid > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('Error validating spells:', error);
    process.exit(1);
  }
}

// Run validation
validateAllSpells();

