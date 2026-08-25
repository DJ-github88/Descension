import React, { useState, useEffect, useMemo } from 'react';
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
import { showConfirm } from '../../utils/dialogService';
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

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'realms' | 'subregions' | 'custom'
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('mythrill_atlas_view_mode') || 'gallery');
  const [expandedRealmId, setExpandedRealmId] = useState(null);

  // Lightbox Preview Modal State
  const [previewMap, setPreviewMap] = useState(null);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('mythrill_atlas_view_mode', mode);
    } catch (_) {}
  };

  // Import Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [mapName, setMapName] = useState('');
  const [parentRegion, setParentRegion] = useState('nordhalla');
  const [mapType, setMapType] = useState('subregion');
  const [mapDescription, setMapDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
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
      let mapImage = imagePreview;
      if (imageFile) {
        try {
          const uploaded = await uploadImage(imageFile, 'maps');
          if (uploaded) mapImage = uploaded;
        } catch (err) {
          console.error('Map image upload failed:', err);
          showToast(err.message || 'Map image upload failed. Please try a smaller file.');
          setIsUploading(false);
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
        showToast(`Successfully registered map "${saved.name}"!`);
        setMapName('');
        setImagePreview(null);
        setImageFile(null);
        setFileName('');
        setMapDescription('');
        setCustomMaps(getCustomMaps());
        setIsUploadModalOpen(false);
      } else {
        showToast('Failed to save custom map. Check storage quota.');
      }
    } catch (err) {
      console.error('Save custom map error:', err);
      showToast('Error saving map. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (mapId, mapTitle) => {
    if (!isEligible) {
      showToast('Custom Maps require the Archmage (Ultimate) tier.');
      return;
    }
    const confirmed = await showConfirm({
      title: 'Delete Custom Map',
      message: `Are you sure you want to delete custom map "${mapTitle}"?`,
      subMessage: 'This will permanently remove the map file and its data.',
      confirmText: 'Delete Map',
      isDestructive: true
    });
    if (confirmed) {
      const deleted = await deleteCustomMap(mapId);
      if (deleted) {
        const removedImage = customMaps[mapId]?.image;
        if (removedImage) {
          removeImage(removedImage).catch((err) => console.warn('Failed to remove cloud map image:', err));
        }
        showToast(`Deleted "${mapTitle}"`);
        setCustomMaps(getCustomMaps());
        if (previewMap?.id === mapId) setPreviewMap(null);
      }
    }
  };

  const allCustomMapList = isEligible ? Object.values(customMaps) : [];
  
  const canonicalRealms = Object.values(BUILTIN_SUBREGION_MAPS).filter(
    (m) => !m.parentMapId || m.parentMapId === 'mythril'
  );

  // Filtered lists based on search and category
  const filteredRealms = useMemo(() => {
    if (categoryFilter === 'custom') return [];
    let list = canonicalRealms;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) => 
          r.name.toLowerCase().includes(q) || 
          r.description?.toLowerCase().includes(q) || 
          r.subregions?.some((s) => s.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [canonicalRealms, searchQuery, categoryFilter]);

  const filteredCustomMaps = useMemo(() => {
    if (categoryFilter === 'realms') return [];
    let list = allCustomMapList;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) => 
          m.name.toLowerCase().includes(q) || 
          m.description?.toLowerCase().includes(q) || 
          m.regionId?.toLowerCase().includes(q) || 
          m.mapType?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allCustomMapList, searchQuery, categoryFilter]);

  return (
    <div className="account-map-manager-container animate-fade-in">
      {toastMsg && (
        <div className="account-map-toast">
          <i className="fas fa-check-circle"></i> {toastMsg}
        </div>
      )}

      {/* ── Cartography Master Header ───────────────────────── */}
      <div className="atlas-master-header">
        <div className="atlas-header-left">
          <div className="atlas-header-title-row">
            <i className="fas fa-compass atlas-compass-icon"></i>
            <div>
              <h2 className="atlas-main-title">The Mythrill Atlas &amp; Cartography Studio</h2>
              <span className="atlas-main-subtitle">
                High-resolution continental canvases, explored realm territories, and custom campaign cartography
              </span>
            </div>
          </div>
        </div>

        <div className="atlas-header-actions">
          <button
            type="button"
            className="btn-atlas-primary"
            onClick={() => navigate('/worldmap')}
            title="Launch Fullscreen 8K Planetary Canvas"
          >
            <i className="fas fa-globe"></i>
            <span>Launch World Map Canvas</span>
          </button>

          <button
            type="button"
            className="btn-atlas-secondary"
            onClick={() => {
              if (!isEligible) {
                showToast('Custom Map uploads require the Archmage tier.');
              } else {
                setIsUploadModalOpen(true);
              }
            }}
            title="Import custom town, dungeon, or battlemap"
          >
            <i className="fas fa-file-arrow-up"></i>
            <span>Import Cartography</span>
          </button>
        </div>
      </div>

      {/* ── Search & Filter Strip ────────────────────────────── */}
      <div className="atlas-filter-strip">
        <div className="atlas-search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search realms, subregions, battlemaps, cities, keeps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn-clear-search" onClick={() => setSearchQuery('')}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="atlas-category-pills">
          <button
            type="button"
            className={`atlas-pill ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            <i className="fas fa-map"></i>
            <span>All Cartography</span>
            <span className="pill-count">{canonicalRealms.length + allCustomMapList.length}</span>
          </button>
          <button
            type="button"
            className={`atlas-pill ${categoryFilter === 'realms' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('realms')}
          >
            <i className="fas fa-earth-americas"></i>
            <span>Canonical Realms</span>
            <span className="pill-count">{canonicalRealms.length}</span>
          </button>
          <button
            type="button"
            className={`atlas-pill ${categoryFilter === 'custom' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('custom')}
          >
            <i className="fas fa-layer-group"></i>
            <span>Custom Cartography</span>
            <span className="pill-count">{allCustomMapList.length}</span>
          </button>
        </div>

        {/* View Mode Toggle (Gallery vs. Compact Ledger for Low-Spec PCs) */}
        <div className="atlas-view-toggle-group">
          <button
            type="button"
            className={`atlas-view-btn ${viewMode === 'gallery' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('gallery')}
            title="Gallery View — Visual illustrated cards"
          >
            <i className="fas fa-grip"></i>
            <span>Gallery</span>
          </button>
          <button
            type="button"
            className={`atlas-view-btn ${viewMode === 'compact' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('compact')}
            title="Compact Ledger — Fast & lightweight for smooth scrolling"
          >
            <i className="fas fa-list"></i>
            <span>Compact</span>
          </button>
        </div>
      </div>

      {/* ── Planetary World Master Map Hero ─────────────────── */}
      {categoryFilter !== 'custom' && !searchQuery && (
        viewMode === 'compact' ? (
          <div className="atlas-planetary-hero-compact">
            <div className="planetary-compact-left">
              <div className="planetary-compact-icon">
                <i className="fas fa-globe"></i>
              </div>
              <div className="planetary-compact-info">
                <h4>Mythrill — World of Five Continents</h4>
                <span className="planetary-compact-tag">8K Global Coordinate Master Layer</span>
              </div>
            </div>
            <div className="planetary-compact-actions">
              <button
                type="button"
                className="btn-enter-planetary-compact"
                onClick={() => navigate('/worldmap')}
              >
                <i className="fas fa-compass"></i> Enter Canvas
              </button>
              <button
                type="button"
                className="btn-preview-planetary-compact"
                onClick={() =>
                  setPreviewMap({
                    id: 'mythril',
                    name: 'Mythrill — World of Five Continents',
                    image: `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`,
                    description: 'The primary planetary map of Mythrill. Navigate continents, view geopolitical borders, and travel across realms.',
                    isMaster: true
                  })
                }
              >
                <i className="fas fa-eye"></i> Preview
              </button>
            </div>
          </div>
        ) : (
          <div className="atlas-planetary-hero">
            <div className="planetary-hero-media">
              <img 
                src={`${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`} 
                alt="Mythrill 8K Planetary Canvas"
                loading="lazy"
                decoding="async"
              />
              <div className="planetary-hero-overlay" />
            </div>
            <div className="planetary-hero-content">
              <div className="planetary-hero-badge">
                <i className="fas fa-gem"></i> Master Planetary Layer • 8K High-Resolution
              </div>
              <h3 className="planetary-hero-title">Mythrill — The World of Five Continents</h3>
              <p className="planetary-hero-desc">
                The primary global coordinate canvas. Pan across mountain ranges, zoom into regional holds, and explore geopolitical boundaries and trade corridors across all five realms.
              </p>
              <div className="planetary-hero-footer">
                <button
                  type="button"
                  className="btn-enter-planetary-canvas"
                  onClick={() => navigate('/worldmap')}
                >
                  <i className="fas fa-compass"></i> Enter Interactive Canvas
                </button>
                <button
                  type="button"
                  className="btn-preview-planetary"
                  onClick={() =>
                    setPreviewMap({
                      id: 'mythril',
                      name: 'Mythrill — World of Five Continents',
                      image: `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`,
                      description: 'The primary planetary map of Mythrill. Navigate continents, view geopolitical borders, and travel across realms.',
                      isMaster: true
                    })
                  }
                >
                  <i className="fas fa-eye"></i> Quick Preview
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* ── Canonical Realms Section ────────────────────────── */}
      {filteredRealms.length > 0 && (
        <div className="atlas-section">
          <div className="atlas-section-heading">
            <h3>
              <i className="fas fa-landmark"></i> Canonical Setting Realms ({filteredRealms.length})
            </h3>
            <span className="section-subtitle">Explorable continental territories with detailed subregion maps</span>
          </div>

          {viewMode === 'compact' ? (
            <div className="atlas-compact-list">
              {filteredRealms.map((realm) => {
                const bgImage = CANONICAL_REALM_IMAGES[realm.id] || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/nordhalla.jpeg`;
                const subregions = realm.subregions || [];
                const isExpanded = expandedRealmId === realm.id;

                return (
                  <div key={realm.id} className="atlas-compact-row">
                    <div className="compact-row-main">
                      <div 
                        className="compact-row-thumb"
                        onClick={() => setPreviewMap({
                          id: realm.id,
                          name: realm.name,
                          image: realm.image || bgImage,
                          description: realm.description,
                          subregions: realm.subregions || []
                        })}
                      >
                        <img src={bgImage} alt={realm.name} loading="lazy" decoding="async" />
                      </div>
                      <div className="compact-row-info">
                        <div className="compact-title-line">
                          <h4 className="compact-realm-title">{realm.name}</h4>
                          <span className="compact-realm-badge">Setting Realm</span>
                        </div>
                        <p className="compact-realm-desc">{realm.description}</p>
                      </div>
                    </div>

                    <div className="compact-row-meta">
                      {subregions.length > 0 && (
                        <button
                          type="button"
                          className="btn-compact-subregions-toggle"
                          onClick={() => setExpandedRealmId(isExpanded ? null : realm.id)}
                        >
                          <i className="fas fa-folder-tree"></i>
                          <span>{subregions.length} Subregions</span>
                          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                        </button>
                      )}
                    </div>

                    <div className="compact-row-actions">
                      <button 
                        type="button" 
                        className="btn-compact-enter"
                        onClick={() => navigate(`/worldmap/${realm.id}`)}
                      >
                        <i className="fas fa-compass"></i> Enter Canvas
                      </button>
                      <button 
                        type="button" 
                        className="btn-compact-details"
                        onClick={() => setPreviewMap({
                          id: realm.id,
                          name: realm.name,
                          image: realm.image || bgImage,
                          description: realm.description,
                          subregions: realm.subregions || []
                        })}
                        title="View Details"
                      >
                        <i className="fas fa-info-circle"></i>
                      </button>
                    </div>

                    {isExpanded && subregions.length > 0 && (
                      <div className="compact-subregions-drawer">
                        {subregions.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            className="subregion-jump-chip compact-chip"
                            onClick={() => navigate(`/worldmap/${sub.id}`)}
                            title={`Open ${sub.name} in Canvas`}
                          >
                            <i className="fas fa-location-arrow"></i>
                            <span>{sub.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="atlas-realms-grid">
              {filteredRealms.map((realm) => {
                const bgImage = CANONICAL_REALM_IMAGES[realm.id] || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/nordhalla.jpeg`;
                const subregions = realm.subregions || [];
                const isExpanded = expandedRealmId === realm.id;

                return (
                  <div key={realm.id} className="atlas-realm-card">
                    <div 
                      className="realm-card-thumb-wrap"
                      onClick={() => setPreviewMap({
                        id: realm.id,
                        name: realm.name,
                        image: realm.image || bgImage,
                        description: realm.description,
                        subregions: realm.subregions || []
                      })}
                    >
                      <img src={bgImage} alt={realm.name} loading="lazy" decoding="async" />
                      <div className="realm-card-thumb-overlay" />
                      <div className="realm-card-badge">
                        <i className="fas fa-map-pin"></i> {subregions.length} Subregions
                      </div>
                      <button 
                        type="button" 
                        className="btn-quick-preview-badge" 
                        title="Inspect Cartography & Subregions"
                      >
                        <i className="fas fa-magnifying-glass-plus"></i>
                      </button>
                    </div>

                    <div className="realm-card-body">
                      <h4 className="realm-card-title">{realm.name}</h4>
                      <p className="realm-card-desc">{realm.description}</p>
                      
                      {/* Subregion Dropdown Toggle */}
                      {subregions.length > 0 && (
                        <div className="realm-subregions-accordion">
                          <button 
                            type="button" 
                            className="btn-toggle-subregions"
                            onClick={() => setExpandedRealmId(isExpanded ? null : realm.id)}
                          >
                            <span>
                              <i className="fas fa-folder-tree"></i> Subregions ({subregions.length})
                            </span>
                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                          </button>
                          
                          {isExpanded && (
                            <div className="subregions-dropdown-list">
                              {subregions.map((sub) => (
                                <button 
                                  key={sub.id} 
                                  type="button" 
                                  className="subregion-jump-chip"
                                  onClick={() => navigate(`/worldmap/${sub.id}`)}
                                  title={`Open ${sub.name} in World Map Canvas`}
                                >
                                  <i className="fas fa-location-arrow"></i>
                                  <span>{sub.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="realm-card-footer">
                        <button 
                          type="button" 
                          className="btn-realm-enter"
                          onClick={() => navigate(`/worldmap/${realm.id}`)}
                        >
                          <i className="fas fa-compass"></i> Enter Canvas
                        </button>
                        <button 
                          type="button" 
                          className="btn-realm-details"
                          onClick={() => setPreviewMap({
                            id: realm.id,
                            name: realm.name,
                            image: realm.image || bgImage,
                            description: realm.description,
                            subregions: realm.subregions || []
                          })}
                        >
                          <i className="fas fa-info-circle"></i> Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Custom Cartography & DM Maps Section ────────────── */}
      {(categoryFilter === 'all' || categoryFilter === 'custom') && (
        <div className="atlas-section">
          <div className="atlas-section-heading">
            <div className="heading-left">
              <h3>
                <i className="fas fa-draw-polygon"></i> Custom Cartography &amp; DM Maps ({filteredCustomMaps.length})
              </h3>
              <span className="section-subtitle">
                City layouts, dungeons, keeps, and custom campaign battlemaps
              </span>
            </div>
            {isEligible && (
              <button 
                type="button" 
                className="btn-add-custom-map-pill"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <i className="fas fa-plus"></i> Register New Map
              </button>
            )}
          </div>

          {filteredCustomMaps.length > 0 ? (
            viewMode === 'compact' ? (
              <div className="atlas-compact-list">
                {filteredCustomMaps.map((map) => (
                  <div key={map.id} className="atlas-compact-row custom-row">
                    <div className="compact-row-main">
                      <div 
                        className="compact-row-thumb"
                        onClick={() => setPreviewMap({
                          id: map.id,
                          name: map.name,
                          image: map.image,
                          description: map.description,
                          mapType: map.mapType,
                          regionId: map.regionId,
                          isCustom: true
                        })}
                      >
                        <img src={map.image} alt={map.name} loading="lazy" decoding="async" />
                      </div>
                      <div className="compact-row-info">
                        <div className="compact-title-line">
                          <h4 className="compact-realm-title">{map.name}</h4>
                          <span className={`custom-type-tag type-${map.mapType || 'subregion'}`}>
                            {map.mapType || 'Submap'}
                          </span>
                          {map.regionId && <span className="custom-region-tag">{map.regionId}</span>}
                        </div>
                        <p className="compact-realm-desc">{map.description}</p>
                      </div>
                    </div>

                    <div className="compact-row-actions">
                      <button 
                        type="button" 
                        className="btn-compact-enter"
                        onClick={() => navigate(`/worldmap/${map.id}`)}
                      >
                        <i className="fas fa-compass"></i> Enter Canvas
                      </button>
                      <button 
                        type="button" 
                        className="btn-delete-custom compact-del"
                        onClick={() => handleDelete(map.id, map.name)}
                        title="Delete custom map"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="atlas-custom-grid">
                {filteredCustomMaps.map((map) => (
                  <div key={map.id} className="atlas-custom-card">
                    <div 
                      className="custom-card-thumb-wrap"
                      onClick={() => setPreviewMap({
                        id: map.id,
                        name: map.name,
                        image: map.image,
                        description: map.description,
                        mapType: map.mapType,
                        regionId: map.regionId,
                        isCustom: true
                      })}
                    >
                      <img src={map.image} alt={map.name} loading="lazy" decoding="async" />
                      <div className="custom-card-overlay" />
                      <span className={`custom-type-tag type-${map.mapType || 'subregion'}`}>
                        {map.mapType || 'Submap'}
                      </span>
                    </div>

                    <div className="custom-card-body">
                      <div className="custom-card-header">
                        <h4 className="custom-card-title">{map.name}</h4>
                        {map.regionId && <span className="custom-region-tag">{map.regionId}</span>}
                      </div>
                      <p className="custom-card-desc">{map.description}</p>
                      <div className="custom-card-footer">
                        <button 
                          type="button" 
                          className="btn-enter-custom"
                          onClick={() => navigate(`/worldmap/${map.id}`)}
                        >
                          <i className="fas fa-compass"></i> Enter Canvas
                        </button>
                        <button 
                          type="button" 
                          className="btn-delete-custom"
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
            )
          ) : (
            <div className="atlas-custom-empty">
              <i className="fas fa-scroll-old empty-atlas-icon"></i>
              <h4>No Custom Campaign Maps Registered</h4>
              <p>Upload battlemaps, city cartography, and dungeon layouts to attach them to your campaign.</p>
              {isEligible ? (
                <button 
                  type="button" 
                  className="btn-atlas-upload-cta"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <i className="fas fa-plus-circle"></i> Upload Your First Custom Map
                </button>
              ) : (
                <p className="tier-notice">
                  <i className="fas fa-crown"></i> Custom map creation requires Archmage tier.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Lightbox Preview Modal ──────────────────────────── */}
      {previewMap && (
        <div className="atlas-lightbox-backdrop" onClick={() => setPreviewMap(null)}>
          <div className="atlas-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <div className="lightbox-title-wrap">
                <i className="fas fa-compass lightbox-icon"></i>
                <div>
                  <h3>{previewMap.name}</h3>
                  <span className="lightbox-subtitle">
                    {previewMap.isMaster ? 'Global Planetary Canvas Layer' : 
                     previewMap.isCustom ? `Custom ${previewMap.mapType || 'Regional'} Cartography` : 
                     'Canonical Setting Realm'}
                  </span>
                </div>
              </div>
              <button type="button" className="btn-close-lightbox" onClick={() => setPreviewMap(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="lightbox-media-box">
              <img src={previewMap.image} alt={previewMap.name} />
            </div>

            <div className="lightbox-details-body">
              <p className="lightbox-desc">{previewMap.description}</p>
              
              {previewMap.subregions && previewMap.subregions.length > 0 && (
                <div className="lightbox-subregions-block">
                  <h5><i className="fas fa-folder-tree"></i> Explorable Subregions ({previewMap.subregions.length})</h5>
                  <div className="lightbox-subregions-grid">
                    {previewMap.subregions.map((sub) => (
                      <button 
                        key={sub.id} 
                        type="button" 
                        className="lightbox-sub-btn"
                        onClick={() => {
                          setPreviewMap(null);
                          navigate(`/worldmap/${sub.id}`);
                        }}
                      >
                        <i className="fas fa-location-dot"></i>
                        <span>{sub.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="lightbox-actions-row">
                <button 
                  type="button" 
                  className="btn-lightbox-launch"
                  onClick={() => {
                    const target = previewMap.id === 'mythril' ? '/worldmap' : `/worldmap/${previewMap.id}`;
                    setPreviewMap(null);
                    navigate(target);
                  }}
                >
                  <i className="fas fa-compass"></i> Launch Fullscreen Interactive Canvas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Import Custom Map Modal ─────────────────────────── */}
      {isUploadModalOpen && (
        <div className="atlas-upload-modal-backdrop" onClick={() => setIsUploadModalOpen(false)}>
          <div className="atlas-upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="upload-modal-header">
              <div className="modal-title-row">
                <i className="fas fa-file-arrow-up modal-header-icon"></i>
                <div>
                  <h3>Import &amp; Register Cartography</h3>
                  <p>Add high-resolution PNG/JPG battlemaps, regional layouts, or town blueprints</p>
                </div>
              </div>
              <button type="button" className="btn-close-upload-modal" onClick={() => setIsUploadModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCustomMap} className="atlas-modal-form">
              <div className="modal-form-group">
                <label>Map / Settlement Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Skaldfjord Haven or Sunken Citadel" 
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  required
                />
              </div>

              <div className="modal-form-row">
                <div className="modal-form-group flex-1">
                  <label>Parent Realm</label>
                  <select value={parentRegion} onChange={(e) => setParentRegion(e.target.value)}>
                    <option value="nordhalla">Nordhalla</option>
                    <option value="frostwood-reach">Frostwood Reach</option>
                    <option value="sundale">Sundale</option>
                    <option value="iceheart-sea">Iceheart Sea</option>
                    <option value="cragjaw-peaks">Cragjaw Peaks</option>
                    <option value="sundrift-vale">Sundrift Vale</option>
                    <option value="bryngloom-forest">Bryngloom Forest</option>
                  </select>
                </div>

                <div className="modal-form-group flex-1">
                  <label>Classification</label>
                  <select value={mapType} onChange={(e) => setMapType(e.target.value)}>
                    <option value="subregion">Subregion / Valley Map</option>
                    <option value="town">City / Town / Settlement</option>
                    <option value="dungeon">Dungeon / Keep / Interior</option>
                    <option value="poi">Encounter / Battlemap</option>
                  </select>
                </div>
              </div>

              <div className="modal-form-group">
                <label>Lore &amp; Description</label>
                <textarea 
                  placeholder="Cartographer notes, hazards, regional rulers, legends..."
                  value={mapDescription}
                  onChange={(e) => setMapDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="modal-form-group">
                <label>Cartography Image Artwork</label>
                <div className="modal-file-upload-zone">
                  <input 
                    type="file" 
                    id="modal-map-image-upload" 
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="modal-map-image-upload" className="modal-file-label">
                    <i className="fas fa-cloud-arrow-up"></i>
                    <span>{fileName ? fileName : 'Choose Cartography Artwork File...'}</span>
                  </label>
                </div>
              </div>

              {imagePreview && (
                <div className="modal-image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}

              <div className="modal-form-actions">
                <button type="button" className="btn-cancel-modal" onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn-submit-modal" 
                  disabled={isUploading || !mapName.trim() || !imagePreview}
                >
                  {isUploading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
                  ) : (
                    <><i className="fas fa-check"></i> Register Map to Atlas</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMapManager;
