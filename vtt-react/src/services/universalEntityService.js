// Universal Entity Service - Unifies Journal Notes, Campaign NPCs/Quests/Locations,
// World Lore, Map Pins, Dynasties, and Compendium Items into a single searchable graph.

import useWorldStore from '../store/worldStore';
import useFactionStore from '../store/factionStore';
import useCustomLineageStore from '../store/customLineageStore';
import useFamilyTreeStore from '../store/familyTreeStore';
import useInteractiveMapStore from '../store/interactiveMapStore';
import useShareableStore from '../store/shareableStore';
import useClassLoreStore from '../store/classLoreStore';
import campaignService from './campaignService';

const asText = (v) => {
  if (typeof v === 'string') return v;
  if (v == null) return '';
  return '';
};

class UniversalEntityService {
  escapeRegex(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Fast existence check for an entity by name, ID, or alias
   * @param {string} nameOrId 
   */
  hasEntity(nameOrId) {
    if (!nameOrId || typeof nameOrId !== 'string') return false;
    return !!this.getEntity(nameOrId);
  }

  /**
   * Search all entities across the entire Mythrill ecosystem
   * @param {string} query Search text
   * @param {object} options Filter options: { types: string[], limit: number, campaignId: string }
   */
  searchAll(query = '', options = {}) {
    const cleanQuery = (query || '').trim().toLowerCase();
    const { types = null, limit = 50 } = options;

    const results = [];

    // Helper to check type filter
    const allow = (type) => !types || types.includes(type);

    // 1. Journal Notes & Knowledge Orbs (from shareableStore)
    if (allow('note') || allow('orb') || allow('user_defined')) {
      try {
        const { playerNotes = [], knowledgeOrbs = [] } = useShareableStore.getState();

        playerNotes.forEach(note => {
          const title = note.title || 'Untitled Note';
          const aliases = Array.isArray(note.aliases) ? note.aliases.join(' ') : (note.aliases || '');
          const tags = Array.isArray(note.tags) ? note.tags.join(' ') : (note.tags || '');
          const searchableText = `${title} ${aliases} ${tags} ${note.content || ''}`.toLowerCase();

          if (!cleanQuery || searchableText.includes(cleanQuery)) {
            const archetype = note.archetype || 'note';
            let icon = 'fa-sticky-note';
            let color = '#3498db';
            let category = 'Journal Note';

            if (archetype === 'npc') {
              icon = 'fa-user-ninja';
              color = '#e74c3c';
              category = 'Custom NPC';
            } else if (archetype === 'location') {
              icon = 'fa-landmark';
              color = '#2ecc71';
              category = 'Custom Location';
            } else if (archetype === 'faction') {
              icon = 'fa-shield-halved';
              color = '#e67e22';
              category = 'Custom Faction';
            } else if (archetype === 'item' || archetype === 'relic') {
              icon = 'fa-gem';
              color = '#9b59b6';
              category = 'Custom Item';
            } else if (archetype === 'quest') {
              icon = 'fa-scroll';
              color = '#f39c12';
              category = 'Custom Quest';
            } else if (archetype === 'lore') {
              icon = 'fa-book-bookmark';
              color = '#d4af37';
              category = 'Custom Lore';
            }

            results.push({
              id: note.id,
              type: 'note',
              archetype,
              category,
              title,
              aliases: note.aliases || [],
              tags: note.tags || [],
              subtitle: note.aliases && note.aliases.length > 0 
                ? `aka ${note.aliases.join(', ')} • ${category}`
                : `Modified ${note.lastModified ? new Date(note.lastModified).toLocaleDateString() : 'recently'}`,
              icon,
              color,
              raw: note,
              sensory: note.sensory || null,
              secret: note.secret || null,
              summary: note.content ? note.content.slice(0, 160) : 'Personal journal note.'
            });
          }
        });

        if (allow('orb')) {
          knowledgeOrbs.forEach(orb => {
            if (!cleanQuery || (orb.label && orb.label.toLowerCase().includes(cleanQuery)) || (orb.content && orb.content.toLowerCase().includes(cleanQuery))) {
              results.push({
                id: orb.id,
                type: 'orb',
                category: 'Knowledge Orb',
                title: orb.label || 'Knowledge Orb',
                subtitle: orb.sourceType === 'note' ? 'Linked Note Orb' : 'Lore Orb',
                icon: orb.iconId || 'fa-circle-dot',
                color: orb.color || '#d4af37',
                raw: orb,
                summary: orb.content ? orb.content.slice(0, 160) : 'Orb on knowledge board.'
              });
            }
          });
        }
      } catch (e) {
        console.warn('UniversalEntityService: error reading notes', e);
      }
    }

    // 2. Active Campaign Entities (NPCs, Locations, Quests, Plot Threads, Sessions)
    if (allow('npc') || allow('quest') || allow('campaign_location') || allow('plot') || allow('session')) {
      try {
        const currentCampaign = campaignService.getCurrentCampaign();
        const data = currentCampaign?.campaignData || {};

        if (allow('npc') && Array.isArray(data.npcs)) {
          data.npcs.forEach(npc => {
            if (!cleanQuery || (npc.name && npc.name.toLowerCase().includes(cleanQuery)) || (npc.role && npc.role.toLowerCase().includes(cleanQuery)) || (npc.notes && npc.notes.toLowerCase().includes(cleanQuery))) {
              results.push({
                id: npc.id,
                type: 'npc',
                category: 'Campaign NPC',
                title: npc.name || 'Unnamed NPC',
                subtitle: `${npc.role || 'NPC'} • ${npc.attitude || 'Neutral'}`,
                icon: 'fa-user-ninja',
                color: '#e74c3c',
                raw: npc,
                summary: npc.notes || npc.appearance || 'Campaign character profile.',
                secret: npc.secrets || null,
                stats: npc.stats || null
              });
            }
          });
        }

        if (allow('quest') && Array.isArray(data.quests)) {
          data.quests.forEach(quest => {
            if (!cleanQuery || (quest.title && quest.title.toLowerCase().includes(cleanQuery)) || (quest.description && quest.description.toLowerCase().includes(cleanQuery))) {
              results.push({
                id: quest.id,
                type: 'quest',
                category: 'Quest Line',
                title: quest.title || 'Untitled Quest',
                subtitle: `Status: ${quest.status || 'Active'} • Stage ${quest.currentStage || 1}`,
                icon: 'fa-scroll',
                color: '#f39c12',
                raw: quest,
                summary: quest.description || 'Campaign adventure quest.',
                objectives: quest.objectives || [],
                rewards: quest.rewards || null
              });
            }
          });
        }

        if (allow('campaign_location') && Array.isArray(data.locations)) {
          data.locations.forEach(loc => {
            if (!cleanQuery || (loc.name && loc.name.toLowerCase().includes(cleanQuery)) || (loc.description && loc.description.toLowerCase().includes(cleanQuery))) {
              results.push({
                id: loc.id,
                type: 'campaign_location',
                category: 'Campaign Location',
                title: loc.name || 'Unnamed Place',
                subtitle: loc.region || 'Campaign Realm',
                icon: 'fa-landmark',
                color: '#2ecc71',
                raw: loc,
                summary: loc.description || 'Key campaign setting location.'
              });
            }
          });
        }

        if (allow('plot') && Array.isArray(data.plotThreads)) {
          data.plotThreads.forEach(plot => {
            if (!cleanQuery || (plot.title && plot.title.toLowerCase().includes(cleanQuery)) || (plot.summary && plot.summary.toLowerCase().includes(cleanQuery))) {
              results.push({
                id: plot.id,
                type: 'plot',
                category: 'Plot Thread',
                title: plot.title || 'Plot Arc',
                subtitle: `Act ${plot.act || 1} • ${plot.status || 'Ongoing'}`,
                icon: 'fa-diagram-project',
                color: '#9b59b6',
                raw: plot,
                summary: plot.summary || 'Campaign plot thread.'
              });
            }
          });
        }
      } catch (e) {
        console.warn('UniversalEntityService: error reading campaign', e);
      }
    }

    // 3. Interactive Maps & Map Pins
    if (allow('map') || allow('map_pin')) {
      try {
        const { maps = [], pins = [] } = useInteractiveMapStore.getState();

        if (allow('map')) {
          maps.forEach(m => {
            if (!cleanQuery || (m.name && m.name.toLowerCase().includes(cleanQuery)) || (m.description && m.description.toLowerCase().includes(cleanQuery))) {
              results.push({
                id: m.id,
                type: 'map',
                category: 'Atlas Map',
                title: m.name,
                subtitle: `${(m.type || 'region').toUpperCase()} Map Tier`,
                icon: 'fa-map',
                color: '#1abc9c',
                raw: m,
                summary: m.description || 'Interactive campaign atlas map.'
              });
            }
          });
        }

        if (allow('map_pin')) {
          pins.forEach(pin => {
            if (!cleanQuery || (pin.title && pin.title.toLowerCase().includes(cleanQuery)) || (pin.description && pin.description.toLowerCase().includes(cleanQuery))) {
              results.push({
                id: pin.id,
                type: 'map_pin',
                category: 'Map Location Marker',
                title: pin.title,
                subtitle: `${pin.type || 'Landmark'} Pin (${Math.round(pin.x)}%, ${Math.round(pin.y)}%)`,
                icon: pin.icon || 'fa-location-dot',
                color: pin.color || '#d4af37',
                raw: pin,
                mapId: pin.mapId,
                summary: pin.description || 'Marked point of interest on the atlas.'
              });
            }
          });
        }
      } catch (e) {
        console.warn('UniversalEntityService: error reading map store', e);
      }
    }

    // 4. World Lore & Factions
    if (allow('world_lore') || allow('faction') || allow('lineage')) {
      try {
        const worldState = useWorldStore.getState();
        const factionState = useFactionStore.getState();

        if (allow('world_lore') && worldState.searchEntities) {
          const worldEntities = worldState.searchEntities(cleanQuery);
          worldEntities.forEach(we => {
            results.push({
              id: we.id || we.name,
              type: we.type || 'world_lore',
              category: `World ${we.type ? we.type.toUpperCase() : 'Lore'}`,
              title: we.name,
              subtitle: we.subtitle || 'Canonical World Lore',
              icon: we.type === 'location' ? 'fa-mountain-sun' : (we.type === 'faction' ? 'fa-shield-halved' : 'fa-book-bookmark'),
              color: '#d4af37',
              raw: we,
              summary: we.summary || we.description || `Canonical ${we.name} article.`
            });
          });
        }

        if (allow('faction') && Array.isArray(factionState.factions)) {
          factionState.factions.forEach(fac => {
            if (!cleanQuery || (fac.name && fac.name.toLowerCase().includes(cleanQuery)) || (fac.publicGoal && fac.publicGoal.toLowerCase().includes(cleanQuery))) {
              if (!results.some(r => r.type === 'faction' && r.title.toLowerCase() === fac.name.toLowerCase())) {
                results.push({
                  id: fac.id,
                  type: 'faction',
                  category: 'Faction Order',
                  title: fac.name,
                  subtitle: fac.type ? fac.type.replace('_', ' ').toUpperCase() : 'Faction',
                  icon: 'fa-shield-halved',
                  color: fac.colors?.primary || '#e67e22',
                  raw: fac,
                  summary: fac.publicGoal || fac.description || 'Influential faction in the realm.',
                  secret: fac.secretGoal || null
                });
              }
            }
          });
        }
      } catch (e) {
        console.warn('UniversalEntityService: error reading world store', e);
      }
    }

    // 5. Dynasties & Bloodlines
    if (allow('dynasty')) {
      try {
        const { trees = [] } = useFamilyTreeStore.getState();
        trees.forEach(tree => {
          if (!cleanQuery || (tree.name && tree.name.toLowerCase().includes(cleanQuery)) || (tree.description && tree.description.toLowerCase().includes(cleanQuery))) {
            results.push({
              id: tree.id,
              type: 'dynasty',
              category: 'Dynasty Tree',
              title: tree.name,
              subtitle: `${tree.nodes?.length || 0} Dynastic Members`,
              icon: 'fa-sitemap',
              color: '#8e44ad',
              raw: tree,
              summary: tree.description || 'Ruling house & ancestry tree.'
            });
          }
        });
      } catch (e) {
        console.warn('UniversalEntityService: error reading family tree store', e);
      }
    }

    return results.slice(0, limit);
  }

  /**
   * Find a specific entity by exact name, alias, or ID across all stores
   * @param {string} nameOrId 
   */
  getEntity(nameOrId) {
    if (!nameOrId || typeof nameOrId !== 'string') return null;
    const clean = nameOrId.trim();
    if (!clean) return null;
    const cleanLower = clean.toLowerCase();

    const results = this.searchAll(clean, { limit: 25 });
    
    // 1. Exact match on title or ID
    const exactMatch = results.find(r => 
      (r.title && r.title.toLowerCase() === cleanLower) || 
      (r.name && r.name.toLowerCase() === cleanLower) || 
      r.id === clean
    );
    if (exactMatch) return exactMatch;

    // 2. Exact match on aliases
    const aliasMatch = results.find(r => 
      Array.isArray(r.aliases) && r.aliases.some(a => a.toLowerCase() === cleanLower)
    );
    if (aliasMatch) return aliasMatch;

    // 3. Match from worldStore searchEntities directly
    try {
      const worldState = useWorldStore.getState();
      if (worldState.searchEntities) {
        const worldMatches = worldState.searchEntities(clean);
        const exactWorld = worldMatches.find(w => w.name.toLowerCase() === cleanLower || w.id === clean);
        if (exactWorld) {
          return {
            id: exactWorld.id || exactWorld.name,
            type: exactWorld.type || 'world_lore',
            category: `World ${exactWorld.type ? exactWorld.type.toUpperCase() : 'Lore'}`,
            title: exactWorld.name,
            subtitle: exactWorld.subtitle || 'Canonical World Lore',
            icon: exactWorld.type === 'location' ? 'fa-mountain-sun' : (exactWorld.type === 'faction' ? 'fa-shield-halved' : 'fa-book-bookmark'),
            color: '#d4af37',
            raw: exactWorld,
            summary: exactWorld.summary || exactWorld.description || `Canonical ${exactWorld.name} article.`
          };
        }
      }
    } catch (_) {}

    return null;
  }

  /**
   * Find all mentions and backlinks to a given entity name across notes and campaign logs
   * Uses exact regex matching for [[WikiLinks]] and word boundaries for unlinked mentions
   * @param {string} entityName 
   */
  getBacklinks(entityName) {
    if (!entityName || typeof entityName !== 'string') {
      const empty = [];
      empty.directLinks = [];
      empty.unlinkedMentions = [];
      return empty;
    }

    const cleanName = entityName.trim();
    if (!cleanName) {
      const empty = [];
      empty.directLinks = [];
      empty.unlinkedMentions = [];
      return empty;
    }

    const escaped = this.escapeRegex(cleanName);
    // Regex for [[EntityName]] or [[EntityName|Alias]] or [[EntityName#Heading]] or [[EntityName#Heading|Alias]]
    const directRegex = new RegExp(`\\[\\[${escaped}(?:#[^\\]|]+)?(?:\\|[^\\]]+)?\\]\\]`, 'i');
    // Regex for unlinked mentions using word boundary
    const wordBoundaryRegex = new RegExp(`\\b${escaped}\\b`, 'i');

    const directLinks = [];
    const unlinkedMentions = [];

    // Search player notes
    try {
      const { playerNotes = [] } = useShareableStore.getState();
      playerNotes.forEach(note => {
        if (!note.content) return;
        // Do not self-link
        if (note.title && note.title.toLowerCase() === cleanName.toLowerCase()) return;

        if (directRegex.test(note.content)) {
          directLinks.push({
            id: note.id,
            sourceType: 'note',
            sourceTitle: note.title || 'Untitled Note',
            snippet: this.extractSnippet(note.content, cleanName),
            icon: 'fa-sticky-note',
            raw: note
          });
        } else if (wordBoundaryRegex.test(note.content)) {
          unlinkedMentions.push({
            id: note.id,
            sourceType: 'note',
            sourceTitle: note.title || 'Untitled Note',
            snippet: this.extractSnippet(note.content, cleanName),
            icon: 'fa-sticky-note',
            raw: note
          });
        }
      });
    } catch (_) {}

    // Search campaign NPCs, Quests, Sessions
    try {
      const currentCampaign = campaignService.getCurrentCampaign();
      const data = currentCampaign?.campaignData || {};

      (data.npcs || []).forEach(npc => {
        if (npc.name && npc.name.toLowerCase() === cleanName.toLowerCase()) return;
        const text = `${npc.notes || ''} ${npc.secrets || ''}`;
        if (directRegex.test(text)) {
          directLinks.push({
            id: npc.id,
            sourceType: 'npc',
            sourceTitle: npc.name || 'NPC Profile',
            snippet: this.extractSnippet(text, cleanName),
            icon: 'fa-user-ninja',
            raw: npc
          });
        } else if (wordBoundaryRegex.test(text)) {
          unlinkedMentions.push({
            id: npc.id,
            sourceType: 'npc',
            sourceTitle: npc.name || 'NPC Profile',
            snippet: this.extractSnippet(text, cleanName),
            icon: 'fa-user-ninja',
            raw: npc
          });
        }
      });

      (data.quests || []).forEach(q => {
        if (q.title && q.title.toLowerCase() === cleanName.toLowerCase()) return;
        const text = `${q.description || ''} ${(q.objectives || []).map(o => o.text).join(' ')}`;
        if (directRegex.test(text)) {
          directLinks.push({
            id: q.id,
            sourceType: 'quest',
            sourceTitle: q.title || 'Quest Entry',
            snippet: this.extractSnippet(text, cleanName),
            icon: 'fa-scroll',
            raw: q
          });
        } else if (wordBoundaryRegex.test(text)) {
          unlinkedMentions.push({
            id: q.id,
            sourceType: 'quest',
            sourceTitle: q.title || 'Quest Entry',
            snippet: this.extractSnippet(text, cleanName),
            icon: 'fa-scroll',
            raw: q
          });
        }
      });
    } catch (_) {}

    // Return array of directLinks with properties attached for backward-compatibility and rich extensions
    const result = [...directLinks];
    result.directLinks = directLinks;
    result.unlinkedMentions = unlinkedMentions;
    return result;
  }

  /**
   * Extract contextual text snippet around a match
   */
  extractSnippet(content, keyword) {
    if (!content) return '';
    const idx = content.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx === -1) return content.slice(0, 100) + '...';
    const start = Math.max(0, idx - 40);
    const end = Math.min(content.length, idx + keyword.length + 60);
    return (start > 0 ? '...' : '') + content.slice(start, end).replace(/[\n\r]+/g, ' ') + (end < content.length ? '...' : '');
  }

  /**
   * Compendium sources: static/curated game data (creatures, classes, races, items).
   * Loaded once via dynamic imports so they stay in async chunks and never bloat the main bundle.
   */
  async _loadCompendium() {
    if (this._compendiumCache) return this._compendiumCache;
    const entries = [];

    try {
      const creatureMod = await import('../data/creatureData.json');
      const creatures = (creatureMod.default?.regions || []).flatMap((r) => r.creatures || []);
      creatures.forEach((c) => {
        const name = c.name || c.title;
        if (!name) return;
        entries.push({
          id: `creature:${c.id || name.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'creature',
          category: 'Bestiary Creature',
          title: name,
          subtitle: [c.type, c.challenge || c.cr, c.region].filter((x) => typeof x === 'string').join(' · ') || 'Creature of Mythrill',
          icon: 'fa-dragon',
          color: '#8e44ad',
          raw: c,
          summary: asText(c.description) || asText(c.lore) || asText(c.summary) || 'A creature documented in the Mythrill bestiary.'
        });
      });
    } catch (_) {}

    try {
      const classMod = await import('../data/classes/index.js');
      const allClasses = classMod.ALL_CLASSES_DATA || {};
      Object.entries(allClasses).forEach(([name, data]) => {
        if (!name) return;
        entries.push({
          id: `class:${name.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'class',
          category: 'Character Class',
          title: name,
          subtitle: asText(data.playstyle) || asText(data.tagline) || 'A calling of Mythrill',
          icon: 'fa-hat-wizard',
          color: '#c0392b',
          raw: { name, ...data },
          summary: asText(data.description) || asText(data.overview) || asText(data.playstyle) || 'One of the 21 callings.'
        });
      });
    } catch (_) {}

    try {
      const raceMod = await import('../data/races/index.js');
      const allRaces = raceMod.ALL_RACES || {};
      Object.entries(allRaces).forEach(([key, data]) => {
        const name = data?.name || key;
        entries.push({
          id: `race:${key}`,
          type: 'race',
          category: 'People of Mythrill',
          title: name,
          subtitle: asText(data.tagline) || asText(data.summary) || 'A people of the world',
          icon: 'fa-people-group',
          color: '#16a085',
          raw: { key, ...data },
          summary: asText(data.description) || asText(data.overview) || asText(data.lore) || 'A lineage of Mythrill.'
        });
      });
    } catch (_) {}

    try {
      const { default: useItemStore } = await import('../store/itemStore.js');
      const items = useItemStore.getState().items || [];
      items.forEach((it) => {
        const name = it.name || it.title;
        if (!name) return;
        entries.push({
          id: `item:${it.id || name.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'item',
          category: 'Item Compendium',
          title: name,
          subtitle: [it.itemType || it.type, it.rarity].filter((x) => typeof x === 'string').join(' · ') || 'Item',
          icon: 'fa-gem',
          color: '#f39c12',
          raw: it,
          summary: asText(it.description) || asText(it.flavorText) || 'An item of Mythrill.'
        });
      });
    } catch (_) {}

    this._compendiumCache = entries;
    return entries;
  }

  /**
   * Everything embeddable in a book: live world/campaign/journal graph + compendium.
   * Normalized to { id, type, name, icon, summary, category } for embed pickers.
   */
  async getAllBookEmbeddables(options = {}) {
    const { limit = 2000, includeCompendium = true } = options;
    const seen = new Set();
    const out = [];

    const push = (e) => {
      if (!e) return;
      const key = `${e.type}:${e.id}`;
      if (seen.has(key) || out.length >= limit) return;
      seen.add(key);
      out.push({
        id: e.id,
        type: e.type,
        name: e.title || e.name || 'Unnamed',
        icon: (e.icon || '').startsWith('fa') ? e.icon : 'fa-circle-dot',
        summary: e.summary || e.subtitle || '',
        category: e.category || e.type,
        raw: e.raw || null
      });
    };

    this.searchAll('', { limit }).forEach(push);

    if (includeCompendium) {
      const compendium = await this._loadCompendium();
      compendium.forEach(push);
    }

    return out;
  }
}

const universalEntityService = new UniversalEntityService();
export default universalEntityService;

