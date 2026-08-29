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
  SideBySideBlock,
  LineageShowcaseBlock,
  DynastyTreeBlock,
  PlotThreadBlock
} from '../BookTtrpgBlocks';
import BookImagePickerModal from '../BookImagePickerModal';
import BookItemCreatorModal from '../BookItemCreatorModal';
import BookCreaturePickerModal from '../BookCreaturePickerModal';
import BookQuestPickerModal from '../BookQuestPickerModal';
import BookLorePickerModal from '../BookLorePickerModal';
import BookMapPickerModal from '../BookMapPickerModal';
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
                objectives: [{ text: 'Locate Gref near the crossroads', completed: false }]
              },
              {
                id: 'b-lin',
                type: 'lineage_showcase',
                name: 'Solari',
                essence: 'The Cinder-Bound',
                description: 'Born of the volcanic caldrons.',
                abilityModifiers: { STR: 2, AGI: -1, CON: 1, INT: 0, SPI: 1, CHA: -1 }
              },
              {
                id: 'b-dyn',
                type: 'dynasty_tree',
                name: 'House Alduin',
                description: 'The royal house of Nordhalla.',
                nodes: [{ id: 'n-1', name: 'Nikolaos Alduin', title: 'High King' }]
              },
              {
                id: 'b-plot',
                type: 'plot_thread',
                title: 'The Shadow of Greymark',
                act: 1,
                status: 'Active',
                beats: [{ title: 'The Omens at Twilight', completed: true }]
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
    expect(screen.getByTitle(/Publication Direct Authoring & Edit Mode/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Clean Distraction-Free Tabletop Reader/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Manage Custom Glossary/i)).toBeInTheDocument();
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

  test('renders CreatureStatblockBlock in write mode with Open in Creature Wizard button', () => {
    const block = sampleBook.chapters[0].pages[0].blocks[2];
    const onOpenWizard = jest.fn();
    render(<CreatureStatblockBlock block={block} isWrite={true} onUpdate={() => {}} onOpenWizard={onOpenWizard} />);

    const wizardBtn = screen.getByText(/Open in Creature Wizard/i);
    expect(wizardBtn).toBeInTheDocument();
    fireEvent.click(wizardBtn);
    expect(onOpenWizard).toHaveBeenCalledWith(block);
  });

  test('renders LineageShowcaseBlock, DynastyTreeBlock, and PlotThreadBlock', () => {
    const linBlock = sampleBook.chapters[0].pages[0].blocks[8];
    const dynBlock = sampleBook.chapters[0].pages[0].blocks[9];
    const plotBlock = sampleBook.chapters[0].pages[0].blocks[10];

    const { rerender } = render(<LineageShowcaseBlock block={linBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Solari')).toBeInTheDocument();
    expect(screen.getByText('The Cinder-Bound')).toBeInTheDocument();

    rerender(<DynastyTreeBlock block={dynBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('House Alduin')).toBeInTheDocument();
    expect(screen.getByText('Nikolaos Alduin')).toBeInTheDocument();

    rerender(<PlotThreadBlock block={plotBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('The Shadow of Greymark')).toBeInTheDocument();
    expect(screen.getByText('The Omens at Twilight')).toBeInTheDocument();
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
    const locBlock = {
      ...sampleBook.chapters[0].pages[0].blocks[5],
      landmarks: 'High Bastion, Sub-Zero Forge',
      secrets: 'Thermal core is cracking.'
    };
    const npcBlock = {
      ...sampleBook.chapters[0].pages[0].blocks[6],
      personality: 'Soft-spoken and mysterious.',
      quote: 'Every key opens a door.'
    };
    const questBlock = sampleBook.chapters[0].pages[0].blocks[7];

    const { rerender } = render(<LocationShowcaseBlock block={locBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Greymark Citadel')).toBeInTheDocument();
    expect(screen.getByText(/High Bastion, Sub-Zero Forge/i)).toBeInTheDocument();
    expect(screen.getByText('Thermal core is cracking.')).toBeInTheDocument();

    rerender(<NpcDossierBlock block={npcBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Gref the Memory-Merchant')).toBeInTheDocument();
    expect(screen.getByText('Soft-spoken and mysterious.')).toBeInTheDocument();
    expect(screen.getByText('Every key opens a door.')).toBeInTheDocument();

    rerender(<QuestHookBlock block={questBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('The Lost Key of Drunhold')).toBeInTheDocument();
    expect(screen.getByText('Locate Gref near the crossroads')).toBeInTheDocument();
  });

  test('renders BookImageBlock and BookCalloutBlock with 5 thematic variants', () => {
    const imgBlock = sampleBook.chapters[0].pages[0].blocks[11];
    const callBlock = sampleBook.chapters[0].pages[0].blocks[12];

    const { rerender } = render(<BookImageBlock block={imgBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Continental Glaciers')).toBeInTheDocument();

    // 1. Info / Lore Note variant
    rerender(<BookCalloutBlock block={callBlock} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Glacial History')).toBeInTheDocument();
    expect(screen.getByText(/Formed in the second age/i)).toBeInTheDocument();

    // 2. Secret Lore variant
    const secretCallout = { ...callBlock, calloutType: 'secret', title: 'Forbidden Tome Secret' };
    rerender(<BookCalloutBlock block={secretCallout} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Forbidden Tome Secret')).toBeInTheDocument();

    // 3. Warning variant
    const warnCallout = { ...callBlock, calloutType: 'warning', title: 'Severe Avalanche Risk' };
    rerender(<BookCalloutBlock block={warnCallout} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Severe Avalanche Risk')).toBeInTheDocument();

    // 4. Read-Aloud variant
    const readCallout = { ...callBlock, calloutType: 'readaloud', title: 'The Frozen Pass' };
    rerender(<BookCalloutBlock block={readCallout} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('The Frozen Pass')).toBeInTheDocument();

    // 5. Divine / Sacred Decree variant
    const divineCallout = { ...callBlock, calloutType: 'divine', title: 'Edict of the Sun Queen' };
    rerender(<BookCalloutBlock block={divineCallout} isWrite={false} onUpdate={() => {}} />);
    expect(screen.getByText('Edict of the Sun Queen')).toBeInTheDocument();
  });

  test('renders MapEmbedBlock with location showcase switcher, zoom, and interactive navigation', () => {
    const mapBlock = {
      id: 'm-1',
      type: 'map_embed',
      title: 'Frostwood Reach & Surrounding Lands',
      subtitle: 'The Mist-Archivists Forest',
      mapId: 'frostwood-reach',
      buttonText: 'Explore Frostwood',
      imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
      locations: [
        { id: 'loc-all', name: 'Overview', focalPoint: { x: 50, y: 50 }, zoom: 1.0 },
        { id: 'loc-skald', name: "Skald's Peaks", focalPoint: { x: 52, y: 38 }, zoom: 1.85 },
        { id: 'loc-midhofn', name: 'Midhöfn', focalPoint: { x: 38, y: 46 }, zoom: 2.1 }
      ]
    };

    const handleNavigate = jest.fn();
    const handleOpenPicker = jest.fn();
    const handleUpdate = jest.fn();

    // 1. Read Mode Rendering
    const { rerender } = render(
      <MapEmbedBlock
        block={mapBlock}
        isWrite={false}
        onUpdate={handleUpdate}
        onOpenPicker={handleOpenPicker}
        onNavigateMap={handleNavigate}
      />
    );

    expect(screen.getByText('Frostwood Reach & Surrounding Lands')).toBeInTheDocument();
    expect(screen.getByText('The Mist-Archivists Forest')).toBeInTheDocument();
    expect(screen.getByText('Explore Frostwood')).toBeInTheDocument();

    // Verify location showcase buttons are present
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText("Skald's Peaks")).toBeInTheDocument();
    expect(screen.getByText('Midhöfn')).toBeInTheDocument();

    // Verify it doesn't have hardcoded developer text or unwanted tags
    expect(screen.queryByText('Interactive Map')).not.toBeInTheDocument();
    expect(screen.queryByText('Map Studio')).not.toBeInTheDocument();

    // Click location showcase button switches focal location
    const skaldBtn = screen.getByText("Skald's Peaks");
    fireEvent.click(skaldBtn);
    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ activeLocationId: 'loc-skald', zoom: 1.85 })
    );

    // Click explore button triggers navigation
    const exploreBtn = screen.getByText('Explore Frostwood');
    fireEvent.click(exploreBtn);
    expect(handleNavigate).toHaveBeenCalledWith('/worldmap/frostwood-reach', mapBlock);

    // 2. Write Mode Rendering
    rerender(
      <MapEmbedBlock
        block={mapBlock}
        isWrite={true}
        onUpdate={handleUpdate}
        onOpenPicker={handleOpenPicker}
        onNavigateMap={handleNavigate}
      />
    );

    expect(screen.getByText('Trail')).toBeInTheDocument();
    expect(screen.getByText('Pin')).toBeInTheDocument();
    expect(screen.getByText('+ Add Current View')).toBeInTheDocument();
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
    expect(screen.getByText('Swap')).toBeInTheDocument();
  });

  test('allows switching modes and toggling sidebar tabs', () => {
    render(<BookDocumentEditor bookId="test-book-1" isGM={true} />);

    // Click Read mode
    const readBtn = screen.getByTitle(/Clean Distraction-Free Tabletop Reader/i);
    fireEvent.click(readBtn);
    expect(screen.queryByTitle('Insert new block here')).not.toBeInTheDocument();

    // Click Write mode
    const writeBtn = screen.getByTitle(/Publication Direct Authoring & Edit Mode/i);
    fireEvent.click(writeBtn);
    expect(screen.getAllByTitle('Insert new block here').length).toBeGreaterThan(0);
  });

  test('renders BookCreaturePickerModal with creature catalog and wizard trigger', () => {
    render(
      <BookCreaturePickerModal
        isOpen={true}
        onClose={() => {}}
        initialData={{}}
        onSave={() => {}}
      />
    );

    expect(screen.getByText(/Select or Author Bestiary Creature \/ NPC/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Open in Creature Wizard/i).length).toBeGreaterThan(0);
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

    expect(screen.getByText(/Import Lore from World, Campaigns & Lineages/i)).toBeInTheDocument();
    expect(screen.getByText('All Archives')).toBeInTheDocument();
    expect(screen.getByText('World & Factions')).toBeInTheDocument();
  });

  test('renders BookQuestPickerModal with quest library and presets', () => {
    render(
      <BookQuestPickerModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
      />
    );

    expect(screen.getByText('Quest & Adventure Hook Library')).toBeInTheDocument();
    expect(screen.getByText('Bounties & Hunts')).toBeInTheDocument();
    expect(screen.getByText('Dungeon Delves')).toBeInTheDocument();
    expect(screen.getByText('Place Quest in Chronicle')).toBeInTheDocument();
  });

  test('renders BookMapPickerModal with canonical realm presets and studio controls', () => {
    const handleSave = jest.fn();

    render(
      <BookMapPickerModal
        isOpen={true}
        onClose={() => {}}
        initialData={{
          title: 'Frostwood Reach & Surrounding Lands',
          mapId: 'frostwood-reach'
        }}
        onSave={handleSave}
      />
    );

    expect(screen.getByText(/Interactive Map & Atlas Studio/i)).toBeInTheDocument();
    expect(screen.getByText('Realm & Regional Presets')).toBeInTheDocument();
    expect(screen.getByText('The World of Mythril')).toBeInTheDocument();
    expect(screen.getByText('Nordhalla — The Frozen Crown')).toBeInTheDocument();

    // Click Apply to Document
    const applyBtn = screen.getByText(/Apply to Document/i);
    fireEvent.click(applyBtn);
    expect(handleSave).toHaveBeenCalled();
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

  test('renders companion empty slot when a block is placed on the left side (slotAlign: left)', () => {
    const bookWithLeftBlock = {
      ...sampleBook,
      id: 'test-book-companion',
      chapters: [
        {
          id: 'ch-1',
          title: 'Chapter I',
          pages: [
            {
              id: 'pg-1',
              pageNumber: 1,
              blocks: [
                {
                  id: 'b-img-left',
                  type: 'image',
                  url: '/assets/images/races/merryn_illustration.png',
                  caption: 'Merryn Wave-Rider',
                  column: 'left',
                  slotAlign: 'left',
                  sizePreset: 'half'
                }
              ]
            }
          ]
        }
      ]
    };

    useBookStore.setState({
      books: [bookWithLeftBlock],
      activeBookId: 'test-book-companion'
    });

    render(<BookDocumentEditor bookId="test-book-companion" isGM={true} />);

    expect(screen.getByDisplayValue('Merryn Wave-Rider')).toBeInTheDocument();
    expect(screen.getByText('+ Add block beside this')).toBeInTheDocument();
  });

  test('pairs two half-width blocks seamlessly side-by-side with no empty slot', () => {
    const bookWithPairedBlocks = {
      ...sampleBook,
      id: 'test-book-paired',
      chapters: [
        {
          id: 'ch-1',
          title: 'Chapter I',
          pages: [
            {
              id: 'pg-1',
              pageNumber: 1,
              blocks: [
                {
                  id: 'b-img-left',
                  type: 'image',
                  url: '/assets/images/races/merryn_illustration.png',
                  caption: 'Merryn Wave-Rider',
                  column: 'left',
                  slotAlign: 'left',
                  sizePreset: 'half'
                },
                {
                  id: 'b-p-right',
                  type: 'paragraph',
                  text: 'Text beside the Merryn portrait.',
                  column: 'left',
                  slotAlign: 'right',
                  sizePreset: 'half'
                }
              ]
            }
          ]
        }
      ]
    };

    useBookStore.setState({
      books: [bookWithPairedBlocks],
      activeBookId: 'test-book-paired'
    });

    render(<BookDocumentEditor bookId="test-book-paired" isGM={true} />);

    expect(screen.getByDisplayValue('Merryn Wave-Rider')).toBeInTheDocument();
    expect(screen.getByText('Text beside the Merryn portrait.')).toBeInTheDocument();
    expect(screen.queryByText('+ Add block beside this')).not.toBeInTheDocument();
  });
});

