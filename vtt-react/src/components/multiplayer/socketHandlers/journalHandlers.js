import useShareableStore from '../../../store/shareableStore';

/**
 * Journal / "Show to Players" socket handlers (client side).
 *
 * Receives 'journal_show_to_players' broadcasts emitted by a GM and ingests
 * the knowledge into the local shareableStore so PlayerDisplayOverlay renders
 * and the entry lands in the player's journal.
 */
export function registerJournalHandlers(ctx) {
  const { socket } = ctx;
  if (!socket) return () => {};

  const onShowToPlayers = (data) => {
    if (!data || !data.knowledge) return;
    // Ingest without re-emitting (receiveRemoteKnowledge does not broadcast).
    try {
      useShareableStore.getState().receiveRemoteKnowledge(data.knowledge);
    } catch (err) {
      console.error('Failed to ingest remote journal knowledge:', err);
    }
  };

  socket.on('journal_show_to_players', onShowToPlayers);

  return () => {
    socket.off('journal_show_to_players', onShowToPlayers);
  };
}
