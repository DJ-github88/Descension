import universalEntityService from '../universalEntityService';
import useShareableStore from '../../store/shareableStore';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import campaignService from '../campaignService';

describe('UniversalEntityService', () => {
  beforeEach(() => {
    // Reset stores
    useShareableStore.setState({
      playerNotes: [
        { 
          id: 'note-1', 
          title: 'The Sunken Foundry', 
          archetype: 'location',
          aliases: ['Iron Crucible', 'Old Forge'],
          content: 'Ancient dwarven forge in Nordhalla with [[Sylas|The Shadow Thief]] and mentions of Baron Kroll.', 
          lastModified: Date.now() 
        },
        { 
          id: 'note-2', 
          title: 'Ember-Core Notes', 
          archetype: 'item',
          content: 'Contains raw thermal energy for crafting. Discovered in [[The Sunken Foundry#Core Room]].', 
          lastModified: Date.now() 
        },
        {
          id: 'note-3',
          title: 'Sylas Profile',
          archetype: 'npc',
          aliases: ['The Shadow Thief', 'Silas'],
          content: 'Master thief of Nordhalla. Operates near The Sunken Foundry.',
          lastModified: Date.now()
        }
      ],
      knowledgeOrbs: []
    });

    useInteractiveMapStore.setState({
      maps: [
        { id: 'map-1', name: 'Nordhalla Realm', type: 'region', description: 'Frozen northern expanse' }
      ],
      pins: [
        { id: 'pin-1', title: 'Rime-Spire Peaks', type: 'Mountain', mapId: 'map-1', description: 'Jagged glacier ridge', x: 45, y: 60 }
      ]
    });
  });

  test('searches across notes, archetypes, maps, and pins', () => {
    const foundryResults = universalEntityService.searchAll('Foundry');
    expect(foundryResults.length).toBeGreaterThan(0);
    expect(foundryResults[0].title).toBe('The Sunken Foundry');
    expect(foundryResults[0].type).toBe('note');
    expect(foundryResults[0].archetype).toBe('location');
    expect(foundryResults[0].category).toBe('Custom Location');

    const pinResults = universalEntityService.searchAll('Rime-Spire');
    expect(pinResults.length).toBeGreaterThan(0);
    expect(pinResults[0].title).toBe('Rime-Spire Peaks');
    expect(pinResults[0].type).toBe('map_pin');
  });

  test('indexes direct backlinks with pipe aliases and section anchors', () => {
    const sylasBacklinks = universalEntityService.getBacklinks('Sylas');
    expect(sylasBacklinks.length).toBe(1);
    expect(sylasBacklinks[0].sourceTitle).toBe('The Sunken Foundry');

    const foundryBacklinks = universalEntityService.getBacklinks('The Sunken Foundry');
    expect(foundryBacklinks.length).toBe(1);
    expect(foundryBacklinks[0].sourceTitle).toBe('Ember-Core Notes');
    // Also verify unlinked mentions for note-3 which mentions "The Sunken Foundry" in plain text
    expect(foundryBacklinks.unlinkedMentions.length).toBe(1);
    expect(foundryBacklinks.unlinkedMentions[0].sourceTitle).toBe('Sylas Profile');
  });

  test('retrieves specific entity by exact title, ID, or alias', () => {
    const entity = universalEntityService.getEntity('Rime-Spire Peaks');
    expect(entity).not.toBeNull();
    expect(entity.title).toBe('Rime-Spire Peaks');
    expect(entity.type).toBe('map_pin');

    // Retrieve note by alias
    const aliasEntity = universalEntityService.getEntity('The Shadow Thief');
    expect(aliasEntity).not.toBeNull();
    expect(aliasEntity.title).toBe('Sylas Profile');
    expect(aliasEntity.archetype).toBe('npc');

    // hasEntity check
    expect(universalEntityService.hasEntity('Sylas Profile')).toBe(true);
    expect(universalEntityService.hasEntity('The Shadow Thief')).toBe(true);
    expect(universalEntityService.hasEntity('Uncreated Void Lord')).toBe(false);
  });

  test('avoids false positive backlinks on substrings', () => {
    // Search for a short keyword "Iron" that appears in "Iron Crucible"
    const backlinks = universalEntityService.getBacklinks('Iron');
    // None of the notes have [[Iron]]
    expect(backlinks.length).toBe(0);
  });
});

