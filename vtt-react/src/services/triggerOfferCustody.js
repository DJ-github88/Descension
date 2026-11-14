/** Explicit offer custody shared by the owner panel and approval preparation. */
export const retainedOfferId = ({ owner, draft, spellId }) => {
  const ownerId = owner?.spellId === spellId ? owner.triggerOfferId : undefined;
  if (ownerId !== undefined) {return ownerId;}
  return draft?.context?.spellId === spellId ? draft.triggerOfferId : undefined;
};
