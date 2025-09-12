/**
 * Spell System Validator
 * 
 * Utility functions to validate the spell system implementation
 */

import { ALL_CLASS_SPELLS } from '../data/classSpellGenerator';
import { CLASS_SPECIALIZATIONS, getAllClassNames } from '../data/classSpellCategories';

/**
 * Validate that all classes have the expected number of spells
 */
export const validateClassSpellCounts = () => {
  const results = {
    success: true,
    errors: [],
    summary: {}
  };

  const allClasses = getAllClassNames();
  const expectedSpellsPerClass = 9; // 3 specializations × 3 spells each
  
  allClasses.forEach(className => {
    const classSpells = ALL_CLASS_SPELLS[className] || [];
    results.summary[className] = classSpells.length;
    
    if (classSpells.length !== expectedSpellsPerClass) {
      results.success = false;
      results.errors.push(`${className} has ${classSpells.length} spells, expected ${expectedSpellsPerClass}`);
    }
  });

  return results;
};

/**
 * Validate that all classes have proper specialization data
 */
export const validateSpecializations = () => {
  const results = {
    success: true,
    errors: [],
    summary: {}
  };

  const allClasses = getAllClassNames();
  
  allClasses.forEach(className => {
    const classData = CLASS_SPECIALIZATIONS[className];
    
    if (!classData) {
      results.success = false;
      results.errors.push(`No specialization data found for ${className}`);
      return;
    }

    if (!classData.specializations || classData.specializations.length !== 3) {
      results.success = false;
      results.errors.push(`${className} should have exactly 3 specializations, has ${classData.specializations?.length || 0}`);
      return;
    }

    results.summary[className] = {
      path: classData.path,
      specializationCount: classData.specializations.length,
      specializations: classData.specializations.map(spec => spec.name)
    };
  });

  return results;
};

/**
 * Validate spell data structure
 */
export const validateSpellStructure = () => {
  const results = {
    success: true,
    errors: [],
    summary: {
      totalSpells: 0,
      validSpells: 0,
      invalidSpells: []
    }
  };

  Object.entries(ALL_CLASS_SPELLS).forEach(([className, spells]) => {
    spells.forEach(spell => {
      results.summary.totalSpells++;

      // Check required fields
      const requiredFields = ['id', 'name', 'description', 'className', 'specialization', 'source'];
      const missingFields = requiredFields.filter(field => !spell[field]);

      if (missingFields.length > 0) {
        results.success = false;
        results.errors.push(`Spell "${spell.name || 'unnamed'}" in ${className} missing fields: ${missingFields.join(', ')}`);
        results.summary.invalidSpells.push({
          className,
          spellName: spell.name || 'unnamed',
          missingFields
        });
      } else {
        results.summary.validSpells++;
      }

      // Validate spell belongs to correct class
      if (spell.className !== className) {
        results.success = false;
        results.errors.push(`Spell "${spell.name}" has className "${spell.className}" but is in ${className} array`);
      }

      // Validate specialization exists for the class
      const classData = CLASS_SPECIALIZATIONS[className];
      if (classData) {
        const validSpecializations = classData.specializations.map(spec => spec.id);
        if (!validSpecializations.includes(spell.specialization)) {
          results.success = false;
          results.errors.push(`Spell "${spell.name}" has invalid specialization "${spell.specialization}" for ${className}`);
        }
      }
    });
  });

  return results;
};

/**
 * Run all validations
 */
export const validateSpellSystem = () => {
  console.log('🧪 Running Spell System Validation...');

  const spellCountValidation = validateClassSpellCounts();
  const specializationValidation = validateSpecializations();
  const spellStructureValidation = validateSpellStructure();

  const overallResults = {
    success: spellCountValidation.success && specializationValidation.success && spellStructureValidation.success,
    validations: {
      spellCounts: spellCountValidation,
      specializations: specializationValidation,
      spellStructure: spellStructureValidation
    },
    summary: {
      totalClasses: getAllClassNames().length,
      totalSpells: spellStructureValidation.summary.totalSpells,
      validSpells: spellStructureValidation.summary.validSpells,
      totalErrors: [
        ...spellCountValidation.errors,
        ...specializationValidation.errors,
        ...spellStructureValidation.errors
      ].length
    }
  };

  // Log results
  if (overallResults.success) {
    console.log('✅ Spell System Validation PASSED');
    console.log(`📊 Summary: ${overallResults.summary.totalClasses} classes, ${overallResults.summary.totalSpells} spells`);
  } else {
    console.log('❌ Spell System Validation FAILED');
    console.log(`📊 Summary: ${overallResults.summary.totalErrors} errors found`);
    
    // Log all errors
    [
      ...spellCountValidation.errors,
      ...specializationValidation.errors,
      ...spellStructureValidation.errors
    ].forEach(error => {
      console.error(`  - ${error}`);
    });
  }

  return overallResults;
};

/**
 * Quick validation for development
 */
export const quickValidate = () => {
  const results = validateSpellSystem();
  
  if (results.success) {
    return `✅ Spell system valid: ${results.summary.totalClasses} classes, ${results.summary.totalSpells} spells`;
  } else {
    return `❌ Spell system has ${results.summary.totalErrors} errors`;
  }
};

// Auto-run validation in development
if (process.env.NODE_ENV === 'development') {
  // Delay to ensure all modules are loaded
  setTimeout(() => {
    validateSpellSystem();
  }, 1000);
}
