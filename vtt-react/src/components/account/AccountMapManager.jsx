import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import subscriptionService from '../../services/subscriptionService';
import {
  BUILTIN_SUBREGION_MAPS,
  getCustomMaps,
  saveCustomMap,
  deleteCustomMap
} from '../../data/subregionMaps';
import { REGION_POLYGONS } from '../../data/regionPolygons';
import './styles/AccountMapManager.css';

const AccountMapManager = () => {
  const navigate = useNavigate();
  const { user, isDevelopmentBypass, isAdminBypass } = useAuthStore();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [customMaps, setCustomMaps] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

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
    subscriptionStatus?.tierKey === 'ULTIMATE' || 
    subscriptionStatus?.tierKey === 'DEV_PREVIEW';

  const handleImageFileChange = (e) => {
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
    } else {
      showToast('Failed to save custom map.');
    }
    setIsUploading(false);
  };

  const handleDelete = async (mapId, mapTitle) => {
    if (window.confirm(`Are you sure you want to delete custom map "${mapTitle}"?`)) {
      const deleted = await deleteCustomMap(mapId);
      if (deleted) {
        showToast(`Deleted "${mapTitle}"`);
        setCustomMaps(getCustomMaps());
      }
    }
  };

  const allCustomMapList = Object.values(customMaps);
  const builtinList = Object.values(BUILTIN_SUBREGION_MAPS);

  return (
    <div className="account-map-manager-container animate-fade-in">
      {toastMsg && (
        <div className="account-map-toast">
          <i className="fas fa-check-circle"></i> {toastMsg}
        </div>
      )}

      <div className="account-map-header">
        <div className="account-map-header-title">
          <h2><i className="fas fa-map-marked-alt"></i> World & Subregion Maps</h2>
          <p>Draw, upload, and link custom regional, dungeon, and town maps directly to Mythrill.</p>
        </div>

        <div className="account-map-tier-badge">
          <i className="fas fa-crown"></i>
          <span>{isEligible ? 'Ultimate Access Active' : 'Archmage Feature'}</span>
        </div>
      </div>

      {!isEligible && (
        <div className="account-map-upgrade-banner">
          <div className="banner-icon"><i className="fas fa-gem"></i></div>
          <div className="banner-content">
            <h3>Archmage Tier Feature: Custom Map Uploads & Subregion Cartography</h3>
            <p>
              Upgrade to the <strong>Archmage / Ultimate</strong> membership or sign in as Admin to upload custom high-resolution maps, draw subregion boundaries, and create multi-level dungeon & town transitions directly on the Mythrill World Map.
            </p>
          </div>
        </div>
      )}

      {isEligible && (
        <div className="account-map-upload-card">
          <div className="card-header">
            <h3><i className="fas fa-cloud-upload-alt"></i> Upload Custom Map to Account</h3>
          </div>

          <form onSubmit={handleSaveCustomMap} className="map-upload-form">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Map Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ironhold Citadel Deep Dungeons"
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label>Parent Region / Realm</label>
                <select
                  value={parentRegion}
                  onChange={(e) => setParentRegion(e.target.value)}
                >
                  {Object.values(REGION_POLYGONS).map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Map Category</label>
                <select value={mapType} onChange={(e) => setMapType(e.target.value)}>
                  <option value="subregion">Subregion / Province</option>
                  <option value="dungeon">Dungeon / Cavern</option>
                  <option value="town">City / Town Map</option>
                  <option value="tactical">Battlemap / POI</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description & Lore</label>
              <textarea
                rows="2"
                placeholder="Details about climate, factions, hazards, or lore for this subregion map..."
                value={mapDescription}
                onChange={(e) => setMapDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Map Image File</label>
              <div className="file-dropzone">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  id="custom-map-file-input"
                />
                <label htmlFor="custom-map-file-input" className="file-dropzone-label">
                  <i className="fas fa-image"></i>
                  <span>{fileName ? fileName : 'Choose Map File (JPG, PNG, WEBP)'}</span>
                </label>
              </div>
            </div>

            {imagePreview && (
              <div className="map-image-preview-box">
                <img src={imagePreview} alt="Preview" />
                <span className="preview-tag">Image Loaded</span>
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

      {/* Built-in & Custom Maps Display */}
      <div className="account-map-sections">
        <h3 className="section-title"><i className="fas fa-atlas"></i> Active Subregion & Regional Maps</h3>

        <div className="maps-grid">
          {/* Builtin list */}
          {builtinList.map((map) => (
            <div key={map.id} className="map-card builtin-card">
              <div className="map-card-thumb">
                <img src={map.image} alt={map.name} />
                <span className="map-type-badge builtin">Canonical</span>
              </div>
              <div className="map-card-body">
                <h4>{map.name}</h4>
                <p className="map-region">Region: {REGION_POLYGONS[map.regionId]?.name || map.regionId}</p>
                <p className="map-desc">{map.description}</p>
                <div className="map-card-footer">
                  <button
                    className="btn-inspect-map"
                    onClick={() => navigate('/', { state: { openMap: true, targetMapId: map.id } })}
                  >
                    <i className="fas fa-eye"></i> View on World Map
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* User Custom maps */}
          {allCustomMapList.map((map) => (
            <div key={map.id} className="map-card custom-card">
              <div className="map-card-thumb">
                <img src={map.image} alt={map.name} />
                <span className="map-type-badge custom">{map.mapType}</span>
              </div>
              <div className="map-card-body">
                <h4>{map.name}</h4>
                <p className="map-region">Region: {REGION_POLYGONS[map.regionId]?.name || map.regionId}</p>
                <p className="map-desc">{map.description}</p>
                <div className="map-card-footer">
                  <button
                    className="btn-inspect-map"
                    onClick={() => navigate('/', { state: { openMap: true, targetMapId: map.id } })}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountMapManager;
