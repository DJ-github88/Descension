import React, { useState, useMemo, useEffect, useRef } from 'react';
import useCharacterStore from '../../store/characterStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import { SKILL_CATEGORIES, SKILL_DEFINITIONS, SKILL_RANKS } from '../../constants/skillDefinitions';
import { SKILL_QUESTS } from '../../constants/skillQuests';
import { WEAPON_TYPE_QUEST_DATA } from '../../constants/weaponTypeQuests';
import { WEAPON_TYPE_META } from '../../constants/weaponTypeMeta';
import { ROLLABLE_TABLES } from '../../constants/rollableTables';
import { calculateStatModifier, getEffectiveSkillRollMode, getExhaustionEffectsList } from '../../utils/characterUtils';
import { showAchievementNotification } from '../../utils/achievementNotification';
import usePresenceStore from '../../store/presenceStore';
import useSettingsStore from '../../store/settingsStore';
import useDiceStore from '../../store/diceStore';
import ChargeableRollButton from '../dice/ChargeableRollButton';
import DiceThemeSelector from '../dice/DiceThemeSelector';
import { getIconUrl, getCustomIconUrl } from '../../utils/assetManager';
import { getWeaponArchetype, getWeaponSimpleTable, WEAPON_TYPE_TIERS, WEAPON_TYPE_SIMPLE_TABLES } from '../../constants/weaponTypeSimpleTables';

import '../../styles/skills.css';

const hexToRgba = (hex, alpha = 1) => {
    if (!hex || typeof hex !== 'string') {
        return `rgba(0, 0, 0, ${alpha})`;
    }

    const sanitized = hex.replace('#', '');
    const normalized = sanitized.length === 3
        ? sanitized.split('').map(part => part + part).join('')
        : sanitized;

    if (normalized.length !== 6) {
        return `rgba(0, 0, 0, ${alpha})`;
    }

    const intVal = parseInt(normalized, 16);
    if (Number.isNaN(intVal)) {
        return `rgba(0, 0, 0, ${alpha})`;
    }

    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const buildWeaponRankStyles = (color) => {
    const fallback = '#c6a02d';
    const base = color || fallback;

    return {
        '--weapon-rank-color': base,
        '--weapon-rank-color-soft': hexToRgba(base, 0.16),
        '--weapon-rank-color-strong': hexToRgba(base, 0.32)
    };
};

// Shared 1-20 weapon flavor tables from weaponTypeSimpleTables
export const WEAPON_FACE_TEXT = WEAPON_TYPE_SIMPLE_TABLES;

export default function Skills({ selectedSkill: propSelectedSkill, setSelectedSkill: propSetSelectedSkill, selectedCategory: propCategory } = {}) {
    // Use inspection context if available, otherwise use regular character store
    const inspectionData = useInspectionCharacter();
    const characterStore = useCharacterStore();

    // Choose data source based on whether we're in inspection mode
    const dataSource = inspectionData || characterStore;

    const skillSystemMode = useSettingsStore(state => state.skillSystemMode || 'simple');
    const isSimpleMode = skillSystemMode === 'simple';

    const {
        stats,
        equipmentBonuses,
        skillProgress = {},
        skillRanks = {},
        exhaustionLevel,
        updateSkillProgress,
        setSkillRank
    } = dataSource;

    const DIE_SIZE_MAP = {
        UNTRAINED: 4,
        NOVICE: 6,
        TRAINED: 8,
        APPRENTICE: 10,
        ADEPT: 12,
        EXPERT: 20,
        MASTER: 20
    };

    const [internalSelectedSkill, setInternalSelectedSkill] = useState(null);
    const selectedSkill = propSelectedSkill !== undefined ? propSelectedSkill : internalSelectedSkill;
    const setSelectedSkill = propSetSelectedSkill || setInternalSelectedSkill;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDie, setSelectedDie] = useState('d20'); // Default to d20 (hardest)
    const [selectedWeaponType, setSelectedWeaponType] = useState('sword');
    const [weaponCategoryFilter, setWeaponCategoryFilter] = useState('all');

    const WEAPON_CATEGORIES = useMemo(() => ({
        'one-handed': ['sword', 'axe', 'mace', 'dagger', 'rapier', 'katana', 'saber', 'sickle', 'flail', 'fist weapon', 'parrying dagger', 'off hand blade', 'war mace', 'unarmed'],
        'two-handed': ['greatsword', 'greataxe', 'maul', 'polearm', 'staff', 'halberd', 'scythe', 'jousting spear', 'double sided sword'],
        'ranged': ['bow', 'crossbow', 'thrown', 'wand', 'blowgun', 'sling', 'boomerang', 'chakram', 'shuriken', 'dart'],
        'instruments': ['harp', 'lute', 'flute', 'drum', 'horn', 'violin', 'guitar']
    }), []);

    const filteredWeaponEntries = useMemo(() => {
        const entries = Object.entries(WEAPON_TYPE_META);
        if (weaponCategoryFilter === 'all') return entries;
        const targetKeys = WEAPON_CATEGORIES[weaponCategoryFilter] || [];
        return entries.filter(([key]) => targetKeys.includes(key));
    }, [weaponCategoryFilter, WEAPON_CATEGORIES]);

    const [showCompletedQuests, setShowCompletedQuests] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [stuntFilter, setStuntFilter] = useState('all');
    const [inspectedStuntFace, setInspectedStuntFace] = useState(null);
    // Per-skill roll mode: 'normal' | 'advantage' | 'disadvantage'.
    // Advantage rolls 2× the die and keeps the better outcome; disadvantage
    // keeps the worse. Applies to both simple (DC) and table skill rolls.
    // (getRollMode / setRollMode are defined below, next to ROLL_MODES.)
    const [rollModeBySkill, setRollModeBySkill] = useState({});

    const WEAPON_TYPE_LABELS = {
        sword: 'Sword',
        axe: 'Axe',
        mace: 'Mace',
        dagger: 'Dagger',
        greatsword: 'Greatsword',
        greataxe: 'Greataxe',
        maul: 'Maul',
        polearm: 'Polearm',
        staff: 'Staff',
        bow: 'Bow',
        crossbow: 'Crossbow',
        thrown: 'Thrown',
        wand: 'Wand',
        unarmed: 'Unarmed'
    };

    const [collapsedCategories, setCollapsedCategories] = useState({}); // Track which categories are collapsed

    // Get all skills grouped by category for sidebar
    const skillsByCategory = Object.entries(SKILL_DEFINITIONS).reduce((acc, [skillId, skill]) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push({ id: skillId, ...skill });
        return acc;
    }, {});

    // Search functionality - searches through skills and quests
    const searchResults = searchQuery.trim() ? Object.entries(SKILL_DEFINITIONS).filter(([skillId, skill]) => {
        const query = searchQuery.toLowerCase();

        // Search in skill name and description
        if (skill.name.toLowerCase().includes(query) || skill.description.toLowerCase().includes(query)) {
            return true;
        }

        // Search in quest names and descriptions
        const quests = SKILL_QUESTS[skillId] || [];
        return quests.some(quest =>
            quest.name.toLowerCase().includes(query) ||
            quest.description.toLowerCase().includes(query) ||
            (quest.unlocks && quest.unlocks.some(unlock => unlock.toLowerCase().includes(query)))
        );
    }).map(([skillId, skill]) => ({ id: skillId, ...skill })) : [];

    const getProgressKey = (skillId, weaponTypeOverride = null) => {
        if (skillId === 'weaponMastery') {
            const weaponType = weaponTypeOverride || selectedWeaponType;
            return `${skillId}_${weaponType}`;
        }
        return skillId;
    };

    // Get skill rank from character data (set during character creation)
    // Fall back to quest-based progression if no rank is set
    const getSkillRank = (skillId, weaponTypeOverride = null) => {
        // First check if there's a rank from character creation
        if (skillRanks && skillRanks[skillId]) {
            const rankKey = skillRanks[skillId];
            return { key: rankKey, ...SKILL_RANKS[rankKey] };
        }

        // Weapon mastery uses per-weapon thresholds (cumulative quests completed)
        const WEAPON_MASTERY_THRESHOLDS = {
            UNTRAINED: 0,
            NOVICE: 1,
            TRAINED: 3,
            APPRENTICE: 6,
            ADEPT: 9,
            EXPERT: 11,
            MASTER: 12
        };

        const progressKey = getProgressKey(skillId, weaponTypeOverride);
        const progress = skillProgress[progressKey] || { completedQuests: [], questProgress: {} };
        const completedCount = progress.completedQuests.length;

        if (skillId === 'weaponMastery') {
            const rankOrder = Object.keys(SKILL_RANKS);
            // Walk ranks from highest to lowest using the custom thresholds
            for (let i = rankOrder.length - 1; i >= 0; i--) {
                const rankKey = rankOrder[i];
                const required = WEAPON_MASTERY_THRESHOLDS[rankKey] ?? SKILL_RANKS[rankKey].questsRequired;
                if (completedCount >= required) {
                    return { key: rankKey, ...SKILL_RANKS[rankKey] };
                }
            }
            return { key: 'UNTRAINED', ...SKILL_RANKS.UNTRAINED };
        }

        // Fall back to default thresholds for other skills
        for (const [rankKey, rankData] of Object.entries(SKILL_RANKS).reverse()) {
            if (completedCount >= rankData.questsRequired) {
                return { key: rankKey, ...rankData };
            }
        }
        return { key: 'UNTRAINED', ...SKILL_RANKS.UNTRAINED };
    };

    // Get available quests for a skill
    const getAvailableQuests = (skillId) => {
        const skillQuests = (() => {
            if (skillId !== 'weaponMastery') {
                return SKILL_QUESTS[skillId] || [];
            }

            // Show only quests for the selected weapon type; fallback to default if missing
            return WEAPON_TYPE_QUEST_DATA[selectedWeaponType] || WEAPON_TYPE_QUEST_DATA.default || [];
        })();

        const progressKey = getProgressKey(skillId);
        const progress = skillProgress[progressKey] || { completedQuests: [], questProgress: {} };
        const currentRank = getSkillRank(skillId);
        const currentRankIndex = Object.keys(SKILL_RANKS).indexOf(currentRank.key);

        const baseList = skillQuests.filter(quest => {
            const isCompleted = progress.completedQuests.includes(quest.id);
            const rankIndex = Object.keys(SKILL_RANKS).indexOf(quest.rank);
            // Show completed quests, and quests at current rank or below (current + all previous ranks)
            return isCompleted || rankIndex <= currentRankIndex;
        });

        // Sort by proficiency order to present a clean ladder
        const rankOrder = Object.keys(SKILL_RANKS);
        return baseList.slice().sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));
    };

    // Toggle quest completion
    const toggleQuest = (skillId, questId) => {
        const progressKey = getProgressKey(skillId);
        const progress = skillProgress[progressKey] || { completedQuests: [], questProgress: {} };
        const isCompleted = progress.completedQuests.includes(questId);

        const newCompletedQuests = isCompleted
            ? progress.completedQuests.filter(id => id !== questId)
            : [...progress.completedQuests, questId];

        updateSkillProgress(progressKey, {
            ...progress,
            completedQuests: newCompletedQuests
        });

        // Broadcast achievement if quest was just completed (not uncompleted)
        if (!isCompleted && newCompletedQuests.includes(questId)) {
            broadcastAchievement(skillId, questId);
        }
    };

    const incrementQuestProgress = (skillId, questId, goal) => {
        if (!goal) return;
        const progressKey = getProgressKey(skillId);
        const progress = skillProgress[progressKey] || { completedQuests: [], questProgress: {} };
        const current = progress.questProgress?.[questId] || 0;
        const next = Math.min(goal, current + 1);

        const updated = {
            ...progress,
            questProgress: {
                ...(progress.questProgress || {}),
                [questId]: next
            }
        };

        // Auto-complete when reaching goal
        if (next >= goal && !progress.completedQuests?.includes(questId)) {
            updated.completedQuests = [...(progress.completedQuests || []), questId];
            broadcastAchievement(skillId, questId);
        }

        updateSkillProgress(progressKey, updated);
    };

    // Broadcast achievement completion to party chat with cooldown
    const broadcastAchievement = (skillId, questId) => {
        const skill = SKILL_DEFINITIONS[skillId];
        const quest =
            skillId === 'weaponMastery'
                ? (WEAPON_TYPE_QUEST_DATA[selectedWeaponType] || []).find(q => q.id === questId)
                : SKILL_QUESTS[skillId]?.find(q => q.id === questId);

        if (!skill || !quest) return;

        // Check cooldown to prevent spam
        const cooldownKey = `achievement_${skillId}_${questId}`;
        const lastBroadcast = localStorage.getItem(cooldownKey);
        const now = Date.now();
        const cooldownPeriod = 30000; // 30 seconds cooldown

        if (lastBroadcast && (now - parseInt(lastBroadcast)) < cooldownPeriod) {
            console.log('🏆 Achievement on cooldown, skipping broadcast');
            return;
        }

        // Set cooldown timestamp
        localStorage.setItem(cooldownKey, now.toString());

        const characterName = dataSource.name || 'Adventurer';
        const characterClass = dataSource.class || 'Unknown';

        // Create WoW-style achievement message
        const achievementMessage = {
            id: `achievement_${Date.now()}`,
            senderId: 'system',
            senderName: 'System',
            senderClass: 'Achievement',
            senderLevel: null,
            content: `${characterName} has earned the achievement: ${quest.name} - ${quest.description}`,
            timestamp: new Date().toISOString(),
            type: 'achievement',
            achievementData: {
                skillName: skill.name,
                questName: quest.name,
                questDescription: quest.description,
                icon: quest.icon,
                rank: quest.rank,
                characterName: characterName,
                characterClass: characterClass
            }
        };

        // Add to party chat
        const { addPartyChatMessage } = usePresenceStore.getState();
        addPartyChatMessage(achievementMessage);

        // Show achievement notification on canvas
        showAchievementNotification(skill, quest, characterName, characterClass);

        console.log('🏆 Achievement broadcasted:', achievementMessage);
    };

    // Get current rollable table for skill based on rank and selected die
    const getCurrentRollableTable = (skill, skillId, rankKeyOverride = null, dieOverride = null) => {
        const rank = rankKeyOverride
            ? { key: rankKeyOverride, ...SKILL_RANKS[rankKeyOverride] }
            : getSkillRank(skillId);
        const dieKey = dieOverride || selectedDie;
        if (skill.rollableTables) {
            // Check if this skill uses the new multi-dimensional table structure
            const rankTables = skill.rollableTables[rank.key] || skill.rollableTables.UNTRAINED;
            if (typeof rankTables === 'object') {
                if (rankTables[dieKey]) {
                // New structure: proficiency � -  die type
                    const tableId = rankTables[dieKey];
                    if (!ROLLABLE_TABLES[tableId]) {
                        console.error(`Table not found: ${tableId} for skill ${skillId}, rank ${rank.key}, die ${dieKey}`);
                        return null;
                    }
                    return tableId;
                }
                // fallback to first available
                const firstKey = Object.keys(rankTables)[0];
                return rankTables[firstKey];
            }
            // Old structure: just proficiency level
            return rankTables;
        }
        return skill.rollableTable; // Fallback for old format
    };

    // Map roll mode → number of dice rolled.
    const QUANTITY_BY_MODE = {
        'normal': 1,
        'advantage': 2,
        'disadvantage': 2,
        'double-advantage': 3,
        'double-disadvantage': 3,
    };

    // Render the dynamic Combat Stunt Techniques matching the active weapon die and modifier bounds
    const renderWeaponStuntTechniques = (weaponType, breakdown, rank) => {
        const archetype = getWeaponArchetype(weaponType);
        const table = WEAPON_FACE_TEXT[weaponType] || WEAPON_FACE_TEXT[archetype] || getWeaponSimpleTable(weaponType) || WEAPON_FACE_TEXT.sword;
        if (!table) return null;

        const dieSize = DIE_SIZE_MAP[rank?.key] || 4;
        const mod = breakdown?.totalMod || 0;
        
        // Bounds calculation
        const rawMin = 1;
        const rawMax = dieSize;
        const minStandard = rawMin + mod;
        const maxStandard = rawMax + mod;
        const clampedMaxStandard = Math.min(20, Math.max(1, maxStandard));
        const clampedMinStandard = Math.min(20, Math.max(1, minStandard));
        const maxUnlockedFace = Math.min(20, Math.max(dieSize, clampedMaxStandard));

        const entries = Object.entries(table);
        
        // Filter entries based on stuntFilter
        const filteredEntries = entries.filter(([faceStr]) => {
            const face = parseInt(faceStr, 10);
            if (stuntFilter === 'base-die') {
                return face <= rawMax;
            }
            if (stuntFilter === 'reachable') {
                return face >= clampedMinStandard && face <= clampedMaxStandard;
            }
            if (stuntFilter === 'max-standard') {
                return face === clampedMaxStandard;
            }
            if (stuntFilter === 'exploding') {
                return face > clampedMaxStandard && face <= Math.min(20, clampedMaxStandard + 6);
            }
            if (stuntFilter === 'all-20') {
                return true;
            }
            // 'all' default: show all currently unlocked tiers up to maxUnlockedFace, or at least up to 8
            return face <= Math.max(8, maxUnlockedFace);
        });

        const activeInspectedFace = inspectedStuntFace ? parseInt(inspectedStuntFace, 10) : null;
        const activeInspectedDesc = activeInspectedFace ? table[activeInspectedFace] : null;

        return (
            <div className="weapon-face-techniques-grid">
                <div className="techniques-header-bar">
                    <div className="techniques-title-group">
                        <span className="techniques-title">
                            <i className="fas fa-burst"></i> Combat Stunt Techniques
                        </span>
                        <span className="techniques-die-tag" style={{ color: rank?.color || '#d4af37' }}>
                            Rank Die: <strong>d{dieSize}</strong> ({rank?.name})
                        </span>
                    </div>

                    <div className="techniques-range-summary">
                        <span className="range-summary-chip base" title={`Raw die roll range on current rank: 1 to ${dieSize}`}>
                            Base Die: <strong>1–{dieSize}</strong>
                        </span>
                        <span className="range-summary-chip mod" title={`Standard achievable outcome range: 1+(${mod}) to ${dieSize}+(${mod})`}>
                            With Mod ({mod >= 0 ? `+${mod}` : mod}): <strong>{minStandard}–{maxStandard}</strong>
                        </span>
                        <span className="range-summary-chip peak" title={`Maximum standard achievable stunt without exploding die`}>
                            <i className="fas fa-crown"></i> Max Standard: <strong>[{clampedMaxStandard}] {WEAPON_TYPE_TIERS[clampedMaxStandard]?.name || ''}</strong>
                        </span>
                        {clampedMaxStandard < 20 && (
                            <span className="range-summary-chip explode" title={`Achievable via exploding die roll on d${dieSize} or higher mastery ranks`}>
                                <i className="fas fa-bolt"></i> Surge / Upgrade: <strong>[{clampedMaxStandard + 1}–20]</strong>
                            </span>
                        )}
                    </div>
                </div>

                <div className="techniques-filter-pills">
                    <span className="filter-label"><i className="fas fa-sliders"></i> Filter Stunts:</span>
                    {[
                        { id: 'all', label: `Unlocked (1–${Math.max(8, maxUnlockedFace)})` },
                        { id: 'base-die', label: `Base Die (1–${dieSize})` },
                        { id: 'reachable', label: `Reachable (${clampedMinStandard}–${clampedMaxStandard})` },
                        { id: 'max-standard', label: `Max Standard ([${clampedMaxStandard}])` },
                        ...(clampedMaxStandard < 20 ? [{ id: 'exploding', label: `⚡ Surge (${clampedMaxStandard + 1}+)` }] : []),
                        { id: 'all-20', label: 'Full Tree (1–20)' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`stunt-filter-pill ${stuntFilter === tab.id ? 'active' : ''}`}
                            onClick={() => setStuntFilter(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                    {inspectedStuntFace && (
                        <button
                            type="button"
                            className="stunt-clear-inspect-btn"
                            onClick={() => setInspectedStuntFace(null)}
                            title="Clear stunt inspection"
                        >
                            <i className="fas fa-times"></i> Clear Inspection
                        </button>
                    )}
                </div>

                {/* Inspected Stunt Tactical Callout Banner */}
                {activeInspectedFace && activeInspectedDesc && (() => {
                    const tTier = WEAPON_TYPE_TIERS[activeInspectedFace] || {};
                    const isLocked = activeInspectedFace > dieSize && activeInspectedFace > maxStandard;
                    return (
                        <div className="technique-inspect-callout">
                            <div className="callout-header">
                                <span className="callout-tier-badge">
                                    Tier [{activeInspectedFace}] • {tTier.name || 'Stunt'} ({tTier.delta || ''})
                                    {tTier.rankReq && (
                                        <span className="callout-rank-gate-badge"> — Unlocks at {tTier.rankReq} (d{tTier.dieReq})</span>
                                    )}
                                </span>
                                <span className="callout-requirement">
                                    {activeInspectedFace === clampedMaxStandard ? (
                                        <span className="req-gold"><i className="fas fa-star"></i> Peak Standard Outcome: Achieved on rolling a {dieSize} on d{dieSize} + Mod ({mod >= 0 ? `+${mod}` : mod}) = {activeInspectedFace}</span>
                                    ) : activeInspectedFace >= clampedMinStandard && activeInspectedFace <= clampedMaxStandard ? (
                                        <span className="req-green"><i className="fas fa-check-circle"></i> Standard Reachable: Roll a {activeInspectedFace - mod} on d{dieSize} + Mod ({mod >= 0 ? `+${mod}` : mod}) = {activeInspectedFace}</span>
                                    ) : isLocked ? (
                                        <span className="req-purple"><i className="fas fa-bolt"></i> Exploding Surge / Rank Gate: Requires d{dieSize} explosion (max roll {dieSize}+) or upgrading rank to {tTier.rankReq || `d${tTier.dieReq}`}</span>
                                    ) : (
                                        <span className="req-gray"><i className="fas fa-arrow-down"></i> Sub-roll: Result sum = {activeInspectedFace}</span>
                                    )}
                                </span>
                            </div>
                            <p className="callout-description">{activeInspectedDesc}</p>
                        </div>
                    );
                })()}

                <div className="techniques-chips">
                    {filteredEntries.map(([faceStr, desc]) => {
                        const face = parseInt(faceStr, 10);
                        const isMaxStandard = face === clampedMaxStandard;
                        const isInRange = face >= clampedMinStandard && face <= clampedMaxStandard;
                        const isExploding = face > clampedMaxStandard;
                        const isLockedByDie = face > dieSize && face > maxStandard;
                        const isSelected = activeInspectedFace === face;
                        const tierMeta = WEAPON_TYPE_TIERS[face] || {};

                        let statusClass = 'in-range';
                        let statusLabel = `In Range (${face - mod} + ${mod >= 0 ? `+${mod}` : mod})`;
                        let statusIcon = 'fa-check';

                        if (isMaxStandard) {
                            statusClass = 'max-standard';
                            statusLabel = `★ Max Standard (${dieSize} + ${mod >= 0 ? `+${mod}` : mod})`;
                            statusIcon = 'fa-crown';
                        } else if (isLockedByDie) {
                            statusClass = 'locked-rank';
                            statusLabel = tierMeta.rankReq ? `🔒 ${tierMeta.rankReq} (d${tierMeta.dieReq}) / Surge` : `⚡ Surge (${dieSize}+)`;
                            statusIcon = tierMeta.rankReq ? 'fa-lock' : 'fa-bolt';
                        } else if (isExploding) {
                            statusClass = 'exploding-surge';
                            statusLabel = `⚡ Exploding Surge (${dieSize}+)`;
                            statusIcon = 'fa-bolt';
                        } else if (!isInRange) {
                            statusClass = 'out-of-range';
                            statusLabel = 'Low Outcome';
                            statusIcon = 'fa-minus';
                        }

                        return (
                            <div
                                key={face}
                                className={`technique-chip ${statusClass} ${isSelected ? 'inspected' : ''}`}
                                onClick={() => setInspectedStuntFace(isSelected ? null : face)}
                                title={`Click to inspect Tier [${face}] ${tierMeta.name || ''} stunt technique`}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setInspectedStuntFace(isSelected ? null : face)}
                            >
                                <div className="technique-chip-header">
                                    <div className="technique-num-wrap">
                                        <span className="technique-num">[{face}]</span>
                                        <span className="technique-tier-name">{tierMeta.name || ''}</span>
                                    </div>
                                    <span className={`technique-status-tag ${statusClass}`}>
                                        <i className={`fas ${statusIcon}`}></i> {statusLabel}
                                    </span>
                                </div>
                                <span className="technique-text">{desc}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Calculate full breakdown of skill modifier
    const getSkillModifierBreakdown = (skillObj, skillId) => {
        const resolvedSkillId = skillId || selectedSkill;
        const isWeaponMastery = resolvedSkillId === 'weaponMastery';
        const weaponMeta = isWeaponMastery ? (WEAPON_TYPE_META[selectedWeaponType] || {}) : null;

        const primaryStat = isWeaponMastery
            ? (weaponMeta?.primaryStat || 'strength')
            : (skillObj?.primaryStat || 'strength');
        const secondaryStat = isWeaponMastery
            ? (weaponMeta?.secondaryStat || null)
            : (skillObj?.secondaryStat || null);
        
        const primaryStatVal = (stats[primaryStat] || 10) + (equipmentBonuses[primaryStat] || 0);
        const primaryMod = calculateStatModifier(primaryStatVal);
        
        const secondaryStatVal = secondaryStat ? (stats[secondaryStat] || 10) + (equipmentBonuses[secondaryStat] || 0) : 0;
        const secondaryMod = secondaryStat ? calculateStatModifier(secondaryStatVal) : 0;
        const secondaryHalf = Math.floor(secondaryMod / 2);
        
        const rank = isWeaponMastery ? getWeaponTypeRank(selectedWeaponType) : getSkillRank(resolvedSkillId);
        const rankKeys = Object.keys(SKILL_RANKS);
        const rankIndex = Math.max(0, rankKeys.indexOf(rank?.key || 'UNTRAINED'));
        const rankBonus = rankIndex;
        
        const totalMod = primaryMod + secondaryHalf + rankBonus;
        return {
            primaryStat,
            primaryStatVal,
            primaryMod,
            secondaryStat,
            secondaryStatVal,
            secondaryMod,
            secondaryHalf,
            rank,
            rankBonus,
            totalMod
        };
    };

    // Calculate skill modifier
    const getSkillModifier = (skillObj, skillId) => {
        return getSkillModifierBreakdown(skillObj, skillId).totalMod;
    };

    // Simple skill roll: trigger 3D physical dice rolling with velocity
    const rollSimpleSkill = (skillObj, skillId, throwPower = 1.0, throwDirection = { x: 0, z: 0 }) => {
        const isWeaponMastery = (skillId || selectedSkill) === 'weaponMastery';
        const rank = isWeaponMastery ? getWeaponTypeRank(selectedWeaponType) : getSkillRank(skillId);
        const dieSize = DIE_SIZE_MAP[rank.key] || 4;
        const dieType = `d${dieSize}`;
        const mode = getEffectiveRollMode(skillId);
        const quantity = QUANTITY_BY_MODE[mode] || 1;
        const modBreakdown = getSkillModifierBreakdown(skillObj, skillId);

        const diceStore = useDiceStore.getState();
        diceStore.clearSelectedDice();
        diceStore.addDice(dieType, quantity);
        diceStore.startRoll({
            type: 'skill',
            skillId,
            skillName: isWeaponMastery ? `${WEAPON_TYPE_META[selectedWeaponType]?.label || 'Weapon'} Mastery` : (skillObj?.name || 'Skill'),
            rollType: 'simple',
            dieSize,
            mode,
            modifier: modBreakdown.totalMod,
            modifierBreakdown: modBreakdown,
            throwPower,
            throwDirection
        });
    };

    // Roll on a skill table: trigger 3D physical dice rolling with velocity
    const rollSkillTable = (skillObj, skillId, throwPower = 1.0, throwDirection = { x: 0, z: 0 }) => {
        const rank = getSkillRank(skillId);
        const isWeaponMastery = (skillId || selectedSkill) === 'weaponMastery';
        const dieKey = isWeaponMastery ? 'd8' : selectedDie;
        const tableId = getCurrentRollableTable(skillObj, skillId, rank.key, dieKey);
        const mode = getEffectiveRollMode(skillId);
        const quantity = QUANTITY_BY_MODE[mode] || 1;
        const modBreakdown = getSkillModifierBreakdown(skillObj, skillId);

        const diceStore = useDiceStore.getState();
        diceStore.clearSelectedDice();
        diceStore.addDice(dieKey, quantity);
        diceStore.startRoll({
            type: 'skill',
            skillId,
            skillName: isWeaponMastery ? `${WEAPON_TYPE_META[selectedWeaponType]?.label || 'Weapon'} Mastery` : (skillObj?.name || 'Skill'),
            rollType: 'table',
            tableId,
            dieKey,
            weaponType: selectedWeaponType,
            mode,
            modifier: modBreakdown.totalMod,
            modifierBreakdown: modBreakdown,
            throwPower,
            throwDirection
        });
    };

    const getWeaponTypeRank = (weaponType) => getSkillRank('weaponMastery', weaponType);

    // Five-state roll-mode toggle. Persists per skill in component state
    // (lost on full page reload). The selected mode rolls 1, 2, or 3 dice
    // and the "kept" value is the highest (advantage) or lowest (disadvantage).
    // Exhaustion level 1+ forces a step of disadvantage that cancels against
    // the selected mode (5e convention) via getEffectiveSkillRollMode.
    const ROLL_MODES = [
        { key: 'normal',               label: 'Normal',              icon: 'fa-minus',           desc: 'Roll the die normally.' },
        { key: 'advantage',            label: 'Advantage',           icon: 'fa-arrow-trend-up',  desc: 'Roll 2 dice, keep the highest.' },
        { key: 'double-advantage',     label: 'Double Advantage',    icon: 'fa-angles-up',       desc: 'Roll 3 dice, keep the highest.' },
        { key: 'disadvantage',         label: 'Disadvantage',        icon: 'fa-arrow-trend-down',desc: 'Roll 2 dice, keep the lowest.' },
        { key: 'double-disadvantage',  label: 'Double Disadvantage', icon: 'fa-angles-down',     desc: 'Roll 3 dice, keep the lowest.' },
    ];

    const getRollMode = (skillId) => rollModeBySkill[skillId] || 'normal';

    // Effective mode after exhaustion cancellation (exhaustion 1+ = forced
    // disadvantage step on ALL skill checks; level 6 = dead, rolls moot).
    const getEffectiveRollMode = (skillId) => {
        const { mode } = getEffectiveSkillRollMode(getRollMode(skillId), exhaustionLevel || 0);
        return mode;
    };

    const setRollMode = (skillId, mode) =>
        setRollModeBySkill((prev) => ({ ...prev, [skillId]: mode }));

    const renderRollModeToggle = (skillId) => {
        const mode = getRollMode(skillId);
        const currentMode = ROLL_MODES.find((m) => m.key === mode) || ROLL_MODES[0];
        const effective = getEffectiveRollMode(skillId);
        const { forcedByExhaustion } = getEffectiveSkillRollMode(mode, exhaustionLevel || 0);
        return (
            <select
                className={`single-roll-mode-btn single-roll-mode-select mode-${effective}`}
                value={mode}
                onChange={(e) => setRollMode(skillId, e.target.value)}
                title={`${currentMode.label}: ${currentMode.desc}${forcedByExhaustion ? ' • Exhaustion cancels part of this mode' : ''}`}
                aria-label="Roll mode"
            >
                {ROLL_MODES.map((m) => (
                    <option key={m.key} value={m.key}>{m.label}</option>
                ))}
            </select>
        );
    };

    // Compact exhaustion notice shown next to the roll controls when the
    // current exhaustion level imposes disadvantage on all skill checks.
    const renderExhaustionRollNote = () => {
        const lvl = exhaustionLevel || 0;
        if (lvl < 1 || lvl >= 6) return null;
        return (
            <div
                className="skill-exhaustion-note"
                title={getExhaustionEffectsList(lvl).map(e => e.full).join(' • ')}
            >
                <i className="fas fa-face-tired"></i>
                <span>Exhaustion Level {lvl}: Disadvantage on ALL skill checks</span>
            </div>
        );
    };

    // Render skill detail view
    const renderSkillDetail = () => {
        if (!selectedSkill) {
            return (
                <div className="no-skill-selected">
                    <img 
                        src={getIconUrl('Misc/Profession Resources/Gems/resource-block-purple-spotted-beige-face', 'items')}
                        alt="Dice"
                        className="dice-icon"
                        style={{ width: '48px', height: '48px', marginBottom: '20px' }}
                    />
                    <p>Select a skill from the list to view details</p>
                </div>
            );
        }

        const skill = SKILL_DEFINITIONS[selectedSkill];
        const isWeaponMastery = selectedSkill === 'weaponMastery';
        const rank = isWeaponMastery ? getWeaponTypeRank(selectedWeaponType) : getSkillRank(selectedSkill);
        const effectiveRank = rank;
        const modBreakdown = getSkillModifierBreakdown(skill, selectedSkill);
        const modifier = modBreakdown.totalMod;
        const quests = getAvailableQuests(selectedSkill);
        const progressKey = getProgressKey(selectedSkill);
        const currentProgress = skillProgress[progressKey] || { completedQuests: [] };
        const completedQuests = currentProgress.completedQuests || [];
        const description = isWeaponMastery 
            ? (WEAPON_TYPE_META[selectedWeaponType]?.hint || skill.description) 
            : skill.description;
        const skillDisplayName = isWeaponMastery 
            ? `${WEAPON_TYPE_META[selectedWeaponType]?.label || 'Weapon'} Mastery` 
            : skill.name;
        const skillIconUrl = isWeaponMastery
            ? (WEAPON_TYPE_META[selectedWeaponType]?.icon || (skill.icon.startsWith('http') ? skill.icon : getCustomIconUrl(skill.icon, 'abilities')))
            : (skill.icon.startsWith('http') ? skill.icon : getCustomIconUrl(skill.icon, 'abilities'));

        return (
            <div className="skill-detail-view">
                {selectedSkill && (
                    <button
                        type="button"
                        className="mobile-back-to-skills-btn"
                        onClick={() => setSelectedSkill(null)}
                        title="Back to Skills List"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Skills List</span>
                    </button>
                )}
                {isSimpleMode ? (
                    <div className="skill-simple-header">
                        {/* Skill Icon */}
                        <div className="skill-header-icon-box">
                            <img
                                src={skillIconUrl}
                                alt={skillDisplayName}
                                className="skill-simple-icon"
                            />
                        </div>

                        {/* Title, Rank Selector Dropdown, Attributes & Formula */}
                        <div className="skill-simple-title-block">
                            <div className="skill-simple-name-row">
                                <h2 className="skill-simple-name">
                                    {skillDisplayName}
                                </h2>
                                <div className="skill-rank-dropdown-wrap">
                                    <select
                                        className="skill-rank-dropdown skill-simple-dropdown"
                                        value={effectiveRank.key}
                                        onChange={(e) => {
                                            if (isWeaponMastery) {
                                                if (setSkillRank) {
                                                    setSkillRank('weaponMastery', e.target.value, selectedWeaponType);
                                                } else {
                                                    useCharacterStore.getState().setSkillRank('weaponMastery', e.target.value, selectedWeaponType);
                                                }
                                            } else {
                                                if (setSkillRank) {
                                                    setSkillRank(selectedSkill, e.target.value);
                                                } else {
                                                    useCharacterStore.getState().setSkillRank(selectedSkill, e.target.value);
                                                }
                                            }
                                        }}
                                        title="Change skill die rank"
                                    >
                                        {Object.entries(SKILL_RANKS).map(([key, data]) => (
                                            <option key={key} value={key}>
                                                d{DIE_SIZE_MAP[key]}: {data.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <p className="skill-simple-description">{description}</p>
                            
                            {/* Attribute breakdown pills */}
                            <div className="skill-simple-attrs">
                                <span 
                                    className="skill-attr-badge primary" 
                                    title={`${modBreakdown.primaryStat.toUpperCase()} Score: ${modBreakdown.primaryStatVal} → Modifier: ${modBreakdown.primaryMod >= 0 ? `+${modBreakdown.primaryMod}` : modBreakdown.primaryMod}`}
                                >
                                    <i className="fas fa-star"></i> {modBreakdown.primaryStat.toUpperCase()} ({modBreakdown.primaryMod >= 0 ? `+${modBreakdown.primaryMod}` : modBreakdown.primaryMod})
                                </span>
                                {modBreakdown.secondaryStat && (
                                    <>
                                        <span className="skill-attr-operator">+</span>
                                        <span 
                                            className="skill-attr-badge secondary" 
                                            title={`${modBreakdown.secondaryStat.toUpperCase()} Score: ${modBreakdown.secondaryStatVal} (Mod: ${modBreakdown.secondaryMod >= 0 ? `+${modBreakdown.secondaryMod}` : modBreakdown.secondaryMod}) → Half Applied: ${modBreakdown.secondaryHalf >= 0 ? `+${modBreakdown.secondaryHalf}` : modBreakdown.secondaryHalf}`}
                                        >
                                            <i className="fas fa-shield"></i> {modBreakdown.secondaryStat.toUpperCase()} ({modBreakdown.secondaryHalf >= 0 ? `+${modBreakdown.secondaryHalf}` : modBreakdown.secondaryHalf})
                                        </span>
                                    </>
                                )}
                                <span className="skill-attr-operator">+</span>
                                <span 
                                    className="skill-attr-badge rank" 
                                    title={`Rank ${effectiveRank.name} grants +${modBreakdown.rankBonus} tier bonus`}
                                >
                                    <i className="fas fa-award"></i> RANK ({modBreakdown.rankBonus >= 0 ? `+${modBreakdown.rankBonus}` : modBreakdown.rankBonus})
                                </span>
                                <span className="skill-attr-operator">=</span>
                                <span 
                                    className="skill-attr-badge modifier" 
                                    title={`Total Modifier = Primary (${modBreakdown.primaryMod >= 0 ? `+${modBreakdown.primaryMod}` : modBreakdown.primaryMod}) + Secondary Half (${modBreakdown.secondaryHalf >= 0 ? `+${modBreakdown.secondaryHalf}` : modBreakdown.secondaryHalf}) + Rank (${modBreakdown.rankBonus >= 0 ? `+${modBreakdown.rankBonus}` : modBreakdown.rankBonus}) = ${modifier >= 0 ? `+${modifier}` : modifier}`}
                                >
                                    <i className="fas fa-shield-halved"></i> MODIFIER: {modifier >= 0 ? `+${modifier}` : modifier}
                                </span>
                            </div>

                            {/* Mathematical Resolution & Exploding Die Banner */}
                            <div className="skill-resolution-formula-banner">
                                <div className="resolution-formula-item">
                                    <span className="formula-tag">ROLL FORMULA</span>
                                    <span className="formula-math">
                                        <strong>d{DIE_SIZE_MAP[effectiveRank.key]}</strong> <span className="formula-muted">(Die)</span>
                                        {modifier >= 0 ? ' + ' : ' - '}
                                        <strong className="formula-highlight">{Math.abs(modifier)}</strong> <span className="formula-muted">(Mod)</span>
                                    </span>
                                </div>
                                <div className="resolution-exploding-item">
                                    <i className="fas fa-bolt"></i>
                                    <span><strong>Exploding Dice:</strong> Max roll on d{DIE_SIZE_MAP[effectiveRank.key]} rolls again and adds to total!</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Block: Mode Toggle + Hero Roll Button */}
                        <div className="skill-simple-actions-block">
                            <div className="skill-action-mode-wrap">
                                {renderRollModeToggle(selectedSkill)}
                                {renderExhaustionRollNote()}
                            </div>
                            <ChargeableRollButton
                                className="roll-table-btn skill-hero-roll-btn"
                                onRoll={(power, dir) => rollSimpleSkill(skill, selectedSkill, power, dir)}
                                title="Click or Hold & Release to throw dice with velocity"
                            >
                                <i className="fas fa-dice-d20"></i> ROLL
                            </ChargeableRollButton>
                        </div>
                    </div>
                ) : (
                    <div className="skill-detail-header">
                        <div className="skill-header-icon-box">
                            <img src={skillIconUrl} alt={skillDisplayName} className="skill-detail-icon" />
                        </div>
                        <div className="skill-detail-title-section">
                            <div className="skill-simple-name-row">
                                <h2 className="skill-detail-name" style={{ color: rank.color }}>
                                    {skillDisplayName}
                                </h2>
                                <span className="skill-active-rank-pill" style={{ color: rank.color || '#d4af37' }}>
                                    {effectiveRank.name} (d{DIE_SIZE_MAP[effectiveRank.key]})
                                </span>
                            </div>
                            <p className="skill-detail-description">{description}</p>
                            
                            <div className="skill-simple-attrs">
                                <span 
                                    className="skill-attr-badge primary" 
                                    title={`${modBreakdown.primaryStat.toUpperCase()} Score: ${modBreakdown.primaryStatVal} → Modifier: ${modBreakdown.primaryMod >= 0 ? `+${modBreakdown.primaryMod}` : modBreakdown.primaryMod}`}
                                >
                                    <i className="fas fa-star"></i> {modBreakdown.primaryStat.toUpperCase()} ({modBreakdown.primaryMod >= 0 ? `+${modBreakdown.primaryMod}` : modBreakdown.primaryMod})
                                </span>
                                {modBreakdown.secondaryStat && (
                                    <>
                                        <span className="skill-attr-operator">+</span>
                                        <span 
                                            className="skill-attr-badge secondary" 
                                            title={`${modBreakdown.secondaryStat.toUpperCase()} Score: ${modBreakdown.secondaryStatVal} (Mod: ${modBreakdown.secondaryMod >= 0 ? `+${modBreakdown.secondaryMod}` : modBreakdown.secondaryMod}) → Half Applied: ${modBreakdown.secondaryHalf >= 0 ? `+${modBreakdown.secondaryHalf}` : modBreakdown.secondaryHalf}`}
                                        >
                                            <i className="fas fa-shield"></i> {modBreakdown.secondaryStat.toUpperCase()} ({modBreakdown.secondaryHalf >= 0 ? `+${modBreakdown.secondaryHalf}` : modBreakdown.secondaryHalf})
                                        </span>
                                    </>
                                )}
                                <span className="skill-attr-operator">+</span>
                                <span 
                                    className="skill-attr-badge rank" 
                                    title={`Rank ${effectiveRank.name} grants +${modBreakdown.rankBonus} tier bonus`}
                                >
                                    <i className="fas fa-award"></i> RANK ({modBreakdown.rankBonus >= 0 ? `+${modBreakdown.rankBonus}` : modBreakdown.rankBonus})
                                </span>
                                <span className="skill-attr-operator">=</span>
                                <span 
                                    className="skill-attr-badge modifier" 
                                    title={`Total Modifier = Primary (${modBreakdown.primaryMod >= 0 ? `+${modBreakdown.primaryMod}` : modBreakdown.primaryMod}) + Secondary Half (${modBreakdown.secondaryHalf >= 0 ? `+${modBreakdown.secondaryHalf}` : modBreakdown.secondaryHalf}) + Rank (${modBreakdown.rankBonus >= 0 ? `+${modBreakdown.rankBonus}` : modBreakdown.rankBonus}) = ${modifier >= 0 ? `+${modifier}` : modifier}`}
                                >
                                    <i className="fas fa-shield-halved"></i> MODIFIER: {modifier >= 0 ? `+${modifier}` : modifier}
                                </span>
                            </div>

                            <div className="skill-resolution-formula-banner" style={{ marginTop: '8px' }}>
                                <div className="resolution-formula-item">
                                    <span className="formula-tag">ROLL FORMULA</span>
                                    <span className="formula-math">
                                        <strong>d{DIE_SIZE_MAP[effectiveRank.key]}</strong> <span className="formula-muted">(Die)</span>
                                        {modifier >= 0 ? ' + ' : ' - '}
                                        <strong className="formula-highlight">{Math.abs(modifier)}</strong> <span className="formula-muted">(Mod)</span>
                                    </span>
                                </div>
                                <div className="resolution-exploding-item">
                                    <i className="fas fa-bolt"></i>
                                    <span><strong>Exploding Dice:</strong> Max roll on d{DIE_SIZE_MAP[effectiveRank.key]} rolls again and adds to total!</span>
                                </div>
                            </div>
                        </div>
                        {(skill.rollableTable || skill.rollableTables) && (
                            <div className="skill-table-controls">
                                {renderRollModeToggle(selectedSkill)}
                                <DiceThemeSelector compact={true} />
                                <ChargeableRollButton
                                    className="roll-table-btn"
                                    onRoll={(power, dir) => rollSkillTable(skill, selectedSkill, power, dir)}
                                    title="Click or Hold & Release to throw dice with velocity"
                                >
                                    <i className="fas fa-dice"></i> Roll
                                </ChargeableRollButton>
                                {renderExhaustionRollNote()}
                            </div>
                        )}
                    </div>
                )}

                {isWeaponMastery && (
                    <div className="weapon-mastery-section">
                        <div className="weapon-mastery-header-row">
                            <div className="weapon-mastery-title-wrap">
                                <i className="fas fa-shield-halved" style={{ color: '#d4af37' }}></i>
                                <h4>Weapon Disciplines & Mastery Arsenal</h4>
                                <span className="weapon-mastery-count-pill">{filteredWeaponEntries.length} Disciplines</span>
                            </div>
                            <div className="weapon-category-filter-pills">
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'one-handed', label: 'One-Handed' },
                                    { id: 'two-handed', label: 'Two-Handed' },
                                    { id: 'ranged', label: 'Ranged' },
                                    { id: 'instruments', label: 'Instruments' }
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        className={`weapon-cat-pill ${weaponCategoryFilter === cat.id ? 'active' : ''}`}
                                        onClick={() => setWeaponCategoryFilter(cat.id)}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="weapon-mastery-grid">
                            {filteredWeaponEntries.map(([weaponKey, meta]) => {
                                const weaponRank = getWeaponTypeRank(weaponKey);
                                const isSelected = selectedWeaponType === weaponKey;
                                return (
                                    <div
                                        key={weaponKey}
                                        className={`weapon-mastery-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => setSelectedWeaponType(weaponKey)}
                                        role="button"
                                        tabIndex={0}
                                        title={`${meta.label}: ${meta.hint}`}
                                        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedWeaponType(weaponKey)}
                                    >
                                        <div className="weapon-card-rank-chip" style={{ background: weaponRank.color || '#7f8c8d' }}>
                                            {weaponRank.name}
                                        </div>
                                        <div className="weapon-card-icon-frame">
                                            <img src={meta.icon} alt={meta.label} className="weapon-card-icon" />
                                        </div>
                                        <div className="weapon-card-info">
                                            <span className="weapon-card-name">{meta.label}</span>
                                            <span className="weapon-card-die">d{DIE_SIZE_MAP[weaponRank.key] || 4}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {selectedWeaponType && (() => {
                            const wMeta = WEAPON_TYPE_META[selectedWeaponType] || {};
                            const wRank = getWeaponTypeRank(selectedWeaponType);
                            const wBreakdown = getSkillModifierBreakdown(skill, 'weaponMastery');
                            return (
                                <div className="weapon-discipline-detail-card">
                                    <div className="weapon-discipline-hero">
                                        <div className="discipline-icon-box">
                                            <img src={wMeta.icon} alt="" />
                                        </div>
                                        <div className="discipline-info">
                                            <div className="discipline-title-row">
                                                <h3>{wMeta.label} Mastery</h3>
                                                <span className="discipline-rank-tag" style={{ color: wRank.color }}>
                                                    {wRank.name} (d{DIE_SIZE_MAP[wRank.key] || 4})
                                                </span>
                                            </div>
                                            <p className="discipline-hint">{wMeta.hint}</p>

                                            <div className="skill-simple-attrs" style={{ marginTop: '4px' }}>
                                                <span 
                                                    className="skill-attr-badge primary" 
                                                    title={`${wBreakdown.primaryStat.toUpperCase()} Score: ${wBreakdown.primaryStatVal} → Modifier: ${wBreakdown.primaryMod >= 0 ? `+${wBreakdown.primaryMod}` : wBreakdown.primaryMod}`}
                                                >
                                                    <i className="fas fa-star"></i> {wBreakdown.primaryStat.toUpperCase()} ({wBreakdown.primaryMod >= 0 ? `+${wBreakdown.primaryMod}` : wBreakdown.primaryMod})
                                                </span>
                                                {wBreakdown.secondaryStat && (
                                                    <>
                                                        <span className="skill-attr-operator">+</span>
                                                        <span 
                                                            className="skill-attr-badge secondary" 
                                                            title={`${wBreakdown.secondaryStat.toUpperCase()} Score: ${wBreakdown.secondaryStatVal} (Mod: ${wBreakdown.secondaryMod >= 0 ? `+${wBreakdown.secondaryMod}` : wBreakdown.secondaryMod}) → Half Applied: ${wBreakdown.secondaryHalf >= 0 ? `+${wBreakdown.secondaryHalf}` : wBreakdown.secondaryHalf}`}
                                                        >
                                                            <i className="fas fa-shield"></i> {wBreakdown.secondaryStat.toUpperCase()} ({wBreakdown.secondaryHalf >= 0 ? `+${wBreakdown.secondaryHalf}` : wBreakdown.secondaryHalf})
                                                        </span>
                                                    </>
                                                )}
                                                <span className="skill-attr-operator">+</span>
                                                <span 
                                                    className="skill-attr-badge rank" 
                                                    title={`Rank ${wRank.name} grants +${wBreakdown.rankBonus} tier bonus`}
                                                >
                                                    <i className="fas fa-award"></i> RANK ({wBreakdown.rankBonus >= 0 ? `+${wBreakdown.rankBonus}` : wBreakdown.rankBonus})
                                                </span>
                                                <span className="skill-attr-operator">=</span>
                                                <span 
                                                    className="skill-attr-badge modifier" 
                                                    title={`Total Modifier = Primary (${wBreakdown.primaryMod >= 0 ? `+${wBreakdown.primaryMod}` : wBreakdown.primaryMod}) + Secondary Half (${wBreakdown.secondaryHalf >= 0 ? `+${wBreakdown.secondaryHalf}` : wBreakdown.secondaryHalf}) + Rank (${wBreakdown.rankBonus >= 0 ? `+${wBreakdown.rankBonus}` : wBreakdown.rankBonus}) = ${wBreakdown.totalMod >= 0 ? `+${wBreakdown.totalMod}` : wBreakdown.totalMod}`}
                                                >
                                                    <i className="fas fa-shield-halved"></i> MODIFIER: {wBreakdown.totalMod >= 0 ? `+${wBreakdown.totalMod}` : wBreakdown.totalMod}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {renderWeaponStuntTechniques(selectedWeaponType, wBreakdown, wRank)}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {!isSimpleMode && (
                <div className="quest-section">
                    <div className="quest-header-row">
                        <h3>
                            Available Quests
                            {isWeaponMastery && (
                                <> – {WEAPON_TYPE_LABELS[selectedWeaponType] || 'Weapon'}</>
                            )}
                        </h3>
                        <button
                            className="quest-toggle-btn"
                            onClick={() => setShowCompletedQuests(!showCompletedQuests)}
                            title={`${showCompletedQuests ? 'Hide' : 'Show'} completed quests`}
                        >
                            {showCompletedQuests ? 'Hide Completed' : 'Show Completed'}
                        </button>
                    </div>
                    {quests.length === 0 ? (
                        <div className="no-quests-message">
                            <i className="fas fa-info-circle" style={{ fontSize: '24px', color: '#8b7355', marginBottom: '10px' }}></i>
                            <p>No quests available for this skill yet.</p>
                        </div>
                    ) : (
                    <div className="quest-list">
                        {quests.map(quest => {
                            const isCompleted = completedQuests.includes(quest.id);
                            const questProgress = (skillProgress[getProgressKey(selectedSkill)]?.questProgress || {})[quest.id] || 0;
                            const isProgressive = !!quest.progressGoal;
                            if (isCompleted && !showCompletedQuests) return null;
                            return (
                                <div
                                    key={quest.id}
                                    className={`quest-item ${isCompleted ? 'completed' : ''}`}
                                    onClick={() => toggleQuest(selectedSkill, quest.id)}
                                >
                                    <img src={quest.icon.startsWith('http') ? quest.icon : getCustomIconUrl(quest.icon, 'abilities')} alt={quest.name} className="quest-icon" />
                                    <div className="quest-info">
                                        <h5 className="quest-name">
                                            {quest.name}
                                            {quest.rank && (
                                                <span className="quest-rank-chip">{quest.rank}</span>
                                            )}
                                            {isProgressive && (
                                                <span className="quest-progress-chip">
                                                    {questProgress}/{quest.progressGoal}
                                                </span>
                                            )}
                                        </h5>
                                        <p className="quest-description">{quest.description}</p>
                                        {isProgressive && (
                                            <button
                                                className="quest-progress-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    incrementQuestProgress(selectedSkill, quest.id, quest.progressGoal);
                                                }}
                                                disabled={isCompleted}
                                                title="Increment progress"
                                            >
                                                +1
                                            </button>
                                        )}
                                    </div>
                                    <div className="quest-status">
                                        {isCompleted ? '✓' : '� - �'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    )}
                </div>
                )}

                {!isSimpleMode && (() => {
                    // Check if this skill uses the new multi-dimensional table structure
                    const rankTables = skill.rollableTables?.[effectiveRank.key] || skill.rollableTables?.UNTRAINED;
                    const hasMultiDieTables = rankTables && typeof rankTables === 'object' && rankTables.d4;

                    const dieKey = isWeaponMastery ? 'd8' : selectedDie;
                    const currentTableId = getCurrentRollableTable(skill, selectedSkill, effectiveRank.key, dieKey);
                    const currentTable = currentTableId ? ROLLABLE_TABLES[currentTableId] : null;

                    // Weapon mastery flavor override

                    const renderWeaponFlavor = (entry) => {
                        const rollFace = Array.isArray(entry.roll) ? entry.roll[0] : entry.roll || 1;
                        const faceText = WEAPON_FACE_TEXT[selectedWeaponType]?.[Math.min(20, Math.max(1, rollFace))];
                        return faceText || entry.result;
                    };

                    return currentTable && (
                        <div className="table-section">
                            {hasMultiDieTables && (
                                <div className="die-selector-section">
                                    <h4>Difficulty (Die Type)</h4>
                                    <div className="die-selector-strip">
                                        {['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map(die => (
                                            <div
                                                key={die}
                                                className={`die-selector-icon ${selectedDie === die ? 'selected' : ''}`}
                                                data-die={die}
                                                onClick={() => setSelectedDie(die)}
                                                title={`${die.toUpperCase()} - ${
                                                    die === 'd4' ? 'Very Easy' :
                                                    die === 'd6' ? 'Easy' :
                                                    die === 'd8' ? 'Moderate' :
                                                    die === 'd10' ? 'Challenging' :
                                                    die === 'd12' ? 'Difficult' :
                                                    'Very Difficult'
                                                }`}
                                            >
                                                <span className="die-number">{die.substring(1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <h3>Rollable Table ({effectiveRank.name}): {currentTable.name}</h3>
                            <p>{currentTable.description}</p>
                            <div className="table-entries">
                                {currentTable.table.map((entry, index) => (
                                    <div key={index} className={`table-entry ${entry.type}`}>
                                        <span className="roll-range">
                                            {entry.roll[0] === entry.roll[1]
                                                ? entry.roll[0]
                                                : `${entry.roll[0]}-${entry.roll[1]}`}
                                        </span>
                                        <span className="roll-result">{isWeaponMastery ? renderWeaponFlavor(entry) : entry.result}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {isSimpleMode && (
                    <>
                    {/* What This Skill Covers */}
                    <div className="skill-simple-card">
                        <h4><i className="fas fa-compass"></i> What This Skill Covers</h4>
                        <p className="skill-simple-context">{skill.description}</p>
                        <div className="skill-simple-hint">
                            <i className="fas fa-lightbulb"></i>
                            <span>Use this skill whenever your character attempts something that matches its expertise. The GM sets a DC based on difficulty.</span>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="skill-simple-card">
                        <h4><i className="fas fa-bolt"></i> How It Works</h4>
                        <div className="skill-simple-steps">
                            <div className="skill-step">
                                <div className="skill-step-num">1</div>
                                <div className="skill-step-body">
                                    <strong>Roll your die</strong>
                                    <span>You have a <strong>d{DIE_SIZE_MAP[effectiveRank.key]}</strong>. Roll it and announce the total to the GM.</span>
                                </div>
                            </div>
                            <div className="skill-step">
                                <div className="skill-step-num">2</div>
                                <div className="skill-step-body">
                                    <strong>Against the DC</strong>
                                    <span>The GM sets a DC. Meet or beat it to succeed. The closer you are, the more dramatic the outcome.</span>
                                </div>
                            </div>
                            <div className="skill-step">
                                <div className="skill-step-num">3</div>
                                <div className="skill-step-body">
                                    <strong>Exploding dice</strong>
                                    <span>Roll the maximum? Roll again and add! Multiple explosions can chain for legendary results.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Advancement */}
                    <div className="skill-simple-card skill-advancement-card">
                        <h4><i className="fas fa-arrow-up"></i> Getting Better</h4>
                        <p className="skill-simple-context">
                            When you do something <strong>extraordinary</strong> with this skill (a creative solution, a clutch success under pressure, or a moment that makes the table cheer) the GM may award you a die upgrade.
                        </p>
                        <div className="skill-advancement-track">
                            {Object.entries(SKILL_RANKS).map(([key, data]) => {
                                const dieSize = DIE_SIZE_MAP[key];
                                const isCurrent = effectiveRank.key === key;
                                const isPast = Object.keys(SKILL_RANKS).indexOf(effectiveRank.key) > Object.keys(SKILL_RANKS).indexOf(key);
                                return (
                                    <div
                                        key={key}
                                        className={`advancement-node ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
                                        style={{ borderColor: data.color }}
                                    >
                                        <span className="advancement-die">d{dieSize}</span>
                                        <span className="advancement-name">{data.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="skill-simple-hint">
                            <i className="fas fa-comments"></i>
                            <span>Advancement is a conversation. There are no XP bars: just memorable moments.</span>
                        </div>
                    </div>
                    </>
                )}
            </div>
        );
    };

    // Toggle category collapse state
    const toggleCategory = (categoryName) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    // Filter categories mapping
    const CATEGORY_ID_MAP = {
        combat: 'Combat Mastery',
        exploration: 'Exploration & Survival',
        social: 'Social & Influence',
        arcane: 'Arcane Studies'
    };

    // Auto-select first skill of category or first available skill if none selected
    useEffect(() => {
        if (!selectedSkill) {
            if (propCategory && CATEGORY_ID_MAP[propCategory]) {
                const targetName = CATEGORY_ID_MAP[propCategory];
                const catSkills = skillsByCategory[targetName];
                if (catSkills && catSkills.length > 0) {
                    setSelectedSkill(catSkills[0].id);
                    return;
                }
            }
            const allCategories = Object.values(skillsByCategory);
            if (allCategories.length > 0 && allCategories[0].length > 0) {
                setSelectedSkill(allCategories[0][0].id);
            }
        }
    }, [propCategory, selectedSkill, skillsByCategory, setSelectedSkill]);

    return (
        <div className={`skills-container ${selectedSkill ? 'has-selected-skill' : ''}`}>
            <div className={`skills-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <button
                    className="skills-sidebar-toggle-button"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                    <span className="skills-toggle-icon">
                        <i className={sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'}></i>
                    </span>
                </button>
                {!sidebarCollapsed && (
                    <div className="skills-search-container">
                    <input
                        type="text"
                        className="skills-search-input"
                        placeholder="Search skills and quests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <i
                            className="fas fa-times skills-search-clear"
                            onClick={() => setSearchQuery('')}
                        >                        </i>
                    )}
                    </div>
                )}

                {!sidebarCollapsed && (searchQuery.trim() ? (
                    // Show search results
                    <div className="skill-search-results">
                        <div className="skill-category-header">
                            <i className="fas fa-search skill-category-icon-fa"></i>
                            <span className="skill-category-name">Search Results ({searchResults.length})</span>
                        </div>
                        <div className="skill-list">
                            {searchResults.length > 0 ? searchResults.map(skill => {
                                const rank = getSkillRank(skill.id);
                                const quests = getAvailableQuests(skill.id);
                                const completedQuests = skillProgress[skill.id]?.completedQuests || [];
                                const isSelected = selectedSkill === skill.id;

                                return (
                                    <div
                                        key={skill.id}
                                        className={`skill-list-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedSkill(skill.id);
                                            setSearchQuery(''); // Clear search after selection
                                        }}
                                    >
                                        <div className="skill-list-name" style={{ color: rank.color }}>
                                            {skill.name}{' '}
                                            <span className="skill-rank-label">
                                                {isSimpleMode ? `(d${DIE_SIZE_MAP[rank.key]})` : `(${rank.name})`}
                                            </span>
                                        </div>
                                        <div className="skill-list-progress">
                                            {isSimpleMode ? `d${DIE_SIZE_MAP[rank.key]}` : `${completedQuests.length}/${quests.length}`}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="no-search-results">
                                    <i className="fas fa-search" style={{ fontSize: '24px', color: '#8b7355', marginBottom: '10px' }}></i>
                                    <p>No skills or quests found</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Show normal category view
                    Object.entries(skillsByCategory).map(([categoryName, skills]) => {
                        const categoryData = Object.values(SKILL_CATEGORIES).find(cat => cat.name === categoryName);
                        const isCollapsed = collapsedCategories[categoryName];

                        // Map skill categories to gem icons for the right side
                        const getCategoryGemIcon = (categoryName) => {
                            const gemMap = {
                                'Combat Mastery': 'Misc/Profession Resources/Gems/resource-orange-red-diamond-gem-fiery-glow',
                                'Exploration & Survival': 'Misc/Profession Resources/Gems/resource-green-faceted-gem-crystal',
                                'Social & Influence': 'Misc/Profession Resources/Gems/resource-golden-orange-diamond-crystal-ore',
                                'Arcane Studies': 'Misc/Profession Resources/Gems/resource-purple-gem-crystal-shiny'
                            };
                            return gemMap[categoryName] || 'Misc/Profession Resources/Gems/resource-block-purple-spotted-beige-face';
                        };

                        return (
                            <div key={categoryName} className="skill-category-section">
                                <div
                                    className="skill-category-header"
                                    onClick={() => toggleCategory(categoryName)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={categoryData?.icon?.startsWith('http') ? categoryData.icon : getCustomIconUrl(categoryData?.icon || 'Utility/Utility', 'abilities')} alt="" className="skill-category-icon" />
                                    <span className="skill-category-name">{categoryName}</span>
                                    <img 
                                        src={getIconUrl(getCategoryGemIcon(categoryName), 'items')} 
                                        alt="" 
                                        className="category-toggle-icon"
                                        style={{ width: '16px', height: '16px', marginLeft: 'auto' }}
                                        onError={(e) => {
                                            e.target.src = getIconUrl('Misc/Profession Resources/Gems/resource-block-purple-spotted-beige-face', 'items');
                                        }}
                                    />
                                </div>
                                {!isCollapsed && (
                                    <div className="skill-list">
                                        {skills.map(skill => {
                                            const rank = getSkillRank(skill.id);
                                            const quests = getAvailableQuests(skill.id);
                                            const completedQuests = skillProgress[skill.id]?.completedQuests || [];
                                            const isSelected = selectedSkill === skill.id;

                                            return (
                                                <div
                                                    key={skill.id}
                                                    className={`skill-list-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => setSelectedSkill(skill.id)}
                                                >
                                                    <div className="skill-list-name" style={{ color: rank.color }}>
                                                        {skill.name}{' '}
                                                        <span className="skill-rank-label">
                                                            {isSimpleMode ? `(d${DIE_SIZE_MAP[rank.key]})` : `(${rank.name})`}
                                                        </span>
                                                    </div>
                                                    <div className="skill-list-progress">
                                                        {isSimpleMode ? `d${DIE_SIZE_MAP[rank.key]}` : `${completedQuests.length}/${quests.length}`}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ))}
            </div>

            <div className={`skills-content ${selectedSkill ? 'active-skill-detail' : ''}`}>
                {renderSkillDetail()}
            </div>
        </div>
    );
}