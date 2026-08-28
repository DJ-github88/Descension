import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookDocumentEditor from '../BookDocumentEditor';
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
} from '../BookTtrpgBlocks';
import BookImagePickerModal from '../BookImagePickerModal';
import BookItemCreatorModal from '../BookItemCreatorModal';
import BookLorePickerModal from '../BookLorePickerModal';
import BookGlossaryModal from '../BookGlossaryModal';
import BookSnapshotModal from '../BookSnapshotModal';
import useBookStore from '../../../store/bookStore';

describe('BookDocumentEditor & TTRPG Blocks', () => {
  const sampleBook = {
    id: 'test-book-1',
    title: 'Compendium of the Arcane',
    subtitle: 'A Masterwork of Eldritch Lore',
    author: 'Grand Archivist',
    theme: 'parchment',
    layout: 'two-column',
    chapters: [
      {
        id: 'ch-1',
        title: 'Chapter I: The Rime Wastes',
        pages: [
          {
            id: 'pg-1',
            pageNumber: 1,
            headerTitle: 'The Frozen Reach',
            blocks: [
              { id: 'b-h1', type: 'header', level: 1, text: 'The Frozen Reach' },
              { id: 'b-p1', type: 'paragraph', hasDropCap: true, text: 'Across the icy plains of Nordhalla, ancient forces slumber.' },
              {
                id: 'b-mon',
                type: 'creature_statblock',
                name: 'Frost Wyrd Revenant',
                dangerLevel: 'High',
                creatureType: 'Medium Undead / Elemental, Native',
                hp: 220,
                mana: 40,
                ap: 4,
                speed: '30 ft.',
                stats: { strength: 16, agility: 14, constitution: 16, intelligence: 12, spirit: 16, charisma: 10 },
                resistances: 'Rime 50%, Wyrd 25%',
                traits: [{ name: 'Chilling Aura', desc: 'Cold aura.' }],
                actions: [{ name: 'Glacial Rend', desc: 'Rime damage strike.' }]
              },
              {
                id: 'b-item',
                type: 'item_card',
                name: 'Rime-Forged Dagger',
                itemType: 'Weapon (Dagger)',
                rarity: 'rare',
                damage: '1d4 + 1 Piercing + 1d6 Rime',
                value: '750 gp',
                description: 'Glacial edge that never dulls.'
              },
              {
                id: 'b-spell',
                type: 'spell_formula',
                name: 'Glacial Shard Lance',
                school: 'Cryomancy',
                tier: 2,
                castingTime: '1 Action (2 AP)',
                manaCost: 15,
                range: '60 ft.',
                duration: 'Instantaneous',
                effect: 'Impales target for 3d8 piercing damage.'
              },
              {
                id: 'b-loc',
                type: 'location_showcase',
                name: 'Greymark Citadel',
                locationType: 'Fortress / Sanctuary',
                region: 'Frostwood Reach',
                description: 'An ancient obsidian fortress perched above the pines.'
              },
              {
                id: 'b-npc',
                type: 'npc_dossier',
                name: 'Gref the Memory-Merchant',
                role: 'Twilight Guide & Trader',
                disposition: 'neutral',
                description: 'A stooped, birch-skinned twilight merchant.'
              },
              {
                id: 'b-quest',
                type: 'quest_hook',
                title: 'The Lost Key of Drunhold',
                giver: 'Elder Moira',
                status: 'Active',
                objectives: [{ text: 'Locate Gref near the crossroads', done: false }]
              },
              {
                id: 'b-img',
                type: 'image',
                url: '/assets/images/backgrounds/nordhalla.jpeg',
                caption: 'Continental Glaciers',
                alignment: 'full'
              },
              {
                id: 'b-call',
                type: 'callout',
                calloutType: 'lore',
                title: 'Glacial History',
                content: 'Formed in the second age of the frost gods.'
              },
              {
                id: 'b-map',
                type: 'map_embed',
                title: 'Nordhalla Map',
                region: 'Canonical Realm',
                pinCount: 14
              },
              {
                id: 'b-toc',
                type: 'table_of_contents'
              }
            ]
          }
        ]
      }
    ],
    customTerms: [
      { id: 't-1', name: 'Ancient Mist', category: 'Phenomenon', definition: 'Thermal barrier fog.' }
    ]
  };

  beforeEach(() => {
    useBookStore.setState({
      books: [sampleBook],
      activeBookId: 'test-book-1'
    });
  });

  test('renders BookDocumentEditor with title, navigation toolbar and mode switches', () => {
    render(<BookDocumentEditor bookId="test-book-1" isGM={true} />);

    expect(screen.getAllByText('The Frozen Reach').length).toBeGreaterThan(0);
    expect(screen.getByText('Write')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText(/Glossary/i)).toBeInTheDocument();
  });

  test('renders CreatureStatblockBlock with Descension vitals, stats, traits and actions', () => {
    const block = sampleBook.chapters[0].pages[0].blocks[2];
    render(<CreatureStatblockBlock block={block} isWrite={false} onUpdate={() => {}} />);

    expect(screen.getByText('Frost Wyrd Revenant')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('220')).toBeInTheDocument();
    expect(screen.getByText('Chilling Aura.')).toBeInTheDocument();
    expect(screen.getByText('Glacial Rend.')).toBeInTheDocument();
  });

  test('renders ItemRelicBlock with item properties and rarity', () => {
    const block = sampleBook.chapters[0].pages[0].blocks[3];
    render(<ItemRelicBlock block={block} isWrite={false} onUpdate={() => {}} />);

    expect(screen.getByText('Rime-Forged Dagger')).toBeInTheDocument();
    expect(screen.getByText(/Weapon \(dagger\)/i)).toBeInTheDocument();
    expect(screen.getByText('Glacial edge that never dulls.')).toBeInTheDocument();
    expect(screen.getByText('750')).toBeInTheDocument();
  });

  test('renders SpellFormulaBlock with UnifiedSpellCard in-game format', () => {
    const block = sampleBook.chapters[0].pages[0].blocks[4];
    render(<SpellFormulaBlock block={block} isWrite={false} onUpdate={() => {}} />);

    expect(screen.getByText('Glacial Shard Lance')).toBeInTheDocument();
    expect(screen.getAllByText(/Impales target for 3d8 piercing damage/i).length).toBeGreaterThan(0);
  });

  test('normalizes legacy CR to Danger Level and never displays CR', () => {
    const legacyBlock = {
      name: 'Old Creature',
      cr: 'CR 3',
      hp: 100,
      stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 }
    };
    render(<CreatureStatblockBlock block={legacyBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.queryByText('CR 3')).not.toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  test('renders LocationShowcaseBlock, NpcDossierBlock, and QuestHookBlock', () => {
    const locBlock = sampleBook.chapters[0].pages[0].blocks[5];
    const npcBlock = sampleBook.chapters[0].pages[0].blocks[6];
    const questBlock = sampleBook.chapters[0].pages[0].blocks[7];

    const { rerender } = render(<LocationShowcaseBlock block={locBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Greymark Citadel')).toBeInTheDocument();

    rerender(<NpcDossierBlock block={npcBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Gref the Memory-Merchant')).toBeInTheDocument();

    rerender(<QuestHookBlock block={questBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('The Lost Key of Drunhold')).toBeInTheDocument();
    expect(screen.getByText('Locate Gref near the crossroads')).toBeInTheDocument();
  });

  test('renders BookImageBlock and BookCalloutBlock', () => {
    const imgBlock = sampleBook.chapters[0].pages[0].blocks[8];
    const callBlock = sampleBook.chapters[0].pages[0].blocks[9];

    const { rerender } = render(<BookImageBlock block={imgBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Continental Glaciers')).toBeInTheDocument();

    rerender(<BookCalloutBlock block={callBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Glacial History')).toBeInTheDocument();
    expect(screen.getByText(/Formed in the second age/i)).toBeInTheDocument();
  });

  test('renders TableOfContentsBlock with chapter links and leader dots', () => {
    render(<TableOfContentsBlock book={sampleBook} onNavigate={() => {}} />);

    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByText('Chapter I: The Rime Wastes')).toBeInTheDocument();
  });

  test('renders SideBySideBlock with dual columns and text editing', () => {
    const sideBlock = {
      type: 'side_by_side',
      ratio: '50-50',
      left: { type: 'image', url: '/assets/images/races/merryn_illustration.png', caption: 'Merryn Wave-Rider' },
      right: { type: 'paragraph', text: 'Across the misty frontiers, legends are written in iron.' }
    };

    render(<SideBySideBlock block={sideBlock} isWrite={true} onUpdate={() => {}} />);
    expect(screen.getByText('Merryn Wave-Rider')).toBeInTheDocument();
    expect(screen.getByText(/Across the misty frontiers/i)).toBeInTheDocument();
    expect(screen.getByText('Swap Sides')).toBeInTheDocument();
  });

  test('allows switching modes and toggling sidebar tabs', () => {
    render(<BookDocumentEditor bookId="test-book-1" isGM={true} />);

    // Click Read mode
    const readBtn = screen.getByText('Read');
    fireEvent.click(readBtn);
    expect(screen.queryByTitle('Insert new block here')).not.toBeInTheDocument();

    // Click Write mode
    const writeBtn = screen.getByText('Write');
    fireEvent.click(writeBtn);
    expect(screen.getAllByTitle('Insert new block here').length).toBeGreaterThan(0);
  });

  test('renders BookImagePickerModal with presets and tabs', () => {
    render(
      <BookImagePickerModal
        isOpen={true}
        onClose={() => {}}
        initialData={{}}
        onSave={() => {}}
      />
    );

    expect(screen.getByText('Configure Sourcebook Illustration')).toBeInTheDocument();
    expect(screen.getByText('Character & Race Art')).toBeInTheDocument();
    expect(screen.getByText('Solari Cinder-Walker')).toBeInTheDocument();
  });

  test('renders BookItemCreatorModal with Item Library and Item Wizard controls', () => {
    render(
      <BookItemCreatorModal
        isOpen={true}
        onClose={() => {}}
        initialData={{}}
        onSave={() => {}}
      />
    );

    expect(screen.getByText('Item Library & Relic Studio')).toBeInTheDocument();
    expect(screen.getByText(/Create New with Item Wizard/i)).toBeInTheDocument();
    expect(screen.getByText(/Live In-Game Item Layout/i)).toBeInTheDocument();
  });

  test('renders BookLorePickerModal with search and categories', () => {
    render(
      <BookLorePickerModal
        isOpen={true}
        onClose={() => {}}
        onSelectLore={() => {}}
      />
    );

    expect(screen.getByText('Import Lore from World & Campaigns')).toBeInTheDocument();
    expect(screen.getByText('All Lore & Notes')).toBeInTheDocument();
    expect(screen.getByText('World & Factions')).toBeInTheDocument();
  });

  test('renders BookGlossaryModal with term creation and search', () => {
    const mockTerms = [
      { id: 't1', name: 'Frost Wyrd', alias: 'Rime Spirit', category: 'Concept', definition: 'An icy ethereal remnant.' }
    ];

    render(
      <BookGlossaryModal
        isOpen={true}
        onClose={() => {}}
        terms={mockTerms}
        onAddTerm={() => {}}
        onUpdateTerm={() => {}}
        onDeleteTerm={() => {}}
      />
    );

    expect(screen.getByText('Glossary & Custom Lore Terms')).toBeInTheDocument();
    expect(screen.getByText('Frost Wyrd')).toBeInTheDocument();
    expect(screen.getByText(/aka Rime Spirit/i)).toBeInTheDocument();
  });

  test('renders BookSnapshotModal with revision list and capture form', () => {
    const mockBookWithRevisions = {
      ...sampleBook,
      revisions: [
        {
          id: 'rev-1',
          summary: 'Pre-Boss Encounter Draft',
          tag: 'Boss / Encounter',
          note: 'Balanced frost elemental damage.',
          timestamp: '2026-08-27T20:00:00.000Z',
          chapterCount: 2,
          pageCount: 4,
          termCount: 1
        }
      ]
    };

    render(
      <BookSnapshotModal
        isOpen={true}
        onClose={() => {}}
        book={mockBookWithRevisions}
        onCreateSnapshot={() => {}}
        onRestoreSnapshot={() => {}}
        onDeleteSnapshot={() => {}}
      />
    );

    expect(screen.getByText('Revision Snapshots & Checkpoints')).toBeInTheDocument();
    expect(screen.getByText('Pre-Boss Encounter Draft')).toBeInTheDocument();
    expect(screen.getByText(/Balanced frost elemental damage/i)).toBeInTheDocument();
    expect(screen.getByText('Capture Checkpoint Snapshot')).toBeInTheDocument();
  });
});
