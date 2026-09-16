import {
 buildResourceSystemView,
 buildSphereGenerationTable,
} from '../normalizeResourceSystem';
import { ARCANONEER_DATA } from '../../classes/arcanoneerData';
import { CRUSADER_DATA } from '../../classes/crusaderData';

describe('buildResourceSystemView', () => {
 it('returns null for classes without an authored guide', () => {
  expect(buildResourceSystemView({ id: 'not_a_class', resourceSystem: {} })).toBeNull();
  expect(buildResourceSystemView(null)).toBeNull();
 });

 describe('Arcanoneer', () => {
  const view = buildResourceSystemView(ARCANONEER_DATA);

  it('builds the hero from the legacy title plus authored copy', () => {
   expect(view).not.toBeNull();
   expect(view.hero.title).toBe('Spheres: The Elemental Chemist');
   expect(view.hero.archetype).toBe('Rolling Dice Pool');
   expect(view.hero.vitals).toHaveLength(4);
  });

  it('has a four-beat core loop and a quick start table', () => {
   expect(Object.keys(view.essentials.loop)).toEqual(
    expect.arrayContaining(['gain', 'hold', 'spend', 'risk'])
   );
   expect(view.essentials.exampleTurn).toBeTruthy();
   expect(view.essentials.quickStart.rows).toHaveLength(8);
   expect(view.essentials.weaveIn).toHaveLength(3);
  });

  it('replaces the legacy steps with the authored essentials loop', () => {
   expect(view.deepDive.find((section) => section.kind === 'steps')).toBeUndefined();
  });

  it('skips the legacy action table in favor of the interactive finder', () => {
   expect(view.deepDive.find((section) => section.kind === 'actionProfiles')).toBeUndefined();
   expect(view.deepDive.find((section) => section.id === 'combinationMatrix')).toBeTruthy();
  });

  it('drops the excluded stale sections', () => {
   expect(view.deepDive.find((section) => section.id === 'baseVsRecipes')).toBeUndefined();
   expect(
    view.deepDive.find((section) => section.id === 'strategicConsiderations')
   ).toBeUndefined();
  });

  it('uses the canonical rewrite of the practical example', () => {
   const example = view.deepDive.find((section) => section.id === 'practicalExample');
   expect(example).toBeTruthy();
   expect(example.content).toContain('Rime');
   expect(example.content).not.toContain('Frost + Nature');
  });

  it('canonicalizes the wyrd table and keeps lookup tables in reference', () => {
   const ids = view.reference.map((section) => section.id);
   expect(ids).toContain('chaosEffectsTable');
   expect(ids).toContain('manaCostTable');
   expect(ids).toContain('sphereGenerationTable');
   expect(ids).toContain('playingInPerson');

   const wyrd = view.reference.find((section) => section.id === 'chaosEffectsTable');
   expect(wyrd.title).toBe('Wyrd Effects Table (d20)');
  });

  it('generates the sphere chart from classResources instead of stale data', () => {
   const table = view.reference.find((section) => section.id === 'sphereGenerationTable');
   expect(table.rows).toHaveLength(8);
   expect(table.rows[0][1]).toBe('Arcane');
   expect(table.rows[7][1]).toBe('Wyrd');
   const legacy = ARCANONEER_DATA.resourceSystem.sphereGenerationTable;
   expect(table).not.toEqual(legacy);
  });

  it('filters playing-in-person content down to the canonical pieces', () => {
   const pip = view.reference.find((section) => section.id === 'playingInPerson');
   expect(pip.materials).toHaveLength(4);
   expect(pip.chart.rows).toHaveLength(8);
   expect(pip.colors).toHaveLength(8);
   const titles = pip.sections.map((section) => section.title);
   expect(titles).toEqual(
    expect.arrayContaining(['Turn-by-Turn Process', 'Budget-Friendly Alternatives'])
   );
   expect(titles.join(' ')).not.toMatch(/Combination Matrix|Quick Reference Card/);
  });
 });

 describe('Crusader', () => {
  const view = buildResourceSystemView(CRUSADER_DATA);

  it('builds essentials from the authored guide', () => {
   expect(view).not.toBeNull();
   expect(view.hero.vitals).toHaveLength(4);
   expect(view.essentials.quickStart.rows).toHaveLength(7);
   expect(view.essentials.loop.spend.title).toBe('Solar Judgment');
  });

  it('keeps cards and the generation table in deep dive', () => {
   const ids = view.deepDive.map((section) => section.id);
   expect(ids).toEqual(['cards', 'generationTable']);
   expect(view.reference).toHaveLength(0);
  });
 });
});

describe('buildSphereGenerationTable', () => {
 it('returns null for classes without elemental sphere data', () => {
  expect(buildSphereGenerationTable('Crusader')).toBeNull();
 });
});
