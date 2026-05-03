/**
 * Fix Dreadnaught spell formatting issues:
 * 1. Add typeConfig.school, icon, tags to all spells
 * 2. Add cooldownConfig to all spells
 * 3. Add targetRestrictions to single-target damage spells
 * 4. Fix balance issues (Soul Rend duration, Death Embrace config, etc.)
 * 5. Replace off-theme spells (Cosmic Devourer, Soul Harvest redesign)
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'vtt-react/src/data/classes/dreadnaughtData.js');
let code = fs.readFileSync(filePath, 'utf8');

// ── 1. Add typeConfig.school/icon/tags + cooldownConfig per spell ──────────
const spellFixes = [
  // L2
  {
    id: 'dread_wraith_strike',
    school: 'necromancy', icon: 'Necrotic/Necrotic Strike', tags: ['damage', 'necrotic', 'melee', 'drp'],
    targetFix: { add: "targetRestrictions: ['enemy'],\n        maxTargets: 1" }
  },
  {
    id: 'dread_necrotic_touch',
    school: 'necromancy', icon: 'Necrotic/Drain Soul', tags: ['damage', 'healing', 'necrotic', 'touch', 'drp']
  },
  {
    id: 'dread_unholy_fortitude',
    school: 'abjuration', icon: 'Void/Void Tendrils', tags: ['buff', 'armor', 'defense', 'drp']
  },
  // L3
  {
    id: 'dread_necrotic_aura',
    school: 'necromancy', icon: 'Necrotic/Death Mark', tags: ['damage', 'necrotic', 'aoe', 'aura', 'drp']
  },
  {
    id: 'dread_blood_to_shadow',
    school: 'necromancy', icon: 'Necrotic/Blood Skull', tags: ['resource gain', 'drp', 'health conversion']
  },
  {
    id: 'dread_dark_armor',
    school: 'abjuration', icon: 'Void/Void Shield', tags: ['buff', 'resistance', 'protection', 'drp']
  },
  // L4
  {
    id: 'dread_vampiric_strike',
    school: 'necromancy', icon: 'Necrotic/Vampiric Touch', tags: ['damage', 'healing', 'necrotic', 'melee', 'drp'],
    targetFix: { add: "targetRestrictions: ['enemy'],\n        maxTargets: 1" }
  },
  {
    id: 'dread_soul_drain',
    school: 'necromancy', icon: 'Necrotic/Drain Soul', tags: ['damage', 'resource gain', 'necrotic', 'ranged', 'drp'],
    targetFix: { add: "targetRestrictions: ['enemy'],\n        maxTargets: 1" }
  },
  {
    id: 'dread_dark_empowerment',
    school: 'necromancy', icon: 'Necrotic/Necrotic Wither 1', tags: ['buff', 'strength', 'necrotic', 'drp']
  },
  // L5
  {
    id: 'dread_death_embrace',
    school: 'necromancy', icon: 'Necrotic/Necrotic Wither 2', tags: ['buff', 'resistance', 'healing', 'necrotic', 'drp']
  },
  {
    id: 'dread_necrotic_wave',
    school: 'necromancy', icon: 'Necrotic/Necrotic Wave', tags: ['damage', 'debuff', 'necrotic', 'aoe', 'line', 'drp']
  },
  {
    id: 'dread_abyssal_shield',
    school: 'abjuration', icon: 'Void/Void Shield', tags: ['defense', 'reflection', 'necrotic', 'drp', 'reaction']
  },
  // L6
  {
    id: 'dread_shadow_step',
    school: 'conjuration', icon: 'Utility/Phantom Dash', tags: ['movement', 'teleport', 'shadow', 'drp']
  },
  {
    id: 'dread_soul_rend',
    school: 'necromancy', icon: 'Necrotic/Drain Soul', tags: ['damage', 'debuff', 'necrotic', 'healing prevention', 'ranged', 'drp'],
    targetFix: { add: "targetRestrictions: ['enemy'],\n        maxTargets: 1" }
  },
  {
    id: 'dread_apocalypse_aura',
    school: 'necromancy', icon: 'Void/Consumed by Void', tags: ['damage', 'debuff', 'necrotic', 'aoe', 'drp']
  },
  // L7
  {
    id: 'dread_eternal_darkness',
    school: 'necromancy', icon: 'Void/Consumed by Void', tags: ['damage', 'debuff', 'terrain', 'darkness', 'necrotic', 'aoe', 'drp']
  },
  {
    id: 'dread_soul_harvest',
    school: 'necromancy', icon: 'Necrotic/Death Mark', tags: ['debuff', 'drp', 'resource gain', 'necrotic', 'aoe']
  },
  {
    id: 'dread_void_eruption',
    school: 'necromancy', icon: 'Void/Black Hole', tags: ['damage', 'necrotic', 'aoe', 'cone', 'drp']
  },
  // L8
  {
    id: 'dread_immortal_fortress',
    school: 'abjuration', icon: 'Void/Consumed by Void', tags: ['buff', 'transformation', 'immunity', 'resistance', 'drp']
  },
  {
    id: 'dread_soul_storm',
    school: 'necromancy', icon: 'Necrotic/Psionic Strike', tags: ['damage', 'healing', 'necrotic', 'aoe', 'drp']
  },
  {
    id: 'dread_abyssal_apocalypse',
    school: 'necromancy', icon: 'Void/Black Hole', tags: ['damage', 'debuff', 'necrotic', 'aoe', 'fear', 'drp']
  },
  // L9
  {
    id: 'dread_eternal_night',
    school: 'necromancy', icon: 'Void/Consumed by Void', tags: ['damage', 'debuff', 'terrain', 'darkness', 'necrotic', 'aoe', 'drp']
  },
  {
    id: 'dread_cosmic_devourer',
    school: 'necromancy', icon: 'Void/Black Hole', tags: ['transformation', 'damage', 'necrotic', 'drp']
  },
  {
    id: 'dread_oblivion_strike',
    school: 'necromancy', icon: 'Necrotic/Necrotic Wither 2', tags: ['damage', 'necrotic', 'execute', 'ultimate', 'drp'],
    targetFix: { add: "targetRestrictions: ['enemy'],\n        maxTargets: 1" }
  },
  // L10 (old dark_rebirth, retribution, cosmic_annihilation)
  {
    id: 'dread_retribution_aura',
    school: 'necromancy', icon: 'Necrotic/Empowering Aura', tags: ['buff', 'retaliation', 'necrotic', 'drp']
  },
  {
    id: 'dread_cosmic_annihilation',
    school: 'necromancy', icon: 'Void/Black Hole', tags: ['damage', 'necrotic', 'aoe', 'ultimate', 'drp']
  },
];

for (const fix of spellFixes) {
  const idStr = `id: '${fix.id}'`;
  const idx = code.indexOf(idStr);
  if (idx === -1) { console.warn('NOT FOUND:', fix.id); continue; }

  // Find the typeConfig block for this spell
  const typeConfigIdx = code.indexOf('typeConfig: {', idx);
  const afterBrace = typeConfigIdx + 'typeConfig: {'.length;

  // Check if school already added
  const snippet = code.slice(typeConfigIdx, typeConfigIdx + 120);
  if (snippet.includes('school:')) {
    console.log('Already has school:', fix.id);
  } else {
    const tagsLine = `\n        school: '${fix.school}',\n        icon: '${fix.icon}',\n        tags: ${JSON.stringify(fix.tags)},`;
    code = code.slice(0, afterBrace) + tagsLine + code.slice(afterBrace);
    console.log('Fixed typeConfig:', fix.id);
  }

  // Add targetRestrictions if needed
  if (fix.targetFix) {
    const targetIdx = code.indexOf(`id: '${fix.id}'`);
    const rangeDistIdx = code.indexOf('rangeDistance:', targetIdx);
    if (rangeDistIdx > 0 && rangeDistIdx - targetIdx < 800) {
      const lineEnd = code.indexOf('\n', rangeDistIdx);
      if (!code.slice(lineEnd, lineEnd + 100).includes('targetRestrictions')) {
        code = code.slice(0, lineEnd + 1) + '        ' + fix.targetFix.add + ',\n' + code.slice(lineEnd + 1);
        console.log('Added targetRestrictions:', fix.id);
      }
    }
  }
}

// ── 2. Add cooldownConfig before every tags line that lacks one ──────────
// Match "tags: [...'level N'..." lines not preceded by cooldownConfig
code = code.replace(
  /([ \t]+)(tags: \['[^']*(?:level \d|passive|starter|core mechanic)[^']*'(?:[^\]]*)\])/g,
  (match, indent, tagsLine, offset) => {
    // Check if cooldownConfig already precedes this tags line (within 80 chars)
    const preceding = code.slice(Math.max(0, offset - 80), offset);
    if (preceding.includes('cooldownConfig')) return match;
    return `${indent}cooldownConfig: {\n${indent}  type: 'none'\n${indent}},\n\n${indent}${tagsLine}`;
  }
);

// ── 3. Specific balance fixes ──────────────────────────────────────────────

// Soul Rend: 1 hour healing prevention → 1 minute
code = code.replace(
  /(id: 'soul_rend_prevention'[\s\S]{1,400}?durationValue: 1,\s*\n\s*durationType: ')hours(')/,
  "$1minutes$2"
);
code = code.replace(
  /(id: 'soul_rend_prevention'[\s\S]{1,400}?durationUnit: ')hours(')/,
  "$1minutes$2"
);

// Necrotic Wave: cost 40 → 30 DRP
code = code.replace(
  /(id: 'dread_necrotic_wave'[\s\S]{1,600}?resourceValues: \{ drp: )40(\s*\})/,
  '$130$2'
);

// Death Embrace: fix config description and damageTypes
const deIdx = code.indexOf("id: 'death_embrace_resistance'");
if (deIdx > 0) {
  const descStart = code.indexOf("description: '", deIdx);
  const descEnd = code.indexOf("'",  descStart + 14);
  code = code.slice(0, descStart + 14) + 'Resistance to all damage types for 1 minute (requires concentration)' + code.slice(descEnd);
  const dtIdx = code.indexOf("damageTypes: ['necrotic']", deIdx);
  if (dtIdx > 0 && dtIdx - deIdx < 400) {
    code = code.slice(0, dtIdx) + "damageTypes: ['slashing','piercing','bludgeoning','fire','cold','lightning','acid','thunder','necrotic','radiant','psychic','poison','force']" + code.slice(dtIdx + "damageTypes: ['necrotic']".length);
  }
  console.log('Fixed Death Embrace config');
}

// Eternal Night: 24-hour duration → 1 minute concentration
code = code.replace(
  /(id: 'dread_eternal_night'[\s\S]{1,1200}?terrainConfig[\s\S]{1,200}?durationValue: )24(,\s*\n\s*durationType: ')hours(')/g,
  '$11$2minutes$3'
);
code = code.replace(
  /(id: 'dread_eternal_night'[\s\S]{1,1200}?terrainConfig[\s\S]{1,200}?durationUnit: ')hours(')/g,
  "$1minutes$2"
);
code = code.replace(
  /(id: 'dread_eternal_night'[\s\S]{1,800}?debuffConfig[\s\S]{1,400}?durationValue: )24(,\s*\n\s*durationType: ')hours(')/,
  '$11$2minutes$3'
);
code = code.replace(
  /(id: 'dread_eternal_night'[\s\S]{1,800}?debuffConfig[\s\S]{1,400}?durationUnit: ')hours(')/,
  "$1minutes$2"
);
// Make it concentration
code = code.replace(
  /(id: 'dread_eternal_night'[\s\S]{1,800}?debuffConfig[\s\S]{1,400}?concentrationRequired: )false/,
  '$1true'
);

// Retribution Aura: full reflect → 50%, 1 hour → 1 minute
code = code.replace(
  /(id: 'retribution_aura_retaliation'[\s\S]{1,200}?formula: ')damage_taken(')/,
  "$1Math.floor(damage_taken * 0.5)$2"
);
code = code.replace(
  /(id: 'dread_retribution_aura'[\s\S]{1,600}?durationValue: 1,\s*\n\s*durationType: ')hours(')/,
  '$1minutes$2'
);
code = code.replace(
  /(id: 'dread_retribution_aura'[\s\S]{1,600}?durationUnit: ')hours(')/,
  "$1minutes$2"
);
// Make it dispellable
code = code.replace(
  /(id: 'dread_retribution_aura'[\s\S]{1,600}?canBeDispelled: )false/,
  '$1true'
);

// Immortal Fortress: fix Fortress Resistance description and damageTypes
const imfIdx = code.indexOf("id: 'immortal_fortress_resistance'");
if (imfIdx > 0) {
  const descStart = code.indexOf("description: '", imfIdx);
  const descEnd = code.indexOf("'", descStart + 14);
  code = code.slice(0, descStart + 14) + 'Resistance to all damage types not already immune (slashing, piercing, bludgeoning, fire, cold, lightning, acid, thunder, radiant, force)' + code.slice(descEnd);
  const dtIdx = code.indexOf("damageTypes: ['necrotic']", imfIdx);
  if (dtIdx > 0 && dtIdx - imfIdx < 500) {
    code = code.slice(0, dtIdx) + "damageTypes: ['slashing','piercing','bludgeoning','fire','cold','lightning','acid','thunder','radiant','force']" + code.slice(dtIdx + "damageTypes: ['necrotic']".length);
  }
  console.log('Fixed Immortal Fortress resistance');
}

// Abyssal Apocalypse: make HP reduction debuff dispellable
code = code.replace(
  /(id: 'abyssal_apocalypse_weakness'[\s\S]{1,300}?canBeDispelled: )false/,
  '$1true'
);

// Soul Drain: replace flat +5 DRP with damage-scaled gain
code = code.replace(
  /(id: 'dread_soul_drain'[\s\S]{1,500}?formula: )'5'(,\s*\n\s*description: ')Gain 5 DRP from soul drain(')/,
  "$1'Math.floor(damageDealt / 10)'$2Gain 1 DRP per 10 damage dealt (max 8 DRP)$3"
);

// Apocalypse Aura: remove undead ally buff, replace with shadow debuff
code = code.replace(
  /(id: 'dread_apocalypse_aura'[\s\S]{1,600}?buffConfig: \{[\s\S]*?buffType: ')statEnhancement('[\s\S]*?id: ')apocalypse_aura_empowerment('[\s\S]*?name: ')Apocalyptic Empowerment('[\s\S]*?description: ')Undead allies gain \+2 to attack and damage rolls('[\s\S]*?stat: ')attackDamageBonus('[\s\S]*?magnitude: 2[\s\S]*?targetRestrictions: \['undead', 'ally'\]\s*\n\s*\})/,
  (m) => {
    return m
      .replace("buffType: 'statEnhancement'", "buffType: 'statReduction'")
      .replace("id: 'apocalypse_aura_empowerment'", "id: 'apocalypse_aura_weakness'")
      .replace("name: 'Apocalyptic Empowerment'", "name: 'Apocalyptic Weakness'")
      .replace("description: 'Undead allies gain +2 to attack and damage rolls'", "description: 'Enemies in the aura suffer disadvantage on attack rolls against you'")
      .replace("stat: 'attackDamageBonus'", "stat: 'attackRolls'")
      .replace("targetRestrictions: ['undead', 'ally']", "targetRestrictions: ['enemy']");
  }
);

// Rename Cosmic Annihilation to be more thematic
code = code.replace(
  "name: 'Cosmic Annihilation'",
  "name: 'Void Annihilation'"
);
code = code.replace(
  "description: 'Unleash the ultimate power of darkness, annihilating everything within range.'",
  "description: 'You become the void itself — a yawning darkness that swallows all light, life, and hope in range. Targets that fail their save are not merely harmed; they are unmade, their essence dissolving into the darkness that feeds you.'"
);

// Rename Cosmic Devourer to Void Incarnate (more thematic)
code = code.replace(
  "name: 'Cosmic Devourer'",
  "name: 'Void Incarnate'"
);
code = code.replace(
  "description: 'Transform into a cosmic entity that devours everything in its path.'",
  "description: 'You surrender to the void within, allowing the darkness to consume your physical form entirely. You become a living shadow — incorporeal, ravenous, and terrifying. For a brief window, you are not a warrior. You are the darkness itself.'"
);

// Rename Void Eruption verbalText from latin cosmic to dark
code = code.replace("verbalText: 'Vacuum Eruptio!'", "verbalText: 'Tenebra Eruptio!'");

// Soul Harvest: rename to Death Mark with corrected name and description
const shNameIdx = code.indexOf("name: 'Soul Harvest'");
if (shNameIdx > 0) {
  code = code.slice(0, shNameIdx) + "name: 'Death Mark'" + code.slice(shNameIdx + "name: 'Soul Harvest'".length);
  const shDescIdx = code.indexOf("description: 'Harvest souls from defeated enemies, gaining massive DRP and temporary undead minions.'");
  if (shDescIdx > 0) {
    const newDesc = "description: 'You brand an enemy with a shadowed mark that hungers for pain. Each time the marked target deals damage to you, you gain bonus DRP equal to half the damage dealt — turning their aggression into your power. The mark persists for 1 minute or until the target is slain.'";
    code = code.slice(0, shDescIdx) + newDesc + code.slice(shDescIdx + "description: 'Harvest souls from defeated enemies, gaining massive DRP and temporary undead minions.'".length);
  }
  console.log('Renamed Soul Harvest to Death Mark');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('\nAll fixes applied successfully!');
