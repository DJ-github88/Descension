import useInventoryStore from '../inventoryStore';
import { memoryFallbackStore } from '../../utils/storageUtils';

describe('inventoryStore storage resilience', () => {
  beforeEach(() => {
    localStorage.clear();
    memoryFallbackStore.clear();
    useInventoryStore.getState().clearInventory();
    jest.restoreAllMocks();
  });

  it('initializes with default values', () => {
    const state = useInventoryStore.getState();
    expect(state.items).toEqual([]);
    expect(state.currency).toEqual({ platinum: 0, gold: 0, silver: 0, copper: 0 });
    expect(state.encumbranceState).toBe('normal');
  });

  it('runs updateEncumbranceState without throwing when localStorage quota is exceeded', () => {
    // Simulate localStorage.setItem throwing QuotaExceededError
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      const error = new Error("Failed to execute 'setItem' on 'Storage': Setting the value of 'inventory' exceeded the quota.");
      error.name = 'QuotaExceededError';
      throw error;
    });

    expect(() => {
      useInventoryStore.getState().updateEncumbranceState();
    }).not.toThrow();

    const state = useInventoryStore.getState();
    expect(state.encumbranceState).toBe('normal');
  });

  it('runs updateCurrency and addItem without throwing when localStorage quota is exceeded', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      const error = new Error("QuotaExceededError: Setting the value of 'inventory' exceeded the quota.");
      error.name = 'QuotaExceededError';
      throw error;
    });

    expect(() => {
      useInventoryStore.getState().updateCurrency({ gold: 50, silver: 20 });
    }).not.toThrow();

    const state = useInventoryStore.getState();
    expect(state.currency.gold).toBe(50);
    expect(state.currency.silver).toBe(20);
  });

  it('applies a full remote inventory snapshot', () => {
    useInventoryStore.getState().applyRemoteInventory({
      changeType: 'full',
      items: [{ id: 'i1', name: 'Sword' }],
      currency: { platinum: 1, gold: 2, silver: 3, copper: 4 },
      encumbranceState: 'encumbered'
    });

    const state = useInventoryStore.getState();
    expect(state.items).toEqual([{ id: 'i1', name: 'Sword' }]);
    expect(state.currency.gold).toBe(2);
    expect(state.encumbranceState).toBe('encumbered');
  });

  it('applies incremental add/remove/move remote updates without re-broadcasting', () => {
    useInventoryStore.setState({ items: [{ id: 'a', position: { row: 0, col: 0 } }] });

    useInventoryStore.getState().applyRemoteInventory({ changeType: 'add_item', item: { id: 'b' } });
    expect(useInventoryStore.getState().items.map(i => i.id)).toEqual(['a', 'b']);

    useInventoryStore.getState().applyRemoteInventory({ changeType: 'move_item', itemId: 'a', newPosition: { row: 3, col: 4 } });
    expect(useInventoryStore.getState().items.find(i => i.id === 'a').position).toEqual({ row: 3, col: 4 });

    useInventoryStore.getState().applyRemoteInventory({ changeType: 'remove_item', itemId: 'b' });
    expect(useInventoryStore.getState().items.map(i => i.id)).toEqual(['a']);
  });
});
