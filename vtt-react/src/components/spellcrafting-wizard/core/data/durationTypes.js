
const DURATION_TYPES = [
    {
      id: 'instant',
      name: 'Instant',
      description: 'Effect occurs once and immediately',
      icon: 'spell_nature_timestop',
      actionPointModifier: 0
    },
    {
      id: 'rounds',
      name: 'Rounds',
      description: 'Effect lasts for a specific number of combat rounds',
      icon: 'spell_holy_borrowedtime',
      actionPointModifier: 1
    },
    { id: 'turns', 
      name: 'Turns', 
      description: 'Effect lasts for a specific number of turns', 
      icon: 'spell_nature_timestop', 
      actionPointModifier: 1 },
    {
      id: 'minutes',
      name: 'Minutes',
      description: 'Effect lasts for a specific number of minutes',
      icon: 'spell_holy_innerfire',
      actionPointModifier: 2
    },
    {
      id: 'hours',
      name: 'Hours',
      description: 'Effect lasts for a specific number of hours',
      icon: 'spell_holy_guardianspirit',
      actionPointModifier: 3
    },
    {
      id: 'concentration',
      name: 'Concentration',
      description: 'Effect lasts as long as caster maintains concentration',
      icon: 'spell_arcane_mindmastery',
      actionPointModifier: 1,
      requiresConcentration: true
    },
    {
      id: 'permanent',
      name: 'Permanent',
      description: 'Effect lasts until dispelled or ended by specific condition',
      icon: 'spell_holy_divineillumination',
      actionPointModifier: 4,
      requiresRitualCasting: true
    }
];


const getDurationTypeById = (id) => {
    return DURATION_TYPES.find(durationType => durationType.id === id) || null;
};


const getConcentrationDurationTypes = () => {
    return DURATION_TYPES.filter(durationType => durationType.requiresConcentration);
};


const getDurationActionPointModifier = (id) => {
    const durationType = getDurationTypeById(id);
    return durationType ? durationType.actionPointModifier : 0;
};


const calculateDurationTime = (durationType, amount, gameTimeConfig = {}) => {
    // Default time conversions
    const config = {
        roundSeconds: 6, // 1 round = 6 seconds
        gameMinuteRatio: 1, // 1:1 ratio for minutes
        gameHourRatio: 1, // 1:1 ratio for hours
        ...gameTimeConfig
    };
    
    let gameSeconds = 0;
    
    switch (durationType) {
        case 'rounds':
            gameSeconds = amount * config.roundSeconds;
            break;
        case 'minutes':
            gameSeconds = amount * 60 * config.gameMinuteRatio;
            break;
        case 'hours':
            gameSeconds = amount * 3600 * config.gameHourRatio;
            break;
        case 'instant':
            gameSeconds = 0;
            break;
        case 'permanent':
        case 'concentration':
            gameSeconds = -1; // Special value for indefinite durations
            break;
        default:
            gameSeconds = 0;
    }
    
    // Calculate display format for game time
    let displayTime = 'instant';
    
    if (gameSeconds > 0) {
        if (gameSeconds < 60) {
            displayTime = `${gameSeconds} seconds`;
        } else if (gameSeconds < 3600) {
            displayTime = `${Math.floor(gameSeconds / 60)} minutes`;
        } else {
            displayTime = `${Math.floor(gameSeconds / 3600)} hours`;
        }
    } else if (gameSeconds === -1) {
        displayTime = durationType === 'concentration' ? 'until concentration breaks' : 'permanent';
    }
    
    return {
        gameSeconds,
        displayTime,
        durationType,
        amount
    };
};

const formatDuration = (durationType, amount) => {
    if (durationType === 'instant') return 'Instant';
    if (durationType === 'permanent') return 'Permanent';
    if (durationType === 'concentration') return 'Concentration (up to ' + amount + ' ' + (amount === 1 ? 'hour' : 'hours') + ')';
    
    const type = getDurationTypeById(durationType);
    if (!type) return 'Unknown duration';
    
    return `${amount} ${amount === 1 ? durationType.slice(0, -1) : durationType}`;
};

export {
    DURATION_TYPES,
    getDurationTypeById,
    getConcentrationDurationTypes,
    getDurationActionPointModifier,
    calculateDurationTime,
    formatDuration
};