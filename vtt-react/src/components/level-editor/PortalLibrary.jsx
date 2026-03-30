import React, { useState } from 'react';
import useMapStore from '../../store/mapStore';
import PortalConfigDialog from './PortalConfigDialog';
import './styles/PortalLibrary.css';

const PortalLibrary = () => {
    const {
        portalTemplates,
        addPortalTemplate,
        updatePortalTemplate,
        removePortalTemplate,
        maps,
        getCurrentMapId
    } = useMapStore();

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [draggedTemplate, setDraggedTemplate] = useState(null);

    const handleCreateTemplate = () => {
        setEditingTemplate(null);
        setShowCreateDialog(true);
    };

    const handleEditTemplate = (template) => {
        setEditingTemplate(template);
        setShowCreateDialog(true);
    };

    const handleSaveTemplate = (templateData) => {
        if (editingTemplate) {
            updatePortalTemplate(editingTemplate.id, templateData);
        } else {
            addPortalTemplate(templateData);
        }
        setShowCreateDialog(false);
        setEditingTemplate(null);
    };

    const handleDeleteTemplate = (templateId) => {
        if (confirm('Are you sure you want to delete this connection template?')) {
            removePortalTemplate(templateId);
        }
    };

    const handleDragStart = (e, template) => {
        setDraggedTemplate(template);
        e.dataTransfer.setData('portal/template', JSON.stringify(template));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragEnd = () => {
        setDraggedTemplate(null);
    };

    const getDestinationMapName = (mapId) => {
        if (!mapId) return 'No destination';
        const map = maps.find(m => m.id === mapId);
        return map ? map.name : 'Unknown Map';
    };

    return (
        <div className="portal-library">
            <div className="library-header">
                <h4 className="library-title">Connection Library</h4>
                <button
                    className="create-template-button"
                    onClick={handleCreateTemplate}
                    title="Create new connection template"
                >
                    + New Template
                </button>
            </div>

            <div className="library-content">
                {portalTemplates.length === 0 ? (
                    <div className="empty-library">
                        <div className="empty-icon">🌀</div>
                        <p>No connection templates yet</p>
                        <p className="empty-hint">Create templates to reuse connection configurations</p>
                    </div>
                ) : (
                    <div className="template-grid">
                        {portalTemplates.map(template => (
                            <div
                                key={template.id}
                                className={`portal-template-card ${draggedTemplate?.id === template.id ? 'dragging' : ''}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, template)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="template-header">
                                    <div
                                        className="template-icon"
                                        style={{ color: template.color }}
                                    >
                                        🌀
                                    </div>
                                    <div className="template-actions">
                                        <button
                                            className="template-action-button edit"
                                            onClick={() => handleEditTemplate(template)}
                                            title="Edit template"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="template-action-button delete"
                                            onClick={() => handleDeleteTemplate(template.id)}
                                            title="Delete template"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className="template-info">
                                    <div className="template-name">{template.name}</div>
                                    <div className="template-destination">
                                        {getDestinationMapName(template.destinationMapId)}
                                    </div>
                                    {template.description && (
                                        <div className="template-description">
                                            {template.description}
                                        </div>
                                    )}
                                    <div className="template-status">
                                        Status: {template.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                </div>

                                <div className="drag-hint">
                                    Drag to map to place
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="library-instructions">
                <h5>Instructions:</h5>
                <ul>
                    <li>Create reusable connection templates with predefined settings</li>
                    <li>Drag templates from library onto the map to place connections</li>
                    <li>Templates can be edited and reused across different maps</li>
                    <li>Set destination maps and colors for consistent connection design</li>
                </ul>
            </div>

            {/* Portal Template Creation/Edit Dialog */}
            <PortalConfigDialog
                isOpen={showCreateDialog}
                onClose={() => {
                    setShowCreateDialog(false);
                    setEditingTemplate(null);
                }}
                portalData={editingTemplate}
                onSave={handleSaveTemplate}
                mode="create"
                position={{ x: 400, y: 150 }}
            />
        </div>
    );
};

export default PortalLibrary;
