// Local presentation model, not a combat event/server contract.
export const QUEUE_LIMIT = 4;
export const PHASE_LABELS = {
  declaration: 'Declaration',
  opportunity: 'Reaction opportunity',
  response: 'Response',
  unresolved: 'Unconfirmed outcome',
  outcome: 'Accepted outcome',
  summary: 'Grouped announcements'
};

export const emptyNarration = () => ({
  current: null, waiting: [], history: [], grouped: 0, archived: 0
});

// Copy only explicitly public display fields. Never traverse an actor/receipt.
export function publicAnnouncement(input) {
  if (!input || typeof input.id !== 'string' || !input.id.trim()
    || typeof input.text !== 'string' || !input.text.trim()
    || !['declaration', 'opportunity', 'response', 'unresolved', 'outcome'].includes(input.phase)) return null;
  if (input.phase === 'outcome' && (input.accepted !== true || ['pending', 'unknown'].includes(input.certainty))) return null;
  if (input.phase === 'unresolved' && !['pending', 'unknown'].includes(input.certainty)) return null;
  return {
    id: input.id,
    text: input.text,
    phase: input.phase,
    certainty: input.phase === 'unresolved' ? input.certainty : null,
    important: input.important === true || ['outcome', 'opportunity', 'unresolved'].includes(input.phase),
    arithmetic: typeof input.arithmetic === 'string' ? input.arithmetic : '',
    source: typeof input.source === 'string' ? input.source : ''
  };
}

export function phaseLabel(event) {
  if (event.phase === 'unresolved') return event.certainty === 'unknown' ? 'Outcome unknown' : 'Outcome pending';
  return PHASE_LABELS[event.phase];
}

export function overflowText(grouped, archived) {
  return [
    grouped ? `${grouped} routine announcement${grouped === 1 ? '' : 's'} grouped.` : '',
    archived ? `${archived} priority announcement${archived === 1 ? '' : 's'} saved directly to history.` : ''
  ].filter(Boolean).join(' ');
}

export function narrationReducer(state, action) {
  if (action.type === 'reset') return emptyNarration();
  if (action.type === 'advance') {
    if (state.waiting.length) return { ...state, current: state.waiting[0], waiting: state.waiting.slice(1) };
    if (state.grouped || state.archived) return {
      ...state,
      current: { id: 'overflow-summary', phase: 'summary', text: overflowText(state.grouped, state.archived) },
      grouped: 0, archived: 0
    };
    return { ...state, current: null };
  }
  if (action.type !== 'publish') return state;
  let next = state;
  for (const input of action.events) {
    const event = publicAnnouncement(input);
    if (!event || next.history.some(item => item.id === event.id)) continue;
    next = { ...next, history: [...next.history, event] };
    if (!next.current) {
      next = { ...next, current: event };
    } else if (next.waiting.length < QUEUE_LIMIT) {
      next = { ...next, waiting: [...next.waiting, event] };
    } else if (!event.important) {
      next = { ...next, grouped: next.grouped + 1 };
    } else {
      const routineIndex = next.waiting.findIndex(item => !item.important);
      if (routineIndex < 0) {
        // Bounded banner queue; every priority item is still in session history.
        next = { ...next, archived: next.archived + 1 };
      } else {
        next = {
          ...next,
          waiting: [...next.waiting.filter((_, index) => index !== routineIndex), event],
          grouped: next.grouped + 1
        };
      }
    }
  }
  return next;
}
