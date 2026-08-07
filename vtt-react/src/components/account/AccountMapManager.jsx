import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import subscriptionService, { isCustomMapsTier } from '../../services/subscriptionService';
import {
  BUILTIN_SUBREGION_MAPS,
  getCustomMaps,
  saveCustomMap,
  deleteCustomMap
} from '../../data/subregionMaps';
import { REGION_POLYGONS } from '../../data/regionPolygons';
import './styles/AccountMapManager.css';

const CANONICAL_REALM_IMAGES = {
  'frostwood-reach': `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`,
  'nordhalla': `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/nordhalla.jpeg`,
  'sundale': `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`,
  'iceheart-sea': `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/rime-spire-peaks.jpg`,
  'cragjaw-peaks': `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/rime-spire-peaks.jpg`,
  'sundrift-vale': `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`
};

const AccountMapManager = () => {
  const navigate = useNavigate();
  const { user, isDevelopmentBypass, isAdminBypass } = useAuthStore();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [customMaps, setCustomMaps] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [worldScope, setWorldScope] = useState('mythril'); // 'mythril' | 'custom' | 'all'

  // Form State
  const [mapName, setMapName] = useState('');
  const [parentRegion, setParentRegion] = useState('nordhalla');
  const [mapType, setMapType] = useState('subregion');
  const [mapDescription, setMapDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const loadData = async () => {
    try {
      const status = await subscriptionService.getSubscriptionStatus(user?.uid);
      setSubscriptionStatus(status);
      setCustomMaps(getCustomMaps());
    } catch (err) {
      console.error('Error loading map manager data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const isEligible = 
    isDevelopmentBypass || 
    isAdminBypass || 
    isCustomMapsTier(subscriptionStatus?.tierKey);

  const handleImageFileChange = (e) => {
    if (!isEligible) {
      showToast('Custom Maps require the Archmage (Ultimate) tier.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomMap = async (e) => {
    e.preventDefault();
    if (!isEligible) {
      showToast('Custom Maps require the Archmage (Ultimate) tier.');
      return;
    }
    if (!mapName.trim() || !imagePreview) {
      showToast('Please provide a map name and image file.');
      return;
    }

    setIsUploading(true);

    const mapData = {
      id: `custom-${Date.now()}`,
      name: mapName.trim(),
      regionId: parentRegion,
      mapType,
      image: imagePreview,
      description: mapDescription.trim() || `${mapName} custom ${mapType} map`,
      width: 4096,
      height: 3072,
      subregions: []
    };

    const saved = await saveCustomMap(mapData);
    if (saved) {
      showToast(`Successfully saved map "${saved.name}" to your account!`);
      setMapName('');
      setImagePreview(null);
      setFileName('');
      setMapDescription('');
      setCustomMaps(getCustomMaps());
      setWorldScope('custom');
    } else {
      showToast('Failed to save custom map.');
    }
    setIsUploading(false);
  };

  const handleDelete = async (mapId, mapTitle) => {
    if (!isEligible) {
      showToast('Custom Maps require the Archmage (Ultimate) tier.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete custom map "${mapTitle}"?`)) {
      const deleted = await deleteCustomMap(mapId);
      if (deleted) {
        showToast(`Deleted "${mapTitle}"`);
        setCustomMaps(getCustomMaps());
      }
    }
  };

  const allCustomMapList = isEligible ? Object.values(customMaps) : [];
  const builtinList = Object.values(BUILTIN_SUBREGION_MAPS);

  const displayedBuiltins = worldScope === 'custom' ? [] : builtinList;
  const displayedCustoms = worldScope === 'mythril' ? [] : allCustomMapList;

  return (
    <div className="account-map-manager-container animate-fade-in">
      {toastMsg && (
        <div className="account-map-toast">
          <i className="fas fa-check-circle"></i> {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="account-map-header">
        <div className="account-map-header-title">
          <h2><i className="fas fa-atlas"></i> World Maps & Regional Cartography</h2>
          <p>Explore canonical continents or craft and link custom worlds, regional maps, dungeons, and keeps.</p>
        </div>

        <div className="account-map-tier-badge">
          <i className="fas fa-crown"></i>
          <span>{isEligible ? 'Archmage Cartography Active' : 'Archmage Feature'}</span>
        </div>
      </div>

      {/* World Scope Switcher Tab Bar */}
      <div className="world-scope-switcher-card">
        <div className="scope-switcher-header">
          <span className="scope-label"><i className="fas fa-globe"></i> Select World View:</span>
          <div className="scope-pill-group">
            <button
              type="button"
              className={`scope-pill-btn ${worldScope === 'mythril' ? 'active' : ''}`}
              onClick={() => setWorldScope('mythril')}
            >
              <i className="fas fa-gem"></i>
              <span>Canonical World: Mythrill</span>
              <span className="scope-count-badge">{builtinList.length} Realms</span>
            </button>

            <button
              type="button"
              className={`scope-pill-btn ${worldScope === 'custom' ? 'active' : ''}`}
              onClick={() => setWorldScope('custom')}
            >
              <i className="fas fa-draw-polygon"></i>
              <span>Custom Worlds & Maps</span>
              <span className="scope-count-badge">{allCustomMapList.length}</span>
            </button>

            <button
              type="button"
              className={`scope-pill-btn ${worldScope === 'all' ? 'active' : ''}`}
              onClick={() => setWorldScope('all')}
            >
              <i className="fas fa-compass"></i>
              <span>All Atlas Maps</span>
              <span className="scope-count-badge">{builtinList.length + allCustomMapList.length}</span>
            </button>
          </div>
        </div>
      </div>

      {!isEligible && (
        <div className="account-map-upgrade-banner">
          <div className="banner-icon"><i className="fas fa-crown"></i></div>
          <div className="banner-content">
            <h3>Archmage Tier Feature: Custom Map Uploads & Subregion Cartography</h3>
            <p>
              Upgrade to the <strong>Archmage (Ultimate)</strong> tier to upload custom artwork, draw region boundaries,
              and connect multiple map layers to your campaign.
            </p>
          </div>
        </div>
      )}

      {/* Upload Custom Map Form Card (Eligible Only) */}
      {isEligible && (
        <div className="account-map-upload-card">
          <div className="card-header">
            <h3><i className="fas fa-file-arrow-up"></i> Upload & Register New Regional Map</h3>
          </div>

          <form onSubmit={handleSaveCustomMap} className="map-upload-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Map / Realm Title</label>
                <input
                  type="text"
                  placeholder="e.g. Whispering Depths or Sunken Citadel"
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label>Associated Parent Region</label>
                <select
                  value={parentRegion}
                  onChange={(e) => setParentRegion(e.target.value)}
                >
                  <option value="nordhalla">Nordhalla (Pre-Binding)</option>
                  <option value="frostwood-reach">Frostwood Reach</option>
                  <option value="sundale">Sundale</option>
                  <option value="iceheart-sea">Iceheart Sea</option>
                  <option value="cragjaw-peaks">Cragjaw Peaks</option>
                  <option value="sundrift-vale">Sundrift Vale</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Map Classification</label>
                <select
                  value={mapType}
                  onChange={(e) => setMapType(e.target.value)}
                >
                  <option value="subregion">Subregion Map</option>
                  <option value="dungeon">Dungeon / Interior</option>
                  <option value="town">City / Settlement</option>
                  <option value="poi">Point of Interest</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Lore & Description</label>
              <textarea
                placeholder="Cartographer notes, hazards, regional rulers, ancient legends..."
                value={mapDescription}
                onChange={(e) => setMapDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Cartography Image Artwork (High Resolution PNG / JPG)</label>
              <div className="file-upload-zone">
                <input
                  type="file"
                  id="map-image-upload"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="map-image-upload" className="file-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{fileName ? fileName : 'Choose Cartography Artwork File...'}</span>
                </label>
              </div>
            </div>

            {imagePreview && (
              <div className="map-image-preview-box">
                <img src={imagePreview} alt="Map Preview" />
                <span className="preview-tag">Artwork Preview Ready</span>
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn-save-map"
                disabled={isUploading || !mapName.trim() || !imagePreview}
              >
                <i className="fas fa-plus-circle"></i> Save Map to Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Redesigned World & Regional Maps Grid */}
      <div className="account-map-sections">
        <div className="section-header-bar">
          <h3 className="section-title">
            <i className="fas fa-compass"></i>
            {worldScope === 'mythril' ? 'Canonical Realms of Mythrill' : worldScope === 'custom' ? 'Custom Worlds & Regional Maps' : 'All World Atlas Maps'}
          </h3>
          <span className="section-count-pill">{displayedBuiltins.length + displayedCustoms.length} Realms</span>
        </div>

        <div className="maps-grid">
          {/* Canonical Realms List */}
          {displayedBuiltins.map((map) => {
            const bgImage = CANONICAL_REALM_IMAGES[map.id] || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/nordhalla.jpeg`;
            const subregionCount = map.subregions?.length || 0;

            return (
              <div key={map.id} className="map-card builtin-card">
                <div className="map-card-thumb">
                  <img src={bgImage} alt={map.name} className="map-thumb-bg" />
                  <div className="map-thumb-overlay" />
                  <div className="map-thumb-badges">
                    <span className="map-type-badge builtin">
                      <i className="fas fa-crown"></i> Canonical Realm
                    </span>
                    <span className="map-subregion-count-badge">
                      <i className="fas fa-draw-polygon"></i> {subregionCount} Subregions
                    </span>
                  </div>
                  <div className="map-thumb-crest">
                    <i className="fas fa-compass"></i>
                  </div>
                </div>

                <div className="map-card-body">
                  <div className="map-header-block">
                    <h4>{map.name}</h4>
                    <span className="map-region-tag">
                      <i className="fas fa-mountain-sun"></i> {REGION_POLYGONS[map.regionId]?.name || map.regionId}
                    </span>
                  </div>

                  <p className="map-desc">{map.description}</p>

                  <div className="map-meta-strip">
                    <span className="meta-badge"><i className="fas fa-check-circle"></i> Geometry Documented</span>
                    <span className="meta-badge"><i className="fas fa-vector-square"></i> 4K Canvas</span>
                  </div>

                  <div className="map-card-footer">
                    <button
                      className="btn-inspect-map"
                      onClick={() => navigate(`/worldmap/${map.id}`)}
                    >
                      <i className="fas fa-compass"></i> Explore on World Map
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* User Custom maps */}
          {displayedCustoms.map((map) => {
            const customBg = map.image || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`;

            return (
              <div key={map.id} className="map-card custom-card">
                <div className="map-card-thumb">
                  <img src={customBg} alt={map.name} className="map-thumb-bg" />
                  <div className="map-thumb-overlay" />
                  <div className="map-thumb-badges">
                    <span className="map-type-badge custom">
                      <i className="fas fa-feather-pointed"></i> {map.mapType || 'Custom Map'}
                    </span>
                  </div>
                  <div className="map-thumb-crest">
                    <i className="fas fa-draw-polygon"></i>
                  </div>
                </div>

                <div className="map-card-body">
                  <div className="map-header-block">
                    <h4>{map.name}</h4>
                    <span className="map-region-tag">
                      <i className="fas fa-map-pin"></i> {REGION_POLYGONS[map.regionId]?.name || map.regionId}
                    </span>
                  </div>

                  <p className="map-desc">{map.description || 'Custom cartography and territory created with the Archmage Map Editor.'}</p>

                  <div className="map-card-footer">
                    <button
                      className="btn-inspect-map"
                      onClick={() => navigate(`/worldmap/${map.id}`)}
                    >
                      <i className="fas fa-drafting-compass"></i> Enter Map
                    </button>
                    <button
                      className="btn-delete-map"
                      onClick={() => handleDelete(map.id, map.name)}
                      title="Delete custom map"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {displayedBuiltins.length === 0 && displayedCustoms.length === 0 && (
          <div className="empty-maps-state">
            <i className="fas fa-map-location-dot"></i>
            <h4>No maps found in this world view</h4>
            <p>Upload a custom map above or switch to Canonical Mythrill to explore the established realms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountMapManager;
