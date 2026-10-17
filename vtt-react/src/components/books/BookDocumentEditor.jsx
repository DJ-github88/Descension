import React, { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
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
  BookSketchBlock,
  BookTableBlock,
  BookQuoteBlock,
  CREATURE_PRESETS,
  SPELL_PRESETS
} from './BookTtrpgBlocks';
import BookGlossaryModal from './BookGlossaryModal';
import BookImagePickerModal from './BookImagePickerModal';
import BookItemCreatorModal from './BookItemCreatorModal';
import BookCreaturePickerModal from './BookCreaturePickerModal';
import BookSpellPickerModal from './BookSpellPickerModal';
import BookQuestPickerModal from './BookQuestPickerModal';
import BookLorePickerModal from './BookLorePickerModal';
import BookMapPickerModal from './BookMapPickerModal';
import BookSnapshotModal from './BookSnapshotModal';
import BookSyntaxGuideModal from './BookSyntaxGuideModal';
import BookCampaignImporterModal from './BookCampaignImporterModal';
import QuickPeekDrawer from '../common/QuickPeekDrawer';
import { useIsPhone } from '../../hooks/useIsPhone';
import { clampPopoverPosition } from '../../utils/popoverPosition';
import './BookDocumentEditor.css';
import './BookAtmosphere.css';

export const LayoutIconSpread = ({ className = 'layout-thumb-svg' }) => (
  <svg className={className} width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Left Page */}
    <rect x="0.75" y="1" width="8.5" height="13" rx="1" fill="#fdfbf7" stroke="currentColor" strokeWidth="1.2" />
    <line x1="2.5" y1="3.5" x2="7.5" y2="3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="2.5" y1="6" x2="7.5" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="2.5" y1="8.5" x2="7.5" y2="8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="2.5" y1="11" x2="6" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    {/* Right Page */}
    <rect x="10.75" y="1" width="8.5" height="13" rx="1" fill="#fdfbf7" stroke="currentColor" strokeWidth="1.2" />
    <line x1="12.5" y1="3.5" x2="17.5" y2="3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="12.5" y1="6" x2="17.5" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="12.5" y1="8.5" x2="17.5" y2="8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="12.5" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const LayoutIconTwoCol = ({ className = 'layout-thumb-svg' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="1.5" fill="#fdfbf7" stroke="currentColor" strokeWidth="1.2" />
    <line x1="2.8" y1="3.5" x2="6.8" y2="3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="2.8" y1="6" x2="6.8" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="2.8" y1="8.5" x2="6.8" y2="8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="2.8" y1="11" x2="5.5" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="9.2" y1="3.5" x2="13.2" y2="3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="9.2" y1="6" x2="13.2" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="9.2" y1="8.5" x2="13.2" y2="8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="9.2" y1="11" x2="11.8" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const LayoutIconSingleCol = ({ className = 'layout-thumb-svg' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="1.5" fill="#fdfbf7" stroke="currentColor" strokeWidth="1.2" />
    <line x1="3" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="3" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="3" y1="8.5" x2="13" y2="8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="3" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const ThemeIconParchment = ({ className = 'theme-thumb-svg' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 2.5C3.17 2.5 2.5 3.17 2.5 4C2.5 4.83 3.17 5.5 4 5.5H12C12.83 5.5 13.5 4.83 13.5 4C13.5 3.17 12.83 2.5 12 2.5H4Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M2.5 4V12C2.5 12.83 3.17 13.5 4 13.5H12C12.83 13.5 13.5 12.83 13.5 12V4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
    <line x1="5" y1="10.5" x2="9" y2="10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
  </svg>
);

export const ThemeIconRoyal = ({ className = 'theme-thumb-svg' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2.5 12.5H13.5V11L12.5 5.5L9.5 8L8 4L6.5 8L3.5 5.5L2.5 11V12.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="8" cy="4" r="0.75" fill="currentColor" />
    <circle cx="3.5" cy="5.5" r="0.75" fill="currentColor" />
    <circle cx="12.5" cy="5.5" r="0.75" fill="currentColor" />
    <line x1="4.5" y1="11" x2="11.5" y2="11" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
  </svg>
);

export const ThemeIconCrimson = ({ className = 'theme-thumb-svg' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2.5" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <line x1="5" y1="2" x2="5" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <path d="M8 2V8.5L9.5 7.2L11 8.5V2H8Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
  </svg>
);

export const ThemeIconGrimoire = ({ className = 'theme-thumb-svg' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 2.5C4 2.5 8 1.8 12 3V13.5C8 12.3 4 13 4 13V2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M4 2.5C4 2.5 2 3.5 2 5V14C2 14 3.5 13 4 13" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="8" cy="7.5" r="2" stroke="currentColor" strokeWidth="0.9" />
    <path d="M8 6V9M6.5 7.5H9.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);

export const ThemeIconWildwood = ({ className = 'theme-thumb-svg' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.5 2.5C13.5 2.5 8.5 3 5 6.5C2.5 9 2.5 12 3 13C4 13.5 7 13.5 9.5 11C13 7.5 13.5 2.5 13.5 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M13.5 2.5L3 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    <path d="M7.5 8.5C6 9 5 10 5 10" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
    <path d="M9.5 6.5C10 7.5 11 8.5 11 8.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const THEME_OPTIONS = [
  { value: 'parchment', label: 'Parchment', iconComponent: <ThemeIconParchment /> },
  { value: 'royal', label: 'Royal Archive', iconComponent: <ThemeIconRoyal /> },
  { value: 'crimson', label: 'Crimson Tome', iconComponent: <ThemeIconCrimson /> },
  { value: 'grimoire', label: 'Dark Grimoire', iconComponent: <ThemeIconGrimoire /> },
  { value: 'wildwood', label: 'Fey Wildwood', iconComponent: <ThemeIconWildwood /> }
];

const LAYOUT_OPTIONS = [
  { value: 'book-spread', label: 'Two-Page Facing Spread', iconComponent: <LayoutIconSpread /> },
  { value: 'two-column', label: 'Two-Column Page', iconComponent: <LayoutIconTwoCol /> },
  { value: 'single-column', label: 'Single Column', iconComponent: <LayoutIconSingleCol /> }
];

const NEW_BLOCK_DEFAULTS = {
  header: { level: 2, text: 'New Section Title', variant: 'standard', areaCode: 'U1' },
  paragraph: { text: 'The quill awaits your words...', hasDropCap: false },
  roll_table: {
    title: 'Chromatic Vault Encounters',
    diceFormula: 'd4',
    headers: ['d4', 'Encounter', 'Threat Rating'],
    rows: [
      ['1', 'Kobold Scout', 'Low'],
      ['2', 'Magmin Ore-Forger', 'Low'],
      ['3', 'Rogue Arcanist', 'Medium'],
      ['4', 'Brass Vault Golem', 'High']
    ]
  },
  quote: {
    text: 'Aeternum is all we know. It is all we have ever known. In these winding city streets beneath the gaslights, our lives run their courses...',
    author: 'Aaron Lyles, Prophet of Destruction'
  },
  side_by_side: {
    ratio: '50-50',
    left: { type: 'image', url: '/assets/images/races/human_merryn_portrait_bust.jpg', caption: 'Merryn Wave-Rider' },
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
    baseTraits: { size: 'Medium', baseSpeed: 30, baseHp: 25, baseMana: 15, languages: ["Wayfarer's Cant", 'Solari'], lifespan: '120-180 yrs' },
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
  image: { url: '/assets/images/races/human_merryn_portrait_bust.jpg', caption: '', alignment: 'center', frameStyle: 'gold-frame', crestLabel: '', sizePreset: 'full' },
  sketch_canvas: { title: 'Cartographic Sketch', caption: '', strokes: [], bgTheme: 'parchment' }
};

const INSERT_PALETTE = [
  { type: 'header', label: 'Heading', icon: 'fa-heading' },
  { type: 'paragraph', label: 'Prose', icon: 'fa-paragraph' },
  { type: 'roll_table', label: 'Table / Rolls', icon: 'fa-table' },
  { type: 'quote', label: 'Quote', icon: 'fa-quote-left' },
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
  { type: 'image', label: 'Art / Cutout', icon: 'fa-image' },
  { type: 'callout', label: 'Callout', icon: 'fa-bookmark' },
  { type: 'plot_thread', label: 'Plot Arc', icon: 'fa-diagram-project' },
  { type: 'map_embed', label: 'Map', icon: 'fa-map-location-dot' },
  { type: 'table_of_contents', label: 'Contents', icon: 'fa-list-ol' },
  { type: 'divider', label: 'Divider', icon: 'fa-minus' }
];

const EditableText = ({
  value,
  onCommit,
  onInputText,
  className = '',
  tagName = 'span',
  placeholder = '',
  disabled = false,
  singleLine = false,
  autoFocus = false
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== (value ?? '') && ref.current !== document.activeElement) {
      ref.current.textContent = value ?? '';
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus && ref.current && !disabled) {
      ref.current.focus();
      try {
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } catch (_) {}
    }
  }, [autoFocus, disabled]);

  const Tag = tagName;
  return (
    <Tag
      ref={ref}
      className={`book-editable ${className}`}
      contentEditable={!disabled}
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      onInput={(e) => {
        if (onInputText) {
          onInputText(e.currentTarget.textContent, e.currentTarget);
        }
      }}
      onBlur={(e) => {
        const next = e.currentTarget.textContent;
        if (next !== value) onCommit(next);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.currentTarget.textContent = value ?? '';
          e.currentTarget.blur();
        } else if (singleLine && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
};

export const ManuscriptDropdown = ({
  value,
  options = [],
  onChange,
  icon,
  title,
  ariaLabel,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div
      ref={containerRef}
      className={`manuscript-dropdown ${className} ${isOpen ? 'is-open' : ''}`}
      title={title}
    >
      <button
        type="button"
        className="manuscript-dropdown-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || title || selectedOption?.label || 'Select option'}
      >
        {selectedOption?.iconComponent ? (
          <span className="dropdown-custom-icon">{selectedOption.iconComponent}</span>
        ) : (
          (selectedOption?.icon || icon) && <i className={`${selectedOption?.icon || icon} dropdown-icon`}></i>
        )}
        <span className="dropdown-trigger-label">{selectedOption?.label || value}</span>
        <i className={`fas fa-chevron-down dropdown-arrow ${isOpen ? 'open' : ''}`}></i>
      </button>

      {isOpen && (
        <ul className="manuscript-dropdown-menu" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`manuscript-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <div className="item-main">
                  {opt.iconComponent ? (
                    <span className="dropdown-custom-icon item-icon-wrapper">{opt.iconComponent}</span>
                  ) : (
                    opt.icon && <i className={`${opt.icon} item-icon`}></i>
                  )}
                  <span className="item-label">{opt.label}</span>
                </div>
                {isSelected && <i className="fas fa-check item-check"></i>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const BookDocumentEditor = ({
  bookId = null,
  initialDoc = null,
  isGM = true,
  allowWrite = true,
  allowPrint = true,
  inGameSession = false,
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
  const flowPageOverflow = useBookStore((s) => s.flowPageOverflow);
  const addCustomTerm = useBookStore((s) => s.addCustomTerm);
  const updateCustomTerm = useBookStore((s) => s.updateCustomTerm);
  const deleteCustomTerm = useBookStore((s) => s.deleteCustomTerm);
  const createRevisionSnapshot = useBookStore((s) => s.createRevisionSnapshot);
  const deleteRevisionSnapshot = useBookStore((s) => s.deleteRevisionSnapshot);
  const restoreRevisionSnapshot = useBookStore((s) => s.restoreRevisionSnapshot);
  const syncToCloud = useBookStore((s) => s.syncToCloud);
  const authUser = useAuthStore((s) => s.user);
  const isPhone = useIsPhone();

  const book = useMemo(() => normalizeBook(rawBook || initialDoc), [rawBook, initialDoc]);

  // Navigation State
  const [activeChapterId, setActiveChapterId] = useState(() => book.chapters[0]?.id || 'ch-1');
  const [activePageId, setActivePageId] = useState(() => book.chapters[0]?.pages[0]?.id || 'pg-1');

  // Mode: 'write' | 'read' — in-game sessions and phones are reader-only (authoring is purely in /account on desktop/tablet).
  const canWrite = Boolean(allowWrite && !inGameSession && !isPhone);
  const [activeMode, setActiveMode] = useState(() => (canWrite && isGM ? 'write' : 'read'));
  useEffect(() => {
    if (!canWrite && activeMode === 'write') setActiveMode('read');
  }, [canWrite, activeMode]);
  const [activeSidebarTab, setActiveSidebarTab] = useState('toc'); // 'toc' | 'structure' | 'search' | 'history' | 'styling'
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth > 768 : true));
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [headerSettingsOpen, setHeaderSettingsOpen] = useState(false);
  const [showCampaignImporter, setShowCampaignImporter] = useState(false);
  const [inlineAutocomplete, setInlineAutocomplete] = useState(null); // { mode: 'wiki' | 'slash', query: '', blockId, pageId, x, y }
  const [saveState, setSaveState] = useState('idle');
  const [draggingBlockId, setDraggingBlockId] = useState(null);
  const [dragOverInfo, setDragOverInfo] = useState(null); // { targetBlockId, targetIndex, position, railIndex, colName, pageId }

  // Insertion & Pickers State
  const [insertAt, setInsertAt] = useState(null); // { index, column, slotAlign, sizePreset, x, y } — x/y are click viewport coords
  const insertPopoverRef = useRef(null);
  const [insertPopoverPos, setInsertPopoverPos] = useState(null); // { key, left, top } clamped to the viewport
  const [entities, setEntities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep the insert palette fully on-screen: open at the click point, then
  // measure it and nudge it back inside the viewport so every option is reachable.
  useLayoutEffect(() => {
    if (!insertAt) {
      setInsertPopoverPos(null);
      return;
    }
    const el = insertPopoverRef.current;
    const { left, top } = clampPopoverPosition({
      x: insertAt.x,
      y: insertAt.y,
      width: el ? el.offsetWidth : 0,
      height: el ? el.offsetHeight : 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    });
    setInsertPopoverPos({ key: insertAt, left, top });
  }, [insertAt]);

  // Floating formatting bubble when text is selected in an editable paragraph
  const [selectionBubble, setSelectionBubble] = useState(null);
  const [showSyntaxGuide, setShowSyntaxGuide] = useState(false);

  // Global escape key clears active component selection and insert palettes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (inlineAutocomplete) setInlineAutocomplete(null);
        if (showSyntaxGuide) setShowSyntaxGuide(false);
        if (selectionBubble) setSelectionBubble(null);
        if (insertAt) setInsertAt(null);
        if (editingBlockId) setEditingBlockId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [insertAt, editingBlockId, showSyntaxGuide, selectionBubble, inlineAutocomplete]);

  // Selection change listener to detect highlighted text in editable prose
  useEffect(() => {
    const handleSelectionChange = () => {
      if (activeMode !== 'write' || !canWrite || showSyntaxGuide) {
        setSelectionBubble(null);
        return;
      }

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        setSelectionBubble(null);
        return;
      }

      const range = sel.getRangeAt(0);
      const commonAncestor = range.commonAncestorContainer;
      const proseEl = commonAncestor?.nodeType === 1 
        ? commonAncestor.closest('.book-prose-edit') 
        : commonAncestor?.parentElement?.closest('.book-prose-edit');

      if (!proseEl) {
        setSelectionBubble(null);
        return;
      }

      const blockWrap = proseEl.closest('.book-block-wrap');
      const blockId = blockWrap?.dataset?.blockId;

      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const selText = sel.toString().trim();
        if (selText.length > 0) {
          setSelectionBubble({
            x: rect.left + rect.width / 2,
            y: rect.top - 6,
            selectedText: selText,
            blockId,
            rect: {
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom
            }
          });
          return;
        }
      }
      setSelectionBubble(null);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [activeMode, canWrite, showSyntaxGuide]);

  // Auto-dismiss selection bubble when cursor moves away, on click outside, or on scroll
  useEffect(() => {
    if (!selectionBubble) return;

    const handlePointerMove = (e) => {
      const { clientX, clientY } = e;
      const bx = selectionBubble.x;
      const by = selectionBubble.y;
      const rect = selectionBubble.rect;

      const minX = Math.min(bx - 160, (rect?.left || bx) - 60);
      const maxX = Math.max(bx + 160, (rect?.right || bx) + 60);
      const minY = Math.min(by - 65, (rect?.top || by) - 45);
      const maxY = Math.max(by + 45, (rect?.bottom || by) + 65);

      if (clientX < minX || clientX > maxX || clientY < minY || clientY > maxY) {
        setSelectionBubble(null);
      }
    };

    const handlePointerDown = (e) => {
      if (e.target.closest('.book-selection-bubble')) return;
      setSelectionBubble(null);
    };

    const handleScroll = () => {
      setSelectionBubble(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [selectionBubble]);

  const formatSelection = (prefix, suffix) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const selText = sel.toString();
    if (!selText) return;
    const formatted = `${prefix}${selText}${suffix}`;

    const proseEl = range.commonAncestorContainer?.nodeType === 1
      ? range.commonAncestorContainer.closest('.book-prose-edit')
      : range.commonAncestorContainer?.parentElement?.closest('.book-prose-edit');

    if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, formatted);
    } else {
      range.deleteContents();
      range.insertNode(document.createTextNode(formatted));
    }

    if (proseEl) {
      const blockWrap = proseEl.closest('.book-block-wrap');
      const blockId = blockWrap?.dataset?.blockId || selectionBubble?.blockId || editingBlockId;
      if (blockId) {
        updateBlock(blockId, { text: proseEl.textContent }, currentPage?.id);
      }
    }

    setSelectionBubble(null);
  };

  const handleInsertSyntaxSnippet = (snippet) => {
    if (editingBlockId && currentPage) {
      const targetBlock = (currentPage.blocks || []).find((b) => b.id === editingBlockId);
      if (targetBlock) {
        const newText = targetBlock.text ? `${targetBlock.text}\n\n${snippet}` : snippet;
        updateBlock(editingBlockId, { text: newText }, currentPage.id);
        setShowSyntaxGuide(false);
        return;
      }
    }

    if (currentPage && canWrite) {
      addBlock('paragraph', null, { text: snippet }, currentPage.id);
      setShowSyntaxGuide(false);
    }
  };

  // Specialized Modals Targets
  const [imagePickerTarget, setImagePickerTarget] = useState(null); // { block, index, column, slotAlign, sizePreset }
  const [itemStudioTarget, setItemStudioTarget] = useState(null); // { block, index, column, slotAlign, sizePreset, customCallback }
  const [creatureStudioTarget, setCreatureStudioTarget] = useState(null); // { block, index, column, slotAlign, sizePreset, customCallback }
  const [spellStudioTarget, setSpellStudioTarget] = useState(null); // { block, index, column, slotAlign, sizePreset, customCallback }
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

  const mutatePageBlocks = (updater, targetPageId = null) => {
    if (!bookId || !currentChapter) return;
    const pageIdToUse = targetPageId || activePageId;
    const targetPage = currentChapter.pages.find((p) => p.id === pageIdToUse) || currentPage;
    if (!targetPage) return;
    const currentBlocks = targetPage.blocks || [];
    const nextBlocks = typeof updater === 'function' ? updater(currentBlocks) : updater;
    setPageBlocks(bookId, currentChapter.id, targetPage.id, nextBlocks);
  };

  const addBlock = (type, index = null, overrides = {}, targetPageId = null) => {
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
    }, targetPageId);

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
      updateBlock(imagePickerTarget.block.id, formatted, imagePickerTarget.pageId);
    } else if (imagePickerTarget?.index !== undefined) {
      addBlock('image', imagePickerTarget.index, {
        ...formatted,
        ...(imagePickerTarget.column ? { column: imagePickerTarget.column } : {}),
        ...(imagePickerTarget.slotAlign ? {
          slotAlign: imagePickerTarget.slotAlign,
          sizePreset: 'half',
          alignment: 'center'
        } : {})
      }, imagePickerTarget.pageId);
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
      updateBlock(itemStudioTarget.block.id, payload, itemStudioTarget.pageId);
    } else if (itemStudioTarget?.index !== undefined) {
      addBlock('item_card', itemStudioTarget.index, {
        ...payload,
        ...(itemStudioTarget.column ? { column: itemStudioTarget.column } : {}),
        ...(itemStudioTarget.slotAlign ? { slotAlign: itemStudioTarget.slotAlign, sizePreset: 'half' } : {})
      }, itemStudioTarget.pageId);
    }
    setItemStudioTarget(null);
  };

  const handleSaveCreatureBlock = (creatureData) => {
    if (creatureStudioTarget?.customCallback) {
      creatureStudioTarget.customCallback(creatureData);
    } else if (creatureStudioTarget?.block) {
      updateBlock(creatureStudioTarget.block.id, creatureData, creatureStudioTarget.pageId);
    } else if (creatureStudioTarget?.index !== undefined) {
      addBlock('creature_statblock', creatureStudioTarget.index, {
        ...creatureData,
        ...(creatureStudioTarget.column ? { column: creatureStudioTarget.column } : {}),
        ...(creatureStudioTarget.slotAlign ? { slotAlign: creatureStudioTarget.slotAlign, sizePreset: 'half' } : {})
      }, creatureStudioTarget.pageId);
    }
    setCreatureStudioTarget(null);
  };

  const handleSaveSpellBlock = (spellData) => {
    const payload = {
      ...spellData,
      type: 'spell_formula'
    };
    if (spellStudioTarget?.customCallback) {
      spellStudioTarget.customCallback(payload);
    } else if (spellStudioTarget?.block?.id) {
      updateBlock(spellStudioTarget.block.id, payload, spellStudioTarget.pageId);
    } else if (spellStudioTarget?.index !== undefined) {
      addBlock('spell_formula', spellStudioTarget.index, {
        ...payload,
        ...(spellStudioTarget.column ? { column: spellStudioTarget.column } : {}),
        ...(spellStudioTarget.slotAlign ? { slotAlign: spellStudioTarget.slotAlign, sizePreset: 'half' } : {})
      }, spellStudioTarget.pageId);
    }
    setSpellStudioTarget(null);
  };

  const handleProseLiveInput = (liveText, el, blockId, pageId) => {
    const str = String(liveText || '');
    const rect = el ? el.getBoundingClientRect() : { left: 200, bottom: 200 };

    // 1. Check for [[wikilink autocomplete
    const wikiMatch = str.match(/\[\[([^[\]]{0,36})$/);
    if (wikiMatch) {
      setInlineAutocomplete({
        mode: 'wiki',
        query: wikiMatch[1] || '',
        rawText: str,
        blockId,
        pageId,
        x: Math.min(window.innerWidth - 300, Math.max(20, rect.left + 24)),
        y: Math.min(window.innerHeight - 260, Math.max(40, rect.bottom + 4))
      });
      return;
    }

    // 2. Check for /slash command at start of paragraph
    const slashMatch = str.match(/^\/([a-zA-Z0-9 _-]{0,24})$/);
    if (slashMatch) {
      setInlineAutocomplete({
        mode: 'slash',
        query: (slashMatch[1] || '').trim(),
        rawText: str,
        blockId,
        pageId,
        x: Math.min(window.innerWidth - 300, Math.max(20, rect.left + 16)),
        y: Math.min(window.innerHeight - 260, Math.max(40, rect.bottom + 4))
      });
      return;
    }

    if (inlineAutocomplete) {
      setInlineAutocomplete(null);
    }
  };

  const autocompleteItems = useMemo(() => {
    if (!inlineAutocomplete) return [];
    const q = (inlineAutocomplete.query || '').toLowerCase();

    if (inlineAutocomplete.mode === 'slash') {
      return INSERT_PALETTE.filter((item) =>
        !q || item.label.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
      ).slice(0, 8);
    }

    // Wiki-link suggestions: Glossary terms, World Entities, Book Chapters, Creatures, Spells
    const pool = [];
    (book.customTerms || []).forEach((t) => {
      if (t.term) pool.push({ name: t.term, category: t.category || 'Glossary', icon: 'fa-book-bookmark' });
    });
    (entities || []).forEach((e) => {
      if (e.name) pool.push({ name: e.name, category: e.type || 'Lore Entity', icon: e.icon || 'fa-scroll' });
    });
    (book.chapters || []).forEach((ch) => {
      if (ch.title) pool.push({ name: ch.title, category: 'Chapter', icon: 'fa-feather' });
    });
    CREATURE_PRESETS.forEach((c) => {
      pool.push({ name: c.name, category: 'Bestiary', icon: 'fa-dragon' });
    });
    SPELL_PRESETS.forEach((s) => {
      pool.push({ name: s.name, category: 'Grimoire', icon: 'fa-wand-magic-sparkles' });
    });

    const seen = new Set();
    return pool
      .filter((item) => {
        const key = item.name.toLowerCase();
        if (seen.has(key)) return false;
        if (q && !key.includes(q) && !String(item.category).toLowerCase().includes(q)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 8);
  }, [inlineAutocomplete, book.customTerms, book.chapters, entities]);

  const handleSaveQuestBlock = (questData) => {
    const payload = {
      ...questData,
      type: 'quest_hook'
    };
    if (questPickerTarget?.customCallback) {
      questPickerTarget.customCallback(payload);
    } else if (questPickerTarget?.block?.id) {
      updateBlock(questPickerTarget.block.id, payload, questPickerTarget.pageId);
    } else if (questPickerTarget?.index !== undefined) {
      addBlock('quest_hook', questPickerTarget.index, {
        ...payload,
        ...(questPickerTarget.column ? { column: questPickerTarget.column } : {}),
        ...(questPickerTarget.slotAlign ? { slotAlign: questPickerTarget.slotAlign, sizePreset: 'half' } : {})
      }, questPickerTarget.pageId);
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
      updateBlock(mapPickerTarget.block.id, payload, mapPickerTarget.pageId);
    } else if (mapPickerTarget?.index !== undefined) {
      addBlock('map_embed', mapPickerTarget.index, {
        ...payload,
        ...(mapPickerTarget.column ? { column: mapPickerTarget.column } : {}),
        ...(mapPickerTarget.slotAlign ? { slotAlign: mapPickerTarget.slotAlign, sizePreset: 'half' } : {})
      }, mapPickerTarget.pageId);
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
          baseTraits: loreData.raw?.baseTraits || { size: 'Medium', baseSpeed: 30, baseHp: 25, baseMana: 15, languages: ["Wayfarer's Cant"], lifespan: '60-100 yrs' },
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

  const updateBlock = (blockId, updates, targetPageId = null) => {
    mutatePageBlocks((blocks) =>
      blocks.map((b) => (b.id === blockId ? { ...b, ...updates, id: b.id, type: b.type } : b)),
      targetPageId
    );
  };

  const moveBlockInColumn = (blockId, direction, targetPageId = null) => {
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
    }, targetPageId);
  };

  const moveBlockToIndex = (sourceBlockId, targetIndex, targetColumn = null, targetPageId = null) => {
    mutatePageBlocks((blocks) => {
      const fromIdx = blocks.findIndex((b) => b.id === sourceBlockId);
      if (fromIdx === -1) return blocks;
      const blockToMove = { ...blocks[fromIdx] };
      if (targetColumn) {
        blockToMove.column = targetColumn;
      }
      const next = [...blocks];
      next.splice(fromIdx, 1);
      const adjustedTarget = fromIdx < targetIndex ? targetIndex - 1 : targetIndex;
      const finalIndex = Math.max(0, Math.min(next.length, adjustedTarget));
      next.splice(finalIndex, 0, blockToMove);
      return next;
    }, targetPageId);
  };

  const deleteBlock = (blockId, targetPageId = null) => {
    mutatePageBlocks((blocks) => blocks.filter((b) => b.id !== blockId), targetPageId);
  };

  const navigateTo = ({ chapterId, pageId }) => {
    if (chapterId) setActiveChapterId(chapterId);
    if (pageId) setActivePageId(pageId);
    setEditingBlockId(null);
    setInsertAt(null);
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

  const isSpreadLayout = book.layout === 'book-spread' || book.layout === 'spread' || currentPage?.layout === 'book-spread' || currentPage?.layout === 'spread';
  const currentLayout = isSpreadLayout ? 'book-spread' : (currentPage?.layout || book.layout || 'two-column');
  const isTwoColumn = currentLayout === 'two-column';
  const isWrite = activeMode === 'write';

  const chapterPages = currentChapter?.pages || [];
  const currentChapterPageIdx = Math.max(0, chapterPages.findIndex((p) => p.id === activePageId));
  const spreadPairLeftIdx = Math.floor(currentChapterPageIdx / 2) * 2;
  const spreadLeftPage = chapterPages[spreadPairLeftIdx] || chapterPages[0] || null;
  const spreadRightPage = chapterPages[spreadPairLeftIdx + 1] || null;

  const totalBookPages = Math.max(1, allPagesList.length);
  const currentBookPageNum = Math.max(1, currentPageIndex >= 0 ? currentPageIndex + 1 : (currentPage?.pageNumber || 1));
  const spreadLeftIdxInAll = allPagesList.findIndex((p) => p.pageId === spreadLeftPage?.id);
  const spreadLeftBookPageNum = spreadLeftIdxInAll >= 0 ? spreadLeftIdxInAll + 1 : 1;
  const spreadRightIdxInAll = spreadRightPage ? allPagesList.findIndex((p) => p.pageId === spreadRightPage.id) : -1;
  const spreadRightBookPageNum = spreadRightIdxInAll >= 0 ? spreadRightIdxInAll + 1 : (spreadRightPage ? spreadLeftBookPageNum + 1 : spreadLeftBookPageNum);

  const handlePrevPage = () => {
    if (isSpreadLayout) {
      if (spreadPairLeftIdx >= 2) {
        navigateTo({ chapterId: activeChapterId, pageId: chapterPages[spreadPairLeftIdx - 2].id });
      } else {
        const chIdx = book.chapters.findIndex((c) => c.id === activeChapterId);
        if (chIdx > 0) {
          const prevCh = book.chapters[chIdx - 1];
          const prevPages = prevCh.pages || [];
          if (prevPages.length > 0) {
            const lastSpreadLeft = Math.floor(Math.max(0, prevPages.length - 1) / 2) * 2;
            navigateTo({ chapterId: prevCh.id, pageId: prevPages[lastSpreadLeft].id });
          }
        }
      }
    } else {
      if (currentPageIndex > 0) {
        const prev = allPagesList[currentPageIndex - 1];
        navigateTo(prev);
      }
    }
  };

  const handleNextPage = () => {
    if (isSpreadLayout) {
      const nextSpreadIdx = spreadPairLeftIdx + 2;
      if (nextSpreadIdx < chapterPages.length) {
        navigateTo({ chapterId: activeChapterId, pageId: chapterPages[nextSpreadIdx].id });
      } else {
        const chIdx = book.chapters.findIndex((c) => c.id === activeChapterId);
        if (chIdx < book.chapters.length - 1) {
          const nextCh = book.chapters[chIdx + 1];
          if (nextCh.pages && nextCh.pages.length > 0) {
            navigateTo({ chapterId: nextCh.id, pageId: nextCh.pages[0].id });
          }
        }
      }
    } else {
      if (currentPageIndex < allPagesList.length - 1) {
        const next = allPagesList[currentPageIndex + 1];
        navigateTo(next);
      }
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

    const pageId = colContext.pageId || currentPage?.id;
    const currentBlockCol = block.column || colContext.colName || 'left';
    const isRightHalf = colContext.isHalfSlot === 'right' || block.slotAlign === 'right';
    const isLeftHalf = !isRightHalf && (colContext.isHalfSlot === 'left' || block.slotAlign === 'left' || (block.sizePreset === 'half' && block.alignment !== 'float-right'));
    const isFullCol = !colContext.isHalfSlot && (block.sizePreset === 'full' || (!block.slotAlign && !block.sizePreset)) && block.alignment !== 'float-left' && block.alignment !== 'float-right';
    const isFloatLeft = block.alignment === 'float-left';
    const isFloatRight = block.alignment === 'float-right';

    const setBlockColumn = (colVal, e) => {
      e.stopPropagation();
      updateBlock(block.id, { column: colVal }, pageId);
    };

    const setBlockSlotAlign = (slotVal, e) => {
      e.stopPropagation();
      if (slotVal === 'left') {
        updateBlock(block.id, { slotAlign: 'left', sizePreset: 'half', alignment: 'full' }, pageId);
      } else if (slotVal === 'right') {
        updateBlock(block.id, { slotAlign: 'right', sizePreset: 'half', alignment: 'full' }, pageId);
      } else if (slotVal === 'full') {
        updateBlock(block.id, { slotAlign: 'full', sizePreset: 'full', alignment: 'full' }, pageId);
      } else if (slotVal === 'float-left') {
        updateBlock(block.id, { slotAlign: 'full', sizePreset: 'full', alignment: 'float-left' }, pageId);
      } else if (slotVal === 'float-right') {
        updateBlock(block.id, { slotAlign: 'full', sizePreset: 'full', alignment: 'float-right' }, pageId);
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
        {/* Drag Handle */}
        <div
          className="ctrl-btn drag-handle-btn"
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            e.dataTransfer.setData('text/plain', block.id);
            e.dataTransfer.effectAllowed = 'move';

            const wrapEl = e.currentTarget.closest('.book-block-wrap');
            if (wrapEl && e.dataTransfer.setDragImage) {
              const rect = wrapEl.getBoundingClientRect();
              const offsetX = Math.min(Math.max(20, e.clientX - rect.left), Math.max(20, rect.width / 2));
              const offsetY = Math.min(Math.max(15, e.clientY - rect.top), 40);
              e.dataTransfer.setDragImage(wrapEl, offsetX, offsetY);
            }

            // Defer placeholder state so browser captures crisp, full-color block card as ghost
            setTimeout(() => {
              setDraggingBlockId(block.id);
            }, 10);
          }}
          onDragEnd={() => {
            setDraggingBlockId(null);
            setDragOverInfo(null);
          }}
          title="Drag to reorder block anywhere on the folio"
        >
          <i className="fas fa-grip-vertical"></i>
        </div>

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
            title="Place on Left Side (½ width) — Opens companion space on the right"
          >
            <span className="icon-glyph">◧</span>
          </button>
          <button
            type="button"
            className={`ctrl-btn icon-only ${isRightHalf ? 'active' : ''}`}
            onClick={(e) => setBlockSlotAlign('right', e)}
            title="Place on Right Side (½ width) — Opens companion space on the left"
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

        {/* Drop Cap Toggle & TTRPG Formatting for Paragraphs */}
        {block.type === 'paragraph' && (
          <>
            <div className="ctrl-divider" />
            <div className="ctrl-group type-spec-group">
              <button
                type="button"
                className={`ctrl-btn icon-only drop-cap-btn ${block.hasDropCap ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  updateBlock(block.id, { hasDropCap: !block.hasDropCap }, pageId);
                }}
                title={block.hasDropCap ? "Turn off Drop Cap" : "Add Thematic Illuminated Drop Cap"}
                aria-label="Toggle illuminated drop cap"
              >
                <span className="btn-drop-cap-glyph">𝕭</span>
                <span className="btn-label-text">Drop Cap</span>
              </button>

              <button
                type="button"
                className={`ctrl-btn icon-only lead-in-btn ${/^\*\*[^*]+\*\*/.test(block.text || '') ? 'active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  const sel = window.getSelection();
                  const selText = sel ? sel.toString().trim() : '';
                  if (selText.length > 0) {
                    if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
                      document.execCommand('insertText', false, `**${selText}** `);
                    }
                    return;
                  }
                  const curText = block.text || '';
                  if (/^\*\*[^*]+\*\*\s*/.test(curText)) {
                    updateBlock(block.id, { text: curText.replace(/^\*\*[^*]+\*\*\s*/, '') }, pageId);
                  } else {
                    updateBlock(block.id, { text: `**Section Title.** ${curText.trimStart()}` }, pageId);
                  }
                }}
                title="Bold Lead-In (**Title.**) — Standard TTRPG adventure run-in heading (e.g. **Floor Trap.**)"
                aria-label="Format bold lead-in heading"
              >
                <span className="btn-bold-glyph">**B**</span>
                <span className="btn-label-text">Lead-in</span>
              </button>

              <button
                type="button"
                className="ctrl-btn icon-only lore-link-btn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  const sel = window.getSelection();
                  const selText = sel ? sel.toString().trim() : '';
                  if (selText.length > 0) {
                    if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
                      document.execCommand('insertText', false, `[[${selText}]]`);
                    }
                    return;
                  }
                  const curText = block.text || '';
                  updateBlock(block.id, { text: curText ? `${curText} [[Entity Name]]` : '[[Entity Name]]' }, pageId);
                }}
                title="Lore Wiki-Link ([[Entity]]) — Interactive entity link with hovercard (e.g. [[Chromatic Keystone]])"
                aria-label="Insert lore wiki-link"
              >
                <span className="btn-wikilink-glyph">[[&thinsp;]]</span>
                <span className="btn-label-text">Lore</span>
              </button>

              <button
                type="button"
                className="ctrl-btn icon-only syntax-guide-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSyntaxGuide(true);
                }}
                title="TTRPG Manuscript Syntax Guide & Cheatsheet"
                aria-label="Open manuscript syntax guide"
              >
                <i className="fas fa-circle-info"></i>
                <span className="btn-label-text">Guide</span>
              </button>
            </div>
          </>
        )}

        {/* Header Style Variants for Headings */}
        {block.type === 'header' && (
          <>
            <div className="ctrl-divider" />
            <div className="ctrl-group header-variants-group">
              <button
                type="button"
                className={`ctrl-btn icon-only ${(block.variant || 'standard') === 'standard' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  updateBlock(block.id, { variant: 'standard' }, pageId);
                }}
                title="Standard Title"
              >
                <span className="btn-col-badge">H{block.level || 2}</span>
              </button>
              <button
                type="button"
                className={`ctrl-btn icon-only ${block.variant === 'banner-dark' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  updateBlock(block.id, { variant: 'banner-dark' }, pageId);
                }}
                title="Dark Onyx Chapter Banner"
              >
                <i className="fas fa-heading"></i>
              </button>
              <button
                type="button"
                className={`ctrl-btn icon-only ${block.variant === 'banner-crimson' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  updateBlock(block.id, { variant: 'banner-crimson' }, pageId);
                }}
                title="Crimson Ribbon Banner"
              >
                <i className="fas fa-bookmark"></i>
              </button>
              <button
                type="button"
                className={`ctrl-btn icon-only ${block.variant === 'keyed-area' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  updateBlock(block.id, { variant: 'keyed-area', areaCode: block.areaCode || 'U1' }, pageId);
                }}
                title="Keyed Dungeon Area Badge"
              >
                <span className="btn-col-badge">Key</span>
              </button>
            </div>
          </>
        )}

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
            onClick={() => moveBlockInColumn(block.id, -1, pageId)}
            title="Move block up"
          >
            <i className="fas fa-chevron-up"></i>
          </button>
          <button
            type="button"
            className="ctrl-btn icon-only move-btn"
            disabled={isLastInCol && currentBlockCol === 'right'}
            onClick={() => moveBlockInColumn(block.id, 1, pageId)}
            title="Move block down"
          >
            <i className="fas fa-chevron-down"></i>
          </button>
          <button
            type="button"
            className="ctrl-btn icon-only delete-btn"
            onClick={() => deleteBlock(block.id, pageId)}
            title="Delete block"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    );
  };

  // Insert rail between blocks
  const InsertRail = ({ index, isFirst = false, pageId = null, colName = null }) => {
    if (activeMode === 'read') return null;

    const isTarget = dragOverInfo && dragOverInfo.railIndex === index && (!colName || dragOverInfo.colName === colName);

    return (
      <div
        className={`book-insert-rail ${isFirst ? 'is-first' : ''} ${draggingBlockId ? 'drag-active' : ''} ${isTarget ? 'drop-target-hover' : ''}`}
        onDragOver={(e) => {
          if (!draggingBlockId) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (!isTarget) {
            setDragOverInfo({ railIndex: index, colName, pageId });
          }
        }}
        onDragLeave={() => {
          if (dragOverInfo?.railIndex === index && dragOverInfo?.colName === colName) {
            setDragOverInfo(null);
          }
        }}
        onDrop={(e) => {
          if (!draggingBlockId) return;
          e.preventDefault();
          e.stopPropagation();
          const sourceId = draggingBlockId;
          setDraggingBlockId(null);
          setDragOverInfo(null);
          moveBlockToIndex(sourceId, index, colName, pageId);
        }}
      >
        <button
          type="button"
          className="book-insert-btn"
          title="Insert new block here"
          onClick={(e) => {
            e.stopPropagation();
            setInsertAt({ index, column: colName, pageId: pageId || currentPage?.id, x: e.clientX, y: e.clientY });
          }}
        >
          <i className="fas fa-plus"></i>
        </button>
        {draggingBlockId && (
          <div className="drag-indicator-bar">
            <span className="drag-indicator-text">Drop here</span>
          </div>
        )}
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

    const isDropBefore = dragOverInfo?.targetBlockId === block.id && dragOverInfo?.position === 'before';
    const isDropAfter = dragOverInfo?.targetBlockId === block.id && dragOverInfo?.position === 'after';
    const isBeingDragged = draggingBlockId === block.id;

    const wrap = (children) => (
      <div
        key={block.id}
        data-block-id={block.id}
        className={`book-block-wrap type-${block.type} align-${currentAlign} size-${currentSize} ${slotClass} ${isFloating ? 'is-floating' : ''} ${isHalf ? 'is-half-width' : ''} ${isEditing ? 'editing selected is-selected' : ''} ${isBeingDragged ? 'is-dragging' : ''} ${isDropBefore ? 'drop-target-before' : ''} ${isDropAfter ? 'drop-target-after' : ''}`}
        onClick={(e) => {
          if (effectiveIsWrite) {
            e.stopPropagation();
            setEditingBlockId(block.id);
          }
        }}
        onDragOver={(e) => {
          if (!draggingBlockId || draggingBlockId === block.id) return;
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'move';

          const rect = e.currentTarget.getBoundingClientRect();
          const mouseY = e.clientY;
          const isTopHalf = mouseY < rect.top + rect.height / 2;
          const position = isTopHalf ? 'before' : 'after';

          if (!dragOverInfo || dragOverInfo.targetBlockId !== block.id || dragOverInfo.position !== position) {
            setDragOverInfo({
              targetBlockId: block.id,
              targetIndex: index,
              position,
              colName: colContext.colName || block.column || 'left',
              pageId: colContext.pageId || currentPage?.id
            });
          }
        }}
        onDragLeave={(e) => {
          if (dragOverInfo?.targetBlockId === block.id && !e.currentTarget.contains(e.relatedTarget)) {
            setDragOverInfo(null);
          }
        }}
        onDrop={(e) => {
          if (!draggingBlockId || draggingBlockId === block.id) return;
          e.preventDefault();
          e.stopPropagation();

          const sourceId = draggingBlockId;
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseY = e.clientY;
          const isTopHalf = mouseY < rect.top + rect.height / 2;
          const targetIndex = isTopHalf ? index : index + 1;
          const targetCol = colContext.colName || block.column || 'left';
          const pageId = colContext.pageId || currentPage?.id;

          setDraggingBlockId(null);
          setDragOverInfo(null);
          moveBlockToIndex(sourceId, targetIndex, targetCol, pageId);
        }}
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
        const variant = block.variant || 'standard';
        const pageId = colContext.pageId || currentPage?.id;

        const renderHeaderBody = () => {
          if (variant === 'banner-dark') {
            return (
              <div className="book-heading-banner-dark">
                <EditableText
                  className="book-heading-text"
                  value={block.text}
                  disabled={!effectiveIsWrite}
                  placeholder="Dark Banner Title (e.g. The Endless City)..."
                  onCommit={(text) => updateBlock(block.id, { text }, pageId)}
                />
              </div>
            );
          }
          if (variant === 'banner-crimson') {
            return (
              <div className="book-heading-banner-crimson">
                <span className="banner-crimson-icon"><i className="fas fa-bookmark"></i></span>
                <EditableText
                  className="book-heading-text"
                  value={block.text}
                  disabled={!effectiveIsWrite}
                  placeholder="Crimson Ribbon Title..."
                  onCommit={(text) => updateBlock(block.id, { text }, pageId)}
                />
              </div>
            );
          }
          if (variant === 'keyed-area') {
            return (
              <div className="book-heading-keyed-area" data-area-code={block.areaCode || 'U1'}>
                <span className="keyed-room-badge" title={effectiveIsWrite ? "Click to edit room code (e.g. U1, 2A)" : undefined}>
                  {effectiveIsWrite ? (
                    <EditableText
                      className="keyed-badge-editable"
                      value={block.areaCode || 'U1'}
                      disabled={!effectiveIsWrite}
                      placeholder="U1"
                      onCommit={(areaCode) => updateBlock(block.id, { areaCode }, pageId)}
                    />
                  ) : (
                    block.areaCode || 'U1'
                  )}
                </span>
                <span className="keyed-room-name">
                  <EditableText
                    className="book-heading-text"
                    value={block.text}
                    disabled={!effectiveIsWrite}
                    placeholder="Area Name (e.g. Entrance Well)..."
                    onCommit={(text) => updateBlock(block.id, { text }, pageId)}
                  />
                </span>
              </div>
            );
          }
          return (
            <HeadingTag className={`book-heading-${level} variant-standard`}>
              <EditableText
                value={block.text}
                disabled={!effectiveIsWrite}
                placeholder="Heading text..."
                onCommit={(text) => updateBlock(block.id, { text }, pageId)}
              />
            </HeadingTag>
          );
        };

        return wrap(
          <div className={`book-heading-container variant-${variant}`}>
            {renderHeaderBody()}
            {effectiveIsWrite && (
              <div className="heading-variant-toolbar" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className={`heading-var-chip ${variant === 'standard' ? 'active' : ''}`}
                  onClick={() => updateBlock(block.id, { variant: 'standard' }, pageId)}
                  title="Standard Chapter Heading"
                >
                  Standard
                </button>
                <button
                  type="button"
                  className={`heading-var-chip ${variant === 'banner-dark' ? 'active' : ''}`}
                  onClick={() => updateBlock(block.id, { variant: 'banner-dark' }, pageId)}
                  title="Dark Onyx Chapter Banner"
                >
                  Dark Banner
                </button>
                <button
                  type="button"
                  className={`heading-var-chip ${variant === 'banner-crimson' ? 'active' : ''}`}
                  onClick={() => updateBlock(block.id, { variant: 'banner-crimson' }, pageId)}
                  title="Crimson Ribbon Banner"
                >
                  Crimson Ribbon
                </button>
                <button
                  type="button"
                  className={`heading-var-chip ${variant === 'keyed-area' ? 'active' : ''}`}
                  onClick={() => updateBlock(block.id, { variant: 'keyed-area', areaCode: block.areaCode || 'U1' }, pageId)}
                  title="Keyed Dungeon / Location Area with Room Number Badge"
                >
                  Keyed Area
                </button>
              </div>
            )}
          </div>
        );
      }

      case 'paragraph': {
        const hasDropCap = !!block.hasDropCap;
        const text = block.text ?? block.content ?? '';
        const firstCharMatch = text.match(/\S/);
        const firstCharIdx = firstCharMatch ? firstCharMatch.index : -1;
        const firstLetter = firstCharIdx >= 0 ? text[firstCharIdx] : '';
        const restText = firstCharIdx >= 0 ? (text.slice(0, firstCharIdx) + text.slice(firstCharIdx + 1)) : text;
        const pageId = colContext.pageId || currentPage?.id;
        const hasFormattedSyntax = /\*\*|\[\[|\*/.test(text);
        const showWysiwygProse = effectiveIsWrite && hasFormattedSyntax && editingBlockId !== block.id;

        return wrap(
          <div className={`book-paragraph ${hasDropCap ? 'has-drop-cap' : ''}`}>
            {hasDropCap && (
              effectiveIsWrite ? (
                <EditableText
                  value={firstLetter}
                  tagName="span"
                  className="book-drop-cap book-drop-cap-editable"
                  placeholder="¶"
                  title="Click to edit initial letter"
                  singleLine
                  onCommit={(newLetter) => {
                    const cleaned = (newLetter || '').trim();
                    if (cleaned) {
                      updateBlock(block.id, { text: cleaned + (restText || '') }, pageId);
                    } else {
                      updateBlock(block.id, { text: restText || '' }, pageId);
                    }
                  }}
                />
              ) : (
                <span className="book-drop-cap">{firstLetter}</span>
              )
            )}
            {effectiveIsWrite ? (
              showWysiwygProse ? (
                <div
                  className="book-prose-display book-editable book-prose-edit is-wysiwyg-prose"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingBlockId(block.id);
                  }}
                  title="Click to edit manuscript text"
                >
                  <RichLoreText text={hasDropCap ? restText : text} className="parchment-theme" />
                </div>
              ) : (
                <EditableText
                  value={hasDropCap ? restText : text}
                  tagName="p"
                  className="book-prose-edit"
                  autoFocus={editingBlockId === block.id && hasFormattedSyntax}
                  placeholder="Write prose... Type **Title.** for bold lead-in, [[Entity]] for lore wikilink, or / for blocks..."
                  onInputText={(liveText, el) => handleProseLiveInput(liveText, el, block.id, pageId)}
                  onCommit={(newRest) => {
                    let full = newRest;
                    if (hasDropCap) {
                      const trimmed = (newRest || '').trimStart();
                      if (!trimmed && !firstLetter) {
                        full = '';
                      } else if (!trimmed) {
                        full = firstLetter;
                      } else if (firstLetter && trimmed.toLowerCase().startsWith(firstLetter.toLowerCase())) {
                        full = newRest;
                      } else if (trimmed[0] === trimmed[0].toUpperCase() && trimmed[0] !== trimmed[0].toLowerCase() && trimmed[0] !== firstLetter) {
                        full = newRest;
                      } else {
                        full = (firstLetter || '') + newRest;
                      }
                    }
                    updateBlock(block.id, { text: full }, pageId);
                  }}
                />
              )
            ) : (
              <div className="book-prose-display">
                <RichLoreText text={hasDropCap ? restText : text} className="parchment-theme" />
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
            onOpenSpellStudio={(slotData, callback) => {
              setSpellStudioTarget({
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
            onOpenSpellStudio={(b) => setSpellStudioTarget({ block: b || block, pageId: colContext.pageId || currentPage?.id })}
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
            inGameSession={inGameSession}
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
            onChange={(patch) => updateBlock(block.id, patch, colContext.pageId)}
            allowAnnotate={canWrite}
            inGameSession={inGameSession}
          />
        );

      case 'roll_table':
      case 'table':
        return wrap(
          <BookTableBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch, colContext.pageId)}
          />
        );

      case 'quote':
        return wrap(
          <BookQuoteBlock
            block={block}
            isWrite={effectiveIsWrite}
            onUpdate={(patch) => updateBlock(block.id, patch, colContext.pageId)}
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

  // Partition blocks for column layouts
  const partitionBlocks = (blocks = []) => {
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
  };

  // Render a list of column blocks with automatic pairing of left/right half blocks and companion slots
  const renderColumnBlocks = (colBlocks, colName, targetPageId = null) => {
    const total = colBlocks.length;
    const elements = [];
    let i = 0;
    const pageId = targetPageId || currentPage?.id;

    while (i < total) {
      const { block: b, index: originalIdx } = colBlocks[i];
      const isLeft = b.slotAlign === 'left' || (b.sizePreset === 'half' && b.slotAlign !== 'right' && b.alignment !== 'float-right');
      const isRight = b.slotAlign === 'right';

      if (isLeft) {
        const nextItem = i + 1 < total ? colBlocks[i + 1] : null;
        const isNextRight = nextItem && (nextItem.block.slotAlign === 'right' || (nextItem.block.sizePreset === 'half' && nextItem.block.slotAlign !== 'left'));

        if (isNextRight) {
          elements.push(
            <div key={`pair-${b.id}-${nextItem.block.id}`} className="book-paired-row">
              {renderPublicationBlock(b, originalIdx, true, { colName, isHalfSlot: 'left', isPaired: true, pageId })}
              {renderPublicationBlock(nextItem.block, nextItem.index, true, { colName, isHalfSlot: 'right', isPaired: true, pageId })}
            </div>
          );
          elements.push(<InsertRail key={`rail-${nextItem.index + 1}`} index={nextItem.index + 1} pageId={pageId} colName={colName} />);
          i += 2;
        } else {
          elements.push(
            <div key={`pair-${b.id}-open-right`} className="book-paired-row">
              {renderPublicationBlock(b, originalIdx, true, { colName, isHalfSlot: 'left', isPaired: false, pageId })}
              {isWrite ? (
                <div
                  className={`book-companion-empty-slot slot-right ${draggingBlockId ? 'drop-slot-target' : ''}`}
                  onDragOver={(e) => {
                    if (!draggingBlockId) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    if (!draggingBlockId) return;
                    e.preventDefault();
                    e.stopPropagation();
                    const sourceId = draggingBlockId;
                    setDraggingBlockId(null);
                    setDragOverInfo(null);
                    updateBlock(sourceId, { slotAlign: 'right', sizePreset: 'half', column: colName }, pageId);
                    moveBlockToIndex(sourceId, originalIdx + 1, colName, pageId);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setInsertAt({
                      index: originalIdx + 1,
                      column: colName,
                      slotAlign: 'right',
                      sizePreset: 'half',
                      pageId,
                      x: e.clientX,
                      y: e.clientY
                    });
                  }}
                  title="Add a companion block on the right (or drag any block here)"
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
          elements.push(<InsertRail key={`rail-${originalIdx + 1}`} index={originalIdx + 1} pageId={pageId} colName={colName} />);
          i += 1;
        }
      } else if (isRight) {
        elements.push(
          <div key={`pair-open-left-${b.id}`} className="book-paired-row">
            {isWrite ? (
              <div
                className={`book-companion-empty-slot slot-left ${draggingBlockId ? 'drop-slot-target' : ''}`}
                onDragOver={(e) => {
                  if (!draggingBlockId) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                  if (!draggingBlockId) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const sourceId = draggingBlockId;
                  setDraggingBlockId(null);
                  setDragOverInfo(null);
                  updateBlock(sourceId, { slotAlign: 'left', sizePreset: 'half', column: colName }, pageId);
                  moveBlockToIndex(sourceId, originalIdx, colName, pageId);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setInsertAt({
                    index: originalIdx,
                    column: colName,
                    slotAlign: 'left',
                    sizePreset: 'half',
                    pageId,
                    x: e.clientX,
                    y: e.clientY
                  });
                }}
                title="Add a companion block on the left (or drag any block here)"
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
            {renderPublicationBlock(b, originalIdx, true, { colName, isHalfSlot: 'right', isPaired: false, pageId })}
          </div>
        );
        elements.push(<InsertRail key={`rail-${originalIdx + 1}`} index={originalIdx + 1} pageId={pageId} colName={colName} />);
        i += 1;
      } else {
        elements.push(
          <React.Fragment key={b.id}>
            {renderPublicationBlock(b, originalIdx, true, {
              colName,
              isFirstInCol: i === 0,
              isLastInCol: i === total - 1,
              pageId
            })}
            <InsertRail index={originalIdx + 1} pageId={pageId} colName={colName} />
          </React.Fragment>
        );
        i += 1;
      }
    }

    return elements;
  };

  // Render publication Page Layout (Two-Column or Single-Column) for any given page
  const renderPageLayout = (targetPage) => {
    if (!targetPage) return null;
    const pageLayout = targetPage.layout || currentLayout;
    const isSingleCol = isSpreadLayout
      ? book.columns !== 2
      : (pageLayout === 'single-column' || book.columns === 1);
    const targetPageId = targetPage.id;
    const blocks = targetPage.blocks || [];

    const overflowBar = isWrite && blocks.length >= 7 && currentChapter ? (
      <div className="book-page-overflow-bar" onClick={(e) => e.stopPropagation()}>
        <span className="overflow-bar-info">
          <i className="fas fa-feather-pointed"></i> Dense Folio ({blocks.length} blocks) — may exceed print spread height
        </span>
        <button
          type="button"
          className="overflow-flow-btn"
          onClick={() => flowPageOverflow(book.id, currentChapter.id, targetPageId, 6)}
          title="Move trailing blocks to the next page so this folio stays balanced"
        >
          Flow Overflow to Next Page <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    ) : null;

    if (isSingleCol) {
      const allColBlocks = blocks.map((b, idx) => ({ block: b, index: idx }));
      return (
        <div className="book-page-body">
          <InsertRail index={0} isFirst pageId={targetPageId} colName="single" />
          <div className="book-column-content">
            {renderColumnBlocks(allColBlocks, 'single', targetPageId)}
          </div>
          {blocks.length === 0 && isWrite && (
            <div
              className={`empty-column-zone ${draggingBlockId ? 'drop-target-active' : ''}`}
              onDragOver={(e) => {
                if (!draggingBlockId) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                if (!draggingBlockId) return;
                e.preventDefault();
                e.stopPropagation();
                const sourceId = draggingBlockId;
                setDraggingBlockId(null);
                setDragOverInfo(null);
                moveBlockToIndex(sourceId, 0, 'single', targetPageId);
              }}
              onClick={() => addBlock('paragraph', 0, {}, targetPageId)}
            >
              <i className="fas fa-plus"></i> Add block to Page
            </div>
          )}
          {overflowBar}
        </div>
      );
    }

    const { leftColumnBlocks, rightColumnBlocks, fullColumnBlocks } = partitionBlocks(blocks);

    return (
      <div className="book-two-column-layout">
        <InsertRail index={0} isFirst pageId={targetPageId} colName="left" />
        <div className="book-columns-grid">
          {/* Left Column */}
          <div className="book-column left-column">
            <div className="book-column-content">
              {renderColumnBlocks(leftColumnBlocks, 'left', targetPageId)}
            </div>
            {leftColumnBlocks.length === 0 && isWrite && (
              <div
                className={`empty-column-zone ${draggingBlockId ? 'drop-target-active' : ''}`}
                onDragOver={(e) => {
                  if (!draggingBlockId) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                  if (!draggingBlockId) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const sourceId = draggingBlockId;
                  setDraggingBlockId(null);
                  setDragOverInfo(null);
                  moveBlockToIndex(sourceId, 0, 'left', targetPageId);
                }}
                onClick={() => addBlock('paragraph', 0, { column: 'left' }, targetPageId)}
              >
                <i className="fas fa-plus"></i> Add block to Left Column
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="book-column right-column">
            <div className="book-column-content">
              {renderColumnBlocks(rightColumnBlocks, 'right', targetPageId)}
            </div>
            {rightColumnBlocks.length === 0 && isWrite && (
              <div
                className={`empty-column-zone ${draggingBlockId ? 'drop-target-active' : ''}`}
                onDragOver={(e) => {
                  if (!draggingBlockId) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                  if (!draggingBlockId) return;
                  e.preventDefault();
                  e.stopPropagation();
                  const sourceId = draggingBlockId;
                  setDraggingBlockId(null);
                  setDragOverInfo(null);
                  moveBlockToIndex(sourceId, blocks.length, 'right', targetPageId);
                }}
                onClick={() => addBlock('paragraph', blocks.length, { column: 'right' }, targetPageId)}
              >
                <i className="fas fa-plus"></i> Add block to Right Column
              </div>
            )}
          </div>
        </div>

        {/* Full-width spanned blocks at bottom */}
        {fullColumnBlocks.length > 0 && (
          <div className="book-fullwidth-blocks">
            {renderColumnBlocks(fullColumnBlocks, 'full', targetPageId)}
          </div>
        )}
        {overflowBar}
      </div>
    );
  };

  const saveLabel = saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved!' : saveState === 'error' ? 'Save Failed' : 'Save Book';

  return (
    <div className={`book-document-editor book-manuscript theme-${book.theme || 'parchment'}`} data-mode={isWrite ? 'write' : 'read'}>
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
            aria-expanded={sidebarOpen}
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Mode Switchers: Write / Read */}
          <div className="mode-toggle-group">
            {canWrite && (
              <button
                type="button"
                className={`mode-btn ${activeMode === 'write' ? 'active' : ''}`}
                onClick={() => setActiveMode('write')}
                title="Publication Direct Authoring & Edit Mode"
                aria-label="Write Mode"
                aria-pressed={activeMode === 'write'}
              >
                <i className="fas fa-feather-pointed"></i>
                <span className="book-mode-label">Write</span>
              </button>
            )}
            <button
              type="button"
              className={`mode-btn ${activeMode === 'read' ? 'active' : ''}`}
              onClick={() => setActiveMode('read')}
              title="Clean Distraction-Free Tabletop Reader"
              aria-label="Read Mode"
              aria-pressed={activeMode === 'read'}
            >
              <i className="fas fa-book-open"></i>
              <span className="book-mode-label">Read</span>
            </button>
            {allowPrint && !inGameSession && (
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
            )}
          </div>
        </div>

        {/* Page / Chapter Quick Navigation Center with Theme & Layout Selectors */}
        <div className="toolbar-center">
          <ManuscriptDropdown
            value={book.theme || 'parchment'}
            options={THEME_OPTIONS}
            onChange={(theme) => updateBookMeta(book.id, { theme })}
            icon="fas fa-palette"
            title="Change Book Theme"
            className="theme-pill-select"
          />

          <ManuscriptDropdown
            value={isSpreadLayout ? 'book-spread' : (currentPage?.layout || book.layout || 'two-column')}
            options={LAYOUT_OPTIONS}
            onChange={(layout) => {
              updateBookMeta(book.id, { layout });
              if (currentChapter && currentPage && layout !== 'book-spread') {
                updatePage(book.id, currentChapter.id, currentPage.id, { layout });
              }
            }}
            icon="fas fa-table-columns"
            title="Change Page Layout"
            className="layout-pill-select"
          />

          {isSpreadLayout && canWrite && (
            <button
              type="button"
              className="toolbar-btn spread-folio-cols-btn"
              onClick={() => {
                const currentlySingle = book.columns !== 2;
                const nextCols = currentlySingle ? 'two-column' : 'single-column';
                updateBookMeta(book.id, { columns: currentlySingle ? 2 : 1 });
                if (currentChapter && spreadLeftPage) {
                  updatePage(book.id, currentChapter.id, spreadLeftPage.id, { layout: nextCols });
                }
                if (currentChapter && spreadRightPage) {
                  updatePage(book.id, currentChapter.id, spreadRightPage.id, { layout: nextCols });
                }
              }}
              title="Toggle columns per folio page in Facing Spread mode (1-Column vs 2-Column folios)"
            >
              <i className="fas fa-columns"></i>
              <span className="folio-cols-label">
                {book.columns !== 2 ? '1-Col Folios' : '2-Col Folios'}
              </span>
            </button>
          )}

          <div className="page-stepper-pill">
            <button
              type="button"
              className="stepper-btn"
              disabled={
                isSpreadLayout
                  ? (spreadPairLeftIdx <= 0 && book.chapters.findIndex((c) => c.id === activeChapterId) <= 0)
                  : currentPageIndex <= 0
              }
              onClick={handlePrevPage}
              title="Previous Page"
              aria-label="Previous Page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="stepper-label">
              <strong className="stepper-ch-name">{currentChapter?.title || 'Chapter I'}</strong>
              <span className="stepper-separator"> • </span>
              {isSpreadLayout ? (
                <span className="stepper-pg-count">
                  {spreadRightPage && spreadRightBookPageNum > spreadLeftBookPageNum
                    ? `Pages ${spreadLeftBookPageNum}–${spreadRightBookPageNum} of ${totalBookPages}`
                    : `Page ${spreadLeftBookPageNum} of ${totalBookPages}`}
                </span>
              ) : (
                <span className="stepper-pg-count">Page {currentBookPageNum} of {totalBookPages}</span>
              )}
            </span>
            <button
              type="button"
              className="stepper-btn"
              disabled={
                isSpreadLayout
                  ? ((spreadPairLeftIdx + 2 >= chapterPages.length) && (book.chapters.findIndex((c) => c.id === activeChapterId) >= book.chapters.length - 1))
                  : currentPageIndex >= allPagesList.length - 1
              }
              onClick={handleNextPage}
              title="Next Page"
              aria-label="Next Page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Actions Right */}
        <div className="toolbar-right">
          {canWrite && (
            <button
              type="button"
              className="toolbar-btn campaign-compiler-trigger-btn"
              onClick={() => setShowCampaignImporter(true)}
              title="Compile Campaign Chronicle — Auto-compile World Lore, Lineages, Dynasties, Bestiary, Quests, Spells & Relics into Chapters"
              aria-label="Compile Campaign Chronicle"
            >
              <i className="fas fa-wand-magic-sparkles"></i>
            </button>
          )}

          {canWrite && (
            <button
              type="button"
              className="toolbar-btn syntax-guide-trigger-btn"
              onClick={() => setShowSyntaxGuide(true)}
              title="TTRPG Manuscript Syntax Guide (**Lead-ins**, [[Lore Links]], Read-Aloud)"
              aria-label="TTRPG Syntax Guide"
            >
              <i className="fas fa-feather-pointed"></i>
            </button>
          )}

          {canWrite && (
            <button
              type="button"
              className="toolbar-btn glossary-btn"
              onClick={() => setIsGlossaryOpen(true)}
              title={`Manage Custom Glossary & Hover Terms (${(book.customTerms || []).length})`}
              aria-label={`Glossary (${(book.customTerms || []).length} terms)`}
            >
              <i className="fas fa-book-bookmark"></i>
            </button>
          )}

          {canWrite && (
            <button
              type="button"
              className="toolbar-btn snapshot-btn"
              onClick={() => setIsSnapshotOpen(true)}
              title={`Manage Revision Snapshots & Checkpoints (${(book.revisions || []).length})`}
              aria-label={`Revision Snapshots (${(book.revisions || []).length})`}
            >
              <i className="fas fa-clock-rotate-left"></i>
            </button>
          )}

          {canWrite && (
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
          )}

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
                aria-label="Close Navigation Drawer"
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
              {canWrite && (
                <button
                  type="button"
                  className={`tab-btn ${activeSidebarTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveSidebarTab('history')}
                  title="Revision History"
                >
                  <i className="fas fa-clock-rotate-left"></i>
                  <span>History</span>
                </button>
              )}
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
                        <button
                          type="button"
                          className={`toc-nav-ch-head ${activeChapterId === ch.id ? 'active' : ''}`}
                          onClick={() => navigateTo({ chapterId: ch.id, pageId: ch.pages?.[0]?.id })}
                          aria-current={activeChapterId === ch.id ? 'true' : undefined}
                        >
                          <i className="fas fa-feather"></i>
                          <span className="ch-title">{ch.title}</span>
                          <span className="ch-page-num">p. {ch.pages?.[0]?.pageNumber || chIdx + 1}</span>
                        </button>

                        {ch.pages && (
                          <div className="toc-nav-pages-list">
                            {ch.pages.map((pg) => (
                              <button
                                type="button"
                                key={pg.id}
                                className={`toc-nav-page-item ${activePageId === pg.id ? 'active' : ''}`}
                                onClick={() => navigateTo({ chapterId: ch.id, pageId: pg.id })}
                                aria-current={activePageId === pg.id ? 'page' : undefined}
                              >
                                <span className="pg-bullet">§</span>
                                <span className="pg-title">{pg.headerTitle || `Page ${pg.pageNumber}`}</span>
                                <span className="pg-num">p. {pg.pageNumber}</span>
                              </button>
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
                    {canWrite && (
                      <button
                        type="button"
                        className="structure-add-btn"
                        onClick={() => addChapter(book.id, { title: `Chapter ${book.chapters.length + 1}` })}
                        title="Add New Chapter"
                      >
                        <i className="fas fa-plus"></i> Chapter
                      </button>
                    )}
                  </div>

                  <div className="chapters-structure-list">
                    {book.chapters.map((ch) => (
                      <div key={ch.id} className={`structure-chapter-card ${activeChapterId === ch.id ? 'active' : ''}`}>
                        <div className="ch-card-header" onClick={() => navigateTo({ chapterId: ch.id, pageId: ch.pages?.[0]?.id })}>
                          <div className="ch-title-wrap">
                            <i className="fas fa-book-bookmark"></i>
                            {canWrite ? (
                              <EditableText
                                value={ch.title}
                                tagName="strong"
                                className="ch-title-editable"
                                placeholder="Chapter Title"
                                singleLine
                                onCommit={(newTitle) => {
                                  if (newTitle && newTitle.trim()) {
                                    updateChapter(book.id, ch.id, { title: newTitle.trim() });
                                  }
                                }}
                              />
                            ) : (
                              <strong>{ch.title}</strong>
                            )}
                          </div>
                          {canWrite && (
                            <div className="ch-card-actions">
                              <button
                                type="button"
                                className="ch-action-btn add-page-btn"
                                title="Add Page to this Chapter"
                                onClick={(e) => { e.stopPropagation(); addPage(book.id, ch.id); }}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                              {book.chapters.length > 1 && (
                                <button
                                  type="button"
                                  className="ch-action-btn ch-del-btn danger"
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
                          )}
                        </div>

                        <div className="pages-sub-strip">
                          {(ch.pages || []).map((pg) => (
                            <div
                              key={pg.id}
                              className={`page-pill-item ${activePageId === pg.id ? 'active' : ''}`}
                              onClick={() => navigateTo({ chapterId: ch.id, pageId: pg.id })}
                            >
                              <span>Page {pg.pageNumber}</span>
                              {canWrite && ch.pages.length > 1 && (
                                <button
                                  type="button"
                                  className="del-page"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePage(book.id, ch.id, pg.id);
                                  }}
                                  title="Delete Page"
                                  aria-label={`Delete Page ${pg.pageNumber}`}
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
                    <ManuscriptDropdown
                      value={book.theme || 'parchment'}
                      options={THEME_OPTIONS}
                      onChange={(val) => updateBookMeta(book.id, { theme: val })}
                      ariaLabel="Select book theme"
                    />
                  </div>

                  <div className="style-group">
                    <label>Page Layout:</label>
                    <ManuscriptDropdown
                      value={isSpreadLayout ? 'book-spread' : (currentPage?.layout || book.layout || 'two-column')}
                      options={LAYOUT_OPTIONS}
                      onChange={(val) => {
                        updateBookMeta(book.id, { layout: val });
                        if (currentChapter && currentPage && val !== 'book-spread') {
                          updatePage(book.id, currentChapter.id, currentPage.id, { layout: val });
                        }
                      }}
                      ariaLabel="Select page layout"
                    />
                  </div>

                  {canWrite && (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Center: Book Page Viewport */}
        <main
          className={`book-document-viewport ${isSpreadLayout ? 'viewport-spread-mode' : ''}`}
          onClick={() => {
            setInsertAt(null);
            if (activeMode === 'write') setEditingBlockId(null);
          }}
        >
          {isSpreadLayout ? (
            <div className="book-spread-canvas">
              {/* Left Facing Page */}
              <div className={`book-page-sheet book-spread-page spread-page-left layout-${spreadLeftPage?.layout || 'two-column'}`}>
                <header className="book-page-header spread-header-left">
                  {isWrite && (
                    <div className="page-header-actions-bar">
                      <button
                        type="button"
                        className="header-action-pill header-settings-trigger"
                        onClick={() => setHeaderSettingsOpen(true)}
                        title="Header & Footer Settings for this Page"
                      >
                        <i className="fas fa-sliders"></i> Headers & Footers
                      </button>
                    </div>
                  )}
                  {!spreadLeftPage?.hideRunningHeader && (
                    <div className="book-running-header">
                      <EditableText
                        className="running-header-title"
                        value={book.title || 'Mythrill Chronicle'}
                        disabled={!isWrite}
                        placeholder="Book Title..."
                        onCommit={(text) => updateBookMeta(book.id, { title: text })}
                      />
                      <div className="book-bracket-flourish" />
                      <EditableText
                        className="running-header-ch"
                        value={currentChapter?.title || 'Chapter Section'}
                        disabled={!isWrite}
                        placeholder="Chapter Title..."
                        onCommit={(text) => {
                          if (currentChapter) updateChapter(book.id, currentChapter.id, { title: text });
                        }}
                      />
                    </div>
                  )}
                  {spreadLeftPage?.headerTitle && (
                    <h2 className="book-page-subheading">
                      <EditableText
                        value={spreadLeftPage.headerTitle}
                        disabled={!isWrite}
                        placeholder="Page Heading..."
                        onCommit={(text) => {
                          if (currentChapter && spreadLeftPage) {
                            updatePage(book.id, currentChapter.id, spreadLeftPage.id, { headerTitle: text });
                          }
                        }}
                      />
                    </h2>
                  )}
                </header>

                {renderPageLayout(spreadLeftPage)}

                {!spreadLeftPage?.hideFooter && (
                  <footer className="book-page-footer spread-footer-left">
                    <span className="page-folio-number">{spreadLeftPage?.pageNumber || 1}</span>
                    <div className="book-folio-rule" />
                    <span className="page-folio-label" title={isWrite ? "Click to edit footer label" : undefined}>
                      <EditableText
                        value={spreadLeftPage?.footerNote || currentChapter?.title || book.title}
                        disabled={!isWrite}
                        placeholder="Footer note..."
                        onCommit={(text) => {
                          if (currentChapter && spreadLeftPage) {
                            updatePage(book.id, currentChapter.id, spreadLeftPage.id, { footerNote: text });
                          }
                        }}
                      />
                    </span>
                  </footer>
                )}
              </div>

              {/* Central Spine Gutter */}
              <div className="book-spine-gutter" aria-hidden="true">
                <div className="spine-fold-line" />
                <div className="spine-crease-shadow" />
              </div>

              {/* Right Facing Page */}
              {spreadRightPage ? (
                <div className={`book-page-sheet book-spread-page spread-page-right layout-${spreadRightPage?.layout || 'two-column'}`}>
                  <header className="book-page-header spread-header-right">
                    {isWrite && (
                      <div className="page-header-actions-bar">
                        <button
                          type="button"
                          className="header-action-pill header-settings-trigger"
                          onClick={() => setHeaderSettingsOpen(true)}
                          title="Header & Footer Settings for this Page"
                        >
                          <i className="fas fa-sliders"></i> Headers & Footers
                        </button>
                      </div>
                    )}
                    {!spreadRightPage?.hideRunningHeader && (
                      <div className="book-running-header">
                        <EditableText
                          className="running-header-ch"
                          value={currentChapter?.title || 'Chapter Section'}
                          disabled={!isWrite}
                          placeholder="Chapter Title..."
                          onCommit={(text) => {
                            if (currentChapter) updateChapter(book.id, currentChapter.id, { title: text });
                          }}
                        />
                        <div className="book-bracket-flourish" />
                        <EditableText
                          className="running-header-title"
                          value={book.title || 'Mythrill Chronicle'}
                          disabled={!isWrite}
                          placeholder="Book Title..."
                          onCommit={(text) => updateBookMeta(book.id, { title: text })}
                        />
                      </div>
                    )}
                    {spreadRightPage?.headerTitle && (
                      <h2 className="book-page-subheading">
                        <EditableText
                          value={spreadRightPage.headerTitle}
                          disabled={!isWrite}
                          placeholder="Page Heading..."
                          onCommit={(text) => {
                            if (currentChapter && spreadRightPage) {
                              updatePage(book.id, currentChapter.id, spreadRightPage.id, { headerTitle: text });
                            }
                          }}
                        />
                      </h2>
                    )}
                  </header>

                  {renderPageLayout(spreadRightPage)}

                  {!spreadRightPage?.hideFooter && (
                    <footer className="book-page-footer spread-footer-right">
                      <span className="page-folio-label" title={isWrite ? "Click to edit author" : undefined}>
                        <EditableText
                          value={book.author || 'TTRPG Publication'}
                          disabled={!isWrite}
                          placeholder="Author..."
                          onCommit={(text) => updateBookMeta(book.id, { author: text })}
                        />
                      </span>
                      <div className="book-folio-rule" />
                      <span className="page-folio-number">{spreadRightPage.pageNumber}</span>
                    </footer>
                  )}
                </div>
              ) : (
                <div className="book-page-sheet book-spread-page spread-page-right spread-empty-page">
                  <div className="spread-empty-inner">
                    <div className="spread-empty-watermark">◆</div>
                    <h3 className="spread-empty-title">Facing Page</h3>
                    <p className="spread-empty-desc">This chapter section concludes on the facing folio.</p>
                    {isWrite && (
                      <button
                        type="button"
                        className="add-facing-page-btn"
                        onClick={() => addPage(book.id, currentChapter.id)}
                      >
                        <i className="fas fa-plus"></i> Add Facing Page {spreadLeftPage ? spreadLeftPage.pageNumber + 1 : 2}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`book-page-sheet layout-${currentLayout}`}>
              <header className="book-page-header">
                {isWrite && (
                  <div className="page-header-actions-bar">
                    {!currentChapter?.subtitle && (
                      <button
                        type="button"
                        className="header-action-pill"
                        onClick={() => currentChapter && updateChapter(book.id, currentChapter.id, { subtitle: 'Chapter Subtitle' })}
                        title="Add Subtitle to this Chapter"
                      >
                        <i className="fas fa-plus"></i> Subtitle
                      </button>
                    )}
                    {!currentChapter?.epigraph && (
                      <button
                        type="button"
                        className="header-action-pill"
                        onClick={() => currentChapter && updateChapter(book.id, currentChapter.id, { epigraph: '“When the vault doors unseal, remember that gold does not bleed...”' })}
                        title="Add Epigraph Quote to this Chapter"
                      >
                        <i className="fas fa-quote-left"></i> Epigraph
                      </button>
                    )}
                    <button
                      type="button"
                      className="header-action-pill header-settings-trigger"
                      onClick={() => setHeaderSettingsOpen(true)}
                      title="Header & Footer Settings for this Page"
                    >
                      <i className="fas fa-sliders"></i> Headers & Footers
                    </button>
                  </div>
                )}

                {!currentPage?.hideRunningHeader && (
                  <div className="book-running-header">
                    <EditableText
                      className="running-header-title"
                      value={currentPage?.runningHeaderTitle || book.title || 'Mythrill Chronicle'}
                      disabled={!isWrite}
                      placeholder="Book Title..."
                      onCommit={(text) => updateBookMeta(book.id, { title: text })}
                    />
                    <div className="book-bracket-flourish" />
                    <EditableText
                      className="running-header-sub"
                      value={currentChapter?.title || 'Chapter Section'}
                      disabled={!isWrite}
                      placeholder="Chapter Title..."
                      onCommit={(text) => {
                        if (currentChapter) updateChapter(book.id, currentChapter.id, { title: text });
                      }}
                    />
                  </div>
                )}

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
                  <p className="book-doc-subtitle">
                    <EditableText
                      value={currentChapter.subtitle}
                      disabled={!isWrite}
                      placeholder="Chapter Subtitle..."
                      onCommit={(text) => {
                        if (currentChapter) updateChapter(book.id, currentChapter.id, { subtitle: text });
                      }}
                    />
                    {isWrite && (
                      <button
                        type="button"
                        className="remove-meta-btn"
                        onClick={() => updateChapter(book.id, currentChapter.id, { subtitle: '' })}
                        title="Remove Subtitle"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </p>
                )}

                {currentChapter?.epigraph && (
                  <blockquote className="book-chapter-epigraph">
                    <EditableText
                      value={currentChapter.epigraph}
                      disabled={!isWrite}
                      placeholder="“Inscribe your atmospheric quotation here…”"
                      onCommit={(text) => {
                        if (currentChapter) updateChapter(book.id, currentChapter.id, { epigraph: text });
                      }}
                    />
                    {isWrite && (
                      <button
                        type="button"
                        className="remove-meta-btn"
                        onClick={() => updateChapter(book.id, currentChapter.id, { epigraph: '' })}
                        title="Remove Epigraph"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </blockquote>
                )}
                <div className="book-header-rule" />
              </header>

              {/* Publication Page Body */}
              {renderPageLayout(currentPage)}

              {/* Running Footer */}
              {!currentPage?.hideFooter && (
                <footer className="book-page-footer">
                  <span className="book-footer-running" title={isWrite ? "Click to edit footer label" : undefined}>
                    <EditableText
                      value={currentPage?.footerNote || currentChapter?.title || book.title}
                      disabled={!isWrite}
                      placeholder="Footer note..."
                      onCommit={(text) => {
                        if (currentChapter && currentPage) {
                          updatePage(book.id, currentChapter.id, currentPage.id, { footerNote: text });
                        }
                      }}
                    />
                  </span>
                  <span className="book-footer-page">◆ Page {currentPage?.pageNumber || 1} ◆</span>
                  <span className="book-footer-part" title={isWrite ? "Click to edit author" : undefined}>
                    <EditableText
                      value={book.author || 'A Mythrill Chronicle'}
                      disabled={!isWrite}
                      placeholder="Author..."
                      onCommit={(text) => updateBookMeta(book.id, { author: text })}
                    />
                  </span>
                </footer>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Header & Footer Settings Dialog */}
      {headerSettingsOpen && (
        <div className="header-settings-backdrop" onClick={() => setHeaderSettingsOpen(false)}>
          <div className="header-settings-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="header-settings-header">
              <div className="settings-title-wrap">
                <i className="fas fa-feather-pointed"></i>
                <h4>Folio Headers & Footers</h4>
              </div>
              <button
                type="button"
                className="settings-close-btn"
                onClick={() => setHeaderSettingsOpen(false)}
                title="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="header-settings-body">
              <div className="settings-field">
                <label>Page Title (Heading):</label>
                <input
                  type="text"
                  className="settings-input"
                  value={currentPage?.headerTitle || ''}
                  placeholder="e.g. Subterranean Halls of the Dragonkin"
                  onChange={(e) => updatePage(book.id, currentChapter.id, currentPage.id, { headerTitle: e.target.value })}
                />
              </div>

              <div className="settings-field">
                <label>Chapter Name:</label>
                <input
                  type="text"
                  className="settings-input"
                  value={currentChapter?.title || ''}
                  placeholder="e.g. Chapter I: The Obsidian Depths"
                  onChange={(e) => currentChapter && updateChapter(book.id, currentChapter.id, { title: e.target.value })}
                />
              </div>

              <div className="settings-field">
                <label>Chapter Subtitle:</label>
                <input
                  type="text"
                  className="settings-input"
                  value={currentChapter?.subtitle || ''}
                  placeholder="e.g. A Deep Descent into the Molten Fissures"
                  onChange={(e) => currentChapter && updateChapter(book.id, currentChapter.id, { subtitle: e.target.value })}
                />
              </div>

              <div className="settings-field">
                <label>Epigraph / Flavor Quote:</label>
                <textarea
                  className="settings-textarea"
                  rows={2}
                  value={currentChapter?.epigraph || ''}
                  placeholder="e.g. “When the vault doors unseal, remember that gold does not bleed...”"
                  onChange={(e) => currentChapter && updateChapter(book.id, currentChapter.id, { epigraph: e.target.value })}
                />
              </div>

              <div className="settings-row-2col">
                <div className="settings-field">
                  <label>Running Footer Note:</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={currentPage?.footerNote || ''}
                    placeholder={currentChapter?.title || book.title}
                    onChange={(e) => updatePage(book.id, currentChapter.id, currentPage.id, { footerNote: e.target.value })}
                  />
                </div>
                <div className="settings-field">
                  <label>Author / Part Line:</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={book?.author || ''}
                    placeholder="e.g. Grand Archivist"
                    onChange={(e) => updateBookMeta(book.id, { author: e.target.value })}
                  />
                </div>
              </div>

              <div className="settings-toggles">
                <label className="settings-toggle-label">
                  <input
                    type="checkbox"
                    checked={Boolean(currentPage?.hideRunningHeader)}
                    onChange={(e) => updatePage(book.id, currentChapter.id, currentPage.id, { hideRunningHeader: e.target.checked })}
                  />
                  <span>Hide running header on this page (e.g. Chapter Title splash)</span>
                </label>
                <label className="settings-toggle-label">
                  <input
                    type="checkbox"
                    checked={Boolean(currentPage?.hideFooter)}
                    onChange={(e) => updatePage(book.id, currentChapter.id, currentPage.id, { hideFooter: e.target.checked })}
                  />
                  <span>Hide footer & page number on this page (e.g. Full-page splash / map)</span>
                </label>
              </div>
            </div>

            <div className="header-settings-footer">
              <button
                type="button"
                className="settings-done-btn"
                onClick={() => setHeaderSettingsOpen(false)}
              >
                <i className="fas fa-check"></i> Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Popover Palette */}
      {insertAt && (
        <div
          ref={insertPopoverRef}
          className="book-insert-popover"
          style={{
            left: insertPopoverPos?.key === insertAt
              ? insertPopoverPos.left
              : (Number.isFinite(insertAt.x) ? insertAt.x : 20),
            top: insertPopoverPos?.key === insertAt
              ? insertPopoverPos.top
              : (Number.isFinite(insertAt.y) ? insertAt.y : 20),
            visibility: insertPopoverPos?.key === insertAt ? 'visible' : 'hidden'
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
                  const pageId = insertAt.pageId;
                  setInsertAt(null);
                  if (item.type === 'image') {
                    setImagePickerTarget({ index: idx, column: col, slotAlign, sizePreset, pageId });
                  } else if (item.type === 'item_card') {
                    setItemStudioTarget({ index: idx, column: col, slotAlign, sizePreset, pageId });
                  } else if (item.type === 'creature_statblock') {
                    setCreatureStudioTarget({ index: idx, column: col, slotAlign, sizePreset, pageId });
                  } else if (item.type === 'quest_hook') {
                    setQuestPickerTarget({ index: idx, column: col, slotAlign, sizePreset, pageId });
                  } else if (item.type === 'lore_import') {
                    setLorePickerTarget({ index: idx, column: col, slotAlign, sizePreset, pageId });
                  } else {
                    addBlock(item.type, idx, {
                      ...(col ? { column: col } : {}),
                      ...(slotAlign ? { slotAlign, sizePreset: sizePreset || 'half' } : {})
                    }, pageId);
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
        initialData={imagePickerTarget?.block || (imagePickerTarget?.slotAlign ? { sizePreset: 'medium', alignment: 'center' } : {})}
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

      {/* Spellbook & Spellcrafting Studio Modal */}
      <BookSpellPickerModal
        isOpen={!!spellStudioTarget}
        onClose={() => setSpellStudioTarget(null)}
        initialData={spellStudioTarget?.block || {}}
        onSave={handleSaveSpellBlock}
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

      {/* Campaign / World Auto-Chronicle Importer Modal */}
      <BookCampaignImporterModal
        isOpen={showCampaignImporter}
        onClose={() => setShowCampaignImporter(false)}
        targetBookId={book.id}
        targetBookTitle={book.title}
        onCompiled={(compiledId) => {
          setShowCampaignImporter(false);
          if (compiledId && compiledId === book.id && book.chapters.length > 0) {
            const latestBook = getBookById(book.id);
            const lastCh = latestBook?.chapters?.[latestBook.chapters.length - 1];
            if (lastCh) {
              navigateTo({ chapterId: lastCh.id, pageId: lastCh.pages?.[0]?.id });
            }
          }
        }}
      />

      {/* Inline [[ Lore Autocomplete & / Slash Command Floating Popover */}
      {inlineAutocomplete && autocompleteItems.length > 0 && (
        <div
          className="book-inline-autocomplete-popover"
          style={{
            position: 'fixed',
            left: `${inlineAutocomplete.x}px`,
            top: `${inlineAutocomplete.y}px`,
            zIndex: 950
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="autocomplete-head">
            <span>
              <i className={`fas ${inlineAutocomplete.mode === 'slash' ? 'fa-wand-magic-sparkles' : 'fa-feather-pointed'}`}></i>{' '}
              {inlineAutocomplete.mode === 'slash' ? 'Slash Block Command' : 'Link Lore Entity [[...]]'}
            </span>
            <button type="button" onClick={() => setInlineAutocomplete(null)}>&times;</button>
          </div>
          <div className="autocomplete-list">
            {autocompleteItems.map((item, idx) => (
              <button
                key={`${item.name || item.type}-${idx}`}
                type="button"
                className="autocomplete-option"
                onClick={() => {
                  const targetBlockId = inlineAutocomplete.blockId;
                  const targetPageId = inlineAutocomplete.pageId || currentPage?.id;
                  if (inlineAutocomplete.mode === 'slash') {
                    const convertedDefaults = JSON.parse(JSON.stringify(NEW_BLOCK_DEFAULTS[item.type] || {}));
                    mutatePageBlocks((blocks) =>
                      blocks.map((b) =>
                        b.id === targetBlockId
                          ? { ...convertedDefaults, id: b.id, type: item.type, column: b.column }
                          : b
                      ),
                      targetPageId
                    );
                    setInlineAutocomplete(null);
                  } else {
                    const updatedText = String(inlineAutocomplete.rawText || '').replace(
                      /\[\[([^[\]]{0,36})$/,
                      `[[${item.name}]] `
                    );
                    updateBlock(targetBlockId, { text: updatedText }, targetPageId);
                    setInlineAutocomplete(null);
                  }
                }}
              >
                <i className={`fas ${item.icon || 'fa-scroll'}`}></i>
                <span className="autocomplete-opt-label">{item.label || item.name}</span>
                {item.category && <span className="autocomplete-opt-badge">{item.category}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Text Selection Quick-Format Bubble */}
      {selectionBubble && !showSyntaxGuide && (
        <div
          className="book-selection-bubble"
          style={{
            position: 'fixed',
            left: `${selectionBubble.x}px`,
            top: `${selectionBubble.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 900
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button
            type="button"
            className="bubble-btn bubble-btn-bold"
            onClick={() => formatSelection('**', '**')}
            title="Wrap in Bold Lead-in (**text**)"
          >
            <span className="bubble-glyph">**B**</span>
            <span className="bubble-label">Lead-in</span>
          </button>
          <div className="bubble-divider" />
          <button
            type="button"
            className="bubble-btn bubble-btn-italic"
            onClick={() => formatSelection('*', '*')}
            title="Wrap in Italic (*text*)"
          >
            <span className="bubble-glyph">*I*</span>
            <span className="bubble-label">Italic</span>
          </button>
          <div className="bubble-divider" />
          <button
            type="button"
            className="bubble-btn bubble-btn-lore"
            onClick={() => formatSelection('[[', ']]')}
            title="Wrap in Lore Wikilink ([[text]])"
          >
            <i className="fas fa-feather-pointed"></i>
            <span className="bubble-label">[[ Lore ]]</span>
          </button>
          <div className="bubble-divider" />
          <button
            type="button"
            className="bubble-btn bubble-btn-guide"
            onClick={() => {
              setSelectionBubble(null);
              setShowSyntaxGuide(true);
            }}
            title="Open TTRPG Manuscript Syntax Guide"
          >
            <i className="fas fa-circle-info"></i>
          </button>
        </div>
      )}

      {/* TTRPG Manuscript Typography & Syntax Guide Modal */}
      <BookSyntaxGuideModal
        isOpen={showSyntaxGuide}
        onClose={() => setShowSyntaxGuide(false)}
        onInsertSnippet={handleInsertSyntaxSnippet}
      />

      {/* Campaign Lore Quick-Peek & Entity Creation Drawer */}
      <QuickPeekDrawer theme={book.theme || 'parchment'} />
    </div>
  );
};

export default BookDocumentEditor;
