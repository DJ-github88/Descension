import React, { useState, useMemo, useEffect, useRef } from 'react';
import RichLoreText from '../common/RichLoreText';
import useBookStore, { getBookById, normalizeBook } from '../../store/bookStore';
import useAuthStore from '../../store/authStore';
import universalEntityService from '../../services/universalEntityService';
import {
  CreatureStatblockBlock,
  ItemRelicBlock,
  SpellFormulaBlock,
  LocationShowcaseBlock,
  NpcDossierBlock,
  QuestHookBlock,
  BookImageBlock,
  BookCalloutBlock,
  MapEmbedBlock,
  TableOfContentsBlock,
  SideBySideBlock
} from './BookTtrpgBlocks';
import BookGlossaryModal from './BookGlossaryModal';
import BookImagePickerModal from './BookImagePickerModal';
import BookItemCreatorModal from './BookItemCreatorModal';
import BookLorePickerModal from './BookLorePickerModal';
import BookSnapshotModal from './BookSnapshotModal';
import './BookDocumentEditor.css';

const THEME_OPTIONS = [
  { value: 'parchment', label: 'Parchment (Classic Sourcebook)' },
  { value: 'royal', label: 'Royal Archive (Imperial Ivory & Sapphire)' },
  { value: 'crimson', label: 'Crimson Tome (Bloodbound & Gold)' },
  { value: 'grimoire', label: 'Dark Grimoire (Obsidian & Arcane Silver)' },
  { value: 'wildwood', label: 'Fey Wildwood (Verdant Emerald & Amber)' }
];

const LAYOUT_OPTIONS = [
  { value: 'two-column', label: 'Two-Page Book Spread' },
  { value: 'single-column', label: 'Single Column' }
];

const NEW_BLOCK_DEFAULTS = {
  header: { level: 2, text: 'New Section Title' },
  paragraph: { text: 'The quill awaits your words...', hasDropCap: false },
  side_by_side: {
    ratio: '50-50',
    left: { type: 'image', url: '/assets/images/races/merryn_illustration.png', caption: 'Merryn Wave-Rider' },
    right: { type: 'paragraph', text: 'Across the misty frontiers, legends are written in iron and frost...' }
  },
  callout: { calloutType: 'lore', title: 'Historical Note', icon: 'fa-scroll', content: 'Ancient chronicles record that the realm was once united under a single banner...' },
  creature_statblock: {
    name: 'Frost Wyrd Revenant',
    dangerLevel: 'High',
    creatureType: 'Medium Undead / Elemental, Native',
    hp: 220,
    mana: 40,
    ap: 4,
    speed: '30 ft.',
    stats: { strength: 16, agility: 14, constitution: 16, intelligence: 12, spirit: 16, charisma: 10 },
    resistances: 'Rime 50%, Wyrd 25%, Ember Weakness',
    traits: [{ name: 'Chilling Aura', desc: 'Creatures within 10 ft. take 1d6 Rime damage at turn start and suffer -5 ft. speed.' }],
    actions: [
      { name: 'Glacial Rend (1 AP)', desc: 'Melee Strike: 2d10 + 4 Physical damage + 1d8 Rime damage. DC 14 AGI save or Slowed.' },
      { name: 'Frostfall Pulse (2 AP, 15 Mana)', desc: 'Releases a 20-ft burst dealing 3d6 Rime damage to all hostile targets.' }
    ]
  },
  item_card: {
    name: 'Rime-Forged Dagger',
    type: 'weapon',
    subtype: 'Dagger',
    quality: 'rare',
    durability: 'd8',
    maxDurability: 'd8',
    weaponStats: {
      baseDamage: '1d4 + 1 Piercing + 1d6 Rime',
      weaponType: 'Dagger',
      damageType: 'rime'
    },
    value: { gold: 750, silver: 0, copper: 0, platinum: 0 },
    iconId: 'Weapons/Shortblade/dagger-basic-steel-crossguard',
    description: 'Forged in the sub-zero thermal vents of Greymark Keep, this blade never loses its glacial edge.',
    flavorText: 'Cold as the grave, sharp as regret.'
  },
  spell_formula: {
    name: 'Glacial Shard Lance',
    category: 'damage',
    damageTypes: ['rime'],
    tier: 2,
    castingTime: '1 Action (2 AP)',
    manaCost: 15,
    range: 60,
    duration: 'Instantaneous',
    targetingMode: 'single',
    effect: 'A crystalline lance of compressed frost impales the target for 3d8 piercing damage and slows their movement by 10 ft.',
    empower: 'Each additional 5 Mana increases damage by 1d8 Rime damage.',
    primaryDamage: { dice: '3d8', flat: 4 },
    resourceCosts: { mana: { baseAmount: 15 }, action_points: { baseAmount: 2 } },
    tags: ['offensive', 'damage', 'rime']
  },
  location_showcase: {
    name: 'Greymark Citadel',
    locationType: 'Fortress / Sanctuary',
    region: 'Frostwood Reach',
    dangerRating: 'Perilous',
    faction: 'Ironfang Wardens',
    landmarks: 'High Bastion, Sub-Zero Forge, Sealed Archives',
    description: 'An ancient obsidian fortress perched above the mist-choked pines of Frostwood, guarding the mountain pass from the wild wights.',
    secrets: 'Beneath the lower cellars lies a dormant thermal core that keeps the Citadel warm, but its seals are cracking.'
  },
  npc_dossier: {
    name: 'Gref the Memory-Merchant',
    role: 'Twilight Guide & Trader',
    faction: 'Seelie Accord',
    disposition: 'neutral',
    heritage: 'Native Frostwood Fey',
    personality: 'Soft-spoken, melancholy, trades forgotten trinkets for memories',
    description: 'A stooped, birch-skinned twilight merchant who wanders the misty crossroads with a creaking wooden barrow of lost keys and sealed letters.',
    quote: 'Every key in this barrow once opened a door someone chose to forget.'
  },
  quest_hook: {
    title: 'The Lost Key of Drunhold',
    giver: 'Elder Moira of Drunhold',
    status: 'Active',
    objectives: [
      { text: 'Locate Gref near the misty crossroads at twilight', done: false },
      { text: 'Trade a memory of equal value for the rusted iron key', done: false },
      { text: 'Unlock the sealed vault beneath the weeping birch', done: false }
    ],
    reward: '150 Gold, Seelie Amulet of Warding',
    description: 'An ancient vault in the village of Drunhold was locked centuries ago during the Long Winter, and only a twilight merchant holds the original key.'
  },
  map_embed: {
    title: 'Frostwood Reach & Surrounding Lands',
    region: 'Canonical Realm',
    mapId: 'frostwood',
    pinCount: 14,
    imageUrl: '/assets/images/backgrounds/nordhalla.jpeg'
  },
  table_of_contents: { autoGenerate: true },
  entity_embed: { entityType: 'faction', entityId: '', displayMode: 'card' },
  image: { url: '/assets/images/races/solari_illustration.png', caption: 'Solari Cinder-Walker in the Deep Caldrons', alignment: 'full', frame: 'gold-frame', sizePreset: 'full' }
};

const INSERT_PALETTE = [
  { type: 'header', label: 'Heading', icon: 'fa-heading', hint: 'H1, H2, or H3 Section Title' },
  { type: 'paragraph', label: 'Paragraph', icon: 'fa-paragraph', hint: 'Prose with drop cap & [[wiki]] terms' },
  { type: 'side_by_side', label: 'Side-by-Side Split', icon: 'fa-table-columns', hint: 'Art / Item / Statblock beside Text' },
  { type: 'callout', label: 'Callout Box', icon: 'fa-scroll', hint: 'Lore, secret, hazard, read aloud' },
  { type: 'lore_import', label: 'Import World Lore', icon: 'fa-feather-pointed', hint: 'Pull from Factions, Regions, Journals' },
  { type: 'creature_statblock', label: 'Creature Statblock', icon: 'fa-dragon', hint: 'Descension monster / NPC statblock' },
  { type: 'spell_formula', label: 'Spell Card', icon: 'fa-wand-magic-sparkles', hint: 'In-game arcane spellcard' },
  { type: 'item_card', label: 'Item & Relic', icon: 'fa-gem', hint: 'Weapons, armor, magic items studio' },
  { type: 'location_showcase', label: 'Location & POI', icon: 'fa-landmark', hint: 'Showcase city, dungeon, fortress, or tavern' },
  { type: 'npc_dossier', label: 'NPC Dossier', icon: 'fa-user-ninja', hint: 'Campaign NPC profile & disposition' },
  { type: 'quest_hook', label: 'Quest & Plot Hook', icon: 'fa-list-check', hint: 'Adventure objectives & rewards' },
  { type: 'image', label: 'Illustration / Art', icon: 'fa-image', hint: 'Upload or choose character art' },
  { type: 'map_embed', label: 'Atlas Map Pin', icon: 'fa-map-location-dot', hint: 'Interactive map preview' },
  { type: 'table_of_contents', label: 'Table of Contents', icon: 'fa-list-ol', hint: 'Auto-updating book index' },
  { type: 'divider', label: 'Flourish Divider', icon: 'fa-feather-pointed', hint: 'Ornamental break' }
];

const EditableText = ({ value, onCommit, className = '', tagName = 'span', placeholder = '', disabled = false }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== (value ?? '') && ref.current !== document.activeElement) {
      ref.current.textContent = value ?? '';
    }
  }, [value]);

  const Tag = tagName;
  return (
    <Tag
      ref={ref}
      className={`book-editable ${className}`}
      contentEditable={!disabled}
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      onBlur={(e) => {
        const next = e.currentTarget.textContent;
        if (next !== value) onCommit(next);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.currentTarget.textContent = value ?? '';
          e.currentTarget.blur();
        }
      }}
    />
  );
};

export const BookDocumentEditor = ({
  bookId = null,
  initialDoc = null,
  isGM = true,
  onSave,
  onClose,
  onBack
}) => {
  const rawBook = useBookStore((s) => s.books.find((b) => b.id === bookId));
  const updateBookMeta = useBookStore((s) => s.updateBookMeta);
  const addChapter = useBookStore((s) => s.addChapter);
  const updateChapter = useBookStore((s) => s.updateChapter);
  const deleteChapter = useBookStore((s) => s.deleteChapter);
  const addPage = useBookStore((s) => s.addPage);
  const updatePage = useBookStore((s) => s.updatePage);
  const deletePage = useBookStore((s) => s.deletePage);
  const setPageBlocks = useBookStore((s) => s.setPageBlocks);
  const addCustomTerm = useBookStore((s) => s.addCustomTerm);
  const updateCustomTerm = useBookStore((s) => s.updateCustomTerm);
  const deleteCustomTerm = useBookStore((s) => s.deleteCustomTerm);
  const createRevisionSnapshot = useBookStore((s) => s.createRevisionSnapshot);
  const deleteRevisionSnapshot = useBookStore((s) => s.deleteRevisionSnapshot);
  const restoreRevisionSnapshot = useBookStore((s) => s.restoreRevisionSnapshot);
  const syncToCloud = useBookStore((s) => s.syncToCloud);
  const authUser = useAuthStore((s) => s.user);

  const book = useMemo(() => normalizeBook(rawBook || initialDoc), [rawBook, initialDoc]);

  // Navigation State
  const [activeChapterId, setActiveChapterId] = useState(() => book.chapters[0]?.id || 'ch-1');
  const [activePageId, setActivePageId] = useState(() => book.chapters[0]?.pages[0]?.id || 'pg-1');

  // Mode: 'write' | 'read'
  const [activeMode, setActiveMode] = useState(isGM ? 'write' : 'read');
  const [activeSidebarTab, setActiveSidebarTab] = useState('toc'); // 'toc' | 'structure' | 'search' | 'history' | 'styling'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [saveState, setSaveState] = useState('idle');

  // Insertion & Pickers State
  const [insertAt, setInsertAt] = useState(null);
  const [entityPickAt, setEntityPickAt] = useState(null);
  const [entities, setEntities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Specialized Modals Targets
  const [imagePickerTarget, setImagePickerTarget] = useState(null); // { block, index }
  const [itemStudioTarget, setItemStudioTarget] = useState(null); // { block, index }
  const [lorePickerTarget, setLorePickerTarget] = useState(null); // { block, index }

  // Find active chapter & active page
  const currentChapter = useMemo(() => {
    return book.chapters.find((c) => c.id === activeChapterId) || book.chapters[0] || null;
  }, [book.chapters, activeChapterId]);

  const currentPage = useMemo(() => {
    if (!currentChapter) return null;
    return currentChapter.pages.find((p) => p.id === activePageId) || currentChapter.pages[0] || null;
  }, [currentChapter, activePageId]);

  // Keep active IDs synced if chapter/page changes
  useEffect(() => {
    if (currentChapter && currentChapter.id !== activeChapterId) {
      setActiveChapterId(currentChapter.id);
    }
  }, [currentChapter, activeChapterId]);

  useEffect(() => {
    if (currentPage && currentPage.id !== activePageId) {
      setActivePageId(currentPage.id);
    }
  }, [currentPage, activePageId]);

  // Load world entities
  useEffect(() => {
    let alive = true;
    universalEntityService.getAllBookEmbeddables({ limit: 2000 })
      .then((all) => {
        if (!alive) return;
        setEntities(all);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const mutatePageBlocks = (updater) => {
    if (!bookId || !currentChapter || !currentPage) return;
    const currentBlocks = currentPage.blocks || [];
    const nextBlocks = typeof updater === 'function' ? updater(currentBlocks) : updater;
    setPageBlocks(bookId, currentChapter.id, currentPage.id, nextBlocks);
  };

  const addBlock = (type, index = null, overrides = {}) => {
    const newBlock = {
      ...JSON.parse(JSON.stringify(NEW_BLOCK_DEFAULTS[type] || {})),
      ...overrides,
      id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type
    };

    mutatePageBlocks((blocks) => {
      const next = [...blocks];
      const at = (index !== null && index >= 0) ? index : next.length;
      next.splice(at, 0, newBlock);
      return next;
    });

    setInsertAt(null);
    setEntityPickAt(null);
    setEditingBlockId(newBlock.id);
    return newBlock.id;
  };

  const handleSaveImageBlock = (imgData) => {
    if (imagePickerTarget?.customCallback) {
      imagePickerTarget.customCallback(imgData);
    } else if (imagePickerTarget?.block) {
      updateBlock(imagePickerTarget.block.id, imgData);
    } else if (imagePickerTarget?.index !== undefined) {
      addBlock('image', imagePickerTarget.index, imgData);
    }
    setImagePickerTarget(null);
  };

  const handleSaveItemBlock = (itemData) => {
    const payload = {
      ...itemData,
      itemType: itemData.subtype || (itemData.type !== 'item_card' ? itemData.type : itemData.itemType)
    };
    if (itemStudioTarget?.customCallback) {
      itemStudioTarget.customCallback(payload);
    } else if (itemStudioTarget?.block) {
      updateBlock(itemStudioTarget.block.id, payload);
    } else if (itemStudioTarget?.index !== undefined) {
      addBlock('item_card', itemStudioTarget.index, payload);
    }
    setItemStudioTarget(null);
  };

  const handleSplitWithSideText = (blockId, side = 'right') => {
    mutatePageBlocks((blocks) =>
      blocks.map((b) => {
        if (b.id !== blockId) return b;
        const currentBlockCopy = { ...b };
        delete currentBlockCopy.alignment;

        const companionText = {
          type: 'paragraph',
          text: 'Add detailed lore, tactical advice, statistics, or narrative notes here...'
        };

        return {
          id: b.id,
          type: 'side_by_side',
          column: b.column || 'left',
          alignment: 'full',
          ratio: '50-50',
          left: side === 'right' ? currentBlockCopy : companionText,
          right: side === 'right' ? companionText : currentBlockCopy
        };
      })
    );
  };

  const handleSelectLore = (loreData) => {
    if (lorePickerTarget?.block) {
      updateBlock(lorePickerTarget.block.id, {
        title: loreData.name,
        category: loreData.category,
        content: loreData.content,
        summary: loreData.summary,
        icon: loreData.icon,
        entityId: loreData.id
      });
    }
    setLorePickerTarget(null);
  };

  const updateBlock = (blockId, updates) => {
    mutatePageBlocks((blocks) =>
      blocks.map((b) => (b.id === blockId ? { ...b, ...updates, id: b.id, type: b.type } : b))
    );
  };

  const moveBlock = (index, direction) => {
    mutatePageBlocks((blocks) => {
      const targetIdx = index + direction;
      if (targetIdx < 0 || targetIdx >= blocks.length) return blocks;
      const next = [...blocks];
      const temp = next[index];
      next[index] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  const deleteBlock = (blockId) => {
    mutatePageBlocks((blocks) => blocks.filter((b) => b.id !== blockId));
  };

  const navigateTo = ({ chapterId, pageId }) => {
    if (chapterId) setActiveChapterId(chapterId);
    if (pageId) setActivePageId(pageId);
  };

  // Stepper calculations
  const allPagesList = useMemo(() => {
    const list = [];
    book.chapters.forEach((ch) => {
      (ch.pages || []).forEach((pg) => {
        list.push({ chapterId: ch.id, pageId: pg.id, title: pg.headerTitle || ch.title, pageNumber: pg.pageNumber });
      });
    });
    return list;
  }, [book.chapters]);

  const currentPageIndex = useMemo(() => {
    return allPagesList.findIndex((p) => p.chapterId === activeChapterId && p.pageId === activePageId);
  }, [allPagesList, activeChapterId, activePageId]);

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prev = allPagesList[currentPageIndex - 1];
      navigateTo(prev);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < allPagesList.length - 1) {
      const next = allPagesList[currentPageIndex + 1];
      navigateTo(next);
    }
  };

  const handleSave = async () => {
    setSaveState('saving');
    try {
      if (onSave) {
        await onSave(book);
      } else if (authUser?.uid) {
        await syncToCloud(authUser.uid);
      }
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    } catch (err) {
      console.error('Failed to save document:', err);
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const handleCreateSnapshot = () => {
    const desc = window.prompt('Describe this checkpoint version:', `Manual Save - Chapter ${currentPage?.pageNumber || 1}`);
    if (desc !== null) {
      createRevisionSnapshot(book.id, desc);
    }
  };

  // Block hover controls component
  const BlockControls = ({ block, index, isFirst, isLast }) => {
    if (activeMode === 'read') return null;

    const currentBlockCol = block.column || 'left';

    const setBlockColumn = (colVal, e) => {
      e.stopPropagation();
      updateBlock(block.id, { column: colVal });
    };

    const currentAlign = block.alignment || 'full';

    const setBlockAlignment = (alignVal, e) => {
      e.stopPropagation();
      updateBlock(block.id, { alignment: alignVal });
    };

    const isSideBySide = block.type === 'side_by_side';

    return (
      <div className="book-block-controls" onClick={(e) => e.stopPropagation()}>
        {/* Column Placement Controls */}
        <div className="ctrl-group col-group">
          <button
            type="button"
            className={`col-btn ${currentBlockCol === 'left' ? 'active' : ''}`}
            onClick={(e) => setBlockColumn('left', e)}
            title="Place in Left Column"
          >
            L
          </button>
          <button
            type="button"
            className={`col-btn ${currentBlockCol === 'right' ? 'active' : ''}`}
            onClick={(e) => setBlockColumn('right', e)}
            title="Place in Right Column"
          >
            R
          </button>
          <button
            type="button"
            className={`col-btn ${currentBlockCol === 'full' ? 'active' : ''}`}
            onClick={(e) => setBlockColumn('full', e)}
            title="Span Full Width Across Columns"
          >
            <i className="fas fa-arrows-left-right"></i>
          </button>
        </div>

        {/* Text Flow & Float Controls */}
        <div className="ctrl-group flow-group">
          <button
            type="button"
            className={`align-ctrl-btn ${currentAlign === 'float-left' ? 'active' : ''}`}
            onClick={(e) => setBlockAlignment(currentAlign === 'float-left' ? 'full' : 'float-left', e)}
            title="Float Left (Text wraps to the right)"
          >
            <i className="fas fa-align-left"></i>
          </button>
          <button
            type="button"
            className={`align-ctrl-btn ${currentAlign === 'float-right' ? 'active' : ''}`}
            onClick={(e) => setBlockAlignment(currentAlign === 'float-right' ? 'full' : 'float-right', e)}
            title="Float Right (Text wraps to the left)"
          >
            <i className="fas fa-align-right"></i>
          </button>
          <button
            type="button"
            className={`align-ctrl-btn ${currentAlign === 'center' ? 'active' : ''}`}
            onClick={(e) => setBlockAlignment(currentAlign === 'center' ? 'full' : 'center', e)}
            title="Center / Column Fit"
          >
            <i className="fas fa-align-center"></i>
          </button>
        </div>

        {/* Side-by-Side Split Action */}
        {!isSideBySide && (
          <button
            type="button"
            className="split-side-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleSplitWithSideText(block.id, 'right');
            }}
            title="Add text to side (Split into 2 columns)"
          >
            <i className="fas fa-table-columns"></i>
          </button>
        )}

        {/* Reordering & Delete */}
        <div className="ctrl-group order-group">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => moveBlock(index, -1)}
            title="Move block up"
          >
            <i className="fas fa-arrow-up"></i>
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => moveBlock(index, 1)}
            title="Move block down"
          >
            <i className="fas fa-arrow-down"></i>
          </button>
          <button
            type="button"
            className="delete-block-btn"
            onClick={() => deleteBlock(block.id)}
            title="Delete block"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    );
  };

  // Insert rail between blocks
  const InsertRail = ({ index, isFirst = false }) => {
    if (activeMode === 'read') return null;

    return (
      <div className={`book-insert-rail ${isFirst ? 'is-first' : ''}`}>
        <button
          type="button"
          className="book-insert-btn"
          title="Insert new block here"
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setInsertAt({ index, x: rect.left, y: rect.bottom + 6 });
          }}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
    );
  };

  // Render individual publication block
  const renderPublicationBlock = (block, index, isWriteMode = true) => {
    const isEditing = editingBlockId === block.id;
    const effectiveIsWrite = isWriteMode && activeMode === 'write';
    const currentAlign = block.alignment || (block.type === 'image' && block.alignment ? block.alignment : 'full');
    const isFloating = currentAlign === 'float-left' || currentAlign === 'float-right';

    const wrap = (children) => (
      <div
        key={block.id}
        className={`book-block-wrap type-${block.type} align-${currentAlign} ${isFloating ? 'is-floating' : ''} ${isEditing ? 'editing' : ''}`}
        onClick={() => { if (effectiveIsWrite) setEditingBlockId(block.id); }}
      >
        {children}
        {effectiveIsWrite && (
          <BlockControls
            block={block}
            index={index}
            isFirst={index === 0}
            isLast={index === (currentPage?.blocks || []).length - 1}
          />
        )}
      </div>
    );

    switch (block.type) {
      case 'header': {
        const level = block.level || 2;
        const HeadingTag = `h${Math.min(3, Math.max(1, level))}`;
        const cls = `book-heading-${level}`;
        return wrap(
          <HeadingTag className={cls}>
            <EditableText
              value={block.text}
              disabled={!effectiveIsWrite}
              placeholder="Heading text..."
              onCommit={(text) => updateBlock(block.id, { text })}
            />
          </HeadingTag>
        );
      }

      case 'paragraph': {
        const hasDropCap = block.hasDropCap;
        const text = block.text || '';
        const firstLetter = text.slice(0, 1);
        const restText = text.slice(1);

        return wrap(
          <div className={`book-paragraph ${hasDropCap ? 'has-drop-cap' : ''}`}>
            {hasDropCap && <span className="book-drop-cap">{firstLetter}</span>}
            {effectiveIsWrite ? (
              <EditableText
                value={hasDropCap ? restText : text}
                tagName="p"
                className="book-prose-edit"
                placeholder="Write your prose here..."
                onCommit={(newRest) => {
                  const full = hasDropCap ? firstLetter + newRest : newRest;
                  updateBlock(block.id, { text: full });
                }}
              />
            ) : (
              <div className="book-prose-display">
                <RichLoreText text={text} className="parchment-theme" />
              </div>
            )}
          </div>
        );
      }

      case 'callout': {
        if (block.calloutType === 'secret' && !isGM) {
          return wrap(
            <aside className="book-callout-block callout-secret redacted">
              <div className="callout-header">
                <i className="fas fa-eye-slash"></i>
                <h4 className="callout-title">Redacted Lore</h4>
              </div>
              <div className="callout-content">
                <span className="redacted-text">This passage is sealed from mortal eyes.</span>
              </div>
            </aside>
          );
        }
        return wrap(
          <BookCalloutBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onImportLore={(b) => setLorePickerTarget({ block: b })}
          />
        );
      }

      case 'side_by_side':
        return wrap(
          <SideBySideBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenImagePicker={(slotData, callback) => {
              setImagePickerTarget({
                block: { id: block.id },
                customCallback: callback
              });
            }}
            onOpenItemStudio={(slotData, callback) => {
              setItemStudioTarget({
                block: { id: block.id },
                customCallback: callback
              });
            }}
          />
        );

      case 'creature_statblock':
        return wrap(
          <CreatureStatblockBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
          />
        );

      case 'item_card':
      case 'weapon':
      case 'armor':
      case 'accessory':
      case 'consumable':
      case 'container':
      case 'miscellaneous':
        return wrap(
          <ItemRelicBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenStudio={(b) => setItemStudioTarget({ block: block })}
          />
        );

      case 'spell_formula':
        return wrap(
          <SpellFormulaBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
          />
        );

      case 'location_showcase':
        return wrap(
          <LocationShowcaseBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
          />
        );

      case 'npc_dossier':
        return wrap(
          <NpcDossierBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
          />
        );

      case 'quest_hook':
        return wrap(
          <QuestHookBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
          />
        );

      case 'map_embed':
        return wrap(
          <MapEmbedBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
          />
        );

      case 'table_of_contents':
        return wrap(
          <TableOfContentsBlock
            book={book}
            onNavigate={navigateTo}
          />
        );

      case 'entity_embed': {
        const ent = entities.find((e) => e.type === block.entityType && (e.id === block.entityId || e.id.endsWith(`:${block.entityId}`)));
        return wrap(
          <div className={`book-entity-embed ${!ent ? 'unresolved' : ''}`}>
            <div className="embed-icon"><i className={`fas ${ent?.icon || 'fa-bookmark'}`}></i></div>
            <div className="embed-details">
              <div className="embed-type">{String(block.entityType || 'entity').toUpperCase()}</div>
              <div className="embed-name">{ent?.name || block.entityId || 'Unlinked Entity'}</div>
              <div className="embed-summary">{ent?.summary || 'World Entity linked to book chronicle.'}</div>
            </div>
          </div>
        );
      }

      case 'divider':
        return wrap(
          <div className={`book-divider ${block.dividerStyle || 'flourish'}`}>
            <div className="divider-line" />
            <div className="divider-flourish">
              <i className="fas fa-feather-pointed"></i>
            </div>
            <div className="divider-line" />
          </div>
        );

      case 'image':
        return wrap(
          <BookImageBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenPicker={(b) => setImagePickerTarget({ block: b })}
          />
        );

      default:
        return null;
    }
  };

  // Search matches across all chapters and pages
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results = [];

    book.chapters.forEach((ch) => {
      (ch.pages || []).forEach((pg) => {
        (pg.blocks || []).forEach((b) => {
          const text = b.text || b.content || b.description || b.name || b.title || '';
          if (text.toLowerCase().includes(q)) {
            const matchIndex = text.toLowerCase().indexOf(q);
            const start = Math.max(0, matchIndex - 30);
            const snippet = text.slice(start, start + 80);
            results.push({
              chapterId: ch.id,
              chapterTitle: ch.title,
              pageId: pg.id,
              pageNumber: pg.pageNumber,
              snippet
            });
          }
        });
      });
    });
    return results;
  }, [book.chapters, searchQuery]);

  const currentLayout = currentPage?.layout || book.layout || 'two-column';
  const isTwoColumn = currentLayout === 'two-column';
  const isWrite = activeMode === 'write';

  // Partition blocks for Two-Column layout
  const { leftColumnBlocks, rightColumnBlocks, fullColumnBlocks } = useMemo(() => {
    const blocks = currentPage?.blocks || [];
    const left = [];
    const right = [];
    const full = [];

    const hasExplicit = blocks.some((b) => b.column === 'left' || b.column === 'right' || b.column === 'full');

    if (hasExplicit) {
      blocks.forEach((b, idx) => {
        if (b.column === 'right') {
          right.push({ block: b, index: idx });
        } else if (b.column === 'full') {
          full.push({ block: b, index: idx });
        } else {
          left.push({ block: b, index: idx });
        }
      });
    } else {
      const half = Math.ceil(blocks.length / 2);
      blocks.forEach((b, idx) => {
        if (idx < half) {
          left.push({ block: b, index: idx });
        } else {
          right.push({ block: b, index: idx });
        }
      });
    }

    return { leftColumnBlocks: left, rightColumnBlocks: right, fullColumnBlocks: full };
  }, [currentPage?.blocks]);

  // Render publication Two-Column Grid
  const renderTwoColumnGrid = () => {
    const blocks = currentPage?.blocks || [];

    return (
      <div className="book-two-column-layout">
        <InsertRail index={0} isFirst />
        <div className="book-columns-grid">
          {/* Left Column */}
          <div className="book-column left-column">
            {leftColumnBlocks.map(({ block, index }) => (
              <React.Fragment key={block.id}>
                {renderPublicationBlock(block, index, true)}
                <InsertRail index={index + 1} />
              </React.Fragment>
            ))}
            {leftColumnBlocks.length === 0 && isWrite && (
              <div className="empty-column-zone" onClick={() => addBlock('paragraph', 0, { column: 'left' })}>
                <i className="fas fa-plus"></i> Add block to Left Column
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="book-column right-column">
            {rightColumnBlocks.map(({ block, index }) => (
              <React.Fragment key={block.id}>
                {renderPublicationBlock(block, index, true)}
                <InsertRail index={index + 1} />
              </React.Fragment>
            ))}
            {rightColumnBlocks.length === 0 && isWrite && (
              <div className="empty-column-zone" onClick={() => addBlock('paragraph', blocks.length, { column: 'right' })}>
                <i className="fas fa-plus"></i> Add block to Right Column
              </div>
            )}
          </div>
        </div>

        {/* Full-width spanned blocks at bottom */}
        {fullColumnBlocks.length > 0 && (
          <div className="book-fullwidth-blocks">
            {fullColumnBlocks.map(({ block, index }) => (
              <React.Fragment key={block.id}>
                {renderPublicationBlock(block, index, true)}
                <InsertRail index={index + 1} />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render publication Single-Column Body
  const renderSingleColumnBody = () => {
    return (
      <div className="book-page-body">
        <InsertRail index={0} isFirst />
        {(currentPage?.blocks || []).map((block, idx) => (
          <React.Fragment key={block.id}>
            {renderPublicationBlock(block, idx, true)}
            <InsertRail index={idx + 1} />
          </React.Fragment>
        ))}
      </div>
    );
  };

  const saveLabel = saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved!' : saveState === 'error' ? 'Save Failed' : 'Save Book';

  return (
    <div className={`book-document-editor theme-${book.theme || 'parchment'}`}>
      {/* Top Studio Toolbar */}
      <div className="book-editor-toolbar">
        {/* Navigation & Modes Left */}
        <div className="toolbar-left">
          {onBack && (
            <button type="button" className="toolbar-btn back-btn" onClick={onBack} title="Back to Library">
              <i className="fas fa-arrow-left"></i>
              <span>Library</span>
            </button>
          )}

          <button
            type="button"
            className={`toolbar-btn sidebar-toggle-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Navigator Drawer"
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Mode Switchers: Write / Read */}
          <div className="mode-toggle-group">
            <button
              type="button"
              className={`mode-btn ${activeMode === 'write' ? 'active' : ''}`}
              onClick={() => setActiveMode('write')}
              title="Publication Direct Authoring & Edit Mode"
            >
              <i className="fas fa-feather-pointed"></i> <span>Write</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${activeMode === 'read' ? 'active' : ''}`}
              onClick={() => setActiveMode('read')}
              title="Clean Distraction-Free Tabletop Reader"
            >
              <i className="fas fa-book-open"></i> <span>Read</span>
            </button>
          </div>
        </div>

        {/* Page / Chapter Quick Navigation Center with Theme & Layout Selectors */}
        <div className="toolbar-center">
          <div className="theme-pill-select">
            <i className="fas fa-palette"></i>
            <select
              value={book.theme || 'parchment'}
              onChange={(e) => updateBookMeta(book.id, { theme: e.target.value })}
              className="toolbar-theme-dropdown"
              title="Change Book Theme"
            >
              {THEME_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="layout-pill-select">
            <i className="fas fa-table-columns"></i>
            <select
              value={currentPage?.layout || book.layout || 'two-column'}
              onChange={(e) => {
                updateBookMeta(book.id, { layout: e.target.value });
                if (currentChapter && currentPage) {
                  updatePage(book.id, currentChapter.id, currentPage.id, { layout: e.target.value });
                }
              }}
              className="toolbar-layout-dropdown"
              title="Change Page Layout"
            >
              {LAYOUT_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className="page-stepper-pill">
            <button
              type="button"
              className="stepper-btn"
              disabled={currentPageIndex <= 0}
              onClick={handlePrevPage}
              title="Previous Page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="stepper-label">
              <strong>{currentChapter?.title || 'Chapter I'}</strong> • Page {currentPage?.pageNumber || 1} of {allPagesList.length || 1}
            </span>
            <button
              type="button"
              className="stepper-btn"
              disabled={currentPageIndex >= allPagesList.length - 1}
              onClick={handleNextPage}
              title="Next Page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Actions Right */}
        <div className="toolbar-right">
          <button
            type="button"
            className="toolbar-btn glossary-btn"
            onClick={() => setIsGlossaryOpen(true)}
            title="Manage Custom Glossary & Hover Terms"
          >
            <i className="fas fa-book-bookmark"></i>
            <span>Glossary ({(book.customTerms || []).length})</span>
          </button>

          <button
            type="button"
            className="toolbar-btn snapshot-btn"
            onClick={() => setIsSnapshotOpen(true)}
            title="Manage Revision Snapshots & Checkpoints"
          >
            <i className="fas fa-clock-rotate-left"></i>
            <span>Snapshot ({(book.revisions || []).length})</span>
          </button>

          <button
            type="button"
            className={`save-doc-btn ${saveState !== 'idle' && saveState !== 'saving' ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saveState === 'saving'}
          >
            <i className={`fas ${saveState === 'saving' ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>
            <span>{saveLabel}</span>
          </button>

          {onClose && (
            <button type="button" className="close-doc-btn" onClick={onClose} title="Close Document">
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="book-studio-layout">
        {/* Left Navigation Sidebar Drawer */}
        {sidebarOpen && (
          <aside className="book-sidebar-drawer">
            <div className="sidebar-tab-strip">
              <button
                type="button"
                className={`tab-btn ${activeSidebarTab === 'toc' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('toc')}
                title="Table of Contents"
              >
                <i className="fas fa-list-ol"></i>
                <span>TOC</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeSidebarTab === 'structure' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('structure')}
                title="Chapters & Pages Manager"
              >
                <i className="fas fa-file-lines"></i>
                <span>Pages</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeSidebarTab === 'search' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('search')}
                title="Search In Book"
              >
                <i className="fas fa-search"></i>
                <span>Search</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeSidebarTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('history')}
                title="Revision History"
              >
                <i className="fas fa-clock-rotate-left"></i>
                <span>History</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeSidebarTab === 'styling' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('styling')}
                title="Themes & Layouts"
              >
                <i className="fas fa-palette"></i>
                <span>Style</span>
              </button>
            </div>

            <div className="sidebar-body">
              {/* Tab: Table of Contents */}
              {activeSidebarTab === 'toc' && (
                <div className="sidebar-toc-pane">
                  <div className="pane-header">
                    <h4>Table of Contents</h4>
                    <span className="badge">{book.chapters.length} Chapters</span>
                  </div>
                  <div className="toc-nav-tree">
                    {book.chapters.map((ch, chIdx) => (
                      <div key={ch.id} className="toc-nav-chapter">
                        <div
                          className={`toc-nav-ch-head ${activeChapterId === ch.id ? 'active' : ''}`}
                          onClick={() => navigateTo({ chapterId: ch.id, pageId: ch.pages?.[0]?.id })}
                        >
                          <i className="fas fa-feather"></i>
                          <span className="ch-title">{ch.title}</span>
                          <span className="ch-page-num">p. {ch.pages?.[0]?.pageNumber || chIdx + 1}</span>
                        </div>

                        {ch.pages && (
                          <div className="toc-nav-pages-list">
                            {ch.pages.map((pg) => (
                              <div
                                key={pg.id}
                                className={`toc-nav-page-item ${activePageId === pg.id ? 'active' : ''}`}
                                onClick={() => navigateTo({ chapterId: ch.id, pageId: pg.id })}
                              >
                                <span className="pg-bullet">§</span>
                                <span className="pg-title">{pg.headerTitle || `Page ${pg.pageNumber}`}</span>
                                <span className="pg-num">p. {pg.pageNumber}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Structure Manager */}
              {activeSidebarTab === 'structure' && (
                <div className="sidebar-structure-pane">
                  <div className="pane-header">
                    <h4>Chapters &amp; Pages</h4>
                    <button
                      type="button"
                      className="structure-add-btn"
                      onClick={() => addChapter(book.id, { title: `Chapter ${book.chapters.length + 1}` })}
                      title="Add New Chapter"
                    >
                      <i className="fas fa-plus"></i> Chapter
                    </button>
                  </div>

                  <div className="chapters-structure-list">
                    {book.chapters.map((ch, idx) => (
                      <div key={ch.id} className={`structure-chapter-card ${activeChapterId === ch.id ? 'active' : ''}`}>
                        <div className="ch-card-header" onClick={() => navigateTo({ chapterId: ch.id, pageId: ch.pages?.[0]?.id })}>
                          <div className="ch-title-wrap">
                            <i className="fas fa-book-bookmark"></i>
                            <strong>{ch.title}</strong>
                          </div>
                          <div className="ch-card-actions">
                            <button
                              type="button"
                              title="Add Page to this Chapter"
                              onClick={(e) => { e.stopPropagation(); addPage(book.id, ch.id); }}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                            {book.chapters.length > 1 && (
                              <button
                                type="button"
                                className="danger"
                                title="Delete Chapter"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete "${ch.title}"?`)) deleteChapter(book.id, ch.id);
                                }}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="pages-sub-strip">
                          {(ch.pages || []).map((pg) => (
                            <div
                              key={pg.id}
                              className={`page-pill-item ${activePageId === pg.id ? 'active' : ''}`}
                              onClick={() => navigateTo({ chapterId: ch.id, pageId: pg.id })}
                            >
                              <span>Page {pg.pageNumber}</span>
                              {ch.pages.length > 1 && (
                                <button
                                  type="button"
                                  className="del-page"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePage(book.id, ch.id, pg.id);
                                  }}
                                  title="Delete Page"
                                >
                                  &times;
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Search */}
              {activeSidebarTab === 'search' && (
                <div className="sidebar-search-pane">
                  <div className="search-input-box">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Search text in book..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="search-results-list">
                    {searchResults.map((res, i) => (
                      <div
                        key={i}
                        className="search-result-card"
                        onClick={() => navigateTo({ chapterId: res.chapterId, pageId: res.pageId })}
                      >
                        <div className="res-meta">
                          <span>{res.chapterTitle}</span> • <span>Page {res.pageNumber}</span>
                        </div>
                        <p className="res-snippet">“...{res.snippet}...”</p>
                      </div>
                    ))}
                    {searchQuery && searchResults.length === 0 && (
                      <div className="search-empty">No matching passages found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: History */}
              {activeSidebarTab === 'history' && (
                <div className="sidebar-history-pane">
                  <div className="pane-header">
                    <h4>Revision Checkpoints</h4>
                    <button type="button" className="structure-add-btn" onClick={() => setIsSnapshotOpen(true)}>
                      <i className="fas fa-plus"></i> Snapshots &amp; History
                    </button>
                  </div>
                  <div className="history-entries-list">
                    {(book.revisions || []).map((rev) => (
                      <div key={rev.id} className="history-entry-card">
                        <div className="rev-head">
                          <i className="fas fa-code-commit"></i>
                          <span>{rev.description || 'Saved Checkpoint'}</span>
                        </div>
                        <span className="rev-time">{new Date(rev.timestamp).toLocaleString()}</span>
                        <button
                          type="button"
                          className="restore-rev-btn"
                          onClick={() => {
                            if (window.confirm(`Restore version "${rev.description}"?`)) {
                              restoreRevisionSnapshot(book.id, rev.id);
                            }
                          }}
                        >
                          <i className="fas fa-rotate-left"></i> Restore
                        </button>
                      </div>
                    ))}
                    {(!book.revisions || book.revisions.length === 0) && (
                      <div className="history-empty">No saved checkpoints yet.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Style & Meta */}
              {activeSidebarTab === 'styling' && (
                <div className="sidebar-style-pane">
                  <div className="pane-header">
                    <h4>Document Styling</h4>
                  </div>
                  <div className="style-group">
                    <label>Book Theme:</label>
                    <select
                      value={book.theme || 'parchment'}
                      onChange={(e) => updateBookMeta(book.id, { theme: e.target.value })}
                      className="style-select"
                    >
                      {THEME_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  <div className="style-group">
                    <label>Page Layout:</label>
                    <select
                      value={currentPage?.layout || book.layout || 'two-column'}
                      onChange={(e) => {
                        updateBookMeta(book.id, { layout: e.target.value });
                        if (currentChapter && currentPage) {
                          updatePage(book.id, currentChapter.id, currentPage.id, { layout: e.target.value });
                        }
                      }}
                      className="style-select"
                    >
                      {LAYOUT_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>

                  <div className="style-group">
                    <label>Current Chapter Title:</label>
                    <input
                      type="text"
                      value={currentChapter?.title || ''}
                      onChange={(e) => updateChapter(book.id, currentChapter.id, { title: e.target.value })}
                      className="style-input"
                    />
                  </div>

                  <div className="style-group">
                    <label>Current Page Title:</label>
                    <input
                      type="text"
                      value={currentPage?.headerTitle || ''}
                      onChange={(e) => updatePage(book.id, currentChapter.id, currentPage.id, { headerTitle: e.target.value })}
                      className="style-input"
                      placeholder="Page Heading..."
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Center: Book Page Viewport */}
        <main className="book-document-viewport" onClick={() => { setInsertAt(null); setEntityPickAt(null); }}>
          <div className={`book-page-sheet layout-${currentLayout}`}>
            <header className="book-page-header">
              <h1 className="book-doc-title">
                <EditableText
                  value={currentPage?.headerTitle || currentChapter?.title || book.title}
                  disabled={!isWrite}
                  placeholder="Document Title..."
                  onCommit={(text) => {
                    if (currentChapter && currentPage) {
                      updatePage(book.id, currentChapter.id, currentPage.id, { headerTitle: text });
                    } else {
                      updateBookMeta(book.id, { title: text });
                    }
                  }}
                />
              </h1>
              {currentChapter?.subtitle && (
                <p className="book-doc-subtitle">{currentChapter.subtitle}</p>
              )}
              {currentChapter?.epigraph && (
                <blockquote className="book-chapter-epigraph">{currentChapter.epigraph}</blockquote>
              )}
              <div className="book-header-rule" />
            </header>

            {/* Publication Column Body */}
            {isTwoColumn ? renderTwoColumnGrid() : renderSingleColumnBody()}

            {/* Running Footer */}
            <footer className="book-page-footer">
              <span className="book-footer-running">{currentChapter?.title || book.title}</span>
              <span className="book-footer-page">◆ Page {currentPage?.pageNumber || 1} ◆</span>
              <span className="book-footer-part">{book.author || 'A Mythrill Chronicle'}</span>
            </footer>
          </div>
        </main>
      </div>

      {/* Insert Popover Palette */}
      {insertAt && (
        <div
          className="book-insert-popover"
          style={{ left: Math.min(window.innerWidth - 320, Math.max(20, insertAt.x - 140)), top: insertAt.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="book-insert-popover-head">
            <i className="fas fa-feather-pointed"></i>
            <span>Insert Block at Position {insertAt.index + 1}</span>
          </div>
          <div className="book-insert-popover-grid">
            {INSERT_PALETTE.map((item) => (
              <button
                key={item.type}
                type="button"
                className="book-insert-option"
                onClick={() => {
                  const idx = insertAt.index;
                  setInsertAt(null);
                  if (item.type === 'image') {
                    setImagePickerTarget({ index: idx });
                  } else if (item.type === 'item_card') {
                    setItemStudioTarget({ index: idx });
                  } else if (item.type === 'lore_import') {
                    setLorePickerTarget({ index: idx });
                  } else {
                    addBlock(item.type, idx);
                  }
                }}
              >
                <i className={`fas ${item.icon}`}></i>
                <div className="opt-meta">
                  <span className="opt-title">{item.label}</span>
                  <span className="opt-hint">{item.hint}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Glossary Terms Modal */}
      <BookGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        terms={book.customTerms || []}
        onAddTerm={(t) => addCustomTerm(book.id, t)}
        onUpdateTerm={(id, p) => updateCustomTerm(book.id, id, p)}
        onDeleteTerm={(id) => deleteCustomTerm(book.id, id)}
      />

      {/* Image & Illustration Picker Modal */}
      <BookImagePickerModal
        isOpen={!!imagePickerTarget}
        onClose={() => setImagePickerTarget(null)}
        initialData={imagePickerTarget?.block || {}}
        onSave={handleSaveImageBlock}
      />

      {/* Item & Relic Studio Modal */}
      <BookItemCreatorModal
        isOpen={!!itemStudioTarget}
        onClose={() => setItemStudioTarget(null)}
        initialData={itemStudioTarget?.block || {}}
        onSave={handleSaveItemBlock}
      />

      {/* World & Campaign Lore Importer Modal */}
      <BookLorePickerModal
        isOpen={!!lorePickerTarget}
        onClose={() => setLorePickerTarget(null)}
        onSelectLore={handleSelectLore}
      />

      {/* Revision Snapshots & Checkpoints Modal */}
      <BookSnapshotModal
        isOpen={isSnapshotOpen}
        onClose={() => setIsSnapshotOpen(false)}
        book={book}
        onCreateSnapshot={(bId, summary, meta) => createRevisionSnapshot(bId, summary, meta)}
        onRestoreSnapshot={(bId, rId) => restoreRevisionSnapshot(bId, rId)}
        onDeleteSnapshot={(bId, rId) => deleteRevisionSnapshot(bId, rId)}
      />
    </div>
  );
};

export default BookDocumentEditor;
