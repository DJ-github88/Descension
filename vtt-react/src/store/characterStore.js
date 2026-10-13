import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { refreshCharacterAutoSaveSnapshot } from './characterHelpers';

// Import slices
import { createCoreSlice } from './characterSlices/coreSlice';
import { createInfoSlice } from './characterSlices/infoSlice';
import { createStatsSlice } from './characterSlices/statsSlice';
import { createResourceSlice } from './characterSlices/resourceSlice';
import { createProgressionSlice } from './characterSlices/progressionSlice';
import { createMultiplayerSlice } from './characterSlices/multiplayerSlice';

// Import development test utilities
if (process.env.NODE_ENV === 'development') {
    import('../utils/classResourceUtils').then(module => {
        window.classResourceUtils = module.default;
    });
}

const useCharacterStore = create(subscribeWithSelector((...args) => ({
    ...createCoreSlice(...args),
    ...createInfoSlice(...args),
    ...createStatsSlice(...args),
    ...createResourceSlice(...args),
    ...createProgressionSlice(...args),
    ...createMultiplayerSlice(...args),
})));

useCharacterStore.subscribe(refreshCharacterAutoSaveSnapshot);

export default useCharacterStore;
