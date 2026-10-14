import React from 'react';
import useKnownResourceSpells from '../../hooks/useKnownResourceSpells';

/**
 * ClassMenuSpells: "Your spells" block for class resource menus.
 * Lists only spells this character has learned whose cast changes the class
 * resource, with the exact cost/gain casting applies (same planner as the
 * action bar). Nothing is invented: previews and other classes render nothing,
 * and a character who knows none is told so plainly.
 */
const ClassMenuSpells = ({ className, resourceTypes = [], resourceLabel = 'resource', limit = 6 }) => {
    const { hasCharacter, spenders, builders } = useKnownResourceSpells(className, resourceTypes);
    if (!hasCharacter) return null;
    const total = spenders.length + builders.length;
    const labels = new Set([...spenders, ...builders].map(s => s.label).filter(Boolean));
    const showLabel = labels.size > 1;
    const unit = (s) => (showLabel && s.label ? ` ${s.label}` : '');

    return (
        <>
            <div className="cm-section">
                Your spells
                <span className="cm-section-aside">{total ? `${total} learned use ${resourceLabel}` : 'none use it yet'}</span>
            </div>
            {total === 0 ? (
                <p className="cm-line is-quiet">None of your learned spells use {resourceLabel} yet. New ones appear here as you learn them.</p>
            ) : (
                <ul className="cm-spells">
                    {builders.slice(0, limit).map((s) => (
                        <li key={`b-${s.id}`} className="cm-spell is-builder" title={`${s.name}: casting it builds ${s.gain}${unit(s) || ` ${resourceLabel}`}`}>
                            <span className="cm-spell-name">{s.name}</span>
                            <span className="cm-spell-cost">+{s.gain}{unit(s)}</span>
                        </li>
                    ))}
                    {spenders.slice(0, limit).map((s) => {
                        const need = s.cost > 0 ? `${s.cost}${unit(s)}` : `needs ${s.required}${unit(s)}`;
                        const status = s.affordable ? 'ready to cast' : s.short > 0 ? `${s.short} short` : 'not castable now';
                        return (
                            <li key={`s-${s.id}`} className={`cm-spell ${s.affordable ? 'is-ready' : 'is-short'}`} title={`${s.name}: ${s.cost > 0 ? `costs ${s.cost}` : `needs ${s.required}`}${unit(s) || ` ${resourceLabel}`} (${status})`}>
                                <span className="cm-spell-name">{s.name}</span>
                                <span className="cm-spell-cost">{need}</span>
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
