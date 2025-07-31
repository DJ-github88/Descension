import React, { useState, useEffect } from 'react';
import useMapStore from '../../store/mapStore';
import './StorageMonitor.css';

const StorageMonitor = ({ showDetails = false }) => {
    const { getStorageInfo, cleanupStorage } = useMapStore();
    const [storageInfo, setStorageInfo] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const updateStorageInfo = () => {
            const info = getStorageInfo();
            setStorageInfo(info);
            
            // Show warning if usage is above 80%
            if (info && parseFloat(info.usagePercentage) > 80) {
                setShowWarning(true);
            } else {
                setShowWarning(false);
            }
        };

        updateStorageInfo();
        
        // Update every 30 seconds
        const interval = setInterval(updateStorageInfo, 30000);
        
        return () => clearInterval(interval);
    }, [getStorageInfo]);

    const handleCleanup = () => {
        const cleaned = cleanupStorage();
        if (cleaned > 0) {
            alert(`Cleaned up ${cleaned} temporary storage entries.`);
        } else {
            alert('No temporary storage entries found to clean up.');
        }
        
        // Refresh storage info
        const info = getStorageInfo();
        setStorageInfo(info);
    };

    if (!storageInfo) {
        return null;
    }

    const usagePercentage = parseFloat(storageInfo.usagePercentage);
    const isHigh = usagePercentage > 80;
    const isCritical = usagePercentage > 95;

    if (!showDetails && !showWarning) {
        return null;
    }

    return (
        <div className={`storage-monitor ${isHigh ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
            {showWarning && (
                <div className="storage-warning">
                    <span className="warning-icon">⚠️</span>
                    <span className="warning-text">
                        Storage {isCritical ? 'critically' : 'nearly'} full ({storageInfo.usagePercentage}%)
                    </span>
                    <button 
                        className="cleanup-button"
                        onClick={handleCleanup}
                        title="Clean up temporary storage"
                    >
                        Clean Up
                    </button>
                </div>
            )}
            
            {showDetails && (
                <div className="storage-details">
                    <h4>Storage Usage</h4>
                    <div className="storage-bar">
                        <div 
                            className="storage-fill"
                            style={{ 
                                width: `${Math.min(usagePercentage, 100)}%`,
                                backgroundColor: isCritical ? '#dc2626' : isHigh ? '#f59e0b' : '#10b981'
                            }}
                        />
                    </div>
                    <div className="storage-stats">
                        <div className="stat">
                            <span className="stat-label">Total:</span>
                            <span className="stat-value">{storageInfo.totalSizeMB} MB</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Maps:</span>
                            <span className="stat-value">{storageInfo.mapStoreSizeMB} MB</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Usage:</span>
                            <span className="stat-value">{storageInfo.usagePercentage}%</span>
                        </div>
                    </div>
                    <div className="storage-actions">
                        <button 
                            className="cleanup-button"
                            onClick={handleCleanup}
                        >
                            Clean Up Temporary Data
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorageMonitor;
