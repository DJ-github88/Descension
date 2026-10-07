import fs from 'fs';
import path from 'path';
import {
  HERITAGE_TRADITIONS, CLASS_PROVENANCE, CLASS_COMPATIBILITY_ALIASES,
  getClassNativeHeritageIds, getClassHeritageAccess, resolveClassHeritageId,
  withClassHeritageMetadata
} from '../classHeritageRegistry';
import { ALL_CLASSES_DATA, BASE_CLASSES_DATA } from '../classes';
import { CLASS_DISPLAY_DATA, CLASS_DISPLAY_ALIASES } from '../classes/classDisplayData';
import { RACE_DATA, getSubraceData, getFullRaceData } from '../raceData';
import { isClassCompatible } from '../../utils/pointBuySystem';
import { validateCharacterSelection } from '../../utils/characterUtils';

jest.mock('../../store/customLineageStore', () => ({
  __esModule: true, default: { getState: () => ({ getLineage: () => null }) }
}));

const blueprint = fs.readFileSync(path.resolve(__dirname, '../../../../LORE_CANON_AND_HERITAGE_BLUEPRINT.md'), 'utf8');
const inverseSection = blueprint.split('## 7. Complete ancestry-to-native-class map')[1].split('## 8.')[0];
const specRows = inverseSection.split('\n').filter(line => /^\|.*`[^`]+`/.test(line)).map(line => {
  const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
  return { name: cells[0], id: cells[1].replace(/`/g, ''), classes: cells[2].split(', ').map(name => name.replace(/\s*\([^)]*\)/g, '')) };
});

test('registry matches the independently authored blueprint inverse and all 104 native relationships', () => {
  expect(specRows).toHaveLength(25);
  expect(Object.keys(CLASS_PROVENANCE)).toHaveLength(21);
  expect(Object.keys(HERITAGE_TRADITIONS)).toHaveLength(25);
  expect(specRows.reduce((total, row) => total + row.classes.length, 0)).toBe(104);
  specRows.forEach(row => {
    expect(HERITAGE_TRADITIONS[row.id].classes.slice().sort()).toEqual(row.classes.slice().sort());
    expect(new Set(HERITAGE_TRADITIONS[row.id].classes).size).toBe(row.classes.length);
    expect(getSubraceData(HERITAGE_TRADITIONS[row.id].raceId, row.id)).not.toBeNull();
    expect(getFullRaceData(HERITAGE_TRADITIONS[row.id].raceId, row.id).combinedTraits.normalClassPaths.slice().sort())
      .toEqual(row.classes.slice().sort());
  });
  Object.keys(CLASS_PROVENANCE).forEach(name => {
    expect(getClassNativeHeritageIds(name).sort()).toEqual(specRows.filter(row => row.classes.includes(name)).map(row => row.id).sort());
  });
});

test('registry also matches the separate forward dossier tables rather than only its inverse', () => {
  const nameToId = Object.fromEntries(specRows.map(row => [row.name, row.id]));
  const dossiers = blueprint.split('## 6. The 21 class heritage dossiers')[1].split('## 7.')[0]
    .split(/^### C-\d+: /m).slice(1);
  expect(dossiers).toHaveLength(21);
  dossiers.forEach(dossier => {
    const name = dossier.split(' — ')[0];
    const rows = [...dossier.matchAll(/^\| (.+?) — [NA](?:\/[NA])?†? \|/gm)].map(match => nameToId[match[1]]);
    expect(rows.every(Boolean)).toBe(true);
    expect(rows.sort()).toEqual(getClassNativeHeritageIds(name).sort());
  });
});

test('creation and validation agree across all 525 canonical class/heritage combinations', () => {
  specRows.forEach(row => {
    const raceId = HERITAGE_TRADITIONS[row.id].raceId;
    Object.keys(CLASS_PROVENANCE).forEach(name => {
      const expected = row.classes.includes(name);
      expect(isClassCompatible(name, raceId, row.id)).toBe(expected);
      expect(validateCharacterSelection(raceId, row.id, ALL_CLASSES_DATA[name], null).isValid).toBe(expected);
    });
  });
});

test('race-level filtering uses actual parent membership instead of a wrong ID prefix', () => {
  expect(isClassCompatible('Arcanoneer', 'neth')).toBe(true);
  expect(isClassCompatible('Arcanoneer', 'fexrick')).toBe(true);
  expect(isClassCompatible('Spellguard', 'solari')).toBe(true);
  expect(isClassCompatible('Pyrofiend', 'human')).toBe(false);
  expect(isClassCompatible('Animist', 'myrathil', 'deepling_myrathil')).toBe(true);
});

test('legacy heritage names and keys resolve while a different race cannot borrow the ID', () => {
  expect(resolveClassHeritageId('neth', 'Hallowed Neth')).toBe('kessen_neth');
  expect(resolveClassHeritageId('mimir', 'tethered')).toBe('tethered_mimir');
  expect(resolveClassHeritageId('florae', 'oken_florae')).toBe('florae_unified');
  expect(resolveClassHeritageId('human', 'Ordu (Disguised Remnant)')).toBe('ordan_human');
  expect(getClassHeritageAccess('Pyrofiend', 'human', 'korr_solari').selectable).toBe(false);
  expect(Object.keys(RACE_DATA)).toHaveLength(10);
});

test('outsiders need complete, sourced acquired qualifications rather than generic approval', () => {
  const profile = CLASS_PROVENANCE.Gambit;
  const qualification = { verified: true, source: 'Recorded House initiation', fulfilledRequirements: profile.requirements };
  expect(isClassCompatible('Gambit', 'human', 'thalren_human')).toBe(false);
  expect(isClassCompatible('Gambit', 'human', 'thalren_human', { approved: true })).toBe(false);
  expect(isClassCompatible('Gambit', 'human', 'thalren_human', { qualification: { ...qualification, fulfilledRequirements: ['house_wager'] } })).toBe(false);
  expect(isClassCompatible('Gambit', 'human', 'thalren_human', { qualification: { ...qualification, fulfilledRequirements: profile.requirements.join(',') } })).toBe(false);
  expect(isClassCompatible('Gambit', 'human', 'thalren_human', { qualification })).toBe(true);
  expect(validateCharacterSelection('human', 'thalren_human', ALL_CLASSES_DATA.Gambit, null, { qualification }).isValid).toBe(true);
});

test('current incompatible states trump normal paths and qualified exceptions', () => {
  const qualification = { verified: true, source: 'Recorded surgery', fulfilledRequirements: CLASS_PROVENANCE.Warden.requirements };
  const options = { qualification, bodyStates: ['surgery_incompatible_body'] };
  expect(isClassCompatible('Warden', 'groven', 'morgh_groven', options)).toBe(false);
  expect(isClassCompatible('Warden', 'astril', 'silath_astril', options)).toBe(false);
  expect(validateCharacterSelection('groven', 'morgh_groven', ALL_CLASSES_DATA.Warden, null, options).isValid).toBe(false);
  expect(isClassCompatible('Shaper', null, null, { bodyStates: ['fixed_body_without_shaping_interface'] })).toBe(false);
});

test('Arcanoneer interface restrictions do not falsely exclude every Riven engineered route', () => {
  const qualification = { verified: true, source: 'Proving Grounds training', fulfilledRequirements: CLASS_PROVENANCE.Arcanoneer.requirements };
  const context = { qualification, bodyStates: ['severed_first_contract'] };
  expect(isClassCompatible('Arcanoneer', 'neth', 'drun_neth', { ...context, method: 'first_contract' })).toBe(false);
  expect(isClassCompatible('Arcanoneer', 'neth', 'drun_neth', { ...context, method: 'engineered' })).toBe(true);
});

test('Skald Martyr normal method is Ironclad and Witness is extra acquired training', () => {
  expect(getClassHeritageAccess('Martyr', 'human', 'skald_human').method).toBe('ironclad');
  expect(isClassCompatible('Martyr', 'human', 'skald_human', { method: 'witness' })).toBe(false);
  expect(isClassCompatible('Martyr', 'human', 'skald_human', { method: 'witness', qualification: {
    verified: true, source: 'Witness school training', fulfilledRequirements: ['protective_interface', 'witness_training']
  } })).toBe(true);
});

test('Nereid lookup aliases stay compatible without becoming three extra base classes', () => {
  expect(Object.keys(BASE_CLASSES_DATA)).toHaveLength(21);
  expect(Object.keys(ALL_CLASSES_DATA)).toHaveLength(24);
  expect(CLASS_DISPLAY_DATA).toHaveLength(21);
  expect(CLASS_DISPLAY_ALIASES).toHaveLength(3);
  Object.entries(CLASS_COMPATIBILITY_ALIASES).forEach(([name, alias]) => {
    expect(ALL_CLASSES_DATA[name].name).toBe(alias.className);
    expect(ALL_CLASSES_DATA[name].isCompatibilityAlias).toBe(true);
    expect(isClassCompatible(name, 'myrathil', 'deepling_myrathil')).toBe(true);
    expect(isClassCompatible(name, 'myrathil', 'shoreling_myrathil')).toBe(false);
  });
});

test('custom metadata is preserved and legacy existing characters get acquisition warnings', () => {
  const custom = { name: 'Gambit', isCustom: true, restrictions: { allowedSubraces: ['thalren_human'] } };
  expect(withClassHeritageMetadata('Gambit', custom)).toBe(custom);
  expect(validateCharacterSelection('human', 'thalren_human', custom, null).isValid).toBe(true);
  const legacy = validateCharacterSelection('human', 'thalren_human', ALL_CLASSES_DATA.Gambit, null, { existingCharacter: true });
  expect(legacy.isValid).toBe(true);
  expect(legacy.warnings).toHaveLength(1);
  const effectsImplemented = Object.entries(CLASS_PROVENANCE).filter(([, profile]) => profile.heritageEffectsImplemented).map(([name]) => name).sort();
  expect(effectsImplemented).toEqual(['Animist', 'Apex', 'Arcanoneer', 'Augur', 'Berserker', 'Chronarch', 'Crusader', 'False Prophet', 'Gambit', 'Harbinger', 'Inquisitor', 'Lunarch', 'Martyr', 'Minstrel', 'Plaguebringer', 'Pyrofiend', 'Revenant', 'Shaper', 'Spellguard', 'Toxicologist', 'Warden']);
});
