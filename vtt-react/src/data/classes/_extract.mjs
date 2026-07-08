import fs from 'fs';
// usage: node _extract.mjs <fileAbsPath> <exportName> <spellKey>
const [, , FILE, EXPORT, KEY] = process.argv;
const COPY = 'C:/Users/Daniel/AppData/Local/Temp/opencode/_extract_copy.mjs';
fs.copyFileSync(FILE, COPY);
const mod = await import('file:///' + COPY.replace(/\\/g, '/'));
const D = mod[EXPORT];
const spells = D[KEY];
const fmt = (o) => o == null ? '' : (typeof o === 'string' ? o : JSON.stringify(o));
for (const s of spells) {
  console.log('════════════════════════════════════════════════════════════');
  console.log(`L${s.level} [${s.id}]  "${s.name}"  (school=${s.typeConfig?.school}, type=${s.spellType})`);
  console.log(`  DESC: ${fmt(s.description)}`);
  const rc = s.resourceCost || {};
  if (rc.verbalText || rc.somaticText) {
    console.log(`  VERBAL: ${fmt(rc.verbalText)}`);
    console.log(`  SOMATIC: ${fmt(rc.somaticText)}`);
  }
  if (s.verbalText || s.somaticText) {
    console.log(`  VERBAL(top): ${fmt(s.verbalText)}`);
    console.log(`  SOMATIC(top): ${fmt(s.somaticText)}`);
  }
  // compact mechanics
  const dc = s.damageConfig;
  if (dc) console.log(`  DMG: ${dc.formula} ${JSON.stringify(dc.damageTypes)}${dc.dotConfig ? ' DoT:'+dc.dotConfig.damagePerTick+'/'+dc.dotConfig.duration+'r' : ''}${dc.savingThrow ? ' save '+dc.savingThrow.ability+' DC'+dc.savingThrow.difficultyClass : ''}`);
  const hc = s.healingConfig;
  if (hc) console.log(`  HEAL: ${hc.formula} (${hc.healingType})`);
  const bc = s.buffConfig;
  if (bc) for (const e of (bc.effects||[])) console.log(`  BUFF[${bc.buffType}]: ${e.name} :: ${e.mechanicsText||e.description}`);
  const dbc = s.debuffConfig;
  if (dbc) for (const e of (dbc.effects||[])) console.log(`  DEBUFF[${dbc.debuffType}]: ${e.name} :: ${e.mechanicsText||e.description}`);
  const cc = s.controlConfig;
  if (cc) for (const e of (cc.effects||[])) console.log(`  CTRL[${cc.controlType}]: ${e.name} :: ${e.description}`);
  const sm = s.specialMechanics || {};
  const smKeys = Object.keys(sm);
  if (smKeys.length) {
    for (const k of smKeys) {
      const v = sm[k];
      console.log(`  MECH[${k}]: ${typeof v === 'object' ? (v.description||JSON.stringify(v)) : v}`);
    }
  }
  // HP / self-harm cost
  if (rc.resourceFormulas?.health) console.log(`  HP COST: ${rc.resourceFormulas.health}`);
  if (s.bodyTollCost) console.log(`  BODYTOLL cost: ${s.bodyTollCost}`);
}
fs.unlinkSync(COPY);
