import { create } from 'zustand';
import { ZONE_DATA } from '../data/zoneData';
import { getEnrichedZone, getEnrichedZonesByRegion } from '../data/deepLocationData';
import useFactionStore from './factionStore';
import useTimelineStore from './timelineStore';
import useClassLoreStore from './classLoreStore';

const DEFAULT_LOCKED_REGIONS = ['nordhalla', 'sundale', 'iceheart-sea', 'cragjaw-peaks', 'sundrift-vale', 'bryngloom-forest'];

let initialLocked = DEFAULT_LOCKED_REGIONS;
try {
  const saved = localStorage.getItem('mythrill_locked_regions');
  if (saved) {
    initialLocked = JSON.parse(saved);
  }
} catch (e) {
  console.warn('Could not read locked regions from localStorage:', e);
}

const REGION_META = {
  'frostwood-reach': {
    id: 'frostwood-reach',
    name: 'Frostwood Reach',
    description: 'A dense, fog-choked ironwood forest where volcanic heat from the south collides with the northern freeze.',
    mapStyle: { zoom: 1, cameraX: 0, cameraY: 0 },
    dangerLevel: 'medium'
  },
  'nordhalla': {
    id: 'nordhalla',
    name: 'Nordhalla',
    description: 'A brutalist cathedral of frozen black fjords and towering glaciers, warmed only by deep geothermal sumps.',
    mapStyle: { zoom: 1, cameraX: 0, cameraY: 0 },
    dangerLevel: 'extreme'
  },
  'sundale': {
    id: 'sundale',
    name: 'Sundale',
    description: 'Scorched ashlands surrounding Emberspire, where the dying sun-god Sol was bound beneath the earth.',
    mapStyle: { zoom: 1, cameraX: 0, cameraY: 0 },
    dangerLevel: 'high'
  },
  'iceheart-sea': {
    id: 'iceheart-sea',
    name: 'Iceheart Sea',
    description: 'A violent, freezing ocean of city-sized icebergs and perpetual gales.',
    mapStyle: { zoom: 1, cameraX: 0, cameraY: 0 },
    dangerLevel: 'extreme'
  },
  'cragjaw-peaks': {
    id: 'cragjaw-peaks',
    name: 'Cragjaw Peaks',
    description: 'A vertical wilderness of howling blizzards and razor ridges.',
    mapStyle: { zoom: 1, cameraX: 0, cameraY: 0 },
    dangerLevel: 'extreme'
  },
  'sundrift-vale': {
    id: 'sundrift-vale',
    name: 'Sundrift Vale',
    description: 'A wind-swept, starless steppe of dead tundra grass where nomadic clans follow woolly herds.',
    mapStyle: { zoom: 1, cameraX: 0, cameraY: 0 },
    dangerLevel: 'medium'
  },
  'bryngloom-forest': {
    id: 'bryngloom-forest',
    name: 'Bryngloom Forest',
    description: 'A semi-frozen sinking bog and bioluminescent forest governed by contracts.',
    mapStyle: { zoom: 1, cameraX: 0, cameraY: 0 },
    dangerLevel: 'high'
  }
};

const useWorldStore = create((set, get) => ({
  worldId: 'mythrill',
  worldName: 'Mythrill',

  regions: Object.values(REGION_META),

  getRegion: (regionId) => REGION_META[regionId] || null,

  getLocationsByRegion: (regionId) => getEnrichedZonesByRegion(regionId),

  getLocation: (locationId) => getEnrichedZone(locationId),

  getFactionPresenceAtLocation: (locationId) => {
    const factionStore = useFactionStore.getState();
    return factionStore.getFactionMembersAtLocation(locationId);
  },

  getClassesPracticedAtLocation: (locationId) => {
    const classStore = useClassLoreStore.getState();
    if (!classStore.loaded) classStore.loadClasses();
    return classStore.getClassesByLocation(locationId);
  },

  getFactionsByRegion: (regionId) => {
    const factionStore = useFactionStore.getState();
    return factionStore.getFactionsByRegion(regionId);
  },

  getTimelineForLocation: (locationId) => {
    const timelineStore = useTimelineStore.getState();
    return timelineStore.getEventsByLocation(locationId);
  },

  getTimelineForFaction: (factionId) => {
    const timelineStore = useTimelineStore.getState();
    return timelineStore.getEventsByFaction(factionId);
  },

  getTimelineForClass: (classId) => {
    const timelineStore = useTimelineStore.getState();
    return timelineStore.getEventsByClass(classId);
  },

  getFullContextForLocation: (locationId) => {
    const location = get().getLocation(locationId);
    if (!location) return null;

    return {
      location,
      region: get().getRegion(location.regionId),
      factions: get().getFactionPresenceAtLocation(locationId),
      classesPracticed: get().getClassesPracticedAtLocation(locationId),
      timeline: get().getTimelineForLocation(locationId)
    };
  },

  getFullContextForFaction: (factionId) => {
    const factionStore = useFactionStore.getState();
    const faction = factionStore.getFaction(factionId);
    if (!faction) return null;

    return {
      faction,
      relationships: factionStore.getFactionRelationships(factionId),
      timeline: get().getTimelineForFaction(factionId),
      region: get().getRegion(faction.regionId)
    };
  },

  getFullContextForClass: (classId) => {
    const classStore = useClassLoreStore.getState();
    if (!classStore.loaded) classStore.loadClasses();
    const cls = classStore.getClass(classId);
    if (!cls) return null;

    return {
      classInfo: cls,
      factions: useFactionStore.getState().getFactionsByClass(classId),
      timeline: get().getTimelineForClass(classId),
      subclassInfo: classStore.getAllSubclassInfo(classId)
    };
  },

  getRegionContext: (regionId) => {
    return {
      region: get().getRegion(regionId),
      locations: get().getLocationsByRegion(regionId),
      factions: get().getFactionsByRegion(regionId),
      eventCount: get().getTimelineForLocation(regionId).length
    };
  },

  getWorldOverview: () => {
    return get().regions.map((region) => {
      const locations = get().getLocationsByRegion(region.id);
      const factions = get().getFactionsByRegion(region.id);
      return {
        ...region,
        locationCount: locations.length,
        factionCount: factions.length,
        locations: locations.slice(0, 3)
      };
    });
  },

  lockedRegions: initialLocked,

  unlockRegion: (regionId) => set((state) => {
    const next = state.lockedRegions.filter(id => id !== regionId);
    try {
      localStorage.setItem('mythrill_locked_regions', JSON.stringify(next));
    } catch (e) {}
    return { lockedRegions: next };
  }),

  lockRegion: (regionId) => set((state) => {
    const next = state.lockedRegions.includes(regionId) ? state.lockedRegions : [...state.lockedRegions, regionId];
    try {
      localStorage.setItem('mythrill_locked_regions', JSON.stringify(next));
    } catch (e) {}
    return { lockedRegions: next };
  }),

  resetRegionLocks: () => set(() => {
    try {
      localStorage.setItem('mythrill_locked_regions', JSON.stringify(DEFAULT_LOCKED_REGIONS));
    } catch (e) {}
    return { lockedRegions: DEFAULT_LOCKED_REGIONS };
  }),

  toggleAllRegionLocks: () => set((state) => {
    const next = state.lockedRegions.length > 0 ? [] : DEFAULT_LOCKED_REGIONS;
    try {
      localStorage.setItem('mythrill_locked_regions', JSON.stringify(next));
    } catch (e) {}
    return { lockedRegions: next };
  })
}));

export default useWorldStore;
