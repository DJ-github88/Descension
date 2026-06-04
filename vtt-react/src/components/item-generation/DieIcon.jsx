import React from 'react';

const getDiceValue = (die) => {
    if (!die) return 0;
    if (typeof die === 'number') return die;
    const dieLower = String(die).toLowerCase();
    if (dieLower === 'broken' || dieLower === '0') return 0;
    const match = dieLower.match(/^d(\d+)$/);
    if (match) return parseInt(match[1], 10);
    return parseInt(dieLower, 10) || 0;
};

const DieIcon = ({ die, size = '1em', style = {} }) => {
    const val = getDiceValue(die);

    if (val === 0) return <i className="fas fa-heart-broken" style={{ fontSize: size, ...style }}></i>;
    if (val === 6) return <i className="fas fa-dice-d6" style={{ fontSize: size, ...style }}></i>;
    if (val === 20) return <i className="fas fa-dice-d20" style={{ fontSize: size, ...style }}></i>;

    const svgStyle = { width: size, height: size, display: 'inline-block', verticalAlign: 'middle', ...style };
    const commonProps = { viewBox: '0 0 24 24', fill: 'currentColor', style: svgStyle };

    switch (val) {
        case 4:
            return <svg {...commonProps}><path d="M21.92 21H2.08c-.84 0-1.36-.92-.92-1.64l8.08-16.23c.42-.69 1.42-.69 1.84 0l8.08 16.23c.44.72-.08 1.64-.92 1.64zm-7.63-5.85h-.86v-4.73h-1.52l-3.16 4.99.07.95h3.1V18h1.51v-1.15h.86v-1.2z"/></svg>;
        case 8:
            return <svg {...commonProps}><path d="M12 2c-.5 0-1 .19-1.41.59l-8 8c-.79.78-.79 2.04 0 2.82l8 8c.78.79 2.04.79 2.82 0l8-8c.79-.78.79-2.04 0-2.82l-8-8c-.41-.4-.91-.59-1.41-.59m0 6.25c1.31 0 2.38.95 2.38 2.13 0 .69-.38 1.3-.94 1.69.7.39 1.16 1.06 1.16 1.83 0 1.22-1.16 2.2-2.6 2.2s-2.6-.98-2.6-2.2c0-.77.46-1.44 1.16-1.83-.56-.39-.94-1-.94-1.69 0-1.18 1.06-2.13 2.38-2.13m0 1.25c-.5 0-.9.45-.9 1s.4 1 .9 1 .9-.45.9-1-.4-1-.9-1m0 3.15c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1 1.1-.49 1.1-1.1-.49-1.1-1.1-1.1z"/></svg>;
        case 10:
            return <svg {...commonProps}><path d="M12 2c-.5 0-1 .19-1.41.59l-8 8c-.79.78-.79 2.04 0 2.82l8 8c.78.79 2.04.79 2.82 0l8-8c.79-.78.79-2.04 0-2.82l-8-8c-.41-.4-.91-.59-1.41-.59m2.07 6.21c1.43 0 2.57 1.15 2.57 2.57v2.64c0 1.42-1.14 2.57-2.57 2.57-1.43 0-2.57-1.15-2.57-2.57V10.78c0-1.42 1.15-2.57 2.57-2.57m-3.71.2h.14V16H9v-5.79l-1.78.55v-1.23l3.14-1.12m3.7 1.24c-.59 0-1.06.48-1.06 1.06v2.79c0 .57.5 1.04 1.08 1.04.58 0 1.08-.47 1.08-1.04v-2.73c0-.59-.5-1.06-1.08-1.06z"/></svg>;
        case 12:
            return <svg {...commonProps}><path d="M12 3L1.5 9.64 5.5 22h13l4-12.36L12 3m-1.5 14h-1.61v-6.11l-1.89.58V9.53l3.31-1.19h.19V17m6.5 0h-5.34v-1.09s3.57-3.46 3.57-4.51c0-1.28-1.05-1.15-1.05-1.15-.68.05-1.18.62-1.18 1.3h-1.56c.06-1.46 1.28-2.61 2.83-2.55 2.47.06 2.5 1.85 2.5 2.3 0 1.77-3.19 4.47-3.19 4.47L17 15.75V17z"/></svg>;
        default:
            return <i className="fas fa-dice" style={{ fontSize: size, ...style }}></i>;
    }
};

export default DieIcon;
