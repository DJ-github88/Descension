import { create } from 'zustand';
import { registerStore } from '../../store/storeRegistry';
import { activatePrivateScope, resetBootstrapGateForTests } from '../../persistence/bootstrapPrivacyGate';
import { getFamily } from '../../persistence/privateStorageRegistry';
import { loadRiposteCustody, retainRiposteCustody, riposteContext } from '../riposteCustody';
import { retainStrikeCustody, loadStrikeCustody } from '../weaponStrikeCustody';
let auth;
beforeEach(() => {
  localStorage.clear(); resetBootstrapGateForTests(); activatePrivateScope({ scopeKind: 'user', scopeId: 'u' });
  auth = create(() => ({ user: { uid: 'u' } })); registerStore('authStore', auth);
  registerStore('gameStore', create(() => ({ isInMultiplayer: true, multiplayerRoom: { id: 'r' } })));
});
test('user-only sibling custody round trips exact bytes and never overwrites accepted basic strike records', () => {
  expect(getFamily('room.strikeConsequenceLatest.riposte.v1').allowedScopeKinds).toEqual(['user']);
  const c = riposteContext(); expect(c.current()).toBe(true);
  retainStrikeCustody(c, { owner: { phase: 'accepted', old: 'basic-strike' } });
  const record = { phase: 'unknown', roll: { mode: 'physical', faces: [8, 3] }, command: { commandId: 'original', bytes: 'immutable' } };
  retainRiposteCustody(c, { owner: { opportunity: record } });
  expect(loadRiposteCustody(c).owner.opportunity).toEqual(record);
  expect(loadStrikeCustody(c).owner.old).toBe('basic-strike');
  auth.setState({ user: { uid: 'v' } }); activatePrivateScope({ scopeKind: 'user', scopeId: 'v' });
  expect(loadRiposteCustody()).toBeNull(); expect(() => retainRiposteCustody(c, {})).toThrow(/Retired/);
});
