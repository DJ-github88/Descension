import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store for GM shareables and player knowledge/journal system
const useShareableStore = create(
  persist(
    (set, get) => ({
      // GM Shareables - prepared content to show to players
      shareables: [], // { id, type: 'image' | 'text' | 'document', content, title, background, createdAt }

      // Player's received knowledge - items shared by GM
      playerKnowledge: [], // { id, type, content, title, description, receivedAt, folderId }

      // Player's personal notes - can also be added to the board
      playerNotes: [], // { id, title, content, createdAt, lastModified, folderId }

      // Currently displayed content (for Show to Players feature)
      activeDisplay: null, // { type, content, title, description }

      // Player knowledge board orbs and connections
      knowledgeOrbs: [], // { id, knowledgeId, sourceType: 'knowledge'|'note', position: {x, y}, iconType, color, boardId }
      knowledgeConnections: [], // { id, fromOrbId, toOrbId, label }

      // Folder system for organizing journal content by campaign/topic
      journalFolders: [], // { id, name, color, icon, createdAt, isDefault } - for organizing knowledge/notes
      currentFolderId: null, // Currently selected folder for filtering knowledge/notes

      // Knowledge boards - SEPARATE from folders, for organizing orbs on the board
      knowledgeBoards: [], // { id, name, color, icon, createdAt, background: { url, name } }
      currentBoardId: null, // Currently selected board for the Knowledge Board view

      // GM Actions
      addShareable: (shareable) => {
        const newShareable = {
          id: `shareable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          ...shareable
        };
        set(state => ({
          shareables: [...state.shareables, newShareable]
        }));
        return newShareable.id;
      },

      updateShareable: (id, updates) => {
        set(state => ({
          shareables: (state.shareables || []).map(s =>
            s.id === id ? { ...s, ...updates } : s
          )
        }));
      },

      removeShareable: (id) => {
        set(state => ({
          shareables: (state.shareables || []).filter(s => s.id !== id)
        }));
      },

      // Show content to players (triggers display popup)
      showToPlayers: (content) => {
        const knowledge = {
          id: `knowledge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          receivedAt: Date.now(),
          folderId: get().currentFolderId,
          ...content
        };

        set(state => ({
          activeDisplay: content,
          playerKnowledge: [...state.playerKnowledge, knowledge]
        }));

        return knowledge.id;
      },

      // Dismiss the active display
      dismissDisplay: () => {
        set({ activeDisplay: null });
      },

      // ============ FOLDER MANAGEMENT ============
      addFolder: (name, color = '#d4af37', icon = 'fa-folder') => {
        const newFolder = {
          id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          color,
          icon,
          createdAt: Date.now(),
          isDefault: false,
          background: null
        };
        set(state => ({
          journalFolders: [...state.journalFolders, newFolder]
        }));
        return newFolder.id;
      },

      updateFolder: (folderId, updates) => {
        set(state => ({
          journalFolders: (state.journalFolders || []).map(f =>
            f.id === folderId ? { ...f, ...updates } : f
          )
        }));
      },

      removeFolder: (folderId) => {
        // Move items in this folder to "uncategorized" (null folderId)
        // Note: orbs use boards, not folders, so they're not affected
        set(state => ({
          journalFolders: (state.journalFolders || []).filter(f => f.id !== folderId),
          playerKnowledge: (state.playerKnowledge || []).map(k =>
            k.folderId === folderId ? { ...k, folderId: null } : k
          ),
          playerNotes: (state.playerNotes || []).map(n =>
            n.folderId === folderId ? { ...n, folderId: null } : n
          ),
          currentFolderId: state.currentFolderId === folderId ? null : state.currentFolderId
        }));
      },

      setCurrentFolder: (folderId) => {
        set({ currentFolderId: folderId });
      },

      // ============ KNOWLEDGE BOARD MANAGEMENT (separate from folders) ============
      addKnowledgeBoard: (name, color = '#d4af37', icon = 'fa-project-diagram') => {
        const newBoard = {
          id: `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          color,
          icon,
          createdAt: Date.now(),
          background: null
        };
        set(state => ({
          knowledgeBoards: [...state.knowledgeBoards, newBoard]
        }));
        return newBoard.id;
      },

      updateKnowledgeBoard: (boardId, updates) => {
        set(state => ({
          knowledgeBoards: (state.knowledgeBoards || []).map(b =>
            b.id === boardId ? { ...b, ...updates } : b
          )
        }));
      },

      removeKnowledgeBoard: (boardId) => {
        // Move orbs in this board to "uncategorized" (null boardId)
        set(state => ({
          knowledgeBoards: (state.knowledgeBoards || []).filter(b => b.id !== boardId),
          knowledgeOrbs: (state.knowledgeOrbs || []).map(o =>
            o.boardId === boardId ? { ...o, boardId: null } : o
          ),
          currentBoardId: state.currentBoardId === boardId ? null : state.currentBoardId
        }));
      },

      setCurrentBoard: (boardId) => {
        set({ currentBoardId: boardId });
      },

      // ============ PLAYER NOTES ============
      addNote: (title, content = '') => {
        const newNote = {
          id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          content,
          createdAt: Date.now(),
          lastModified: Date.now(),
          folderId: get().currentFolderId
        };
        set(state => ({
          playerNotes: [...state.playerNotes, newNote]
        }));
        return newNote.id;
      },

      updateNote: (noteId, updates) => {
        set(state => ({
          playerNotes: (state.playerNotes || []).map(n =>
            n.id === noteId ? { ...n, ...updates, lastModified: Date.now() } : n
          )
        }));
      },

      removeNote: (noteId) => {
        // Also remove any orbs referencing this note
        set(state => ({
          playerNotes: (state.playerNotes || []).filter(n => n.id !== noteId),
          knowledgeOrbs: (state.knowledgeOrbs || []).filter(o => !(o.sourceType === 'note' && o.knowledgeId === noteId)),
          knowledgeConnections: (state.knowledgeConnections || []).filter(conn => {
            const affectedOrbIds = (state.knowledgeOrbs || [])
              .filter(o => o.sourceType === 'note' && o.knowledgeId === noteId)
              .map(o => o.id);
            return !affectedOrbIds.includes(conn.fromOrbId) && !affectedOrbIds.includes(conn.toOrbId);
          })
        }));
      },

      moveNoteToFolder: (noteId, folderId) => {
        set(state => ({
          playerNotes: (state.playerNotes || []).map(n =>
            n.id === noteId ? { ...n, folderId } : n
          )
        }));
      },

      // ============ PLAYER KNOWLEDGE ============
      updatePlayerKnowledge: (knowledgeId, updates) => {
        set(state => ({
          playerKnowledge: (state.playerKnowledge || []).map(k =>
            k.id === knowledgeId ? { ...k, ...updates } : k
          )
        }));
      },

      moveKnowledgeToFolder: (knowledgeId, folderId) => {
        set(state => ({
          playerKnowledge: (state.playerKnowledge || []).map(k =>
            k.id === knowledgeId ? { ...k, folderId } : k
          )
        }));
      },

      // Remove a piece of player knowledge
      removePlayerKnowledge: (knowledgeId) => {
        // Also remove any orbs referencing this knowledge
        set(state => ({
          playerKnowledge: (state.playerKnowledge || []).filter(k => k.id !== knowledgeId),
          knowledgeOrbs: (state.knowledgeOrbs || []).filter(o => !(o.sourceType === 'knowledge' && o.knowledgeId === knowledgeId)),
          knowledgeConnections: (state.knowledgeConnections || []).filter(conn => {
            const affectedOrbIds = (state.knowledgeOrbs || [])
              .filter(o => o.sourceType === 'knowledge' && o.knowledgeId === knowledgeId)
              .map(o => o.id);
            return !affectedOrbIds.includes(conn.fromOrbId) && !affectedOrbIds.includes(conn.toOrbId);
          })
        }));
      },

      // ============ KNOWLEDGE BOARD (ORBS & CONNECTIONS) ============
      addKnowledgeOrb: (knowledgeId, position, sourceType = 'knowledge', iconId = 'scroll', color = '#d4af37') => {
        // iconId can be:
        // - A simple ID like 'scroll', 'book' (uses built-in font-awesome icons)
        // - A path like 'Pirates/Icon19' (uses creature/ability icons)
        const newOrb = {
          id: `orb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          knowledgeId,
          sourceType, // 'knowledge' or 'note'
          position,
          iconType: iconId, // Now stores the full icon path or simple ID
          color,
          boardId: get().currentBoardId // Uses boardId, NOT folderId
        };
        set(state => ({
          knowledgeOrbs: [...state.knowledgeOrbs, newOrb]
        }));
        return newOrb.id;
      },

      updateOrbPosition: (orbId, position) => {
        set(state => ({
          knowledgeOrbs: (state.knowledgeOrbs || []).map(orb =>
            orb.id === orbId ? { ...orb, position } : orb
          )
        }));
      },

      updateOrb: (orbId, updates) => {
        set(state => ({
          knowledgeOrbs: (state.knowledgeOrbs || []).map(orb =>
            orb.id === orbId ? { ...orb, ...updates } : orb
          )
        }));
      },

      removeOrb: (orbId) => {
        set(state => ({
          knowledgeOrbs: (state.knowledgeOrbs || []).filter(orb => orb.id !== orbId),
          knowledgeConnections: (state.knowledgeConnections || []).filter(
            conn => conn.fromOrbId !== orbId && conn.toOrbId !== orbId
          )
        }));
      },

      addConnection: (fromOrbId, toOrbId, label = '') => {
        // Don't create duplicate connections
        const existing = get().knowledgeConnections.find(
          conn => (conn.fromOrbId === fromOrbId && conn.toOrbId === toOrbId) ||
            (conn.fromOrbId === toOrbId && conn.toOrbId === fromOrbId)
        );
        if (existing) return existing.id;

        const newConnection = {
          id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fromOrbId,
          toOrbId,
          label
        };
        set(state => ({
          knowledgeConnections: [...state.knowledgeConnections, newConnection]
        }));
        return newConnection.id;
      },

      updateConnection: (connectionId, updates) => {
        set(state => ({
          knowledgeConnections: (state.knowledgeConnections || []).map(conn =>
            conn.id === connectionId ? { ...conn, ...updates } : conn
          )
        }));
      },

      removeConnection: (connectionId) => {
        set(state => ({
          knowledgeConnections: (state.knowledgeConnections || []).filter(conn => conn.id !== connectionId)
        }));
      },

      // Clear all player knowledge (for new campaign)
      clearPlayerKnowledge: () => {
        set({
          playerKnowledge: [],
          playerNotes: [],
          knowledgeOrbs: [],
          knowledgeConnections: []
        });
      },

      // Clear specific folder's content (knowledge and notes only - orbs use boards)
      clearFolderContent: (folderId) => {
        set(state => ({
          playerKnowledge: (state.playerKnowledge || []).filter(k => k.folderId !== folderId),
          playerNotes: (state.playerNotes || []).filter(n => n.folderId !== folderId)
        }));
      },

      // Clear specific board's orbs and connections
      clearBoardContent: (boardId) => {
        set(state => ({
          knowledgeOrbs: (state.knowledgeOrbs || []).filter(o => o.boardId !== boardId),
          knowledgeConnections: (state.knowledgeConnections || []).filter(conn => {
            const orbsInBoard = (state.knowledgeOrbs || []).filter(o => o.boardId === boardId).map(o => o.id);
            return !orbsInBoard.includes(conn.fromOrbId) && !orbsInBoard.includes(conn.toOrbId);
          })
        }));
      },

      // ============ GETTERS ============
      getKnowledgeById: (id) => {
        return get().playerKnowledge.find(k => k.id === id);
      },

      getNoteById: (id) => {
        return get().playerNotes.find(n => n.id === id);
      },

      getOrbById: (id) => {
        return get().knowledgeOrbs.find(o => o.id === id);
      },

      getFolderById: (id) => {
        return get().journalFolders.find(f => f.id === id);
      },

      // Get content (knowledge or note) by ID and source type
      getContentByOrb: (orb) => {
        if (orb.sourceType === 'note') {
          return get().playerNotes.find(n => n.id === orb.knowledgeId);
        }
        return get().playerKnowledge.find(k => k.id === orb.knowledgeId);
      },

      // Get all items for current folder (or all if no folder selected)
      getFilteredKnowledge: () => {
        const { playerKnowledge, currentFolderId } = get();
        if (!currentFolderId) return playerKnowledge;
        return playerKnowledge.filter(k => k.folderId === currentFolderId || k.folderId === null);
      },

      getFilteredNotes: () => {
        const { playerNotes, currentFolderId } = get();
        if (!currentFolderId) return playerNotes;
        return playerNotes.filter(n => n.folderId === currentFolderId || n.folderId === null);
      },

      getFilteredOrbs: () => {
        const { knowledgeOrbs, currentBoardId } = get();
        if (!currentBoardId) return knowledgeOrbs;
        return knowledgeOrbs.filter(o => o.boardId === currentBoardId || o.boardId === null);
      },

      // ============ BOARD BACKGROUND ============
      // Get background for current board (or null if no board selected)
      getBoardBackground: () => {
        const { currentBoardId, knowledgeBoards } = get();
        if (!currentBoardId) return null;
        const board = knowledgeBoards.find(b => b.id === currentBoardId);
        return board?.background || null;
      },

      setBoardBackground: (background) => {
        const { currentBoardId } = get();
        if (!currentBoardId) {
          // If no board selected, can't set background
          console.warn('Cannot set board background: no board selected');
          return;
        }
        set(state => ({
          knowledgeBoards: (state.knowledgeBoards || []).map(b =>
            b.id === currentBoardId ? { ...b, background } : b
          )
        }));
      },

      clearBoardBackground: () => {
        const { currentBoardId } = get();
        if (!currentBoardId) return;
        set(state => ({
          knowledgeBoards: (state.knowledgeBoards || []).map(b =>
            b.id === currentBoardId ? { ...b, background: null } : b
          )
        }));
      }
    }),
    {
      name: 'mythrill-shareable-storage',
      version: 5,
      migrate: (persistedState, version) => {
        let state = { ...persistedState };

        if (version < 2) {
          // Migration from v1: add new folder-related fields
          state = {
            ...state,
            playerNotes: state.playerNotes || [],
            journalFolders: state.journalFolders || [],
            currentFolderId: null
          };
        }

        if (version < 3) {
          // Migration from v2: move boardBackground to folders
          const { boardBackground, journalFolders } = state;
          let updatedFolders = journalFolders || [];
          if (boardBackground && updatedFolders.length > 0) {
            updatedFolders = updatedFolders.map((f, i) =>
              i === 0 ? { ...f, background: boardBackground } : { ...f, background: null }
            );
          } else if (boardBackground && updatedFolders.length === 0) {
            updatedFolders = [{
              id: `folder-${Date.now()}`,
              name: 'Default',
              color: '#d4af37',
              icon: 'fa-folder',
              createdAt: Date.now(),
              isDefault: true,
              background: boardBackground
            }];
          } else {
            updatedFolders = updatedFolders.map(f => ({ ...f, background: f.background || null }));
          }
          state = {
            ...state,
            journalFolders: updatedFolders,
            boardBackground: undefined
          };
        }

        if (version < 4) {
          // Migration from v3: separate boards from folders
          // Move folders with backgrounds to boards, and update orbs to use boardId
          const { journalFolders = [], knowledgeOrbs = [], currentFolderId } = state;

          // Create boards from folders (copy folders that have content on boards)
          const knowledgeBoards = journalFolders.map(f => ({
            id: f.id.replace('folder-', 'board-'), // Create new board ID
            name: f.name,
            color: f.color,
            icon: f.icon || 'fa-project-diagram',
            createdAt: f.createdAt,
            background: f.background || null
          }));

          // Update orbs to use boardId instead of folderId
          // Map old folderId to new boardId
          const updatedOrbs = knowledgeOrbs.map(o => {
            const oldFolderId = o.folderId;
            const newBoardId = oldFolderId ? oldFolderId.replace('folder-', 'board-') : null;
            return {
              ...o,
              boardId: newBoardId,
              folderId: undefined // Remove old folderId from orbs
            };
          });

          // Remove background from folders (folders no longer need backgrounds)
          const updatedFolders = journalFolders.map(f => ({
            ...f,
            background: undefined
          }));

          // Update currentBoardId based on currentFolderId
          const currentBoardId = currentFolderId ? currentFolderId.replace('folder-', 'board-') : null;

          state = {
            ...state,
            journalFolders: updatedFolders,
            knowledgeBoards,
            knowledgeOrbs: updatedOrbs,
            currentBoardId,
            currentFolderId: null // Reset folder selection
          };
        }

        if (version < 5) {
          // Migration from v4: Clean up duplicate boards created from folders
          // The v4 migration incorrectly created a board for EVERY folder, causing confusion.
          // Now we:
          // 1. Remove boards that were auto-created from folders (have matching folder)
          // 2. Keep only boards that are truly independent OR have orbs
          // 3. Each board gets its own independent background (not shared)
          const { knowledgeBoards = [], journalFolders = [], knowledgeOrbs = [] } = state;

          // Find board IDs that have orbs (we need to keep these)
          const boardIdsWithOrbs = new Set(knowledgeOrbs.map(o => o.boardId).filter(Boolean));

          // Find boards that were auto-migrated from folders (board-xxx matches folder-xxx)
          const folderIds = new Set(journalFolders.map(f => f.id));

          // Keep only boards that:
          // 1. Have orbs on them, OR
          // 2. Were NOT auto-created from a folder (don't have a matching folder)
          const cleanedBoards = knowledgeBoards.filter(board => {
            const matchingFolderId = board.id.replace('board-', 'folder-');
            const wasAutoCreatedFromFolder = folderIds.has(matchingFolderId);
            const hasOrbs = boardIdsWithOrbs.has(board.id);

            // Keep if it has orbs OR wasn't auto-created from a folder
            return hasOrbs || !wasAutoCreatedFromFolder;
          });

          // Update orbs that reference removed boards to have null boardId
          const remainingBoardIds = new Set(cleanedBoards.map(b => b.id));
          const updatedOrbs = knowledgeOrbs.map(o => {
            if (o.boardId && !remainingBoardIds.has(o.boardId)) {
              return { ...o, boardId: null };
            }
            return o;
          });

          // Reset currentBoardId if the board was removed
          const currentBoardId = state.currentBoardId && remainingBoardIds.has(state.currentBoardId)
            ? state.currentBoardId
            : null;

          state = {
            ...state,
            knowledgeBoards: cleanedBoards,
            knowledgeOrbs: updatedOrbs,
            currentBoardId
          };
        }

        return state;
      }
    }
  )
);

export default useShareableStore;
