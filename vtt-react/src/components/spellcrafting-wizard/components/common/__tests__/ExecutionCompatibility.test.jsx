import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { CLASS_DATA_MAP } from '../../../../../data/classSpellGenerator';
import { catalogueDraft } from '../../../../../services/catalogueAbility.cjs';
import { setAreaRollProposalForTest, setAreaRollApprovalForTest, EFFECT_CAPABILITY } from '../../../../../services/authoredAbility';
import { serializeSpell, deserializeSpell } from '../../../core/utils/spellSerializer';
import { explainExecution, authoredInventory, readableReason, isCreatureRef, STATES } from '../../../utils/executionCompatibility';
import ExecutionCompatibility from '../ExecutionCompatibility';
import AuthoredAdmission from '../../library/AuthoredAdmission';
import useGameStore from '../../../../../store/gameStore';

const ID = '11111111-1111-4111-8111-111111111111';
const ctx = { roomId: 'room-secret-7', classId: 'arcanoneer', shared: true, gm: false };
const wrap = d => ({ ...JSON.parse(JSON.stringify(d)), authoredDefinitionId: ID, authoredDraft: JSON.parse(JSON.stringify(d)) });
const base = (over = {}) => ({ name: 'Cinder Lash', description: 'A lash of embers.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'ember' },
  effectTypes: ['damage'], damageConfig: { damageType: 'direct', elementType: 'ember', formula: '2d6', resolution: 'DICE' },
  resourceCost: { actionPoints: 1, mana: 3 }, targetingConfig: { targetingType: 'single', maxTargets: 1, rangeDistance: 30, rangeType: 'ranged', targetRestrictions: ['enemy'] }, ...over });
const bundle = (policy = 'gm-manual') => base({ name: 'Hobbling Ember', effectTypes: ['control', 'damage'],
  controlConfig: { authoredCondition: { profile: EFFECT_CAPABILITY, effect: 'movement', movementFeet: -10, label: 'Hobbled', expiryPolicy: policy, durationText: 'Until the embers cool', gmNote: 'PRIVATE-GM-NOTE do not show' } } });
const composedPeriodic = () => base({
  name: 'Cinder Brand', description: 'Immediate damage plus periodic ticks.',
  spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
  effectTypes: ['damage', 'control'],
  damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' },
  controlConfig: { authoredCondition: { profile: EFFECT_CAPABILITY, effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Cinder Brand',
    expiryPolicy: 'target-start-count', occurrences: 3, durationText: 'While the cinders glow', gmNote: 'GM resolves range before confirming.' } },
  resourceCost: { actionPoints: 1, mana: 2 }
});
const periodic = () => base({ name: 'Smoulder', damageConfig: { damageType: 'direct', elementType: 'ember', formula: '2d6', resolution: 'DICE', hasDotEffect: true, dotConfig: { enabled: true, duration: 3, tickFrequency: 'round' } } });
const summon = () => base({ name: 'Call Hound', effectTypes: ['summoning'], damageConfig: null, summoningConfig: { creatures: [{ id: 'hound', quantity: 1 }], duration: 5 } });
const transform = () => base({ name: 'Wolf Shape', effectTypes: ['transformation'], damageConfig: null, transformationConfig: { transformType: 'creature', duration: 10 } });
const area = () => base({ name: 'Arcane Pulse', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '2d6', resolution: 'DICE' },
  targetingConfig: { targetingType: 'area', aoeShape: 'circle', aoeParameters: { radius: 15 }, rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'], maxTargets: 8 } });

afterEach(() => { setAreaRollProposalForTest(false); setAreaRollApprovalForTest(undefined); useGameStore.setState({ isInMultiplayer: false, isGMMode: false }); });

describe('states come only from the existing validator', () => {
  test('supported immediate ability: executable, no manual parts, price and target shown', () => {
    const view = explainExecution(wrap(base()), ctx);
    expect(view.state).toBe(STATES.EXECUTABLE);
    expect(view.manual).toEqual([]);
    expect(view.automated.join(' ')).toMatch(/damage · 2d6 ember/);
    expect(view.automated.join(' ')).toMatch(/1 AP, 3 mana/);
  });
  test('bundle with GM-removed effect: partially automated with the exact manual responsibility', () => {
    const view = explainExecution(wrap(bundle()), ctx);
    expect(view.state).toBe(STATES.PARTIAL);
    expect(view.manual.join(' ')).toMatch(/GM removes it \(authored duration: Until the embers cool\)/);
  });
  test('accepted M4B Restorative Prayer: partial, whole catalogue record kept, class price named', () => {
    const rec = CLASS_DATA_MAP.Martyr.spells.find(s => s.id === 'martyr_restorative_prayer');
    const prepared = catalogueDraft(rec, 'martyr', { authoredDefinitionId: ID, id: 'catalogue-martyr' });
    expect(prepared.ok).toBe(true);
    const view = explainExecution(prepared.draft, { ...ctx, classId: 'martyr' });
    expect(view.state).toBe(STATES.PARTIAL);
    expect(view.manual.join(' ')).toMatch(/whole record is preserved/);
    expect(view.automated.join(' ')).toMatch(/devotionGauge/);
    // Same record bound to the wrong class is refused by the validator, not by this module.
    expect(explainExecution(prepared.draft, { ...ctx, classId: 'minstrel' }).state).toBe(STATES.UNSUPPORTED);
  });
  test('gated M6A area spell is blocked pending the recorded decision; once approved it is partial with per-target adjudication', () => {
    setAreaRollApprovalForTest(null);
    const blocked = explainExecution(wrap(area()), ctx);
    expect(blocked.state).toBe(STATES.BLOCKED);
    expect(blocked.reasons[0].text).toMatch(/awaits creator confirmation/);
    expect(blocked.reasons[0].label).toBe('First detected blocker');
    setAreaRollApprovalForTest(undefined);
    setAreaRollProposalForTest(true);
    const open = explainExecution(wrap(area()), ctx);
    expect(open.state).toBe(STATES.PARTIAL);
    expect(open.manual.join(' ')).toMatch(/GM adjudicates each target/);
  });
  test.each([['periodic', periodic], ['summon', summon], ['transformation', transform]])('%s authors fine but is unsupported with a concrete reason and nothing removed', (_, make) => {
    const rec = wrap(make()), before = JSON.stringify(rec);
    const view = explainExecution(rec, ctx);
    expect(view.state).toBe(STATES.UNSUPPORTED);
    expect(view.reasons[0].text).toMatch(/\S/);
    expect(view.automated).toEqual([]);
    expect(JSON.stringify(rec)).toBe(before);
  });
});

describe('unsupported components never disappear', () => {
  test('validator wording is shown plainly and verbatim otherwise', () => {
    expect(explainExecution(wrap(periodic()), ctx).reasons[0].text).toBe('Stopped at "hasDotEffect": Prism cannot run this as authored.');
    expect(readableReason('Area roll procedure awaits creator confirmation; keep this area ability manual until approved.')).toMatch(/^Area roll procedure/);
    expect(explainExecution(wrap(summon()), ctx).preserved.map(i => i.label)).toContain('Summoning');
    expect(explainExecution(wrap(transform()), ctx).preserved.map(i => i.label)).toContain('Transformation');
  });
  test('multiple blockers: first blocker is exact, every authored section stays listed, others are not claimed individually', () => {
    const d = periodic(); d.effectTypes = ['damage', 'summoning', 'debuff']; d.summoningConfig = summon().summoningConfig; d.debuffConfig = { effects: [{ id: 'slow' }] };
    const view = explainExecution(wrap(d), ctx);
    expect(view.state).toBe(STATES.UNSUPPORTED);
    const labels = view.preserved.map(i => i.label);
    expect(labels).toEqual(expect.arrayContaining(['Damage over time (periodic)', 'Summoning', 'Debuff']));
    expect(view.reasons).toHaveLength(1);
    expect(view.reasons[0].label).toBe('First detected blocker');
    expect(view.notes.join(' ')).toMatch(/not a full diagnosis/);
  });
  test('inventory is descriptive: an inert default does not appear and is never labelled unsupported', () => {
    const d = base({ cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }, durationConfig: { durationType: 'instant' }, propagation: { method: 'none', behavior: '' } });
    expect(authoredInventory(wrap(d)).map(i => i.key)).toEqual(['damage']);
  });
});

describe('structural compatibility is not authorization', () => {
  test('wording separates structure from admission, ownership, resources and target; never claims a grant', () => {
    render(<ExecutionCompatibility record={wrap(base())} context={ctx} />);
    const text = screen.getByLabelText('Execution compatibility').textContent;
    expect(text).toMatch(/does not grant admission/);
    expect(text).toMatch(/room admission, your ownership, your current resources and the chosen target are checked when you cast/);
    expect(text).not.toMatch(/(already|now|has been|was|is currently) admitted|authorized|approved by the server/i);
  });
  test('next action differs for GM, player and outside a shared room', () => {
    expect(explainExecution(wrap(base()), { ...ctx, gm: true }).next.join(' ')).toMatch(/Admit this saved version/);
    expect(explainExecution(wrap(base()), ctx).next.join(' ')).toMatch(/Ask the GM/);
    expect(explainExecution(wrap(base()), { ...ctx, shared: false }).next.join(' ')).toMatch(/local cast runs as it always has and may spend/);
    expect(explainExecution(wrap(summon()), ctx).next.join(' ')).toMatch(/posts a manual notice in chat and applies nothing itself/);
  });
});

describe('wording never overclaims', () => {
  test.each([['supported', base], ['bundle', bundle]])('%s: not complete automation, not current cast eligibility, people still confirm', (_, make) => {
    const { container } = render(<ExecutionCompatibility record={wrap(make())} context={ctx} />);
    const text = container.textContent;
    expect(text).toMatch(/Still confirmed by people/);
    expect(text).toMatch(/owner approves the exact price, target and roll/);
    expect(text).toMatch(/GM confirms success and any final amount/);
    expect(text).toMatch(/not full automation|rest is yours or the GM/);
    expect(text).toMatch(/does not say you can cast it now/);
    expect(text).not.toMatch(/fully automat|can run this ability|(?<!not say )you can cast|ready to cast|will execute/i);
  });
  test('every unsupported or blocked result is labelled the first detected blocker and not a full diagnosis', () => {
    setAreaRollApprovalForTest(null);
    for (const make of [periodic, summon, transform, area]) {
      const view = explainExecution(wrap(make()), ctx);
      expect(view.reasons[0].label).toBe('First detected blocker');
      expect(view.notes.join(' ')).toMatch(/not a full diagnosis/);
    }
  });
  test('catalogue healing route also lists the target owner acceptance', () => {
    const rec = CLASS_DATA_MAP.Martyr.spells.find(s => s.id === 'martyr_restorative_prayer');
    const view = explainExecution(catalogueDraft(rec, 'martyr', { authoredDefinitionId: ID, id: 'c' }).draft, { ...ctx, classId: 'martyr' });
    expect(view.confirm.join(' ')).toMatch(/target's owner accepts the exact healing/);
  });
});

describe('privacy', () => {
  test('room id, GM note and record hashes are never rendered', () => {
    const { container } = render(<ExecutionCompatibility record={wrap(bundle())} context={{ ...ctx, gm: false }} />);
    const text = container.textContent;
    expect(text).not.toMatch(/room-secret-7/);
    expect(text).not.toMatch(/PRIVATE-GM-NOTE/);
    expect(text).not.toMatch(/[0-9a-f]{64}/);
    expect(text).toMatch(/Until the embers cool/); // the authored duration is public table text
  });
  test('catalogue source record text is not echoed', () => {
    const rec = CLASS_DATA_MAP.Martyr.spells.find(s => s.id === 'martyr_restorative_prayer');
    const prepared = catalogueDraft(rec, 'martyr', { authoredDefinitionId: ID, id: 'catalogue-martyr' });
    const { container } = render(<ExecutionCompatibility record={prepared.draft} context={{ ...ctx, classId: 'martyr' }} />);
    expect(container.textContent).not.toContain(prepared.draft.catalogueSource.recordHash);
    expect(container.textContent).not.toContain(rec.description);
  });
});

describe('save and reopen stability', () => {
  test.each([['supported', base], ['bundle', bundle], ['periodic', periodic], ['summon', summon], ['transformation', transform]])('%s: identical explanation after three serialize/deserialize saves', (_, make) => {
    const first = explainExecution(wrap(make()), ctx);
    let d = make();
    for (let i = 0; i < 3; i++) d = deserializeSpell(serializeSpell(d));
    const again = { ...JSON.parse(JSON.stringify(d)), authoredDefinitionId: ID, authoredDraft: JSON.parse(JSON.stringify(d)) };
    const view = explainExecution(again, ctx);
    expect(view.state).toBe(first.state);
    expect(view.reasons).toEqual(first.reasons);
    expect(view.preserved).toEqual(first.preserved);
  });
  test('draft wrapper explains the same as the record wrapper and says the saved copy counts', () => {
    const d = base();
    const { container } = render(<ExecutionCompatibility draft={d} variant="draft" context={ctx} />);
    expect(container.textContent).toMatch(/saved library copy is checked again/);
    expect(container.querySelector('[data-state]').dataset.state).toBe(explainExecution(wrap(d), ctx).state);
  });
});

describe('cannot spend or change anything', () => {
  test('renders no buttons, links or form controls, and does not mutate the record', () => {
    const rec = wrap(periodic()), before = JSON.stringify(rec);
    const { container } = render(<ExecutionCompatibility record={rec} context={{ ...ctx, gm: true }} />);
    expect(container.querySelectorAll('button, a, input, select, textarea, [role="button"]')).toHaveLength(0);
    expect(JSON.stringify(rec)).toBe(before);
  });
  test('module has no import of any cast, payment, consequence or store-writing service', () => {
    const fs = require('fs'), path = require('path');
    const files = [path.join(__dirname, '..', 'ExecutionCompatibility.jsx'), path.join(__dirname, '..', '..', '..', 'utils', 'executionCompatibility.js')];
    for (const f of files) {
      const imports = fs.readFileSync(f, 'utf8').split('\n').filter(l => /^import /.test(l)).join('\n');
      expect(imports).not.toMatch(/spellConsequence|spellPayments|manualActionGate|weaponStrike|characterStore|combatStore|requestActorEvent/);
    }
    expect(fs.readFileSync(files[0], 'utf8')).not.toMatch(/setState|onClick|dispatch/);
  });
  test('supported-path wording still names the existing GM admission action', () => {
    const view = explainExecution(wrap(base()), { ...ctx, gm: true });
    expect(view.next[0]).toContain('Admit this saved version');
    expect(within(render(<ExecutionCompatibility record={wrap(base())} context={ctx} />).container).getByRole('status').textContent).toMatch(/Structurally compatible/);
  });
});

describe('route-specific execution compatibility', () => {
  test('combined immediate + periodic spell is partially automated for a PC caster route', () => {
    const view = explainExecution(wrap(composedPeriodic()), ctx);
    expect(view.state).toBe(STATES.PARTIAL);
    expect(view.automated.join(' ')).toMatch(/ember damage 1d6\+2/);
    expect(view.automated.join(' ')).toMatch(/blight damage 1d4 per tick/);
    expect(view.confirm.join(' ')).toMatch(/owner approves the exact price, target and roll/);
    expect(view.manual.join(' ')).toMatch(/Resolving periodic ticks: 3 ticks recorded automatically at target turn start/);
  });

  test('combined immediate + periodic spell evaluated for a creature route is refused with plain-language route restriction', () => {
    const view = explainExecution(wrap(composedPeriodic()), { ...ctx, route: 'creature' });
    expect(view.state).toBe(STATES.UNSUPPORTED);
    expect(view.summary).toMatch(/Structurally compatible with a Prism route, but not executable through this creature source/);
    expect(view.reasons).toEqual([{ label: 'Route restriction', text: expect.stringMatching(/immediate \+ periodic.*primary owner PC source/) }]);
    expect(view.automated).toEqual([]);
    expect(view.manual[0]).toMatch(/immediate \+ periodic.*primary owner PC source/);
    expect(view.manual[1]).toMatch(/Resolving periodic ticks: 3 ticks recorded automatically/);
    expect(view.preserved.map(i => i.label)).toEqual(['Damage', 'Condition or movement effect']);
    expect(view.next.join(' ')).toMatch(/Keep playing it by hand/);
    expect(view.next.join(' ')).toMatch(/change what the route restriction above names/);
  });

  test('exact creature sourceRef in context triggers the same creature route refusal and explains the restriction', () => {
    const sourceRef = { kind: 'creature', mapId: 'arena', tokenId: 'wolf-1', instanceId: 'inc-1' };
    const view = explainExecution(wrap(composedPeriodic()), { ...ctx, sourceRef });
    expect(view.state).toBe(STATES.UNSUPPORTED);
    expect(view.reasons[0].label).toBe('Route restriction');
    expect(view.reasons[0].text).toMatch(/primary owner PC source/);
  });

  test('sourceRef detection cannot misclassify a character or non-creature reference as creature', () => {
    const charRef = { kind: 'character', characterId: 'hero-1', userId: 'user-1' };
    expect(isCreatureRef(charRef)).toBe(false);
    expect(isCreatureRef({ kind: 'party', partyId: 'p-1' })).toBe(false);
    expect(isCreatureRef(null)).toBe(false);
    expect(isCreatureRef(undefined)).toBe(false);
    expect(isCreatureRef({ kind: 'creature', mapId: 'arena', tokenId: 't1', instanceId: 'i1' })).toBe(true);
    expect(isCreatureRef({ mapId: 'arena', tokenId: 't1', instanceId: 'i1' })).toBe(true);
    // When evaluated with a character sourceRef, the PC composition remains partially automated (not route-refused)
    const view = explainExecution(wrap(composedPeriodic()), { ...ctx, sourceRef: charRef });
    expect(view.state).toBe(STATES.PARTIAL);
    expect(view.automated.join(' ')).toMatch(/ember damage 1d6\+2/);
    expect(view.confirm.join(' ')).toMatch(/owner approves the exact price, target and roll/);
  });

  test('eligible creature ability (direct damage) remains executable for creature route with creature-appropriate confirmations', () => {
    const view = explainExecution(wrap(base()), { ...ctx, route: 'creature', gm: true });
    expect(view.state).toBe(STATES.EXECUTABLE);
    expect(view.confirm).toEqual(['The GM confirms success and any final amount.']);
    expect(view.confirm.join(' ')).not.toMatch(/owner approves/);
    expect(view.next.join(' ')).toMatch(/Admit for this creature/);
    expect(view.next.join(' ')).not.toMatch(/cast from the action bar/);
  });

  test('rendered ExecutionCompatibility component reflects route restriction and hides Prism runs list', () => {
    const sourceRef = { kind: 'creature', mapId: 'arena', tokenId: 'wolf-1', instanceId: 'inc-1' };
    const { container } = render(<ExecutionCompatibility record={wrap(composedPeriodic())} context={{ ...ctx, sourceRef }} />);
    expect(container.querySelector('[data-state]').dataset.state).toBe('unsupported');
    expect(container.textContent).toMatch(/Structurally compatible with a Prism route, but not executable through this creature source/);
    expect(container.textContent).toMatch(/Route restriction/);
    expect(container.textContent).not.toMatch(/Prism runs/);
    expect(container.textContent).toMatch(/Played by hand/);
  });

  test('AuthoredAdmission with creature sourceRef: disables admit button and refuses immediate + periodic composition', () => {
    useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'room-secret-7' } });
    const sourceRef = { kind: 'creature', mapId: 'arena', tokenId: 'wolf-1', instanceId: 'inc-1' };
    const { unmount } = render(<AuthoredAdmission spell={wrap(composedPeriodic())} sourceRef={sourceRef} />);
    const admitBtn = screen.getByRole('button', { name: 'Admit for this creature' });
    expect(admitBtn).toBeDisabled();
    expect(screen.queryByText(/Exact creature source → one distinct creature; the GM confirms success/)).not.toBeInTheDocument();
    expect(screen.getByText(/Compatible definition, not executable by this creature source/)).toBeInTheDocument();
    unmount();
  });

  test('AuthoredAdmission with creature sourceRef: enables admit button for eligible creature definition', () => {
    useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'room-secret-7' } });
    const sourceRef = { kind: 'creature', mapId: 'arena', tokenId: 'wolf-1', instanceId: 'inc-1' };
    render(<AuthoredAdmission spell={wrap(base())} sourceRef={sourceRef} />);
    const admitBtn = screen.getByRole('button', { name: 'Admit for this creature' });
    expect(admitBtn).toBeEnabled();
  });
});
