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

const configTypes = ['buffConfig', 'debuffConfig', 'damageConfig', 'healingConfig', 'controlConfig', 'utilityConfig'];
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
const controlMechFields = ['saveDC', 'saveType', 'condition', 'duration', 'immobilize',
  'stun', 'silence', 'disarm', 'slow', 'knockdown', 'pushDistance', 'pullDistance',
  'statusEffects', 'statPenalty', 'movementPenalty', 'accuracyPenalty', 'breakOnDamage'];
const utilMechFields = ['revealDistance', 'revealDuration', 'teleportDistance', 'summonCount',
  'summonType', 'barrierHP', 'barrierDuration', 'lightRadius', 'lightDuration',
  'detectionRadius', 'statModifier', 'movementBonus', 'duration', 'charges',
  'resourceGain', 'resourceType', 'cooldownReduction'];

function extractBlockFromLine(lines, startLine) {
  let depth = 0;
  let blockLines = [];
  let foundOpen = false;
  for (let i = startLine; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '{') { depth++; foundOpen = true; }
      if (ch === '}') depth--;
    }
    blockLines.push(lines[i]);
    if (foundOpen && depth === 0) break;
  }
  return blockLines.join('\n');
}

function extractEffectsFromBlock(blockStr) {
  const match = blockStr.match(/effects\s*:\s*\[/);
  if (!match) return [];
  const arrStart = blockStr.indexOf(match[0]) + match[0].length - 1;
  let depth = 0;
  let objects = [];
  let objStart = -1;
  for (let i = arrStart; i < blockStr.length; i++) {
    if (blockStr[i] === '[') { depth++; continue; }
    if (blockStr[i] === ']') { depth--; if (depth === 0) break; continue; }
    if (blockStr[i] === '{') { if (objStart === -1) objStart = i; }
    if (blockStr[i] === '}') {
      if (objStart !== -1) {
        objects.push(blockStr.substring(objStart, i + 1));
        objStart = -1;
      }
    }
  }
  return objects;
}

function hasField(objStr, fieldName) {
  return new RegExp(fieldName + '\\s*:').test(objStr);
}
function getFieldValue(objStr, fieldName) {
  const m = objStr.match(new RegExp(fieldName + '\\s*:\\s*["\']([^"\']+)["\']'));
  return m ? m[1] : null;
}

function findParentSpell(lines, configLine) {
  // Walk backward to find the nearest spell/ability id
  for (let i = configLine; i >= Math.max(0, configLine - 200); i--) {
    const m = lines[i].match(/^\s*id:\s*['"]([^'"]+)['"]/);
    if (m) return m[1];
  }
  return 'unknown';
}

const findings = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const fileName = path.basename(file);

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const trimmed = line.trim();

    for (const configType of configTypes) {
      if (!trimmed.startsWith(configType)) continue;

      const blockStr = extractBlockFromLine(lines, li);
      const configLineNum = li + 1;
      const parentSpell = findParentSpell(lines, li);

      // Skip if this is just a type annotation string like buffConfig: 'some_string'
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1) {
        const afterColon = trimmed.substring(colonIdx + 1).trim();
        if (afterColon.startsWith("'") || afterColon.startsWith('"')) continue;
        if (afterColon === '' || afterColon === 'null' || afterColon === 'undefined') continue;
      }

      if (configType === 'buffConfig' || configType === 'debuffConfig') {
        const effects = extractEffectsFromBlock(blockStr);
        const fields = configType === 'buffConfig' ? mechanicalFields : debuffMechFields;

        if (effects.length === 0) {
          // Check if block has effects: [] or no effects at all
          const hasEffectsKey = /effects\s*:/.test(blockStr);
          const hasBuffType = hasField(blockStr, 'buffType');
          if (hasBuffType && !hasEffectsKey) {
            findings.push({
              pattern: 'P8',
              spell: parentSpell,
              file: fileName,
              line: configLineNum,
              configType,
              issue: `${configType} has buffType but no effects array`,
              current: blockStr.trim().substring(0, 300),
              missing: 'effects array with concrete effects'
            });
          }
          continue;
        }

        for (let ei = 0; ei < effects.length; ei++) {
          const eff = effects[ei];
          const hasAny = fields.some(f => hasField(eff, f));
          const effName = getFieldValue(eff, 'name') || getFieldValue(eff, 'id') || `effect[${ei}]`;
          if (!hasAny) {
            findings.push({
              pattern: configType === 'buffConfig' ? 'P1' : 'P2',
              spell: parentSpell,
              file: fileName,
              line: configLineNum,
              configType,
              effectName: effName,
              issue: `${configType} effect '${effName}' has no standard mechanical fields`,
              current: eff.trim().substring(0, 300),
              missing: fields.join(', ')
            });
          }
        }
      }

      if (configType === 'damageConfig') {
        const hasFormula = hasField(blockStr, 'formula') || hasField(blockStr, 'dotFormula');
        const hasDamage = hasField(blockStr, 'baseDamage') || hasField(blockStr, 'minDamage') ||
          hasField(blockStr, 'maxDamage') || hasField(blockStr, 'diceCount') || hasField(blockStr, 'diceSize');
        if (!hasFormula && !hasDamage) {
          findings.push({
            pattern: 'P3',
            spell: parentSpell,
            file: fileName,
            line: configLineNum,
            configType,
            issue: 'damageConfig has no formula or baseDamage/dice fields',
            current: blockStr.trim().substring(0, 300),
            missing: 'formula (e.g. "2d6 + INT mod") or baseDamage'
          });
        }
      }

      if (configType === 'healingConfig') {
        const hasFormula = hasField(blockStr, 'formula') || hasField(blockStr, 'healFormula');
        const hasFlat = hasField(blockStr, 'baseHealing') || hasField(blockStr, 'healAmount');
        const hasShield = hasField(blockStr, 'shieldFormula') || hasField(blockStr, 'shieldAmount');
        if (!hasFormula && !hasFlat && !hasShield) {
          findings.push({
            pattern: 'P4',
            spell: parentSpell,
            file: fileName,
            line: configLineNum,
            configType,
            issue: 'healingConfig has no formula, baseHealing, or shieldFormula',
            current: blockStr.trim().substring(0, 300),
            missing: 'formula (e.g. "1d8 + WIS mod") or baseHealing'
          });
        }
      }

      if (configType === 'controlConfig') {
        const effects = extractEffectsFromBlock(blockStr);
        // If no effects array, check the block itself
        if (effects.length === 0) {
          const hasAny = controlMechFields.some(f => hasField(blockStr, f));
          if (!hasAny) {
            findings.push({
              pattern: 'P5',
              spell: parentSpell,
              file: fileName,
              line: configLineNum,
              configType,
              issue: `${configType} has no concrete control mechanics`,
              current: blockStr.trim().substring(0, 300),
              missing: controlMechFields.join(', ')
            });
          }
        } else {
          for (let ei = 0; ei < effects.length; ei++) {
            const eff = effects[ei];
            const effName = getFieldValue(eff, 'name') || getFieldValue(eff, 'id') || `effect[${ei}]`;
            const hasAny = controlMechFields.some(f => hasField(eff, f));
            if (!hasAny) {
              findings.push({
                pattern: 'P5',
                spell: parentSpell,
                file: fileName,
                line: configLineNum,
                configType,
                effectName: effName,
                issue: `${configType} effect '${effName}' has no concrete control mechanics`,
                current: eff.trim().substring(0, 300),
                missing: controlMechFields.join(', ')
              });
            }
          }
        }
      }

      if (configType === 'utilityConfig') {
        const effects = extractEffectsFromBlock(blockStr);
        if (effects.length === 0) {
          const hasAny = utilMechFields.some(f => hasField(blockStr, f));
          if (!hasAny) {
            findings.push({
              pattern: 'P6',
              spell: parentSpell,
              file: fileName,
              line: configLineNum,
              configType,
              issue: `${configType} has no concrete utility values`,
              current: blockStr.trim().substring(0, 300),
              missing: utilMechFields.join(', ')
            });
          }
        } else {
          for (let ei = 0; ei < effects.length; ei++) {
            const eff = effects[ei];
            const effName = getFieldValue(eff, 'name') || getFieldValue(eff, 'id') || `effect[${ei}]`;
            const hasAny = utilMechFields.some(f => hasField(eff, f));
            if (!hasAny) {
              findings.push({
                pattern: 'P6',
                spell: parentSpell,
                file: fileName,
                line: configLineNum,
                configType,
                effectName: effName,
                issue: `${configType} effect '${effName}' has no concrete utility values`,
                current: eff.trim().substring(0, 300),
                missing: utilMechFields.join(', ')
              });
            }
          }
        }
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
output += `=== HOLLOW SPELL DATA AUDIT (v2 - accurate line numbers) ===\n`;
output += `Total findings: ${findings.length}\n`;
output += `Files with findings: ${Object.keys(grouped).length}\n\n`;

const patternCounts = {};
for (const f of findings) {
  patternCounts[f.pattern] = (patternCounts[f.pattern] || 0) + 1;
}
output += `=== PATTERN SUMMARY ===\n`;
const patternNames = {
  'P1': 'Buff effect with no mechanical fields',
  'P2': 'Debuff effect with no mechanical fields',
  'P3': 'DamageConfig with no formula',
  'P4': 'HealingConfig with no formula',
  'P5': 'Control effect with no concrete mechanics',
  'P6': 'Utility effect with no concrete values',
  'P7': 'effectTypes declares type but config block missing',
  'P8': 'BuffConfig has buffType but empty effects'
};
for (const [p, count] of Object.entries(patternCounts).sort((a, b) => b[1] - a[1])) {
  output += `  ${p}: ${count} (${patternNames[p] || p})\n`;
}
output += '\n';

for (const [file, items] of Object.entries(grouped).sort()) {
  output += `\n${'='.repeat(80)}\n`;
  output += `FILE: ${file} (${items.length} findings)\n`;
  output += `${'='.repeat(80)}\n\n`;

  for (const item of items) {
    output += `--- [${item.pattern}] Spell: "${item.spell}" | ${item.configType} @ line ${item.line} ---\n`;
    output += `  Issue: ${item.issue}\n`;
    output += `  Current code:\n`;
    const currentLines = item.current.split('\n');
    for (const cl of currentLines.slice(0, 12)) {
      output += `    ${cl}\n`;
    }
    if (currentLines.length > 12) output += `    ... (${currentLines.length - 12} more lines)\n`;
    output += `  Missing: ${item.missing}\n\n`;
  }
}

fs.writeFileSync('D:\\VTT\\analysis_output.txt', output, 'utf8');
console.log(output.substring(0, 6000));
console.log(`\n\n... Full output (${output.length} chars, ${findings.length} findings) written to analysis_output.txt`);
