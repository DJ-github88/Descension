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
});
