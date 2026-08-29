import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

// Built-in starter family tree demo data
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
      { id: 'rel-nik-ser', type: 'spouse', sourceId: 'node-nikolaos', targetId: 'node-serena', status: 'married', label: 'Imperial Marriage' },
      { id: 'rel-parent-munstus', type: 'parent_child', parentId1: 'node-nikolaos', parentId2: 'node-serena', childId: 'node-munstus', relationType: 'biological' },
      { id: 'rel-parent-erasmus', type: 'parent_child', parentId1: 'node-nikolaos', parentId2: 'node-serena', childId: 'node-erasmus', relationType: 'biological' },
      { id: 'rel-mun-zero', type: 'spouse', sourceId: 'node-munstus', targetId: 'node-zero', status: 'married', label: 'Gilded Union' },
      { id: 'rel-era-mil', type: 'spouse', sourceId: 'node-erasmus', targetId: 'node-milenna', status: 'married', label: 'Alliance' },
      { id: 'rel-parent-aurelia', type: 'parent_child', parentId1: 'node-munstus', parentId2: 'node-zero', childId: 'node-aurelia', relationType: 'biological' }
    ]
  },
  {
    id: 'tree-valen',
    name: 'House Valen — Shadow-Weavers of the Sunken Spire',
    description: 'Ancient elven bloodline master of arcana, illusions, and shadow pacts.',
    coverImage: '/assets/images/backgrounds/frostwood.jpeg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'node-val-patriarch',
        name: 'Lord Vaelin Valen',
        title: 'High Arch-Mage',
        lifespan: '620 - 780',
        role: 'Founding Patriarch',
        portraitUrl: null,
        gender: 'male',
        isDeceased: true,
        generationTier: 1,
        position: { x: 380, y: 120 },
        notes: 'Bound the elemental shadow spirits to the family crest.',
        lineageId: 'canon-elf'
      },
      {
        id: 'node-val-matriarch',
        name: 'Lady Sylphira Valen',
        title: 'Lady of the Whispering Spire',
        lifespan: '640 - 810',
        role: 'Matriarch',
        portraitUrl: null,
        gender: 'female',
        isDeceased: true,
        generationTier: 1,
        position: { x: 600, y: 120 },
        notes: 'Ancient seeress of the Northern Astral Veil.',
        lineageId: 'canon-elf'
      },
      {
        id: 'node-val-heir',
        name: 'Archon Malakor Valen',
        title: 'Master of the Eclipse',
        lifespan: '770 - Present',
        role: 'Dynasty Lord',
        portraitUrl: null,
        gender: 'male',
        isDeceased: false,
        generationTier: 2,
        position: { x: 490, y: 340 },
        notes: 'Current ruler of the Valen Spire and Grand Council member.',
        lineageId: 'canon-elf'
      }
    ],
    relationships: [
      { id: 'rel-val-1', type: 'spouse', sourceId: 'node-val-patriarch', targetId: 'node-val-matriarch', status: 'married', label: 'Spiritual Union' },
      { id: 'rel-val-2', type: 'parent_child', parentId1: 'node-val-patriarch', parentId2: 'node-val-matriarch', childId: 'node-val-heir', relationType: 'biological' }
    ]
  }
];

export const normalizeTree = (t, idx = 0) => {
  if (!t || typeof t !== 'object') return null;
  const nodes = (t.nodes || []).map((node, nIdx) => ({
    id: node.id || `node-${Date.now()}-${nIdx}`,
    name: node.name || 'Unnamed Member',
    title: node.title || '',
    lifespan: node.lifespan || '',
    role: node.role || '',
    portraitUrl: node.portraitUrl || null,
    gender: node.gender || 'other',
    isDeceased: Boolean(node.isDeceased),
    generationTier: node.generationTier || 1,
    position: node.position && typeof node.position.x === 'number' && typeof node.position.y === 'number'
      ? node.position
      : { x: (nIdx % 4) * 220 + 200, y: Math.floor(nIdx / 4) * 200 + 120 },
    notes: node.notes || '',
    lineageId: node.lineageId || null,
    npcId: node.npcId || null
  }));

  const relationships = (t.relationships || []).map((r, rIdx) => ({
    id: r.id || `rel-${Date.now()}-${rIdx}`,
    type: r.type || 'spouse',
    sourceId: r.sourceId || r.fromId || '',
    targetId: r.targetId || r.toId || '',
    parentId1: r.parentId1 || '',
    parentId2: r.parentId2 || null,
    childId: r.childId || '',
    status: r.status || 'married',
    relationType: r.relationType || 'biological',
    label: r.label || ''
  }));

  return {
    id: t.id || `tree-${Date.now()}-${idx}`,
    name: t.name || 'Untitled Dynasty',
    description: t.description || '',
    coverImage: t.coverImage || null,
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: t.updatedAt || new Date().toISOString(),
    nodes,
    relationships
  };
};

export const normalizeTrees = (trees) => {
  if (!Array.isArray(trees) || trees.length === 0) {
    return DEFAULT_STARTER_TREES.map((t, idx) => normalizeTree(t, idx));
  }
  const cleaned = trees.map((t, idx) => normalizeTree(t, idx)).filter(Boolean);
  return cleaned.length > 0 ? cleaned : DEFAULT_STARTER_TREES.map((t, idx) => normalizeTree(t, idx));
};

const useFamilyTreeStore = create(
  persist(
    (set, get) => ({
      trees: (() => {
        try {
          const raw = localStorage.getItem('mythrill_family_trees_storage');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.state?.trees) {
              return normalizeTrees(parsed.state.trees);
            }
          }
        } catch {}
        return normalizeTrees(DEFAULT_STARTER_TREES);
      })(),
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
            const rawTrees = snap.data().trees;
            if (Array.isArray(rawTrees) && rawTrees.length > 0) {
              const normalized = normalizeTrees(rawTrees);
              set({
                trees: normalized,
                activeTreeId: normalized.some(t => t.id === get().activeTreeId) ? get().activeTreeId : normalized[0].id
              });
            }
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
