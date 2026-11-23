import React from 'react';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { FLOW_MAX, FLOW_RESOURCE_TYPE, projectHunterFlowResource } from '../../services/hunterFlow';

// Consume only the public stage from the current primary actor. No mirror in personal saves.
export default function RoomHunterResource({ self = false, ownerUid, characterId }) {
    const roomId = useGameStore(s => s.multiplayerRoom?.id);
    const viewer = useAuthStore(s => s.user?.uid);
    const selectedId = useCharacterStore(s => s.currentCharacterId);
    const owner = self ? viewer : ownerUid;
    const id = self ? selectedId : characterId;
    const current = useCharacterTokenStore(s => {
        if (!viewer || !owner || !roomId || (self && !id)) return null;
        const matches = s.characterTokens.filter(token => {
            const ref = token.state?.actorContract;
            return ref?.primary === true && ref.kind === 'character' && ref.roomId === roomId &&
                ref.instanceId && ref.tokenId === token.id && ref.ownerUid === owner &&
                (!id || (ref.characterId === id && token.character?.id === id)) &&
                token.ownerUserId === owner && token.character?.class === 'Hunter';
        });
        return matches.length === 1 ? matches[0].committedHunterFlow : null;
    });
    const view = Number.isInteger(current) && projectHunterFlowResource({ type: FLOW_RESOURCE_TYPE, current }, false);
    return <section aria-label="Hunter Flow">
        <strong>Flow: {view?.valid ? `${view.flow} / ${FLOW_MAX}` : 'not confirmed for this actor'}</strong>
        <details><summary>How Quick Draw uses Flow</summary>
            <p>Start and end each encounter at 1. Roll 2d6 once per committed Quick Draw, including misses. Doubles raise Flow by one; another difference within the prior Flow maintains it. Both qualify for +2 stabbing damage on a hit. Outside that range Flow falls by one. A miss deals no damage.</p>
            <p>Flow stays between 1 and 4. It is never spent. Companion actions and preparation are not automated.</p>
        </details>
    </section>;
}
