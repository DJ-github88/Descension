// Utility functions for the task-based skills progression system

import { SKILL_RANKS } from '../constants/taskBasedSkillDefinitions';
import { SKILL_TASKS } from '../constants/skillTaskDefinitions';

/**
 * Calculate the current skill rank based on completed tasks
 * @param {string} skillId - The skill identifier
 * @param {Object} completedTasks - Object containing completed tasks by skill
 * @returns {number} Current skill rank (0-6)
 */
export function calculateCurrentSkillRank(skillId, completedTasks) {
    const completed = completedTasks[skillId] || [];
    const allTasks = SKILL_TASKS[skillId] || [];
    
    if (allTasks.length === 0) return 0;
    
    let currentRank = 0;
    
    // Check each rank from 1 to 6
    for (let rank = 1; rank <= 6; rank++) {
        const rankTasks = allTasks.filter(task => task.rank === rank);
        if (rankTasks.length === 0) continue;
        
        const completedAtRank = rankTasks.filter(task => completed.includes(task.id)).length;
        const requiredTasks = Math.ceil(rankTasks.length * 0.67); // Need 2/3 completion
        
        if (completedAtRank >= requiredTasks) {
            currentRank = rank;
        } else {
            break; // Can't advance further
        }
    }
    
    return currentRank;
}

/**
 * Calculate progress towards the next rank
 * @param {string} skillId - The skill identifier
 * @param {Object} completedTasks - Object containing completed tasks by skill
 * @returns {Object} Progress information
 */
export function calculateRankProgress(skillId, completedTasks) {
    const currentRank = calculateCurrentSkillRank(skillId, completedTasks);
    const nextRank = currentRank + 1;
    
    if (nextRank > 6) {
        return {
            currentRank,
            nextRank: null,
            progress: 100,
            completed: 0,
            required: 0,
            isMaxRank: true
        };
    }
    
    const allTasks = SKILL_TASKS[skillId] || [];
    const nextRankTasks = allTasks.filter(task => task.rank === nextRank);
    const completed = completedTasks[skillId] || [];
    
    if (nextRankTasks.length === 0) {
        return {
            currentRank,
            nextRank,
            progress: 0,
            completed: 0,
            required: 0,
            isMaxRank: false
        };
    }
    
    const completedNextRankTasks = nextRankTasks.filter(task => 
        completed.includes(task.id)
    ).length;
    
    const requiredTasks = Math.ceil(nextRankTasks.length * 0.67);
    const progress = Math.min(100, (completedNextRankTasks / requiredTasks) * 100);
    
    return {
        currentRank,
        nextRank,
        progress,
        completed: completedNextRankTasks,
        required: requiredTasks,
        isMaxRank: false
    };
}

/**
 * Get all available tasks for a skill up to a certain rank
 * @param {string} skillId - The skill identifier
 * @param {number} maxRank - Maximum rank to include tasks for
 * @returns {Array} Array of task objects
 */
export function getAvailableTasksUpToRank(skillId, maxRank) {
    const allTasks = SKILL_TASKS[skillId] || [];
    return allTasks.filter(task => task.rank <= maxRank);
}

/**
 * Get tasks for a specific rank
 * @param {string} skillId - The skill identifier
 * @param {number} rank - The specific rank
 * @returns {Array} Array of task objects for the rank
 */
export function getTasksForRank(skillId, rank) {
    const allTasks = SKILL_TASKS[skillId] || [];
    return allTasks.filter(task => task.rank === rank);
}

/**
 * Check if a skill rank is unlocked (accessible)
 * @param {number} targetRank - The rank to check
 * @param {number} currentRank - The current skill rank
 * @returns {boolean} True if the rank is accessible
 */
export function isRankUnlocked(targetRank, currentRank) {
    // Can access current rank and next rank
    return targetRank <= currentRank + 1;
}

/**
 * Get completion statistics for a specific rank
 * @param {string} skillId - The skill identifier
 * @param {number} rank - The rank to analyze
 * @param {Object} completedTasks - Object containing completed tasks by skill
 * @returns {Object} Completion statistics
 */
export function getRankCompletionStats(skillId, rank, completedTasks) {
    const rankTasks = getTasksForRank(skillId, rank);
    const completed = completedTasks[skillId] || [];
    const completedCount = rankTasks.filter(task => completed.includes(task.id)).length;
    const requiredCount = Math.ceil(rankTasks.length * 0.67);
    
    return {
        total: rankTasks.length,
        completed: completedCount,
        required: requiredCount,
        percentage: rankTasks.length > 0 ? (completedCount / requiredCount) * 100 : 0,
        isCompleted: completedCount >= requiredCount,
        isUnlocked: isRankUnlocked(rank, calculateCurrentSkillRank(skillId, completedTasks))
    };
}

/**
 * Get the rank information object
 * @param {number} rank - The rank number
 * @returns {Object} Rank information from SKILL_RANKS
 */
export function getRankInfo(rank) {
    return SKILL_RANKS[rank] || SKILL_RANKS[0];
}

/**
 * Calculate total completed tasks across all ranks for a skill
 * @param {string} skillId - The skill identifier
 * @param {Object} completedTasks - Object containing completed tasks by skill
 * @returns {number} Total number of completed tasks
 */
export function getTotalCompletedTasks(skillId, completedTasks) {
    const completed = completedTasks[skillId] || [];
    return completed.length;
}

/**
 * Calculate total available tasks for a skill
 * @param {string} skillId - The skill identifier
 * @returns {number} Total number of available tasks
 */
export function getTotalAvailableTasks(skillId) {
    const allTasks = SKILL_TASKS[skillId] || [];
    return allTasks.length;
}

/**
 * Group tasks by category for a specific rank
 * @param {string} skillId - The skill identifier
 * @param {number} rank - The rank to get tasks for
 * @returns {Object} Tasks grouped by category
 */
export function groupTasksByCategory(skillId, rank) {
    const rankTasks = getTasksForRank(skillId, rank);
    
    return rankTasks.reduce((acc, task) => {
        const category = task.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(task);
        return acc;
    }, {});
}

/**
 * Check if a task is completed
 * @param {string} skillId - The skill identifier
 * @param {string} taskId - The task identifier
 * @param {Object} completedTasks - Object containing completed tasks by skill
 * @returns {boolean} True if the task is completed
 */
export function isTaskCompleted(skillId, taskId, completedTasks) {
    const completed = completedTasks[skillId] || [];
    return completed.includes(taskId);
}

/**
 * Get skill progression summary for display
 * @param {string} skillId - The skill identifier
 * @param {Object} completedTasks - Object containing completed tasks by skill
 * @returns {Object} Comprehensive skill progression summary
 */
export function getSkillProgressionSummary(skillId, completedTasks) {
    const currentRank = calculateCurrentSkillRank(skillId, completedTasks);
    const rankProgress = calculateRankProgress(skillId, completedTasks);
    const totalCompleted = getTotalCompletedTasks(skillId, completedTasks);
    const totalAvailable = getTotalAvailableTasks(skillId);
    const currentRankInfo = getRankInfo(currentRank);
    const nextRankInfo = rankProgress.nextRank ? getRankInfo(rankProgress.nextRank) : null;
    
    return {
        skillId,
        currentRank,
        currentRankInfo,
        nextRank: rankProgress.nextRank,
        nextRankInfo,
        progress: rankProgress.progress,
        progressCompleted: rankProgress.completed,
        progressRequired: rankProgress.required,
        totalCompleted,
        totalAvailable,
        isMaxRank: rankProgress.isMaxRank,
        completionPercentage: totalAvailable > 0 ? (totalCompleted / totalAvailable) * 100 : 0
    };
}

/**
 * Validate task completion data
 * @param {Object} completedTasks - Object containing completed tasks by skill
 * @returns {Object} Validation results
 */
export function validateTaskCompletionData(completedTasks) {
    const issues = [];
    const validatedData = {};
    
    Object.entries(completedTasks).forEach(([skillId, tasks]) => {
        if (!Array.isArray(tasks)) {
            issues.push(`Invalid task data for skill ${skillId}: expected array`);
            validatedData[skillId] = [];
            return;
        }
        
        const allTasks = SKILL_TASKS[skillId] || [];
        const validTaskIds = allTasks.map(task => task.id);
        const validTasks = tasks.filter(taskId => validTaskIds.includes(taskId));
        const invalidTasks = tasks.filter(taskId => !validTaskIds.includes(taskId));
        
        if (invalidTasks.length > 0) {
            issues.push(`Invalid task IDs for skill ${skillId}: ${invalidTasks.join(', ')}`);
        }
        
        validatedData[skillId] = validTasks;
    });
    
    return {
        isValid: issues.length === 0,
        issues,
        validatedData
    };
}
