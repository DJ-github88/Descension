import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getCustomIconUrl } from '../../../utils/assetManager';
import ImageEditor from './ImageEditor';
import { ALL_BACKGROUND_ASSETS } from '../../../data/backgroundAssets';
import '../styles/CharacterAppearanceModal.css';

const BACKDROP_PRESETS = [
    '#f8f5eb', '#1a1a2e', '#2d1810', '#0d1b2a', '#1b2d1b',
    '#2a1a1a', '#e8dcc0', '#f0e6d3', '#c4a882', '#3d3d5c'
];

const BORDER_PRESETS = [
    '#d4af37', '#c0c0c0', '#b87333', '#8b4513', '#4a4a4a',
    '#2c2416', '#e6c757', '#f0c040', '#654321', '#1a1a1a'
];

const CREATURE_SUBFOLDERS = [
    'Dark Elf', 'Demon', 'Dwarf', 'Elves', 'Fairy',
    'Halfling', 'Human', 'Kobolds', 'Monsters', 'More Demons',
    'More Elves', 'More Humans', 'More Monsters', 'More Undead',
    'Orc and Goblins', 'Pirates', 'Undead'
];

const getBaseCategory = (f) => f.startsWith('More ') ? f.replace('More ', '') : f;
const getCatId = (f) => getBaseCategory(f).toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

const formatIconName = (base, num) => {
    const map = {
        'Elves': 'Elf', 'Kobolds': 'Kobold', 'Monsters': 'Monster',
        'Pirates': 'Pirate', 'Demons': 'Demon', 'Humans': 'Human',
        'Orc and Goblins': 'Orc/Goblin'
    };
    const singular = map[base] || base.replace(/ies$/, 'y').replace(/s$/, '');
    return `${singular} ${num}`;
};

const Section = ({ id, icon, title, openSections, onToggle, children }) => {
    const isOpen = openSections.includes(id);
    return (
        <div className={`pw-section ${isOpen ? 'pw-section-open' : 'pw-section-closed'}`}>
            <div className="pw-section-toggle" onClick={() => onToggle(id)}>
                <div className="pw-section-title">
                    <i className={`fas ${icon}`} />
                    <span>{title}</span>
                </div>
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} pw-section-chevron`} />
            </div>
            {isOpen && <div className="pw-section-body">{children}</div>}
        </div>
    );
};

const PositionPad = ({ x, y, min, max, onChange }) => {
    const padRef = React.useRef(null);
    const dragging = React.useRef(false);

    const calcPos = (clientX, clientY) => {
        const rect = padRef.current.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        const nx = Math.round(min + px * (max - min));
        const ny = Math.round(min + py * (max - min));
        onChange(nx, ny);
    };

    const onDown = (e) => {
        dragging.current = true;
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        calcPos(cx, cy);
        e.preventDefault();
    };

    React.useEffect(() => {
        if (!dragging.current) return;
        const onMove = (e) => {
            if (!dragging.current) return;
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            calcPos(cx, cy);
        };
        const onUp = () => { dragging.current = false; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onUp);
        };
    }, [min, max, onChange]);

    const normX = (x - min) / (max - min);
    const normY = (y - min) / (max - min);

    return (
        <div className="pw-pospad" ref={padRef} onMouseDown={onDown} onTouchStart={onDown}>
            <div className="pw-pospad-cross pw-pospad-h" />
            <div className="pw-pospad-cross pw-pospad-v" />
            <div className="pw-pospad-dot" style={{ left: `${normX * 100}%`, top: `${normY * 100}%` }} />
            <div className="pw-pospad-labels">
                <span className="pw-pospad-lbl pw-pospad-lbl-t">↑{Math.round(Math.abs(y))}</span>
                <span className="pw-pospad-lbl pw-pospad-lbl-b">↓{Math.round(Math.abs(y))}</span>
                <span className="pw-pospad-lbl pw-pospad-lbl-l">←{Math.round(Math.abs(x))}</span>
                <span className="pw-pospad-lbl pw-pospad-lbl-r">→{Math.round(Math.abs(x))}</span>
            </div>
            <span className="pw-pospad-hint">{Math.round(x)}, {Math.round(y)}</span>
        </div>
    );
};

const CharacterAppearanceModal = ({
    isOpen,
    onClose,
    characterData,
    onUpdate,
    imagePreview,
    onImageUpload,
    onRemoveImage,
    imageTransformations,
    onApplyTransformations
}) => {
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [openSections, setOpenSections] = useState(['portrait', 'background']);
    const [iconSearch, setIconSearch] = useState('');
    const [iconCategory, setIconCategory] = useState('all');
    const [creatureIcons, setCreatureIcons] = useState([]);
    const [iconsLoading, setIconsLoading] = useState(false);

    const toggleSection = (id) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const iconCategories = useMemo(() => {
        const cats = new Map();
        CREATURE_SUBFOLDERS.forEach(f => {
            const base = getBaseCategory(f);
            const cid = getCatId(f);
            if (!cats.has(cid)) cats.set(cid, { id: cid, name: base, folders: [] });
            cats.get(cid).folders.push(f);
        });
        return [{ id: 'all', name: 'All' }, ...Array.from(cats.values())];
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        let cancelled = false;
        const load = async () => {
            setIconsLoading(true);
            const icons = [];
            try {
                const res = await fetch('/assets/icons/creatures/manifest.json');
                if (res.ok) {
                    const manifest = await res.json();
                    manifest.icons?.forEach(icon => {
                        const folder = icon.folder || icon.path?.split('/')[0];
                        const base = getBaseCategory(folder);
                        const match = (icon.path || '').match(/Icon(\d+)\.png$/i);
                        let name = icon.name;
                        if (!name && match) {
                            let num = parseInt(match[1], 10);
                            if (folder?.startsWith('More ')) {
                                const baseFolder = getBaseCategory(folder);
                                const baseIcons = manifest.icons?.filter(i =>
                                    (i.folder || i.path?.split('/')[0]) === baseFolder
                                ) || [];
                                num = baseIcons.length + num;
                            }
                            name = formatIconName(base, num);
                        }
                        if (!name) name = (icon.path || '').replace(/\.png$/, '').replace(/\//g, ' ');
                        icons.push({ id: icon.path, name, folder: folder || '' });
                    });
                }
            } catch (_) {}

            if (icons.length === 0) {
                const counts = new Map();
                CREATURE_SUBFOLDERS.forEach(folder => {
                    const isMore = folder.startsWith('More ');
                    const base = getBaseCategory(folder);
                    let start = 1;
                    if (isMore) start = (counts.get(base) || 0) + 1;
                    const count = folder === 'Human' ? 73 : 48;

                    if (folder === 'Human') {
                        for (let i = 1; i <= 48; i++) {
                            icons.push({ id: `Human/Icon${i}`, name: `Human ${i}`, folder: 'Human' });
                        }
                        for (let i = 1; i <= 25; i++) {
                            const pad = i.toString().padStart(2, '0');
                            icons.push({ id: `Human/Icon_33_${pad}`, name: `Human ${48 + i}`, folder: 'Human' });
                        }
                        counts.set('Human', 73);
                    } else {
                        for (let i = 1; i <= 48; i++) {
                            const displayNum = isMore ? start + i - 1 : i;
                            icons.push({
                                id: `${folder}/Icon${i}`,
                                name: formatIconName(base, displayNum),
                                folder
                            });
                        }
                        if (!isMore) counts.set(folder, 48);
                    }
                });
            }

            if (!cancelled) {
                setCreatureIcons(icons);
                setIconsLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [isOpen]);

    const filteredIcons = creatureIcons.filter(icon => {
        const matchSearch = !iconSearch ||
            icon.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
            icon.id.toLowerCase().includes(iconSearch.toLowerCase());
        if (iconCategory === 'all') return matchSearch;
        const cat = iconCategories.find(c => c.id === iconCategory);
        return matchSearch && cat?.folders?.includes(icon.folder);
    });

    if (!isOpen) return null;

    const currentImage = imagePreview || characterData.characterImage;
    const currentIcon = characterData.characterIcon;

    const previewStyle = {
        backgroundColor: characterData.iconBackgroundColor || '#f8f5eb',
        borderColor: characterData.iconBorderColor || '#d4af37',
        backgroundImage: characterData.iconBackgroundImage
            ? `url(/assets/backgrounds/${characterData.iconBackgroundImage})`
            : 'none',
        backgroundSize: characterData.iconBackgroundImage
            ? `${(characterData.iconBackgroundScale || 2.5) * 100}%`
            : 'cover',
        backgroundPosition: characterData.iconBackgroundImage
            ? `calc(50% + ${characterData.iconBackgroundOffsetX || 0}px) calc(50% + ${characterData.iconBackgroundOffsetY || 0}px)`
            : 'center',
        backgroundRepeat: 'no-repeat'
    };

    const renderPreviewContent = () => {
        const imgStyle = {
            transform: `scale(${(imageTransformations?.scale || 1.2) * (characterData.iconScale || 1)}) rotate(${imageTransformations?.rotation || 0}deg) translate(${(imageTransformations?.positionX || 0) + (characterData.iconOffsetX || 0)}px, ${(imageTransformations?.positionY || 0) + (characterData.iconOffsetY || 0)}px)`
        };
        const iconStyle = {
            transform: `scale(${characterData.iconScale || 1}) translate(${characterData.iconOffsetX || 0}px, ${characterData.iconOffsetY || 0}px)`
        };

        if (currentImage) {
            return <img src={currentImage} alt="Preview" className="pw-preview-img" style={imgStyle} />;
        }
        if (currentIcon) {
            return (
                <img
                    src={getCustomIconUrl(currentIcon, 'creatures')}
                    alt="Icon"
                    className="pw-preview-img"
                    style={iconStyle}
                    onError={(e) => { e.target.onerror = null; e.target.src = getCustomIconUrl('Human/Icon1', 'creatures'); }}
                />
            );
        }
        return (
            <div className="pw-preview-empty">
                <i className="fas fa-user-plus" />
                <span>No Portrait</span>
            </div>
        );
    };

    return ReactDOM.createPortal(
        <div className="pw-overlay" onClick={onClose}>
            <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pw-header">
                    <div className="pw-header-left">
                        <h3>Portrait Workshop</h3>
                        <span className="pw-subtitle">Design your character's appearance</span>
                    </div>
                    <button className="pw-close-btn" onClick={onClose}>
                        <i className="fas fa-times" />
                    </button>
                </div>

                <div className="pw-body">
                    <div className="pw-left">
                        <div className="pw-preview-frame" style={previewStyle}>
                            {renderPreviewContent()}
                            <div className="pw-preview-ring" />
                        </div>

                        <div className="pw-left-actions">
                            <label className="pw-left-btn" title="Upload an image">
                                <i className="fas fa-cloud-upload-alt" />
                                <span>Upload</span>
                                <input type="file" accept="image/*" onChange={onImageUpload} hidden />
                            </label>
                            {currentImage && (
                                <button className="pw-left-btn" onClick={() => setShowImageEditor(true)} title="Crop image">
                                    <i className="fas fa-crop-alt" />
                                    <span>Edit</span>
                                </button>
                            )}
                            {(currentImage || currentIcon) && (
                                <button className="pw-left-btn pw-left-btn-danger" onClick={() => { onRemoveImage(); onUpdate({ characterIcon: null }); }} title="Remove portrait">
                                    <i className="fas fa-trash-alt" />
                                    <span>Clear</span>
                                </button>
                            )}
                        </div>

                        <div className="pw-left-colors">
                            <div className="pw-mini-color">
                                <label>Backdrop</label>
                                <div className="pw-mini-swatch" style={{ backgroundColor: characterData.iconBackgroundColor || '#f8f5eb' }}>
                                    <input type="color" value={characterData.iconBackgroundColor || '#f8f5eb'} onChange={(e) => onUpdate({ iconBackgroundColor: e.target.value })} />
                                </div>
                            </div>
                            <div className="pw-mini-color">
                                <label>Border</label>
                                <div className="pw-mini-swatch" style={{ backgroundColor: characterData.iconBorderColor || '#d4af37' }}>
                                    <input type="color" value={characterData.iconBorderColor || '#d4af37'} onChange={(e) => onUpdate({ iconBorderColor: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pw-right">
                        <Section id="portrait" icon="fa-user" title="Portrait Icon" openSections={openSections} onToggle={toggleSection}>
                            <input
                                type="text"
                                className="pw-icon-search"
                                placeholder="Search icons..."
                                value={iconSearch}
                                onChange={(e) => setIconSearch(e.target.value)}
                            />
                            <div className="pw-icon-cats">
                                {iconCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`pw-icon-cat ${iconCategory === cat.id ? 'pw-icon-cat-active' : ''}`}
                                        onClick={() => setIconCategory(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            <div className="pw-icon-grid">
                                {iconsLoading ? (
                                    <div className="pw-icon-loading">Loading icons...</div>
                                ) : (
                                    filteredIcons.map(icon => {
                                        const url = getCustomIconUrl(icon.id, 'creatures');
                                        const sel = currentIcon === icon.id || currentIcon === icon.path;
                                        return (
                                            <div
                                                key={icon.id}
                                                className={`pw-icon-item ${sel ? 'pw-icon-item-selected' : ''}`}
                                                onClick={() => onUpdate({ characterIcon: icon.id })}
                                                title={icon.name}
                                            >
                                                <img
                                                    src={url}
                                                    alt={icon.name}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = getCustomIconUrl('ui_icon_questionmark', 'ui'); }}
                                                />
                                            </div>
                                        );
                                    })
                                )}
                                {!iconsLoading && filteredIcons.length === 0 && (
                                    <div className="pw-icon-loading">No icons found</div>
                                )}
                            </div>
                        </Section>

                        <Section id="background" icon="fa-image" title="Background Scene" openSections={openSections} onToggle={toggleSection}>
                            <div className="pw-bg-grid">
                                <div
                                    className={`pw-bg-item pw-bg-none ${!characterData.iconBackgroundImage ? 'pw-bg-active' : ''}`}
                                    onClick={() => onUpdate({ iconBackgroundImage: null })}
                                >
                                    <i className="fas fa-ban" />
                                    <span>None</span>
                                </div>
                                {ALL_BACKGROUND_ASSETS.map(bg => (
                                    <div
                                        key={bg}
                                        className={`pw-bg-item ${characterData.iconBackgroundImage === bg ? 'pw-bg-active' : ''}`}
                                        style={{ backgroundImage: `url(/assets/backgrounds/${encodeURIComponent(bg)})` }}
                                        onClick={() => onUpdate({ iconBackgroundImage: bg })}
                                        title={bg.replace('.png', '').replace(/([A-Z])/g, ' $1').trim()}
                                    />
                                ))}
                            </div>
                        </Section>

                        <Section id="colors" icon="fa-palette" title="Color Presets" openSections={openSections} onToggle={toggleSection}>
                            <div className="pw-color-rows">
                                <div className="pw-color-row">
                                    <label className="pw-color-label">Backdrop</label>
                                    <div className="pw-color-swatches">
                                        {BACKDROP_PRESETS.map(c => (
                                            <div
                                                key={c}
                                                className={`pw-swatch ${characterData.iconBackgroundColor === c ? 'pw-swatch-active' : ''}`}
                                                style={{ backgroundColor: c }}
                                                onClick={() => onUpdate({ iconBackgroundColor: c })}
                                            />
                                        ))}
                                        <label className="pw-swatch pw-swatch-custom" title="Custom">
                                            <input type="color" value={characterData.iconBackgroundColor || '#f8f5eb'} onChange={(e) => onUpdate({ iconBackgroundColor: e.target.value })} />
                                            <i className="fas fa-eyedropper" />
                                        </label>
                                    </div>
                                </div>
                                <div className="pw-color-row">
                                    <label className="pw-color-label">Border</label>
                                    <div className="pw-color-swatches">
                                        {BORDER_PRESETS.map(c => (
                                            <div
                                                key={c}
                                                className={`pw-swatch ${characterData.iconBorderColor === c ? 'pw-swatch-active' : ''}`}
                                                style={{ backgroundColor: c }}
                                                onClick={() => onUpdate({ iconBorderColor: c })}
                                            />
                                        ))}
                                        <label className="pw-swatch pw-swatch-custom" title="Custom">
                                            <input type="color" value={characterData.iconBorderColor || '#d4af37'} onChange={(e) => onUpdate({ iconBorderColor: e.target.value })} />
                                            <i className="fas fa-eyedropper" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section id="scale" icon="fa-expand-arrows-alt" title="Scale & Position" openSections={openSections} onToggle={toggleSection}>
                            <div className="pw-tuning-row">
                                <div className="pw-tuning-group">
                                    <div className="pw-tuning-group-header">
                                        <span className="pw-tuning-group-title"><i className="fas fa-user" /> Portrait</span>
                                        <button className="pw-tuning-reset" onClick={() => onUpdate({ iconScale: 1, iconOffsetX: 0, iconOffsetY: 0 })}>
                                            <i className="fas fa-undo" /> Reset
                                        </button>
                                    </div>
                                    <div className="pw-tuning-size">
                                        <span>Size</span>
                                        <input type="range" min="0.5" max="3.0" step="0.1" value={characterData.iconScale || 1} onChange={(e) => onUpdate({ iconScale: parseFloat(e.target.value) })} />
                                        <span className="pw-slider-val">{(characterData.iconScale || 1).toFixed(1)}x</span>
                                    </div>
                                    <PositionPad
                                        x={characterData.iconOffsetX || 0}
                                        y={characterData.iconOffsetY || 0}
                                        min={-100}
                                        max={100}
                                        onChange={(x, y) => onUpdate({ iconOffsetX: x, iconOffsetY: y })}
                                    />
                                </div>
                                <div className="pw-tuning-group">
                                    <div className="pw-tuning-group-header">
                                        <span className="pw-tuning-group-title"><i className="fas fa-image" /> Background</span>
                                        <button className="pw-tuning-reset" onClick={() => onUpdate({ iconBackgroundScale: 2.5, iconBackgroundOffsetX: 0, iconBackgroundOffsetY: 0 })}>
                                            <i className="fas fa-undo" /> Reset
                                        </button>
                                    </div>
                                    <div className="pw-tuning-size">
                                        <span>Zoom</span>
                                        <input type="range" min="1.0" max="5.0" step="0.1" value={characterData.iconBackgroundScale || 2.5} onChange={(e) => onUpdate({ iconBackgroundScale: parseFloat(e.target.value) })} />
                                        <span className="pw-slider-val">{(characterData.iconBackgroundScale || 2.5).toFixed(1)}x</span>
                                    </div>
                                    <PositionPad
                                        x={characterData.iconBackgroundOffsetX || 0}
                                        y={characterData.iconBackgroundOffsetY || 0}
                                        min={-200}
                                        max={200}
                                        onChange={(x, y) => onUpdate({ iconBackgroundOffsetX: x, iconBackgroundOffsetY: y })}
                                    />
                                </div>
                            </div>
                        </Section>
                    </div>
                </div>

                <div className="pw-footer">
                    <button className="pw-reset-btn" onClick={() => onUpdate({
                        iconBackgroundColor: '#f8f5eb', iconBorderColor: '#d4af37',
                        iconBackgroundImage: null, iconScale: 1, iconOffsetX: 0, iconOffsetY: 0,
                        iconBackgroundScale: 2.5, iconBackgroundOffsetX: 0, iconBackgroundOffsetY: 0
                    })}>
                        <i className="fas fa-undo-alt" /> Reset
                    </button>
                    <button className="pw-done-btn" onClick={onClose}>
                        <i className="fas fa-check" /> Done
                    </button>
                </div>
            </div>

            <ImageEditor
                isOpen={showImageEditor}
                onClose={() => setShowImageEditor(false)}
                imageUrl={currentImage}
                onApply={(t) => { onApplyTransformations(t); setShowImageEditor(false); }}
                initialTransformations={imageTransformations}
            />
        </div>,
        document.body
    );
};

export default CharacterAppearanceModal;
