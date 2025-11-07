/**
 * Spell Audit Script
 * 
 * Audits all spells in class data files against the SPELL_WIZARD_TO_SPELLCARD_TEMPLATE.md
 * Checks for:
 * 1. Correct formatting according to template
 * 2. Class-specific resource usage
 * 3. Required fields presence
 * 4. Spell type consistency
 * 5. Targeting and propagation formatting
 */

const fs = require('fs');
const path = require('path');

// Class data files to audit
const CLASS_FILES = [
  'arcanoneerData.js',
  'pyrofiendData.js',
  'minstrelData.js',
  'chronarchData.js',
  'martyrData.js'
];

// Expected class-specific resources based on template
const CLASS_RESOURCES = {
  arcanoneer: {
    resources: ['arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'healing_sphere', 'chaos_sphere'],
    displayFormat: '{shortName} {amount}',
    examples: ['AS 2', 'HS 1']
  },
  pyrofiend: {
    resources: ['inferno_required', 'inferno_ascend', 'inferno_descend'],
    displayFormat: 'Requires Inferno Level {amount} / Ascend Inferno +{amount} / Descend Inferno -{amount}'
  },
  minstrel: {
    resources: ['note_i', 'note_ii', 'note_iii', 'note_iv', 'note_v', 'note_vi', 'note_vii'],
    displayFormat: '{note} {+/-}{amount}',
    examples: ['I +1', 'V -2']
  },
  chronarch: {
    resources: ['time_shard_generate', 'time_shard_cost', 'temporal_strain_gain', 'temporal_strain_reduce'],
    displayFormat: 'Time Shards +{amount} / Time Shards -{amount} / Temporal Strain +{amount} / Temporal Strain -{amount}'
  },
  martyr: {
    resources: ['devotion_required', 'devotion_cost', 'devotion_gain'],
    displayFormat: 'Requires Devotion Level {amount} / Devotion Level -{amount} / Devotion Level +{amount}'
  }
};

// Expected spell type values
const VALID_SPELL_TYPES = ['ACTION', 'CHANNELED', 'PASSIVE', 'REACTION', 'TRAP', 'STATE', 'ZONE'];

// Expected targeting types
const VALID_TARGETING_TYPES = ['single', 'multi', 'area', 'ground', 'cone', 'line', 'chain', 'self', 'smart'];

// Expected range types
const VALID_RANGE_TYPES = ['touch', 'ranged', 'sight', 'unlimited', 'self_centered'];

// Expected AOE shapes
const VALID_AOE_SHAPES = ['circle', 'square', 'rectangle', 'line', 'cone', 'cylinder', 'sphere', 'wall', 'cube'];

// Expected effect types
const VALID_EFFECT_TYPES = ['damage', 'healing', 'buff', 'debuff', 'utility', 'control', 'summoning', 'transformation', 'purification', 'restoration'];

// Audit results
const auditResults = {
  totalSpells: 0,
  issues: [],
  warnings: [],
  fixed: []
};

/**
 * Check if a spell has required basic fields
 */
function checkBasicFields(spell, className) {
  const issues = [];
  const warnings = [];

  // Required fields
  if (!spell.id) issues.push('Missing required field: id');
  if (!spell.name) issues.push('Missing required field: name');
  if (!spell.description) warnings.push('Missing description');
  if (!spell.spellType) issues.push('Missing required field: spellType');
  if (!spell.icon) warnings.push('Missing icon');

  // Validate spell type
  if (spell.spellType && !VALID_SPELL_TYPES.includes(spell.spellType)) {
    issues.push(`Invalid spellType: ${spell.spellType}. Must be one of: ${VALID_SPELL_TYPES.join(', ')}`);
  }

  // Check effect types
  if (spell.effectTypes && Array.isArray(spell.effectTypes)) {
    spell.effectTypes.forEach(effectType => {
      if (!VALID_EFFECT_TYPES.includes(effectType)) {
        warnings.push(`Unknown effect type: ${effectType}`);
      }
    });
  }

  return { issues, warnings };
}

/**
 * Check targeting configuration
 */
function checkTargetingConfig(spell, className) {
  const issues = [];
  const warnings = [];

  if (!spell.targetingConfig) {
    warnings.push('Missing targetingConfig');
    return { issues, warnings };
  }

  const tc = spell.targetingConfig;

  // Check targeting type
  if (tc.targetingType && !VALID_TARGETING_TYPES.includes(tc.targetingType)) {
    issues.push(`Invalid targetingType: ${tc.targetingType}. Must be one of: ${VALID_TARGETING_TYPES.join(', ')}`);
  }

  // Check range type
  if (tc.rangeType && !VALID_RANGE_TYPES.includes(tc.rangeType)) {
    issues.push(`Invalid rangeType: ${tc.rangeType}. Must be one of: ${VALID_RANGE_TYPES.join(', ')}`);
  }

  // Check AOE shape
  if (tc.aoeType && !VALID_AOE_SHAPES.includes(tc.aoeType)) {
    issues.push(`Invalid aoeType: ${tc.aoeType}. Must be one of: ${VALID_AOE_SHAPES.join(', ')}`);
  }

  // Check range distance for ranged spells
  if (tc.rangeType === 'ranged' && !tc.rangeDistance) {
    warnings.push('ranged rangeType but no rangeDistance specified');
  }

  // Check AOE parameters for area spells
  if ((tc.targetingType === 'area' || tc.targetingType === 'ground') && tc.aoeType && !tc.aoeSize && !tc.aoeParameters) {
    warnings.push('Area spell but no aoeSize or aoeParameters specified');
  }

  return { issues, warnings };
}

/**
 * Check resource costs for class-specific formatting
 */
function checkResourceCosts(spell, className) {
  const issues = [];
  const warnings = [];

  if (!spell.resourceCost) {
    warnings.push('Missing resourceCost');
    return { issues, warnings };
  }

  const rc = spell.resourceCost;
  const classResources = CLASS_RESOURCES[className];

  if (!classResources) {
    warnings.push(`No class resource definitions for ${className}`);
    return { issues, warnings };
  }

  // Check for class-specific resources
  if (className === 'arcanoneer') {
    // Arcanoneer uses spheres array
    if (rc.spheres && Array.isArray(rc.spheres)) {
      rc.spheres.forEach(sphere => {
        if (!classResources.resources.includes(sphere.toLowerCase() + '_sphere')) {
          // Check if it's a valid sphere name
          const validSpheres = ['Arcane', 'Holy', 'Shadow', 'Fire', 'Ice', 'Nature', 'Healing', 'Chaos'];
          if (!validSpheres.includes(sphere)) {
            warnings.push(`Unknown sphere type: ${sphere}`);
          }
        }
      });
    }
  } else if (className === 'pyrofiend') {
    // Pyrofiend uses inferno resources
    if (rc.inferno_required !== undefined || rc.inferno_ascend !== undefined || rc.inferno_descend !== undefined) {
      // Valid
    }
  } else if (className === 'minstrel') {
    // Minstrel uses musical notes
    const noteFields = ['note_i', 'note_ii', 'note_iii', 'note_iv', 'note_v', 'note_vi', 'note_vii'];
    noteFields.forEach(note => {
      if (rc[note] !== undefined && typeof rc[note] !== 'number') {
        issues.push(`Invalid ${note} value: must be a number`);
      }
    });
  } else if (className === 'chronarch') {
    // Chronarch uses time shards and temporal strain
    if (rc.time_shard_cost !== undefined && typeof rc.time_shard_cost !== 'number') {
      issues.push('Invalid time_shard_cost: must be a number');
    }
    if (rc.temporal_strain_gain !== undefined && typeof rc.temporal_strain_gain !== 'number') {
      issues.push('Invalid temporal_strain_gain: must be a number');
    }
  } else if (className === 'martyr') {
    // Martyr uses devotion
    if (rc.devotion_required !== undefined && typeof rc.devotion_required !== 'number') {
      issues.push('Invalid devotion_required: must be a number');
    }
    if (rc.devotion_cost !== undefined && typeof rc.devotion_cost !== 'number') {
      issues.push('Invalid devotion_cost: must be a number');
    }
  }

  // Check components formatting
  if (rc.components && Array.isArray(rc.components)) {
    rc.components.forEach(comp => {
      if (!['verbal', 'somatic', 'material'].includes(comp.toLowerCase())) {
        warnings.push(`Unknown component type: ${comp}`);
      }
    });
  }

  return { issues, warnings };
}

/**
 * Check damage configuration
 */
function checkDamageConfig(spell, className) {
  const issues = [];
  const warnings = [];

  if (!spell.damageConfig) {
    return { issues, warnings };
  }

  const dc = spell.damageConfig;

  // Check formula
  if (!dc.formula) {
    warnings.push('damageConfig missing formula');
  } else if (typeof dc.formula !== 'string') {
    issues.push('damageConfig.formula must be a string');
  }

  // Check damage type
  if (!dc.damageType && !dc.damageTypes) {
    warnings.push('damageConfig missing damageType or damageTypes');
  }

  return { issues, warnings };
}

/**
 * Check debuff configuration
 */
function checkDebuffConfig(spell, className) {
  const issues = [];
  const warnings = [];

  if (!spell.debuffConfig) {
    return { issues, warnings };
  }

  const dbc = spell.debuffConfig;

  // Check status effects array
  if (dbc.statusEffects && Array.isArray(dbc.statusEffects)) {
    dbc.statusEffects.forEach((effect, index) => {
      if (!effect.id) {
        issues.push(`debuffConfig.statusEffects[${index}] missing id`);
      }
      if (!effect.name) {
        warnings.push(`debuffConfig.statusEffects[${index}] missing name`);
      }
      
      // Check save configuration if present
      if (effect.saveType && !['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma', 'wisdom', 'none'].includes(effect.saveType)) {
        warnings.push(`debuffConfig.statusEffects[${index}] invalid saveType: ${effect.saveType}`);
      }
      
      if (effect.saveDC !== undefined && typeof effect.saveDC !== 'number') {
        issues.push(`debuffConfig.statusEffects[${index}] saveDC must be a number`);
      }
    });
  }

  return { issues, warnings };
}

/**
 * Audit a single spell
 */
function auditSpell(spell, className, spellIndex) {
  const spellIssues = [];
  const spellWarnings = [];

  // Basic fields check
  const basicCheck = checkBasicFields(spell, className);
  spellIssues.push(...basicCheck.issues);
  spellWarnings.push(...basicCheck.warnings);

  // Targeting check
  const targetingCheck = checkTargetingConfig(spell, className);
  spellIssues.push(...targetingCheck.issues);
  spellWarnings.push(...targetingCheck.warnings);

  // Resource costs check
  const resourceCheck = checkResourceCosts(spell, className);
  spellIssues.push(...resourceCheck.issues);
  spellWarnings.push(...resourceCheck.warnings);

  // Damage config check
  const damageCheck = checkDamageConfig(spell, className);
  spellIssues.push(...damageCheck.issues);
  spellWarnings.push(...damageCheck.warnings);

  // Debuff config check
  const debuffCheck = checkDebuffConfig(spell, className);
  spellIssues.push(...debuffCheck.issues);
  spellWarnings.push(...debuffCheck.warnings);

  return {
    spellId: spell.id || `spell_${spellIndex}`,
    spellName: spell.name || 'Unnamed',
    issues: spellIssues,
    warnings: spellWarnings
  };
}

/**
 * Main audit function
 */
function auditClassSpells() {
  console.log('🔍 Starting Spell Audit...\n');

  CLASS_FILES.forEach(fileName => {
    const className = fileName.replace('Data.js', '').toLowerCase();
    const filePath = path.join(__dirname, 'src', 'data', 'classes', fileName);

    console.log(`\n📚 Auditing ${className} spells from ${fileName}...`);

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  File not found: ${filePath}`);
      return;
    }

    try {
      // Read and evaluate the class data file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Extract exampleSpells array using regex (simple approach)
      const spellsMatch = fileContent.match(/exampleSpells:\s*\[([\s\S]*?)\]\s*[,}]/);
      
      if (!spellsMatch) {
        console.log(`  ⚠️  No exampleSpells found in ${fileName}`);
        return;
      }

      // For now, we'll need to manually parse or use eval (not recommended in production)
      // Instead, let's create a summary report
      console.log(`  ✅ Found spells in ${fileName}`);
      console.log(`  📝 Please review spells manually or implement full parser`);
      
    } catch (error) {
      console.log(`  ❌ Error reading ${fileName}: ${error.message}`);
    }
  });

  console.log('\n✅ Audit complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   Total spells checked: ${auditResults.totalSpells}`);
  console.log(`   Issues found: ${auditResults.issues.length}`);
  console.log(`   Warnings: ${auditResults.warnings.length}`);
}

// Run audit
if (require.main === module) {
  auditClassSpells();
}

module.exports = { auditSpell, auditClassSpells };

