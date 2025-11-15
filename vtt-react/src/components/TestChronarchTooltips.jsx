import React, { useState } from 'react';
import ClassResourceBar from './hud/ClassResourceBar';
import { getClassResourceConfig } from '../data/classResources';

const TestChronarchTooltips = () => {
    const chronarchConfig = getClassResourceConfig('Chronarch');
    const [localTimeShards, setLocalTimeShards] = useState(7);
    const [localTemporalStrain, setLocalTemporalStrain] = useState(6);

    const mockClassResource = {
        timeShards: { current: localTimeShards, max: 10 },
        temporalStrain: { current: localTemporalStrain, max: 10 },
    };

    return (
        <div style={{ padding: '20px', background: '#333', minHeight: '100vh', color: 'white' }}>
            <h1>Chronarch Tooltip Test</h1>
            <p>Hover over the resource bar below to see the Chronarch tooltips with improved contrast.</p>

            <div style={{ width: '300px', margin: '20px 0' }}>
                <ClassResourceBar
                    characterClass="Chronarch"
                    classResource={mockClassResource}
                    size="normal"
                    context="account" // Use 'account' context to ensure tooltips are rendered
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <label>
                    Time Shards:
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={localTimeShards}
                        onChange={(e) => setLocalTimeShards(parseInt(e.target.value))}
                        style={{ marginLeft: '10px', width: '150px' }}
                    />
                    {localTimeShards}
                </label>
            </div>
            <div style={{ marginTop: '10px' }}>
                <label>
                    Temporal Strain:
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={localTemporalStrain}
                        onChange={(e) => setLocalTemporalStrain(parseInt(e.target.value))}
                        style={{ marginLeft: '10px', width: '150px' }}
                    />
                    {localTemporalStrain}
                </label>
            </div>
        </div>
    );
};

const TestLichborneSpecializations = () => {
    const lichborneConfig = getClassResourceConfig('Lichborne');
    const [localPhylacteryHP, setLocalPhylacteryHP] = useState(35);

    const mockClassResource = {
        phylacteryHP: { current: localPhylacteryHP, max: 50 },
    };

    return (
        <div style={{ padding: '20px', background: '#333', minHeight: '100vh', color: 'white' }}>
            <h1>Lichborne Specialization Test</h1>
            <p>Test the moved specialization buttons in the menu-info section.</p>

            <div style={{ width: '300px', margin: '20px 0' }}>
                <ClassResourceBar
                    characterClass="Lichborne"
                    classResource={mockClassResource}
                    size="normal"
                    isGMMode={true}
                    onResourceClick={() => {}}
                    context="account" // Use 'account' context to ensure tooltips are rendered
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <label>
                    Phylactery HP:
                    <input
                        type="range"
                        min="0"
                        max="75"
                        value={localPhylacteryHP}
                        onChange={(e) => setLocalPhylacteryHP(parseInt(e.target.value))}
                        style={{ marginLeft: '10px', width: '150px' }}
                    />
                    {localPhylacteryHP}/75
                </label>
            </div>
        </div>
    );
};

export default TestChronarchTooltips;
export { TestLichborneSpecializations };
