/**
 * Integration guard: every class with an entry in the guide registry must
 * produce a complete, renderable Resource System view model.
 */
import { buildResourceSystemView } from '../normalizeResourceSystem';
import { RESOURCE_SYSTEM_GUIDES, getResourceSystemGuide } from '../index';

import { ARCANONEER_DATA } from '../../classes/arcanoneerData';
import { CRUSADER_DATA } from '../../classes/crusaderData';
import { WARDEN_DATA } from '../../classes/wardenData';
import { AUGUR_DATA } from '../../classes/augurData';
import { CHRONARCH_DATA } from '../../classes/chronarchData';
import { ANIMIST_DATA } from '../../classes/animistData';
import { MARTYR_DATA } from '../../classes/martyrData';
import { TOXICOLOGIST_DATA } from '../../classes/toxicologistData';
import { BERSERKER_DATA } from '../../classes/berserkerData';
import { INQUISITOR_DATA } from '../../classes/inquisitorData';
import { SPELLGUARD_DATA } from '../../classes/spellguardData';
import { APEX_DATA } from '../../classes/apexData';
import { LUNARCH_DATA } from '../../classes/lunarchData';
import { MINSTREL_DATA } from '../../classes/minstrelData';
import { HARBINGER_DATA } from '../../classes/harbingerData';
import { PLAGUEBRINGER_DATA } from '../../classes/plaguebringerData';
import { PYROFIEND_DATA } from '../../classes/pyrofiendData';
import { SHAPER_DATA } from '../../classes/shaperData';
import { REVENANT_DATA } from '../../classes/revenantData';
import { FALSE_PROPHET_DATA } from '../../classes/falseProphetData';
import { GAMBIT_DATA } from '../../classes/gambitData';

const CLASS_DATA = {
 warden: WARDEN_DATA,
 augur: AUGUR_DATA,
 chronarch: CHRONARCH_DATA,
 animist: ANIMIST_DATA,
 martyr: MARTYR_DATA,
 toxicologist: TOXICOLOGIST_DATA,
 berserker: BERSERKER_DATA,
 inquisitor: INQUISITOR_DATA,
 spellguard: SPELLGUARD_DATA,
 apex: APEX_DATA,
 lunarch: LUNARCH_DATA,
 minstrel: MINSTREL_DATA,
 harbinger: HARBINGER_DATA,
 plaguebringer: PLAGUEBRINGER_DATA,
 pyrofiend: PYROFIEND_DATA,
 shaper: SHAPER_DATA,
 revenant: REVENANT_DATA,
 false_prophet: FALSE_PROPHET_DATA,
 gambit: GAMBIT_DATA,
 arcanoneer: ARCANONEER_DATA,
 crusader: CRUSADER_DATA,
};

describe('resource system guides', () => {
 it('covers every registered class with a matching data file', () => {
  const registeredIds = Object.keys(RESOURCE_SYSTEM_GUIDES);
  expect(registeredIds.sort()).toEqual(Object.keys(CLASS_DATA).sort());
 });

 describe.each(Object.keys(CLASS_DATA))('%s', (classId) => {
  const classData = CLASS_DATA[classId];
  const view = buildResourceSystemView(classData);

  it('builds a renderable view model', () => {
   expect(view).not.toBeNull();
   expect(view.classId).toBe(classId);
  });

  it('has hero content', () => {
   expect(view.hero.title).toBeTruthy();
   expect(view.hero.tagline).toBeTruthy();
   expect(view.hero.archetype).toBeTruthy();
   expect(view.hero.vitals.length).toBeGreaterThanOrEqual(3);
   expect(view.hero.vitals.length).toBeLessThanOrEqual(4);
   view.hero.vitals.forEach((vital) => {
    expect(vital.icon).toBeTruthy();
    expect(vital.label).toBeTruthy();
    expect(vital.value).toBeTruthy();
   });
  });

  it('has a complete essentials loop', () => {
   const loop = view.essentials.loop;
   ['gain', 'hold', 'spend', 'risk'].forEach((beat) => {
    expect(loop[beat]).toBeTruthy();
    expect(loop[beat].title).toBeTruthy();
    expect(loop[beat].text).toBeTruthy();
    expect(loop[beat].icon).toBeTruthy();
   });
   expect(view.essentials.exampleTurn).toBeTruthy();
   expect(view.essentials.weaveIn.length).toBe(3);
  });

  it('has a usable quick start table', () => {
   const quickStart = view.essentials.quickStart;
   expect(quickStart).toBeTruthy();
   expect(quickStart.headers).toHaveLength(3);
   expect(quickStart.rows.length).toBeGreaterThanOrEqual(4);
   expect(quickStart.rows.length).toBeLessThanOrEqual(8);
   quickStart.rows.forEach((row) => expect(row).toHaveLength(3));
  });

  it('routes legacy content into deep dive or reference', () => {
   expect(view.deepDive.length + view.reference.length).toBeGreaterThan(0);
  });
 });

 it('gives each guide a distinct archetype and tagline', () => {
  const archetypes = Object.keys(CLASS_DATA).map(
   (classId) => getResourceSystemGuide(classId).archetype
  );
  expect(new Set(archetypes).size).toBe(archetypes.length);

  const taglines = Object.keys(CLASS_DATA).map(
   (classId) => getResourceSystemGuide(classId).tagline
  );
  expect(new Set(taglines).size).toBe(taglines.length);
 });
});
