import React, { useState, useEffect } from 'react';
import useSocialStore from '../../store/socialStore';
import FriendsList from '../social/FriendsList';
import IgnoreList from '../social/IgnoreList';
import WhoList from '../social/WhoList';
import '../../styles/social-window.css';

const SocialWindow = ({ activeTab: propActiveTab, contentOnly = false }) => {
  const { activeTab: storeActiveTab, setActiveTab } = useSocialStore();
  const activeTab = propActiveTab || storeActiveTab;
  const [isLoaded, setIsLoaded] = useState(false);

  // Set isLoaded to true after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300); // Small delay for smoother transition

    return () => clearTimeout(timer);
  }, []);

  // Render the appropriate tab content
  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="loading-wrapper">
          <div className="loading-text">Loading social panel...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'friends':
        return <FriendsList />;
      case 'ignored':
        return <IgnoreList />;
      case 'who':
        return <WhoList />;
      default:
        return <FriendsList />;
    }
  };

  return (
    <div className="social-window">
      {/* Tab Navigation - only show if not contentOnly */}
      {!contentOnly && (
        <div className="social-tabs">
          <button
            className={`social-tab ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
          <button
            className={`social-tab ${activeTab === 'ignored' ? 'active' : ''}`}
            onClick={() => setActiveTab('ignored')}
          >
            Ignore
          </button>
          <button
            className={`social-tab ${activeTab === 'who' ? 'active' : ''}`}
            onClick={() => setActiveTab('who')}
          >
            Who
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="social-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SocialWindow;
