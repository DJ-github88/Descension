import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const memoryStore = new Map();

// Safe localStorage adapter that proactively sanitizes payloads and provides in-memory fallback
const safeStorageEngine = {
  getItem: (name) => {
    try {
      const fromLocal = localStorage.getItem(name);
      if (fromLocal !== null && fromLocal !== undefined) return fromLocal;
    } catch (e) {
      console.warn(`[SafeStorage] Could not read ${name} from localStorage:`, e);
    }
    return memoryStore.get(name) || null;
  },
  setItem: (name, value) => {
    // 1. Keep in-memory copy so data is always accessible in current session
    memoryStore.set(name, value);

    // 2. Proactively sanitize value before attempting to store in localStorage
    let sanitizedValue = value;
    try {
      const parsed = JSON.parse(value);
      if (parsed && parsed.state) {
        const state = parsed.state;
        // Trim large base64 image attachments from notes
        if (Array.isArray(state.playerNotes)) {
          state.playerNotes = state.playerNotes.map(n => ({
            ...n,
            image: n.image && n.image.length > 20000 ? null : n.image
          }));
        }
        // Trim heavy base64 background URLs from boards
        if (Array.isArray(state.knowledgeBoards)) {
          state.knowledgeBoards = state.knowledgeBoards.map(b => ({
            ...b,
            background: b.background?.url && b.background.url.length > 20000 ? null : b.background
          }));
        }
        // Trim heavy custom images from orbs
        if (Array.isArray(state.knowledgeOrbs)) {
          state.knowledgeOrbs = state.knowledgeOrbs.map(o => ({
            ...o,
            customImage: o.customImage && o.customImage.length > 20000 ? null : o.customImage
          }));
        }
        sanitizedValue = JSON.stringify(parsed);
      }
    } catch (parseErr) {
      // Use value directly
    }

    try {
      localStorage.setItem(name, sanitizedValue);
    } catch (e) {
      console.warn(`[SafeStorage] Storage quota reached for ${name}. Retrying with key cleanup...`, e);
      try {
        const heavyKeys = ['mythrill_subregion_polygons', 'mythrill_map_history_backup', 'mythrill-debug-log'];
        heavyKeys.forEach(k => {
          try { localStorage.removeItem(k); } catch (_) {}
        });
        localStorage.setItem(name, sanitizedValue);
      } catch (finalErr) {
        // Safely swallow error so the application NEVER crashes
        console.warn(`[SafeStorage] Saved to in-memory fallback successfully.`);
      }
    }
  },
  removeItem: (name) => {
    memoryStore.delete(name);
    try {
      localStorage.removeItem(name);
    } catch (e) {
      console.warn(`[SafeStorage] Could not remove ${name}:`, e);
    }
  }
};

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
      knowledgeOrbs: [], // { id, knowledgeId, sourceType: 'knowledge'|'note', position: {x, y}, iconType, color, boardId, linkedBoardId }
      knowledgeConnections: [], // { id, fromOrbId, toOrbId, label }

      // Folder system for organizing journal content by campaign/topic
      journalFolders: [], // { id, name, color, icon, createdAt, isDefault } - for organizing knowledge/notes
      currentFolderId: null, // Currently selected folder for filtering knowledge/notes

      // Knowledge boards - SEPARATE from folders, for organizing orbs on the board
      knowledgeBoards: [], // { id, name, color, icon, createdAt, parentBoardId, background: { url, name } }
      masterBoardBackground: null, // Background for the Master Overview Board (when currentBoardId is null)
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

      // ============ FIREBASE CLOUD SYNC ============
      syncToCloud: async (userId) => {
        if (!userId || String(userId).startsWith('guest-')) return;
        try {
          const { default: journalService } = await import('../services/firebase/journalService');
          const state = get();
          await journalService.saveJournal(userId, {
            playerKnowledge: state.playerKnowledge,
            playerNotes: state.playerNotes,
            journalFolders: state.journalFolders,
            knowledgeBoards: state.knowledgeBoards,
            masterBoardBackground: state.masterBoardBackground,
            knowledgeOrbs: state.knowledgeOrbs,
            knowledgeConnections: state.knowledgeConnections,
            currentFolderId: state.currentFolderId,
            currentBoardId: state.currentBoardId
          });
        } catch (err) {
          console.warn('[shareableStore] Cloud sync error:', err);
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || String(userId).startsWith('guest-')) return;
        try {
          const { default: journalService } = await import('../services/firebase/journalService');
          const cloudData = await journalService.loadJournal(userId);
          if (cloudData && (cloudData.playerNotes?.length || cloudData.knowledgeBoards?.length || cloudData.playerKnowledge?.length || cloudData.masterBoardBackground)) {
            set(state => ({
              playerKnowledge: cloudData.playerKnowledge || state.playerKnowledge,
              playerNotes: cloudData.playerNotes || state.playerNotes,
              journalFolders: cloudData.journalFolders || state.journalFolders,
              knowledgeBoards: cloudData.knowledgeBoards || state.knowledgeBoards,
              masterBoardBackground: cloudData.masterBoardBackground !== undefined ? cloudData.masterBoardBackground : state.masterBoardBackground,
              knowledgeOrbs: cloudData.knowledgeOrbs || state.knowledgeOrbs,
              knowledgeConnections: cloudData.knowledgeConnections || state.knowledgeConnections
            }));
          }
        } catch (err) {
          console.warn('[shareableStore] Cloud hydration error:', err);
        }
      },

      // ============ PLAYER NOTES ============
      addNote: (title, content = '', image = null) => {
        const newNote = {
          id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          content,
          image,
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

      addTagToOrb: (orbId, tag) => {
        const cleanTag = (tag || '').trim();
        if (!cleanTag) return;
        set(state => ({
          knowledgeOrbs: (state.knowledgeOrbs || []).map(o => {
            if (o.id === orbId) {
              const existingTags = o.tags || [];
              if (!existingTags.includes(cleanTag)) {
                return { ...o, tags: [...existingTags, cleanTag] };
              }
            }
            return o;
          })
        }));
      },

      removeTagFromOrb: (orbId, tag) => {
        set(state => ({
          knowledgeOrbs: (state.knowledgeOrbs || []).map(o => {
            if (o.id === orbId) {
              return { ...o, tags: (o.tags || []).filter(t => t !== tag) };
            }
            return o;
          })
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
        if (!fromOrbId || !toOrbId || fromOrbId === toOrbId) return null;
        const connections = get().knowledgeConnections || [];
        // Don't create duplicate connections
        const existing = connections.find(
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
          knowledgeConnections: [...(state.knowledgeConnections || []), newConnection]
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
        if (!orb) return null;
        if (orb.sourceType === 'note') {
          const note = get().playerNotes.find(n => n.id === orb.knowledgeId);
          if (note) {
            return {
              ...note,
              title: orb.label || note.title || 'Note',
              content: orb.content !== undefined ? orb.content : note.content,
              tags: orb.tags || note.tags || (orb.entityType ? [orb.entityType.toUpperCase()] : ['NOTE']),
              entityType: orb.entityType || 'note',
              image: orb.customImage || (orb.iconType && (orb.iconType.startsWith('data:') || orb.iconType.startsWith('http') || orb.iconType.startsWith('blob:')) ? orb.iconType : null) || note.image
            };
          }
        }
        if (orb.sourceType === 'knowledge') {
          const knowledge = get().playerKnowledge.find(k => k.id === orb.knowledgeId);
          if (knowledge) {
            return {
              ...knowledge,
              title: orb.label || knowledge.title || 'Knowledge',
              content: orb.content !== undefined ? orb.content : knowledge.content,
              tags: orb.tags || (orb.entityType ? [orb.entityType.toUpperCase()] : ['KNOWLEDGE']),
              entityType: orb.entityType || 'knowledge',
              image: orb.customImage || (orb.iconType && (orb.iconType.startsWith('data:') || orb.iconType.startsWith('http') || orb.iconType.startsWith('blob:')) ? orb.iconType : null) || knowledge.image || (knowledge.type === 'image' ? knowledge.content : null)
            };
          }
        }
        // Fallback for standalone or custom orbs
        return {
          id: orb.id,
          title: orb.label || 'Knowledge Record',
          content: orb.content || orb.description || '',
          tags: orb.tags || (orb.entityType ? [orb.entityType.toUpperCase()] : ['NOTE']),
          entityType: orb.entityType || 'note',
          image: orb.customImage || (orb.iconType && (orb.iconType.startsWith('data:') || orb.iconType.startsWith('http') || orb.iconType.startsWith('blob:')) ? orb.iconType : null) || null
        };
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
      // Get background for current board (or master board background if no board selected)
      getBoardBackground: () => {
        const { currentBoardId, knowledgeBoards, masterBoardBackground } = get();
        if (!currentBoardId) return masterBoardBackground || null;
        const board = knowledgeBoards.find(b => b.id === currentBoardId);
        return board?.background || null;
      },

      setBoardBackground: (background) => {
        const { currentBoardId } = get();
        if (!currentBoardId) {
          set({ masterBoardBackground: background });
          return;
        }
        set(state => ({
          knowledgeBoards: (state.knowledgeBoards || []).map(b =>
            b.id === currentBoardId ? { ...b, background } : b
          )
        }));
      },

      // ============ SUB-BOARDS & NODE-BASED DIVE-IN NAVIGATION ============
      linkOrbToBoard: (orbId, targetBoardId) => {
        set(state => ({
          knowledgeOrbs: (state.knowledgeOrbs || []).map(o =>
            o.id === orbId ? { ...o, linkedBoardId: targetBoardId } : o
          )
        }));
      },

      unlinkOrbBoard: (orbId) => {
        set(state => ({
          knowledgeOrbs: (state.knowledgeOrbs || []).map(o =>
            o.id === orbId ? { ...o, linkedBoardId: null } : o
          )
        }));
      },

      createSubBoardForOrb: (orbId, boardName = '', autoNavigate = true) => {
        const { currentBoardId, knowledgeOrbs } = get();
        const orb = knowledgeOrbs.find(o => o.id === orbId);
        const name = boardName.trim() || (orb ? (orb.label || 'Sub-Board') : 'Sub-Board');
        const newBoardId = `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newBoard = {
          id: newBoardId,
          name,
          color: orb?.color || '#d4af37',
          icon: orb?.iconType || 'fa-project-diagram',
          parentBoardId: currentBoardId || null,
          createdAt: Date.now(),
          background: null
        };

        // Create an anchor central orb inside the new sub-board for this entity
        const anchorOrb = orb ? {
          id: `orb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          knowledgeId: orb.knowledgeId,
          sourceType: orb.sourceType,
          label: orb.label || name,
          position: { x: 300, y: 160 },
          iconType: orb.iconType || 'scroll',
          customImage: orb.customImage || null,
          color: orb.color || '#d4af37',
          tags: orb.tags || [],
          entityType: orb.entityType || 'note',
          boardId: newBoardId,
          isAnchor: true
        } : null;

        set(state => ({
          knowledgeBoards: [...state.knowledgeBoards, newBoard],
          knowledgeOrbs: [
            ...(state.knowledgeOrbs || []).map(o =>
              o.id === orbId ? { ...o, linkedBoardId: newBoardId } : o
            ),
            ...(anchorOrb ? [anchorOrb] : [])
          ],
          currentBoardId: autoNavigate ? newBoardId : state.currentBoardId
        }));

        return newBoardId;
      },

      // Add a campaign entity (NPC, Location, Quest, Item, Creature, Faction, Lore) as an Orb directly on the board!
      addCampaignEntityAsOrb: (entity, entityType = 'general', position = null, targetBoardId = null) => {
        const { currentBoardId, knowledgeOrbs } = get();
        const activeBoardId = targetBoardId !== null ? targetBoardId : currentBoardId;
        const count = (knowledgeOrbs || []).filter(o => o.boardId === activeBoardId).length;

        // Position on an orderly grid if none specified
        const posX = position?.x ?? (80 + ((count % 4) * 160));
        const posY = position?.y ?? (80 + (Math.floor(count / 4) * 140));

        let icon = 'scroll';
        let color = '#d4af37';
        const title = entity.name || entity.title || 'Unknown Entity';
        const content = entity.description || entity.content || entity.notes || entity.properties || '';
        const normType = entityType.toLowerCase();
        const initialTags = [entityType.toUpperCase()];

        switch (normType) {
          case 'npc':
            icon = 'user';
            color = '#3498db';
            break;
          case 'location':
            icon = 'location';
            color = '#e67e22';
            break;
          case 'faction':
            icon = 'shield';
            color = '#9b59b6';
            break;
          case 'quest':
            icon = 'star';
            color = '#f1c40f';
            break;
          case 'item':
          case 'weapon':
            icon = 'gem';
            color = '#2ecc71';
            break;
          case 'monster':
          case 'creature':
            icon = 'dragon';
            color = '#e74c3c';
            break;
          case 'lore':
            icon = 'book';
            color = '#8b5a1a';
            break;
          case 'dynasty':
          case 'bloodline':
            icon = 'scroll';
            color = '#d4af37';
            break;
          case 'map':
          case 'atlas':
            icon = 'location';
            color = '#2980b9';
            break;
          default:
            icon = 'scroll';
            color = '#d4af37';
        }

        const noteId = `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNote = {
          id: noteId,
          title,
          content: `${content ? content + '\n\n' : ''}*Imported from Campaign (${entityType.toUpperCase()})*`,
          image: entity.image || entity.avatar || entity.banner || null,
          tags: initialTags,
          entityType: normType,
          createdAt: Date.now(),
          lastModified: Date.now(),
          folderId: null
        };

        const newOrbId = `orb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newOrb = {
          id: newOrbId,
          knowledgeId: noteId,
          sourceType: 'note',
          position: { x: posX, y: posY },
          iconType: icon,
          color,
          label: title,
          tags: initialTags,
          entityType: normType,
          boardId: activeBoardId,
          linkedBoardId: null
        };

        set(state => ({
          playerNotes: [...state.playerNotes, newNote],
          knowledgeOrbs: [...state.knowledgeOrbs, newOrb]
        }));

        return { orbId: newOrbId, noteId };
      },

      getBoardBreadcrumbs: () => {
        const { currentBoardId, knowledgeBoards } = get();
        if (!currentBoardId) return [];
        const crumbs = [];
        let curId = currentBoardId;
        const visited = new Set();
        while (curId && !visited.has(curId)) {
          visited.add(curId);
          const b = knowledgeBoards.find(x => x.id === curId);
          if (b) {
            crumbs.unshift(b);
            curId = b.parentBoardId;
          } else {
            break;
          }
        }
        return crumbs;
      },

      clearBoardBackground: () => {
        const { currentBoardId } = get();
        if (!currentBoardId) {
          set({ masterBoardBackground: null });
          return;
        }
        set(state => ({
          knowledgeBoards: (state.knowledgeBoards || []).map(b =>
            b.id === currentBoardId ? { ...b, background: null } : b
          )
        }));
      },

      toggleBoardBgMode: () => {
        const { currentBoardId, masterBoardBackground } = get();
        if (!currentBoardId) {
          if (masterBoardBackground) {
            const curMode = masterBoardBackground.bgMode || 'canvas';
            const nextMode = curMode === 'canvas' ? 'static' : 'canvas';
            set({
              masterBoardBackground: { ...masterBoardBackground, bgMode: nextMode }
            });
          }
          return;
        }
        set(state => ({
          knowledgeBoards: (state.knowledgeBoards || []).map(b => {
            if (b.id === currentBoardId && b.background) {
              const curMode = b.background.bgMode || 'canvas';
              const nextMode = curMode === 'canvas' ? 'static' : 'canvas';
              return {
                ...b,
                background: { ...b.background, bgMode: nextMode }
              };
            }
            return b;
          })
        }));
      },

      // ============ OBSIDIAN-STYLE BI-DIRECTIONAL LINKING & MENTIONS ============
      /**
       * Returns all notes, knowledge items, and orbs that explicitly link to `targetTitle` via [[targetTitle]]
       */
      getLinkedReferences: (targetTitle) => {
        if (!targetTitle || typeof targetTitle !== 'string') return [];
        const cleanTarget = targetTitle.trim().toLowerCase();
        const state = get();
        const results = [];

        // 1. Scan Player Notes
        (state.playerNotes || []).forEach(note => {
          if (!note.content) return;
          const matches = note.content.match(/\[\[([^\]]+)\]\]/g);
          if (matches) {
            const hasLink = matches.some(m => m.slice(2, -2).trim().toLowerCase() === cleanTarget);
            if (hasLink && note.title?.toLowerCase() !== cleanTarget) {
              results.push({
                id: note.id,
                title: note.title || 'Untitled Note',
                type: 'note',
                sourceType: 'note',
                updatedAt: note.lastModified || note.createdAt
              });
            }
          }
        });

        // 2. Scan Player Knowledge / Lore
        (state.playerKnowledge || []).forEach(k => {
          const fullText = `${k.title || ''} ${k.description || ''} ${typeof k.content === 'string' ? k.content : ''}`;
          const matches = fullText.match(/\[\[([^\]]+)\]\]/g);
          if (matches) {
            const hasLink = matches.some(m => m.slice(2, -2).trim().toLowerCase() === cleanTarget);
            if (hasLink && k.title?.toLowerCase() !== cleanTarget) {
              results.push({
                id: k.id,
                title: k.title || 'Lore Entry',
                type: k.type || 'knowledge',
                sourceType: 'knowledge',
                updatedAt: k.receivedAt
              });
            }
          }
        });

        // 3. Scan Knowledge Orbs
        (state.knowledgeOrbs || []).forEach(orb => {
          if (!orb.customDescription) return;
          const matches = orb.customDescription.match(/\[\[([^\]]+)\]\]/g);
          if (matches) {
            const hasLink = matches.some(m => m.slice(2, -2).trim().toLowerCase() === cleanTarget);
            if (hasLink && orb.customTitle?.toLowerCase() !== cleanTarget) {
              results.push({
                id: orb.id,
                title: orb.customTitle || 'Knowledge Orb',
                type: 'orb',
                sourceType: 'orb',
                boardId: orb.boardId
              });
            }
          }
        });

        return results;
      },

      /**
       * Scans all notes/lore for plain text occurrences of `targetTitle` that are NOT already wrapped in [[ ]]
       */
      getUnlinkedMentions: (targetTitle, currentSourceId = null) => {
        if (!targetTitle || typeof targetTitle !== 'string' || targetTitle.trim().length < 3) return [];
        const cleanTarget = targetTitle.trim();
        const lowerTarget = cleanTarget.toLowerCase();
        const state = get();
        const mentions = [];

        const escaped = cleanTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!\\[\\[)\\b(${escaped})\\b(?!\\]\\])`, 'gi');

        // Scan Notes
        (state.playerNotes || []).forEach(note => {
          if (note.id === currentSourceId || !note.content) return;
          if (regex.test(note.content)) {
            const idx = note.content.toLowerCase().indexOf(lowerTarget);
            const start = Math.max(0, idx - 35);
            const end = Math.min(note.content.length, idx + lowerTarget.length + 35);
            const excerpt = (start > 0 ? '...' : '') + note.content.slice(start, end).trim() + (end < note.content.length ? '...' : '');

            mentions.push({
              id: note.id,
              title: note.title || 'Untitled Note',
              type: 'note',
              sourceType: 'note',
              excerpt
            });
          }
        });

        // Scan Knowledge Items
        (state.playerKnowledge || []).forEach(k => {
          if (k.id === currentSourceId) return;
          const text = k.description || (typeof k.content === 'string' ? k.content : '');
          if (text && regex.test(text)) {
            const idx = text.toLowerCase().indexOf(lowerTarget);
            const start = Math.max(0, idx - 35);
            const end = Math.min(text.length, idx + lowerTarget.length + 35);
            const excerpt = (start > 0 ? '...' : '') + text.slice(start, end).trim() + (end < text.length ? '...' : '');

            mentions.push({
              id: k.id,
              title: k.title || 'Lore Entry',
              type: k.type || 'knowledge',
              sourceType: 'knowledge',
              excerpt
            });
          }
        });

        // Scan Orbs
        (state.knowledgeOrbs || []).forEach(orb => {
          if (orb.id === currentSourceId || !orb.customDescription) return;
          if (regex.test(orb.customDescription)) {
            const text = orb.customDescription;
            const idx = text.toLowerCase().indexOf(lowerTarget);
            const start = Math.max(0, idx - 35);
            const end = Math.min(text.length, idx + lowerTarget.length + 35);
            const excerpt = (start > 0 ? '...' : '') + text.slice(start, end).trim() + (end < text.length ? '...' : '');

            mentions.push({
              id: orb.id,
              title: orb.customTitle || 'Knowledge Orb',
              type: 'orb',
              sourceType: 'orb',
              boardId: orb.boardId,
              excerpt
            });
          }
        });

        return mentions;
      },

      /**
       * 1-Click link converter: Replaces plain text targetTitle with [[targetTitle]] in the target item
       */
      convertUnlinkedMention: (sourceType, sourceId, targetTitle) => {
        if (!targetTitle || !sourceId) return;
        const cleanTarget = targetTitle.trim();
        const escaped = cleanTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!\\[\\[)\\b(${escaped})\\b(?!\\]\\])`, 'gi');

        if (sourceType === 'note') {
          set(state => ({
            playerNotes: (state.playerNotes || []).map(n => {
              if (n.id !== sourceId || !n.content) return n;
              return {
                ...n,
                content: n.content.replace(regex, `[[${cleanTarget}]]`),
                lastModified: Date.now()
              };
            })
          }));
        } else if (sourceType === 'knowledge') {
          set(state => ({
            playerKnowledge: (state.playerKnowledge || []).map(k => {
              if (k.id !== sourceId) return k;
              return {
                ...k,
                description: k.description ? k.description.replace(regex, `[[${cleanTarget}]]`) : k.description,
                content: typeof k.content === 'string' ? k.content.replace(regex, `[[${cleanTarget}]]`) : k.content
              };
            })
          }));
        } else if (sourceType === 'orb') {
          set(state => ({
            knowledgeOrbs: (state.knowledgeOrbs || []).map(o => {
              if (o.id !== sourceId || !o.customDescription) return o;
              return {
                ...o,
                customDescription: o.customDescription.replace(regex, `[[${cleanTarget}]]`)
              };
            })
          }));
        }
      }
    }),
    {
      name: 'mythrill-shareable-storage',
      storage: createJSONStorage(() => safeStorageEngine),
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
