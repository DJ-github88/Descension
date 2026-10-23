import React from 'react';
import { getIconUrl } from '../../../utils/assetManager';
import { BRUSH_PRESETS, BRUSH_ORDER } from '../../../utils/drawingRender';
import './styles/DrawingTools.css';

const SHAPE_TOOLS = ['line', 'arrow', 'rectangle', 'circle', 'ellipse', 'polygon'];
const FILL_TOOLS = ['rectangle', 'circle', 'ellipse', 'polygon', 'fill', 'freehand'];
const LINE_STYLES = [
    { id: 'solid', label: 'Solid' },
    { id: 'dashed', label: 'Dashed' },
    { id: 'dotted', label: 'Dotted' }
];

const TOOL_HINTS = {
    freehand: 'Draw freely. With a stylus, pressing harder makes the line thicker.',
    polygon: 'Tap or click to place corners. Tap the first corner again, or press Done, to finish.',
    fill: 'Tap a closed shape to fill it with the fill colour (or the stroke colour if no fill is set).',
    draw_edit: 'Tap a drawing to select it. Drag it to move, drag a corner to resize. Changes below apply to the selected drawing.'
};

const DrawingTools = ({
    selectedTool,
    onToolSelect,
    settings,
    onSettingsChange,
    selectionCount = 0,
    onDeleteSelection,
    onDuplicateSelection
}) => {
    // Stored opacity is a 0-1 fraction; the slider works in percent (min 10).
    // Legacy percentage values are tolerated, and decayed fractions (< 0.1 are
    // not reachable from the slider) are treated as corrupt and reset to full.
    const opacityToPercent = (value) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return 100;
        const percent = value > 1 ? value : value * 100;
        if (percent < 10) return 100;
        return Math.min(100, Math.round(percent));
    };

    // Local slider value (percent) -> store value (0-1 fraction), clamped to
    // the valid slider range so a stale local state cannot decay the opacity.
    const percentToOpacity = (percent) => {
        if (typeof percent !== 'number' || !Number.isFinite(percent) || percent < 10) return 1;
        return Math.min(1, percent / 100);
    };

    // The settings live in the editor store (the edit tool loads a selected
    // drawing's style into them), so the panel just reflects what it is given.
    const strokeColor = settings.strokeColor || '#000000';
    const fillColor = settings.fillColor || 'transparent';
    const strokeWidth = settings.strokeWidth || 2;
    const opacity = opacityToPercent(settings.opacity);

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
            icon: 'Piercing/Piercing Shots',
            description: 'Draw straight lines'
        },
        {
            id: 'arrow',
            name: 'Arrow',
            icon: 'Piercing/Piercing Shots',
            description: 'Draw an arrow to point something out'
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
            description: 'Draw a circle from its centre outwards'
        },
        {
            id: 'ellipse',
            name: 'Ellipse',
            icon: 'Arcane/Orb Manipulation',
            description: 'Draw an oval by dragging its corners'
        },
        {
            id: 'polygon',
            name: 'Polygon',
            icon: 'Utility/Utility Gear',
            description: 'Place corners one by one to build any shape'
        },
        {
            id: 'fill',
            name: 'Fill',
            icon: 'Utility/Utility Tool',
            description: 'Tap a closed shape to colour it in'
        },
        {
            id: 'draw_edit',
            name: 'Edit',
            icon: 'Utility/Target Crosshair',
            description: 'Select, move, resize, recolour or delete what you drew'
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
            opacity: percentToOpacity(opacity)
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

    const handleStrokeColorChange = (color) => onSettingsChange({ strokeColor: color });
    const handleFillColorChange = (color) => onSettingsChange({ fillColor: color });
    const handleStrokeWidthChange = (width) => onSettingsChange({ strokeWidth: width });
    const handleOpacityChange = (percent) => onSettingsChange({ opacity: percentToOpacity(percent) });

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

            {TOOL_HINTS[selectedTool] && (
                <div className="tool-section">
                    <p className="tool-hint" data-testid="drawing-tool-hint">{TOOL_HINTS[selectedTool]}</p>
                    {selectedTool === 'draw_edit' && selectionCount > 0 && (
                        <div className="selection-actions">
                            <button type="button" className="selection-action-btn" onClick={onDuplicateSelection}>
                                Duplicate
                            </button>
                            <button type="button" className="selection-action-btn danger" onClick={onDeleteSelection}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Brush feel (freehand) */}
            {selectedTool === 'freehand' && (
                <div className="tool-section">
                    <h4>Brush</h4>
                    <div className="brush-grid" role="group" aria-label="Brush">
                        {BRUSH_ORDER.map((id) => {
                            const preset = BRUSH_PRESETS[id];
                            const active = (settings.brushPreset || 'pen') === id;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    className={`brush-chip ${active ? 'active' : ''}`}
                                    aria-pressed={active}
                                    onClick={() => onSettingsChange({ brushPreset: id })}
                                >
                                    <span
                                        className="brush-sample"
                                        style={{
                                            height: `${Math.max(2, Math.min(10, 2 * preset.widthScale + 1))}px`,
                                            opacity: preset.alpha
                                        }}
                                    />
                                    <span>{preset.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="setting-group">
                        <label htmlFor="drawing-smoothing">Smoothing:</label>
                        <div className="stroke-width-controls">
                            <input
                                id="drawing-smoothing"
                                type="range"
                                min="0"
                                max="100"
                                value={Math.round((typeof settings.smoothing === 'number' ? settings.smoothing : 0.5) * 100)}
                                onChange={(e) => onSettingsChange({ smoothing: parseInt(e.target.value, 10) / 100 })}
                                className="stroke-slider"
                            />
                            <span className="stroke-value">
                                {Math.round((typeof settings.smoothing === 'number' ? settings.smoothing : 0.5) * 100)}%
                            </span>
                        </div>
                    </div>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={settings.usePressure !== false}
                            onChange={(e) => onSettingsChange({ usePressure: e.target.checked })}
                        />
                        Use stylus pressure
                    </label>
                </div>
            )}

            {/* Line look + placement (shapes) */}
            {(SHAPE_TOOLS.includes(selectedTool) || (selectedTool === 'draw_edit' && selectionCount > 0)) && (
                <div className="tool-section">
                    <h4>Line &amp; Placement</h4>
                    <div className="setting-group">
                        <label>Line Style:</label>
                        <div className="segmented" role="group" aria-label="Line style">
                            {LINE_STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    type="button"
                                    className={`segmented-btn ${(settings.lineStyle || 'solid') === style.id ? 'active' : ''}`}
                                    aria-pressed={(settings.lineStyle || 'solid') === style.id}
                                    onClick={() => onSettingsChange({ lineStyle: style.id })}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {(selectedTool === 'arrow' || selectedTool === 'draw_edit') && (
                        <div className="setting-group">
                            <label htmlFor="drawing-arrow-head">Arrow Heads:</label>
                            <select
                                id="drawing-arrow-head"
                                value={settings.arrowHead || 'end'}
                                onChange={(e) => onSettingsChange({ arrowHead: e.target.value })}
                                className="theme-select"
                            >
                                <option value="end">At the end</option>
                                <option value="both">Both ends</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                    )}
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={!!settings.sketch}
                            onChange={(e) => onSettingsChange({ sketch: e.target.checked })}
                        />
                        Hand-drawn sketch style
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={settings.drawSnap !== false}
                            onChange={(e) => onSettingsChange({ drawSnap: e.target.checked })}
                        />
                        Snap to grid corners
                    </label>
                </div>
            )}

            {/* Stroke Settings */}
            {selectedTool !== 'select' && selectedTool !== 'text' && selectedTool !== 'fill' && (selectedTool !== 'draw_edit' || selectionCount > 0) && (
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
            {(FILL_TOOLS.includes(selectedTool) || (selectedTool === 'draw_edit' && selectionCount > 0)) && (
                <div className="tool-section">
                    <h4>Fill Settings</h4>
                    {selectedTool === 'freehand' && (
                        <p className="tool-hint">Closing a loop with your stroke lets it take this fill colour.</p>
                    )}
                    
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
            {selectedTool !== 'select' && selectedTool !== 'fill' && (selectedTool !== 'draw_edit' || selectionCount > 0) && (
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
