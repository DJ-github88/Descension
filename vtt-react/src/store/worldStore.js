import { create } from 'zustand';
import { getEnrichedZone, getEnrichedZonesByRegion } from '../data/deepLocationData';
import { RACE_DATA, getRaceData } from '../data/raceData';
import useFactionStore from './factionStore';
import useTimelineStore from './timelineStore';
import useClassLoreStore from './classLoreStore';
import useCustomLineageStore from './customLineageStore';

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
    dangerLevel: 'extreme',
    climate: 'Eternal winter. Glaciers halted in place by the Glacier Bargain. Morð worsens each frost-touched generation as Solbrand’s thermal resonance continues to fade.',
    dominantTerrain: 'Black basalt fjords, whiteout glaciers, geothermal vents, and ironwood pine stands.',
    primaryRaces: ['Skald (Humans)', 'Rime-Touched', 'Corvani (Raven-folk)', 'Øsling outcasts', 'High Neth', 'Pale Neth'],
    primaryFactions: ['House Skalvyr', 'The Icechamber Syndicate', 'The Frozen Archive', 'The Hungríd Cult', 'The Doom-Choir'],
    ruler: 'King-Jarl Halvar Skalvyr ("Iron-Tooth")',
    loreOverview: 'Nordhalla is an isolated northern continent bound by the ancient Glacier Bargain. Following the Freezing Era, House Skalvyr traded summer for halted glaciers. In exchange, Morð claims 1 in 7 birthing mothers, producing blue-skinned Rime-Touched children with cold in their blood. King-Jarl Halvar rules through three pillars: The Frozen Archive, the Icechamber Syndicate, and the massive Sunder-Wall separating civilization from the Frostfang Wastes.',
    historyLore: 'Centuries ago, Sol was sealed into the core to hide from the celestial predator Keth-Amar. House Skalvyr received the gift of Rime—the power to control ice at the cost of petrification and emotional numbing. Recent decades have seen Jarn-Tand’s Cleansing of the Hearth, driving tribal Animists into hiding and building the Sunder-Wall.',
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

const useWorldStore = create((_, get) => ({
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

  // ── Unified Lineages (Canonical + Custom) ──
  getAllLineages: () => {
    const canonical = Object.values(RACE_DATA).map((r) => ({ ...r, isCustom: false }));
    const custom = useCustomLineageStore.getState().getAllLineages();
    return [...canonical, ...custom];
  },

  getLineage: (lineageId) => {
    const canonical = getRaceData(lineageId);
    if (canonical) return { ...canonical, isCustom: false };
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

  // ── Universal Entity Fuzzy Search for [[Wiki]] Auto-complete & Explorer ──
  searchEntities: (query) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const results = [];

    // Search Regions
    get().regions.forEach((r) => {
      if (r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) {
        results.push({ id: r.id, name: r.name, type: 'region', subtitle: 'Region / Realm', icon: 'fa-mountain-sun', regionId: r.id });
      }
    });

    // Search Locations
    get().regions.forEach((r) => {
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
  }
}));

export default useWorldStore;
