import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpellConsequencePanel, { GmPanel } from '../SpellConsequencePanel';
import { ownerRefusal, gmRefusal, OWNER_REAPPROVAL_TEXT } from '../../../services/spellConsequence';
import { refOf } from '../../../services/actorConsequenceService';
import useGameStore from '../../../store/gameStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { useSpellConsequenceStore, checkSpellApproval, reapproveSpell, gmCheckSpellCommand } from '../../../services/spellConsequenceService';

let mockSupport;
const COOLDOWN = 'Cooldown active: 1 of 2 caster-turn starts remaining; releases at authenticated boundary 5 (combat c-1).';
const SCHEDULE = 'Structured expiry needs active authenticated turn tracking with this target in the exact roster (and schedule capacity). This applies to both recorded outcomes. Nothing was applied or charged.';

jest.mock('../../../store/gameStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'r' }, gridSize: 50, feetPerTile: 5 })) }));
jest.mock('../../../store/characterStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ currentCharacterId: 'caster' })) }));
jest.mock('../../../store/characterTokenStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ characterTokens: [] })) }));
jest.mock('../../../store/creatureStore', () => ({ __esModule: true, default: require('zustand').create(() => ({ creatureTokens: [], creatures: [] })) }));
jest.mock('../../../services/spellConsequence', () => ({ ...jest.requireActual('../../../services/spellConsequence'), supportSpell: () => mockSupport }));
jest.mock('../../../services/spellConsequenceService', () => ({
  useSpellConsequenceStore: require('zustand').create(() => ({ owner: null, ownerStatus: null, gmPending: {}, gmStatus: {} })),
  ownerSource: () => ({ token: require('../../../store/characterTokenStore').default.getState().characterTokens[0], ref: require('../../../services/actorConsequenceService').refOf(require('../../../store/characterTokenStore').default.getState().characterTokens[0]), mapId: 'm' }),
  restoreOwnerStatus: jest.fn(), spellDraftContext: () => ({}), loadSpellDraft: () => null, loadDiscardedSpellDrafts: () => [],
  saveSpellDraft: jest.fn(), discardSpellDraft: jest.fn(), closeOwnerPanel: jest.fn(), sendSpellApproval: jest.fn(),
  checkSpellApproval: jest.fn(), withdrawSpellApproval: jest.fn(), reapproveSpell: jest.fn(), refreshSpellApprovals: jest.fn(),
  gmAcceptSpell: jest.fn(), gmDeclineSpell: jest.fn(), gmCheckSpellCommand: jest.fn(), markSpellReconciled: jest.fn(),
  gmConditionResolution: () => null, saveGmConditionResolution: jest.fn(), refreshAuthoredAbilities: jest.fn(), changeAuthoredAdmission: jest.fn(),
  routeSpellCast: jest.fn(), creatureAttempt: () => null, saveCreatureRoll: jest.fn(), prepareCreatureAbility: jest.fn(),
  cancelCreatureAbility: jest.fn(), revalidateCreatureContext: jest.fn(), saveCreatureResolution: jest.fn(),
  designateVoluntaryCondition: jest.fn(), respondToVoluntaryCondition: jest.fn(), retainedTargetResponses: () => []
}));

const pc = { id: 'caster', mapId: 'm', ownerUserId: 'owner', character: { id: 'caster', name: 'Caster', stats: { intelligence: 14 }, actionPoints: { current: 4 }, mana: { current: 10 }, health: { current: 30, max: 40 } },
  state: { conditions: [], actorContract: { version: 1, kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'caster', instanceId: 'i-caster', ownerUid: 'owner', characterId: 'caster', primary: true, revision: 0 } } };
const foe = { id: 'B', mapId: 'm', name: 'Target', state: { currentHp: 20, maxHp: 20, tempHealth: 0, conditions: [],
  actorContract: { version: 1, kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'B', instanceId: 'i-B', revision: 0 } } };
const support = { supported: true, kind: 'damage', name: 'Witness Bolt', definitionId: 'witness', price: { ap: 1, mana: 2 }, payment: { affordable: true },
  cooldown: { type: 'none', value: 0 }, reading: { dice: [{ count: 1, sides: 8 }], constant: 0, reading: '1d8' }, damageTypes: ['ember'],
  raw: { targetingConfig: { rangeDistance: 30, rangeType: 'ranged' } } };
const approval = { roomId: 'r', approvalId: 'a1', source: refOf(pc), target: refOf(foe),
  spell: { kind: 'damage', name: 'Witness Bolt', definitionId: 'witness', damageTypes: ['ember'] },
  roll: { mode: 'physical', dice: [{ sides: 8, faces: [5] }], constant: 0, total: 5, reading: '1d8' }, price: { ap: 1, mana: 2 }, classPayment: null };

const tokens = () => { useCharacterTokenStore.setState({ characterTokens: [pc] }); useCreatureStore.setState({ creatureTokens: [foe], creatures: [] }); };
const owner = ownerStatus => { tokens(); useGameStore.setState({ isGMMode: false, isInMultiplayer: true, multiplayerRoom: { id: 'r' }, gridSize: 50, feetPerTile: 5 });
  useSpellConsequenceStore.setState({ owner: { spellId: 'witness', origin: {} }, ownerStatus, gmPending: {}, gmStatus: {} }); };
const gm = gmStatus => { tokens(); useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'r' }, gridSize: 50, feetPerTile: 5 });
  useSpellConsequenceStore.setState({ owner: null, ownerStatus: null, gmPending: { a1: { approval, contentHash: 'h' } }, gmStatus: { a1: gmStatus } }); };
beforeEach(() => { mockSupport = support; jest.clearAllMocks(); });

test('owner refusal keeps the server cooldown detail and spends nothing', () => {
  const outcome = ownerRefusal(true, 'ability_on_cooldown', COOLDOWN);
  expect(outcome.phase).toBe('refused');
  expect(outcome.message).toContain(COOLDOWN);
  expect(outcome.message).toMatch(/No payment was recorded/);
  expect(outcome.message).toMatch(/existing authenticated turn control/);
  expect(ownerRefusal(false, 'ability_on_cooldown', COOLDOWN).message).not.toMatch(/no payment/i);
});

test('owner retired clock keeps the GM-manual control visible', () => {
  const label = 'Cooldown blocked: its authenticated clock is retired or unavailable. Combat end/restart does not reset it; GM manual adjudication is required.';
  const outcome = ownerRefusal(true, 'cooldown_clock_retired', label);
  expect(outcome.message).toContain(label);
  expect(outcome.message).toMatch(/No payment was recorded/);
  expect(outcome.message).toMatch(/GM must resolve it manually/);
});

test('owner refusal detail that already says nothing was applied does not repeat a no-spend claim', () => {
  const outcome = ownerRefusal(true, 'class_payment_capacity', 'The complete gain does not fit; this composed payment stays manual. Nothing was applied.');
  expect(outcome.message).toMatch(/Nothing was applied/);
  expect(outcome.message).not.toMatch(/No payment was recorded|Nothing was spent/);
  expect(outcome.message.match(/Nothing was (?:applied|spent)/g)).toHaveLength(1);
});

test('GM structured-expiry refusal retains the reason, the no-charge statement and the existing control', () => {
  const outcome = gmRefusal(false, 'effect_schedule_unavailable', SCHEDULE);
  expect(outcome.phase).toBe('refused');
  expect(outcome.message).toContain(SCHEDULE);
  expect(outcome.message).toMatch(/Nothing was applied or charged/);
  expect(outcome.message).toMatch(/authenticated turn tracking/);
  expect(gmRefusal(true, 'effect_schedule_unavailable', SCHEDULE).phase).toBe('unresolved');
  expect(gmRefusal(true, 'effect_schedule_unavailable', SCHEDULE).message).not.toMatch(/nothing was applied/i);
});

test('GM changed-terms reapproval says nothing was spent and preserves the owner dice path', () => {
  const outcome = gmRefusal(false, 'owner_reapproval_required');
  expect(outcome.phase).toBe('reapproval');
  expect(outcome.message).toMatch(/Nothing was applied or spent/);
  expect(outcome.message).toMatch(/retained dice/);
  expect(outcome.message).toMatch(/owner/i);
});

test('GM missing target is a confirmed refusal that names the exact-attachment recovery', () => {
  const outcome = gmRefusal(false, 'actor_not_found');
  expect(outcome.phase).toBe('refused');
  expect(outcome.message).toMatch(/missing, replaced or no longer bound/);
  expect(outcome.message).toMatch(/Nothing was applied or charged/);
  expect(outcome.message).toMatch(/exact current attachment/);
});

test('mounted owner refusal shows the detail and offers the existing approve control, not the unknown check', () => {
  owner({ ...ownerRefusal(true, 'ability_on_cooldown', COOLDOWN), latest: null });
  render(<SpellConsequencePanel />);
  expect(screen.getByText(/Cooldown active: 1 of 2/)).toBeTruthy();
  expect(screen.getByText(/No payment was recorded/)).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Check this same approval' })).toBeNull();
  expect(screen.getByRole('button', { name: 'Approve price and send to GM' })).toBeTruthy();
});

test('mounted owner unknown directs to the original-approval recovery control and keeps it clickable', () => {
  owner({ phase: 'unknown', message: 'Outcome unknown. Check this same approval; it will not reroll or pay twice.', latest: null });
  render(<SpellConsequencePanel />);
  expect(screen.getByRole('button', { name: 'Check this same approval' })).toBeTruthy();
  expect(screen.getByText(/Outcome unknown\. Check this same approval/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Check this same approval' }));
  expect(checkSpellApproval).toHaveBeenCalledTimes(1);
});

test('mounted owner changed terms shows the retained-dice reapproval action', () => {
  owner({ phase: 'reapproval', message: OWNER_REAPPROVAL_TEXT, latest: null });
  render(<SpellConsequencePanel />);
  expect(screen.getByText(/Nothing was applied or spent/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Review and approve again (same roll)' }));
  expect(reapproveSpell).toHaveBeenCalledTimes(1);
});

test('mounted owner accepted success keeps the accepted wording and no recovery control', () => {
  owner({ phase: 'accepted', message: 'Accepted · checkpoint-confirmed. GM final 7.', latest: null });
  render(<SpellConsequencePanel />);
  expect(screen.getByText(/Accepted · checkpoint-confirmed/)).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Check this same approval' })).toBeNull();
  expect(screen.queryByRole('button', { name: /Review and approve again/ })).toBeNull();
});

test('mounted GM structured-expiry refusal shows the detail and no false unknown-check action', () => {
  gm(gmRefusal(false, 'effect_schedule_unavailable', SCHEDULE));
  render(<GmPanel />);
  expect(screen.getByText(/Structured expiry needs active authenticated turn tracking/)).toBeTruthy();
  expect(screen.getByText(/Nothing was applied or charged/)).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Accept one consequence' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Check same command' })).toBeNull();
});

test('mounted GM unknown keeps Check same command as the only recovery action', () => {
  gm({ phase: 'unknown', commandId: 'cmd-1', message: 'Outcome unknown. Check this same command; it will not be rebuilt or resubmitted with new values.' });
  render(<GmPanel />);
  fireEvent.click(screen.getByRole('button', { name: 'Check same command' }));
  expect(gmCheckSpellCommand).toHaveBeenCalledWith('a1');
});

test('mounted GM changed terms names the owner reapproval and does not claim nothing was applied', () => {
  gm(gmRefusal(false, 'owner_reapproval_required'));
  render(<GmPanel />);
  expect(screen.getByText(/Nothing was applied or spent/)).toBeTruthy();
  expect(screen.getByText(/owner must review the changed terms/)).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Check same command' })).toBeNull();
});

test('a non-GM cannot render the GM refusal surface', () => {
  gm(gmRefusal(false, 'effect_schedule_unavailable', SCHEDULE));
  useGameStore.setState({ isGMMode: false });
  render(<GmPanel />);
  expect(screen.queryByRole('region', { name: 'Spell adjudication' })).toBeNull();
});
