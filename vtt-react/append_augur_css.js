const fs = require('fs');
let content = fs.readFileSync('d:/VTT/vtt-react/src/data/classes/augur/styles/AugurResourceBar.css', 'utf8');
content += `

/* Augur Context Menu */
.augur-menu-container {
    background: linear-gradient(145deg, rgba(30, 20, 30, 0.98), rgba(20, 25, 30, 0.98));
    border: 2px solid rgba(139, 90, 139, 0.6);
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1);
    min-width: 220px;
    pointer-events: auto;
}

.augur-menu-title {
    font-size: 11px;
    font-weight: bold;
    color: #C8A2C8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(139, 90, 139, 0.4);
    padding-bottom: 4px;
    text-align: center;
}

.augur-controls-row {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
}

.augur-action-btn {
    flex: 1;
    background: linear-gradient(180deg, rgba(60, 50, 60, 0.8) 0%, rgba(40, 30, 40, 0.9) 100%);
    border: 1px solid rgba(139, 90, 139, 0.5);
    border-radius: 3px;
    color: #E8DCC8;
    padding: 4px 8px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-family: 'Cinzel', serif;
}

.augur-action-btn:hover {
    background: linear-gradient(180deg, rgba(80, 70, 80, 0.9) 0%, rgba(60, 50, 60, 1) 100%);
    border-color: #B07AB0;
    box-shadow: 0 0 8px rgba(139, 90, 139, 0.4);
}

.augur-action-btn:active {
    transform: translateY(1px);
}

.augur-action-btn.ben {
    border-color: rgba(184, 134, 11, 0.5);
}

.augur-action-btn.ben:hover {
    border-color: #DAA520;
    box-shadow: 0 0 8px rgba(184, 134, 11, 0.4);
}

.augur-quick-btn {
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    color: #aaa;
    padding: 4px;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
}

.augur-quick-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
}

.augur-quick-btn.danger:hover {
    background: rgba(220, 53, 69, 0.2);
    color: #ff6b6b;
    border-color: rgba(220, 53, 69, 0.5);
}
`;
fs.writeFileSync('d:/VTT/vtt-react/src/data/classes/augur/styles/AugurResourceBar.css', content);
