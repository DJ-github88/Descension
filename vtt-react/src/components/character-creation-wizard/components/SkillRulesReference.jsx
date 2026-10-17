/**
 * P11 — the creation step's Standard/Advanced skill rules reference.
 * Replaces two duplicated inline copies whose text contradicted the P10 Laws
 * ("awarded by the GM", flat rank bonuses and quest unlocks presented as rules).
 */
import React from 'react';
import { SKILL_RANKS } from '../../../constants/skillDefinitions';
import {
    ADVANCED_ADVANCEMENT_TEXT,
    PROFICIENCY_DIE_BY_RANK,
    SKILL_OPEN_RULES,
    SKILL_VTT_SCOPE,
    STANDARD_ADVANCEMENT_TEXT,
    WEAPON_PROFICIENCY_TEXT,
    pointBuyText
} from '../../../constants/skillProgressionCopy';

const DC_ROWS = [
    ['DC 2', 'Trivial', 'Climbing a ladder, lighting campfire'],
    ['DC 4', 'Easy', 'Picking a rusty lock, tracking in mud'],
    ['DC 6', 'Moderate', 'Climbing a knotted rope, deceiving guards'],
    ['DC 8', 'Challenging', 'Scaling wall handholds, disarming traps'],
    ['DC 10', 'Hard', 'Climbing steep mountains, field surgery'],
    ['DC 12+', 'Legendary', 'Tasks bordering on the impossible']
];

export default function SkillRulesReference({ skillFilter, setSkillFilter }) {
    const isStandard = skillFilter === 'standard';
    return (
        <div className="grimoire-rules-section" data-testid="skill-rules-reference">
            <div className="grimoire-rules-toggle">
                <button
                    type="button"
                    className={`rules-toggle-btn ${isStandard ? 'active' : ''}`}
                    onClick={() => setSkillFilter('standard')}
                >
                    <i className="fas fa-scroll"></i> Standard Rules
                </button>
                <button
                    type="button"
                    className={`rules-toggle-btn ${!isStandard ? 'active' : ''}`}
                    onClick={() => setSkillFilter('advanced')}
                >
                    <i className="fas fa-wand-magic-sparkles"></i> Advanced Rules
                </button>
            </div>

            {isStandard ? (
                <div className="rules-content-block">
                    <div className="rules-subsection">
                        <h5><i className="fas fa-magic"></i> The Core Idea</h5>
                        <p>Every skill is represented by a single die size, written directly on your character sheet: <strong>4</strong> for a d4, <strong>6</strong> for a d6, <strong>8</strong> for a d8, and so on.</p>
                        <ul>
                            <li><strong>d4 Baseline</strong>: Every skill starts at a d4 before you spend creation points. A baseline attempt is always possible.</li>
                            <li><strong>Grow Through Training and Story</strong>: {STANDARD_ADVANCEMENT_TEXT}</li>
                            <li><strong>On Your Sheet</strong>: Set the new die with the rank selector on your character sheet.</li>
                        </ul>
                    </div>
                    <div className="rules-subsection">
                        <h5><i className="fas fa-coins"></i> Starting Skills (Point-Buy)</h5>
                        <p>{pointBuyText()}</p>
                    </div>
                    <div className="rules-subsection">
                        <h5><i className="fas fa-crosshairs"></i> Difficulty Classes (DCs)</h5>
                        <p>The current Standard rules roll against fixed target numbers:</p>
                        <div className="dc-ref-grid">
                            {DC_ROWS.map(([dc, label, example]) => (
                                <div className="dc-ref-row" key={dc}><span>{dc}</span><strong>{label}</strong><span>{example}</span></div>
                            ))}
                        </div>
                        <p><em>{SKILL_OPEN_RULES.checkResolution}</em></p>
                    </div>
                    <div className="rules-subsection">
                        <h5><i className="fas fa-bolt"></i> Rolling the Maximum</h5>
                        <p>In the current Standard rules the die explodes: roll it again and add the results. <em>{SKILL_OPEN_RULES.explosion}</em></p>
                    </div>
                    <div className="rules-subsection">
                        <h5><i className="fas fa-shield-halved"></i> Weapons</h5>
                        <p>{WEAPON_PROFICIENCY_TEXT}</p>
                        <p><em>{SKILL_OPEN_RULES.weaponFaces}</em></p>
                    </div>
                </div>
            ) : (
                <div className="rules-content-block">
                    <div className="rules-subsection">
                        <p><em>Advanced Skills are not part of the first-table rules.</em> {ADVANCED_ADVANCEMENT_TEXT}</p>
                        <h5><i className="fas fa-cogs"></i> How Skills Work</h5>
                        <ul>
                            <li>Each skill is tied to a <strong>primary and secondary attribute</strong>.</li>
                            <li>The Advanced panel resolves checks with a GM <strong>Difficulty Die</strong>, from a d4 for trivial tasks to a d20 for near-impossible ones, stepped down one size when your primary or secondary attribute modifier is <strong>+5 or higher</strong>.</li>
                        </ul>
                        <p><em>{SKILL_OPEN_RULES.checkResolution}</em></p>
                    </div>
                    <div className="rules-subsection">
                        <h5><i className="fas fa-layer-group"></i> Skill Ranks &amp; Authored Tasks</h5>
                        <div className="dc-ref-grid">
                            {Object.entries(SKILL_RANKS).map(([rankKey, rank]) => (
                                <div className="dc-ref-row" key={rankKey}>
                                    <span style={{ color: rank.color }}>{rank.name}</span>
                                    <span>d{PROFICIENCY_DIE_BY_RANK[rankKey]}</span>
                                    <span>{rank.questsRequired ? `${rank.questsRequired} task${rank.questsRequired === 1 ? '' : 's'} completed` : 'Baseline'}</span>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: '8px', fontSize: '0.85rem' }}><em>{SKILL_OPEN_RULES.rankBonus}</em></p>
                    </div>
                    <div className="rules-subsection">
                        <h5><i className="fas fa-dice-d20"></i> Critical Success &amp; Failure</h5>
                        <p>On the Advanced panel, the <strong>maximum value</strong> on the difficulty die is a <strong>Critical Success</strong> and a <strong>1</strong> is a <strong>Critical Failure</strong>; the GM decides what that means in the story.</p>
                    </div>
                    <div className="rules-subsection">
                        <h5><i className="fas fa-sync-alt"></i> Standard or Advanced</h5>
                        <p>The table's Standard/Advanced setting changes how ranks advance, not the ranks you hold. {SKILL_VTT_SCOPE}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
