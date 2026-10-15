import React, { useState, useEffect } from 'react';
import MythrillWindow from '../windows/MythrillWindow';

const ConnectionRenameDialog = ({ isOpen, onClose, connection, onSave }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (connection) {
            setName(connection.properties?.portalName || '');
        }
    }, [connection]);

    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
        }
    };

    if (!isOpen) return null;

    return (
        <MythrillWindow
            title="Rename Connection"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 400, height: 200 }}
            defaultPosition={{ x: 400, y: 300 }}
            modal={true}
        >
            <div 
                className="connection-rename-dialog"
                style={{ 
                    padding: '20px',
                    fontFamily: "'Cinzel', Georgia, serif",
                    color: '#34251a',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxSizing: 'border-box'
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <label style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: '#7a6244'
                }}>
                    Connection Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                onClose();
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: '#fbf7ee',
                            border: '1px solid #c4baa6',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontFamily: 'Georgia, serif',
                            color: '#34251a',
                            boxSizing: 'border-box',
                            outline: 'none'
                        }}
                        autoFocus
                    />
                </label>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '10px', 
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid #c4baa6' 
                }}>
                    <button 
                        className="wow-button" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        style={{
                            padding: '8px 18px',
                            background: '#e8e2d4',
                            border: '1px solid #9c8970',
                            borderRadius: '6px',
                            color: '#34251a',
                            fontFamily: "'Cinzel', Georgia, serif",
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(40, 30, 20, 0.1)'
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        className="wow-button primary" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSave();
                        }} 
                        disabled={!name.trim()}
                        style={{
                            padding: '8px 22px',
                            background: name.trim() ? 'linear-gradient(180deg, #663c32 0%, #522d25 100%)' : '#b5aba0',
                            border: name.trim() ? '1px solid #421e17' : '1px solid #9c9186',
                            borderRadius: '6px',
                            color: name.trim() ? '#fdf8ee' : '#6e6459',
                            fontFamily: "'Cinzel', Georgia, serif",
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                            cursor: name.trim() ? 'pointer' : 'not-allowed',
                            boxShadow: name.trim() ? '0 2px 5px rgba(60, 20, 15, 0.25)' : 'none',
                            textShadow: name.trim() ? '0 1px 2px rgba(0, 0, 0, 0.4)' : 'none',
                            opacity: name.trim() ? 1 : 0.65
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </MythrillWindow>
    );
};

export default ConnectionRenameDialog;

