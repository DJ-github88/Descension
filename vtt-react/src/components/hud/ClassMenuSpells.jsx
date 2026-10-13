import React from 'react';
import useKnownResourceSpells from '../../hooks/useKnownResourceSpells';

/**
 * ClassMenuSpells: "Your spells" block for class resource menus.
 * Lists only spells the character has learned that use this resource, with
 * real costs from the spell data. Nothing is invented: if the character knows
 * none (or this is a preview), it says so plainly.
 */
const ClassMenuSpells = ({ className, resourceTypes = [], resourceLabel = 'resource', current = 0, currentByType = null, limit = 6 }) => {
    const { hasCharacter, spenders, builders } = useKnownResourceSpells(className, resourceTypes);
    if (!hasCharacter) return null;
    const total = spenders.length + builders.length;

    return (
        <>
            <div className="cm-section">
                Your spells
                <span className="cm-section-aside">{total ? `${total} use ${resourceLabel}` : 'none yet'}</span>
            </div>
            {total === 0 ? (
                <p className="cm-line is-quiet">None of your learned spells use {resourceLabel} yet. New ones appear here as you learn them.</p>
            ) : (
                <ul className="cm-spells">
                    {builders.slice(0, limit).map((s) => (
                        <li key={s.id} className="cm-spell is-builder" title={`${s.name} builds ${resourceLabel}`}>
                            <span className="cm-spell-name">{s.name}</span>
                            <span className="cm-spell-cost">+{s.gain}</span>
                        </li>
                    ))}
                    {spenders.slice(0, limit).map((s) => {
                        const have = currentByType && s.type && currentByType[s.type] !== undefined ? currentByType[s.type] : current;
                        const short = Math.max(0, s.costValue - (Number(have) || 0));
                        return (
                            <li key={s.id} className={`cm-spell ${short === 0 ? 'is-ready' : 'is-short'}`} title={short === 0 ? `${s.name}: ready` : `${s.name}: needs ${short} more ${resourceLabel}`}>
                                <span className="cm-spell-name">{s.name}</span>
                                <span className="cm-spell-cost">{s.cost}</span>
                            </li>
                        );
                    })}
                    {(spenders.length > limit || builders.length > limit) && (
                        <li className="cm-spell is-more">More in your spellbook</li>
                    )}
                </ul>
            )}
        </>
    );
};

export default ClassMenuSpells;
