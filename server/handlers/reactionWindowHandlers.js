const { collector, EVENTS } = require('../services/reactionWindows');
const actors = require('../services/actorConsequences');

function registerReactionWindowHandlers(ctx) {
  const { socket, rooms, players, io, validateRoomMembership, authorityService } = ctx;
  function context(roomId) {
    const membership = validateRoomMembership(socket, roomId), player = players.get(socket.id);
    const room = rooms.get(roomId), uid = socket.data?.userId;
    if (!socket.data?.authenticated || !uid || !membership.valid || membership.room !== room || membership.player !== player ||
        !player || player.roomId !== roomId || (player.userId && player.userId !== uid)) { actors.fail('forbidden'); }
    const gm = player.isGM === true && room.gmId === uid && room.gm?.id === player.id && room.gm?.socketId === socket.id;
    if (!gm && player.userId !== uid) { actors.fail('forbidden'); }
    if (player.isGM && !gm || !gm && room.players?.get(player.id) !== player) { actors.fail('forbidden'); }
    return { room, player, uid, gm, token: room.authorityToken };
  }
  async function fresh(roomId) {
    const captured = context(roomId);
    if (!authorityService || !captured.token) { actors.fail('room_authority_unavailable'); }
    const check = await authorityService.assertCurrent(captured.token, { backendCheck: true });
    if (!check.ok) { actors.fail(check.code || 'room_authority_lost'); }
    const current = context(roomId);
    if (current.room !== captured.room || current.player !== captured.player || current.uid !== captured.uid ||
        current.gm !== captured.gm || !authorityService.validateCurrent(captured.token)) { actors.fail('room_binding_changed'); }
    return current;
  }
  function notify(room, w) {
    // Never broadcast changes to declarations or response counts, even to the GM.
    const audience = new Set([w.gmUid, ...w.invited.map(ref => ref.ownerUid)]);
    for (const [sid, player] of players) {
      const peer = io.sockets.sockets.get(sid), uid = peer?.data?.userId;
      const gm = room.gm?.socketId === sid && room.gmId === uid;
      if (peer?.data?.authenticated && player.roomId === room.id && audience.has(uid) &&
          (gm || room.players?.get(player.id) === player)) { peer.emit('reaction_window_changed', { roomId: room.id }); }
    }
  }
  for (const event of EVENTS) { socket.on(event, async(data, ack) => {
    const reply = value => { if (typeof ack === 'function') { ack(value); } };
    try {
      const c = await fresh(data?.roomId);
      // No awaits after this point: deadline, expected revision, installation and projection are one turn.
      if (event === 'reaction_window_list') {
        actors.keys(data, ['roomId']); reply(collector.snapshot(c.room, c));
      } else if (event === 'reaction_window_open') {
        const opened = collector.open(c.room, c, data); reply(opened.result);
        if (opened.fresh) { notify(c.room, opened.window); }
      } else if (event === 'reaction_window_change') { reply(collector.change(c.room, c, data)); }
      else {
        const interrupted = collector.interrupt(c.room, c, data); reply(interrupted.result); notify(c.room, interrupted.window);
      }
    } catch (error) {
      // No input/choice/actor details in error traffic or logs.
      reply({ success: false, code: error.code || 'window_unavailable' });
    }
  }); }
}
module.exports = { registerReactionWindowHandlers };
