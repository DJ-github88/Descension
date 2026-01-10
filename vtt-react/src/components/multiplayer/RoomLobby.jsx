import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { auth } from '../../config/firebase';
import { getUserRooms, createPersistentRoom } from '../../services/roomService';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
import useAuthStore from '../../store/authStore';
import './styles/RoomLobby.css';
import './styles/RoomCardModern.css';
import '../account/styles/RoomManager.css';

// Translate technical errors into fantasy-themed messages
const translateErrorToFantasy = (errorMessage) => {
  if (!errorMessage) return 'The realm beyond cannot be reached.';

  const lowerError = errorMessage.toLowerCase();

  // Network/connection errors
  if (lowerError.includes('xhr poll') || lowerError.includes('poll error')) {
    return 'The messenger ravens cannot find their path through the aether.';
  }

  if (lowerError.includes('connection failed') || lowerError.includes('unable to connect')) {
    return 'The portal to the multiplayer realm remains closed by ancient wards.';
  }

  if (lowerError.includes('timeout') || lowerError.includes('timed out')) {
    return 'Your call to distant realms echoed into the void without answer.';
  }

  if (lowerError.includes('network') || lowerError.includes('fetch')) {
    return 'The web of connectivity has frayed, blocking your path to distant realms.';
  }

  if (lowerError.includes('server') || lowerError.includes('unreachable')) {
    return 'The grand hall of multiplayer sits beyond the mists, unreachable by mortal means.';
  }

  if (lowerError.includes('disconnect') || lowerError.includes('disconnected')) {
    return 'The bond of fellowship has been broken and the mystical link has faded.';
  }

  if (lowerError.includes('reconnection') || lowerError.includes('reconnect')) {
    return 'Attempts to reforge the connection to the realm falter against the void.';
  }

  // Room/authentication errors
  if (lowerError.includes('password') || lowerError.includes('unauthorized')) {
    return 'The guardian spirits reject your offering, for the sacred words do not match.';
  }

  if (lowerError.includes('room') && (lowerError.includes('full') || lowerError.includes('not found'))) {
    return 'The chamber you seek is either overflowing with adventurers or lost to time.';
  }

  // Generic fallback
  return `A shadow falls across your path, blocking your way forward.`;
};

const RoomLobby = ({ socket, onJoinRoom, onReturnToLanding }) => {
  // CRITICAL FIX: Get navigate function for room code URL routing
  const navigate = useNavigate();

  const { getActiveCharacter } = useCharacterStore();
  const { isInParty, partyMembers } = usePartyStore();
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState('#4a90e2'); // Default blue color
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [activeTab, setActiveTab] = useState('join'); // 'join', 'create', or 'my-rooms'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [preselectedRoom, setPreselectedRoom] = useState(null);
  const [usePasswordProtection, setUsePasswordProtection] = useState(false); // Toggle for optional password

  // Use refs to store current values and avoid recreating socket listeners
  const onJoinRoomRef = useRef(onJoinRoom);
  const playerNameRef = useRef(playerName);
  const roomPasswordRef = useRef(roomPassword);

  useEffect(() => {
    onJoinRoomRef.current = onJoinRoom;
  }, [onJoinRoom]);

  useEffect(() => {
    playerNameRef.current = playerName;
  }, [playerName]);

  useEffect(() => {
    roomPasswordRef.current = roomPassword;
  }, [roomPassword]);

  // Set room name based on active character when component mounts or tab changes to create
  useEffect(() => {
    if (activeTab === 'create') {
      const activeCharacter = getActiveCharacter();
      if (activeCharacter && !roomName) {
        setRoomName(`${activeCharacter.name}'s Campaign`);
      }
    }
  }, [activeTab]); // Removed getActiveCharacter from deps to prevent infinite loop

  // Auto-update player name when character is selected
  useEffect(() => {
    const activeCharacter = getActiveCharacter();
    if (activeCharacter) {
      const characterName = activeCharacter.name || activeCharacter.baseName;
      setPlayerName(characterName);
      playerNameRef.current = characterName;
    }
  }, [getActiveCharacter]); // Run when active character changes

  // Sync player name with character name whenever playerName state changes
  useEffect(() => {
    const activeCharacter = getActiveCharacter();
    if (activeCharacter) {
      const characterName = activeCharacter.name || activeCharacter.baseName;
      if (playerName !== characterName) {
        setPlayerName(characterName);
        playerNameRef.current = characterName;
      }
    }
  }, [playerName, getActiveCharacter]); // Run when playerName or active character changes

  // Function to refresh names based on active character
  const refreshCharacterNames = () => {
    const activeCharacter = getActiveCharacter();
    if (activeCharacter) {
      const characterName = activeCharacter.name || activeCharacter.baseName;
      setPlayerName(characterName);
      playerNameRef.current = characterName; // Update the ref immediately
      if (activeTab === 'create') {
        // Use just the character name as the room name, not "xxx's Campaign"
        setRoomName(characterName);
      }
    }
  };

  // Socket server URL for room fetching with fallback options (memoized to prevent recreation)
  const SOCKET_URL = useMemo(() => {
    // Try environment variable first
    if (process.env.REACT_APP_SOCKET_URL) {
      return process.env.REACT_APP_SOCKET_URL;
    }

    // Production fallbacks
    if (process.env.NODE_ENV === 'production') {
      // Try multiple potential server URLs
      return 'https://descension-mythrill.up.railway.app';
    }

    // Development fallback
    return 'http://localhost:3002';
  }, []); // Empty dependency array since environment variables don't change

  // Reduced logging for production performance - only log once
  useEffect(() => {
  }, []); // Only log once on mount

  // Localhost development bypass - automatically create test room
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isLocalhost && isDevelopment && socket) {
      // Check if we should auto-create a test room
      const autoCreateTestRoom = localStorage.getItem('autoCreateTestRoom') !== 'false';

      if (autoCreateTestRoom) {

        // Set up test room data (no password to test empty password functionality)
        const testRoomData = {
          roomName: 'Localhost Test Room (No Password)',
          gmName: 'Test GM',
          password: '', // Empty password to test the fix
          playerColor: '#d4af37'
        };

        // Auto-fill the form
        setRoomName(testRoomData.roomName);
        setRoomPassword(testRoomData.password);
        playerNameRef.current = testRoomData.gmName;

        // Create the room automatically after a short delay
        setTimeout(() => {
          socket.emit('create_room', testRoomData);
        }, 1000);
      }
    }
  }, [socket]);

  useEffect(() => {
    // Check for room conversion from local room
    const isConverting = localStorage.getItem('isConverting') === 'true';
    const convertingLocalRoom = localStorage.getItem('convertingLocalRoom');

    if (isConverting && convertingLocalRoom) {
      try {
        const conversionData = JSON.parse(convertingLocalRoom);
        setRoomName(conversionData.name);
        setRoomDescription(conversionData.description);
        setActiveTab('create');

        // Clear conversion flags
        localStorage.removeItem('isConverting');
        localStorage.removeItem('convertingLocalRoom');

      } catch (error) {
        console.error('Error parsing conversion data:', error);
        localStorage.removeItem('isConverting');
        localStorage.removeItem('convertingLocalRoom');
      }
      return;
    }

    // Check for preselected room from account dashboard
    const selectedRoomId = localStorage.getItem('selectedRoomId');
    const selectedRoomPassword = localStorage.getItem('selectedRoomPassword');

    if (selectedRoomId && selectedRoomPassword) {
      setPreselectedRoom({
        id: selectedRoomId,
        password: selectedRoomPassword
      });
      setRoomId(selectedRoomId);
      setJoinPassword(selectedRoomPassword);
      setActiveTab('join');

      // Clear from localStorage after setting
      localStorage.removeItem('selectedRoomId');
      localStorage.removeItem('selectedRoomPassword');
    }

    // Check authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        // Try to use active character name first, then fall back to user name
        const activeCharacter = getActiveCharacter();
        const characterName = activeCharacter?.name || activeCharacter?.baseName;
        const userName = user.displayName || user.email?.split('@')[0] || 'Player';
        const finalName = characterName || userName;
        setPlayerName(finalName);
        loadUserRooms();

        // Auto-join preselected room if user is authenticated
        if (selectedRoomId && selectedRoomPassword) {
          setTimeout(() => {
            handleJoinRoom(selectedRoomId, selectedRoomPassword);
          }, 1000); // Small delay to ensure everything is loaded
        }
      } else {
        setUserRooms([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Set up socket event listeners when socket is available
  useEffect(() => {
    if (!socket) return;

    // Socket event listeners
    const handleConnect = () => {
      setIsConnecting(false);
      setError(''); // Clear any connection errors
      fetchAvailableRooms();
    };

    const handleDisconnect = (reason) => {
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        setError('The bond of fellowship has been broken by the keepers of the realm.');
      }
    };

    const handleConnectError = (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Socket connection error:', error);
      }
      setIsConnecting(false);
      const errorMsg = error?.message || error?.toString() || 'Unable to connect to server';
      setError(translateErrorToFantasy(errorMsg));
    };

    const handleReconnect = (attemptNumber) => {
      setError('');
      fetchAvailableRooms();
    };

    const handleReconnectError = (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Reconnection failed:', error);
      }
      const errorMsg = error?.message || error?.toString() || 'Reconnection failed';
      setError(translateErrorToFantasy(errorMsg));
    };

    const handleRoomCreated = (data) => {
      setIsConnecting(false);
      setIsCreatingRoom(false);

      // CRITICAL FIX: Update URL with room code for shareable links
      const roomCode = data.room.persistentRoomId || data.room.id;
      if (roomCode) {
        navigate(`/multiplayer/${roomCode}`, { replace: true });
      }

      // Clear form - the server already auto-joined us via room_joined event
      setRoomName('');
      setRoomDescription('');
      setRoomPassword('');

      // NOTE: The server already emits room_joined immediately after room_created,
      // so we don't need to emit join_room again. The handleRoomJoined handler
      // will be called automatically with isGM: true.
      console.log('✅ Room created successfully:', data.room.id);
    };

    const handleRoomJoined = (data) => {
      console.log('✅ Room joined successfully:', data);
      // Clear join timeout if it exists
      if (socket._joinTimeout) {
        clearTimeout(socket._joinTimeout);
        delete socket._joinTimeout;
      }
      setIsConnecting(false);
      setIsJoiningRoom(false);

      // CRITICAL FIX: Update URL with room code for shareable links
      const roomCode = data.room.persistentRoomId || data.room.id;
      if (roomCode) {
        navigate(`/multiplayer/${roomCode}`, { replace: true });
      }

      // Set flag to refresh room data when returning to account page
      if (data.room.persistentRoomId) {
        localStorage.setItem('roomDataChanged', 'true');
        localStorage.setItem('lastJoinedRoom', data.room.persistentRoomId);

        // For guest users, save the joined room to localStorage
        try {
          const { user } = useAuthStore.getState();
          if (user?.isGuest) {
            const guestRoomData = {
              id: data.room.persistentRoomId,
              name: data.room.name,
              description: data.room.description || '',
              password: data.room.password || '',
              createdAt: new Date().toISOString(),
              lastActivity: new Date().toISOString(),
              userRole: 'player',
              isMultiplayer: true
            };
            localStorage.setItem('mythrill-guest-joined-room', JSON.stringify(guestRoomData));
          }
        } catch (error) {
          console.warn('Could not save guest joined room:', error);
        }
      }

      // Use explicit isGM flag from server (much more reliable than name comparison)
      const isGM = data.isGM || data.isGMReconnect || false;

      onJoinRoomRef.current(data.room, socket, isGM);
    };

    const handleError = (data) => {
      console.error('❌ Socket error during room operations:', data);
      // Clear join timeout if it exists
      if (socket._joinTimeout) {
        clearTimeout(socket._joinTimeout);
        delete socket._joinTimeout;
      }
      const errorMsg = data.message || 'An unknown error occurred';
      setError(translateErrorToFantasy(errorMsg));
      setIsConnecting(false);
      setIsCreatingRoom(false);
      setIsJoiningRoom(false);
      setIsCreatingRoom(false);
    };

    const handleRoomListUpdated = (rooms) => {
      setAvailableRooms(rooms);
    };

    // Add event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('reconnect', handleReconnect);
    socket.on('reconnect_error', handleReconnectError);
    socket.on('room_created', handleRoomCreated);
    socket.on('room_joined', handleRoomJoined);
    socket.on('error', handleError);
    socket.on('room_list_updated', handleRoomListUpdated);

    // Fetch rooms if already connected
    if (socket.connected) {
      fetchAvailableRooms();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('reconnect', handleReconnect);
      socket.off('reconnect_error', handleReconnectError);
      socket.off('room_created', handleRoomCreated);
      socket.off('room_joined', handleRoomJoined);
      socket.off('error', handleError);
      socket.off('room_list_updated', handleRoomListUpdated);
    };
  }, [socket]); // Only depend on socket to prevent unnecessary re-setup

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout for health check
      });

      if (response.ok) {
        const data = await response.json();
        return true;
      } else {
        console.warn('⚠️ Server health check failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Server health check error:', error);
      return false;
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      // First check if server is available
      const serverAvailable = await checkServerStatus();
      if (!serverAvailable) {
        setError('The grand hall of multiplayer sits beyond the mists, unreachable by mortal means.');
        setAvailableRooms([]);
        return;
      }

      const response = await fetch(`${SOCKET_URL}/rooms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rooms = await response.json();
      setAvailableRooms(rooms);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      if (error.name === 'AbortError') {
        setError(translateErrorToFantasy('Request timeout - server may be unavailable'));
      } else if (error.message.includes('Failed to fetch')) {
        setError('The web of connectivity has frayed, blocking your path to distant realms.');
      } else {
        setError(translateErrorToFantasy(error.message || 'Failed to load rooms'));
      }
      setAvailableRooms([]);
    }
  };

  const loadUserRooms = async () => {
    if (!auth.currentUser) return;

    try {
      const rooms = await getUserRooms(auth.currentUser.uid);
      setUserRooms(rooms);
    } catch (error) {
      console.error('Failed to load user rooms:', error);
    }
  };

  const handleCreatePersistentRoom = async () => {
    if (!isAuthenticated) {
      setError('You must first swear an oath to the realm before creating halls that stand the test of time.');
      return;
    }

    if (!roomName.trim()) {
      setError('Every hall must bear a name. Speak the title you wish to give this gathering place.');
      return;
    }

    // Password is now optional - if empty, room will be created without password

    if (!socket || !socket.connected) {
      setError('The portal to the multiplayer realm remains closed. You cannot pass through the mists.');
      return;
    }

    // Get active character name - this should be the primary player name (matching handleCreateRoom logic)
    const activeCharacter = getActiveCharacter();
    const characterName = activeCharacter?.name || activeCharacter?.baseName;
    // Check if character name is the default "Character Name" and use a better fallback
    const isDefaultName = characterName === 'Character Name' || characterName === 'Character Name (Room Name)';
    const finalPlayerName = (!isDefaultName && characterName) ? characterName : (playerNameRef.current.trim() || 'Anonymous Adventurer');

    // Sync player name ref with character name for consistency
    if (characterName && !isDefaultName) {
      playerNameRef.current = characterName;
      setPlayerName(characterName);
    }

    setIsConnecting(true);
    setIsCreatingRoom(true);
    setError('');

    try {
      // Try to create persistent room in Firebase first
      let persistentRoomId = null;
      try {
        persistentRoomId = await createPersistentRoom({
          name: roomName.trim(),
          description: roomDescription.trim(),
          password: roomPasswordRef.current.trim(),
          gmName: finalPlayerName,
          maxPlayers: 6
        });
      } catch (firebaseError) {
        console.warn('Firebase room creation failed, creating socket room only:', firebaseError);
        // Continue with socket room creation even if Firebase fails
      }

      // Check for converted local room game state
      const convertingLocalRoom = localStorage.getItem('convertingLocalRoom');
      let gameState = null;
      let originalRoomId = null;

      if (convertingLocalRoom) {
        try {
          const conversionData = JSON.parse(convertingLocalRoom);
          gameState = conversionData.gameState;
          originalRoomId = conversionData.originalRoomId;
        } catch (error) {
          console.error('Error parsing conversion game state:', error);
        }
      }

      // Create socket server room for immediate multiplayer
      const roomData = {
        roomName: roomName.trim(),
        gmName: finalPlayerName,
        password: roomPasswordRef.current.trim(),
        playerColor: playerColor,
        persistentRoomId: persistentRoomId, // Include Firebase room ID if available
        gameState: gameState, // Include converted game state if available
        isConverted: !!originalRoomId, // Flag to indicate this is a converted room
        // Include GM's character data for proper player HUD display
        character: activeCharacter ? {
          id: activeCharacter.id,
          name: activeCharacter.name,
          class: activeCharacter.class,
          race: activeCharacter.race,
          subrace: activeCharacter.subrace,
          raceDisplayName: activeCharacter.raceDisplayName || '',
          level: activeCharacter.level,
          health: activeCharacter.health,
          mana: activeCharacter.mana,
          actionPoints: activeCharacter.actionPoints,
          classResource: activeCharacter.classResource,
          tokenSettings: activeCharacter.tokenSettings,
          lore: activeCharacter.lore
        } : null,
        partyMembers: isInParty ? partyMembers.filter(m => m.id !== 'current-player').map(m => ({
          name: m.name,
          id: m.id,
          character: m.character
        })) : [] // Include party members (excluding current player who is the GM)
      };

      socket.emit('create_room', roomData);

      // Try to refresh user rooms if Firebase is available
      try {
        await loadUserRooms();
      } catch (error) {
        console.warn('Failed to refresh user rooms:', error);
      }

      // Set flag to refresh room data when returning to account page
      if (persistentRoomId) {
        localStorage.setItem('roomDataChanged', 'true');
        localStorage.setItem('lastCreatedRoom', persistentRoomId);
      }

      // Mark local room as converted if this was a conversion
      if (originalRoomId && persistentRoomId) {
        try {
          const { default: localRoomService } = await import('../../services/localRoomService');
          localRoomService.markRoomAsConverted(originalRoomId, persistentRoomId);

          // Clear conversion data
          localStorage.removeItem('convertingLocalRoom');
        } catch (error) {
          console.error('Error marking local room as converted:', error);
        }
      }

      // Note: The socket will handle the response via 'room_created' event
      // which will call onJoinRoom and clear the form

    } catch (error) {
      console.error('Failed to create room:', error);
      const errorMsg = error.message || 'Failed to create room';
      setError(translateErrorToFantasy(errorMsg));
      setIsConnecting(false);
      setIsCreatingRoom(false);
    }
  };

  const handleJoinPersistentRoom = (room) => {
    if (!socket) {
      setError('The portal to the multiplayer realm remains closed. You cannot pass through the mists.');
      return;
    }

    setIsConnecting(true);
    setIsCreatingRoom(true);
    setError('');

    // For persistent rooms, we need to connect to the live session
    // The room password is already known since the user is a member
    const joinData = {
      roomId: room.id,
      playerName: playerNameRef.current.trim(),
      password: room.password || '', // This should be handled securely
      playerColor: playerColor
    };

    socket.emit('join_room', joinData);
  };

  const handleCreateRoom = () => {
    // Get active character name - this should be the primary player name
    const activeCharacter = getActiveCharacter();
    const characterName = activeCharacter?.name || activeCharacter?.baseName;
    // Check if character name is the default "Character Name" and use a better fallback
    const isDefaultName = characterName === 'Character Name' || characterName === 'Character Name (Room Name)';
    const finalPlayerName = (!isDefaultName && characterName) ? characterName : (playerNameRef.current.trim() || 'Anonymous Adventurer');

    // Sync player name ref with character name for GM detection
    if (characterName) {
      playerNameRef.current = characterName;
      setPlayerName(characterName);
    }

    if (!roomName.trim()) {
      setError('Please enter a room name');
      return;
    }

    // Password is now optional - if empty, room will be created without password

    if (!socket) {
      setError('The portal to the multiplayer realm remains closed. You cannot pass through the mists.');
      return;
    }

    if (!socket.connected) {
      setError('The mystical bond has not been forged. The connection to the realm has not been established.');
      return;
    }

    setIsConnecting(true);
    setIsCreatingRoom(true);
    setError('');

    const roomData = {
      roomName: roomName.trim(),
      gmName: finalPlayerName,
      password: roomPasswordRef.current.trim(),
      playerColor: playerColor,
      // Include GM's character data for proper player HUD display
      character: activeCharacter ? {
        id: activeCharacter.id,
        name: activeCharacter.name,
        class: activeCharacter.class,
        race: activeCharacter.race,
        subrace: activeCharacter.subrace,
        raceDisplayName: activeCharacter.raceDisplayName || '',
        level: activeCharacter.level,
        health: activeCharacter.health,
        mana: activeCharacter.mana,
        actionPoints: activeCharacter.actionPoints,
        classResource: activeCharacter.classResource,
        tokenSettings: activeCharacter.tokenSettings,
        lore: activeCharacter.lore
      } : null,
      partyMembers: isInParty ? partyMembers.filter(m => m.id !== 'current-player').map(m => ({
        name: m.name,
        id: m.id,
        character: m.character
      })) : [] // Include party members (excluding current player who is the GM)
    };

    socket.emit('create_room', roomData);
  };

  const handleJoinRoom = async (targetRoomId = null, targetPassword = null) => {
    const finalRoomId = targetRoomId || roomId;
    const finalPassword = targetPassword || joinPassword;

    // Check if user is using mock development bypass (without real Firebase auth)
    // Users with Firebase Anonymous Auth (isAnonymous: true) can still join rooms
    const { isDevelopmentBypass, user: currentUser } = useAuthStore.getState();
    if (isDevelopmentBypass && currentUser?.uid === 'dev-user-123') {
      // Only block if using the mock user without real Firebase auth
      setError('Development mode without Firebase auth. Please sign out and sign back in with a regular account, or wait for anonymous auth to complete.');
      return;
    }

    // For guests, skip character loading and validation
    const isGuest = currentUser?.isGuest;
    if (!isGuest) {
      // Ensure characters are loaded before proceeding (only for authenticated users)
      const { loadCharacters, isLoading: charactersLoading } = useCharacterStore.getState();
      if (charactersLoading) {
        setError('Loading character data, please wait...');
        return;
      }

      // Try to load characters if not already loaded
      try {
        await loadCharacters();
      } catch (error) {
        console.warn('Failed to load characters before joining room:', error);
      }
    }

    // Get active character name - this should be the primary player name
    const activeCharacter = isGuest ? null : getActiveCharacter();
    const characterName = activeCharacter?.name || activeCharacter?.baseName;
    // Check if character name is the default "Character Name" and use a better fallback
    const isDefaultName = characterName === 'Character Name' || characterName === 'Character Name (Room Name)';
    const finalPlayerName = (!isDefaultName && characterName) ? characterName : (playerNameRef.current.trim() || 'Anonymous Adventurer');

    if (!finalPlayerName || !finalRoomId.trim()) {
      if (!finalPlayerName) {
        setError('Please enter a player name to join the room.');
      } else {
        setError('You must speak the chamber\'s secret identifier to cross its threshold.');
      }
      return;
    }

    // Check if this is a test room in localhost development
    const isTestRoom = localStorage.getItem('isTestRoom') === 'true';
    const isLocalhost = window.location.hostname === 'localhost';

    if (isTestRoom && isLocalhost) {
      // Bypass password validation for test rooms in localhost
      console.log('🧪 Test room detected in localhost - bypassing password validation');
    }
    // Note: Password is optional for all rooms, so no validation needed here
    // The server will handle password matching (empty passwords are allowed)

    if (!socket) {
      setError('The portal to the multiplayer realm remains closed. You cannot pass through the mists.');
      return;
    }

    if (!socket.connected) {
      setError('The mystical bond has not been forged. The connection to the realm has not been established.');
      return;
    }

    setIsConnecting(true);
    setIsJoiningRoom(true);
    setError('');

    // Include full character data in join request to avoid race conditions
    const joinData = {
      roomId: finalRoomId.trim(),
      playerName: finalPlayerName,
      password: (isTestRoom && isLocalhost) ? 'test123' : finalPassword.trim(),
      playerColor: playerColor,
      character: (activeCharacter && !isGuest) ? {
        id: activeCharacter.id,
        name: activeCharacter.name,
        class: activeCharacter.class,
        race: activeCharacter.race,
        subrace: activeCharacter.subrace,
        raceDisplayName: activeCharacter.raceDisplayName || '',
        level: activeCharacter.level,
        health: activeCharacter.health,
        mana: activeCharacter.mana,
        actionPoints: activeCharacter.actionPoints,
        alignment: activeCharacter.alignment,
        background: activeCharacter.background,
        classResource: activeCharacter.classResource,
        // CRITICAL FIX: Get current inventory from inventory store to ensure latest data
        inventory: (() => {
          try {
            const inventoryStore = require('../../store/inventoryStore').default;
            const inventoryState = inventoryStore.getState();
            return {
              items: inventoryState.items || [],
              currency: inventoryState.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
              encumbranceState: inventoryState.encumbranceState || 'normal'
            };
          } catch (error) {
            console.warn('Could not get current inventory, using character inventory:', error);
            return activeCharacter.inventory || {
              items: [],
              currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
              encumbranceState: 'normal'
            };
          }
        })(),
        equipment: activeCharacter.equipment,
        stats: activeCharacter.stats,
        lore: activeCharacter.lore,
        tokenSettings: activeCharacter.tokenSettings
      } : null
    };

    console.log('🎮 Joining room with character:', {
      characterName: activeCharacter?.name,
      playerName: finalPlayerName,
      roomId: finalRoomId,
      hasCharacterData: !!activeCharacter,
      isGuest: isGuest,
      socketConnected: socket.connected,
      socketId: socket.id
    });

    // Add timeout to detect if join fails
    const joinTimeout = setTimeout(() => {
      console.error('❌ Room join timeout - no response from server', {
        socketConnected: socket.connected,
        socketId: socket.id,
        roomId: finalRoomId,
        playerName: finalPlayerName,
        socketReadyState: socket.readyState,
        socketDisconnected: socket.disconnected
      });

      // Try to emit a test event to see if socket is working
      console.log('🧪 Testing socket connectivity...');
      socket.emit('ping', { test: true, timestamp: Date.now() });

      setError('Failed to join room - no response from server. Please try again.');
      setIsConnecting(false);
      setIsJoiningRoom(false);
    }, 10000); // 10 second timeout

    // Store timeout reference to clear it when join succeeds
    socket._joinTimeout = joinTimeout;

    console.log('📤 Sending join_room event to server:', joinData);
    socket.emit('join_room', joinData);

    // Add a pong listener for our test
    socket.once('pong', (data) => {
      console.log('🏓 Socket pong received:', data);
    });

    // Add temporary error listener for this join attempt
    const handleJoinError = (error) => {
      console.error('❌ Server error during room join:', error);
      if (socket._joinTimeout) {
        clearTimeout(socket._joinTimeout);
        delete socket._joinTimeout;
      }
      setError(`Server error: ${error.message || 'Unknown error'}`);
      setIsConnecting(false);
      setIsJoiningRoom(false);
      socket.off('error', handleJoinError);
    };
    socket.once('error', handleJoinError);

    // Test basic socket connectivity
    socket.emit('test_connectivity', { test: true, roomId: finalRoomId });
    socket.once('connectivity_test', (response) => {
      console.log('🔗 Socket connectivity test successful:', response);
    });
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');

  const handleQuickJoin = (room) => {
    // Show password modal instead of using prompt
    setSelectedRoom(room);
    setPasswordInput('');
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    if (selectedRoom && passwordInput !== null) {
      setRoomId(selectedRoom.id);
      setJoinPassword(passwordInput);
      handleJoinRoom(selectedRoom.id, passwordInput);
      setShowPasswordModal(false);
      setSelectedRoom(null);
      setPasswordInput('');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setSelectedRoom(null);
    setPasswordInput('');
  };

  return (
    <div className="room-lobby">
      <div className="lobby-container">
        <div className="lobby-header">
          <button
            className="back-to-landing-btn"
            onClick={onReturnToLanding}
            title="Return to main menu"
          >
            <i className="fas fa-times"></i>
          </button>
          <h1>Mythrill D&D</h1>
          <p>Join or create a multiplayer session</p>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-content">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
            <button
              className="error-retry-btn"
              onClick={() => {
                setError('');
                setIsConnecting(false);
                setIsJoiningRoom(false);
                setIsCreatingRoom(false);
              }}
              title="Clear error and try again"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="player-name-section">
          <div className="player-name-row">
            <div className="name-input-group">
              <label htmlFor="playerName">Your Name:</label>
              <div className="player-name-container">
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={getActiveCharacter() ? "Character name will be used automatically" : "Enter your display name"}
                  disabled={isConnecting || !!getActiveCharacter()}
                  readOnly={!!getActiveCharacter()}
                  maxLength={20}
                  className={getActiveCharacter() ? "character-auto-filled" : ""}
                />
                {(() => {
                  const activeCharacter = getActiveCharacter();
                  if (activeCharacter) {
                    return (
                      <div className="character-selected-notice">
                        <i className="fas fa-user-check"></i>
                        <span>Using character: {activeCharacter.name}</span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="no-character-notice">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>No champion chosen—visit Account → Characters to select one.</span>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
            <div className="color-input-group">
              <label htmlFor="playerColor">Chat Color:</label>
              <div className="color-picker-container">
                <input
                  id="playerColor"
                  type="color"
                  value={playerColor}
                  onChange={(e) => setPlayerColor(e.target.value)}
                  disabled={isConnecting}
                  className="color-picker"
                />
                <div
                  className="color-preview"
                  style={{
                    backgroundColor: playerColor,
                    color: '#fff',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <span>
                    {playerName || 'Preview'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lobby-tabs">
          <button
            className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => setActiveTab('join')}
          >
            Join Room
          </button>
          <button
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Room
          </button>
          {isAuthenticated && (
            <button
              className={`tab-button ${activeTab === 'my-rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-rooms')}
            >
              My Rooms
            </button>
          )}
        </div>

        {activeTab === 'join' && (
          <div className="join-room-section">
            {preselectedRoom && (
              <div className="preselected-room-notice">
                <div className="notice-content">
                  <i className="fas fa-info-circle"></i>
                  <span>
                    {localStorage.getItem('isTestRoom') === 'true'
                      ? 'Test room selected - password bypass enabled for localhost'
                      : 'Room selected from your account dashboard'
                    }
                  </span>
                  <button
                    className="auto-join-btn"
                    onClick={() => handleJoinRoom()}
                    disabled={isConnecting || !playerNameRef.current.trim()}
                  >
                    {isConnecting ? 'Joining...' : 'Join Selected Room'}
                  </button>
                </div>
              </div>
            )}

            <div className="manual-join">
              <div className="form-input-group">
                <label htmlFor="roomId">Room ID:</label>
                <input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  disabled={isConnecting}
                  className="form-input"
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="joinPassword">Room Password (Optional):</label>
                <div className="password-input-with-button">
                  <input
                    id="joinPassword"
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    placeholder="Leave empty if room has no password"
                    disabled={isConnecting}
                    className="form-input"
                  />
                  <button
                    onClick={() => handleJoinRoom()}
                    disabled={isConnecting || !playerNameRef.current.trim() || !roomId.trim()}
                    className="join-button"
                  >
                    {isConnecting ? 'Joining...' : 'Join'}
                  </button>
                </div>
              </div>
            </div>

            <div className="available-rooms">
              <h3>Available Rooms</h3>
              <button
                onClick={fetchAvailableRooms}
                className="refresh-button"
                disabled={isConnecting}
              >
                Refresh
              </button>

              {availableRooms.length === 0 ? (
                <div className="empty-rooms-message">
                  <div className="empty-rooms-icon">
                    <i className="fas fa-dungeon"></i>
                  </div>
                  <h4>No Active Rooms</h4>
                  <p>The tavern stands empty. Be the first to light the hearth and gather your adventurers!</p>
                  <button
                    className="create-room-prompt-btn"
                    onClick={() => setActiveTab('create')}
                  >
                    <i className="fas fa-plus-circle"></i>
                    Create a Room
                  </button>
                </div>
              ) : (
                <div className="room-card-modern-grid">
                  {availableRooms.map(room => (
                    <div key={room.id} className="room-card-modern">
                      <div className="room-card-modern-top">
                        <div className="room-card-modern-title-section">
                          <h3 className="room-card-modern-title">{room.name}</h3>
                          <div className="room-card-modern-badge">
                            <i className="fas fa-crown"></i>
                            <span>GM: {room.gm}</span>
                          </div>
                        </div>
                      </div>

                      <div className="room-card-modern-stats">
                        <div className="room-card-modern-stat">
                          <div className={`room-card-modern-stat-icon ${room.gmOnline !== false ? 'status-online' : 'status-offline'}`}>
                            <i className="fas fa-circle"></i>
                          </div>
                          <div className="room-card-modern-stat-content">
                            <div className="room-card-modern-stat-label">Status</div>
                            <div className="room-card-modern-stat-value">{room.gmOnline !== false ? 'Online' : 'Offline'}</div>
                          </div>
                        </div>
                        <div className="room-card-modern-stat">
                          <div className="room-card-modern-stat-icon">
                            <i className="fas fa-users"></i>
                          </div>
                          <div className="room-card-modern-stat-content">
                            <div className="room-card-modern-stat-label">Players</div>
                            <div className="room-card-modern-stat-value">{room.playerCount} / {room.maxPlayers}</div>
                          </div>
                        </div>
                        <div className="room-card-modern-stat">
                          <div className="room-card-modern-stat-icon">
                            <i className="fas fa-clock"></i>
                          </div>
                          <div className="room-card-modern-stat-content">
                            <div className="room-card-modern-stat-label">Created</div>
                            <div className="room-card-modern-stat-value">{new Date(room.createdAt).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="room-card-modern-action">
                        <button
                          onClick={() => handleQuickJoin(room)}
                          disabled={isConnecting || !playerNameRef.current.trim() || room.playerCount >= room.maxPlayers}
                          className="room-card-modern-button"
                          title={room.playerCount >= room.maxPlayers ? 'Room is full' : 'Join this room'}
                        >
                          <i className={room.playerCount >= room.maxPlayers ? 'fas fa-ban' : (isJoiningRoom ? 'fas fa-spinner fa-spin' : 'fas fa-play')}></i>
                          {room.playerCount >= room.maxPlayers ? 'Room Full' : (isJoiningRoom ? 'Joining...' : 'Join Room')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-room-section">
            <h3>Create New Room</h3>
            <div className="form-input-group">
              <label htmlFor="roomName">
                Room Name:
                <button
                  type="button"
                  onClick={refreshCharacterNames}
                  className="refresh-character-btn"
                  title="Use active character name"
                  disabled={isConnecting}
                >
                  <i className="fas fa-sync-alt"></i>
                </button>
              </label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                disabled={isConnecting}
                maxLength={30}
                className="form-input"
              />
            </div>

            <div className="form-input-group">
              <label htmlFor="roomDescription">Description (Optional):</label>
              <textarea
                id="roomDescription"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                placeholder="Describe your campaign or session"
                disabled={isConnecting}
                maxLength={200}
                rows={3}
                className="form-input"
              />
            </div>

            <div className="form-input-group password-toggle-group">
              <label className="password-checkbox-label">
                <input
                  type="checkbox"
                  checked={usePasswordProtection}
                  onChange={(e) => {
                    setUsePasswordProtection(e.target.checked);
                    if (!e.target.checked) {
                      setRoomPassword(''); // Clear password when unchecked
                    }
                  }}
                  disabled={isConnecting}
                  className="password-checkbox"
                />
                <span className="password-checkbox-text">
                  <i className={usePasswordProtection ? 'fas fa-lock' : 'fas fa-lock-open'}></i>
                  Add Password Protection
                </span>
              </label>
            </div>

            {usePasswordProtection && (
              <div className="form-input-group password-field">
                <label htmlFor="roomPassword">Room Password:</label>
                <input
                  id="roomPassword"
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Enter password for room access"
                  disabled={isConnecting}
                  maxLength={50}
                  className="form-input"
                  autoFocus
                />
              </div>
            )}

            <div className="create-buttons">
              <button
                onClick={handleCreateRoom}
                disabled={isConnecting || !roomName.trim()}
                className="create-button"
              >
                <i className={isCreatingRoom ? 'fas fa-spinner fa-spin' : 'fas fa-magic'}></i>
                {isCreatingRoom ? 'Creating...' : 'Create Temporary Room'}
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleCreatePersistentRoom}
                  disabled={isConnecting || !getActiveCharacter() || !roomName.trim()}
                  className="create-button persistent"
                >
                  <i className={isCreatingRoom ? 'fas fa-spinner fa-spin' : 'fas fa-save'}></i>
                  {isCreatingRoom ? 'Creating...' : 'Create Persistent Room'}
                </button>
              )}
            </div>

            <div className="gm-info">
              <p><strong>Note:</strong> You will be the Game Master (GM) of this room.</p>
              <p>As GM, you have full control over the game state and can manage players.</p>
              {usePasswordProtection && (
                <p><strong>Password Protected:</strong> Players will need the password to join this room.</p>
              )}
              {!usePasswordProtection && (
                <p><strong>Open Room:</strong> Anyone with the room code can join without a password.</p>
              )}
              {!isAuthenticated && (
                <p><strong>Tip:</strong> Sign in to create persistent rooms that save your progress!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'my-rooms' && isAuthenticated && (
          <div className="my-rooms-section">
            <h3>My Rooms</h3>
            {userRooms.length === 0 ? (
              <div className="no-rooms">
                <i className="fas fa-dungeon"></i>
                <h3>No Multiplayer Rooms Yet</h3>
                <p>Create your first persistent room to start a campaign that saves your progress.</p>
              </div>
            ) : (
              <div className="multiplayer-rooms-grid">
                {userRooms.map(room => {
                  const getRoleIcon = (role) => {
                    return role === 'gm' ? 'fas fa-crown' : 'fas fa-user';
                  };

                  const getRoleColor = (role) => {
                    return role === 'gm' ? '#FFD700' : '#4CAF50';
                  };

                  return (
                    <div key={room.id} className={`multiplayer-room-card ${room.isTestRoom ? 'test-room' : ''}`}>
                      <div className="room-header">
                        <h3 className="room-name">{room.name}</h3>
                        <div className="room-role">
                          <i
                            className={getRoleIcon(room.userRole)}
                            style={{ color: getRoleColor(room.userRole) }}
                          />
                          <span>{room.userRole === 'gm' ? 'GM' : 'Player'}</span>
                        </div>
                      </div>

                      <div className="room-status">
                        <div className="status-indicator">
                          <i className="fas fa-circle" style={{ color: room.isActive ? '#4CAF50' : '#757575' }}></i>
                          <span>{room.isActive ? 'Active' : 'Offline'}</span>
                        </div>
                        <div className="member-count">
                          <i className="fas fa-users"></i>
                          <span>{room.members?.length || 0}/{(room.settings?.maxPlayers || 6) + 1}</span>
                        </div>
                      </div>

                      {room.description && (
                        <div className="room-description">
                          <p>{room.description}</p>
                        </div>
                      )}

                      <div className="room-stats">
                        <div className="stat-item">
                          <i className="fas fa-clock"></i>
                          <span>Last Activity</span>
                          <span className="stat-value">
                            {room.lastActivity ? new Date(room.lastActivity.seconds * 1000).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                      </div>

                      <div className="room-actions">
                        <button
                          onClick={() => handleJoinPersistentRoom(room)}
                          disabled={isConnecting}
                          className="join-btn primary"
                          title={room.userRole === 'gm' ? 'Resume as Game Master' : 'Join as Player'}
                        >
                          <i className={room.userRole === 'gm' ? 'fas fa-crown' : 'fas fa-play'}></i>
                          {room.userRole === 'gm' ? 'Resume as GM' : 'Join'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && selectedRoom && (
        <div className="password-modal-overlay" onClick={handlePasswordCancel}>
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="password-modal-header">
              <h3>Enter Room Password</h3>
              <p>Room: {selectedRoom.name}</p>
            </div>
            <input
              type="password"
              className="password-modal-input"
              placeholder="Enter room password (leave empty if none)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                } else if (e.key === 'Escape') {
                  handlePasswordCancel();
                }
              }}
              autoFocus
            />
            <div className="password-modal-actions">
              <button
                className="password-modal-btn secondary"
                onClick={handlePasswordCancel}
              >
                Cancel
              </button>
              <button
                className="password-modal-btn primary"
                onClick={handlePasswordSubmit}
                disabled={isJoiningRoom}
              >
                <i className={isJoiningRoom ? 'fas fa-spinner fa-spin' : 'fas fa-play'}></i>
                {isJoiningRoom ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomLobby;
