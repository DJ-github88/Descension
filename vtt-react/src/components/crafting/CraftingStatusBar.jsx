import React from 'react';
import { getIconUrl } from '../../utils/assetManager';

/**
 * Shared crafting header bar — always visible at the top of every profession
 * interface. Spacious tier-based layout:
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │  [←]  RECIPE NAME                              [📖]  [🧪]  │  Title row
 *   ├─────────────────────────────────────────────────────────────┤
 *   │  [icon] Item  ████████████░░░░░░  62%   ⏱ 5.2s            │  Crafting row
 *   ├─────────────────────────────────────────────────────────────┤
 *   │  Queue (3):  [Q1] [Q2] [Q3] +0 more                       │  Queue row
 *   ├─────────────────────────────────────────────────────────────┤
 *   │  ━━━━━━━━━━━━━━━ Novice 62 / 125 XP ━━━━━━━━━━━━━━━━━━━ │  XP bar
 *   └─────────────────────────────────────────────────────────────┘
 *
 * Each section collapses when not relevant so the header is never cluttered.
 */
function CraftingStatusBar({
    professionId,
    professionLevel,
    professionExperience,
    experienceForNextLevel,
    skillProgress,
    skillColor,
    currentCraftingItem,
    craftingQueue = [],
    defaultIcon = 'inv_misc_questionmark',
    selectedRecipe = null,
    onBackToRecipes,
    onLearnAllRecipes,
    onAddTestMaterials,
    professionName = ''
}) {
    const queuedItems = craftingQueue.filter(
        item => item.status === 'queued' && item.recipe?.profession === professionId
    );

    // Active crafting progress
    let progressValue = 0;
    let timeRemaining = 0;
    if (currentCraftingItem && currentCraftingItem.startTime) {
        const elapsed = Date.now() - currentCraftingItem.startTime;
        const craftingTime = currentCraftingItem.totalTime || currentCraftingItem.recipe?.craftingTime || 5000;
        progressValue = Math.min(100, (elapsed / craftingTime) * 100);
        timeRemaining = Math.max(0, Math.ceil((craftingTime - elapsed) / 1000));
    }

    const accent = skillColor(professionLevel);
    const accentNext = skillColor(Math.min(9, professionLevel + 1));

    return (
        <div className="crafting-header-bar">
            {/* ── Tier 1: Title row ── */}
            <div className="crafting-header-title-row">
                <div className="crafting-header-title-left">
                    {selectedRecipe && onBackToRecipes ? (
                        <button
                            className="crafting-icon-btn"
                            onClick={onBackToRecipes}
                            title="Back to recipes"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    ) : (
                        <div className="crafting-header-profession-icon">
                            <i className="fas fa-hammer"></i>
                        </div>
                    )}
                    <div className="crafting-header-title-text">
                        <h2 className="crafting-header-title">
                            {selectedRecipe ? selectedRecipe.name : (professionName ? `${professionName} Recipes` : 'Recipes')}
                        </h2>
                        {selectedRecipe?.requiredLevel !== undefined && (
                            <span className="crafting-header-subtitle">
                                {`Requires ${getSkillLevelName(selectedRecipe.requiredLevel)}`}
                            </span>
                        )}
                    </div>
                </div>
                {process.env.NODE_ENV !== 'production' && (
                <div className="crafting-header-title-right">
                    <button
                        className="crafting-icon-btn"
                        onClick={onLearnAllRecipes}
                        title="Learn all recipes (dev)"
                    >
                        <i className="fas fa-book-open"></i>
                    </button>
                    <button
                        className="crafting-icon-btn"
                        onClick={onAddTestMaterials}
                        title="Add test materials (dev)"
                    >
                        <i className="fas fa-flask"></i>
                    </button>
                </div>
                )}
            </div>

            {/* ── Tier 2: Active crafting progress (conditional) ── */}
            {currentCraftingItem && (
                <div className="crafting-header-progress-row">
                    <div className="crafting-progress-icon">
                        <img
                            src={getIconUrl(currentCraftingItem.recipe?.resultIcon || defaultIcon, 'items')}
                            alt=""
                            onError={(e) => { e.target.src = getIconUrl(defaultIcon, 'items'); }}
                        />
                    </div>
                    <div className="crafting-progress-info">
                        <div className="crafting-progress-top">
                            <span className="crafting-progress-name">
                                {currentCraftingItem.recipe?.name}
                            </span>
                            <span className="crafting-progress-pct">{Math.floor(progressValue)}%</span>
                        </div>
                        <div className="crafting-progress-track">
                            <div
                                className="crafting-progress-fill"
                                style={{
                                    width: `${progressValue}%`,
                                    background: `linear-gradient(90deg, ${accent}, ${accentNext})`
                                }}
                            />
                        </div>
                    </div>
                    <div className="crafting-progress-time">
                        <i className="fas fa-clock"></i>
                        <span>{timeRemaining}s</span>
                    </div>
                </div>
            )}

            {/* ── Tier 3: Queue (conditional) ── */}
            {queuedItems.length > 0 && (
                <div className="crafting-header-queue-row">
                    <span className="crafting-queue-label">
                        <i className="fas fa-list-ol"></i>
                        Queue ({queuedItems.length})
                    </span>
                    <div className="crafting-queue-icons">
                        {queuedItems.slice(0, 5).map((qItem, index) => (
                            <div
                                key={qItem.id || index}
                                className="queue-icon"
                                title={`${qItem.recipe.name} (position ${index + 1})`}
                            >
                                <img
                                    src={getIconUrl(qItem.recipe.resultIcon || defaultIcon, 'items')}
                                    alt=""
                                    onError={(e) => { e.target.src = getIconUrl(defaultIcon, 'items'); }}
                                />
                                <div className="queue-position">{index + 1}</div>
                            </div>
                        ))}
                        {queuedItems.length > 5 && (
                            <div className="queue-overflow" title={`${queuedItems.length - 5} more queued`}>
                                +{queuedItems.length - 5}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Tier 4: XP bar (always) ── */}
            <div className="crafting-header-xp-row">
                <div className="crafting-xp-track">
                    <div
                        className="crafting-xp-fill"
                        style={{
                            width: `${skillProgress}%`,
                            background: `linear-gradient(90deg, ${accent}, ${accentNext})`
                        }}
                    />
                    <div className="crafting-xp-text">
                        {professionLevel >= 9 ? (
                            <span className="skill-maxed">★ Master ★</span>
                        ) : (
                            <span>
                                <strong>{getSkillLevelName(professionLevel)}</strong>
                                <span className="crafting-xp-sep"> · </span>
                                <span>{professionExperience} / {experienceForNextLevel != null ? experienceForNextLevel : '?'} XP</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Local helper — no need to import SKILL_LEVELS for one lookup
function getSkillLevelName(level) {
    const names = ['Untrained', 'Novice', 'Apprentice', 'Journeyman', 'Expert', 'Adept', 'Master', 'Grandmaster', 'Legendary', 'Mythic'];
    return names[level] || 'Untrained';
}

export default CraftingStatusBar;
