import React, { useEffect } from 'react';
import TokenAreaCandidate from '../grid/TokenAreaCandidate';
import { actorKey, registerRendered, useCombatFeedStore, MAX_GROUPS } from '../../services/acceptedResultFeed';
// Styles are loaded centrally (App.jsx imports FloatingCombatText.css).

/**
 * P13A calm floating combat text (MYTHRILL_PROJECT_13A_CONTRACT.md §5).
 * Rendered inside each token's own render tree, so hidden, fogged and other-map tokens never show it and
 * pan/zoom follow automatically. Shows accepted HP changes only; aria-hidden (narration announces once).
 */
const GLYPHS = {
  damage: <path d="M6 1 C6 1 2 6 2 8.2 A4 4 0 0 0 10 8.2 C10 6 6 1 6 1 Z" />,
  heal: <path d="M5 1h2v4h4v2H7v4H5V7H1V5h4z" />,
  absorbed: <path d="M6 1 L10.5 2.6 V6 C10.5 8.6 8.6 10.3 6 11 C3.4 10.3 1.5 8.6 1.5 6 V2.6 Z" />,
  'temp-loss': <path d="M6 1 L10.5 2.6 V6 C10.5 8.6 8.6 10.3 6 11 C3.4 10.3 1.5 8.6 1.5 6 V2.6 Z" />,
  'temp-gain': <path d="M6 1 L10.5 2.6 V6 C10.5 8.6 8.6 10.3 6 11 C3.4 10.3 1.5 8.6 1.5 6 V2.6 Z" />
};
function Chip({ group }) {
  return (
    <div className="fct-group">
      {group.parts.map((part, index) => (
        <span key={index} className={`fct-chip fct-${part.kind}`}>
          <svg className="fct-glyph" viewBox="0 0 12 12" width="11" height="11" aria-hidden="true" focusable="false">{GLYPHS[part.kind]}</svg>
          {part.text}
        </span>
      ))}
    </div>
  );
}
export function TokenCombatFloats({ token, squash = 1 }) {
  const binding = token?.state?.actorContract;
  const key = binding?.version === 1 ? actorKey(binding) : '';
  useEffect(() => registerRendered(key), [key]);
  const groups = useCombatFeedStore(s => (key ? s.floats[key] : null));
  if (!key) return null;
  const shown = (groups || []).slice(-MAX_GROUPS), hidden = (groups?.length || 0) - shown.length;
  return (
    <>
    <TokenAreaCandidate token={token} />
    {shown.length > 0 &&
    <div className="fct-layer" aria-hidden="true" style={squash && squash !== 1 ? { transform: `translateX(-50%) scaleY(${1 / squash})` } : undefined}>
      {hidden > 0 && <div key={`more-${groups[0].id}-${hidden}`} className="fct-group fct-static"><span className="fct-chip fct-more">+{hidden}</span></div>}
      {shown.map(group => <Chip key={group.id} group={group} />)}
    </div>}
    </>
  );
}
/** The pre-P13A screen-space fountain is retired (its callers were disabled at the creator's request). */
export const FloatingCombatTextManager = () => null;
export default TokenCombatFloats;
