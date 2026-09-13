import React, { useMemo } from 'react';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import useItemStore from '../../store/itemStore';
import { getIconUrl } from '../../utils/assetManager';

const RECIPE_PREVIEW_COUNT = 2;

function ProfessionSelection({ onProfessionSelect, selectedProfession }) {
    const {
        professionLevels,
        professionExperience,
        knownRecipes,
        getProfessionLevel,
        getRecipesForProfession
    } = useCraftingStore();
    const { items: itemLibrary } = useItemStore();

    const iconById = useMemo(
        () => new Map((itemLibrary || []).map(item => [item.id, item.iconId])),
        [itemLibrary]
    );

    const getSkillLevelName = (level) => {
        const skillLevel = Object.values(SKILL_LEVELS).find(skill => skill.level === level);
        return skillLevel ? skillLevel.name : 'Unknown';
    };

    const getSkillLevelColor = (level) => {
        if (level === 0) return '#9d9d9d'; // Gray for untrained
        if (level <= 2) return '#ffffff'; // White for novice/apprentice
        if (level <= 4) return '#1eff00'; // Green for journeyman/expert
        if (level <= 6) return '#0070dd'; // Blue for adept/master
        if (level <= 8) return '#a335ee'; // Purple for grandmaster/legendary
        return '#ff8000'; // Orange for mythic
    };

    const getProfessionProgress = (professionId) => {
        const level = (typeof getProfessionLevel === 'function')
            ? getProfessionLevel(professionId)
            : (professionLevels?.[professionId] ?? SKILL_LEVELS.UNTRAINED.level);
        const experience = professionExperience?.[professionId] ?? 0;
        const tier = Object.values(SKILL_LEVELS).find(skill => skill.level === level) || SKILL_LEVELS.UNTRAINED;
        const nextTier = Object.values(SKILL_LEVELS).find(skill => skill.level === level + 1) || null;

        if (!nextTier) {
            return { level, tier, percent: 100, text: 'MAX' };
        }

        const start = tier.experienceRequired;
        const target = nextTier.experienceRequired;
        const span = Math.max(1, target - start);
        const percent = Math.max(0, Math.min(100, ((experience - start) / span) * 100));

        return {
            level,
            tier,
            percent,
            text: `${Math.min(experience, target)} / ${target}`
        };
    };

    const getRecipePreview = (professionId) => {
        const recipes = (typeof getRecipesForProfession === 'function')
            ? (getRecipesForProfession(professionId) || [])
            : [];
        const sorted = [...recipes].sort((a, b) =>
            (a.requiredLevel ?? 0) - (b.requiredLevel ?? 0) || (a.name || '').localeCompare(b.name || '')
        );
        return {
            preview: sorted.slice(0, RECIPE_PREVIEW_COUNT),
            remaining: Math.max(0, sorted.length - RECIPE_PREVIEW_COUNT)
        };
    };

    const getRecipeIcon = (recipe, profession) => {
        const iconId = iconById.get(recipe.resultItemId) || recipe.resultIcon || profession.icon;
        return getIconUrl(iconId, 'items');
    };

    return (
        <div className="profession-selection">
            <div className="profession-selection-header">
                <h2>Choose Your Craft</h2>
                <p>Select a profession to begin crafting. Each profession offers unique recipes and rewards.</p>
            </div>

            <div className="profession-list">
                {Object.values(PROFESSIONS).map(profession => {
                    const progress = getProfessionProgress(profession.id);
                    const skillLevelName = getSkillLevelName(progress.level);
                    const skillColor = getSkillLevelColor(progress.level);
                    const isImplemented = profession.implemented;
                    const { preview, remaining } = getRecipePreview(profession.id);
                    const knownCount = (knownRecipes?.[profession.id] || []).length;

                    return (
                        <div
                            key={profession.id}
                            className={`profession-row ${!isImplemented ? 'not-implemented' : ''} ${selectedProfession === profession.id ? 'selected' : ''}`}
                            data-profession={profession.id}
                            role="button"
                            tabIndex={isImplemented ? 0 : -1}
                            onClick={() => isImplemented && onProfessionSelect(profession.id)}
                            onKeyDown={(e) => {
                                if (isImplemented && (e.key === 'Enter' || e.key === ' ')) {
                                    e.preventDefault();
                                    onProfessionSelect(profession.id);
                                }
                            }}
                        >
                            <div className="profession-medallion">
                                <div className="profession-medallion-inner">
                                    <img
                                        src={getIconUrl(profession.icon, 'items')}
                                        alt={profession.name}
                                        onError={(e) => {
                                            e.target.src = getIconUrl('inv_misc_questionmark', 'items');
                                        }}
                                    />
                                </div>
                                <span className="profession-medallion-level" title={`Skill level ${progress.level}`}>
                                    {progress.level}
                                </span>
                                {!isImplemented && (
                                    <div className="coming-soon-overlay">
                                        <span>Coming Soon</span>
                                    </div>
                                )}
                            </div>

                            <div className="profession-row-info">
                                <div className="profession-row-heading">
                                    <h3 className="profession-name">{profession.name}</h3>
                                    <span
                                        className="profession-tier"
                                        style={{ color: skillColor }}
                                    >
                                        {skillLevelName}
                                    </span>
                                </div>
                                <p className="profession-description">{profession.description}</p>

                                <div className="profession-skill">
                                    <div className="profession-skill-track">
                                        <div
                                            className="profession-skill-fill"
                                            style={{
                                                width: `${progress.percent}%`,
                                                background: `linear-gradient(180deg, ${skillColor}, ${skillColor})`
                                            }}
                                        />
                                        <span className="profession-skill-text">{progress.text}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profession-row-recipes">
                                <div className="profession-recipes-label">
                                    <i className="fas fa-scroll"></i>
                                    <span>Recipes</span>
                                </div>
                                <div className="profession-recipes-list">
                                    {preview.map(recipe => (
                                        <div className="profession-recipe-chip" key={recipe.id}>
                                            <img src={getRecipeIcon(recipe, profession)} alt={recipe.name} />
                                            <span className="profession-recipe-name">{recipe.name}</span>
                                        </div>
                                    ))}
                                    {remaining > 0 && (
                                        <span className="profession-recipes-more">+{remaining} more</span>
                                    )}
                                </div>
                            </div>

                            <div className="profession-row-action">
                                {isImplemented ? (
                                    <>
                                        <button
                                            className="wow-button profession-select-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onProfessionSelect(profession.id);
                                            }}
                                        >
                                            {progress.level > 0 ? 'Continue Crafting' : 'Start Learning'}
                                        </button>
                                        <span className="profession-known-count">
                                            {knownCount} recipe{knownCount !== 1 ? 's' : ''} known
                                        </span>
                                    </>
                                ) : (
                                    <span className="profession-coming-soon-label">Coming Soon</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="profession-selection-footer">
                <div className="skill-level-legend">
                    <h4>Skill Levels</h4>
                    <div className="legend-items">
                        {Object.values(SKILL_LEVELS).map(skill => (
                            <div key={skill.level} className="legend-item">
                                <span
                                    className="legend-color"
                                    style={{ backgroundColor: getSkillLevelColor(skill.level) }}
                                ></span>
                                <span className="legend-name">{skill.name}</span>
                                <span className="legend-bonus">+{skill.bonus}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfessionSelection;
