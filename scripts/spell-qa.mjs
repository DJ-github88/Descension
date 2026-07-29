import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLASSES_DIR = path.join(__dirname, '..', 'vtt-react', 'src', 'data', 'classes');

// 12 canonical damage types (per damage-type-canonical-vocabulary).
// Legacy aliases (physical, fire, force, etc.) are accepted but reported as "legacy".
const CANONICAL_DAMAGE_TYPES = [
  'smashing', 'stabbing', 'slicing',
  'ember', 'rime', 'storm',
  'primal', 'arcane', 'blight', 'wyrd', 'sacred', 'healing'
];

const LEGACY_DAMAGE_TYPE_ALIASES = [
  'physical', 'ranged', 'fire', 'frost', 'cold', 'lightning', 'thunder',
  'divine', 'radiant', 'holy', 'shadow', 'necrotic', 'void', 'poison',
  'acid', 'chaos', 'psychic', 'force', 'nature',
  'bludgeoning', 'piercing', 'slashing'  // legacy D&D stat-key aliases
];

const VALID_SPELL_TYPES = ['ACTION', 'CHANNELED', 'PASSIVE', 'REACTION', 'TRAP', 'STATE'];
// Note: 'UTILITY' is NOT in the enum. It was used by 2 Crusader spells; we migrated
// them to 'CHANNELED'. If a new class needs UTILITY, add it here and to
// SPELL_DATA_REFERENCE.md.

const NON_SPELL_ARRAYS = [
  'specializations', 'subraceVariants', 'features', 'abilities',
  'startingEquipment', 'proficiencies', 'phases', 'sections',
  'steps', 'choices', 'effectsLines', 'entries', 'tiers',
  'rows', 'tags', 'options', 'conditions'
];

/**
 * Extract spell objects from a class data file. Only counts objects inside
 * the `spells: [...]` array as spells. Specializations, subrace variants,
 * and other objects with `id:` fields are ignored.
 */
function extractSpellsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const spells = [];

  let currentSpell = null;
  let currentContext = null; // null | 'spells' | other
  let contextStack = []; // for nested arrays
  let braceDepth = 0;
  let inSpell = false;
  let spellObjectStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect when we enter a top-level or nested array context
    // Pattern: "spells: [" or "spells:[", or any other array name
    const arrayMatch = line.match(/^\s*(spells|features|abilities|specializations|subraceVariants|startingEquipment|proficiencies|phases|sections|steps|choices|effectsLines|entries|tiers|rows|tags|options|conditions)\s*:\s*[\[\{]/);
    if (arrayMatch) {
      contextStack.push({
        context: arrayMatch[1],
        line: i + 1
      });
      currentContext = arrayMatch[1];
    }

    // Detect the start of a spell object inside the spells context
    const idMatch = line.match(/^\s*id:\s*['"]([^'"]+)['"]/);
    if (idMatch && currentContext === 'spells' && !line.includes('statModifier') && !line.includes('stat:')) {
      if (currentSpell) {
        spells.push(currentSpell);
      }
      currentSpell = {
        id: idMatch[1],
        file: path.basename(filePath),
        startLine: i + 1,
        raw: '',
        hasSpellType: false,
        hasLevel: false,
        hasSchool: false,
        hasElementType: false,
        hasDamageTypes: false,
        hasActionPoints: false,
        damageTypes: [],
        elementType: null,
        school: null,
        spellType: null,
        level: null,
        description: null,
        actionPoints: null,
        rawFormulas: []
      };
      inSpell = true;
      braceDepth = 0;
    }

    if (currentSpell && inSpell) {
      currentSpell.raw += line + '\n';

      if (line.match(/\bspellType:\s*['"]?([A-Z]+)['"]?/)) {
        currentSpell.hasSpellType = true;
        const m = line.match(/spellType:\s*['"]?([A-Z]+)['"]?/);
        if (m) currentSpell.spellType = m[1];
      }
      if (line.match(/^\s*level:\s*(\d+)/)) {
        currentSpell.hasLevel = true;
        const m = line.match(/level:\s*(\d+)/);
        if (m) currentSpell.level = parseInt(m[1]);
      }
      if (line.match(/\bschool:\s*['"]([^'"]+)['"]/)) {
        currentSpell.hasSchool = true;
        const m = line.match(/\bschool:\s*['"]([^'"]+)['"]/);
        if (m) currentSpell.school = m[1];
      }
      if (line.match(/\belementType:\s*['"]([^'"]+)['"]/)) {
        currentSpell.hasElementType = true;
        const m = line.match(/\belementType:\s*['"]([^'"]+)['"]/);
        if (m) currentSpell.elementType = m[1];
      }
      if (line.match(/\bdamageTypes:\s*\[([^\]]*)\]/)) {
        currentSpell.hasDamageTypes = true;
        const m = line.match(/\bdamageTypes:\s*\[([^\]]*)\]/);
        if (m) {
          currentSpell.damageTypes = m[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
        }
      }
      if (line.match(/\bactionPoints:\s*(\d+)/)) {
        currentSpell.hasActionPoints = true;
        const m = line.match(/\bactionPoints:\s*(\d+)/);
        if (m) currentSpell.actionPoints = parseInt(m[1]);
      }
      if (!currentSpell.description && line.match(/\bdescription:\s*['"]([^'"]+)['"]/) && !line.includes('statModifier') && !line.includes('keyAbilities')) {
        // Only set description from the FIRST/outermost match. Nested description
        // fields (e.g., inside utilityConfig.selectedEffects) shouldn't overwrite.
        const m = line.match(/\bdescription:\s*['"]([^'"]+)['"]/);
        if (m) {
          currentSpell.description = m[1];
        }
      }

      const rawTokens = ['CARD_VALUE', 'HEADS_COUNT', 'FACE_CARD_COUNT', 'ALL_HEADS', 'LONGEST_STREAK', 'SAME_SUIT', 'DAMAGE_DEALT', 'HEALTH_SACIFICED', 'HEALTH_SACRIFICED', 'MANA_SPENT'];
      for (const token of rawTokens) {
        if (line.includes(token) && !line.trim().startsWith('//') && !line.includes('formula:') && !line.includes('cardConfig') && !line.includes('coinConfig')) {
          if (line.includes('description:') || line.includes('mechanicsText:')) {
            currentSpell.rawFormulas.push({ token, line: i + 1, text: line.trim() });
          }
        }
      }

      // No brace tracking — the next id: (or end of spells:[] context) closes the spell.
      // Brace tracking was too fragile due to the spell's opening { being on a separate
      // line from the id field, causing premature spell closes.
    }

    // Detect when we exit an array context (closing bracket at top level).
    // Only pop if the bracket type matches the current context's array type.
    // E.g., a `},` line only pops contexts that opened with `{` (like subraceVariants: {).
    // A `],` line only pops contexts that opened with `[` (like spells: [...).
    if (line.match(/^\s*[\]\}],?\s*$/) && contextStack.length > 0) {
      const currentContextType = contextStack[contextStack.length - 1].context;
      const lineClosesBracket = line.match(/^\s*([\]\}])(,?)\s*$/);
      if (lineClosesBracket) {
        const closingChar = lineClosesBracket[1];
        // Determine which contexts use which opening character
        const contextOpensWith = {
          'spells': '[', 'features': '[', 'abilities': '[', 'specializations': '{',
          'subraceVariants': '{', 'startingEquipment': '[', 'proficiencies': '{',
          'phases': '[', 'sections': '{', 'steps': '[', 'choices': '[',
          'effectsLines': '[', 'entries': '[', 'tiers': '[', 'rows': '[', 'tags': '[',
          'options': '[', 'conditions': '['
        };
        const expectedOpen = contextOpensWith[currentContextType] || '[';
        if (closingChar === expectedOpen || (closingChar === '}' && expectedOpen === '{')) {
          // Pop the current context
          if (currentContext === 'spells' && currentSpell) {
            spells.push(currentSpell);
            currentSpell = null;
            inSpell = false;
          }
          contextStack.pop();
          currentContext = contextStack.length > 0 ? contextStack[contextStack.length - 1].context : null;
        }
      }
    }
  }

  if (currentSpell) {
    spells.push(currentSpell);
  }

  return spells;
}

function validateSpells() {
  const issues = {
    missingLevel: [],
    missingSpellType: [],
    invalidSpellType: [],
    missingDamageType: [],
    legacyDamageTypes: [],   // NEW: warn instead of fail
    nonCanonicalDamageTypes: [],
    missingActionPoints: [],
    longDescriptions: [],
    rawFormulasInText: [],
  };

  const files = fs.readdirSync(CLASSES_DIR).filter(f => f.endsWith('Data.js') && f !== 'index.js' && f !== 'classDisplayData.js');

  for (const file of files) {
    const filePath = path.join(CLASSES_DIR, file);
    const spells = extractSpellsFromFile(filePath);

    for (const spell of spells) {
      if (!spell.hasLevel) {
        issues.missingLevel.push({ id: spell.id, file: spell.file });
      }

      if (!spell.hasSpellType) {
        issues.missingSpellType.push({ id: spell.id, file: spell.file });
      } else if (spell.spellType && !VALID_SPELL_TYPES.includes(spell.spellType)) {
        issues.invalidSpellType.push({ id: spell.id, file: spell.file, spellType: spell.spellType });
      }

      if (!spell.hasSchool && !spell.hasElementType && !spell.hasDamageTypes) {
        if (spell.spellType === 'ACTION' || spell.spellType === 'CHANNELED') {
          issues.missingDamageType.push({ id: spell.id, file: spell.file });
        }
      }

      if (spell.hasDamageTypes) {
        for (const dt of spell.damageTypes) {
          if (LEGACY_DAMAGE_TYPE_ALIASES.includes(dt)) {
            issues.legacyDamageTypes.push({ id: spell.id, file: spell.file, type: dt, field: 'damageTypes' });
          } else if (!CANONICAL_DAMAGE_TYPES.includes(dt) && !['direct', 'area', 'dot', 'hot', 'random', 'choice', 'all', 'any'].includes(dt)) {
            issues.nonCanonicalDamageTypes.push({ id: spell.id, file: spell.file, type: dt });
          }
        }
      }

      if (spell.elementType) {
        if (LEGACY_DAMAGE_TYPE_ALIASES.includes(spell.elementType)) {
          issues.legacyDamageTypes.push({ id: spell.id, file: spell.file, type: spell.elementType, field: 'elementType' });
        } else if (!CANONICAL_DAMAGE_TYPES.includes(spell.elementType)) {
          issues.nonCanonicalDamageTypes.push({ id: spell.id, file: spell.file, type: spell.elementType, field: 'elementType' });
        }
      }

      if (!spell.hasActionPoints && spell.hasSpellType && spell.spellType !== 'PASSIVE') {
        issues.missingActionPoints.push({ id: spell.id, file: spell.file });
      }

      if (spell.description && spell.description.length > 200) {
        issues.longDescriptions.push({ id: spell.id, file: spell.file, length: spell.description.length });
      }

      if (spell.rawFormulas.length > 0) {
        issues.rawFormulasInText.push({ id: spell.id, file: spell.file, formulas: spell.rawFormulas });
      }
    }
  }

  return issues;
}

const issues = validateSpells();

console.log('=== SPELL QA REPORT ===');
console.log('(Context-aware: only counts objects inside `spells: [...]` arrays)');
console.log('');

const categories = [
  ['missingLevel', 'Missing Level', 'Spells without a level field (within spells:[])'],
  ['missingSpellType', 'Missing Spell Type', 'Spells without spellType (within spells:[])'],
  ['invalidSpellType', 'Invalid Spell Type', 'Spells with non-standard spellType (valid: ' + VALID_SPELL_TYPES.join(', ') + ')'],
  ['missingDamageType', 'Missing Damage Type', 'ACTION/CHANNELED spells with no school/elementType/damageTypes'],
  ['nonCanonicalDamageTypes', 'Non-Canonical Damage Types', 'Spells using types outside the 12 canonical + 7 pseudo (direct/area/dot/hot/random/choice/all/any)'],
  ['legacyDamageTypes', 'Legacy Damage Type Aliases', 'Spells using legacy aliases (physical, fire, bludgeoning, etc.). Should migrate to canonical.'],
  ['missingActionPoints', 'Missing Action Points', 'Non-PASSIVE spells without actionPoints'],
  ['longDescriptions', 'Long Descriptions (>200 chars)', 'Spells with descriptions over 200 characters'],
  ['rawFormulasInText', 'Raw Formulas in Text', 'Spells with CARD_VALUE etc. in description/mechanicsText'],
];

let totalIssues = 0;
let totalErrors = 0;
for (const [key, title, desc] of categories) {
  const items = issues[key];
  totalIssues += items.length;
  if (key !== 'legacyDamageTypes' && key !== 'longDescriptions') {
    totalErrors += items.length;
  }
  console.log(`\n--- ${title} (${items.length}) ---`);
  console.log(`  ${desc}`);
  if (items.length > 0) {
    for (const item of items.slice(0, 20)) {
      if (key === 'longDescriptions') {
        console.log(`  ${item.file}: ${item.id} (${item.length} chars)`);
      } else if (key === 'rawFormulasInText') {
        console.log(`  ${item.file}: ${item.id}`);
        for (const f of item.formulas) {
          console.log(`    L${f.line}: ${f.token} in "${f.text.substring(0, 80)}..."`);
        }
      } else if (key === 'nonCanonicalDamageTypes' || key === 'legacyDamageTypes') {
        console.log(`  ${item.file}: ${item.id} -> ${item.type}${item.field ? ` (${item.field})` : ''}`);
      } else {
        console.log(`  ${item.file}: ${item.id}${item.spellType ? ` (${item.spellType})` : ''}`);
      }
    }
    if (items.length > 20) {
      console.log(`  ... and ${items.length - 20} more`);
    }
  }
}

console.log(`\n=== TOTAL ISSUES: ${totalIssues} (${totalErrors} errors, ${totalIssues - totalErrors} warnings) ===`);
