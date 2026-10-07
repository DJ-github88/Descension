/**
 * Focused regression for the client-side actionId consumer.
 *
 * Scope note: duplicate resolution of the SAME actionId is a harmless no-op.
 * Distinct superseding action IDs resolve independently; this test does not
 * claim mechanical-action deduplication (that is the server coalescer's job).
 */
import optimisticUpdatesService from '../../services/optimisticUpdatesService';

describe('optimisticUpdatesService.resolveUpdate', () => {
  const resolvedEvents = [];
  const listener = (event) => resolvedEvents.push(event.detail);

  beforeAll(() => {
    window.addEventListener('optimistic_update_resolved', listener);
  });

  afterAll(() => {
    window.removeEventListener('optimistic_update_resolved', listener);
    optimisticUpdatesService.destroy();
  });

  it('applies a same-ID echo once and ignores a duplicate resolution of that ID', () => {
    const actionId = optimisticUpdatesService.registerUpdate('token_move', {
      tokenId: 'tok-dedupe',
      position: { x: 1, y: 1 }
    });

    expect(optimisticUpdatesService.resolveUpdate(actionId, { position: { x: 1, y: 1 } })).toBe(true);
    expect(optimisticUpdatesService.resolveUpdate(actionId, { position: { x: 1, y: 1 } })).toBe(false);
    expect(optimisticUpdatesService.isUpdatePending(actionId)).toBe(false);

    const applied = resolvedEvents.filter(
      (event) => event.type === 'token_move' && event.data && event.data.tokenId === 'tok-dedupe'
    );
    expect(applied).toHaveLength(1);
  });

  it('resolves distinct superseding action IDs independently', () => {
    const first = optimisticUpdatesService.optimisticTokenMove('tok-supersede', { x: 0, y: 0 }, () => {});
    const second = optimisticUpdatesService.optimisticTokenMove('tok-supersede', { x: 5, y: 5 }, () => {});

    expect(optimisticUpdatesService.resolveUpdate(second, { position: { x: 5, y: 5 } })).toBe(true);
    expect(optimisticUpdatesService.resolveUpdate(first, { position: { x: 0, y: 0 } })).toBe(true);

    expect(optimisticUpdatesService.isUpdatePending(first)).toBe(false);
    expect(optimisticUpdatesService.isUpdatePending(second)).toBe(false);
    expect(optimisticUpdatesService.resolveUpdate(second, {})).toBe(false);
  });
});
