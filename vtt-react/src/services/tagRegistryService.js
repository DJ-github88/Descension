import useTagRegistryStore from '../store/tagRegistryStore';
import useFactionStore from '../store/factionStore';
import useWorldStore from '../store/worldStore';
import useFamilyTreeStore from '../store/familyTreeStore';
import useCustomLineageStore from '../store/customLineageStore';

/**
 * Universal Tag Registry Service
 * Aggregates tags dynamically across all system stores, providing unified query,
 * filtering, auto-linking, and tag cloud analytics.
 */
class TagRegistryService {
  /**
   * Harvest all intrinsic (derived) tags for an entity based on its schema properties
   */
  getDerivedTagsForEntity(entityType, entity) {
    if (!entity) return [];
    const tags = new Set();

    switch (entityType) {
      case 'npc':
        if (entity.race) tags.add(entity.race.toLowerCase().replace(/\s+/g, '-'));
        if (entity.gender) tags.add(entity.gender.toLowerCase());
        if (entity.factionIds) {
          entity.factionIds.forEach(fid => tags.add(`faction:${fid}`));
        }
        if (entity.locationIds) {
          entity.locationIds.forEach(lid => tags.add(`location:${lid}`));
        }
        if (entity.status) tags.add(`status:${entity.status.toLowerCase()}`);
        break;

      case 'faction':
        if (entity.type) tags.add(`type:${entity.type.toLowerCase()}`);
        if (entity.regionId) tags.add(`region:${entity.regionId.toLowerCase()}`);
        if (entity.headquarters) tags.add(`location:${entity.headquarters.toLowerCase()}`);
        break;

      case 'location':
        if (entity.type) tags.add(`type:${entity.type.toLowerCase()}`);
        if (entity.regionId) tags.add(`region:${entity.regionId.toLowerCase()}`);
        if (entity.dangerLevel) tags.add(`danger:${entity.dangerLevel.toLowerCase()}`);
        break;

      case 'family_node':
        if (entity.lineageId) tags.add(`lineage:${entity.lineageId.toLowerCase()}`);
        if (entity.gender) tags.add(entity.gender.toLowerCase());
        if (entity.role) tags.add(entity.role.toLowerCase().replace(/\s+/g, '-'));
        if (entity.isDeceased) tags.add('deceased');
        break;

      case 'quest':
        if (entity.type) tags.add(`type:${entity.type.toLowerCase()}`);
        if (entity.status) tags.add(`status:${entity.status.toLowerCase()}`);
        if (entity.locationId) tags.add(`location:${entity.locationId.toLowerCase()}`);
        break;

      case 'item':
        if (entity.itemType || entity.type) tags.add(`type:${(entity.itemType || entity.type).toLowerCase()}`);
        if (entity.rarity) tags.add(`rarity:${entity.rarity.toLowerCase()}`);
        if (entity.category) tags.add(`category:${entity.category.toLowerCase()}`);
        break;

      case 'spell':
        if (entity.school || entity.category) tags.add(`school:${(entity.school || entity.category).toLowerCase()}`);
        if (entity.level !== undefined) tags.add(`tier:${entity.level}`);
        if (entity.class) tags.add(`class:${entity.class.toLowerCase()}`);
        break;

      default:
        break;
    }

    return Array.from(tags);
  }

  /**
   * Get all tags for an entity (combining user custom tags + derived tags)
   */
  getAllTagsForEntity(entityType, entityId, entityObj = null) {
    const customTags = useTagRegistryStore.getState().getCustomTags(entityType, entityId);
    let entity = entityObj;

    if (!entity) {
      entity = this.resolveEntity(entityType, entityId);
    }

    const derivedTags = this.getDerivedTagsForEntity(entityType, entity);
    return Array.from(new Set([...customTags, ...derivedTags]));
  }

  /**
   * Resolve an entity object from its type and id
   */
  resolveEntity(entityType, entityId) {
    try {
      if (entityType === 'faction') {
        const factions = useFactionStore.getState().factions || [];
        return factions.find(f => f.id === entityId) || null;
      }
      if (entityType === 'location') {
        const locations = useWorldStore.getState().locations || [];
        return locations.find(l => l.id === entityId) || null;
      }
      if (entityType === 'family_node') {
        const trees = useFamilyTreeStore.getState().trees || [];
        for (const tree of trees) {
          const node = (tree.nodes || []).find(n => n.id === entityId);
          if (node) return node;
        }
      }
      if (entityType === 'lineage') {
        const lineages = useCustomLineageStore.getState().lineages || [];
        return lineages.find(l => l.id === entityId) || null;
      }
    } catch (err) {
      console.warn(`[TagRegistryService] Error resolving entity ${entityType}:${entityId}`, err);
    }
    return null;
  }

  /**
   * Collect all registered entities across active stores
   */
  getAllEntities() {
    const entities = [];

    // Factions
    try {
      const factions = useFactionStore.getState().factions || [];
      factions.forEach(f => {
        entities.push({
          type: 'faction',
          id: f.id,
          name: f.name,
          icon: 'fa-shield-halved',
          imageUrl: f.icon,
          summary: f.publicDescription || f.publicGoal || '',
          data: f
        });
      });
    } catch (e) {}

    // Locations
    try {
      const locations = useWorldStore.getState().locations || [];
      locations.forEach(l => {
        entities.push({
          type: 'location',
          id: l.id,
          name: l.name,
          icon: 'fa-map-location-dot',
          imageUrl: l.imageUrl,
          summary: l.description || l.summary || '',
          data: l
        });
      });
    } catch (e) {}

    // Family Tree Nodes
    try {
      const trees = useFamilyTreeStore.getState().trees || [];
      trees.forEach(tree => {
        (tree.nodes || []).forEach(node => {
          entities.push({
            type: 'family_node',
            id: node.id,
            name: node.name,
            icon: 'fa-user',
            imageUrl: node.portraitUrl,
            summary: `${node.title || ''} — ${node.role || ''} (${tree.name})`,
            treeId: tree.id,
            data: node
          });
        });
      });
    } catch (e) {}

    // Custom Lineages
    try {
      const lineages = useCustomLineageStore.getState().lineages || [];
      lineages.forEach(lin => {
        entities.push({
          type: 'lineage',
          id: lin.id,
          name: lin.name,
          icon: 'fa-dna',
          summary: lin.description || '',
          data: lin
        });
      });
    } catch (e) {}

    return entities;
  }

  /**
   * Build complete inverted tag index: { [tag]: EntityReference[] }
   */
  buildTagIndex() {
    const index = {};
    const entities = this.getAllEntities();

    for (const ent of entities) {
      const tags = this.getAllTagsForEntity(ent.type, ent.id, ent.data);
      for (const tag of tags) {
        if (!index[tag]) index[tag] = [];
        index[tag].push(ent);
      }
    }

    return index;
  }

  /**
   * Query entities by a tag
   */
  queryByTag(tag) {
    if (!tag) return [];
    const normalizedTag = tag.toLowerCase().trim().replace(/^#/, '');
    const index = this.buildTagIndex();
    return index[normalizedTag] || [];
  }

  /**
   * Get Tag Cloud with counts and metadata
   */
  getTagCloud() {
    const index = this.buildTagIndex();
    const metadata = useTagRegistryStore.getState().tagMetadata || {};

    return Object.keys(index).map(tag => ({
      tag,
      count: index[tag].length,
      meta: metadata[tag] || { name: tag, color: '#94a3b8', icon: 'fa-tag' }
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Auto-detect entity mentions in text string
   */
  detectMentions(text) {
    if (!text || typeof text !== 'string') return [];
    const entities = this.getAllEntities();
    const mentions = [];

    for (const ent of entities) {
      if (ent.name && ent.name.length >= 3) {
        const regex = new RegExp(`\\b${ent.name}\\b`, 'gi');
        if (regex.test(text)) {
          mentions.push(ent);
        }
      }
    }

    return mentions;
  }
}

export const tagRegistryService = new TagRegistryService();
export default tagRegistryService;
