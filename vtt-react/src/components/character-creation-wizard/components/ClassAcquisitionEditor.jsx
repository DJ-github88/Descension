import React from 'react';
import { CLASS_PROVENANCE, resolveClassHeritageName } from '../../../data/classHeritageRegistry';
import { CLASS_ACCESS_LABELS, getCharacterClassAccess, getCharacterHeritageOptions } from '../../../utils/characterClassAccess';
import '../styles/ClassAcquisitionEditor.css';

const BODY_STATE_LABELS = {
    active_pact_identity_preservation: 'Active pact identity preservation',
    severed_first_contract: 'First Contract severed',
    fixed_body_without_shaping_interface: 'Fixed body without a shaping interface',
    surgery_incompatible_body: 'Body incompatible with graft surgery'
};
// Incompatible states that only ever gate a specific method of a class.
const METHOD_BODY_STATES = {
    Arcanoneer: ['severed_first_contract']
};
const label = value => String(value).replace(/_/g, ' ');

const QUALIFYING_STATUSES = ['requires-qualification', 'qualified-exception'];

export default function ClassAcquisitionEditor({ characterData, onChange, warnings = [] }) {
    const base = resolveClassHeritageName(characterData.class);
    const profile = CLASS_PROVENANCE[base];
    // Nothing to describe until a registered calling is chosen.
    if (!characterData.class || !profile) return null;

    const access = getCharacterClassAccess(characterData);
    const options = getCharacterHeritageOptions(characterData);
    const record = characterData.classAcquisition?.[base] || {};
    const qualification = record.qualification && typeof record.qualification === 'object' ? record.qualification : {};
    const fulfilled = Array.isArray(qualification.fulfilledRequirements) ? qualification.fulfilledRequirements : [];
    const methods = [...new Set([...Object.values(profile.nativeMethods || {}), ...Object.keys(profile.methodRequirements || {})])];
    const requirements = access.requirements || profile.requirements || [];

    const isNative = access.status === 'normal-tradition';
    const awaitingHeritage = access.status === 'heritage-selection-required';
    const canQualify = QUALIFYING_STATUSES.includes(access.status);

    // Only surface the incompatible states that can actually gate this calling,
    // plus anything already recorded (including legacy/custom states).
    const bodyStateOptions = [...new Set([
        ...(profile.incompatibleStates || []),
        ...(METHOD_BODY_STATES[base] || []),
        ...options.bodyStates
    ])];

    const updateRecord = patch => onChange({
        classAcquisition: { ...(characterData.classAcquisition || {}), [base]: { ...record, ...patch } }
    });
    const updateQualification = patch => updateRecord({ qualification: { ...qualification, ...patch } });

    return (
        <section className="class-acquisition-editor" aria-label="Class acquisition and body state">
            <h4>Class acquisition &amp; current interface</h4>
            <p className={`acquisition-status acquisition-status--${access.status}`} role="status">
                {CLASS_ACCESS_LABELS[access.status] || access.status}
            </p>
            {access.reason && !isNative && !awaitingHeritage && (
                <p className="acquisition-reason">{access.reason}</p>
            )}
            {warnings.map(warning => <p className="acquisition-warning" key={warning}>{warning}</p>)}

            {methods.length > 0 && (
                <label className="acquisition-field">
                    Class method
                    <select value={options.method || ''} onChange={event => updateRecord({ method: event.target.value })}>
                        <option value="">Heritage default / unspecified</option>
                        {options.method && !methods.includes(options.method) && options.method !== 'furnace' &&
                            <option value={options.method}>{label(options.method)} (unrecognized)</option>}
                        {options.method === 'furnace' && <option value="furnace">furnace (Ironclad alias)</option>}
                        {methods.map(method => <option value={method} key={method}>{label(method)}</option>)}
                    </select>
                </label>
            )}

            {isNative && (
                <p className="acquisition-note">
                    This calling is native to your heritage &mdash; no separate acquisition evidence is required.
                </p>
            )}

            {awaitingHeritage && (
                <p className="acquisition-note">
                    Choose a heritage to confirm whether this calling is a native path or a rare acquisition.
                </p>
            )}

            {canQualify && <>
                <p className="acquisition-note">
                    Rare acquisitions need an actual source and every requirement below.
                </p>
                <label className="acquisition-field">
                    Acquisition source
                    <textarea rows={3} value={typeof qualification.source === 'string' ? qualification.source : ''}
                        placeholder="Name the mentor, rite, surgery, relic or recorded event and where it is documented."
                        onChange={event => updateQualification({ source: event.target.value })} />
                </label>
                <fieldset>
                    <legend>Fulfilled acquisition requirements</legend>
                    {requirements.map(requirement => <label className="acquisition-check" key={requirement}>
                        <input type="checkbox" checked={fulfilled.includes(requirement)} onChange={event => updateQualification({
                            fulfilledRequirements: event.target.checked ? [...new Set([...fulfilled, requirement])]
                                : fulfilled.filter(item => item !== requirement)
                        })} />
                        {label(requirement)}
                    </label>)}
                </fieldset>
                <label className="acquisition-check">
                    <input type="checkbox" checked={qualification.verified === true}
                        onChange={event => updateQualification({ verified: event.target.checked })} />
                    Acquisition verified against the recorded source
                </label>
            </>}

            {bodyStateOptions.length > 0 && (
                <fieldset>
                    <legend>Current body / interface states</legend>
                    <p>Record states that are currently present. Heritage alone does not set these flags.</p>
                    {bodyStateOptions.map(state => <label className="acquisition-check" key={state}>
                        <input type="checkbox" checked={options.bodyStates.includes(state)} onChange={event => onChange({
                            bodyStates: event.target.checked ? [...new Set([...options.bodyStates, state])]
                                : options.bodyStates.filter(item => item !== state)
                        })} />
                        {BODY_STATE_LABELS[state] || `${label(state)} (custom state)`}
                    </label>)}
                </fieldset>
            )}
        </section>
    );
}
