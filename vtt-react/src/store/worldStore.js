import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { getEnrichedZone, getEnrichedZonesByRegion } from '../data/deepLocationData';
import { RACE_DATA, getRaceData } from '../data/raceData';
import useFactionStore from './factionStore';
import useTimelineStore from './timelineStore';
import useClassLoreStore from './classLoreStore';
import useCustomLineageStore from './customLineageStore';

const nowIso = () => new Date().toISOString();

export const CANONICAL_REGIONS_META = {
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
    dangerLevel: 'extreme',
    climate: 'Eternal winter. Glaciers halted in place by the Glacier Bargain. Morð worsens each frost-touched generation as Solbrand’s thermal resonance continues to fade.',
    dominantTerrain: 'Black basalt fjords, whiteout glaciers, geothermal vents, and ironwood pine stands.',
    primaryRaces: ['Skald (Humans)', 'Rime-Touched', 'Corvani (Raven-folk)', 'Øsling outcasts', 'High Neth', 'Pale Neth'],
    primaryFactions: ['House Skalvyr', 'The Icechamber Syndicate', 'The Frozen Archive', 'The Hungríd Cult', 'The Doom-Choir'],
    ruler: 'King-Jarl Halvar Skalvyr ("Iron-Tooth")',
    loreOverview: 'Nordhalla is an isolated northern continent bound by the ancient Glacier Bargain. Following the Freezing Era, House Skalvyr traded summer for halted glaciers. In exchange, Morð claims 1 in 7 birthing mothers, producing blue-skinned Rime-Touched children with cold in their blood. King-Jarl Halvar rules through three pillars: The Frozen Archive, the Icechamber Syndicate, and the massive Sunder-Wall separating civilization from the Frostfang Wastes.',
    historyLore: 'Centuries ago, Sol was sealed into the core to hide from the celestial predator Keth Amar. House Skalvyr received the gift of Rime—the power to control ice at the cost of petrification and emotional numbing. Recent decades have seen Jarn-Tand’s Cleansing of the Hearth, driving tribal Animists into hiding and building the Sunder-Wall.',
    threats: ['Morð (The Frost-Tithe)', 'Sválghjarta & The Hungríd Cult', 'Glacier Wyrms', 'Skrei & Stel (Glacier Revenants)']
  },
  'sundale': {
    id: 'sundale',
    name: 'Sundale',
    description: 'Scorched ashlands surrounding Emberspire, where the dying star Sol was bound beneath the earth.',
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

export const CANONICAL_MYTHRILL_WORLD = {
  id: 'mythrill',
  name: 'Mythrill',
  subtitle: 'The Sunless Realm & The Dimming',
  description: 'A dark-fantasy world where the sun was buried to escape cosmic predators, and fear itself spawns monsters.',
  isCanonical: true,
  theme: 'dark-fantasy',
  bannerUrl: '/assets/images/backgrounds/Mythril.jpeg',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  customRegions: [],
  customLocations: [],
  customTimelines: []
};

const useWorldStore = create(
  persist(
    (set, get) => ({
      activeWorldId: 'mythrill',
      worldId: 'mythrill',
      worldName: 'Mythrill',
      worlds: [CANONICAL_MYTHRILL_WORLD],
      customWorlds: [],
      lastCloudSyncAt: null,

      // ── Multi-World Management CRUD ──
      getActiveWorld: () => {
        const state = get();
        const activeId = state.activeWorldId || 'mythrill';
        const found = (state.worlds || []).find((w) => w.id === activeId) ||
          (state.customWorlds || []).find((w) => w.id === activeId);
        return found || CANONICAL_MYTHRILL_WORLD;
      },

      getAllWorlds: () => {
        const state = get();
        const map = new Map();
        [CANONICAL_MYTHRILL_WORLD, ...(state.worlds || []), ...(state.customWorlds || [])].forEach((w) => {
          if (w && w.id) map.set(w.id, w);
        });
        return Array.from(map.values());
      },

      switchWorld: (worldId) => {
        const target = get().getAllWorlds().find((w) => w.id === worldId);
        if (!target) return false;
        set({
          activeWorldId: target.id,
          worldId: target.id,
          worldName: target.name
        });
        return true;
      },

      createWorld: (meta = {}) => {
        const name = (meta.name || '').trim() || 'Untitled World';
        const worldId = `world-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newWorld = {
          id: worldId,
          name,
          subtitle: meta.subtitle || 'A Sovereign World Setting',
          description: meta.description || '',
          isCanonical: false,
          theme: meta.theme || 'dark-fantasy',
          bannerUrl: meta.bannerUrl || null,
          customRegions: Array.isArray(meta.customRegions) ? meta.customRegions : [],
          customLocations: Array.isArray(meta.customLocations) ? meta.customLocations : [],
          customTimelines: Array.isArray(meta.customTimelines) ? meta.customTimelines : [],
          createdAt: nowIso(),
          updatedAt: nowIso()
        };

        set((state) => ({
          worlds: [...(state.worlds || []).filter((w) => w.id !== worldId), newWorld],
          customWorlds: [...(state.customWorlds || []).filter((w) => w.id !== worldId), newWorld],
          activeWorldId: worldId,
          worldId,
          worldName: name
        }));

        return worldId;
      },

      updateWorld: (worldId, patch = {}) => {
        if (worldId === 'mythrill' && patch.name && patch.name !== 'Mythrill') {
          // Allow editing metadata but preserve canonical id
        }
        set((state) => {
          const updateFn = (w) => (w.id === worldId ? { ...w, ...patch, updatedAt: nowIso() } : w);
          const updatedWorlds = (state.worlds || []).map(updateFn);
          const updatedCustom = (state.customWorlds || []).map(updateFn);
          const activeWorld = updatedWorlds.find((w) => w.id === state.activeWorldId) || state.getActiveWorld();
          return {
            worlds: updatedWorlds,
            customWorlds: updatedCustom,
            worldName: activeWorld?.name || state.worldName
          };
        });
      },

      duplicateWorld: (worldId) => {
        const source = get().getAllWorlds().find((w) => w.id === worldId);
        if (!source) return null;
        const copy = JSON.parse(JSON.stringify(source));
        copy.id = `world-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        copy.name = `${source.name} (Copy)`;
        copy.isCanonical = false;
        copy.createdAt = nowIso();
        copy.updatedAt = nowIso();

        set((state) => ({
          worlds: [...(state.worlds || []), copy],
          customWorlds: [...(state.customWorlds || []), copy]
        }));
        return copy.id;
      },

      deleteWorld: (worldId) => {
        if (worldId === 'mythrill') return false; // Never delete canon setting
        set((state) => {
          const nextActive = state.activeWorldId === worldId ? 'mythrill' : state.activeWorldId;
          const nextWorlds = (state.worlds || []).filter((w) => w.id !== worldId);
          const nextCustom = (state.customWorlds || []).filter((w) => w.id !== worldId);
          return {
            worlds: nextWorlds,
            customWorlds: nextCustom,
            activeWorldId: nextActive,
            worldId: nextActive,
            worldName: nextActive === 'mythrill' ? 'Mythrill' : (nextWorlds.find((w) => w.id === nextActive)?.name || 'Mythrill')
          };
        });
        return true;
      },

      // ── Custom Region & Location Authoring within Active World ──
      addCustomRegion: (worldId, regionData = {}) => {
        const targetWorldId = worldId || get().activeWorldId;
        const regionId = regionData.id || `reg-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newRegion = {
          id: regionId,
          name: regionData.name || 'New Realm',
          description: regionData.description || '',
          dangerLevel: regionData.dangerLevel || 'medium',
          climate: regionData.climate || 'Temperate',
          dominantTerrain: regionData.dominantTerrain || 'Plains & Foothills',
          primaryRaces: Array.isArray(regionData.primaryRaces) ? regionData.primaryRaces : [],
          primaryFactions: Array.isArray(regionData.primaryFactions) ? regionData.primaryFactions : [],
          ruler: regionData.ruler || '',
          loreOverview: regionData.loreOverview || '',
          historyLore: regionData.historyLore || '',
          threats: Array.isArray(regionData.threats) ? regionData.threats : [],
          mapStyle: regionData.mapStyle || { zoom: 1, cameraX: 0, cameraY: 0 },
          isCustom: true,
          worldId: targetWorldId,
          createdAt: nowIso()
        };

        set((state) => {
          const updateWorldRegions = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customRegions: [...(w.customRegions || []).filter((r) => r.id !== regionId), newRegion],
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldRegions),
            customWorlds: (state.customWorlds || []).map(updateWorldRegions)
          };
        });

        return regionId;
      },

      addCustomLocation: (worldId, locationData = {}) => {
        const targetWorldId = worldId || get().activeWorldId;
        const locationId = locationData.id || `loc-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newLocation = {
          id: locationId,
          regionId: locationData.regionId || '',
          name: locationData.name || 'New Settlement / Hold',
          type: locationData.type || 'city',
          description: locationData.description || '',
          overview: locationData.overview || locationData.description || '',
          sensoryProfile: locationData.sensoryProfile || {
            sight: '',
            sound: '',
            smell: '',
            atmosphere: ''
          },
          government: locationData.government || '',
          rulingFactionId: locationData.rulingFactionId || null,
          notableNPCs: Array.isArray(locationData.notableNPCs) ? locationData.notableNPCs : [],
          pointsOfInterest: Array.isArray(locationData.pointsOfInterest) ? locationData.pointsOfInterest : [],
          dmHook: locationData.dmHook || '',
          secretNotes: locationData.secretNotes || '',
          coordinates: locationData.coordinates || null,
          isCustom: true,
          worldId: targetWorldId,
          createdAt: nowIso()
        };

        set((state) => {
          const updateWorldLocs = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customLocations: [...(w.customLocations || []).filter((l) => l.id !== locationId), newLocation],
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldLocs),
            customWorlds: (state.customWorlds || []).map(updateWorldLocs)
          };
        });

        return locationId;
      },

      addCustomTimeline: (worldId, eraData = {}) => {
        const targetWorldId = worldId || get().activeWorldId;
        const eraId = eraData.id || `era-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newEra = {
          id: eraId,
          name: eraData.name || 'New Epoch',
          yearRange: eraData.yearRange || 'Years 0–100',
          description: eraData.description || '',
          isCustom: true,
          worldId: targetWorldId,
          createdAt: nowIso()
        };

        set((state) => {
          const updateWorldEras = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customTimelines: [...(w.customTimelines || []).filter((e) => e.id !== eraId), newEra],
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldEras),
            customWorlds: (state.customWorlds || []).map(updateWorldEras)
          };
        });

        return eraId;
      },

      updateCustomTimeline: (worldId, eraId, updates = {}) => {
        const targetWorldId = worldId || get().activeWorldId;
        set((state) => {
          const updateWorldEras = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customTimelines: (w.customTimelines || []).map((e) => (e.id === eraId ? { ...e, ...updates, updatedAt: nowIso() } : e)),
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldEras),
            customWorlds: (state.customWorlds || []).map(updateWorldEras)
          };
        });
      },

      deleteCustomTimeline: (worldId, eraId) => {
        const targetWorldId = worldId || get().activeWorldId;
        set((state) => {
          const updateWorldEras = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customTimelines: (w.customTimelines || []).filter((e) => e.id !== eraId),
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldEras),
            customWorlds: (state.customWorlds || []).map(updateWorldEras)
          };
        });
      },

      updateCustomRegion: (worldId, regionId, updates = {}) => {
        const targetWorldId = worldId || get().activeWorldId;
        set((state) => {
          const updateWorldRegions = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customRegions: (w.customRegions || []).map((r) => (r.id === regionId ? { ...r, ...updates, updatedAt: nowIso() } : r)),
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldRegions),
            customWorlds: (state.customWorlds || []).map(updateWorldRegions)
          };
        });
      },

      deleteCustomRegion: (worldId, regionId) => {
        const targetWorldId = worldId || get().activeWorldId;
        set((state) => {
          const updateWorldRegions = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customRegions: (w.customRegions || []).filter((r) => r.id !== regionId),
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldRegions),
            customWorlds: (state.customWorlds || []).map(updateWorldRegions)
          };
        });
      },

      updateCustomLocation: (worldId, locationId, updates = {}) => {
        const targetWorldId = worldId || get().activeWorldId;
        set((state) => {
          const updateWorldLocs = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customLocations: (w.customLocations || []).map((l) => (l.id === locationId ? { ...l, ...updates, updatedAt: nowIso() } : l)),
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldLocs),
            customWorlds: (state.customWorlds || []).map(updateWorldLocs)
          };
        });
      },

      deleteCustomLocation: (worldId, locationId) => {
        const targetWorldId = worldId || get().activeWorldId;
        set((state) => {
          const updateWorldLocs = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customLocations: (w.customLocations || []).filter((l) => l.id !== locationId),
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldLocs),
            customWorlds: (state.customWorlds || []).map(updateWorldLocs)
          };
        });
      },

      // ── Dynamic Dynamic Resolvers (Active World Conscious) ──
      get regions() {
        return get().getRegions();
      },

      getRegions: () => {
        const activeWorld = get().getActiveWorld();
        if (activeWorld.id === 'mythrill') {
          const customExtras = activeWorld.customRegions || [];
          return [...Object.values(CANONICAL_REGIONS_META), ...customExtras];
        }
        return activeWorld.customRegions || [];
      },

      getRegion: (regionId) => {
        return get().getRegions().find((r) => r.id === regionId) || null;
      },

      getLocationsByRegion: (regionId) => {
        const activeWorld = get().getActiveWorld();
        const customLocs = (activeWorld.customLocations || []).filter((l) => l.regionId === regionId);
        if (activeWorld.id === 'mythrill') {
          const canonical = getEnrichedZonesByRegion(regionId);
          return [...canonical, ...customLocs];
        }
        return customLocs;
      },

      getLocation: (locationId) => {
        const activeWorld = get().getActiveWorld();
        const customLoc = (activeWorld.customLocations || []).find((l) => l.id === locationId);
        if (customLoc) return customLoc;
        return getEnrichedZone(locationId);
      },

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

      // ── Unified Classes & Traditions (Canon 21 + Custom + Extinct / Inactive Toggles) ──
      getExtinctClasses: (worldId) => {
        const targetWorldId = worldId || get().activeWorldId;
        const world = (get().getAllWorlds() || []).find((w) => w.id === targetWorldId);
        return world?.extinctClasses || [];
      },

      toggleClassStatus: (classId, worldId) => {
        const targetWorldId = worldId || get().activeWorldId;
        const normalizedId = classId.toLowerCase().replace(/\s+/g, '_');
        
        set((state) => {
          const updateWorldExtinct = (w) => {
            if (w.id !== targetWorldId) return w;
            const currentList = w.extinctClasses || [];
            const isCurrentlyExtinct = currentList.includes(normalizedId) || currentList.includes(classId);
            const nextList = isCurrentlyExtinct
              ? currentList.filter((id) => id !== normalizedId && id !== classId)
              : [...currentList, normalizedId];
            return {
              ...w,
              extinctClasses: nextList,
              updatedAt: nowIso()
            };
          };

          return {
            worlds: (state.worlds || []).map(updateWorldExtinct),
            customWorlds: (state.customWorlds || []).map(updateWorldExtinct)
          };
        });
      },

      addCustomClass: (worldId, classData = {}) => {
        const targetWorldId = worldId || get().activeWorldId;
        const classId = classData.id || `class-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newClass = {
          id: classId,
          name: classData.name || 'Custom Calling',
          tradition: classData.tradition || 'Martial Orders & Vanguard',
          role: classData.role || 'Heroic Archetype',
          tagline: classData.tagline || '',
          description: classData.description || '',
          originStory: classData.originStory || '',
          resourceName: classData.resourceName || 'Mana / Focus',
          resourceType: classData.resourceType || 'Focus',
          keyFeatures: Array.isArray(classData.keyFeatures) ? classData.keyFeatures : [],
          specialRules: classData.specialRules || '',
          meaningfulTradeoffs: classData.meaningfulTradeoffs || '',
          currentCrisis: classData.currentCrisis || '',
          signatureQuote: classData.signatureQuote || null,
          isCustom: true,
          worldId: targetWorldId,
          createdAt: nowIso()
        };

        set((state) => {
          const updateWorldClasses = (w) => {
            if (w.id !== targetWorldId) return w;
            return {
              ...w,
              customClasses: [...(w.customClasses || []).filter((c) => c.id !== classId), newClass],
              updatedAt: nowIso()
            };
          };
          return {
            worlds: (state.worlds || []).map(updateWorldClasses),
            customWorlds: (state.customWorlds || []).map(updateWorldClasses)
          };
        });

        return classId;
      },

      getAllClasses: (worldId) => {
        const targetWorldId = worldId || get().activeWorldId;
        const world = (get().getAllWorlds() || []).find((w) => w.id === targetWorldId);
        const canonClasses = useClassLoreStore.getState().classes || [];
        const customClasses = world?.customClasses || [];
        const extinctList = world?.extinctClasses || [];

        return [...canonClasses, ...customClasses].map((cls) => {
          const normalizedId = cls.id?.toLowerCase()?.replace(/\s+/g, '_');
          const isExtinct = extinctList.includes(normalizedId) || extinctList.includes(cls.id);
          return {
            ...cls,
            isExtinct
          };
        });
      },

      // ── Unified Lineages (Canonical + Custom) ──
      getAllLineages: () => {
        const activeWorld = get().getActiveWorld();
        const custom = useCustomLineageStore.getState().getAllLineages();
        if (activeWorld.id === 'mythrill') {
          const canonical = Object.values(RACE_DATA).map((r) => ({ ...r, isCustom: false }));
          return [...canonical, ...custom];
        }
        return custom;
      },

      getLineage: (lineageId) => {
        const activeWorld = get().getActiveWorld();
        if (activeWorld.id === 'mythrill') {
          const canonical = getRaceData(lineageId);
          if (canonical) return { ...canonical, isCustom: false };
        }
        return useCustomLineageStore.getState().getLineage(lineageId);
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

      getClass: (classId) => {
        const allClasses = get().getAllClasses();
        const normalizedId = classId?.toLowerCase()?.replace(/\s+/g, '_');
        return (
          allClasses.find((c) => c.id === classId || c.id?.toLowerCase()?.replace(/\s+/g, '_') === normalizedId) ||
          useClassLoreStore.getState().getClass(classId) ||
          null
        );
      },

      getFullContextForClass: (classId) => {
        const classStore = useClassLoreStore.getState();
        if (!classStore.loaded) classStore.loadClasses();
        const cls = get().getClass(classId);
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
        return get().getRegions().map((region) => {
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

      // ── Universal Entity Fuzzy Search for [[Wiki]] Auto-complete & Explorer ──
      searchEntities: (query) => {
        if (!query || typeof query !== 'string' || query.trim().length === 0) return [];
        const q = query.toLowerCase().trim();
        const results = [];

        // Search Regions
        get().getRegions().forEach((r) => {
          if (r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) {
            results.push({ id: r.id, name: r.name, type: 'region', subtitle: 'Region / Realm', icon: 'fa-mountain-sun', regionId: r.id });
          }
        });

        // Search Locations
        get().getRegions().forEach((r) => {
          const locs = get().getLocationsByRegion(r.id);
          locs.forEach((loc) => {
            if (loc.name.toLowerCase().includes(q) || loc.id.toLowerCase().includes(q)) {
              results.push({ id: loc.id, name: loc.name, type: 'location', subtitle: `${r.name} • ${loc.type || 'POI'}`, icon: 'fa-location-dot', regionId: r.id, locationId: loc.id });
            }
          });
        });

        // Search Factions
        const factionStore = useFactionStore.getState();
        (factionStore.factions || []).forEach((f) => {
          if (f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q)) {
            results.push({ id: f.id, name: f.name, type: 'faction', subtitle: `Faction (${f.type?.replace(/_/g, ' ') || 'Order'})`, icon: 'fa-shield-halved', factionId: f.id });
          }
        });

        // Search Lineages & Races
        get().getAllLineages().forEach((l) => {
          if (l.name.toLowerCase().includes(q) || (l.essence && l.essence.toLowerCase().includes(q))) {
            results.push({ id: l.id, name: l.name, type: 'lineage', subtitle: l.essence || (l.isCustom ? 'Custom Lineage' : 'Playable Race'), icon: 'fa-dna', lineageId: l.id });
          }
        });

        // Search Classes
        const classStore = useClassLoreStore.getState();
        if (!classStore.loaded) classStore.loadClasses();
        (classStore.getAllClasses() || []).forEach((c) => {
          if (c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) {
            results.push({ id: c.id, name: c.name, type: 'class', subtitle: 'Class / Discipline', icon: 'fa-hat-wizard', classId: c.id });
          }
        });

        return results.slice(0, 12);
      },

      // ── Cloud Sync ──
      syncToCloud: async (userId) => {
        if (!userId || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'worlds');
          await setDoc(docRef, {
            activeWorldId: get().activeWorldId,
            worlds: get().worlds,
            customWorlds: get().customWorlds,
            updatedAt: nowIso()
          }, { merge: true });
          set({ lastCloudSyncAt: nowIso() });
          return true;
        } catch (err) {
          console.debug('Worlds cloud sync skipped:', err?.message || err);
          return false;
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'worlds');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            const updates = {};
            if (Array.isArray(data?.worlds)) updates.worlds = data.worlds;
            if (Array.isArray(data?.customWorlds)) updates.customWorlds = data.customWorlds;
            if (data?.activeWorldId) {
              updates.activeWorldId = data.activeWorldId;
              updates.worldId = data.activeWorldId;
            }
            if (Object.keys(updates).length > 0) {
              set(updates);
              return true;
            }
          }
        } catch (err) {
          console.debug('Worlds cloud hydration skipped:', err?.message || err);
        }
        return false;
      }
    }),
    createStorageConfig('mythrill_worlds_storage', {
      partialize: (state) => ({
        activeWorldId: state.activeWorldId,
        worlds: state.worlds,
        customWorlds: state.customWorlds,
        lastCloudSyncAt: state.lastCloudSyncAt
      })
    })
  )
);

export default useWorldStore;

