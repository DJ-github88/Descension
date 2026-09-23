/**
 * Community Summary Service
 *
 * The community feed must never download full homebrew payloads (stat blocks,
 * damage/healing configs, talent trees, nested lore) just to render cards.
 * This service maintains a shallow `community_summaries` collection:
 *
 *   { kind, sourceId, authorId, name, description, <preview fields>,
 *     rating, ratingCount, downloadCount, upvotes, downvotes, commentCount,
 *     tags, isPublic, isFeatured, createdAt, updatedAt }
 *
 * Feed queries read this collection (one shallow doc per item); the full
 * entity document is fetched by id only when the user opens details or
 * imports the item.
 *
 * Migration strategy: feeds fall back to the full collection when no summaries
 * exist yet, and best-effort backfill summaries from the docs they fetched, so
 * the collection fills in progressively without a migration script.
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode } from '../../config/firebase';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';
import { logFirestoreRead, withWriteDiagnostics } from '../../utils/firestoreDiagnostics';

export const SUMMARIES_COLLECTION = 'community_summaries';

export const SUMMARY_KINDS = {
  SPELL: 'spell',
  CREATURE: 'creature',
  ITEM: 'item',
  MAP: 'map',
  PACK: 'pack'
};

const MAX_DESCRIPTION = 280;
const MAX_TAGS = 12;

const trimText = (value, max = MAX_DESCRIPTION) => {
  if (typeof value !== 'string') return '';
  const plain = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > max ? `${plain.slice(0, max - 1)}…` : plain;
};

const trimTags = (tags) => (Array.isArray(tags) ? tags.filter(Boolean).slice(0, MAX_TAGS) : []);

const summaryDocId = (kind, sourceId) => `${kind}_${sourceId}`;

/**
 * Build a shallow spell summary while keeping the fields the feed cards and
 * filters actually read (icon/school/damage-healing flags).
 */
export const buildSpellSummary = (spell = {}) => ({
  kind: SUMMARY_KINDS.SPELL,
  sourceId: spell.sourceId || spell.id || null,
  name: spell.name || 'Untitled Spell',
  description: trimText(spell.description),
  level: spell.level ?? 0,
  castingTime: spell.castingTime || '',
  range: spell.range || '',
  spellType: spell.spellType || spell.actionType || '',
  categoryId: spell.categoryId || null,
  tags: trimTags(spell.tags),
  // Compact preview copies so list filters/icons keep working without the
  // full configs (only the icon/element/type fields are kept).
  typeConfig: spell.typeConfig ? { icon: spell.typeConfig.icon, school: spell.typeConfig.school } : null,
  icon: spell.icon || null,
  school: spell.school || null,
  damageConfig: spell.damageConfig
    ? { icon: spell.damageConfig.icon || null, elementType: spell.damageConfig.elementType || null }
    : null,
  healingConfig: spell.healingConfig ? { icon: spell.healingConfig.icon || null } : null,
  damageTypes: Array.isArray(spell.damageTypes) ? spell.damageTypes.slice(0, 2) : [],
  rating: spell.rating || 0,
  ratingCount: spell.ratingCount || 0,
  downloadCount: spell.downloadCount || 0,
  upvotes: spell.upvotes || 0,
  downvotes: spell.downvotes || 0,
  isPublic: spell.isPublic !== false,
  isFeatured: spell.isFeatured === true,
  authorId: spell.authorId || spell.userId || null,
  authorName: spell.authorName || spell.author || '',
  createdAt: spell.createdAt || null
});

export const buildCreatureSummary = (creature = {}) => {
  const source = creature.creatureData || creature;
  return {
    kind: SUMMARY_KINDS.CREATURE,
    sourceId: creature.sourceId || creature.id || null,
    name: source.name || creature.name || 'Unnamed Creature',
    description: trimText(source.description || creature.description),
    type: source.type || creature.type || '',
    size: source.size || creature.size || '',
    challengeRating: source.challengeRating ?? creature.challengeRating ?? null,
    tokenIcon: source.tokenIcon || creature.tokenIcon || null,
    tokenBorder: source.tokenBorder || creature.tokenBorder || null,
    stats: source.stats
      ? {
          hp: source.stats.hp ?? null,
          maxHp: source.stats.maxHp ?? null,
          mana: source.stats.mana ?? null,
          maxMana: source.stats.maxMana ?? null,
          initiative: source.stats.initiative ?? null
        }
      : null,
    tags: trimTags(source.tags || creature.tags),
    rating: creature.rating || 0,
    ratingCount: creature.ratingCount || 0,
    downloadCount: creature.downloadCount || 0,
    isPublic: creature.isPublic !== false,
    isFeatured: creature.isFeatured === true,
    authorId: creature.authorId || creature.userId || null,
    authorName: creature.authorName || creature.author || '',
    createdAt: creature.createdAt || null
  };
};

export const buildItemSummary = (item = {}) => {
  const source = item.itemData || item;
  return {
    kind: SUMMARY_KINDS.ITEM,
    sourceId: item.sourceId || item.id || null,
    name: source.name || item.name || 'Unnamed Item',
    description: trimText(source.description || item.description),
    type: source.type || item.type || '',
    quality: source.quality || item.quality || '',
    rarity: source.rarity || item.rarity || '',
    iconId: source.iconId || item.iconId || null,
    imageUrl: source.imageUrl || item.imageUrl || null,
    requiredLevel: source.requiredLevel ?? item.requiredLevel ?? null,
    tags: trimTags(source.tags || item.tags),
    rating: item.rating || 0,
    ratingCount: item.ratingCount || 0,
    downloadCount: item.downloadCount || 0,
    upvotes: item.upvotes || 0,
    downvotes: item.downvotes || 0,
    commentCount: item.commentCount || 0,
    isPublic: item.isPublic !== false,
    isFeatured: item.isFeatured === true,
    authorId: item.authorId || item.userId || null,
    authorName: item.authorName || item.author || '',
    createdAt: item.createdAt || null
  };
};

export const buildMapSummary = (map = {}) => ({
  kind: SUMMARY_KINDS.MAP,
  sourceId: map.sourceId || map.id || null,
  name: map.name || 'Untitled Map',
  description: trimText(map.description),
  category: map.category || map.categoryId || '',
  thumbnail: map.thumbnail || map.imageUrl || null,
  tags: trimTags(map.tags),
  rating: map.rating || 0,
  ratingCount: map.ratingCount || 0,
  downloadCount: map.downloadCount || 0,
  isPublic: map.isPublic !== false,
  isFeatured: map.isFeatured === true,
  authorId: map.authorId || map.userId || null,
  authorName: map.authorName || map.author || '',
  createdAt: map.createdAt || null
});

export const buildPackSummary = (pack = {}) => ({
  kind: SUMMARY_KINDS.PACK,
  sourceId: pack.sourceId || pack.id || null,
  name: pack.name || 'Untitled Pack',
  description: trimText(pack.description),
  type: pack.type || '',
  version: pack.version || '1.0.0',
  tags: trimTags(pack.tags),
  itemCount: Array.isArray(pack.items) ? pack.items.length : pack.itemCount || 0,
  creatureCount: Array.isArray(pack.creatures) ? pack.creatures.length : pack.creatureCount || 0,
  dependencies: pack.dependencies || [],
  compatibility: pack.compatibility || null,
  rating: pack.rating || 0,
  ratingCount: pack.ratingCount || 0,
  downloadCount: pack.downloadCount || 0,
  isPublic: pack.isPublic !== false,
  isFeatured: pack.isFeatured === true,
  authorId: pack.authorId || pack.userId || null,
  authorName: pack.authorName || pack.author || '',
  createdAt: pack.createdAt || null
});

const BUILDERS = {
  [SUMMARY_KINDS.SPELL]: buildSpellSummary,
  [SUMMARY_KINDS.CREATURE]: buildCreatureSummary,
  [SUMMARY_KINDS.ITEM]: buildItemSummary,
  [SUMMARY_KINDS.MAP]: buildMapSummary,
  [SUMMARY_KINDS.PACK]: buildPackSummary
};

const isAvailable = () => isFirebaseConfigured && !isDemoMode && !!db;

/**
 * Best-effort write of a summary document. Never throws: summaries are an
 * optimization layer and must not break publishing flows.
 */
export const upsertCommunitySummary = async (kind, sourceId, sourceData, overrides = {}) => {
  if (!isAvailable() || !sourceId) return null;
  const builder = BUILDERS[kind];
  if (!builder) return null;

  try {
    const summary = sanitizeForFirestore({
      ...builder({ ...sourceData, sourceId }),
      ...overrides,
      updatedAt: new Date().toISOString()
    });

    await withWriteDiagnostics(
      SUMMARIES_COLLECTION,
      () => setDoc(doc(db, SUMMARIES_COLLECTION, summaryDocId(kind, sourceId)), summary, { merge: true }),
      { op: 'setDoc', path: `${SUMMARIES_COLLECTION}/${summaryDocId(kind, sourceId)}` }
    );

    return summary;
  } catch (error) {
    console.debug('Community summary upsert skipped:', error?.message || error);
    return null;
  }
};

/**
 * Cursor protocol: feeds may mix summary-backed pages and full-doc fallback
 * pages. Cursors are wrapped so the correct collection's snapshot is used.
 */
export const SUMMARY_CURSOR_KEY = '__summaryCursor';
export const FULL_CURSOR_KEY = '__fullCursor';

export const unwrapSummaryCursor = (cursor) =>
  cursor && cursor[SUMMARY_CURSOR_KEY] ? cursor[SUMMARY_CURSOR_KEY] : cursor;

export const unwrapFullCursor = (cursor) =>
  cursor && cursor[FULL_CURSOR_KEY] ? cursor[FULL_CURSOR_KEY] : cursor;

/**
 * Fetch a page of summaries for a kind. Returns `{ summaries, lastDoc, hasMore }`.
 */
export const getCommunitySummaries = async (kind, options = {}) => {
  const { pageSize = 20, sortBy = 'rating', cursor = null } = options;
  if (!isAvailable()) return { summaries: [], lastDoc: null, hasMore: false };

  let orderField = 'rating';
  if (sortBy === 'downloads') orderField = 'downloadCount';
  if (sortBy === 'newest') orderField = 'createdAt';
  if (sortBy === 'name') orderField = 'name';

  let q = query(
    collection(db, SUMMARIES_COLLECTION),
    where('kind', '==', kind),
    where('isPublic', '==', true),
    orderBy(orderField, 'desc'),
    limit(pageSize)
  );
  const rawCursor = unwrapSummaryCursor(cursor);
  if (rawCursor) q = query(q, startAfter(rawCursor));

  const snapshot = await getDocs(q);
  // `id` must be the SOURCE document id (cards key vote/download/favorite on
  // it); the summary document id is kept as `_summaryId`.
  const summaries = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: data.sourceId || d.id,
      _summaryId: d.id,
      _summary: true
    };
  });

  logFirestoreRead({ collection: SUMMARIES_COLLECTION, count: summaries.length, op: 'getDocs (summaries)' });

  const last = snapshot.docs[snapshot.docs.length - 1] || null;
  return {
    summaries,
    lastDoc: last ? { [SUMMARY_CURSOR_KEY]: last } : null,
    hasMore: snapshot.docs.length === pageSize
  };
};

/**
 * Fetch a single summary by kind + source id.
 */
export const getCommunitySummary = async (kind, sourceId) => {
  if (!isAvailable() || !sourceId) return null;
  try {
    const snapshot = await getDoc(doc(db, SUMMARIES_COLLECTION, summaryDocId(kind, sourceId)));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  } catch (error) {
    console.debug('Community summary read skipped:', error?.message || error);
    return null;
  }
};

/**
 * Best-effort backfill used when feeds fall back to full documents. Fire and
 * forget: callers should not await this on the render path.
 */
export const backfillCommunitySummaries = (kind, docs = []) => {
  if (!isAvailable() || !docs.length) return;
  const builder = BUILDERS[kind];
  if (!builder) return;

  docs.slice(0, 30).forEach((item) => {
    const sourceId = item.sourceId || item.id;
    if (!sourceId) return;
    upsertCommunitySummary(kind, sourceId, item).catch(() => {});
  });
};

const communitySummaryService = {
  SUMMARIES_COLLECTION,
  SUMMARY_KINDS,
  buildSpellSummary,
  buildCreatureSummary,
  buildItemSummary,
  buildMapSummary,
  buildPackSummary,
  upsertCommunitySummary,
  getCommunitySummaries,
  getCommunitySummary,
  backfillCommunitySummaries
};

export default communitySummaryService;
