import universalEntityService from '../universalEntityService';
import useShareableStore from '../../store/shareableStore';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import campaignService from '../campaignService';

describe('UniversalEntityService', () => {
  beforeEach(() => {
    // Reset stores
    useShareableStore.setState({
      playerNotes: [
        { id: 'note-1', title: 'The Sunken Foundry', content: 'Ancient dwarven forge in Nordhalla with [[Sylas]] hiding inside.', lastModified: Date.now() },
        { id: 'note-2', title: 'Ember-Core Notes', content: 'Contains raw thermal energy for crafting.', lastModified: Date.now() }
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

  test('searches across notes, maps, and pins', () => {
    const foundryResults = universalEntityService.searchAll('Foundry');
    expect(foundryResults.length).toBeGreaterThan(0);
    expect(foundryResults[0].title).toBe('The Sunken Foundry');
    expect(foundryResults[0].type).toBe('note');

    const pinResults = universalEntityService.searchAll('Rime-Spire');
    expect(pinResults.length).toBeGreaterThan(0);
    expect(pinResults[0].title).toBe('Rime-Spire Peaks');
    expect(pinResults[0].type).toBe('map_pin');
  });

  test('indexes backlinks across notes', () => {
    const backlinks = universalEntityService.getBacklinks('Sylas');
    expect(backlinks.length).toBe(1);
    expect(backlinks[0].sourceTitle).toBe('The Sunken Foundry');
  });

  test('retrieves specific entity by exact or close name', () => {
    const entity = universalEntityService.getEntity('Rime-Spire Peaks');
    expect(entity).not.toBeNull();
    expect(entity.title).toBe('Rime-Spire Peaks');
    expect(entity.type).toBe('map_pin');
  });
});
