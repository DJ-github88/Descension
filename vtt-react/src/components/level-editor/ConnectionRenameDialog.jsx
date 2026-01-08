import React, { useState, useEffect } from 'react';
import WowWindow from '../windows/WowWindow';

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
        <WowWindow
            title="Rename Connection"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 400, height: 200 }}
            defaultPosition={{ x: 400, y: 300 }}
            modal={true}
        >
            <div 
                style={{ padding: '20px' }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <label style={{ display: 'block', marginBottom: '10px' }}>
                    Connection Name:
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
                            padding: '8px',
                            marginTop: '5px',
                            fontSize: '14px'
                        }}
                        autoFocus
                    />
                </label>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button 
                        className="wow-button" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
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
                    >
                        Save
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default ConnectionRenameDialog;

