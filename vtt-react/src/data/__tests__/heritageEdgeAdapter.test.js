import {
  collectHeritageModifiers, translateHeritageEdge, summarizeHeritageEdgesForClass,
  getActiveHeritageAbilities, HERITAGE_MODIFIER_CAPS
} from '../heritageEdgeAdapter';
import { getHeritageEdge } from '../heritageEdgeContract';
import { CLASS_PROVENANCE } from '../classHeritageRegistry';

import { getClassNativeHeritageIds } from '../classHeritageRegistry';

test('summaries expose one implemented edge and cost per native heritage', () => {
  const animist = summarizeHeritageEdgesForClass('Animist');
  expect(animist.map(row => row.heritageId).sort()).toEqual([...getClassNativeHeritageIds('Animist')].sort());
  expect(animist.every(row => !row.implemented || (row.edge && row.cost))).toBe(true);
  expect(summarizeHeritageEdgesForClass('NotAClass')).toEqual([]);
});

test('edge application is gated by the checkable condition', () => {
  const character = { class: 'Berserker', race: 'human', subrace: 'skald_human' };
  const active = collectHeritageModifiers(character, { target: 'endangered_ally' });
  expect(active.applies).toBe(true);
  expect(active.capabilities).toContain('rapid_response_to_endangered_ally');
  expect(active.events.map(event => event.type)).toEqual(['heritage-edge', 'heritage-cost']);

  const inactive = collectHeritageModifiers(character, {});
  expect(inactive.applies).toBe(false);
  expect(inactive.capabilities).toEqual([]);
  expect(inactive.events).toEqual([]);
});

test('a pair with no authored edge receives nothing', () => {
  expect(collectHeritageModifiers({ class: 'Berserker', race: 'mimir', subrace: 'veiled_mimir' }).applies).toBe(false);
  expect(collectHeritageModifiers({ class: 'Berserker', race: 'mimir', subrace: 'veiled_mimir' }).reason).toBe('no-edge');
});

test('E-route edges only apply once the qualification is recorded', () => {
  const character = { class: 'Toxicologist', race: 'vreken', subrace: 'clean_vreken' };
  const context = { medium: 'deep_glow' };
  expect(collectHeritageModifiers(character, context)).toMatchObject({ applies: false, reason: 'not-qualified' });

  const qualification = { verified: true, source: 'Distillery apprenticeship record', fulfilledRequirements: CLASS_PROVENANCE.Toxicologist.requirements };
  const qualified = { ...character, classAcquisition: { Toxicologist: { qualification } } };
  const active = collectHeritageModifiers(qualified, context);
  expect(active.applies).toBe(true);
  expect(active.capabilities).toContain('diagnose_fluorescence_dose');
  expect(getActiveHeritageAbilities(qualified, context).capabilities).toContain('diagnose_fluorescence_dose');

  // Condition still gates even when qualified.
  expect(collectHeritageModifiers(qualified, {}).applies).toBe(false);
});

test('the consumer translates resource and self-damage costs and clamps numeric modifiers to the schema caps', () => {
  const revenant = translateHeritageEdge(getHeritageEdge('Revenant', 'clean_vreken'));
  expect(revenant.capabilities).toContain('named_spirit_stabilizes_return');
  expect(revenant.resourceCosts).toEqual([{ resource: 'phylacteryHP', magnitude: 5 }]);

  const lunar = translateHeritageEdge(getHeritageEdge('Lunarch', 'viridian_florae'));
  expect(lunar.selfDamage).toEqual([{ dice: 1, sides: 4 }]);

  const synthetic = { edge: { kind: 'attack_bonus', unit: 'flat', magnitude: 99 }, cost: { kind: 'risk', unit: 'capability', capability: 'x' } };
  expect(translateHeritageEdge(synthetic).modifiers.attackBonus).toBe(HERITAGE_MODIFIER_CAPS.attackBonus);
});
