import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLASSES_DIR = path.join(__dirname, '..', 'vtt-react', 'src', 'data', 'classes');

const CANONICAL_DAMAGE_TYPES = [
  'fire', 'frost', 'lightning', 'nature', 'bludgeoning', 'piercing', 'slashing',
  'force', 'psychic', 'radiant', 'arcane', 'necrotic', 'poison', 'void', 'chaos',
  'physical', 'magical'
];

const VALID_SPELL_TYPES = ['ACTION', 'CHANNELED', 'PASSIVE', 'REACTION', 'TRAP', 'STATE'];

function extractSpellsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const spells = [];

  const idRegex = /id:\s*['"]([^'"]+)['"]/g;
  const lines = content.split('\n');

  let currentSpell = null;
  let braceDepth = 0;
  let inSpell = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const idMatch = idRegex.exec(line);

    if (idMatch && !line.includes('statModifier') && !line.includes('stat:')) {
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
        effectsLines: [],
        rawFormulas: []
      };
      inSpell = true;
      braceDepth = 0;
    }

    if (currentSpell && inSpell) {
      currentSpell.raw += line + '\n';

      if (line.includes('spellType:')) {
        currentSpell.hasSpellType = true;
        const m = line.match(/spellType:\s*['"]?([A-Z]+)['"]?/);
        if (m) currentSpell.spellType = m[1];
      }
      if (line.match(/^[\s]*level:\s*(\d+)/)) {
        currentSpell.hasLevel = true;
        const m = line.match(/level:\s*(\d+)/);
        if (m) currentSpell.level = parseInt(m[1]);
      }
      if (line.match(/school:\s*['"]/)) {
        currentSpell.hasSchool = true;
        const m = line.match(/school:\s*['"]([^'"]+)['"]/);
        if (m) currentSpell.school = m[1];
      }
      if (line.match(/elementType:\s*['"]/)) {
        currentSpell.hasElementType = true;
        const m = line.match(/elementType:\s*['"]([^'"]+)['"]/);
        if (m) currentSpell.elementType = m[1];
      }
      if (line.match(/damageTypes:\s*\[/)) {
        currentSpell.hasDamageTypes = true;
        const m = line.match(/damageTypes:\s*\[([^\]]+)\]/);
        if (m) {
          currentSpell.damageTypes = m[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
        }
      }
      if (line.match(/actionPoints:\s*\d/)) {
        currentSpell.hasActionPoints = true;
        const m = line.match(/actionPoints:\s*(\d+)/);
        if (m) currentSpell.actionPoints = parseInt(m[1]);
      }
      if (line.match(/description:\s*['"]/) && !line.includes('statModifier') && !line.includes('keyAbilities')) {
        const m = line.match(/description:\s*['"](.+?)['"]/);
        if (m) currentSpell.description = m[1];
      }

      const rawTokens = ['CARD_VALUE', 'HEADS_COUNT', 'FACE_CARD_COUNT', 'ALL_HEADS', 'LONGEST_STREAK', 'SAME_SUIT', 'DAMAGE_DEALT', 'HEALTH_SACRIFICED', 'MANA_SPENT'];
      for (const token of rawTokens) {
        if (line.includes(token) && !line.trim().startsWith('//') && !line.includes('formula:') && !line.includes('cardConfig') && !line.includes('coinConfig')) {
          if (line.includes('description:') || line.includes('mechanicsText:')) {
            currentSpell.rawFormulas.push({ token, line: i + 1, text: line.trim() });
          }
        }
      }

      if (line.includes('}')) {
        const opens = (line.match(/\{/g) || []).length;
        const closes = (line.match(/\}/g) || []).length;
        braceDepth += opens - closes;
        if (braceDepth <= 0 && currentSpell.raw.length > 100) {
          spells.push(currentSpell);
          currentSpell = null;
          inSpell = false;
        }
      } else {
        braceDepth += (line.match(/\{/g) || []).length;
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
    missingSchool: [],
    missingDamageType: [],
    nonCanonicalDamageTypes: [],
    missingActionPoints: [],
    longDescriptions: [],
    rawFormulasInText: [],
    orphanedDamageTypes: []
  };

  const files = fs.readdirSync(CLASSES_DIR).filter(f => f.endsWith('Data.js') && f !== 'index.js');

  for (const file of files) {
    const filePath = path.join(CLASSES_DIR, file);
    const spells = extractSpellsFromFile(filePath);

    for (const spell of spells) {
      if (!spell.hasLevel && !spell.id.startsWith('lb_')) {
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
          if (!CANONICAL_DAMAGE_TYPES.includes(dt) && !['direct', 'area', 'dot', 'hot', 'random', 'choice', 'all', 'any'].includes(dt)) {
            issues.nonCanonicalDamageTypes.push({ id: spell.id, file: spell.file, type: dt });
          }
        }
      }

      if (spell.elementType && !CANONICAL_DAMAGE_TYPES.includes(spell.elementType)) {
        issues.nonCanonicalDamageTypes.push({ id: spell.id, file: spell.file, type: spell.elementType, field: 'elementType' });
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

console.log('=== SPELL QA REPORT ===\n');

const categories = [
  ['missingLevel', 'Missing Level', 'Spells without a level field'],
  ['missingSpellType', 'Missing Spell Type', 'Spells without spellType'],
  ['invalidSpellType', 'Invalid Spell Type', 'Spells with non-standard spellType'],
  ['missingDamageType', 'Missing Damage Type', 'ACTION/CHANNELED spells with no school/elementType/damageTypes'],
  ['nonCanonicalDamageTypes', 'Non-Canonical Damage Types', 'Spells using acid, thunder, or other non-standard types'],
  ['missingActionPoints', 'Missing Action Points', 'Non-PASSIVE spells without actionPoints'],
  ['longDescriptions', 'Long Descriptions (>200 chars)', 'Spells with descriptions over 200 characters'],
  ['rawFormulasInText', 'Raw Formulas in Text', 'Spells with CARD_VALUE etc. in description/mechanicsText'],
];

let totalIssues = 0;
for (const [key, title, desc] of categories) {
  const items = issues[key];
  totalIssues += items.length;
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
      } else if (key === 'nonCanonicalDamageTypes') {
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

console.log(`\n=== TOTAL ISSUES: ${totalIssues} ===`);
