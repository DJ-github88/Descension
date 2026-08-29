import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { uploadAsset } from '../../services/firebase/uploadService';
import './BookDocumentEditor.css';

export const CANONICAL_MAP_PRESETS = [
  {
    id: 'preset-mythril-world',
    mapId: 'mythril',
    title: 'The World of Mythril',
    badge: 'World Atlas',
    subtitle: 'Grand Continental Atlas of the Seven Realms',
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    category: 'realms',
    region: 'World Master Map'
  },
  {
    id: 'preset-frostwood-reach',
    mapId: 'frostwood-reach',
    title: 'Frostwood Reach & Surrounding Lands',
    badge: 'Regional Map',
    subtitle: "The Mist-Archivists' Forest & Sovereign Ledger",
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    category: 'realms',
    region: 'Frostwood Reach'
  },
  {
    id: 'preset-nordhalla',
    mapId: 'nordhalla',
    title: 'Nordhalla — The Frozen Crown',
    badge: 'Regional Map',
    subtitle: 'Glacial Highlands, Rime-Spire Peaks & Blóðhöll',
    imageUrl: '/assets/images/backgrounds/nordhalla.jpeg',
    category: 'realms',
    region: 'Nordhalla'
  },
  {
    id: 'preset-sundale',
    mapId: 'sundale',
    title: 'Sundale — The Solar Expanse',
    badge: 'Regional Map',
    subtitle: 'Sun-Scorched Wastes, Basalt Shyr & Obsidian Canyons',
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    category: 'realms',
    region: 'Sundale'
  },
  {
    id: 'preset-iceheart-sea',
    mapId: 'iceheart-sea',
    title: 'Iceheart Sea — The Frigid Waters',
    badge: 'Regional Map',
    subtitle: 'Floe-Clans, Sunken Ruins & Glacial Fjords',
    imageUrl: '/assets/images/backgrounds/rime-spire-peaks.jpg',
    category: 'realms',
    region: 'Iceheart Sea'
  },
  {
    id: 'preset-cragjaw-peaks',
    mapId: 'cragjaw-peaks',
    title: 'Cragjaw Peaks — The Iron Spine',
    badge: 'Regional Map',
    subtitle: 'Shattered Precipices, Deep Forges & Runic Strongholds',
    imageUrl: '/assets/images/backgrounds/rime-spire-peaks.jpg',
    category: 'realms',
    region: 'Cragjaw Peaks'
  },
  {
    id: 'preset-sundrift-vale',
    mapId: 'sundrift-vale',
    title: 'Sundrift Vale — The Golden Lowlands',
    badge: 'Regional Map',
    subtitle: 'Verdant Valleys, River Bastions & Sylvan Groves',
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    category: 'realms',
    region: 'Sundrift Vale'
  },
  {
    id: 'preset-bryngloom-forest',
    mapId: 'bryngloom-forest',
    title: 'Bryngloom Forest — The Deep Canopy',
    badge: 'Regional Map',
    subtitle: 'Primordial Ironwoods, Brambleways & Fungal Depths',
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    category: 'realms',
    region: 'Bryngloom Forest'
  },
  // Subregions & Tactical Maps
  {
    id: 'preset-sub-ironheart',
    mapId: 'frostwood-south-reach',
    title: 'The Ironheart Vales',
    badge: 'Subregion Map',
    subtitle: 'Sovereign Ledger Check-posts & Ironwood Palisade',
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    category: 'subregions',
    region: 'Frostwood Reach'
  },
  {
    id: 'preset-sub-frostfang',
    mapId: 'frostwood-north-reach',
    title: 'The Frostfang Wastes',
    badge: 'Subregion Map',
    subtitle: 'Granite Tundra, Runic Monoliths & Glacial Moraine',
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    category: 'subregions',
    region: 'Frostwood Reach'
  },
  {
    id: 'preset-sub-drowned-fens',
    mapId: 'frostwood-eastern-fens',
    title: 'The Drowned Fens',
    badge: 'Subregion Map',
    subtitle: 'Lawless Peat-Bogs & The Forgotten Outcasts',
    imageUrl: '/assets/images/backgrounds/Mythril.jpeg',
    category: 'subregions',
    region: 'Frostwood Reach'
  },
  {
    id: 'preset-sub-rime-spire',
    mapId: 'nordhalla-glacier-heart',
    title: 'Rime-Spire Peaks',
    badge: 'Subregion Map',
    subtitle: 'Geothermal Pine Lowlands & Blue Ice Spires',
    imageUrl: '/assets/images/backgrounds/nordhalla.jpeg',
    category: 'subregions',
    region: 'Nordhalla'
  }
];

export const BADGE_PRESET_TAGS = [
  'Interactive Map',
  'World Atlas',
  'Regional Map',
  'Subregion Map',
  'Tactical Chart',
  'Dungeon Map',
  'City Blueprint',
  'Exploration Zone'
];

const BookMapPickerModal = ({
  isOpen,
  onClose,
  initialData = {},
  onSave
}) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'custom' | 'customize'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'realms' | 'subregions'
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState(initialData.title || 'Frostwood Reach & Surrounding Lands');
  const [badge, setBadge] = useState(initialData.badge !== undefined ? initialData.badge : 'Interactive Map');
  const [subtitle, setSubtitle] = useState(initialData.subtitle || initialData.caption || '');
  const [mapId, setMapId] = useState(initialData.mapId || 'frostwood-reach');
  const [imageUrl, setImageUrl] = useState(
    initialData.imageUrl || initialData.thumbnailUrl || '/assets/images/backgrounds/nordhalla.jpeg'
  );
  const [buttonText, setButtonText] = useState(initialData.buttonText || 'Open Map');
  const [heightStyle, setHeightStyle] = useState(initialData.heightStyle || 'standard'); // 'standard' | 'compact' | 'panoramic'
  const [showBadge, setShowBadge] = useState(initialData.badge !== '');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const filteredPresets = CANONICAL_MAP_PRESETS.filter((preset) => {
    const matchesCategory = categoryFilter === 'all' || preset.category === categoryFilter;
    const matchesSearch = !searchQuery.trim() ||
      preset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectPreset = (preset) => {
    setTitle(preset.title);
    setBadge(preset.badge);
    setSubtitle(preset.subtitle);
    setMapId(preset.mapId);
    setImageUrl(preset.imageUrl);
    setShowBadge(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadAsset(file, 'maps', user?.uid);
      if (url) {
        setImageUrl(url);
      }
    } catch (err) {
      console.error('Error uploading map image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    onSave({
      ...initialData,
      title: title.trim(),
      badge: showBadge ? badge.trim() : '',
      subtitle: subtitle.trim(),
      caption: subtitle.trim(),
      mapId: mapId.trim() || 'mythril',
      imageUrl: imageUrl.trim(),
      thumbnailUrl: imageUrl.trim(),
      buttonText: buttonText.trim() || 'Open Map',
      heightStyle
    });
    onClose();
  };

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-map-picker-modal parchment-frame" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <i className="fas fa-map-location-dot modal-icon-gold"></i>
            <div>
              <h3 className="map-picker-modal-heading">Interactive Map &amp; Atlas Studio</h3>
              <p className="modal-subtitle">Configure linked VTT world maps, regional atlases, and custom cartography</p>
            </div>
          </div>
          <div className="modal-header-actions">
            <button type="button" className="close-modal-btn" onClick={onClose} title="Close">
              &times;
            </button>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="modal-tab-bar">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            <i className="fas fa-globe"></i> Realm &amp; Regional Presets
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'customize' ? 'active' : ''}`}
            onClick={() => setActiveTab('customize')}
          >
            <i className="fas fa-sliders"></i> Display &amp; Labels
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            <i className="fas fa-image"></i> Custom Banner Artwork
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="modal-body-content book-map-picker-body">
          {activeTab === 'presets' && (
            <div className="map-presets-view">
              <div className="presets-filter-bar">
                <div className="search-input-wrap">
                  <i className="fas fa-magnifying-glass"></i>
                  <input
                    type="text"
                    placeholder="Search canonical realms, subregions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="modal-search-input"
                  />
                </div>
                <div className="category-filter-chips">
                  <button
                    type="button"
                    className={`filter-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('all')}
                  >
                    All Atlases
                  </button>
                  <button
                    type="button"
                    className={`filter-chip ${categoryFilter === 'realms' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('realms')}
                  >
                    Continents &amp; Realms
                  </button>
                  <button
                    type="button"
                    className={`filter-chip ${categoryFilter === 'subregions' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('subregions')}
                  >
                    Subregions
                  </button>
                </div>
              </div>

              <div className="map-presets-grid">
                {filteredPresets.map((preset) => {
                  const isSelected = mapId === preset.mapId;
                  return (
                    <div
                      key={preset.id}
                      className={`map-preset-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectPreset(preset)}
                    >
                      <div
                        className="preset-card-banner"
                        style={{ backgroundImage: `url(${preset.imageUrl})` }}
                      >
                        <span className="preset-card-badge">{preset.badge}</span>
                      </div>
                      <div className="preset-card-body">
                        <h4 className="preset-card-title">{preset.title}</h4>
                        <p className="preset-card-sub">{preset.subtitle}</p>
                        <div className="preset-card-meta">
                          <span className="preset-region-tag">
                            <i className="fas fa-compass"></i> {preset.region}
                          </span>
                          {isSelected && <span className="preset-active-indicator"><i className="fas fa-check"></i> Selected</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'customize' && (
            <div className="map-customize-view">
              <div className="custom-fields-grid">
                <div className="field-group">
                  <label className="field-label">Atlas Display Title</label>
                  <input
                    type="text"
                    className="modal-text-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Frostwood Reach & Surrounding Lands"
                  />
                  <span className="field-hint">Primary heading displayed over the map banner</span>
                </div>

                <div className="field-group">
                  <label className="field-label">Linked Map Canvas / Destination ID</label>
                  <input
                    type="text"
                    className="modal-text-input"
                    value={mapId}
                    onChange={(e) => setMapId(e.target.value)}
                    placeholder="e.g. frostwood-reach, nordhalla, mythril..."
                  />
                  <span className="field-hint">Navigates to /worldmap/:mapId when clicked</span>
                </div>

                <div className="field-group">
                  <div className="label-with-toggle">
                    <label className="field-label">Category Badge</label>
                    <label className="toggle-switch-lbl">
                      <input
                        type="checkbox"
                        checked={showBadge}
                        onChange={(e) => setShowBadge(e.target.checked)}
                      />
                      <span>Show Badge</span>
                    </label>
                  </div>
                  {showBadge && (
                    <>
                      <input
                        type="text"
                        className="modal-text-input"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="e.g. Interactive Map, World Atlas..."
                      />
                      <div className="badge-tag-chips">
                        {BADGE_PRESET_TAGS.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            className={`badge-tag-chip ${badge === tag ? 'active' : ''}`}
                            onClick={() => setBadge(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="field-group">
                  <label className="field-label">Subtitle / Lore Caption (Optional)</label>
                  <input
                    type="text"
                    className="modal-text-input"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Optional chronicle note, description or geographic context..."
                  />
                  <span className="field-hint">Displays in the card footer; leave empty for a clean button-only footer</span>
                </div>

                <div className="field-group">
                  <label className="field-label">Action Button Label</label>
                  <input
                    type="text"
                    className="modal-text-input"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="e.g. Open Map, Explore Atlas, View Region..."
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Banner Height Style</label>
                  <div className="height-style-chips">
                    {[
                      { id: 'compact', label: 'Compact (110px)' },
                      { id: 'standard', label: 'Standard (140px)' },
                      { id: 'panoramic', label: 'Panoramic (190px)' }
                    ].map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        className={`filter-chip ${heightStyle === h.id ? 'active' : ''}`}
                        onClick={() => setHeightStyle(h.id)}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="map-custom-art-view">
              <div className="field-group">
                <label className="field-label">Banner Image URL</label>
                <input
                  type="text"
                  className="modal-text-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or /assets/images/backgrounds/..."
                />
              </div>

              <div className="art-upload-box">
                <label className="art-upload-dropzone">
                  <i className="fas fa-cloud-arrow-up upload-icon"></i>
                  <span>{isUploading ? 'Uploading Image...' : 'Click to Upload Custom Map Banner Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="art-gallery-suggestions">
                <label className="field-label">Canonical Landscape Presets</label>
                <div className="suggestion-thumbs-row">
                  {[
                    { label: 'Mythril Master Atlas', url: '/assets/images/backgrounds/Mythril.jpeg' },
                    { label: 'Nordhalla High Glaciers', url: '/assets/images/backgrounds/nordhalla.jpeg' },
                    { label: 'Rime-Spire Peaks', url: '/assets/images/backgrounds/rime-spire-peaks.jpg' },
                    { label: 'Ancient Cartography', url: 'https://images.unsplash.com/photo-1524654458049-e36be0721fa2?auto=format&fit=crop&w=1200&q=80' },
                    { label: 'Foggy Forest Ironwoods', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80' }
                  ].map((sug, i) => (
                    <div
                      key={i}
                      className={`sug-thumb-card ${imageUrl === sug.url ? 'active' : ''}`}
                      onClick={() => setImageUrl(sug.url)}
                      title={sug.label}
                    >
                      <img src={sug.url} alt={sug.label} />
                      <span>{sug.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live Preview Bar */}
          <div className="map-picker-live-preview-section">
            <h4 className="preview-heading"><i className="fas fa-eye"></i> Live Chronicle Preview:</h4>
            <div className={`book-map-embed-card height-${heightStyle}`}>
              <div
                className="map-embed-banner"
                style={{ backgroundImage: `url(${imageUrl})` }}
              >
                <div className="map-embed-overlay">
                  {showBadge && badge && <span className="map-embed-badge">{badge}</span>}
                  <h4 className="map-embed-title">{title || 'Untitled Map'}</h4>
                </div>
              </div>
              <div className="map-embed-footer">
                {subtitle ? <span>{subtitle}</span> : <span className="map-sub-empty">Atlas Canvas Linked</span>}
                <button type="button" className="map-explore-btn">
                  <i className="fas fa-compass"></i> {buttonText || 'Open Map'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary-parchment" onClick={handleSave}>
            <i className="fas fa-check"></i> Apply to Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookMapPickerModal;
