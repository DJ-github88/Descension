/**
 * Project 1 closure: the character_moved producer routing contract.
 *
 * The producer must forward the token's recorded map (non-default included)
 * and the active room, while never emitting identity fields: the server
 * derives the acting player from the verified socket.
 */
import { buildCharacterMoveRouting } from '../characterMoveRouting';

describe('buildCharacterMoveRouting (character_moved producer)', () => {
  it('forwards a non-default mapId from the token itself', () => {
    const routing = buildCharacterMoveRouting({ mapId: 'map-2' }, { id: 'room-1' });
    expect(routing).toEqual({ mapId: 'map-2', roomId: 'room-1' });
  });

  it('forwards the default map when that is the token map', () => {
    const routing = buildCharacterMoveRouting({ mapId: 'default' }, { id: 'room-1' });
    expect(routing).toEqual({ mapId: 'default', roomId: 'room-1' });
  });

  it('omits mapId/roomId when unavailable so the server keeps documented fallbacks', () => {
    expect(buildCharacterMoveRouting({}, { id: 'room-1' })).toEqual({ roomId: 'room-1' });
    expect(buildCharacterMoveRouting({ mapId: 'map-2' }, null)).toEqual({ mapId: 'map-2' });
    expect(buildCharacterMoveRouting(undefined, undefined)).toEqual({});
  });

  it('never emits identity fields', () => {
    const routing = buildCharacterMoveRouting(
      { mapId: 'map-2', playerId: 'attacker', userId: 'uid-attacker' },
      { id: 'room-1' }
    );
    expect(routing.playerId).toBeUndefined();
    expect(routing.userId).toBeUndefined();
  });
});
