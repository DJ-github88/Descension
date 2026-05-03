/**
 * Re-audit Script: Spell Data Quality Check
 * Checks all class/path spell data files for hollow/missing effect patterns.
 * 
 * Patterns:
 *  P1 - Hollow Buff Effects
 *  P2 - Hollow Debuff Effects
 *  P3 - Missing Damage Formulas
 *  P4 - Missing Healing Formulas
 *  P5 - Hollow Control Effects
 *  P6 - Hollow Utility Effects
 *  P8 - Missing Effects Array
 */

const fs = require('fs');
const path = require('path');

const DATA_DIRS = [
  'D:\\VTT\\vtt-react\\src\\data\\classes',
  'D:\\VTT\\vtt-react\\src\\data\\paths'
];

const BUFF_CONCRETE_KEYS = [
  'statModifier', 'shieldValue', 'mechanicsText', 'tempHPFormula',
  'damageReduction', 'damageImmunity', 'resistance', 'buffAmount',
  'spellPowerBonus', 'critChanceBonus', 'armorBonus', 'dodgeChance',
  'movementBonus'
];

const DEBUFF_CONCRETE_KEYS = [
  'statModifier', 'statPenalty', 'statusEffects', 'damagePerTurn',
  'movementPenalty', 'accuracyPenalty', 'armorReduction',
  'healingReduction', 'dotDamage', 'dotFormula', 'mechanicsText'
];

const UTILITY_CONCRETE_KEYS = [
  'revealDistance', 'teleportDistance', 'summonCount', 'barrierHP',
  'barrierDuration', 'lightRadius', 'detectionRadius', 'statModifier',
  'movementBonus', 'duration', 'charges', 'resourceGain',
  'cooldownReduction', 'mechanicsText'
];

const DAMAGE_FORMULA_KEYS = ['formula', 'baseDamage', 'dice'];
const HEALING_FORMULA_KEYS = ['formula', 'baseHealing', 'shieldFormula', 'hotFormula'];
const CONTROL_SAVING_KEYS = ['saveDC', 'saveType', 'duration'];

function collectFiles(dirs) {
  const files = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.js') && f !== 'index.js') {
        files.push(path.join(dir, f));
      }
    }
  }
  return files;
}

function extractSpells(content) {
  const spells = [];
  const idRegex = /id:\s*['"]([^'"]+)['"]/g;
  let match;
  const idPositions = [];
  while ((match = idRegex.exec(content)) !== null) {
    idPositions.push({ id: match[1], pos: match.index });
  }

  for (let i = 0; i < idPositions.length; i++) {
    const start = idPositions[i].pos;
    const end = i + 1 < idPositions.length ? idPositions[i + 1].pos : content.length;
    const block = content.substring(start, end);

    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    const spellId = idPositions[i].id;
    const spellName = nameMatch ? nameMatch[1] : spellId;

    spells.push({ id: spellId, name: spellName, block, pos: start });
  }
  return spells;
}

function extractConfigBlock(block, configKey) {
  const regex = new RegExp(configKey + '\\s*:\\s*\\{', 'g');
  const positions = [];
  let m;
  while ((m = regex.exec(block)) !== null) {
    positions.push(m.index + m[0].length - 1);
  }

  const results = [];
  for (const pos of positions) {
    const extracted = extractBracedContent(block, pos);
    if (extracted) results.push(extracted);
  }
  return results;
}

function extractBracedContent(text, openBracePos) {
  let depth = 0;
  let start = -1;
  for (let i = openBracePos; i < text.length; i++) {
    if (text[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === '}') {
      depth--;
      if (depth === 0 && start >= 0) {
        return text.substring(start, i + 1);
      }
    }
  }
  return null;
}

function extractEffects(configStr) {
  const effectsRegex = /effects\s*:\s*\[/g;
  const effects = [];
  let m;
  while ((m = effectsRegex.exec(configStr)) !== null) {
    const arrStart = m.index + m[0].length - 1;
    const arrContent = extractBracketContent(configStr, arrStart);
    if (!arrContent) continue;

    const objRegex = /\{/g;
    let om;
    while ((om = objRegex.exec(arrContent)) !== null) {
      const objContent = extractBracedContent(arrContent, om.index);
      if (objContent) effects.push(objContent);
    }
  }
  return effects;
}

function extractBracketContent(text, openBracketPos) {
  let depth = 0;
  let start = -1;
  for (let i = openBracketPos; i < text.length; i++) {
    if (text[i] === '[') {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === ']') {
      depth--;
      if (depth === 0 && start >= 0) {
        return text.substring(start, i + 1);
      }
    }
  }
  return null;
}

function hasKey(content, key) {
  const regex = new RegExp('\\b' + key + '\\s*:', 'i');
  return regex.test(content);
}

function hasAnyKey(content, keys) {
  return keys.some(k => hasKey(content, k));
}

function extractValue(content, key) {
  const regex = new RegExp(key + '\\s*:\\s*[\'"]([^\'"]*)[\'"]');
  const match = content.match(regex);
  return match ? match[1] : null;
}

function hasIdNameDesc(effect) {
  return hasKey(effect, 'id') && hasKey(effect, 'name') && hasKey(effect, 'description');
}

function extractSelectedEffects(configStr) {
  const effectsRegex = /selectedEffects\s*:\s*\[/g;
  const effects = [];
  let m;
  while ((m = effectsRegex.exec(configStr)) !== null) {
    const arrStart = m.index + m[0].length - 1;
    const arrContent = extractBracketContent(configStr, arrStart);
    if (!arrContent) continue;

    const objRegex = /\{/g;
    let om;
    while ((om = objRegex.exec(arrContent)) !== null) {
      const objContent = extractBracedContent(arrContent, om.index);
      if (objContent) effects.push(objContent);
    }
  }
  return effects;
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const spells = extractSpells(content);
  const findings = [];

  for (const spell of spells) {
    // P1 - Hollow Buff Effects
    const buffConfigs = extractConfigBlock(spell.block, 'buffConfig');
    for (const bc of buffConfigs) {
      const effects = extractEffects(bc);
      for (const eff of effects) {
        if (hasIdNameDesc(eff) && !hasAnyKey(eff, BUFF_CONCRETE_KEYS)) {
          const effName = extractValue(eff, 'name') || 'unnamed';
          findings.push({
            code: 'P1',
            spellId: spell.id,
            message: `buff effect '${effName}' is hollow (no concrete values)`
          });
        }
      }
    }

    // P2 - Hollow Debuff Effects
    const debuffConfigs = extractConfigBlock(spell.block, 'debuffConfig');
    for (const dc of debuffConfigs) {
      const effects = extractEffects(dc);
      for (const eff of effects) {
        if (hasIdNameDesc(eff) && !hasAnyKey(eff, DEBUFF_CONCRETE_KEYS)) {
          const effName = extractValue(eff, 'name') || 'unnamed';
          findings.push({
            code: 'P2',
            spellId: spell.id,
            message: `debuff effect '${effName}' is hollow (no concrete values)`
          });
        }
      }
    }

    // P3 - Missing Damage Formulas
    const damageConfigs = extractConfigBlock(spell.block, 'damageConfig');
    for (const dc of damageConfigs) {
      if (!hasAnyKey(dc, DAMAGE_FORMULA_KEYS)) {
        findings.push({
          code: 'P3',
          spellId: spell.id,
          message: `damageConfig has no formula/baseDamage/dice fields`
        });
      }
    }

    // P4 - Missing Healing Formulas
    const healingConfigs = extractConfigBlock(spell.block, 'healingConfig');
    for (const hc of healingConfigs) {
      if (!hasAnyKey(hc, HEALING_FORMULA_KEYS)) {
        findings.push({
          code: 'P4',
          spellId: spell.id,
          message: `healingConfig has no formula/baseHealing/shieldFormula/hotFormula fields`
        });
      }
    }

    // P5 - Hollow Control Effects
    const controlConfigs = extractConfigBlock(spell.block, 'controlConfig');
    for (const cc of controlConfigs) {
      const effects = extractEffects(cc);
      let hasHollowControl = false;

      for (const eff of effects) {
        if (hasIdNameDesc(eff)) {
          const configMatch = eff.match(/config\s*:\s*\{/);
          if (configMatch) {
            const configBlock = extractBracedContent(eff, eff.indexOf(configMatch[0]) + configMatch[0].length - 1);
            if (configBlock && !hasAnyKey(configBlock, CONTROL_SAVING_KEYS)) {
              hasHollowControl = true;
              const effName = extractValue(eff, 'name') || 'unnamed';
              findings.push({
                code: 'P5',
                spellId: spell.id,
                message: `control effect '${effName}' has no saveDC/saveType/duration in config`
              });
            }
          } else {
            if (!hasAnyKey(eff, CONTROL_SAVING_KEYS)) {
              hasHollowControl = true;
              const effName = extractValue(eff, 'name') || 'unnamed';
              findings.push({
                code: 'P5',
                spellId: spell.id,
                message: `control effect '${effName}' has no saveDC/saveType/duration`
              });
            }
          }
        }
      }

      // Also check the controlConfig itself if it has no effects
      if (effects.length === 0 && !hasAnyKey(cc, CONTROL_SAVING_KEYS)) {
        findings.push({
          code: 'P5',
          spellId: spell.id,
          message: `controlConfig has no effects and no saveDC/saveType/duration`
        });
      }
    }

    // P6 - Hollow Utility Effects
    const utilityConfigs = extractConfigBlock(spell.block, 'utilityConfig');
    for (const uc of utilityConfigs) {
      const effects = extractEffects(uc);
      const selectedEffects = extractSelectedEffects(uc);
      const allEffects = [...effects, ...selectedEffects];

      if (allEffects.length > 0) {
        for (const eff of allEffects) {
          if (hasIdNameDesc(eff) && !hasAnyKey(eff, UTILITY_CONCRETE_KEYS)) {
            const effName = extractValue(eff, 'name') || 'unnamed';
            findings.push({
              code: 'P6',
              spellId: spell.id,
              message: `utility effect '${effName}' is hollow (no concrete values)`
            });
          }
        }
      } else {
        if (!hasAnyKey(uc, UTILITY_CONCRETE_KEYS)) {
          findings.push({
            code: 'P6',
            spellId: spell.id,
            message: `utilityConfig has no effects and no concrete values`
          });
        }
      }
    }

    // P8 - Missing Effects Array
    for (const bc of buffConfigs) {
      if (hasKey(bc, 'buffType') && !hasKey(bc, 'effects')) {
        findings.push({
          code: 'P8',
          spellId: spell.id,
          message: `buffConfig has buffType but no effects array`
        });
      }
    }
    for (const dc of debuffConfigs) {
      if (hasKey(dc, 'debuffType') && !hasKey(dc, 'effects')) {
        findings.push({
          code: 'P8',
          spellId: spell.id,
          message: `debuffConfig has debuffType but no effects array`
        });
      }
    }
  }

  return { fileName, findings };
}

function main() {
  const files = collectFiles(DATA_DIRS);
  console.log(`\n========================================`);
  console.log(`  SPELL DATA RE-AUDIT`);
  console.log(`  Scanning ${files.length} files...`);
  console.log(`========================================\n`);

  let totalFindings = 0;
  const codeCounts = { P1: 0, P2: 0, P3: 0, P4: 0, P5: 0, P6: 0, P8: 0 };
  const fileResults = [];

  for (const file of files) {
    const result = auditFile(file);
    fileResults.push(result);
  }

  console.log(`=== REMAINING FINDINGS ===\n`);

  for (const result of fileResults) {
    if (result.findings.length === 0) {
      console.log(`${result.fileName}: 0 findings (CLEAN)`);
    } else {
      console.log(`${result.fileName}: ${result.findings.length} findings`);
      for (const f of result.findings) {
        console.log(`  - [${f.code}] ${f.spellId} ${f.message}`);
        codeCounts[f.code]++;
      }
    }
    totalFindings += result.findings.length;
  }

  console.log(`\n=== SUMMARY BY PATTERN ===`);
  for (const [code, count] of Object.entries(codeCounts)) {
    console.log(`  ${code}: ${count} findings`);
  }

  console.log(`\n=== TOTAL REMAINING: ${totalFindings} / 253 ===\n`);

  if (totalFindings === 0) {
    console.log(`ALL CLEAR - All 253 findings have been fixed!`);
  } else {
    console.log(`${totalFindings} findings still need fixing.`);
    const affectedFiles = fileResults.filter(r => r.findings.length > 0);
    console.log(`\nAffected files (${affectedFiles.length}):`);
    for (const f of affectedFiles) {
      console.log(`  ${f.fileName}: ${f.findings.length}`);
    }
  }
}

main();
