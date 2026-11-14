const payments = require('./spellPayments');
const strikes = require('./strikeApprovals');
const blocks = require('./blockApprovals');
const riposte = require('./riposteExecution');

const CODE = 'combat_clock_changed';

function sessionUid(room, sid, member) {
  return member.userId || (member.isGM && room.gm?.id === member.id && room.gm?.socketId === sid ? room.gmId : null);
}

function entitled(io, rooms, room, sid, member) {
  const peer = io.sockets?.sockets?.get(sid);
  if (!peer) {return false;}
  if (rooms && rooms.get(room.id) !== room) {return false;}
  if (member.roomId !== room.id || !peer.data?.authenticated) {return false;}
  const uid = sessionUid(room, sid, member);
  if (!uid || uid !== peer.data.userId) {return false;}
  if (member.isGM) {return room.gm?.id === member.id && room.gm?.socketId === sid && peer.data.userId === room.gmId;}
  return room.players?.get(member.id) === member;
}

function closePending(room, code = CODE) {
  const closures = [];
  for (const entry of payments.listAll(room)) {
    const approval = entry.approval;
    payments.close(room, approval.approvalId, code);
    closures.push({
      capability: payments.CAPABILITY,
      event: 'actor_spell_closed',
      approvalId: approval.approvalId,
      contentHash: entry.contentHash ?? null,
      ownerUid: approval.source?.ownerUid ?? entry.ownerUid ?? null,
      targetOwnerUid: entry.targetPolicy ? approval.target?.ownerUid ?? null : null,
      code
    });
  }
  for (const entry of strikes.listAll(room)) {
    const approval = entry.approval;
    strikes.close(room, approval.approvalId, code);
    closures.push({
      capability: riposte.isApproval(approval) ? riposte.CAPABILITY : strikes.CAPABILITY,
      event: riposte.isApproval(approval) ? 'actor_riposte_closed' : 'actor_strike_closed',
      approvalId: approval.approvalId,
      contentHash: entry.contentHash ?? null,
      ownerUid: approval.source?.ownerUid ?? entry.ownerUid ?? null,
      targetOwnerUid: null,
      code
    });
  }
  for (const entry of blocks.listAll(room)) {
    const approval = entry.approval;
    blocks.close(room, approval.approvalId, code);
    closures.push({
      capability: blocks.CAPABILITY,
      event: 'actor_block_closed',
      approvalId: approval.approvalId,
      contentHash: entry.contentHash ?? null,
      ownerUid: approval.target?.ownerUid ?? entry.ownerUid ?? null,
      targetOwnerUid: null,
      code
    });
  }
  return closures;
}

function notify(ctx, room, closures) {
  const { io, players, rooms, logger } = ctx;
  if (!io || !players || !Array.isArray(closures) || !closures.length) {return;}
  for (const closure of closures) {
    const payload = { roomId: room.id, approvalId: closure.approvalId, contentHash: closure.contentHash, code: closure.code };
    const uids = new Set([closure.ownerUid, closure.targetOwnerUid].filter(Boolean));
    for (const [sid, member] of players) {
      if (!entitled(io, rooms, room, sid, member)) {continue;}
      const uid = sessionUid(room, sid, member);
      if (!member.isGM && !(uid && uids.has(uid))) {continue;}
      try {io.to(sid).emit(closure.event, payload);} catch (error) {logger?.warn?.('[combat-clock-approvals] delivery failed', { roomId: room.id, event: closure.event, error: error.message });}
    }
  }
}

module.exports = { CODE, closePending, notify };
