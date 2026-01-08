import React, { useState } from 'react';
import { getIconUrl } from '../../../utils/assetManager';
import './styles/DrawingTools.css';

const DrawingTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [strokeColor, setStrokeColor] = useState(settings.strokeColor || '#000000');
    const [fillColor, setFillColor] = useState(settings.fillColor || 'transparent');
    const [strokeWidth, setStrokeWidth] = useState(settings.strokeWidth || 2);
    const [opacity, setOpacity] = useState(settings.opacity || 100);

    // Text theme presets
    const getTextThemeSettings = (theme) => {
        const themes = {
            default: {
                fontFamily: 'Arial',
                fontSize: 16,
                textColor: '#000000',
                backgroundColor: '#ffffff',
                backgroundStyle: 'solid',
                bold: false,
                italic: false,
                underline: false
            },
            title: {
                fontFamily: 'Georgia',
                fontSize: 32,
                textColor: '#2c1810',
                backgroundColor: '#f4e4bc',
                backgroundStyle: 'parchment',
                bold: true,
                italic: false,
                underline: false
            },
            subtitle: {
                fontFamily: 'Georgia',
                fontSize: 24,
                textColor: '#4a3728',
                backgroundColor: '#f4e4bc',
                backgroundStyle: 'parchment',
                bold: false,
                italic: true,
                underline: false
            },
            description: {
                fontFamily: 'Times New Roman',
                fontSize: 14,
                textColor: '#3a3a3a',
                backgroundColor: '#ffffff',
                backgroundStyle: 'solid',
                bold: false,
                italic: false,
                underline: false
            },
            warning: {
                fontFamily: 'Impact',
                fontSize: 20,
                textColor: '#ff6b00',
                backgroundColor: '#fff3cd',
                backgroundStyle: 'solid',
                bold: true,
                italic: false,
                underline: false
            },
            danger: {
                fontFamily: 'Impact',
                fontSize: 24,
                textColor: '#dc3545',
                backgroundColor: '#f8d7da',
                backgroundStyle: 'solid',
                bold: true,
                italic: false,
                underline: false
            },
            magic: {
                fontFamily: 'Palatino',
                fontSize: 18,
                textColor: '#6f42c1',
                backgroundColor: '#e7d9ff',
                backgroundStyle: 'scroll',
                bold: false,
                italic: true,
                underline: false
            },
            ancient: {
                fontFamily: 'Garamond',
                fontSize: 16,
                textColor: '#8b4513',
                backgroundColor: '#d2b48c',
                backgroundStyle: 'stone',
                bold: false,
                italic: false,
                underline: false
            },
            handwritten: {
                fontFamily: 'Comic Sans MS',
                fontSize: 16,
                textColor: '#2c3e50',
                backgroundColor: '#ffffff',
                backgroundStyle: 'none',
                bold: false,
                italic: false,
                underline: false
            },
            royal: {
                fontFamily: 'Garamond',
                fontSize: 28,
                textColor: '#ffd700',
                backgroundColor: '#4b0082',
                backgroundStyle: 'solid',
                bold: true,
                italic: false,
                underline: false
            }
        };
        return themes[theme] || themes.default;
    };

    // Drawing tool configurations
    const drawingTools = [
        {
            id: 'select',
            name: 'Select',
            icon: 'Utility/Target Crosshair',
            description: 'Select and manipulate drawings'
        },
        {
            id: 'area_remove',
            name: 'Area Remove',
            icon: 'Utility/Broken',
            description: 'Drag a rectangle to select and remove objects (tokens, items, tiles, walls, etc.)'
        },
        {
            id: 'freehand',
            name: 'Freehand',
            icon: 'Utility/Utility Tool',
            description: 'Draw freehand lines on the grid'
        },
        {
            id: 'line',
            name: 'Line',
            icon: 'Piercing/Piercing Shot',
            description: 'Draw straight lines'
        },
        {
            id: 'rectangle',
            name: 'Rectangle',
            icon: 'Utility/Utility',
            description: 'Draw rectangles and squares'
        },
        {
            id: 'circle',
            name: 'Circle',
            icon: 'Arcane/Orb Manipulation',
            description: 'Draw circles and ellipses'
        },
        {
            id: 'polygon',
            name: 'Polygon',
            icon: 'Utility/Utility Gear',
            description: 'Draw polygons by clicking and dragging'
        },
        {
            id: 'text',
            name: 'Text',
            icon: 'Utility/Utility',
            description: 'Add text annotations to the grid'
        },
        {
            id: 'eraser',
            name: 'Eraser',
            icon: 'Utility/Broken',
            description: 'Erase drawings'
        }
    ];

    // Predefined color palette
    const colorPalette = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
        '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
        '#FFC0CB', '#A52A2A', '#808080', '#008000', '#000080',
        '#800000', '#808000', '#008080', '#C0C0C0', '#D4AF37'
    ];

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        updateSettings();
    };

    const updateSettings = () => {
        onSettingsChange({
            strokeColor,
            fillColor,
            strokeWidth,
            opacity: opacity / 100
        });
    };

    // Handle theme change with immediate application
    const handleThemeChange = (theme) => {
        const themeSettings = getTextThemeSettings(theme);
        onSettingsChange({ textTheme: theme, ...themeSettings });
    };

    // Generate preview style for the settings panel
    const getPreviewStyle = (settings) => {
        const fontSize = settings.fontSize || 16;
        const fontFamily = settings.fontFamily || 'Arial';
        const textColor = settings.textColor || '#000000';
        const backgroundColor = settings.backgroundColor || '#ffffff';
        const backgroundStyle = settings.backgroundStyle || 'solid';
        const bold = settings.bold || false;
        const italic = settings.italic || false;
        const underline = settings.underline || false;

        // Build font string
        let fontWeight = bold ? 'bold' : 'normal';
        let fontStyle = italic ? 'italic' : 'normal';
        let textDecoration = underline ? 'underline' : 'none';

        // Base style
        let style = {
            fontSize: `${Math.min(fontSize, 18)}px`, // Cap preview size for panel
            fontFamily: fontFamily,
            color: textColor,
            fontWeight: fontWeight,
            fontStyle: fontStyle,
            textDecoration: textDecoration,
            lineHeight: '1.2'
        };

        // Apply background style
        if (backgroundStyle !== 'none') {
            switch (backgroundStyle) {
                case 'solid':
                    style.backgroundColor = backgroundColor;
                    style.border = '1px solid #333';
                    break;
                case 'parchment':
                    style.backgroundColor = backgroundColor;
                    style.border = '2px solid #d4af37';
                    style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)';
                    break;
                case 'scroll':
                    style.backgroundColor = backgroundColor;
                    style.border = '2px solid #8b7355';
                    style.borderRadius = '8px';
                    break;
                case 'stone':
                    style.backgroundColor = backgroundColor;
                    style.border = '3px solid #696969';
                    style.boxShadow = 'inset 1px 1px 2px rgba(169,169,169,0.5)';
                    break;
                case 'wood':
                    style.backgroundColor = backgroundColor;
                    style.border = '4px solid #8b4513';
                    style.backgroundImage = 'linear-gradient(90deg, transparent 0%, rgba(160,82,45,0.2) 25%, transparent 50%, rgba(160,82,45,0.2) 75%, transparent 100%)';
                    break;
                default:
                    style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    style.border = '1px solid #333';
                    break;
            }
        } else {
            style.backgroundColor = 'transparent';
            style.border = '1px dashed #ccc';
        }

        return style;
    };

    const handleStrokeColorChange = (color) => {
        setStrokeColor(color);
        onSettingsChange({
            strokeColor: color,
            fillColor,
            strokeWidth,
            opacity: opacity / 100
        });
    };

    const handleFillColorChange = (color) => {
        setFillColor(color);
        onSettingsChange({
            strokeColor,
            fillColor: color,
            strokeWidth,
            opacity: opacity / 100
        });
    };

    const handleStrokeWidthChange = (width) => {
        setStrokeWidth(width);
        onSettingsChange({
            strokeColor,
            fillColor,
            strokeWidth: width,
            opacity: opacity / 100
        });
    };

    const handleOpacityChange = (newOpacity) => {
        setOpacity(newOpacity);
        onSettingsChange({
            strokeColor,
            fillColor,
            strokeWidth,
            opacity: newOpacity / 100
        });
    };

    return (
        <div className="drawing-tools">
            {/* Tool Selection */}
            <div className="tool-section">
                <h4>Drawing Tools</h4>
                <div className="tool-grid">
                    {drawingTools.map(tool => (
                        <button
                            key={tool.id}
                            className={`drawing-tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
                            onClick={() => handleToolSelect(tool.id)}
                            title={tool.description}
                        >
                            <img
                                src={getIconUrl(tool.icon, 'abilities')}
                                alt={tool.name}
                                className="tool-icon"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                }}
                            />
                            <span className="tool-name">{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stroke Settings */}
            {selectedTool !== 'select' && selectedTool !== 'text' && (
                <div className="tool-section">
                    <h4>Stroke Settings</h4>
                    
                    {/* Stroke Color */}
                    <div className="setting-group">
                        <label>Stroke Color:</label>
                        <div className="color-picker-group">
                            <input
                                type="color"
                                value={strokeColor}
                                onChange={(e) => handleStrokeColorChange(e.target.value)}
                                className="color-input"
                            />
                            <div className="color-palette">
                                {colorPalette.map(color => (
                                    <button
                                        key={color}
                                        className={`color-swatch ${strokeColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleStrokeColorChange(color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stroke Width */}
                    <div className="setting-group">
                        <label>Stroke Width:</label>
                        <div className="stroke-width-controls">
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={strokeWidth}
                                onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
                                className="stroke-slider"
                            />
                            <span className="stroke-value">{strokeWidth}px</span>
                        </div>
                        <div className="stroke-preview">
                            <div
                                className="stroke-line"
                                style={{
                                    height: `${strokeWidth}px`,
                                    backgroundColor: strokeColor
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Fill Settings */}
            {(selectedTool === 'rectangle' || selectedTool === 'circle' || selectedTool === 'polygon') && (
                <div className="tool-section">
                    <h4>Fill Settings</h4>
                    
                    <div className="setting-group">
                        <label>Fill Color:</label>
                        <div className="fill-controls">
                            <button
                                className={`fill-option ${fillColor === 'transparent' ? 'active' : ''}`}
                                onClick={() => handleFillColorChange('transparent')}
                            >
                                No Fill
                            </button>
                            <div className="color-picker-group">
                                <input
                                    type="color"
                                    value={fillColor === 'transparent' ? '#ffffff' : fillColor}
                                    onChange={(e) => handleFillColorChange(e.target.value)}
                                    className="color-input"
                                    disabled={fillColor === 'transparent'}
                                />
                                <div className="color-palette">
                                    {colorPalette.map(color => (
                                        <button
                                            key={color}
                                            className={`color-swatch ${fillColor === color ? 'active' : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleFillColorChange(color)}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Opacity Settings */}
            {selectedTool !== 'select' && (
                <div className="tool-section">
                    <h4>Opacity</h4>
                    <div className="setting-group">
                        <div className="opacity-controls">
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={opacity}
                                onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
                                className="opacity-slider"
                            />
                            <span className="opacity-value">{opacity}%</span>
                        </div>
                        <div className="opacity-preview">
                            <div
                                className="opacity-sample"
                                style={{
                                    backgroundColor: strokeColor,
                                    opacity: opacity / 100
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Text Settings */}
            {selectedTool === 'text' && (
                <div className="tool-section">
                    <h4>Text Settings</h4>

                    {/* Text Themes */}
                    <div className="setting-group">
                        <label>Text Theme:</label>
                        <select
                            value={settings.textTheme || 'default'}
                            onChange={(e) => handleThemeChange(e.target.value)}
                            className="theme-select"
                        >
                            <option value="default">Default</option>
                            <option value="title">Title/Header</option>
                            <option value="subtitle">Subtitle</option>
                            <option value="description">Description</option>
                            <option value="warning">Warning</option>
                            <option value="danger">Danger</option>
                            <option value="magic">Magic</option>
                            <option value="ancient">Ancient Text</option>
                            <option value="handwritten">Handwritten</option>
                            <option value="royal">Royal Decree</option>
                        </select>
                    </div>

                    {/* Font Family */}
                    <div className="setting-group">
                        <label>Font Family:</label>
                        <select
                            value={settings.fontFamily || 'Arial'}
                            onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
                            className="font-family-select"
                        >
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Impact">Impact</option>
                            <option value="Comic Sans MS">Comic Sans MS</option>
                            <option value="Trebuchet MS">Trebuchet MS</option>
                            <option value="Palatino">Palatino</option>
                            <option value="Garamond">Garamond</option>
                        </select>
                    </div>

                    {/* Font Size */}
                    <div className="setting-group">
                        <label>Font Size:</label>
                        <select
                            value={settings.fontSize || 16}
                            onChange={(e) => onSettingsChange({ fontSize: parseInt(e.target.value) })}
                            className="font-size-select"
                        >
                            <option value={10}>10px</option>
                            <option value={12}>12px</option>
                            <option value={14}>14px</option>
                            <option value={16}>16px</option>
                            <option value={18}>18px</option>
                            <option value={20}>20px</option>
                            <option value={24}>24px</option>
                            <option value={28}>28px</option>
                            <option value={32}>32px</option>
                            <option value={36}>36px</option>
                            <option value={48}>48px</option>
                        </select>
                    </div>

                    {/* Text Color */}
                    <div className="setting-group">
                        <label>Text Color:</label>
                        <input
                            type="color"
                            value={settings.textColor || '#000000'}
                            onChange={(e) => onSettingsChange({ textColor: e.target.value })}
                            className="color-input"
                        />
                    </div>

                    {/* Background Style */}
                    <div className="setting-group">
                        <label>Background:</label>
                        <select
                            value={settings.backgroundStyle || 'solid'}
                            onChange={(e) => onSettingsChange({ backgroundStyle: e.target.value })}
                            className="background-style-select"
                        >
                            <option value="none">No Background</option>
                            <option value="solid">Solid Background</option>
                            <option value="parchment">Parchment</option>
                            <option value="scroll">Scroll</option>
                            <option value="stone">Stone Tablet</option>
                            <option value="wood">Wooden Sign</option>
                        </select>
                    </div>

                    {/* Background Color (if solid background) */}
                    {settings.backgroundStyle === 'solid' && (
                        <div className="setting-group">
                            <label>Background Color:</label>
                            <input
                                type="color"
                                value={settings.backgroundColor || '#ffffff'}
                                onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                                className="color-input"
                            />
                        </div>
                    )}

                    {/* Text Style Options */}
                    <div className="setting-group">
                        <label>Text Style:</label>
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.bold || false}
                                    onChange={(e) => onSettingsChange({ bold: e.target.checked })}
                                />
                                Bold
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.italic || false}
                                    onChange={(e) => onSettingsChange({ italic: e.target.checked })}
                                />
                                Italic
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={settings.underline || false}
                                    onChange={(e) => onSettingsChange({ underline: e.target.checked })}
                                />
                                Underline
                            </label>
                        </div>
                    </div>

                    {/* Style Preview */}
                    <div className="setting-group">
                        <label>Style Preview:</label>
                        <div
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                textAlign: 'center',
                                minHeight: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...getPreviewStyle(settings)
                            }}
                        >
                            Sample Text
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default DrawingTools;
