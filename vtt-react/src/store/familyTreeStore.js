import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

// Built-in starter family tree demo data (House Alduin / Tolavarak Dynasty)
const DEFAULT_STARTER_TREES = [
  {
    id: 'tree-alduin',
    name: 'House Alduin — The High Kings of Nordhalla',
    description: 'The ancient ruling dynasty of the Frostwood Reach and Nordhalla high peaks.',
    coverImage: '/assets/images/backgrounds/nordhalla.jpeg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'node-nikolaos',
        name: 'Nikolaos Alduin',
        title: 'High King',
        lifespan: '750 - 825',
        role: 'Ruler of the Realm',
        portraitUrl: '/assets/images/characters/high-king.jpg',
        gender: 'male',
        isDeceased: true,
        generationTier: 1,
        position: { x: 300, y: 120 },
        notes: 'Founder of the Unified Frostwood Compact. Known for forging the Obsidian Crown.',
        lineageId: 'canon-human',
        npcId: null
      },
      {
        id: 'node-serena',
        name: 'Serena Tolavarak',
        title: 'High Queen Consort',
        lifespan: '760 - 835',
        role: 'Matriarch of the Vale',
        portraitUrl: '/assets/images/characters/queen-serena.jpg',
        gender: 'female',
        isDeceased: true,
        generationTier: 1,
        position: { x: 540, y: 120 },
        notes: 'Eldest daughter of House Tolavarak. Master diplomat during the War of Ash.',
        lineageId: 'canon-elf',
        npcId: null
      },
      {
        id: 'node-munstus',
        name: 'Munstus Alduin',
        title: 'Crown Prince & Archon',
        lifespan: '785 - 860',
        role: 'Firstborn Heir',
        portraitUrl: '/assets/images/characters/prince-munstus.jpg',
        gender: 'male',
        isDeceased: false,
        generationTier: 2,
        position: { x: 260, y: 340 },
        notes: 'Commanded the Royal Vanguard during the siege of Iceheart Sea.',
        lineageId: 'canon-human',
        npcId: null
      },
      {
        id: 'node-zero',
        name: 'Zero Lysandria',
        title: 'Queen of the Silver Spire',
        lifespan: '792 - Present',
        role: 'Arch-Mage Consort',
        portraitUrl: '/assets/images/characters/queen-zero.jpg',
        gender: 'female',
        isDeceased: false,
        generationTier: 2,
        position: { x: 460, y: 340 },
        notes: 'Mystic scholar who bound the leyline lattice beneath the palace.',
        lineageId: 'canon-elf',
        npcId: null
      },
      {
        id: 'node-erasmus',
        name: 'Erasmus Mythweaver',
        title: 'Duke of Rime-Spire',
        lifespan: '790 - Present',
        role: 'Grand Chronicler',
        portraitUrl: '/assets/images/characters/erasmus.jpg',
        gender: 'male',
        isDeceased: false,
        generationTier: 2,
        position: { x: 680, y: 340 },
        notes: 'Authored the Sacred Chronicles of the Shattered Moon.',
        lineageId: 'canon-human',
        npcId: null
      },
      {
        id: 'node-milenna',
        name: 'Milenna Velvetouch',
        title: 'Lady of Sundrift',
        lifespan: '795 - Present',
        role: 'Spymaster',
        portraitUrl: '/assets/images/characters/milenna.jpg',
        gender: 'female',
        isDeceased: false,
        generationTier: 2,
        position: { x: 880, y: 340 },
        notes: 'Leader of the Velvet Whisper intelligence network.',
        lineageId: 'canon-human',
        npcId: null
      },
      {
        id: 'node-aurelia',
        name: 'Aurelia Alduin',
        title: 'Princess of the Dawn',
        lifespan: '820 - Present',
        role: 'Heir Presumptive',
        portraitUrl: '/assets/images/characters/aurelia.jpg',
        gender: 'female',
        isDeceased: false,
        generationTier: 3,
        position: { x: 360, y: 560 },
        notes: 'Gifted with ancient solar magic and royal command.',
        lineageId: 'canon-human',
        npcId: null
      }
    ],
    relationships: [
      // Nikolaos + Serena (Spouses)
      {
        id: 'rel-nik-ser',
        type: 'spouse',
        sourceId: 'node-nikolaos',
        targetId: 'node-serena',
        status: 'married', // 'married' | 'betrothed' | 'divorced' | 'consort'
        label: 'Imperial Marriage'
      },
      // Parents -> Munstus
      {
        id: 'rel-parent-munstus',
        type: 'parent_child',
        parentId1: 'node-nikolaos',
        parentId2: 'node-serena',
        childId: 'node-munstus',
        relationType: 'biological' // 'biological' | 'adoptive' | 'illegitimate' | 'clone'
      },
      // Parents -> Erasmus
      {
        id: 'rel-parent-erasmus',
        type: 'parent_child',
        parentId1: 'node-nikolaos',
        parentId2: 'node-serena',
        childId: 'node-erasmus',
        relationType: 'biological'
      },
      // Munstus + Zero (Spouses)
      {
        id: 'rel-mun-zero',
        type: 'spouse',
        sourceId: 'node-munstus',
        targetId: 'node-zero',
        status: 'married',
        label: 'Gilded Union'
      },
      // Erasmus + Milenna (Spouses)
      {
        id: 'rel-era-mil',
        type: 'spouse',
        sourceId: 'node-erasmus',
        targetId: 'node-milenna',
        status: 'married',
        label: 'Alliance'
      },
      // Munstus & Zero -> Aurelia
      {
        id: 'rel-parent-aurelia',
        type: 'parent_child',
        parentId1: 'node-munstus',
        parentId2: 'node-zero',
        childId: 'node-aurelia',
        relationType: 'biological'
      }
    ]
  }
];

const useFamilyTreeStore = create(
  persist(
    (set, get) => ({
      trees: DEFAULT_STARTER_TREES,
      activeTreeId: 'tree-alduin',
      selectedNodeId: null,
      isStudioOpen: false,
      searchQuery: '',
      zoomLevel: 1,
      panOffset: { x: 0, y: 0 },

      // Open / Close Studio
      openStudio: (treeId = null, focusNodeId = null) => {
        const trees = get().trees;
        const targetTreeId = treeId || (trees[0]?.id ?? 'tree-alduin');
        set({
          isStudioOpen: true,
          activeTreeId: targetTreeId,
          selectedNodeId: focusNodeId || null
        });
      },

      closeStudio: () => {
        set({ isStudioOpen: false, selectedNodeId: null });
      },

      setActiveTree: (treeId) => {
        set({ activeTreeId: treeId, selectedNodeId: null });
      },

      setSelectedNode: (nodeId) => {
        set({ selectedNodeId: nodeId });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setZoomLevel: (zoom) => {
        set({ zoomLevel: typeof zoom === 'function' ? zoom(get().zoomLevel) : zoom });
      },

      setPanOffset: (offset) => {
        set({ panOffset: typeof offset === 'function' ? offset(get().panOffset) : offset });
      },

      resetView: () => {
        set({ zoomLevel: 1, panOffset: { x: 0, y: 0 } });
      },

      // Tree Management
      createTree: (name, description = '', coverImage = null) => {
        const newTree = {
          id: `tree-${Date.now()}`,
          name: name.trim() || 'New Family Dynasty',
          description: description.trim(),
          coverImage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodes: [],
          relationships: []
        };

        set(state => ({
          trees: [...state.trees, newTree],
          activeTreeId: newTree.id,
          selectedNodeId: null
        }));

        return newTree;
      },

      updateTree: (treeId, updates) => {
        set(state => ({
          trees: state.trees.map(t =>
            t.id === treeId
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          )
        }));
      },

      deleteTree: (treeId) => {
        set(state => {
          const remaining = state.trees.filter(t => t.id !== treeId);
          return {
            trees: remaining,
            activeTreeId: remaining[0]?.id || null,
            selectedNodeId: null
          };
        });
      },

      // Node (Member) Management
      addMember: (treeId, memberData) => {
        const targetTreeId = treeId || get().activeTreeId;
        const targetTree = get().trees.find(t => t.id === targetTreeId);
        if (!targetTree) return null;

        const defaultPos = {
          x: memberData.position?.x ?? (Math.floor(Math.random() * 400) + 250),
          y: memberData.position?.y ?? (Math.floor(Math.random() * 300) + 200)
        };

        const newMember = {
          id: `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: memberData.name || 'Unnamed Relative',
          title: memberData.title || '',
          lifespan: memberData.lifespan || '',
          role: memberData.role || '',
          portraitUrl: memberData.portraitUrl || null,
          gender: memberData.gender || 'other',
          isDeceased: Boolean(memberData.isDeceased),
          generationTier: memberData.generationTier || 1,
          position: defaultPos,
          notes: memberData.notes || '',
          lineageId: memberData.lineageId || null,
          npcId: memberData.npcId || null
        };

        set(state => ({
          trees: state.trees.map(t =>
            t.id === targetTreeId
              ? {
                  ...t,
                  updatedAt: new Date().toISOString(),
                  nodes: [...t.nodes, newMember]
                }
              : t
          ),
          selectedNodeId: newMember.id
        }));

        return newMember;
      },

      updateMember: (treeId, memberId, updates) => {
        const targetTreeId = treeId || get().activeTreeId;
        set(state => ({
          trees: state.trees.map(t =>
            t.id === targetTreeId
              ? {
                  ...t,
                  updatedAt: new Date().toISOString(),
                  nodes: t.nodes.map(n =>
                    n.id === memberId ? { ...n, ...updates } : n
                  )
                }
              : t
          )
        }));
      },

      updateMemberPosition: (treeId, memberId, position) => {
        const targetTreeId = treeId || get().activeTreeId;
        set(state => ({
          trees: state.trees.map(t =>
            t.id === targetTreeId
              ? {
                  ...t,
                  nodes: t.nodes.map(n =>
                    n.id === memberId ? { ...n, position } : n
                  )
                }
              : t
          )
        }));
      },

      removeMember: (treeId, memberId) => {
        const targetTreeId = treeId || get().activeTreeId;
        set(state => ({
          trees: state.trees.map(t =>
            t.id === targetTreeId
              ? {
                  ...t,
                  updatedAt: new Date().toISOString(),
                  nodes: t.nodes.filter(n => n.id !== memberId),
                  relationships: t.relationships.filter(
                    r =>
                      r.sourceId !== memberId &&
                      r.targetId !== memberId &&
                      r.parentId1 !== memberId &&
                      r.parentId2 !== memberId &&
                      r.childId !== memberId
                  )
                }
              : t
          ),
          selectedNodeId: state.selectedNodeId === memberId ? null : state.selectedNodeId
        }));
      },

      // Relationship Management
      addSpouseRelationship: (treeId, sourceId, targetId, status = 'married', label = '') => {
        const targetTreeId = treeId || get().activeTreeId;
        if (sourceId === targetId) return;

        const newRel = {
          id: `rel-spouse-${Date.now()}`,
          type: 'spouse',
          sourceId,
          targetId,
          status,
          label: label || 'Union'
        };

        set(state => ({
          trees: state.trees.map(t => {
            if (t.id !== targetTreeId) return t;
            // Avoid duplicate spouse relationship
            const exists = t.relationships.some(
              r =>
                r.type === 'spouse' &&
                ((r.sourceId === sourceId && r.targetId === targetId) ||
                  (r.sourceId === targetId && r.targetId === sourceId))
            );
            if (exists) return t;
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              relationships: [...t.relationships, newRel]
            };
          })
        }));
      },

      addChildRelationship: (treeId, parentId1, parentId2, childId, relationType = 'biological') => {
        const targetTreeId = treeId || get().activeTreeId;
        if (!parentId1 || !childId || parentId1 === childId) return;

        const newRel = {
          id: `rel-child-${Date.now()}`,
          type: 'parent_child',
          parentId1,
          parentId2: parentId2 || null,
          childId,
          relationType // 'biological' | 'adoptive' | 'illegitimate' | 'clone'
        };

        set(state => ({
          trees: state.trees.map(t => {
            if (t.id !== targetTreeId) return t;
            const exists = t.relationships.some(
              r =>
                r.type === 'parent_child' &&
                r.childId === childId &&
                (r.parentId1 === parentId1 || r.parentId2 === parentId1)
            );
            if (exists) return t;
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              relationships: [...t.relationships, newRel]
            };
          })
        }));
      },

      removeRelationship: (treeId, relationshipId) => {
        const targetTreeId = treeId || get().activeTreeId;
        set(state => ({
          trees: state.trees.map(t =>
            t.id === targetTreeId
              ? {
                  ...t,
                  updatedAt: new Date().toISOString(),
                  relationships: t.relationships.filter(r => r.id !== relationshipId)
                }
              : t
          )
        }));
      },

      // Auto-Layout Generator: computes clean generation tiers and horizontal spacing
      autoLayoutTree: (treeId) => {
        const targetTreeId = treeId || get().activeTreeId;
        const targetTree = get().trees.find(t => t.id === targetTreeId);
        if (!targetTree || targetTree.nodes.length === 0) return;

        const nodes = [...targetTree.nodes];
        const relationships = [...targetTree.relationships];

        // 1. Group nodes by generation tier
        const tiers = {};
        nodes.forEach(n => {
          const tier = n.generationTier || 1;
          if (!tiers[tier]) tiers[tier] = [];
          tiers[tier].push(n);
        });

        const tierKeys = Object.keys(tiers).map(Number).sort((a, b) => a - b);
        const ySpacing = 220;
        const startY = 120;

        const updatedNodes = nodes.map(node => {
          const tier = node.generationTier || 1;
          const tierList = tiers[tier] || [node];
          const nodeIndex = tierList.findIndex(n => n.id === node.id);
          const totalInTier = tierList.length;

          const xSpacing = 240;
          const totalWidth = (totalInTier - 1) * xSpacing;
          const startX = Math.max(150, 600 - totalWidth / 2);

          const newX = startX + nodeIndex * xSpacing;
          const newY = startY + (tier - 1) * ySpacing;

          return {
            ...node,
            position: { x: Math.round(newX), y: Math.round(newY) }
          };
        });

        set(state => ({
          trees: state.trees.map(t =>
            t.id === targetTreeId
              ? {
                  ...t,
                  updatedAt: new Date().toISOString(),
                  nodes: updatedNodes
                }
              : t
          )
        }));
      },

      // Cloud Persistence
      syncToCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'familyTrees');
          await setDoc(docRef, { trees: get().trees, updatedAt: new Date().toISOString() }, { merge: true });
        } catch (err) {
          console.debug('Family trees cloud sync skipped:', err?.message || err);
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'familyTrees');
          const snap = await getDoc(docRef);
          if (snap.exists() && snap.data()?.trees) {
            set({ trees: snap.data().trees });
          }
        } catch (err) {
          console.debug('Family trees cloud hydration skipped:', err?.message || err);
        }
      }
    }),
    createStorageConfig('mythrill_family_trees_storage', {
      partialize: (state) => ({
        trees: state.trees,
        activeTreeId: state.activeTreeId
      })
    })
  )
);

export default useFamilyTreeStore;
