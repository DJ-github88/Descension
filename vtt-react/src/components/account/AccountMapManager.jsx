import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import subscriptionService, { isCustomMapsTier } from '../../services/subscriptionService';
import { useMediaUpload } from '../../hooks/useMediaUpload';
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
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const [selectedRealmId, setSelectedRealmId] = useState(null);
  const [selectedSubregionId, setSelectedSubregionId] = useState(null);

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

  // Map image uploads → Firebase Storage for auth users (base64 fallback for guests)
  const { uploadImage, removeImage } = useMediaUpload();

  const handleImageFileChange = (e) => {
    if (!isEligible) {
      showToast('Custom Maps require the Archmage (Ultimate) tier.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImageFile(file);
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

    try {
      // Authenticated users: store the image in Firebase Storage and keep
      // only the download URL in the map record. Guests keep a base64 URL.
      let mapImage = imagePreview;
      if (imageFile) {
        try {
          const uploaded = await uploadImage(imageFile, 'maps');
          if (uploaded) mapImage = uploaded;
        } catch (err) {
          console.error('Map image upload failed:', err);
          showToast(err.message || 'Map image upload failed. Please try a smaller file.');
          return;
        }
      }

      const mapData = {
        id: `custom-${Date.now()}`,
        name: mapName.trim(),
        regionId: parentRegion,
        mapType,
        image: mapImage,
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
        setImageFile(null);
        setFileName('');
        setMapDescription('');
        setCustomMaps(getCustomMaps());
        setWorldScope('custom');
      } else {
        showToast('Failed to save custom map.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (mapId, mapTitle) => {
    if (!isEligible) {
      showToast('Custom Maps require the Archmage (Ultimate) tier.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete custom map "${mapTitle}"?`)) {
      const deleted = await deleteCustomMap(mapId);
      if (deleted) {
        // Clean up the cloud-stored image, if any
        const removedImage = customMaps[mapId]?.image;
        if (removedImage) {
          removeImage(removedImage).catch((err) => console.warn('Failed to remove cloud map image:', err));
        }
        showToast(`Deleted "${mapTitle}"`);
        setCustomMaps(getCustomMaps());
      }
    }
  };

  const allCustomMapList = isEligible ? Object.values(customMaps) : [];
  
  // Filter top-level Canonical Realms (parentMapId === 'mythril' or undefined top-level)
  const canonicalRealms = Object.values(BUILTIN_SUBREGION_MAPS).filter(
    (m) => !m.parentMapId || m.parentMapId === 'mythril'
  );

  const selectedRealm = selectedRealmId ? BUILTIN_SUBREGION_MAPS[selectedRealmId] : null;

  // Subregions for the currently selected realm
  const realmSubregions = selectedRealm?.subregions || [];

  // Child custom maps linked to the currently selected realm
  const realmChildCustomMaps = allCustomMapList.filter(
    (cm) => cm.regionId === selectedRealmId
  );

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
              onClick={() => {
                setWorldScope('mythril');
                setSelectedRealmId(null);
              }}
            >
              <i className="fas fa-gem"></i>
              <span>Canonical World: Mythrill</span>
              <span className="scope-count-badge">{canonicalRealms.length} Realms</span>
            </button>

            <button
              type="button"
              className={`scope-pill-btn ${worldScope === 'custom' ? 'active' : ''}`}
              onClick={() => {
                setWorldScope('custom');
                setSelectedRealmId(null);
              }}
            >
              <i className="fas fa-draw-polygon"></i>
              <span>Custom Worlds & Maps</span>
              <span className="scope-count-badge">{allCustomMapList.length}</span>
            </button>

            <button
              type="button"
              className={`scope-pill-btn ${worldScope === 'all' ? 'active' : ''}`}
              onClick={() => {
                setWorldScope('all');
                setSelectedRealmId(null);
              }}
            >
              <i className="fas fa-compass"></i>
              <span>All Atlas Maps</span>
              <span className="scope-count-badge">{canonicalRealms.length + allCustomMapList.length}</span>
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
            <h3><i className="fas fa-file-arrow-up"></i> Upload & Register New Regional Submap</h3>
          </div>

          <form onSubmit={handleSaveCustomMap} className="map-upload-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Map / Settlement Title</label>
                <input
                  type="text"
                  placeholder="e.g. Skaldfjord Haven or Sunken Citadel"
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label>Associated Parent Realm / Region</label>
                <select
                  value={parentRegion}
                  onChange={(e) => setParentRegion(e.target.value)}
                >
                  <option value="nordhalla">Nordhalla</option>
                  <option value="frostwood-reach">Frostwood Reach</option>
                  <option value="sundale">Sundale</option>
                  <option value="iceheart-sea">Iceheart Sea</option>
                  <option value="cragjaw-peaks">Cragjaw Peaks</option>
                  <option value="sundrift-vale">Sundrift Vale</option>
                  <option value="bryngloom-forest">Bryngloom Forest</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Map Classification</label>
                <select
                  value={mapType}
                  onChange={(e) => setMapType(e.target.value)}
                >
                  <option value="town">City / Town / Settlement</option>
                  <option value="subregion">Subregion / Valley Map</option>
                  <option value="dungeon">Dungeon / Keep / Interior</option>
                  <option value="poi">Field / Encounter Map</option>
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
                <i className="fas fa-plus-circle"></i> Save Submap to Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Breadcrumbs for Realm Folder Navigation */}
      {selectedRealmId && selectedRealm && (
        <div className="realm-breadcrumbs-bar">
          <button
            type="button"
            className="btn-back-breadcrumb"
            onClick={() => setSelectedRealmId(null)}
          >
            <i className="fas fa-arrow-left"></i> All Realms
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">
            <i className="fas fa-folder-open"></i> {selectedRealm.name}
          </span>
        </div>
      )}

      {/* Main Hierarchical Content Section */}
      <div className="account-map-sections">
        {/* =========================================================================
            TIER 2: SUBREGIONS & CHILD MAPS FOLDER VIEW (WHEN A REALM IS SELECTED)
            ========================================================================= */}
        {selectedRealmId && selectedRealm ? (
          <div className="realm-folder-view animate-fade-in">
            {/* Realm Overview Banner */}
            <div className="realm-banner-card">
              <div className="realm-banner-media">
                <img
                  src={selectedRealm.image || CANONICAL_REALM_IMAGES[selectedRealm.id] || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`}
                  alt={selectedRealm.name}
                />
                <div className="banner-overlay" />
                <div className="banner-title-block">
                  <span className="banner-badge">
                    <i className="fas fa-crown"></i> Canonical Realm Folder
                  </span>
                  <h3>{selectedRealm.name}</h3>
                  <p>{selectedRealm.description}</p>
                </div>
              </div>

              <div className="realm-banner-actions">
                <button
                  className="btn-enter-realm-map"
                  onClick={() => navigate(`/worldmap/${selectedRealm.id}`)}
                >
                  <i className="fas fa-compass"></i> Enter {selectedRealm.name} Canvas
                </button>
                {isEligible && (
                  <button
                    className="btn-add-realm-submap"
                    onClick={() => {
                      setParentRegion(selectedRealm.id);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                  >
                    <i className="fas fa-plus"></i> Add Submap to this Realm
                  </button>
                )}
              </div>
            </div>

            {/* Subregions Grid */}
            <div className="folder-subregions-section">
              <div className="section-header-bar">
                <h3 className="section-title">
                  <i className="fas fa-folder-tree"></i> Subregions of {selectedRealm.name}
                </h3>
                <span className="section-count-pill">{realmSubregions.length} Subregions</span>
              </div>

              {realmSubregions.length > 0 ? (
                <div className="subregions-folder-grid">
                  {realmSubregions.map((sub) => {
                    const leafMap = BUILTIN_SUBREGION_MAPS[sub.id];
                    const hasDrawnMap = Boolean(leafMap?.image || (sub.id === 'nordhalla-glacier-heart'));
                    const subThumb = leafMap?.image || CANONICAL_REALM_IMAGES[sub.id] || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/nordhalla.jpeg`;

                    return (
                      <div key={sub.id} className="subregion-folder-card">
                        <div className="subregion-thumb-wrap">
                          <img src={subThumb} alt={sub.name} />
                          <div className="subregion-status-badge">
                            {hasDrawnMap ? (
                              <span className="status-drawn"><i className="fas fa-map"></i> 4K Map Drawn</span>
                            ) : (
                              <span className="status-vector"><i className="fas fa-draw-polygon"></i> Boundary Vector</span>
                            )}
                          </div>
                        </div>

                        <div className="subregion-body">
                          <h4>{sub.name}</h4>
                          <p className="subregion-meta">
                            {hasDrawnMap
                              ? 'Dedicated regional map available to explore.'
                              : 'Subregion territory mapped on the continental layer.'}
                          </p>

                          <div className="subregion-card-actions">
                            <button
                              className="btn-open-subregion"
                              onClick={() => navigate(`/worldmap/${sub.id}`)}
                            >
                              <i className="fas fa-location-arrow"></i> Explore Subregion
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-subregions-msg">
                  <i className="fas fa-mountain"></i>
                  <p>No subregions cataloged yet for this realm. Cartographers are surveying the territory.</p>
                </div>
              )}
            </div>

            {/* Child Submaps (Towns, Dungeons, Keeps) attached to this Realm */}
            {realmChildCustomMaps.length > 0 && (
              <div className="child-maps-section">
                <div className="section-header-bar">
                  <h3 className="section-title">
                    <i className="fas fa-city"></i> Towns, Keeps & Dungeons in {selectedRealm.name}
                  </h3>
                  <span className="section-count-pill">{realmChildCustomMaps.length} Child Maps</span>
                </div>

                <div className="maps-grid">
                  {realmChildCustomMaps.map((map) => (
                    <div key={map.id} className="map-card custom-card">
                      <div className="map-card-thumb">
                        <img src={map.image} alt={map.name} className="map-thumb-bg" />
                        <div className="map-thumb-overlay" />
                        <div className="map-thumb-badges">
                          <span className="map-type-badge custom">
                            <i className="fas fa-landmark"></i> {map.mapType || 'Submap'}
                          </span>
                        </div>
                      </div>

                      <div className="map-card-body">
                        <div className="map-header-block">
                          <h4>{map.name}</h4>
                          <span className="map-region-tag">{selectedRealm.name}</span>
                        </div>
                        <p className="map-desc">{map.description}</p>
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
                            title="Delete submap"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
              TIER 1: TOP-LEVEL REALMS LIST (CLEAN FOLDERS INSTEAD OF 44-CARD SPAM)
              ========================================================================= */
          <>
            <div className="section-header-bar">
              <h3 className="section-title">
                <i className="fas fa-compass"></i>
                {worldScope === 'mythril' ? 'Canonical Realms of Mythrill' : worldScope === 'custom' ? 'Custom Worlds & Regional Maps' : 'All World Atlas Maps'}
              </h3>
              <span className="section-count-pill">
                {worldScope === 'mythril' ? canonicalRealms.length : worldScope === 'custom' ? allCustomMapList.length : canonicalRealms.length + allCustomMapList.length} Realms
              </span>
            </div>

            <div className="maps-grid">
              {/* World Master Map Card (Always first when Mythrill is selected) */}
              {worldScope !== 'custom' && (
                <div className="map-card world-master-card">
                  <div className="map-card-thumb">
                    <img src={`${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`} alt="Mythril World Map" className="map-thumb-bg" />
                    <div className="map-thumb-overlay" />
                    <div className="map-thumb-badges">
                      <span className="map-type-badge master">
                        <i className="fas fa-globe"></i> World Master Map
                      </span>
                      <span className="map-subregion-count-badge">8K Master Layer</span>
                    </div>
                    <div className="map-thumb-crest">
                      <i className="fas fa-gem"></i>
                    </div>
                  </div>

                  <div className="map-card-body">
                    <div className="map-header-block">
                      <h4>Mythrill - World of Five Continents</h4>
                      <span className="map-region-tag">Global Master Layer</span>
                    </div>
                    <p className="map-desc">
                      The primary 8K planetary map of Mythrill. Navigate continents, view geopolitical borders, and travel across realms.
                    </p>
                    <div className="map-card-footer">
                      <button
                        className="btn-inspect-map master-btn"
                        onClick={() => navigate('/worldmap')}
                      >
                        <i className="fas fa-compass"></i> Enter World Map
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Canonical Realm Cards (Folders) */}
              {worldScope !== 'custom' &&
                canonicalRealms.map((map) => {
                  const bgImage = CANONICAL_REALM_IMAGES[map.id] || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/nordhalla.jpeg`;
                  const subregionCount = map.subregions?.length || 0;
                  const hasDedicatedArt = Boolean(map.image || map.id === 'nordhalla');

                  return (
                    <div key={map.id} className="map-card builtin-card realm-folder-card">
                      <div className="map-card-thumb">
                        <img src={bgImage} alt={map.name} className="map-thumb-bg" />
                        <div className="map-thumb-overlay" />
                        <div className="map-thumb-badges">
                          <span className="map-type-badge builtin">
                            <i className="fas fa-crown"></i> Canonical Realm
                          </span>
                          <span className="map-subregion-count-badge">
                            <i className="fas fa-folder"></i> {subregionCount} Subregions
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
                          <span className="meta-badge">
                            <i className={`fas ${hasDedicatedArt ? 'fa-palette' : 'fa-vector-square'}`}></i>
                            {hasDedicatedArt ? 'Detailed Map Drawn' : 'Vector Bounds'}
                          </span>
                          <span className="meta-badge">
                            <i className="fas fa-layer-group"></i> {subregionCount} Sub-territories
                          </span>
                        </div>

                        <div className="map-card-footer dual-actions">
                          <button
                            className="btn-open-folder"
                            onClick={() => setSelectedRealmId(map.id)}
                            title="Open subregions folder for this realm"
                          >
                            <i className="fas fa-folder-open"></i> Subregions ({subregionCount})
                          </button>
                          <button
                            className="btn-inspect-map secondary"
                            onClick={() => navigate(`/worldmap/${map.id}`)}
                            title="Launch map canvas directly"
                          >
                            <i className="fas fa-location-arrow"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* User Custom maps */}
              {worldScope !== 'mythril' &&
                allCustomMapList.map((map) => {
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
          </>
        )}
      </div>
    </div>
  );
};

export default AccountMapManager;
