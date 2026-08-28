import React, { useState, useRef } from 'react';
import useAuthStore from '../../store/authStore';
import { uploadAsset } from '../../services/firebase/uploadService';
import './BookDocumentEditor.css';

export const CHARACTER_ART_PRESETS = [
  // --- Races & Lineages ---
  {
    id: 'race-solari',
    name: 'Solari Cinder-Walker',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/solari_illustration.png',
    thumbnail: '/assets/images/races/solari_illustration.png'
  },
  {
    id: 'race-astril',
    name: 'Astril Star-Refugee',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/astril_illustration.png',
    thumbnail: '/assets/images/races/astril_illustration.png'
  },
  {
    id: 'race-fexric',
    name: 'Fexric Cyber-Engineer',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/fexric_illustration.png',
    thumbnail: '/assets/images/races/fexric_illustration.png'
  },
  {
    id: 'race-florae',
    name: 'Florae Herbalist',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/florae_illustration.jpg',
    thumbnail: '/assets/images/races/florae_illustration.jpg'
  },
  {
    id: 'race-groven',
    name: 'Groven Stone-Born',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/groven_illustration.png',
    thumbnail: '/assets/images/races/groven_illustration.png'
  },
  {
    id: 'race-mimir',
    name: 'Mimir Veiled Seer',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/Veiled_Mimir.png',
    thumbnail: '/assets/images/races/Veiled_Mimir.png'
  },
  {
    id: 'race-myrathil',
    name: 'Myrathil Deepling',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/deep_illustration.png',
    thumbnail: '/assets/images/races/deep_illustration.png'
  },
  {
    id: 'race-neth',
    name: 'Neth Forest-Dweller',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/neth_illustration.png',
    thumbnail: '/assets/images/races/neth_illustration.png'
  },
  {
    id: 'race-human',
    name: 'Skald Nordhalla Warrior',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/skald_illustration.png',
    thumbnail: '/assets/images/races/skald_illustration.png'
  },
  {
    id: 'race-vreken',
    name: 'Vreken Highborn',
    category: 'races',
    type: 'Lineage Art',
    url: '/assets/images/races/ithran_illustration.png',
    thumbnail: '/assets/images/races/ithran_illustration.png'
  },

  // --- Subraces & Cultures ---
  {
    id: 'subrace-tethered-mimir',
    name: 'Tethered Mimir Scholar',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/Tethered_Mimir.png',
    thumbnail: '/assets/images/races/Tethered_Mimir.png'
  },
  {
    id: 'subrace-untethered-mimir',
    name: 'Untethered Mimir Mystic',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/Untethered_Mimir.png',
    thumbnail: '/assets/images/races/Untethered_Mimir.png'
  },
  {
    id: 'subrace-deepling-myrathil',
    name: 'Deepling Myrathil Hunter',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/deep_illustration_2.png',
    thumbnail: '/assets/images/races/deep_illustration_2.png'
  },
  {
    id: 'subrace-brook-myrathil',
    name: 'Brook Myrathil Scout',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/brook_illustration.png',
    thumbnail: '/assets/images/races/brook_illustration.png'
  },
  {
    id: 'subrace-briaran-florae',
    name: 'Briaran Thorn-Weaver',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/briaran_illustration.jpg',
    thumbnail: '/assets/images/races/briaran_illustration.jpg'
  },
  {
    id: 'subrace-florae-ranger',
    name: 'Florae Wild-Ranger',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/florae_ranger.jpg',
    thumbnail: '/assets/images/races/florae_ranger.jpg'
  },
  {
    id: 'subrace-drall-fexrick',
    name: 'Drall Scrap-Tinkerer',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/drall_illustration.png',
    thumbnail: '/assets/images/races/drall_illustration.png'
  },
  {
    id: 'subrace-drun-fexrick',
    name: 'Drun Swamp-Grafter',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/drun_illustration.png',
    thumbnail: '/assets/images/races/drun_illustration.png'
  },
  {
    id: 'subrace-kethrin-fexrick',
    name: 'Kethrin Gear-Keeper',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/kethrin_illustration.png',
    thumbnail: '/assets/images/races/kethrin_illustration.png'
  },
  {
    id: 'subrace-korr-fexrick',
    name: 'Korr Forge-Smith',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/korr_illustration.png',
    thumbnail: '/assets/images/races/korr_illustration.png'
  },
  {
    id: 'subrace-ithran-vreken',
    name: 'Ithran Noblewoman',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/ithran_female.jpg',
    thumbnail: '/assets/images/races/ithran_female.jpg'
  },
  {
    id: 'subrace-hallowed-neth',
    name: 'Hallowed Neth Hermit',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/hallowed_illustration.png',
    thumbnail: '/assets/images/races/hallowed_illustration.png'
  },
  {
    id: 'subrace-merryn-skald',
    name: 'Merryn Wave-Rider',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/merryn_illustration.png',
    thumbnail: '/assets/images/races/merryn_illustration.png'
  },
  {
    id: 'subrace-kessen-culture',
    name: 'Kessen Fate-Gambler',
    category: 'subraces',
    type: 'Subrace Art',
    url: '/assets/images/races/kessen_illustration.png',
    thumbnail: '/assets/images/races/kessen_illustration.png'
  },

  // --- Classes & Disciplines ---
  {
    id: 'class-arcanoneer',
    name: 'Arcanoneer Spell-Engineer',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/arcanoneer_illustration.png',
    thumbnail: '/assets/images/classes/arcanoneer_illustration.png'
  },
  {
    id: 'class-berserker',
    name: 'Berserker Blood-Rager',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/berserker_illustration.png',
    thumbnail: '/assets/images/classes/berserker_illustration.png'
  },
  {
    id: 'class-chronarch',
    name: 'Chronarch Time-Weaver',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/chronarch_illustration_2.png',
    thumbnail: '/assets/images/classes/chronarch_illustration_2.png'
  },
  {
    id: 'class-deathcaller',
    name: 'Deathcaller Necromancer',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/deathcaller_illustration.png',
    thumbnail: '/assets/images/classes/deathcaller_illustration.png'
  },
  {
    id: 'class-exorcist',
    name: 'Exorcist Spirit-Binder',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/exorcist_illustration.png',
    thumbnail: '/assets/images/classes/exorcist_illustration.png'
  },
  {
    id: 'class-false-prophet',
    name: 'False Prophet Void-Cultist',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/false_prophet_illustration_2.png',
    thumbnail: '/assets/images/classes/false_prophet_illustration_2.png'
  },
  {
    id: 'class-gambit',
    name: 'Gambit Fate-Player',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/gambit_illustration_2.png',
    thumbnail: '/assets/images/classes/gambit_illustration_2.png'
  },
  {
    id: 'class-harbinger',
    name: 'Harbinger Herald',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/harbinger_illustration.png',
    thumbnail: '/assets/images/classes/harbinger_illustration.png'
  },
  {
    id: 'class-inscriptor',
    name: 'Inscriptor Rune-Master',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/inscriptor_illustration.png',
    thumbnail: '/assets/images/classes/inscriptor_illustration.png'
  },
  {
    id: 'class-lunarch',
    name: 'Lunarch Moon-Priest',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/lunarch_illustration.png',
    thumbnail: '/assets/images/classes/lunarch_illustration.png'
  },
  {
    id: 'class-martyr',
    name: 'Martyr Divine-Vessel',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/martyr_illustration.png',
    thumbnail: '/assets/images/classes/martyr_illustration.png'
  },
  {
    id: 'class-minstrel',
    name: 'Minstrel Skald-Singer',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/minstrel_illustration.png',
    thumbnail: '/assets/images/classes/minstrel_illustration.png'
  },
  {
    id: 'class-plaguebringer',
    name: 'Plaguebringer Alchemist',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/plaguebringer_illustration_2.png',
    thumbnail: '/assets/images/classes/plaguebringer_illustration_2.png'
  },
  {
    id: 'class-primalist',
    name: 'Primalist Shaman',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/primalist_illustration.png',
    thumbnail: '/assets/images/classes/primalist_illustration.png'
  },
  {
    id: 'class-revenant',
    name: 'Revenant Death-Knight',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/revenant_illustration.png',
    thumbnail: '/assets/images/classes/revenant_illustration.png'
  },
  {
    id: 'class-shaper',
    name: 'Shaper Flesh-Sculptor',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/shaper_illustration.png',
    thumbnail: '/assets/images/classes/shaper_illustration.png'
  },
  {
    id: 'class-spellguard',
    name: 'Spellguard Ward-Knight',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/spellguard_illustration.png',
    thumbnail: '/assets/images/classes/spellguard_illustration.png'
  },
  {
    id: 'class-toxicologist',
    name: 'Toxicologist Venom-Brewer',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/toxicologist_illustration.png',
    thumbnail: '/assets/images/classes/toxicologist_illustration.png'
  },
  {
    id: 'class-bladedancer',
    name: 'Bladedancer Dualist',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/bladedancer_illustration.png',
    thumbnail: '/assets/images/classes/bladedancer_illustration.png'
  },
  {
    id: 'class-animist',
    name: 'Animist Spirit-Shifter',
    category: 'classes',
    type: 'Class Art',
    url: '/assets/images/classes/animist_illustration.png',
    thumbnail: '/assets/images/classes/animist_illustration.png'
  }
];

const ALIGNMENT_OPTIONS = [
  { value: 'full', label: 'Full Width Banner', icon: 'fa-arrows-left-right', desc: 'Spans across page columns' },
  { value: 'column', label: 'Column Fit', icon: 'fa-table-columns', desc: 'Fits neatly inside the current column' },
  { value: 'float-left', label: 'Float Left', icon: 'fa-align-left', desc: 'Text wraps around right side' },
  { value: 'float-right', label: 'Float Right', icon: 'fa-align-right', desc: 'Text wraps around left side' },
  { value: 'half-page', label: 'Half Page Art', icon: 'fa-square', desc: 'Centered medium artistic plate' }
];

const FRAME_OPTIONS = [
  { value: 'gold-frame', label: 'Ornate Gold Frame' },
  { value: 'parchment-border', label: 'Parchment Inset' },
  { value: 'shadow', label: 'Subtle Shadow' },
  { value: 'borderless', label: 'Borderless Clean' }
];

const SIZE_PRESETS = [
  { value: 'small', label: 'Small (35%)', width: '35%' },
  { value: 'medium', label: 'Medium (60%)', width: '60%' },
  { value: 'large', label: 'Large (85%)', width: '85%' },
  { value: 'full', label: 'Full Width (100%)', width: '100%' }
];

const BookImagePickerModal = ({
  isOpen,
  onClose,
  initialData = {},
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'upload' | 'url'
  const [artCategory, setArtCategory] = useState('all'); // 'all' | 'races' | 'subraces' | 'classes'
  const [searchQuery, setSearchQuery] = useState('');
  const [url, setUrl] = useState(initialData.url || '/assets/images/races/solari_illustration.png');
  const [caption, setCaption] = useState(initialData.caption || '');
  const [alignment, setAlignment] = useState(initialData.alignment || 'full');
  const [frame, setFrame] = useState(initialData.frame || 'gold-frame');
  const [sizePreset, setSizePreset] = useState(initialData.sizePreset || 'full');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const user = useAuthStore((s) => s.user);

  const filteredArtPresets = React.useMemo(() => {
    return CHARACTER_ART_PRESETS.filter((item) => {
      const matchesCategory = artCategory === 'all' || item.category === artCategory;
      const matchesSearch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [artCategory, searchQuery]);

  if (!isOpen) return null;

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    try {
      const currentUserId = user?.uid || (user?.isGuest ? 'guest' : 'local-author');
      const result = await uploadAsset(currentUserId, file, 'book-images', { profile: 'SOURCEBOOK_ART' });
      if (result?.success && result?.url) {
        setUrl(result.url);
      }
    } catch (err) {
      console.warn('Could not upload to cloud storage, using local preview image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (!url) return;
    onSave({
      url,
      caption,
      alignment,
      frame,
      sizePreset
    });
    onClose();
  };

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-image-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <i className="fas fa-palette"></i>
            <h3>Configure Sourcebook Illustration</h3>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="image-picker-content">
          <div className="picker-left-pane">
            {/* Source Selection Tabs */}
            <div className="source-tab-strip">
              <button
                type="button"
                className={`source-tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
                onClick={() => setActiveTab('presets')}
              >
                <i className="fas fa-users-viewfinder"></i>
                <span>Character &amp; Race Art</span>
              </button>
              <button
                type="button"
                className={`source-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <i className="fas fa-cloud-arrow-up"></i>
                <span>Upload Custom Art</span>
              </button>
              <button
                type="button"
                className={`source-tab-btn ${activeTab === 'url' ? 'active' : ''}`}
                onClick={() => setActiveTab('url')}
              >
                <i className="fas fa-link"></i>
                <span>Web URL</span>
              </button>
            </div>

            {/* Tab: Character & Race Art Gallery */}
            {activeTab === 'presets' && (
              <div className="character-art-gallery-pane">
                {/* Category Filter Pills & Search */}
                <div className="art-filter-bar">
                  <div className="art-sub-tabs">
                    <button
                      type="button"
                      className={`art-chip ${artCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setArtCategory('all')}
                    >
                      All ({CHARACTER_ART_PRESETS.length})
                    </button>
                    <button
                      type="button"
                      className={`art-chip ${artCategory === 'races' ? 'active' : ''}`}
                      onClick={() => setArtCategory('races')}
                    >
                      Races
                    </button>
                    <button
                      type="button"
                      className={`art-chip ${artCategory === 'subraces' ? 'active' : ''}`}
                      onClick={() => setArtCategory('subraces')}
                    >
                      Subraces
                    </button>
                    <button
                      type="button"
                      className={`art-chip ${artCategory === 'classes' ? 'active' : ''}`}
                      onClick={() => setArtCategory('classes')}
                    >
                      Classes
                    </button>
                  </div>
                  <div className="art-search-input-wrap">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Search illustration..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="atlas-cards-grid">
                  {filteredArtPresets.map((art) => (
                    <div
                      key={art.id}
                      className={`atlas-card-item ${url === art.url ? 'selected' : ''}`}
                      onClick={() => {
                        setUrl(art.url);
                        if (!caption) setCaption(art.name);
                      }}
                    >
                      <div className="atlas-card-thumb">
                        <img
                          src={art.thumbnail}
                          alt={art.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            if (parent && !parent.querySelector('.thumb-fallback-icon')) {
                              const icon = document.createElement('i');
                              icon.className = 'fas fa-image thumb-fallback-icon';
                              parent.appendChild(icon);
                            }
                          }}
                        />
                        <span className="map-badge">{art.type}</span>
                      </div>
                      <span className="atlas-card-label" title={art.name}>{art.name}</span>
                    </div>
                  ))}
                  {filteredArtPresets.length === 0 && (
                    <div className="art-empty-msg">No character illustrations match your search.</div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Upload */}
            {activeTab === 'upload' && (
              <div
                className={`upload-dropzone ${dragActive ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                />
                <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'}`}></i>
                <h4>{isUploading ? 'Processing Image...' : 'Click or Drag & Drop Image File'}</h4>
                <p>Supports PNG, JPG, WebP up to 10MB</p>
              </div>
            )}

            {/* Tab: Web URL */}
            {activeTab === 'url' && (
              <div className="url-input-pane">
                <label>Direct Image URL:</label>
                <div className="url-field-wrap">
                  <i className="fas fa-globe"></i>
                  <input
                    type="url"
                    value={url}
                    placeholder="https://example.com/map.jpg or /assets/..."
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Layout, Sizing & Alignment */}
            <div className="image-options-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Layout & Text Flow:</label>
                  <div className="alignment-button-group">
                    {ALIGNMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`align-btn ${alignment === opt.value ? 'active' : ''}`}
                        title={`${opt.label}: ${opt.desc}`}
                        onClick={() => setAlignment(opt.value)}
                      >
                        <i className={`fas ${opt.icon}`}></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row form-grid-2">
                <div className="form-group">
                  <label>Sizing Scale:</label>
                  <select
                    value={sizePreset}
                    onChange={(e) => setSizePreset(e.target.value)}
                    className="modal-select"
                  >
                    {SIZE_PRESETS.map((sz) => (
                      <option key={sz.value} value={sz.value}>{sz.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Frame & Border:</label>
                  <select
                    value={frame}
                    onChange={(e) => setFrame(e.target.value)}
                    className="modal-select"
                  >
                    {FRAME_OPTIONS.map((fr) => (
                      <option key={fr.value} value={fr.value}>{fr.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Illustration Caption / Citation:</label>
                <input
                  type="text"
                  value={caption}
                  placeholder="e.g. Map of the Frostwood Reach • Cartography by Scribe-Sentinels"
                  onChange={(e) => setCaption(e.target.value)}
                  className="modal-input"
                />
              </div>
            </div>
          </div>

          {/* Right Preview Pane */}
          <div className="picker-right-preview">
            <div className="preview-heading">
              <i className="fas fa-eye"></i>
              <span>Live Page Preview</span>
            </div>
            <div className="preview-parchment-box">
              <div className={`preview-img-frame frame-${frame} align-${alignment} size-${sizePreset}`}>
                {url ? (
                  <img src={url} alt={caption || 'Preview'} className="preview-img-tag" />
                ) : (
                  <div className="preview-placeholder">
                    <i className="fas fa-image"></i>
                    <span>No image selected</span>
                  </div>
                )}
                {caption && (
                  <div className="preview-caption-text">
                    <em>{caption}</em>
                  </div>
                )}
              </div>
              <div className="preview-mock-text">
                <p>Across the icy plains of Nordhalla, ancient forces slumber beneath the permafrost. The Scribe-Sentinels maintain their silent vigil over the frozen records...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-confirm" onClick={handleConfirm}>
            <i className="fas fa-check"></i> Apply to Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookImagePickerModal;
