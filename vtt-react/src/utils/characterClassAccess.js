import { getClassHeritageAccess, resolveClassHeritageId, resolveClassHeritageName } from '../data/classHeritageRegistry';

// Acquisition belongs to a class, not to the currently highlighted grid token.
// Preserve the stored map (including custom keys/metadata) across class changes.
export function getCharacterHeritageOptions(character = {}, className = character.class) {
    const base = resolveClassHeritageName(className) || className;
    const record = character.classAcquisition?.[base];
    return {
        method: record?.method,
        qualification: record?.qualification,
        bodyStates: Array.isArray(character.bodyStates) ? character.bodyStates : []
    };
}

export function getCharacterClassAccess(character = {}, className = character.class) {
    return getClassHeritageAccess(className, character.race, character.subrace,
        getCharacterHeritageOptions(character, className));
}

export function isUnchangedCharacterCalling(character, original) {
    if (!original) return false;
    // Keep narrow compatibility aliases narrow; changing to/from one is a change.
    return character.class === original.class && character.race === original.race &&
        (character.subrace === original.subrace || (resolveClassHeritageId(character.race, character.subrace) &&
            resolveClassHeritageId(character.race, character.subrace) === resolveClassHeritageId(original.race, original.subrace)));
}

export function validateCharacterClassAccess(character, original) {
    const access = getCharacterClassAccess(character);
    const warnings = [];
    const errors = [];
    if (!access.selectable) {
        const message = access.status === 'requires-qualification'
            ? `${access.className}: rare acquisition requires a verified source and every listed requirement. ${access.reason}`
            : `${access.className || character.class}: ${access.reason || access.status}`;
        if (access.status === 'requires-qualification' && isUnchangedCharacterCalling(character, original)) {
            warnings.push(`Legacy calling retained; acquisition evidence is missing. ${message}`);
        } else errors.push(message);
    }
    return { access, errors, warnings, isValid: errors.length === 0 };
}

export const CLASS_ACCESS_LABELS = {
    'normal-tradition': 'Native trained tradition',
    'qualified-exception': 'Qualified rare acquisition',
    'requires-qualification': 'Acquisition evidence required',
    'incompatible-state': 'Incompatible body/interface state',
    'invalid-method': 'Unsupported class method',
    'unknown-class': 'Custom or unregistered calling',
    'heritage-selection-required': 'Select a heritage',
    'heritage-race-mismatch': 'Heritage does not match race',
    'heritage-alias-mismatch': 'Heritage-specific calling does not match'
};
