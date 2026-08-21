import useShareableStore from '../shareableStore';

describe('shareableStore - Wiki & Worldbuilding Extensions', () => {
  beforeEach(() => {
    useShareableStore.setState({
      playerNotes: [],
      knowledgeOrbs: [],
      knowledgeConnections: [],
      knowledgeBoards: [],
      currentBoardId: 'board-1',
      currentFolderId: null
    });
  });

  test('adds note with archetypes, aliases, and tags', () => {
    const noteId = useShareableStore.getState().addNote('Lord Vaelen', 'Leader of the Obsidian Vanguard.', {
      archetype: 'npc',
      aliases: ['Vaelen', 'The Vanguard Lord'],
      tags: ['noble', 'nordhalla']
    });

    const notes = useShareableStore.getState().playerNotes;
    expect(notes.length).toBe(1);
    expect(notes[0].id).toBe(noteId);
    expect(notes[0].title).toBe('Lord Vaelen');
    expect(notes[0].archetype).toBe('npc');
    expect(notes[0].aliases).toEqual(['Vaelen', 'The Vanguard Lord']);
    expect(notes[0].tags).toEqual(['noble', 'nordhalla']);
  });

  test('refactors entity names across multiple notes', () => {
    useShareableStore.setState({
      playerNotes: [
        {
          id: 'note-1',
          title: 'Chapter 1',
          content: 'The heroes met [[Lord Vaelen]] near the gates. [[Lord Vaelen|The Lord]] was quiet.',
          lastModified: Date.now()
        },
        {
          id: 'note-2',
          title: 'Chapter 2',
          content: 'Consult [[Lord Vaelen#Backstory]] for details.',
          lastModified: Date.now()
        },
        {
          id: 'note-3',
          title: 'Unrelated Note',
          content: 'Nothing here.',
          lastModified: Date.now()
        }
      ]
    });

    const count = useShareableStore.getState().renameEntityRefactor('Lord Vaelen', 'Duke Vaelen');
    expect(count).toBe(3);

    const notes = useShareableStore.getState().playerNotes;
    expect(notes[0].content).toBe('The heroes met [[Duke Vaelen]] near the gates. [[Duke Vaelen|The Lord]] was quiet.');
    expect(notes[1].content).toBe('Consult [[Duke Vaelen#Backstory]] for details.');
    expect(notes[2].content).toBe('Nothing here.');
  });

  test('converts unlinked mentions into wiki-links without duplicating existing links', () => {
    const noteId = useShareableStore.getState().addNote('Campaign Log', 'The party arrived at Nordhalla. [[Nordhalla]] was cold, but Nordhalla remains strong.');
    
    const count = useShareableStore.getState().convertUnlinkedMentions(noteId, 'Nordhalla');
    expect(count).toBe(2);

    const note = useShareableStore.getState().playerNotes.find(n => n.id === noteId);
    expect(note.content).toBe('The party arrived at [[Nordhalla]]. [[Nordhalla]] was cold, but [[Nordhalla]] remains strong.');
  });

  test('auto-wires knowledge connections on board based on wiki-links', () => {
    const note1Id = useShareableStore.getState().addNote('The Sunken Keep', 'Rumors speak of [[The Void Cult]] lurking beneath.');
    const note2Id = useShareableStore.getState().addNote('The Void Cult', 'A secret society worshiping the fallen star.');

    useShareableStore.setState({
      currentBoardId: 'board-1',
      knowledgeOrbs: [
        { id: 'orb-1', knowledgeId: note1Id, sourceType: 'note', boardId: 'board-1' },
        { id: 'orb-2', knowledgeId: note2Id, sourceType: 'note', boardId: 'board-1' }
      ],
      knowledgeConnections: []
    });

    const wiredCount = useShareableStore.getState().autoWireKnowledgeBoard('board-1');
    expect(wiredCount).toBe(1);

    const connections = useShareableStore.getState().knowledgeConnections;
    expect(connections.length).toBe(1);
    expect(connections[0].fromOrbId).toBe('orb-1');
    expect(connections[0].toOrbId).toBe('orb-2');
  });

  test('sprouts referenced lore orbs onto the board', () => {
    const note1Id = useShareableStore.getState().addNote('Main Quest', 'Explore [[Frostwood Reach]] and defeat [[The Frost Witch]].');
    const note2Id = useShareableStore.getState().addNote('Frostwood Reach', 'Dense pine forest.');
    const note3Id = useShareableStore.getState().addNote('The Frost Witch', 'Powerful sorceress.');

    useShareableStore.setState({
      currentBoardId: 'board-1',
      knowledgeOrbs: [
        { id: 'orb-main', knowledgeId: note1Id, sourceType: 'note', boardId: 'board-1', position: { x: 100, y: 100 } }
      ],
      knowledgeConnections: []
    });

    const sprouted = useShareableStore.getState().sproutOrbConnections('orb-main');
    expect(sprouted).toBe(2);

    const orbs = useShareableStore.getState().knowledgeOrbs;
    expect(orbs.length).toBe(3);

    const connections = useShareableStore.getState().knowledgeConnections;
    expect(connections.length).toBe(2);
  });
});
