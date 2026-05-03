const fs = require('fs');
const path = require('path');

const classDir = 'D:\\VTT\\vtt-react\\src\\data\\classes';
const pathDir = 'D:\\VTT\\vtt-react\\src\\data\\paths';

const classFiles = fs.readdirSync(classDir).filter(f => f.endsWith('Data.js'));
const pathFiles = fs.readdirSync(pathDir).filter(f => f.endsWith('Path.js'));

const allFiles = [
  ...classFiles.map(f => path.join(classDir, f)),
  ...pathFiles.map(f => path.join(pathDir, f))
];

function extractSpells(content, filePath) {
  const lines = content.split('\n');
  const spells = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const idMatch = line.match(/^\s*id:\s*['"]([^'"]+)['"]/);
    if (!idMatch) { i++; continue; }

    let startLine = i;
    // Walk backward to find spell object start (line with just { or spell: { etc.)
    for (let b = i - 1; b >= Math.max(0, i - 5); b--) {
      if (lines[b].match(/\{\s*$/)) {
        startLine = b;
        break;
      }
    }

    let depth = 0;
    let spellStart = -1;
    for (let j = startLine; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === '{') {
          if (depth === 0) spellStart = j;
          depth++;
        }
        if (ch === '}') depth--;
      }
      if (depth === 0 && spellStart >= 0) {
        const block = lines.slice(spellStart, j + 1).join('\n');
        spells.push({
          id: idMatch[1],
          content: block,
          startLine: spellStart + 1,
          endLine: j + 1,
          file: filePath
        });
        i = j + 1;
        break;
      }
    }
    if (depth !== 0) i++;
  }
  return spells;
}

function extractBlock(content, blockName) {
  const idx = content.indexOf(blockName);
  if (idx === -1) return null;
  let pos = content.indexOf('{', idx);
  if (pos === -1) return null;
  let depth = 0;
  let start = pos;
  for (let i = pos; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') {
      depth--;
      if (depth === 0) return content.substring(start, i + 1);
    }
  }
  return null;
}

function extractEffectsArray(blockContent) {
  if (!blockContent) return [];
  const idx = blockContent.indexOf('effects');
  if (idx === -1) return [];
  const arrStart = blockContent.indexOf('[', idx);
  if (arrStart === -1) return [];
  let depth = 0;
  let inArray = false;
  let objects = [];
  let objStart = -1;
  for (let i = arrStart; i < blockContent.length; i++) {
    if (blockContent[i] === '[') { inArray = true; depth++; continue; }
    if (blockContent[i] === ']') { depth--; if (depth === 0) break; continue; }
    if (blockContent[i] === '{') {
      if (objStart === -1) objStart = i;
    }
    if (blockContent[i] === '}') {
      if (objStart !== -1) {
        objects.push(blockContent.substring(objStart, i + 1));
        objStart = -1;
      }
    }
  }
  return objects;
}

function hasField(objStr, fieldName) {
  const regex = new RegExp(fieldName + '\\s*:');
  return regex.test(objStr);
}

function getFieldValue(objStr, fieldName) {
  const regex = new RegExp(fieldName + '\\s*:\\s*["\']([^"\']+)["\']');
  const m = objStr.match(regex);
  return m ? m[1] : null;
}

function getFieldValueRaw(objStr, fieldName) {
  const regex = new RegExp(fieldName + '\\s*:\\s*(.+?)(?:[,}])', 's');
  const m = objStr.match(regex);
  return m ? m[1].trim() : null;
}

const mechanicalFields = [
  'statModifier', 'shieldValue', 'mechanicsText', 'tempHPFormula',
  'damageReduction', 'damageImmunity', 'resistance', 'buffAmount',
  'spellPowerBonus', 'critChanceBonus', 'critMultiplier', 'armorBonus',
  'dodgeChance', 'movementBonus'
];

const debuffMechFields = [
  'statModifier', 'statPenalty', 'statusEffects', 'damagePerTurn',
  'movementPenalty', 'accuracyPenalty', 'armorReduction',
  'healingReduction', 'dotDamage', 'dotFormula'
];

const findings = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const fileName = path.basename(file);
  const spells = extractSpells(content, file);

  for (const spell of spells) {
    const c = spell.content;

    // Extract effectTypes
    const etMatch = c.match(/effectTypes\s*:\s*\[([^\]]*)\]/);
    const effectTypes = etMatch ? etMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')) : [];

    const buffBlock = extractBlock(c, 'buffConfig');
    const debuffBlock = extractBlock(c, 'debuffConfig');
    const damageBlock = extractBlock(c, 'damageConfig');
    const healingBlock = extractBlock(c, 'healingConfig');
    const controlBlock = extractBlock(c, 'controlConfig');
    const utilityBlock = extractBlock(c, 'utilityConfig');

    // === PATTERN 1: buffConfig effects with no mechanical fields ===
    if (buffBlock) {
      const effects = extractEffectsArray(buffBlock);
      if (effects.length === 0) {
        // PATTERN 8: buffConfig with buffType but empty effects
        const buffType = getFieldValue(buffBlock, 'buffType');
        if (buffType) {
          findings.push({
            pattern: 'P8',
            spell: spell.id,
            file: fileName,
            line: spell.startLine,
            issue: `buffConfig has buffType '${buffType}' but no effects array or empty effects`,
            current: buffBlock.trim().substring(0, 200),
            missing: 'effects array with concrete buff effects'
          });
        }
      }
      for (let ei = 0; ei < effects.length; ei++) {
        const eff = effects[ei];
        const hasAny = mechanicalFields.some(f => hasField(eff, f));
        const effName = getFieldValue(eff, 'name') || getFieldValue(eff, 'id') || `effect[${ei}]`;
        if (!hasAny) {
          // Check if it has other non-standard fields
          const otherFields = ['damageReflection', 'healingPrevention', 'healingModifier',
            'retaliationDamage', 'customDescription', 'isSelfDebuff', 'description'];
          const hasOther = otherFields.some(f => hasField(eff, f));
          findings.push({
            pattern: hasOther ? 'P1-custom' : 'P1',
            spell: spell.id,
            file: fileName,
            line: spell.startLine,
            issue: `buffConfig effect '${effName}' has no standard mechanical fields`,
            current: eff.trim().substring(0, 300),
            missing: mechanicalFields.join(', ')
          });
        }
      }
    }

    // === PATTERN 2: debuffConfig effects with no mechanical fields ===
    if (debuffBlock) {
      const effects = extractEffectsArray(debuffBlock);
      for (let ei = 0; ei < effects.length; ei++) {
        const eff = effects[ei];
        const hasAny = debuffMechFields.some(f => hasField(eff, f));
        const effName = getFieldValue(eff, 'name') || getFieldValue(eff, 'id') || `effect[${ei}]`;
        if (!hasAny) {
          findings.push({
            pattern: 'P2',
            spell: spell.id,
            file: fileName,
            line: spell.startLine,
            issue: `debuffConfig effect '${effName}' has no standard mechanical fields`,
            current: eff.trim().substring(0, 300),
            missing: debuffMechFields.join(', ')
          });
        }
      }
    }

    // === PATTERN 3: damageConfig with no formula ===
    if (damageBlock) {
      const hasFormula = hasField(damageBlock, 'formula') || hasField(damageBlock, 'dotFormula');
      if (!hasFormula) {
        const hasDamage = hasField(damageBlock, 'baseDamage') || hasField(damageBlock, 'minDamage') || hasField(damageBlock, 'maxDamage') || hasField(damageBlock, 'diceCount') || hasField(damageBlock, 'diceSize');
        if (!hasDamage) {
          findings.push({
            pattern: 'P3',
            spell: spell.id,
            file: fileName,
            line: spell.startLine,
            issue: 'damageConfig has no formula or baseDamage/dice fields',
            current: damageBlock.trim().substring(0, 300),
            missing: 'formula (e.g. "2d6 + INT mod") or baseDamage'
          });
        }
      }
    }

    // === PATTERN 4: healingConfig with no formula ===
    if (healingBlock) {
      const hasFormula = hasField(healingBlock, 'formula') || hasField(healingBlock, 'healFormula');
      const hasFlat = hasField(healingBlock, 'baseHealing') || hasField(healingBlock, 'healAmount');
      if (!hasFormula && !hasFlat) {
        findings.push({
          pattern: 'P4',
          spell: spell.id,
          file: fileName,
          line: spell.startLine,
          issue: 'healingConfig has no formula or baseHealing',
          current: healingBlock.trim().substring(0, 300),
          missing: 'formula (e.g. "1d8 + WIS mod") or baseHealing'
        });
      }
    }

    // === PATTERN 5: controlConfig with description but no concrete config ===
    if (controlBlock) {
      const effects = extractEffectsArray(controlBlock);
      for (let ei = 0; ei < effects.length; ei++) {
        const eff = effects[ei];
        const effName = getFieldValue(eff, 'name') || getFieldValue(eff, 'id') || `effect[${ei}]`;
        const controlMechFields = ['saveDC', 'saveType', 'condition', 'duration', 'immobilize',
          'stun', 'silence', 'disarm', 'slow', 'knockdown', 'pushDistance', 'pullDistance',
          'statusEffects', 'statPenalty', 'movementPenalty', 'accuracyPenalty', 'breakOnDamage'];
        const hasAny = controlMechFields.some(f => hasField(eff, f));
        if (!hasAny) {
          findings.push({
            pattern: 'P5',
            spell: spell.id,
            file: fileName,
            line: spell.startLine,
            issue: `controlConfig effect '${effName}' has no concrete control mechanics`,
            current: eff.trim().substring(0, 300),
            missing: controlMechFields.join(', ')
          });
        }
      }
    }

    // === PATTERN 6: utilityConfig with description but no values ===
    if (utilityBlock) {
      const effects = extractEffectsArray(utilityBlock);
      for (let ei = 0; ei < effects.length; ei++) {
        const eff = effects[ei];
        const effName = getFieldValue(eff, 'name') || getFieldValue(eff, 'id') || `effect[${ei}]`;
        const utilMechFields = ['revealDistance', 'revealDuration', 'teleportDistance', 'summonCount',
          'summonType', 'barrierHP', 'barrierDuration', 'lightRadius', 'lightDuration',
          'detectionRadius', 'statModifier', 'movementBonus', 'duration', 'charges',
          'resourceGain', 'resourceType', 'cooldownReduction'];
        const hasAny = utilMechFields.some(f => hasField(eff, f));
        if (!hasAny) {
          findings.push({
            pattern: 'P6',
            spell: spell.id,
            file: fileName,
            line: spell.startLine,
            issue: `utilityConfig effect '${effName}' has no concrete utility values`,
            current: eff.trim().substring(0, 300),
            missing: utilMechFields.join(', ')
          });
        }
      }
    }

    // === PATTERN 7: effectTypes mentions mechanic but config block missing ===
    for (const et of effectTypes) {
      const t = et.toLowerCase().trim();
      if ((t === 'damage' || t === 'damaging') && !damageBlock) {
        findings.push({
          pattern: 'P7',
          spell: spell.id,
          file: fileName,
          line: spell.startLine,
          issue: `effectTypes includes '${et}' but no damageConfig`,
          current: `effectTypes: [${etMatch[1]}]`,
          missing: 'damageConfig block with formula'
        });
      }
      if ((t === 'healing' || t === 'heal') && !healingBlock) {
        findings.push({
          pattern: 'P7',
          spell: spell.id,
          file: fileName,
          line: spell.startLine,
          issue: `effectTypes includes '${et}' but no healingConfig`,
          current: `effectTypes: [${etMatch[1]}]`,
          missing: 'healingConfig block with formula'
        });
      }
      if (t === 'buff' && !buffBlock) {
        findings.push({
          pattern: 'P7',
          spell: spell.id,
          file: fileName,
          line: spell.startLine,
          issue: `effectTypes includes '${et}' but no buffConfig`,
          current: `effectTypes: [${etMatch[1]}]`,
          missing: 'buffConfig block'
        });
      }
      if (t === 'debuff' && !debuffBlock) {
        findings.push({
          pattern: 'P7',
          spell: spell.id,
          file: fileName,
          line: spell.startLine,
          issue: `effectTypes includes '${et}' but no debuffConfig`,
          current: `effectTypes: [${etMatch[1]}]`,
          missing: 'debuffConfig block'
        });
      }
      if (t === 'control' && !controlBlock) {
        findings.push({
          pattern: 'P7',
          spell: spell.id,
          file: fileName,
          line: spell.startLine,
          issue: `effectTypes includes '${et}' but no controlConfig`,
          current: `effectTypes: [${etMatch[1]}]`,
          missing: 'controlConfig block'
        });
      }
      if (t === 'utility' && !utilityBlock) {
        findings.push({
          pattern: 'P7',
          spell: spell.id,
          file: fileName,
          line: spell.startLine,
          issue: `effectTypes includes '${et}' but no utilityConfig`,
          current: `effectTypes: [${etMatch[1]}]`,
          missing: 'utilityConfig block'
        });
      }
    }
  }
}

// Group by file
const grouped = {};
for (const f of findings) {
  if (!grouped[f.file]) grouped[f.file] = [];
  grouped[f.file].push(f);
}

let output = '';
output += `=== HOLLOW SPELL DATA AUDIT ===\n`;
output += `Total findings: ${findings.length}\n`;
output += `Files with findings: ${Object.keys(grouped).length}\n\n`;

const patternNames = {
  'P1': 'Buff effect with no mechanical fields',
  'P1-custom': 'Buff effect with only non-standard fields',
  'P2': 'Debuff effect with no mechanical fields',
  'P3': 'DamageConfig with no formula',
  'P4': 'HealingConfig with no formula',
  'P5': 'Control effect with no concrete mechanics',
  'P6': 'Utility effect with no concrete values',
  'P7': 'effectTypes declares type but config block missing',
  'P8': 'BuffConfig has buffType but empty effects'
};

const patternCounts = {};
for (const f of findings) {
  patternCounts[f.pattern] = (patternCounts[f.pattern] || 0) + 1;
}
output += `=== PATTERN SUMMARY ===\n`;
for (const [p, count] of Object.entries(patternCounts).sort((a, b) => b[1] - a[1])) {
  output += `  ${p}: ${count} (${patternNames[p] || p})\n`;
}
output += '\n';

for (const [file, items] of Object.entries(grouped).sort()) {
  output += `\n${'='.repeat(80)}\n`;
  output += `FILE: ${file} (${items.length} findings)\n`;
  output += `${'='.repeat(80)}\n\n`;

  for (const item of items) {
    output += `--- [${item.pattern}] ${item.spell} (line ${item.line}) ---\n`;
    output += `  Issue: ${item.issue}\n`;
    output += `  Current code:\n`;
    const currentLines = item.current.split('\n');
    for (const cl of currentLines) {
      output += `    ${cl}\n`;
    }
    output += `  Missing: ${item.missing}\n\n`;
  }
}

fs.writeFileSync('D:\\VTT\\analysis_output.txt', output, 'utf8');
console.log(output.substring(0, 5000));
console.log(`\n\n... Full output (${output.length} chars) written to analysis_output.txt`);
