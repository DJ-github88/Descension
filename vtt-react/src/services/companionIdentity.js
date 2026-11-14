/** Exact companion identity helpers. No store or socket access. */
const REF_KEYS = ['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'];

export const companionRefOf = token => {
  const binding = token?.state?.actorContract;
  return binding?.version === 1
    ? Object.fromEntries(REF_KEYS.filter(key => binding[key] !== undefined).map(key => [key, binding[key]]))
    : null;
};

export const sameCompanionRef = (left, right) => !!left && !!right &&
  REF_KEYS.filter(key => left[key] !== undefined || right[key] !== undefined)
    .every(key => left[key] === right[key]);

export const findCompanionToken = (tokens, activeRef) => {
  if (!Array.isArray(tokens) || !activeRef) { return null; }
  return tokens.find(token => sameCompanionRef(companionRefOf(token), activeRef)) || null;
};
