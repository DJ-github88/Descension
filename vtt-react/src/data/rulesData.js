// Rules Data Structure
// Data is injected at runtime via initRulesData() to avoid bundling ~600KB of JSON.
// The data lives at /public/data/rules.json and is loaded by the useGameData hook.

let RULES_CATEGORIES = [];

export function initRulesData(data) {
  RULES_CATEGORIES = data || [];
  RULES_SEARCH_INDEX = buildSearchIndex();
}

export function getRulesData() {
  return RULES_CATEGORIES;
}

// Re-export as named constant for backward compatibility.
// Consumers should migrate to getRulesData() or initRulesData().
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

// Build a flat search index from all rules content
const buildSearchIndex = () => {
  const index = [];
  let idCounter = 0;

  const addEntry = (entry) => {
    index.push({ id: `search-${idCounter++}`, ...entry });
  };

  const stripMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\\n/g, ' ')
      .replace(/[`>-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  for (const category of RULES_CATEGORIES) {
    addEntry({
      categoryId: category.id,
      categoryName: category.name,
      subcategoryId: null,
      subcategoryName: null,
      sectionIndex: -1,
      sectionTitle: null,
      searchText: `${category.name} ${category.description || ''}`.toLowerCase(),
      displayTitle: category.name,
      preview: category.description || '',
      type: 'category'
    });

    for (const sub of category.subcategories) {
      const subText = `${sub.name} ${sub.summary ? sub.summary.join(' ') : ''} ${sub.content?.title || ''} ${sub.content?.description || ''}`;
      addEntry({
        categoryId: category.id,
        categoryName: category.name,
        subcategoryId: sub.id,
        subcategoryName: sub.name,
        sectionIndex: -1,
        sectionTitle: null,
        searchText: subText.toLowerCase(),
        displayTitle: sub.name,
        preview: sub.content?.description || (sub.summary ? sub.summary[0] : ''),
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
        const rawContent = section.content || '';
        const previewText = stripMarkdown(rawContent).slice(0, 200);
        addEntry({
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          sectionIndex: validSectionIdx,
          sectionTitle: section.title || '',
          tabId: null,
          searchText: `${section.title || ''} ${rawContent}`.toLowerCase(),
          displayTitle: section.title || sub.name,
          preview: previewText,
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
          const rawContent = section.content || '';
          const previewText = stripMarkdown(rawContent).slice(0, 200);
          addEntry({
            categoryId: category.id,
            categoryName: category.name,
            subcategoryId: sub.id,
            subcategoryName: sub.name,
            sectionIndex: tabValidIdx,
            sectionTitle: section.title || '',
            tabId: tab.id,
            tabName: tab.name,
            searchText: `${tab.name} ${section.title || ''} ${rawContent}`.toLowerCase(),
            displayTitle: section.title || tab.name,
            preview: previewText,
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
              searchText: `${tab.name} ${table.title} ${table.description || ''}`.toLowerCase(),
              displayTitle: table.title,
              preview: table.description || '',
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
          searchText: `${table.title} ${table.description || ''}`.toLowerCase(),
          displayTitle: table.title,
          preview: table.description || '',
          type: 'table'
        });
      }
    }
  }

  return index;
};

export let RULES_SEARCH_INDEX = buildSearchIndex();

export const searchRulesIndex = (query) => {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(t => t.length >= 2);
  if (terms.length === 0) return [];

  const scored = RULES_SEARCH_INDEX.map(entry => {
    let score = 0;
    const text = entry.searchText;
    const title = (entry.displayTitle || '').toLowerCase();

    for (const term of terms) {
      if (title === term) score += 20;
      else if (title.includes(term)) score += 10;
      else if (text.includes(term)) score += 2;
    }

    if (text.includes(q)) score += 5;

    if (entry.type === 'section') score += 1;
    else if (entry.type === 'table') score += 0.5;

    return { entry, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map(s => s.entry);
};
