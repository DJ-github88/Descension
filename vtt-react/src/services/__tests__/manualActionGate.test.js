/** P12C-B1 §3: unsupported shared-room actions post a notice and spend nothing. */
import { registerStore } from '../../store/storeRegistry';
import { spellDiagnostic } from '../spellConsequenceService';
import { strikeDiagnostic } from '../weaponStrikeService';
import { postManualNotice, manualSharedReason } from '../manualActionGate';

jest.mock('../spellConsequenceService', () => ({ spellDiagnostic: jest.fn() }));
jest.mock('../weaponStrikeService', () => ({ strikeDiagnostic: jest.fn() }));

test('manual in a shared room: notice only; supported or local: not handled here', () => {
  const addCombatNotification = jest.fn();
  registerStore('chatStore', { getState: () => ({ addCombatNotification }) });
  strikeDiagnostic.mockReturnValue(null); spellDiagnostic.mockReturnValue('Effect types ["damage","control"] are not exactly damage or healing.');
  expect(manualSharedReason({ name: 'Frost Nova' })).toMatch(/Effect types/);
  expect(postManualNotice({ name: 'Frost Nova' }, 'Ilsa')).toBe(true);
  expect(addCombatNotification.mock.calls[0][0].content).toMatch(/Ilsa uses Frost Nova — manual: resolved at the table; nothing applied by the VTT/);
  spellDiagnostic.mockReturnValue(null);
  expect(postManualNotice({ name: 'Marrow-Piercing Slug' }, 'Ilsa')).toBe(false);
  expect(addCombatNotification).toHaveBeenCalledTimes(1);
});
