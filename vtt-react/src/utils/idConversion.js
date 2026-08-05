/**
 * idConversion — the single source of truth for Mythrill's id conventions.
 *
 * The codebase uses parallel spellings for the same entity:
 *
 *   form         example          used by
 *   -----------  ---------------  -------------------------------------------
 *   hyphen       greymark-keep    zone ids (ZONE_DATA), subregion ids
 *                                 (SUBREGIONS), region ids, pin keys
 *                                 (LOCATION_COORDINATES)
 *   underscore   greymark_keep    lore termIds (loreDictionary / LoreLink),
 *                                 EXPLORATION_RULES keys, docs/ folder slugs
 *   Title Case   Greymark Keep    display names (zone.name, region.name)
 *   doc slug     greymark_keep    docs/...<slug>.md basenames
 *
 * Regions: docs live under docs/continents/<underscore-region-id>/, e.g.
 *   iceheart-sea  ->  docs/continents/iceheart_sea/
 *
 * Subregions: the docs file is keyed by the subregion *name*, not its id.
 * e.g. subregion id 'nordhalla-glacier-heart', name 'Rime-Spire Peaks'
 *   ->  docs/continents/nordhalla/subregions/rime_spire_peaks.md
 */

/** 'iceheart-sea' -> 'iceheart_sea' */
export function toUnderscore(id) {
  if (id === null || id === undefined) return id;
  return String(id).replace(/-/g, '_');
}

/** 'greymark_keep' -> 'greymark-keep' */
export function toHyphen(str) {
  if (str === null || str === undefined) return str;
  return String(str).replace(/_/g, '-');
}

/** zone/subregion id -> lore termId (hyphen -> underscore). */
export function idToLoreTerm(id) {
  return toUnderscore(id);
}

/** lore termKey / dir slug -> canonical hyphenated id (underscore -> hyphen). */
export function loreTermToId(termKey) {
  return toHyphen(termKey);
}

/** id -> Title Case display name ('greymark_keep' -> 'Greymark Keep'). */
export function toTitle(id) {
  if (id === null || id === undefined) return id;
  return String(id)
    .replace(/\.md$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, ch => ch.toUpperCase());
}

/** Human-readable name -> doc basename slug (lowercase, non-alnum -> _). */
export function nameToDocSlug(name) {
  if (name === null || name === undefined) return name;
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Doc basename -> subregion entry, matching by slugified subregion name
 * (the docs key convention) or by the subregion id's underscore form.
 */
export function subregionEntryForDocSlug(slug, subregions) {
  if (!slug || !subregions) return null;
  const norm = String(slug).replace(/\.md$/i, '');
  for (const id of Object.keys(subregions)) {
    const entry = subregions[id];
    if (!entry || typeof entry !== 'object') continue;
    if (nameToDocSlug(entry.name) === norm) return entry;
    if (toUnderscore(id) === norm) return entry;
  }
  return null;
}

/** region id -> docs/continents folder slug (iceheart-sea -> iceheart_sea). */
export function regionDocFolder(regionId) {
  return toUnderscore(regionId);
}

/** Given a subregion entry, derive its docs lore-file basename from its name. */
export function subregionDocSlug(entry) {
  if (!entry) return null;
  return nameToDocSlug(entry.name);
}

export default {
  toUnderscore,
  toHyphen,
  idToLoreTerm,
  loreTermToId,
  toTitle,
  nameToDocSlug,
  subregionEntryForDocSlug,
  regionDocFolder,
  subregionDocSlug
};