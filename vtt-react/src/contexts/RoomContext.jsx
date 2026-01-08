/**
 * Room Context - Provides current room information throughout the application
 * Centralizes room tracking for both local and multiplayer rooms
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const RoomContext = createContext(null);

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    // Return default values when not in a room context
    return {
      currentRoomId: 'global',
      roomType: 'global',
      isInRoom: false,
      roomData: null
    };
  }
  return context;
};

export const RoomProvider = ({ children }) => {
  const [currentRoomId, setCurrentRoomId] = useState('global');
  const [roomType, setRoomType] = useState('global'); // 'local', 'multiplayer', or 'global'
  const [roomData, setRoomData] = useState(null);
  const [isInRoom, setIsInRoom] = useState(false);

  // Listen for local room changes
  useEffect(() => {
    const checkLocalRoom = () => {
      const isLocalRoom = localStorage.getItem('isLocalRoom') === 'true';
      const selectedLocalRoomId = localStorage.getItem('selectedLocalRoomId');
      
      // CRITICAL FIX: Only update state if values actually changed
      if (isLocalRoom && selectedLocalRoomId) {
        if (currentRoomId !== selectedLocalRoomId || roomType !== 'local' || !isInRoom) {
          setCurrentRoomId(selectedLocalRoomId);
          setRoomType('local');
          setIsInRoom(true);
          console.log('🏠 Room context: Local room detected:', selectedLocalRoomId);
        }
      } else if (currentRoomId !== 'global' && roomType === 'local') {
        // Local room was cleared
        setCurrentRoomId('global');
        setRoomType('global');
        setIsInRoom(false);
        setRoomData(null);
        console.log('🏠 Room context: Local room cleared');
      }
    };

    // Check immediately
    checkLocalRoom();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'isLocalRoom' || e.key === 'selectedLocalRoomId') {
        checkLocalRoom();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // CRITICAL FIX: Reduce interval frequency from 1000ms to 5000ms to prevent excessive re-renders
    // This prevents performance issues during scrolling/dragging
    const interval = setInterval(checkLocalRoom, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentRoomId, roomType, isInRoom]);

  // Methods to update room context
  const enterLocalRoom = (roomId, roomData = null) => {
    setCurrentRoomId(roomId);
    setRoomType('local');
    setRoomData(roomData);
    setIsInRoom(true);
    console.log('🏠 Room context: Entered local room:', roomId);
  };

  const enterMultiplayerRoom = (roomId, roomData = null) => {
    // CRITICAL FIX: Only update if values actually changed to prevent excessive re-renders
    if (currentRoomId !== roomId || roomType !== 'multiplayer' || !isInRoom) {
      setCurrentRoomId(roomId);
      setRoomType('multiplayer');
      setRoomData(roomData);
      setIsInRoom(true);
      console.log('🌐 Room context: Entered multiplayer room:', roomId);
    }
  };

  const exitRoom = () => {
    setCurrentRoomId('global');
    setRoomType('global');
    setRoomData(null);
    setIsInRoom(false);
    console.log('🚪 Room context: Exited room');
  };

  const updateRoomData = (newData) => {
    setRoomData(newData);
  };

  const contextValue = {
    // State
    currentRoomId,
    roomType,
    roomData,
    isInRoom,
    
    // Actions
    enterLocalRoom,
    enterMultiplayerRoom,
    exitRoom,
    updateRoomData,
    
    // Computed properties
    isLocalRoom: roomType === 'local',
    isMultiplayerRoom: roomType === 'multiplayer',
    isGlobalContext: roomType === 'global'
  };

  return (
    <RoomContext.Provider value={contextValue}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
