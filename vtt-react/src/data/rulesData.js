// Rules Data Structure
// Data is injected at runtime via initRulesData() to avoid bundling ~600KB of JSON.
// The data lives at /public/data/rules.json and is loaded by the useGameData hook.

let RULES_CATEGORIES = [];
let LORE_ENTITIES = null;

export function initRulesData(data, loreData = null) {
  RULES_CATEGORIES = data || [];
  if (loreData) LORE_ENTITIES = loreData;
  RULES_SEARCH_INDEX = buildSearchIndex();
}

export function initLoreData(loreData) {
  LORE_ENTITIES = loreData;
  RULES_SEARCH_INDEX = buildSearchIndex();
}

export function getRulesData() {
  return RULES_CATEGORIES;
}

// Re-export as named constant for backward compatibility.
export { RULES_CATEGORIES };

// Helper function to get all subcategories flattened
export const getAllSubcategories = () => {
  return RULES_CATEGORIES.flatMap(category =>
    category.subcategories.map(sub => ({
      ...sub,
      categoryId: category.id,
      categoryName: category.name
    }))
  );
};

// Helper function to find content by IDs
export const getRuleContent = (categoryId, subcategoryId) => {
  const category = RULES_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;

  const subcategory = category.subcategories.find(s => s.id === subcategoryId);
  return subcategory?.content || null;
};

// Markdown & HTML cleaner for search indexing
const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\\n/g, ' ')
    .replace(/[`>-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const getBadgeForCategory = (catId, subId) => {
  if (catId === 'world-lore') {
    if (subId === 'lexicon') return { badge: 'Lexicon', filter: 'lexicon', color: '#a370f7' };
    if (subId === 'bestiary') return { badge: 'Bestiary', filter: 'bestiary', color: '#e74c3c' };
    return { badge: 'Lore', filter: 'lore', color: '#3498db' };
  }
  if (catId === 'combat-system') return { badge: 'Combat', filter: 'combat', color: '#e67e22' };
  if (catId === 'magic-system') return { badge: 'Magic', filter: 'magic', color: '#9b59b6' };
  if (catId === 'character-creation') {
    if (subId === 'classes') return { badge: 'Classes', filter: 'classes', color: '#2ecc71' };
    return { badge: 'Character', filter: 'character', color: '#1abc9c' };
  }
  if (catId === 'equipment-system') return { badge: 'Equipment', filter: 'equipment', color: '#f39c12' };
  if (catId === 'travel-exploration') return { badge: 'Travel', filter: 'travel', color: '#16a085' };
  return { badge: 'Rules', filter: 'rules', color: '#d4af37' };
};

// Build a flat search index from all rules & lore content
const buildSearchIndex = () => {
  const index = [];
  let idCounter = 0;

  const addEntry = (entry) => {
    index.push({ id: `search-${idCounter++}`, ...entry });
  };

  for (const category of RULES_CATEGORIES) {
    const catBadge = getBadgeForCategory(category.id, '');
    addEntry({
      categoryId: category.id,
      categoryName: category.name,
      subcategoryId: null,
      subcategoryName: null,
      sectionIndex: -1,
      sectionTitle: null,
      tabId: null,
      tabName: null,
      rawText: stripMarkdown(category.description || ''),
      searchText: `${category.name} ${category.description || ''}`.toLowerCase(),
      displayTitle: category.name,
      preview: category.description || '',
      badge: catBadge.badge,
      filterCategory: catBadge.filter,
      badgeColor: catBadge.color,
      type: 'category'
    });

    for (const sub of category.subcategories || []) {
      const subBadge = getBadgeForCategory(category.id, sub.id);
      const subDesc = sub.content?.description || (sub.summary ? sub.summary.join(' ') : '');
      const subRaw = stripMarkdown(`${sub.name}. ${subDesc}`);
      addEntry({
        categoryId: category.id,
        categoryName: category.name,
        subcategoryId: sub.id,
        subcategoryName: sub.name,
        sectionIndex: -1,
        sectionTitle: null,
        tabId: null,
        tabName: null,
        rawText: subRaw,
        searchText: `${category.name} ${sub.name} ${subRaw}`.toLowerCase(),
        displayTitle: sub.name,
        preview: sub.content?.description || (sub.summary ? sub.summary[0] : ''),
        badge: subBadge.badge,
        filterCategory: subBadge.filter,
        badgeColor: subBadge.color,
        type: 'subcategory'
      });

      const sections = sub.content?.sections || [];
      let validSectionIdx = 0;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section || (!section.title && !section.content)) continue;
        if (section.type === 'rotating-tips') {
          validSectionIdx++;
          continue;
        }
        const rawContent = stripMarkdown(section.content || '');
        const previewText = rawContent.slice(0, 200);
        addEntry({
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          sectionIndex: validSectionIdx,
          sectionTitle: section.title || '',
          tabId: null,
          tabName: null,
          rawText: rawContent,
          searchText: `${category.name} ${sub.name} ${section.title || ''} ${rawContent}`.toLowerCase(),
          displayTitle: section.title || sub.name,
          preview: previewText,
          badge: subBadge.badge,
          filterCategory: subBadge.filter,
          badgeColor: subBadge.color,
          type: 'section'
        });
        validSectionIdx++;
      }

      const tabs = sub.content?.tabs || [];
      for (const tab of tabs) {
        if (!tab || !tab.sections) continue;
        let tabValidIdx = 0;
        for (let i = 0; i < tab.sections.length; i++) {
          const section = tab.sections[i];
          if (!section || (!section.title && !section.content)) continue;
          if (section.type === 'rotating-tips') {
            tabValidIdx++;
            continue;
          }
          const rawContent = stripMarkdown(section.content || '');
          const previewText = rawContent.slice(0, 200);
          addEntry({
            categoryId: category.id,
            categoryName: category.name,
            subcategoryId: sub.id,
            subcategoryName: sub.name,
            sectionIndex: tabValidIdx,
            sectionTitle: section.title || '',
            tabId: tab.id,
            tabName: tab.name,
            rawText: rawContent,
            searchText: `${category.name} ${sub.name} ${tab.name} ${section.title || ''} ${rawContent}`.toLowerCase(),
            displayTitle: section.title || tab.name,
            preview: previewText,
            badge: subBadge.badge,
            filterCategory: subBadge.filter,
            badgeColor: subBadge.color,
            type: 'section'
          });
          tabValidIdx++;
        }
        if (tab.tables) {
          for (const table of tab.tables) {
            if (!table || !table.title) continue;
            addEntry({
              categoryId: category.id,
              categoryName: category.name,
              subcategoryId: sub.id,
              subcategoryName: sub.name,
              sectionIndex: -1,
              sectionTitle: table.title,
              tabId: tab.id,
              tabName: tab.name,
              rawText: stripMarkdown(`${table.title} ${table.description || ''}`),
              searchText: `${category.name} ${sub.name} ${tab.name} ${table.title} ${table.description || ''}`.toLowerCase(),
              displayTitle: table.title,
              preview: table.description || '',
              badge: subBadge.badge,
              filterCategory: subBadge.filter,
              badgeColor: subBadge.color,
              type: 'table'
            });
          }
        }
      }

      const tables = sub.content?.tables || [];
      for (let t = 0; t < tables.length; t++) {
        const table = tables[t];
        if (!table || !table.title) continue;
        addEntry({
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          sectionIndex: -1,
          sectionTitle: table.title,
          tabId: null,
          tabName: null,
          rawText: stripMarkdown(`${table.title} ${table.description || ''}`),
          searchText: `${category.name} ${sub.name} ${table.title} ${table.description || ''}`.toLowerCase(),
          displayTitle: table.title,
          preview: table.description || '',
          badge: subBadge.badge,
          filterCategory: subBadge.filter,
          badgeColor: subBadge.color,
          type: 'table'
        });
      }
    }
  }

  // Index external lore.json entities if present
  if (LORE_ENTITIES && typeof LORE_ENTITIES === 'object') {
    const items = Array.isArray(LORE_ENTITIES) ? LORE_ENTITIES : Object.values(LORE_ENTITIES);
    for (const item of items) {
      if (!item || !item.term) continue;
      const rawText = stripMarkdown(`${item.summary || ''} ${item.fullEntry || ''}`);
      addEntry({
        categoryId: 'world-lore',
        categoryName: 'World Lore',
        subcategoryId: 'lexicon',
        subcategoryName: 'Lexicon',
        sectionIndex: -1,
        sectionTitle: item.term,
        tabId: null,
        tabName: null,
        termId: item.id || item.term.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        displayTitle: item.term,
        rawText: rawText,
        searchText: `world lore lexicon ${item.term} ${item.type || ''} ${item.region || ''} ${rawText}`.toLowerCase(),
        preview: item.summary || rawText.slice(0, 200),
        badge: 'Lexicon',
        filterCategory: 'lexicon',
        badgeColor: '#a370f7',
        type: 'lore-term'
      });
    }
  }

  return index;
};

export let RULES_SEARCH_INDEX = buildSearchIndex();

// Extract a relevant ~160 character snippet around the first matched term
const extractSnippet = (rawText, terms) => {
  if (!rawText) return '';
  const lower = rawText.toLowerCase();
  let firstIdx = -1;

  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
      firstIdx = idx;
    }
  }

  if (firstIdx === -1) {
    return rawText.slice(0, 160) + (rawText.length > 160 ? '...' : '');
  }

  const start = Math.max(0, firstIdx - 50);
  const end = Math.min(rawText.length, firstIdx + 110);
  let snippet = rawText.slice(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < rawText.length) snippet = snippet + '...';

  return snippet;
};

export const searchRulesIndex = (query, filter = 'all') => {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(t => t.length >= 2);
  if (terms.length === 0) return [];

  const scored = RULES_SEARCH_INDEX.map(entry => {
    if (filter !== 'all' && entry.filterCategory !== filter) {
      return { entry, score: 0 };
    }

    let score = 0;
    const text = entry.searchText;
    const title = (entry.displayTitle || '').toLowerCase();
    const raw = entry.rawText || '';

    // Exact title match
    if (title === q) {
      score += 120;
    } else if (title.startsWith(q)) {
      score += 70;
    } else if (title.includes(q)) {
      score += 45;
    }

    // Token matching
    for (const term of terms) {
      if (title.startsWith(term)) score += 30;
      else if (title.includes(term)) score += 20;
      if (text.includes(term)) score += 4;
    }

    // Exact phrase in text
    if (text.includes(q)) score += 20;

    // Weight sections and subcategories slightly higher for direct navigation
    if (entry.type === 'section') score += 2;
    else if (entry.type === 'subcategory') score += 3;
    else if (entry.type === 'lore-term') score += 2;

    const snippet = extractSnippet(raw, terms);

    return {
      entry: {
        ...entry,
        snippet: snippet || entry.preview
      },
      score
    };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 60)
    .map(s => s.entry);
};

