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
  SideBySideBlock,
  LineageShowcaseBlock,
  DynastyTreeBlock,
  PlotThreadBlock,
  BookSketchBlock
} from './BookTtrpgBlocks';
import BookGlossaryModal from './BookGlossaryModal';
import BookImagePickerModal from './BookImagePickerModal';
import BookItemCreatorModal from './BookItemCreatorModal';
import BookCreaturePickerModal from './BookCreaturePickerModal';
import BookQuestPickerModal from './BookQuestPickerModal';
import BookLorePickerModal from './BookLorePickerModal';
import BookMapPickerModal from './BookMapPickerModal';
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
    tokenIcon: 'inv_misc_questionmark',
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
  lineage_showcase: {
    name: 'Solari',
    essence: 'The Cinder-Bound',
    description: 'Born of the molten volcanic caldrons, their skin bears living ember runes and volcanic fortitude.',
    baseTraits: { size: 'Medium', baseSpeed: 30, baseHp: 25, baseMana: 15, languages: ['Common', 'Solari'], lifespan: '120-180 yrs' },
    abilityModifiers: { STR: 2, AGI: -1, CON: 1, INT: 0, SPI: 1, CHA: -1 },
    racialPassives: [{ name: 'Cinder Blood', description: 'Immune to heat strain and +2 to saving throws against fire hazards.' }],
    racialAbilities: [{ name: 'Molten Surge', actionPointCost: 2, manaCost: 10, description: 'Cleave with blazing flame dealing 2d6 Ember damage.' }],
    meaningfulTradeoffs: 'Takes +15% additional damage from extreme Rime (Frost) environmental strain.',
    subraces: [{ name: 'Caldera Walker', description: 'Deep caldera denizens.' }]
  },
  dynasty_tree: {
    name: 'House Alduin — The High Kings of Nordhalla',
    description: 'The ancient ruling dynasty of the Frostwood Reach and Nordhalla high peaks.',
    nodes: [
      { id: 'n-1', name: 'Nikolaos Alduin', title: 'High King', lifespan: '750 - 825', role: 'Ruler of the Realm', gender: 'male' },
      { id: 'n-2', name: 'Serena Tolavarak', title: 'High Queen Consort', lifespan: '760 - 835', role: 'Matriarch of the Vale', gender: 'female' }
    ],
    relationships: [
      { fromId: 'n-1', toId: 'n-2', type: 'Royal Consort & Spouse' }
    ]
  },
  plot_thread: {
    title: 'The Shadow of Greymark',
    type: 'main',
    status: 'Active',
    act: 1,
    theme: 'Political Intrigue & Ancient Seal',
    summary: 'The thermal core beneath Greymark Citadel is fracturing as rival factions vie for the obsidian key.',
    beats: [
      { title: 'The Omens at Twilight', description: 'Cracks appear across the lower thermal vaults.', completed: true },
      { title: 'The Stolen Key', description: 'Recover the rusted iron key from Gref the Memory-Merchant.', completed: false },
      { title: 'The Sealed Vault', description: 'Unlock the gate beneath the weeping birch before solstice.', completed: false }
    ]
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
      { text: 'Locate Gref near the misty crossroads at twilight', completed: false },
      { text: 'Trade a memory of equal value for the rusted iron key', completed: false },
      { text: 'Unlock the sealed vault beneath the weeping birch', completed: false }
    ],
    reward: '150 Gold, Seelie Amulet of Warding',
    description: 'An ancient vault in the village of Drunhold was locked centuries ago during the Long Winter, and only a twilight merchant holds the original key.'
  },
  map_embed: {
    title: 'Frostwood Reach & Surrounding Lands',
    region: 'Frostwood Reach',
    mapId: 'frostwood-reach',
    subtitle: "The Mist-Archivists' Forest & Sovereign Ledger",
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    buttonText: 'Open Map',
    heightStyle: 'standard',
    zoom: 1.0,
    focalPoint: { x: 50, y: 50 },
    activeLocationId: 'loc-all',
    locations: [
      { id: 'loc-all', name: 'Overview', focalPoint: { x: 50, y: 50 }, zoom: 1.0, description: 'Complete regional overview.' },
      { id: 'loc-skald', name: "Skald's Peaks", focalPoint: { x: 52, y: 38 }, zoom: 1.85, description: 'Jagged mountain range guarding the northern pass.' },
      { id: 'loc-midhofn', name: 'Midhöfn', focalPoint: { x: 38, y: 46 }, zoom: 2.1, description: 'Harbor citadel connecting the frozen waterways.' },
      { id: 'loc-taiga', name: 'Frostwood Taiga', focalPoint: { x: 74, y: 32 }, zoom: 1.75, description: 'Dense pine forest shrouded in arcane mist.' }
    ],
    trails: [
      {
        id: 'trail-1',
        name: "King's Pass Route",
        color: '#ffd700',
        strokeWidth: 3,
        dashed: true,
        points: [{ x: 38, y: 46 }, { x: 44, y: 42 }, { x: 52, y: 38 }, { x: 62, y: 35 }, { x: 74, y: 32 }]
      }
    ],
    markers: [
      { id: 'pin-1', label: 'Midhöfn Citadel', x: 38, y: 46, icon: 'fa-fort-awesome', color: '#ffd700' },
      { id: 'pin-2', label: "Skald's Lair", x: 52, y: 38, icon: 'fa-skull', color: '#ef4444' },
      { id: 'pin-3', label: 'Taiga Outpost', x: 74, y: 32, icon: 'fa-campground', color: '#10b981' }
    ]
  },
  table_of_contents: { autoGenerate: true },
  entity_embed: { entityType: 'faction', entityId: '', displayMode: 'card' },
  image: { url: '/assets/images/races/merryn_illustration.png', caption: 'Merryn Wave-Rider', alignment: 'full', frame: 'gold-frame', sizePreset: 'full' },
  sketch_canvas: { title: 'Cartographic Sketch', caption: '', strokes: [], bgTheme: 'parchment' }
};

const INSERT_PALETTE = [
  { type: 'header', label: 'Heading', icon: 'fa-heading' },
  { type: 'paragraph', label: 'Prose', icon: 'fa-paragraph' },
  { type: 'side_by_side', label: 'Split View', icon: 'fa-table-columns' },
  { type: 'sketch_canvas', label: 'Stylus Sketch', icon: 'fa-pen-fancy' },
  { type: 'item_card', label: 'Item Card', icon: 'fa-gem' },
  { type: 'creature_statblock', label: 'Creature', icon: 'fa-dragon' },
  { type: 'quest_hook', label: 'Quest', icon: 'fa-scroll' },
  { type: 'lore_import', label: 'Import Lore', icon: 'fa-feather-pointed' },
  { type: 'lineage_showcase', label: 'Lineage', icon: 'fa-dna' },
  { type: 'dynasty_tree', label: 'Dynasty', icon: 'fa-sitemap' },
  { type: 'spell_formula', label: 'Spell', icon: 'fa-wand-magic-sparkles' },
  { type: 'location_showcase', label: 'Location', icon: 'fa-landmark' },
  { type: 'npc_dossier', label: 'NPC', icon: 'fa-user-shield' },
  { type: 'image', label: 'Art', icon: 'fa-image' },
  { type: 'callout', label: 'Callout', icon: 'fa-bookmark' },
  { type: 'plot_thread', label: 'Plot Arc', icon: 'fa-diagram-project' },
  { type: 'map_embed', label: 'Map', icon: 'fa-map-location-dot' },
  { type: 'table_of_contents', label: 'Contents', icon: 'fa-list-ol' },
  { type: 'divider', label: 'Divider', icon: 'fa-minus' }
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
  onBack,
  onNavigateMap
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
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth > 768 : true));
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [saveState, setSaveState] = useState('idle');

  // Insertion & Pickers State
  const [insertAt, setInsertAt] = useState(null); // { index, column, slotAlign, sizePreset, x, y }
  const [entities, setEntities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Specialized Modals Targets
  const [imagePickerTarget, setImagePickerTarget] = useState(null); // { block, index, column, slotAlign, sizePreset }
  const [itemStudioTarget, setItemStudioTarget] = useState(null); // { block, index, column, slotAlign, sizePreset, customCallback }
  const [creatureStudioTarget, setCreatureStudioTarget] = useState(null); // { block, index, column, slotAlign, sizePreset, customCallback }
  const [questPickerTarget, setQuestPickerTarget] = useState(null); // { block, index, column, slotAlign, sizePreset, customCallback }
  const [lorePickerTarget, setLorePickerTarget] = useState(null); // { block, index, column, slotAlign, sizePreset, customCallback }
  const [mapPickerTarget, setMapPickerTarget] = useState(null); // { block, index, column, slotAlign, sizePreset, customCallback }

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
    setEditingBlockId(newBlock.id);
    return newBlock.id;
  };

  const handleSaveImageBlock = (imgData) => {
    const formatted = {
      ...imgData,
      imageUrl: imgData.url || imgData.imageUrl,
      thumbnailUrl: imgData.thumbnail || imgData.thumbnailUrl || imgData.url || imgData.imageUrl,
      url: imgData.url || imgData.imageUrl
    };
    if (imagePickerTarget?.customCallback) {
      imagePickerTarget.customCallback(formatted);
    } else if (imagePickerTarget?.block) {
      updateBlock(imagePickerTarget.block.id, formatted);
    } else if (imagePickerTarget?.index !== undefined) {
      addBlock('image', imagePickerTarget.index, {
        ...formatted,
        ...(imagePickerTarget.column ? { column: imagePickerTarget.column } : {}),
        ...(imagePickerTarget.slotAlign ? { slotAlign: imagePickerTarget.slotAlign, sizePreset: 'half' } : {})
      });
    }
    setImagePickerTarget(null);
  };

  const handleSaveItemBlock = (itemData) => {
    const payload = {
      ...itemData,
      type: 'item_card',
      itemType: itemData.subtype || (itemData.type !== 'item_card' ? itemData.type : itemData.itemType)
    };
    if (itemStudioTarget?.customCallback) {
      itemStudioTarget.customCallback(payload);
    } else if (itemStudioTarget?.block?.id) {
      updateBlock(itemStudioTarget.block.id, payload);
    } else if (itemStudioTarget?.index !== undefined) {
      addBlock('item_card', itemStudioTarget.index, {
        ...payload,
        ...(itemStudioTarget.column ? { column: itemStudioTarget.column } : {}),
        ...(itemStudioTarget.slotAlign ? { slotAlign: itemStudioTarget.slotAlign, sizePreset: 'half' } : {})
      });
    }
    setItemStudioTarget(null);
  };

  const handleSaveCreatureBlock = (creatureData) => {
    if (creatureStudioTarget?.customCallback) {
      creatureStudioTarget.customCallback(creatureData);
    } else if (creatureStudioTarget?.block) {
      updateBlock(creatureStudioTarget.block.id, creatureData);
    } else if (creatureStudioTarget?.index !== undefined) {
      addBlock('creature_statblock', creatureStudioTarget.index, {
        ...creatureData,
        ...(creatureStudioTarget.column ? { column: creatureStudioTarget.column } : {}),
        ...(creatureStudioTarget.slotAlign ? { slotAlign: creatureStudioTarget.slotAlign, sizePreset: 'half' } : {})
      });
    }
    setCreatureStudioTarget(null);
  };

  const handleSaveQuestBlock = (questData) => {
    const payload = {
      ...questData,
      type: 'quest_hook'
    };
    if (questPickerTarget?.customCallback) {
      questPickerTarget.customCallback(payload);
    } else if (questPickerTarget?.block?.id) {
      updateBlock(questPickerTarget.block.id, payload);
    } else if (questPickerTarget?.index !== undefined) {
      addBlock('quest_hook', questPickerTarget.index, {
        ...payload,
        ...(questPickerTarget.column ? { column: questPickerTarget.column } : {}),
        ...(questPickerTarget.slotAlign ? { slotAlign: questPickerTarget.slotAlign, sizePreset: 'half' } : {})
      });
    }
    setQuestPickerTarget(null);
  };

  const handleSaveMapBlock = (mapData) => {
    const payload = {
      ...mapData,
      type: 'map_embed'
    };
    if (mapPickerTarget?.customCallback) {
      mapPickerTarget.customCallback(payload);
    } else if (mapPickerTarget?.block?.id) {
      updateBlock(mapPickerTarget.block.id, payload);
    } else if (mapPickerTarget?.index !== undefined) {
      addBlock('map_embed', mapPickerTarget.index, {
        ...payload,
        ...(mapPickerTarget.column ? { column: mapPickerTarget.column } : {}),
        ...(mapPickerTarget.slotAlign ? { slotAlign: mapPickerTarget.slotAlign, sizePreset: 'half' } : {})
      });
    }
    setMapPickerTarget(null);
  };

  const handleSplitWithSideText = (blockId, side = 'right') => {
    mutatePageBlocks((blocks) =>
      blocks.map((b) => {
        if (b.id !== blockId) return b;
        const currentBlockCopy = { ...b };
        delete currentBlockCopy.alignment;
        delete currentBlockCopy.slotAlign;

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
    const extraOverrides = {
      ...(lorePickerTarget?.column ? { column: lorePickerTarget.column } : {}),
      ...(lorePickerTarget?.slotAlign ? { slotAlign: lorePickerTarget.slotAlign, sizePreset: 'half' } : {})
    };

    if (lorePickerTarget?.customCallback) {
      lorePickerTarget.customCallback(loreData);
    } else if (lorePickerTarget?.block) {
      const b = lorePickerTarget.block;
      if (loreData.type === 'lineage' || loreData.category?.includes('Lineage')) {
        updateBlock(b.id, {
          type: 'lineage_showcase',
          name: loreData.name,
          essence: loreData.raw?.essence || loreData.summary,
          description: loreData.raw?.description || loreData.content,
          abilityModifiers: loreData.raw?.abilityModifiers || { STR: 0, AGI: 0, CON: 0, INT: 0, SPI: 0, CHA: 0 },
          baseTraits: loreData.raw?.baseTraits || { size: 'Medium', baseSpeed: 30, baseHp: 25, baseMana: 15, languages: ['Common'], lifespan: '60-100 yrs' },
          racialPassives: loreData.raw?.racialPassives || [],
          racialAbilities: loreData.raw?.racialAbilities || []
        });
      } else if (loreData.type === 'dynasty' || loreData.category?.includes('Dynasty')) {
        updateBlock(b.id, {
          type: 'dynasty_tree',
          name: loreData.name,
          description: loreData.raw?.description || loreData.summary,
          nodes: loreData.raw?.nodes || [],
          relationships: loreData.raw?.relationships || []
        });
      } else if (loreData.type === 'plot' || loreData.type === 'plot_thread') {
        updateBlock(b.id, {
          type: 'plot_thread',
          title: loreData.name,
          type: loreData.raw?.type || 'main',
          status: loreData.raw?.status || 'Active',
          act: loreData.raw?.act || 1,
          theme: loreData.raw?.theme || '',
          summary: loreData.raw?.summary || loreData.content,
          beats: loreData.raw?.beats || []
        });
      } else if (loreData.type === 'quest') {
        updateBlock(b.id, {
          type: 'quest_hook',
          title: loreData.name,
          status: loreData.raw?.status || 'Active',
          description: loreData.raw?.description || loreData.content,
          objectives: loreData.raw?.objectives || [],
          reward: loreData.raw?.rewards ? JSON.stringify(loreData.raw.rewards) : ''
        });
      } else {
        updateBlock(b.id, {
          title: loreData.name,
          category: loreData.category,
          content: loreData.content,
          summary: loreData.summary,
          icon: loreData.icon,
          entityId: loreData.id
        });
      }
    } else if (lorePickerTarget?.index !== undefined) {
      if (loreData.type === 'lineage') {
        addBlock('lineage_showcase', lorePickerTarget.index, {
          name: loreData.name,
          essence: loreData.raw?.essence || loreData.summary,
          description: loreData.raw?.description || loreData.content,
          abilityModifiers: loreData.raw?.abilityModifiers,
          racialPassives: loreData.raw?.racialPassives,
          racialAbilities: loreData.raw?.racialAbilities,
          ...extraOverrides
        });
      } else if (loreData.type === 'dynasty') {
        addBlock('dynasty_tree', lorePickerTarget.index, {
          name: loreData.name,
          description: loreData.raw?.description || loreData.summary,
          nodes: loreData.raw?.nodes || [],
          relationships: loreData.raw?.relationships || [],
          ...extraOverrides
        });
      } else if (loreData.type === 'plot' || loreData.type === 'plot_thread') {
        addBlock('plot_thread', lorePickerTarget.index, {
          title: loreData.name,
          summary: loreData.raw?.summary || loreData.content,
          beats: loreData.raw?.beats || [],
          ...extraOverrides
        });
      } else if (loreData.type === 'quest') {
        addBlock('quest_hook', lorePickerTarget.index, {
          title: loreData.name,
          description: loreData.raw?.description || loreData.content,
          objectives: loreData.raw?.objectives || [],
          ...extraOverrides
        });
      } else {
        addBlock('callout', lorePickerTarget.index, {
          title: loreData.name,
          content: loreData.content || loreData.summary,
          icon: loreData.icon || 'fa-scroll',
          ...extraOverrides
        });
      }
    }
    setLorePickerTarget(null);
  };

  const updateBlock = (blockId, updates) => {
    mutatePageBlocks((blocks) =>
      blocks.map((b) => (b.id === blockId ? { ...b, ...updates, id: b.id, type: b.type } : b))
    );
  };

  const moveBlockInColumn = (blockId, direction) => {
    mutatePageBlocks((blocks) => {
      const bIdx = blocks.findIndex((b) => b.id === blockId);
      if (bIdx === -1) return blocks;
      const targetBlock = blocks[bIdx];
      const half = Math.ceil(blocks.length / 2);
      const col = targetBlock.column || (bIdx < half ? 'left' : 'right');

      // Find all blocks in the same column
      const sameColIndices = [];
      blocks.forEach((b, i) => {
        const c = b.column || (i < half ? 'left' : 'right');
        if (c === col) sameColIndices.push(i);
      });

      const posInCol = sameColIndices.indexOf(bIdx);
      const targetPosInCol = posInCol + direction;

      if (targetPosInCol < 0) {
        if (col === 'right') {
          return blocks.map((b) => (b.id === blockId ? { ...b, column: 'left' } : b));
        }
        return blocks;
      }

      if (targetPosInCol >= sameColIndices.length) {
        if (col === 'left') {
          return blocks.map((b) => (b.id === blockId ? { ...b, column: 'right' } : b));
        }
        return blocks;
      }

      const swapWithIdx = sameColIndices[targetPosInCol];
      const next = [...blocks];
      const temp = next[bIdx];
      next[bIdx] = next[swapWithIdx];
      next[swapWithIdx] = temp;
      return next;
    });
  };

  const deleteBlock = (blockId) => {
    mutatePageBlocks((blocks) => blocks.filter((b) => b.id !== blockId));
  };

  const navigateTo = ({ chapterId, pageId }) => {
    if (chapterId) setActiveChapterId(chapterId);
    if (pageId) setActivePageId(pageId);
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
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

  // Block hover controls component - elevated, clearly labelled, with sub-column side placement
  const BlockControls = ({ block, index, isFirst, isLast, colContext = {} }) => {
    if (activeMode === 'read') return null;

    const currentBlockCol = block.column || colContext.colName || 'left';
    const isLeftHalf = block.slotAlign === 'left' || (block.sizePreset === 'half' && block.slotAlign !== 'right' && block.alignment !== 'float-right');
    const isRightHalf = block.slotAlign === 'right';
    const isFullCol = (block.sizePreset === 'full' || (!block.slotAlign && !block.sizePreset)) && block.alignment !== 'float-left' && block.alignment !== 'float-right';
    const isFloatLeft = block.alignment === 'float-left';
    const isFloatRight = block.alignment === 'float-right';

    const setBlockColumn = (colVal, e) => {
      e.stopPropagation();
      updateBlock(block.id, { column: colVal });
    };

    const setBlockSlotAlign = (slotVal, e) => {
      e.stopPropagation();
      if (slotVal === 'left') {
        updateBlock(block.id, { slotAlign: 'left', sizePreset: 'half', alignment: 'full' });
      } else if (slotVal === 'right') {
        updateBlock(block.id, { slotAlign: 'right', sizePreset: 'half', alignment: 'full' });
      } else if (slotVal === 'full') {
        updateBlock(block.id, { slotAlign: 'full', sizePreset: 'full', alignment: 'full' });
      } else if (slotVal === 'float-left') {
        updateBlock(block.id, { slotAlign: 'full', sizePreset: 'full', alignment: 'float-left' });
      } else if (slotVal === 'float-right') {
        updateBlock(block.id, { slotAlign: 'full', sizePreset: 'full', alignment: 'float-right' });
      }
    };

    const isSideBySide = block.type === 'side_by_side';
    const isFirstInCol = colContext.isFirstInCol ?? isFirst;
    const isLastInCol = colContext.isLastInCol ?? isLast;

    return (
      <div
        className={`book-block-controls ${isLeftHalf ? 'anchor-left' : 'anchor-right'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Page Column: Left Page, Right Page, Spread */}
        <div className="ctrl-group placement-group">
          <button
            type="button"
            className={`ctrl-btn icon-only ${currentBlockCol === 'left' ? 'active' : ''}`}
            onClick={(e) => setBlockColumn('left', e)}
            title="Place in Left Page Column"
          >
            <span className="btn-col-badge">L</span>
          </button>
          <button
            type="button"
            className={`ctrl-btn icon-only ${currentBlockCol === 'right' ? 'active' : ''}`}
            onClick={(e) => setBlockColumn('right', e)}
            title="Place in Right Page Column"
          >
            <span className="btn-col-badge">R</span>
          </button>
          <button
            type="button"
            className={`ctrl-btn icon-only ${currentBlockCol === 'full' ? 'active' : ''}`}
            onClick={(e) => setBlockColumn('full', e)}
            title="Span Full Width Across Both Columns (Spread)"
          >
            <i className="fas fa-arrows-left-right"></i>
          </button>
        </div>

        <div className="ctrl-divider" />

        {/* Width & Side Placement */}
        <div className="ctrl-group sizing-group">
          <button
            type="button"
            className={`ctrl-btn icon-only ${isLeftHalf ? 'active' : ''}`}
            onClick={(e) => setBlockSlotAlign('left', e)}
            title="Place on Left Side (½ width) — Opens space on the right"
          >
            <span className="icon-glyph">◧</span>
          </button>
          <button
            type="button"
            className={`ctrl-btn icon-only ${isRightHalf ? 'active' : ''}`}
            onClick={(e) => setBlockSlotAlign('right', e)}
            title="Place on Right Side (½ width) — Opens space on the left"
          >
            <span className="icon-glyph">◨</span>
          </button>
          <button
            type="button"
            className={`ctrl-btn icon-only ${isFullCol ? 'active' : ''}`}
            onClick={(e) => setBlockSlotAlign('full', e)}
            title="Full Column Width (100%)"
          >
            <span className="icon-glyph">■</span>
          </button>
        </div>

        <div className="ctrl-divider" />

        {/* Flow & Float */}
        <div className="ctrl-group flow-group">
          <button
            type="button"
            className={`ctrl-btn icon-only ${isFloatLeft ? 'active' : ''}`}
            onClick={(e) => setBlockSlotAlign('float-left', e)}
            title="Float Left (Text wraps around it)"
          >
            <i className="fas fa-align-left"></i>
          </button>
          <button
            type="button"
            className={`ctrl-btn icon-only ${isFloatRight ? 'active' : ''}`}
            onClick={(e) => setBlockSlotAlign('float-right', e)}
            title="Float Right (Text wraps around it)"
          >
            <i className="fas fa-align-right"></i>
          </button>
        </div>

        <div className="ctrl-divider" />

        {/* Actions Segment: Split, Reorder, Delete */}
        <div className="ctrl-group actions-group">
          {!isSideBySide && (
            <button
              type="button"
              className="ctrl-btn icon-only split-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSplitWithSideText(block.id, 'right');
              }}
              title="Split into Dual Side-by-Side container"
            >
              <i className="fas fa-table-columns"></i>
            </button>
          )}

          <button
            type="button"
            className="ctrl-btn icon-only move-btn"
            disabled={isFirstInCol && currentBlockCol === 'left'}
            onClick={() => moveBlockInColumn(block.id, -1)}
            title="Move block up"
          >
            <i className="fas fa-chevron-up"></i>
          </button>
          <button
            type="button"
            className="ctrl-btn icon-only move-btn"
            disabled={isLastInCol && currentBlockCol === 'right'}
            onClick={() => moveBlockInColumn(block.id, 1)}
            title="Move block down"
          >
            <i className="fas fa-chevron-down"></i>
          </button>
          <button
            type="button"
            className="ctrl-btn icon-only delete-btn"
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
  const renderPublicationBlock = (block, index, isWriteMode = true, colContext = {}) => {
    const isEditing = editingBlockId === block.id;
    const effectiveIsWrite = isWriteMode && activeMode === 'write';
    const isHalf = colContext.isHalfSlot || block.slotAlign === 'left' || block.slotAlign === 'right' || block.sizePreset === 'half';
    const slotClass = colContext.isHalfSlot ? `slot-${colContext.isHalfSlot}` : (block.slotAlign ? `slot-${block.slotAlign}` : '');
    const currentAlign = block.alignment || 'full';
    const currentSize = isHalf ? 'half' : (block.sizePreset || 'full');
    const isFloating = currentAlign === 'float-left' || currentAlign === 'float-right';

    const wrap = (children) => (
      <div
        key={block.id}
        className={`book-block-wrap type-${block.type} align-${currentAlign} size-${currentSize} ${slotClass} ${isFloating ? 'is-floating' : ''} ${isHalf ? 'is-half-width' : ''} ${isEditing ? 'editing' : ''}`}
        onClick={() => { if (effectiveIsWrite) setEditingBlockId(block.id); }}
      >
        {children}
        {effectiveIsWrite && (
          <BlockControls
            block={block}
            index={index}
            isFirst={colContext.isFirstInCol ?? (index === 0)}
            isLast={colContext.isLastInCol ?? (index === (currentPage?.blocks || []).length - 1)}
            colContext={colContext}
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
            onOpenLorePicker={(b) => setLorePickerTarget({ block: b })}
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
                block: { id: block.id, ...(slotData || {}) },
                customCallback: callback
              });
            }}
            onOpenItemStudio={(slotData, callback) => {
              setItemStudioTarget({
                block: { id: block.id, ...(slotData || {}) },
                customCallback: callback
              });
            }}
            onOpenCreatureWizard={(slotData, callback) => {
              setCreatureStudioTarget({
                block: { id: block.id, ...(slotData || {}) },
                customCallback: callback
              });
            }}
            onOpenQuestPicker={(slotData, callback) => {
              setQuestPickerTarget({
                block: { id: block.id, ...(slotData || {}) },
                customCallback: callback
              });
            }}
            onOpenLorePicker={(slotData, callback) => {
              setLorePickerTarget({
                block: { id: block.id, ...(slotData || {}) },
                customCallback: callback
              });
            }}
            onOpenMapPicker={(slotData, callback) => {
              setMapPickerTarget({
                block: { id: block.id, ...(slotData || {}) },
                customCallback: callback
              });
            }}
            onNavigateMap={onNavigateMap}
          />
        );

      case 'creature_statblock':
        return wrap(
          <CreatureStatblockBlock
            block={block}
            isWrite={effectiveIsWrite}
            compact={isHalf}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenWizard={(b) => setCreatureStudioTarget({ block: { ...(b || block), openWizardDirectly: true } })}
            onOpenPicker={(b) => setCreatureStudioTarget({ block: b || block })}
          />
        );

      case 'lineage_showcase':
        return wrap(
          <LineageShowcaseBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenPicker={() => setLorePickerTarget({ block })}
          />
        );

      case 'dynasty_tree':
        return wrap(
          <DynastyTreeBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenPicker={() => setLorePickerTarget({ block })}
          />
        );

      case 'plot_thread':
        return wrap(
          <PlotThreadBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenPicker={() => setLorePickerTarget({ block })}
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
            compact={isHalf}
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
            onOpenPicker={() => setLorePickerTarget({ block })}
          />
        );

      case 'npc_dossier':
        return wrap(
          <NpcDossierBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenPicker={() => setLorePickerTarget({ block })}
          />
        );

      case 'quest_hook':
        return wrap(
          <QuestHookBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenPicker={(b) => setQuestPickerTarget({ block: b || block })}
          />
        );

      case 'map_embed':
        return wrap(
          <MapEmbedBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch)}
            onOpenPicker={(b) => setMapPickerTarget({ block: b || block })}
            onOpenImagePicker={(b) => setImagePickerTarget({ block: b || block })}
            onNavigateMap={onNavigateMap}
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

      case 'sketch_canvas':
        return wrap(
          <BookSketchBlock
            block={block}
            isEditMode={effectiveIsWrite}
            onChange={(patch) => updateBlock(block.id, patch)}
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

    const half = Math.ceil(blocks.length / 2);
    blocks.forEach((b, idx) => {
      const col = b.column || (idx < half ? 'left' : 'right');
      if (col === 'right') {
        right.push({ block: b, index: idx });
      } else if (col === 'full') {
        full.push({ block: b, index: idx });
      } else {
        left.push({ block: b, index: idx });
      }
    });

    return { leftColumnBlocks: left, rightColumnBlocks: right, fullColumnBlocks: full };
  }, [currentPage?.blocks]);

  // Render a list of column blocks with automatic pairing of left/right half blocks and companion slots
  const renderColumnBlocks = (colBlocks, colName) => {
    const total = colBlocks.length;
    const elements = [];
    let i = 0;

    while (i < total) {
      const { block: b, index: originalIdx } = colBlocks[i];
      const isLeft = b.slotAlign === 'left' || (b.sizePreset === 'half' && b.slotAlign !== 'right' && b.alignment !== 'float-right');
      const isRight = b.slotAlign === 'right';

      if (isLeft) {
        // Check if there is an adjacent right-aligned half block to pair with
        const nextItem = i + 1 < total ? colBlocks[i + 1] : null;
        const isNextRight = nextItem && (nextItem.block.slotAlign === 'right' || (nextItem.block.sizePreset === 'half' && nextItem.block.slotAlign !== 'left'));

        if (isNextRight) {
          elements.push(
            <div key={`pair-${b.id}-${nextItem.block.id}`} className="book-paired-row">
              {renderPublicationBlock(b, originalIdx, true, { colName, isHalfSlot: 'left', isPaired: true })}
              {renderPublicationBlock(nextItem.block, nextItem.index, true, { colName, isHalfSlot: 'right', isPaired: true })}
            </div>
          );
          elements.push(<InsertRail key={`rail-${nextItem.index + 1}`} index={nextItem.index + 1} />);
          i += 2;
        } else {
          // Unpaired left block -> render companion slot on the right
          elements.push(
            <div key={`pair-${b.id}-open-right`} className="book-paired-row">
              {renderPublicationBlock(b, originalIdx, true, { colName, isHalfSlot: 'left', isPaired: false })}
              {isWrite ? (
                <div
                  className="book-companion-empty-slot slot-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setInsertAt({
                      index: originalIdx + 1,
                      column: colName,
                      slotAlign: 'right',
                      sizePreset: 'half',
                      x: rect.left + rect.width / 2,
                      y: rect.bottom + 6
                    });
                  }}
                  title="Add a companion block on the right"
                >
                  <div className="empty-slot-inner">
                    <i className="fas fa-plus-circle empty-slot-icon"></i>
                    <span className="empty-slot-label">+ Add block beside this</span>
                    <span className="empty-slot-hint">Text, Item, Creature, Image, Lore</span>
                  </div>
                </div>
              ) : (
                <div className="book-companion-empty-spacer" />
              )}
            </div>
          );
          elements.push(<InsertRail key={`rail-${originalIdx + 1}`} index={originalIdx + 1} />);
          i += 1;
        }
      } else if (isRight) {
        // Unpaired right block -> render companion slot on the left
        elements.push(
          <div key={`pair-open-left-${b.id}`} className="book-paired-row">
            {isWrite ? (
              <div
                className="book-companion-empty-slot slot-left"
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setInsertAt({
                    index: originalIdx,
                    column: colName,
                    slotAlign: 'left',
                    sizePreset: 'half',
                    x: rect.left + rect.width / 2,
                    y: rect.bottom + 6
                  });
                }}
                title="Add a companion block on the left"
              >
                <div className="empty-slot-inner">
                  <i className="fas fa-plus-circle empty-slot-icon"></i>
                  <span className="empty-slot-label">+ Add block beside this</span>
                  <span className="empty-slot-hint">Text, Item, Creature, Image, Lore</span>
                </div>
              </div>
            ) : (
              <div className="book-companion-empty-spacer" />
            )}
            {renderPublicationBlock(b, originalIdx, true, { colName, isHalfSlot: 'right', isPaired: false })}
          </div>
        );
        elements.push(<InsertRail key={`rail-${originalIdx + 1}`} index={originalIdx + 1} />);
        i += 1;
      } else {
        // Full width or floating block
        elements.push(
          <React.Fragment key={b.id}>
            {renderPublicationBlock(b, originalIdx, true, {
              colName,
              isFirstInCol: i === 0,
              isLastInCol: i === total - 1
            })}
            <InsertRail index={originalIdx + 1} />
          </React.Fragment>
        );
        i += 1;
      }
    }

    return elements;
  };

  // Render publication Two-Column Grid with flex flow for 2+2 layout
  const renderTwoColumnGrid = () => {
    const blocks = currentPage?.blocks || [];

    return (
      <div className="book-two-column-layout">
        <InsertRail index={0} isFirst />
        <div className="book-columns-grid">
          {/* Left Column */}
          <div className="book-column left-column">
            <div className="book-column-content">
              {renderColumnBlocks(leftColumnBlocks, 'left')}
            </div>
            {leftColumnBlocks.length === 0 && isWrite && (
              <div className="empty-column-zone" onClick={() => addBlock('paragraph', 0, { column: 'left' })}>
                <i className="fas fa-plus"></i> Add block to Left Column
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="book-column right-column">
            <div className="book-column-content">
              {renderColumnBlocks(rightColumnBlocks, 'right')}
            </div>
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
            {renderColumnBlocks(fullColumnBlocks, 'full')}
          </div>
        )}
      </div>
    );
  };

  // Render publication Single-Column Body
  const renderSingleColumnBody = () => {
    const allColBlocks = (currentPage?.blocks || []).map((b, idx) => ({ block: b, index: idx }));
    return (
      <div className="book-page-body">
        <InsertRail index={0} isFirst />
        <div className="book-column-content">
          {renderColumnBlocks(allColBlocks, 'single')}
        </div>
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
            <button type="button" className="toolbar-btn back-btn" onClick={onBack} title="Back to Library" aria-label="Back to Library">
              <i className="fas fa-arrow-left"></i>
            </button>
          )}

          <button
            type="button"
            className={`toolbar-btn sidebar-toggle-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Book Navigator Drawer (TOC, Pages, Search, History, Style)"
            aria-label="Toggle Book Navigator Drawer"
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
              aria-label="Write Mode"
            >
              <i className="fas fa-feather-pointed"></i>
            </button>
            <button
              type="button"
              className={`mode-btn ${activeMode === 'read' ? 'active' : ''}`}
              onClick={() => setActiveMode('read')}
              title="Clean Distraction-Free Tabletop Reader"
              aria-label="Read Mode"
            >
              <i className="fas fa-book-open"></i>
            </button>
            <button
              type="button"
              className="mode-btn"
              onClick={() => {
                const prev = activeMode;
                setActiveMode('read');
                setTimeout(() => window.print(), 150);
                setTimeout(() => setActiveMode(prev), 800);
              }}
              title="Print / Export PDF"
              aria-label="Print Book"
            >
              <i className="fas fa-print"></i>
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
              <strong className="stepper-ch-name">{currentChapter?.title || 'Chapter I'}</strong>
              <span className="stepper-separator"> • </span>
              <span className="stepper-pg-count">Page {currentPage?.pageNumber || 1} of {allPagesList.length || 1}</span>
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
            title={`Manage Custom Glossary & Hover Terms (${(book.customTerms || []).length})`}
            aria-label={`Glossary (${(book.customTerms || []).length} terms)`}
          >
            <i className="fas fa-book-bookmark"></i>
          </button>

          <button
            type="button"
            className="toolbar-btn snapshot-btn"
            onClick={() => setIsSnapshotOpen(true)}
            title={`Manage Revision Snapshots & Checkpoints (${(book.revisions || []).length})`}
            aria-label={`Revision Snapshots (${(book.revisions || []).length})`}
          >
            <i className="fas fa-clock-rotate-left"></i>
          </button>

          <button
            type="button"
            className={`save-doc-btn ${saveState !== 'idle' && saveState !== 'saving' ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saveState === 'saving'}
            title={saveLabel}
            aria-label={saveLabel}
          >
            <i className={`fas ${saveState === 'saving' ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>
          </button>

          {onClose && (
            <button type="button" className="close-doc-btn" onClick={onClose} title="Close Document" aria-label="Close Document">
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="book-studio-layout">
        {/* Mobile Backdrop for Sidebar Drawer */}
        {sidebarOpen && (
          <div
            className="book-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Left Navigation Sidebar Drawer */}
        {sidebarOpen && (
          <aside className="book-sidebar-drawer">
            <div className="sidebar-mobile-header">
              <span className="sidebar-mobile-title"><i className="fas fa-book-open"></i> Book Navigation</span>
              <button
                type="button"
                className="sidebar-close-mobile-btn"
                onClick={() => setSidebarOpen(false)}
                title="Close Navigation Drawer"
              >
                &times;
              </button>
            </div>
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
                    {book.chapters.map((ch) => (
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
        <main className="book-document-viewport" onClick={() => { setInsertAt(null); }}>
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
          style={{
            left: Math.min(window.innerWidth - 490, Math.max(20, (insertAt.x || 300) - 240)),
            top: Math.max(20, (insertAt.y || 200))
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="book-insert-popover-head">
            <div className="popover-head-title">
              <i className="fas fa-feather-pointed"></i>
              <span>Insert Block {insertAt.slotAlign ? `(${insertAt.slotAlign} side)` : `(Position ${insertAt.index + 1})`}</span>
            </div>
            <button type="button" className="close-popover-x" onClick={() => setInsertAt(null)} title="Close">&times;</button>
          </div>
          <div className="book-insert-popover-grid">
            {INSERT_PALETTE.map((item) => (
              <button
                key={item.type}
                type="button"
                className="book-insert-option"
                onClick={() => {
                  const idx = insertAt.index;
                  const col = insertAt.column;
                  const slotAlign = insertAt.slotAlign;
                  const sizePreset = insertAt.sizePreset;
                  setInsertAt(null);
                  if (item.type === 'image') {
                    setImagePickerTarget({ index: idx, column: col, slotAlign, sizePreset });
                  } else if (item.type === 'item_card') {
                    setItemStudioTarget({ index: idx, column: col, slotAlign, sizePreset });
                  } else if (item.type === 'creature_statblock') {
                    setCreatureStudioTarget({ index: idx, column: col, slotAlign, sizePreset });
                  } else if (item.type === 'quest_hook') {
                    setQuestPickerTarget({ index: idx, column: col, slotAlign, sizePreset });
                  } else if (item.type === 'lore_import') {
                    setLorePickerTarget({ index: idx, column: col, slotAlign, sizePreset });
                  } else {
                    addBlock(item.type, idx, {
                      ...(col ? { column: col } : {}),
                      ...(slotAlign ? { slotAlign, sizePreset: sizePreset || 'half' } : {})
                    });
                  }
                }}
              >
                <i className={`fas ${item.icon}`}></i>
                <span className="opt-title">{item.label}</span>
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

      {/* Official Creature & NPC Wizard Modal */}
      <BookCreaturePickerModal
        isOpen={!!creatureStudioTarget}
        onClose={() => setCreatureStudioTarget(null)}
        initialData={creatureStudioTarget?.block || {}}
        onSave={handleSaveCreatureBlock}
      />

      {/* Quest & Adventure Hook Picker Modal */}
      <BookQuestPickerModal
        isOpen={!!questPickerTarget}
        onClose={() => setQuestPickerTarget(null)}
        initialData={questPickerTarget?.block || {}}
        onSave={handleSaveQuestBlock}
      />

      {/* World & Campaign Lore Importer Modal */}
      <BookLorePickerModal
        isOpen={!!lorePickerTarget}
        onClose={() => setLorePickerTarget(null)}
        onSelectLore={handleSelectLore}
      />

      {/* Map & Atlas Studio Picker Modal */}
      <BookMapPickerModal
        isOpen={!!mapPickerTarget}
        onClose={() => setMapPickerTarget(null)}
        initialData={mapPickerTarget?.block || {}}
        onSave={handleSaveMapBlock}
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
