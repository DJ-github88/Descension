import React, { useState } from 'react';
import useCharacterStore from '../../store/characterStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import { SKILL_CATEGORIES, SKILL_DEFINITIONS, SKILL_RANKS } from '../../constants/skillDefinitions';
import { SKILL_QUESTS } from '../../constants/skillQuests';
import { WEAPON_TYPE_QUEST_DATA } from '../../constants/weaponTypeQuests';
import { WEAPON_TYPE_META } from '../../constants/weaponTypeMeta';
import { ROLLABLE_TABLES } from '../../constants/rollableTables';
import { calculateStatModifier } from '../../utils/characterUtils';
import { showSkillRollNotification } from '../../utils/skillRollNotification';
import { showAchievementNotification } from '../../utils/achievementNotification';
import usePresenceStore from '../../store/presenceStore';
import { getIconUrl, getCustomIconUrl } from '../../utils/assetManager';

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

export default function Skills() {
    // Use inspection context if available, otherwise use regular character store
    const inspectionData = useInspectionCharacter();
    const characterStore = useCharacterStore();

    // Choose data source based on whether we're in inspection mode
    const dataSource = inspectionData || characterStore;

    const {
        stats,
        equipmentBonuses,
        skillProgress = {},
        skillRanks = {},
        updateSkillProgress
    } = dataSource;

    const [selectedSkill, setSelectedSkill] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDie, setSelectedDie] = useState('d20'); // Default to d20 (hardest)
    const [selectedWeaponType, setSelectedWeaponType] = useState('sword');
    const [showCompletedQuests, setShowCompletedQuests] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
                // New structure: proficiency × die type
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

    // Roll on a skill table
    const rollSkillTable = (skill, skillId) => {
        const rank = getSkillRank(skillId);
        const isWeaponMastery = (skillId || selectedSkill) === 'weaponMastery';
        const dieKey = isWeaponMastery ? 'd8' : selectedDie;
        const tableId = getCurrentRollableTable(skill, skillId, rank.key, dieKey);
        const table = ROLLABLE_TABLES[tableId];
        if (!table) return;

        // Get the die size from selectedDie (e.g., 'd20' -> 20)
        const dieSize = parseInt(dieKey.substring(1));
        const roll = Math.floor(Math.random() * dieSize) + 1;
        const result = table.table.find(entry =>
            roll >= entry.roll[0] && roll <= entry.roll[1]
        );

        if (result) {
            // Show beautiful notification instead of ugly alert
            console.log(`Rolled ${roll}: ${result.result}`);
            showSkillRollNotification(roll, result, skill.name);
        }
    };

    // Calculate skill modifier
    const getSkillModifier = (skill) => {
        const primaryMod = calculateStatModifier(stats[skill.primaryStat] + (equipmentBonuses[skill.primaryStat] || 0));
        const secondaryMod = calculateStatModifier(stats[skill.secondaryStat] + (equipmentBonuses[skill.secondaryStat] || 0));
        const rank = getSkillRank(Object.keys(SKILL_DEFINITIONS).find(key => SKILL_DEFINITIONS[key] === skill));
        const rankBonus = Object.keys(SKILL_RANKS).indexOf(rank.key);

        return primaryMod + Math.floor(secondaryMod / 2) + rankBonus;
    };

    const getWeaponTypeRank = (weaponType) => getSkillRank('weaponMastery', weaponType);

    // Render skill detail view (right side)
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
        const rank = getSkillRank(selectedSkill);
        const effectiveRank = rank;
        const modifier = getSkillModifier(skill);
        const quests = getAvailableQuests(selectedSkill);
        const progressKey = getProgressKey(selectedSkill);
        const currentProgress = skillProgress[progressKey] || { completedQuests: [] };
        const completedQuests = currentProgress.completedQuests || [];

        return (
            <div className="skill-detail-view">
                <div className="skill-detail-header">
                    <img src={skill.icon.startsWith('http') ? skill.icon : getCustomIconUrl(skill.icon, 'abilities')} alt={skill.name} className="skill-detail-icon" />
                    <div className="skill-detail-title-section">
                        <h2 className="skill-detail-name" style={{ color: rank.color }}>
                            {isWeaponMastery
                                ? `${WEAPON_TYPE_LABELS[selectedWeaponType] || 'Weapon'} Mastery`
                                : skill.name}
                        </h2>
                        <p className="skill-detail-description">{skill.description}</p>
                        <div className="skill-detail-stats">
                            <span className="skill-rank">{effectiveRank.name}</span>
                            <span className="skill-modifier">+{modifier}</span>
                            <span className="skill-progress">
                                {completedQuests.length}/{quests.length} Quests
                            </span>
                        </div>
                    </div>
                    {(skill.rollableTable || skill.rollableTables) && (
                        <button
                            className="roll-table-btn"
                            onClick={() => rollSkillTable(skill, selectedSkill)}
                        >
                            <i className="fas fa-dice"></i> Roll
                        </button>
                    )}
                </div>

                {isWeaponMastery && (
                    <div className="damage-type-section">
                        <h4>Weapon Type (for quests & rolls)</h4>
                        <div className="damage-type-grid weapon-type-grid">
                            {Object.entries(WEAPON_TYPE_META).map(([weaponKey, meta]) => {
                                const weaponRank = getWeaponTypeRank(weaponKey);
                                const weaponRankStyleVars = buildWeaponRankStyles(weaponRank.color);
                                return (
                                    <div
                                        key={weaponKey}
                                        className={`damage-type-option weapon-type-option ${selectedWeaponType === weaponKey ? 'selected' : ''}`}
                                        onClick={() => setSelectedWeaponType(weaponKey)}
                                        role="button"
                                        tabIndex={0}
                                        title={`${meta.label} — ${meta.hint}`}
                                        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedWeaponType(weaponKey)}
                                        style={weaponRankStyleVars}
                                    >
                                        <span className="weapon-rank-chip">{weaponRank.name}</span>
                                        <img src={meta.icon} alt={meta.label} className="damage-type-icon weapon-type-icon" />
                                        <div className="weapon-type-name">{meta.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
                                        {isCompleted ? '✓' : '○'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    )}
                </div>

                {(() => {
                    // Check if this skill uses the new multi-dimensional table structure
                    const rankTables = skill.rollableTables?.[effectiveRank.key] || skill.rollableTables?.UNTRAINED;
                    const hasMultiDieTables = rankTables && typeof rankTables === 'object' && rankTables.d4;

                    const dieKey = isWeaponMastery ? 'd8' : selectedDie;
                    const currentTableId = getCurrentRollableTable(skill, selectedSkill, effectiveRank.key, dieKey);
                    const currentTable = currentTableId ? ROLLABLE_TABLES[currentTableId] : null;

                    // Weapon mastery flavor override
                    const WEAPON_FACE_TEXT = {
                        sword: {
                            1: 'Blade overextends; lose 1 AP and you cannot riposte this round.',
                            2: 'Edge scrapes; shallow cut only.',
                            3: 'Measured cut; steady but simple.',
                            4: 'Quick slash; you may step 1 after the hit.',
                            5: 'Pommel check; on hit, target reels and loses 1 space of movement.',
                            6: 'Cross-cut; on hit, roll weapon die again and add half.',
                            7: 'Riposte set; if target attacks you before your next turn, make a free counter at -2.',
                            8: 'Dancing steel; make a free follow-up slash at half damage.'
                        },
                        axe: {
                            1: 'Head bites and lodges; spend 1 AP to wrench it free.',
                            2: 'Heavy chop skids; half damage.',
                            3: 'Wide arc forces them back 1 space on hit.',
                            4: 'Hack through; +2 damage versus shields or hard cover.',
                            5: 'Cleave; on hit, deal 2 damage to an adjacent foe.',
                            6: 'Hook and yank; pull target 1 space on hit.',
                            7: 'Rending blow; on hit, target suffers a bleeding nick (GM: minor ongoing).',
                            8: 'Sundering chop; on hit, crack armor or deal +4 damage.'
                        },
                        mace: {
                            1: 'Shock up the arm; you drop 1 AP after this swing.',
                            2: 'Glancing crown; half damage.',
                            3: 'Bruising tap; normal damage.',
                            4: 'Ringing strike; on hit, target’s next action is -1.',
                            5: 'Shatter guard; ignore hardness/armor for this hit.',
                            6: 'Crush limb; on hit, target’s move is -1 until end of next turn.',
                            7: 'Concussive blow; on hit, target is dazed (loses 1 AP) or takes +3 damage.',
                            8: 'Skull-rattler; on hit, target is stunned for a turn or takes +5 damage.'
                        },
                        dagger: {
                            1: 'Slip; nick yourself for 1 damage.',
                            2: 'Short slash; half damage.',
                            3: 'Close stab; normal damage.',
                            4: 'Gut jab; +1 damage and you may hide weapon-side if fiction allows.',
                            5: 'Hamstring; on hit, target’s speed -1 until it recovers.',
                            6: 'Quickhand; on hit, make a second dagger jab at -3 to hit.',
                            7: 'Bleed line; on hit, target suffers minor ongoing bleed (GM adjudicates).',
                            8: 'Assassin’s flick; on hit, add weapon die again and step 1 for free.'
                        },
                        greatsword: {
                            1: 'Mass overbalances; fall prone unless you spend 1 AP to steady.',
                            2: 'Draggy swing; half damage.',
                            3: 'Wide arc; push target 1 on hit.',
                            4: 'Driving cut; +2 damage.',
                            5: 'Mighty sweep; on hit, also deal 2 damage to an adjacent foe.',
                            6: 'Batter through; ignore heavy cover for this attack.',
                            7: 'Cleaving stride; on hit, shift 1 and strike a second adjacent foe at -2 to hit.',
                            8: 'Heaving execution; on hit, add weapon die again and force target prone or take +5 damage.'
                        },
                        greataxe: {
                            1: 'Head bites stone; you must spend 1 AP to free it.',
                            2: 'Wild chop; half damage and you stagger 1 space.',
                            3: 'Raking cut; normal damage.',
                            4: 'Hefted cleave; +2 damage.',
                            5: 'Armor split; on hit, ignore armor/hardness for this strike.',
                            6: 'Sweeping murder; cleave an adjacent foe for half damage.',
                            7: 'Bonebreaker; on hit, target’s next move is halved; if it can’t move, +3 damage.',
                            8: 'Executioner’s arc; on hit, add weapon die again and the target is rattled (loses 1 AP).'
                        },
                        maul: {
                            1: 'Recoil numbs arms; lose 1 AP after this attack.',
                            2: 'Head drags; half damage.',
                            3: 'Thudding hit; normal damage.',
                            4: 'Cratering blow; +2 damage.',
                            5: 'Ring their bell; on hit, target is dazed (loses 1 AP) or takes +3 damage.',
                            6: 'Ground-shake; on hit, target is knocked prone.',
                            7: 'Stunning smash; on hit, target is stunned for a turn.',
                            8: 'Pulverize; on hit, add weapon die again and shove target 2 spaces.'
                        },
                        polearm: {
                            1: 'Hook catches; you cannot shift this turn.',
                            2: 'Overreach; half damage.',
                            3: 'Set vs advance; if target moves toward you, it takes +2 damage on hit.',
                            4: 'Lever pull; on hit, pull target 2 or push 2.',
                            5: 'Trip arc; on hit, target is knocked prone.',
                            6: 'Pin and post; target’s move is -2 until end of next turn.',
                            7: 'Crow’s beak; ignore armor and add +3 damage.',
                            8: 'Whirl hook; on hit, reposition the target 3 and follow into its space.'
                        },
                        staff: {
                            1: 'Misstep; you fall prone unless you spend 1 AP to steady.',
                            2: 'Glance; half damage.',
                            3: 'Quick rap; normal damage.',
                            4: 'Low sweep; on hit, target’s next attack roll is -1.',
                            5: 'Disarm flick; on hit, target drops a held item or takes +2 damage.',
                            6: 'Trip and follow; on hit, target goes prone and you may step 1.',
                            7: 'Sweeping arc; on hit, target is knocked prone or stunned for a turn.',
                            8: 'Whirling stave; on hit, strike a second adjacent foe for half damage and shift 1.'
                        },
                        bow: {
                            1: 'String frays; next shot costs +1 AP to ready.',
                            2: 'Wind catches; half damage.',
                            3: 'Arced shot; normal damage.',
                            4: 'Pinning arrow; on hit, target’s next move is -2.',
                            5: 'Seam seeker; ignore cover on this shot.',
                            6: 'Marked; on hit, next ally to shoot this target gains +2 to hit.',
                            7: 'Whistling arc; on hit, add +2 range to your next shot and deal +2 damage now.',
                            8: 'Twin release; fire a second arrow at the same target for half damage.'
                        },
                        crossbow: {
                            1: 'Latch jams; spend 1 AP to clear before next shot.',
                            2: 'Bolt skitters; half damage.',
                            3: 'Solid bolt; normal damage.',
                            4: 'Pinned limb; on hit, target’s next action is -1.',
                            5: 'Crank and fire; ignore cover on this shot.',
                            6: 'Punch-through; on hit, add +3 damage.',
                            7: 'Rattling hit; on hit, target loses 1 AP next turn.',
                            8: 'Snap reload; after this hit, reload for free and gain +1 damage on the next shot.'
                        },
                        thrown: {
                            1: 'Slip; weapon drops at your feet.',
                            2: 'Off-line; half damage.',
                            3: 'Solid throw; normal damage.',
                            4: 'Pin cloak; on hit, target’s speed -2.',
                            5: 'Gouging strike; on hit, target is dazzled—its next attack roll is -1.',
                            6: 'Ricochet; on hit, choose a second nearby target for 2 damage.',
                            7: 'Crippling toss; on hit, target’s next action is -1 and it bleeds (GM adjudicates).',
                            8: 'Bullseye; on hit, add weapon die again and you may immediately retrieve the weapon.'
                        },
                        wand: {
                            1: 'Mana sputter; lose 1 mana/charge.',
                            2: 'Wild spark; half damage, minor harmless sparks.',
                            3: 'Arcane dart; normal damage.',
                            4: 'Channel; on hit, regain 1 mana/charge.',
                            5: 'Spell lash; on hit, target’s next action is -1.',
                            6: 'Force pulse; on hit, push target 2.',
                            7: 'Focused surge; on hit, regain 2 mana/charges.',
                            8: 'Overchannel; on hit, add weapon die again and choose: regain 2 mana/charges or deal +4 damage.'
                        },
                        unarmed: {
                            1: 'Wild swing; you overextend and lose 1 AP.',
                            2: 'Glancing jab; half damage.',
                            3: 'Solid hit; normal damage.',
                            4: 'Counter palm; on hit, shove target 1 space.',
                            5: 'Elbow in; on hit, target’s next attack is -1.',
                            6: 'Sweep the leg; on hit, target is knocked prone.',
                            7: 'Stunning strike; on hit, target is dazed (loses 1 AP) or takes +3 damage.',
                            8: 'Open-hand finale; on hit, add weapon die again and shift 1 into a better position.'
                        }
                    };

                    const renderWeaponFlavor = (entry) => {
                        const rollFace = Array.isArray(entry.roll) ? entry.roll[0] : entry.roll || 1;
                        const faceText = WEAPON_FACE_TEXT[selectedWeaponType]?.[Math.min(8, Math.max(1, rollFace))];
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

    return (
        <div className="skills-container">
            <div className={`skills-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <button
                    className="skills-sidebar-toggle-button"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                    <span className="skills-toggle-icon">{sidebarCollapsed ? '▶' : '◀'}</span>
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
                                            {skill.name} <span className="skill-rank-label">({rank.name})</span>
                                        </div>
                                        <div className="skill-list-progress">
                                            {completedQuests.length}/{quests.length}
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
                                                        {skill.name} <span className="skill-rank-label">({rank.name})</span>
                                                    </div>
                                                    <div className="skill-list-progress">
                                                        {completedQuests.length}/{quests.length}
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

            <div className="skills-content">
                {renderSkillDetail()}
            </div>
        </div>
    );
}