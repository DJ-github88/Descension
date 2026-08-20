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

class UniversalEntityService {
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
    if (allow('note') || allow('orb')) {
      try {
        const { playerNotes = [], knowledgeOrbs = [] } = useShareableStore.getState();

        playerNotes.forEach(note => {
          if (!cleanQuery || (note.title && note.title.toLowerCase().includes(cleanQuery)) || (note.content && note.content.toLowerCase().includes(cleanQuery))) {
            results.push({
              id: note.id,
              type: 'note',
              category: 'Journal Note',
              title: note.title || 'Untitled Note',
              subtitle: `Modified ${note.lastModified ? new Date(note.lastModified).toLocaleDateString() : 'recently'}`,
              icon: 'fa-sticky-note',
              color: '#3498db',
              raw: note,
              summary: note.content ? note.content.slice(0, 160) : 'Personal journal note.'
            });
          }
        });

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
   * Find a specific entity by exact name or ID across all stores
   * @param {string} nameOrId 
   */
  getEntity(nameOrId) {
    if (!nameOrId) return null;
    const clean = nameOrId.trim();
    const results = this.searchAll(clean, { limit: 10 });
    return results.find(r => r.title.toLowerCase() === clean.toLowerCase() || r.id === clean) || results[0] || null;
  }

  /**
   * Find all mentions and backlinks to a given entity name across notes and campaign logs
   * @param {string} entityName 
   */
  getBacklinks(entityName) {
    if (!entityName) return [];
    const cleanName = entityName.trim().toLowerCase();
    const token = `[[${cleanName}]]`;
    const backlinks = [];

    // Search player notes
    try {
      const { playerNotes = [] } = useShareableStore.getState();
      playerNotes.forEach(note => {
        if (note.content && (note.content.toLowerCase().includes(token) || note.content.toLowerCase().includes(cleanName))) {
          backlinks.push({
            id: note.id,
            sourceType: 'note',
            sourceTitle: note.title || 'Untitled Note',
            snippet: this.extractSnippet(note.content, cleanName),
            icon: 'fa-sticky-note'
          });
        }
      });
    } catch (_) {}

    // Search campaign NPCs, Quests, Sessions
    try {
      const currentCampaign = campaignService.getCurrentCampaign();
      const data = currentCampaign?.campaignData || {};

      (data.npcs || []).forEach(npc => {
        const text = `${npc.notes || ''} ${npc.secrets || ''}`;
        if (text.toLowerCase().includes(token) || text.toLowerCase().includes(cleanName)) {
          backlinks.push({
            id: npc.id,
            sourceType: 'npc',
            sourceTitle: npc.name || 'NPC Profile',
            snippet: this.extractSnippet(text, cleanName),
            icon: 'fa-user-ninja'
          });
        }
      });

      (data.quests || []).forEach(q => {
        const text = `${q.description || ''} ${(q.objectives || []).map(o => o.text).join(' ')}`;
        if (text.toLowerCase().includes(token) || text.toLowerCase().includes(cleanName)) {
          backlinks.push({
            id: q.id,
            sourceType: 'quest',
            sourceTitle: q.title || 'Quest Entry',
            snippet: this.extractSnippet(text, cleanName),
            icon: 'fa-scroll'
          });
        }
      });
    } catch (_) {}

    return backlinks;
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
}

const universalEntityService = new UniversalEntityService();
export default universalEntityService;
