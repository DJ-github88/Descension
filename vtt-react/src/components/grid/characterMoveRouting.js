/**
 * Routing fields for the character_moved producer.
 *
 * The server contract preserves roomId/mapId on character_moved and derives
 * the acting player from the verified socket, so this helper only supplies
 * scope. `mapId` comes from the token's own recorded map (set by
 * characterTokenStore on every token create/update). When a token has no
 * recorded map the field is omitted so the server keeps its documented
 * default-map fallback. No identity fields are ever emitted.
 */
export function buildCharacterMoveRouting(token, multiplayerRoom) {
  const routing = {};
  if (token && token.mapId) {
    routing.mapId = token.mapId;
  }
  if (multiplayerRoom && multiplayerRoom.id) {
    routing.roomId = multiplayerRoom.id;
  }
  return routing;
}
