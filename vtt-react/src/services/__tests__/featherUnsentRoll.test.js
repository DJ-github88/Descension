/** P12C-B1 §2 (T5) for P8: which retained Feather Slash records keep their recorded roll on reopen. */
import { unsentFeatherRoll } from '../featherSlashCustody';

const roll = { mode: 'physical', faces: [2, 4], total: 11 };
const base = { sourceRef: { kind: 'creature', tokenId: 'A' }, raw: { id: 'grimmstalk_feather_slash' }, roll, custody: 'Device retained' };

test('a draft, a pre-slice cancelled record and a refused command all keep their roll as a draft', () => {
  for (const record of [{ ...base, phase: 'draft' }, { ...base, phase: 'cancelled' },
    { ...base, phase: 'refused', command: { commandId: 'c1' }, result: { success: false, code: 'stale_actor_revision' } }]) {
    const kept = unsentFeatherRoll(record);
    expect(kept).toMatchObject({ roll, phase: 'draft', sourceRef: base.sourceRef });
    expect(kept.command).toBeUndefined(); expect(kept.result).toBeUndefined();
  }
});

test('prepared, unknown and accepted commands, discards and roll-less records are not unsent rolls', () => {
  expect(unsentFeatherRoll({ ...base, phase: 'unknown', command: { commandId: 'c1' } })).toBeNull();
  expect(unsentFeatherRoll({ ...base, phase: 'prepared', command: { commandId: 'c1' } })).toBeNull();
  expect(unsentFeatherRoll({ ...base, phase: 'accepted', command: { commandId: 'c1' } })).toBeNull();
  expect(unsentFeatherRoll({ phase: 'discarded', discardedRolls: [{ roll }] })).toBeNull();
  expect(unsentFeatherRoll({ ...base, roll: null, phase: 'draft' })).toBeNull();
});
