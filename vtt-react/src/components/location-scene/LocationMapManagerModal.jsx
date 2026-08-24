import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const MAP_PRESETS = [
  {
    name: 'Mythrill',
    type: 'world',
    url: '/assets/images/backgrounds/Mythril.jpeg'
  },
  {
    name: 'Ironjaw Port Harbor',
    type: 'settlement',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=80'
  },
  {
    name: 'Cinderbloom Ancient Grove',
    type: 'scene',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=2400&q=80'
  },
  {
    name: "Heathen's Mountain Gate",
    type: 'dungeon',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=80'
  },
  {
    name: 'Gilded Citadel Throne',
    type: 'interior',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=2400&q=80'
  }
];

const LocationMapManagerModal = ({
  map,
  maps = [],
  isCreatingNew = false,
  onSave,
  onDelete,
  onClose
}) => {
  const [name, setName] = useState(isCreatingNew ? '' : (map?.name || ''));
  const [type, setType] = useState(isCreatingNew ? 'scene' : (map?.type || 'region'));
  const [imageUrl, setImageUrl] = useState(isCreatingNew ? '' : (map?.imageUrl || ''));
  const [parentMapId, setParentMapId] = useState(isCreatingNew ? (map?.id || '') : (map?.parentMapId || ''));
  const [description, setDescription] = useState(isCreatingNew ? '' : (map?.description || ''));
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setImageUrl(uploadEvent.target.result);
        setImagePreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset) => {
    setImageUrl(preset.url);
    if (!name.trim()) setName(preset.name);
    if (preset.type) setType(preset.type);
    setImagePreviewError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalImage = imageUrl.trim() || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`;

    onSave({
      ...(isCreatingNew ? {} : { id: map?.id }),
      name: name.trim(),
      type,
      imageUrl: finalImage,
      parentMapId: parentMapId || null,
      description: description.trim()
    });
  };

  const availableParentMaps = maps.filter(m => isCreatingNew || m.id !== map?.id);

  return ReactDOM.createPortal(
    <div className="location-pin-modal-backdrop" onClick={onClose}>
      <div className="location-pin-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="location-pin-modal-header">
            <div className="modal-header-identity">
              <div
                className="modal-pin-icon-box"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #d4af37 0%, #201306 100%)',
                  borderColor: '#8c6738'
                }}
              >
                <i className={`fas ${isCreatingNew ? 'fa-plus' : 'fa-map'}`}></i>
              </div>
              <div className="modal-pin-titles">
                <span className="modal-pin-type-tag">PATHFINDER CARTOGRAPHY SCENE DECK</span>
                <h3>{isCreatingNew ? 'Create New Location Scene / Region' : `Edit Region: ${map?.name || 'Scene'}`}</h3>
              </div>
            </div>
            <button type="button" className="modal-btn-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Body */}
          <div className="location-pin-modal-body" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
            {/* Title & Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#3d2614', marginBottom: '4px', fontWeight: 700 }}>
                  Location Scene Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ironjaw Port Entrance, Whispering Tavern..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#fdfaf0',
                    border: '1.5px solid #8c6738',
                    borderRadius: '6px',
                    color: '#2b1810',
                    fontSize: '14px',
                    fontFamily: 'Cinzel, Georgia, serif',
                    fontWeight: 700
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#3d2614', marginBottom: '4px', fontWeight: 700 }}>
                  Scene Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#fdfaf0',
                    border: '1.5px solid #8c6738',
                    borderRadius: '6px',
                    color: '#2b1810',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  <option value="world">World / Realm Map</option>
                  <option value="kingdom">Kingdom / Continent</option>
                  <option value="subregion">Province / Region</option>
                  <option value="settlement">City / Town Map</option>
                  <option value="scene">Location Vista / Scene</option>
                  <option value="interior">Interior / Building</option>
                  <option value="dungeon">Dungeon / Ruin</option>
                </select>
              </div>
            </div>

            {/* Image URL & File Upload */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#3d2614', marginBottom: '4px', fontWeight: 700 }}>
                Background Image URL or Local Artwork *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreviewError(false);
                  }}
                  placeholder="Paste direct image URL (e.g. https://... or /assets/images/...)"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#fdfaf0',
                    border: '1.5px solid #8c6738',
                    borderRadius: '6px',
                    color: '#2b1810',
                    fontSize: '13px'
                  }}
                />
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: 'linear-gradient(180deg, #fdfaf0 0%, #ede3d1 100%)',
                    border: '1.5px solid #8c6738',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#3b2410',
                    fontSize: '12px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}
                  title="Upload image from computer"
                >
                  <i className="fas fa-upload" /> Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#6d4c2b', marginBottom: '4px', fontWeight: 700 }}>
                Or Select Atmosphere Preset:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {MAP_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      padding: '4px 10px',
                      background: imageUrl === preset.url ? '#d4af37' : '#f8f4ec',
                      color: imageUrl === preset.url ? '#1a0f05' : '#3d2614',
                      border: '1px solid #8c6738',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="fas fa-image" /> {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Image Preview */}
            {imageUrl && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#6d4c2b', marginBottom: '4px', fontWeight: 700 }}>
                  Image Preview:
                </label>
                <div
                  style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1.5px solid #8c6738',
                    position: 'relative',
                    background: '#1a0f05'
                  }}
                >
                  {!imagePreviewError ? (
                    <img
                      src={imageUrl}
                      alt="Map Preview"
                      onError={() => setImagePreviewError(true)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#e74c3c', fontSize: '12px' }}>
                      <i className="fas fa-triangle-exclamation" style={{ marginRight: '6px' }} /> Unable to load image from URL. Check link or upload file.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Parent Region Select */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#3d2614', marginBottom: '4px', fontWeight: 700 }}>
                Parent Realm / Region (Optional)
              </label>
              <select
                value={parentMapId}
                onChange={(e) => setParentMapId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#fdfaf0',
                  border: '1.5px solid #8c6738',
                  borderRadius: '6px',
                  color: '#2b1810',
                  fontSize: '13px'
                }}
              >
                <option value="">(None — Top-Level Realm)</option>
                {availableParentMaps.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name} ({pm.type || 'region'})
                  </option>
                ))}
              </select>
            </div>

            {/* Narrative Lore & GM Description */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#3d2614', marginBottom: '4px', fontWeight: 700 }}>
                Atmosphere &amp; Narrative Lore
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what the party sees upon arriving: weather, architecture, folklore..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#fdfaf0',
                  border: '1.5px solid #8c6738',
                  borderRadius: '6px',
                  color: '#2b1810',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 18px',
              borderTop: '1.5px solid #8c6738',
              background: '#ede3d1',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px'
            }}
          >
            <div>
              {!isCreatingNew && onDelete && map?.id !== 'map-mythril-world' && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${map?.name}"? All pins on this scene will be removed.`)) {
                      onDelete(map.id);
                      onClose();
                    }
                  }}
                  style={{
                    background: '#fdf2f2',
                    border: '1.5px solid #c0392b',
                    color: '#96281b',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-trash-can" /> Delete Scene
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#f8f4ec',
                  border: '1.5px solid #8c6738',
                  color: '#3d2614',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(180deg, #d4af37 0%, #aa8022 100%)',
                  border: '1.5px solid #ffd700',
                  color: '#1a0f05',
                  borderRadius: '6px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
              >
                <i className={`fas ${isCreatingNew ? 'fa-plus' : 'fa-check'}`} /> {isCreatingNew ? 'Create & Enter Scene' : 'Save Scene Artwork'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default LocationMapManagerModal;
