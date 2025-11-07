import React, { useState, useEffect, useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import { auth } from '../../config/firebase';
import { getUserRooms, createPersistentRoom } from '../../services/roomService';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
import useAuthStore from '../../store/authStore';
import './styles/RoomLobby.css';
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
  const [activeTab, setActiveTab] = useState('join'); // 'join', 'create', or 'my-rooms'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [preselectedRoom, setPreselectedRoom] = useState(null);

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
      console.log(`🎮 Auto-updated player name to character: ${characterName}`);
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
        console.log(`🎮 Synced player name to character: ${characterName}`);
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
      console.log(`🎮 Using active character: ${characterName}`);
    } else {
      console.log('⚠️ No active character found');
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
    if (process.env.NODE_ENV === 'development') {
      console.log('🔌 Socket URL:', SOCKET_URL);
      console.log('🌍 Environment:', process.env.NODE_ENV);
    }
  }, []); // Only log once on mount

  // Localhost development bypass - automatically create test room
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isLocalhost && isDevelopment && socket) {
      // Check if we should auto-create a test room
      const autoCreateTestRoom = localStorage.getItem('autoCreateTestRoom') !== 'false';

      if (autoCreateTestRoom) {
        console.log('🧪 Localhost development detected - auto-creating test room');

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
          console.log('🚀 Auto-creating localhost test room...');
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

        console.log('🔄 Converting local room to multiplayer:', conversionData.name);
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
        console.log(`🎮 Player name set to: ${finalName} (character: ${!!characterName})`);
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

    if (process.env.NODE_ENV === 'development') {
      console.log('Setting up RoomLobby socket event listeners');
    }

    // Socket event listeners
    const handleConnect = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Connected to server in RoomLobby');
      }
      setIsConnecting(false);
      setError(''); // Clear any connection errors
      fetchAvailableRooms();
    };

    const handleDisconnect = (reason) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Disconnected from server in RoomLobby:', reason);
      }
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
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      }
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
      console.log('Room created successfully:', data);
      setIsConnecting(false);

      // Store the room password and player name for auto-join BEFORE clearing form
      const createdRoomPassword = roomPasswordRef.current.trim();
      const createdPlayerName = playerNameRef.current.trim();

      // Validate parameters before proceeding (password is optional)
      if (!data.room?.id || !createdPlayerName) {
        console.error('❌ Missing required parameters for auto-join:', {
          roomId: data.room?.id,
          playerName: createdPlayerName,
          password: createdRoomPassword ? '[HIDDEN]' : 'EMPTY'
        });
        setError('The gates opened, but you could not cross the threshold.');
        return;
      }

      // Clear form
      setRoomName('');
      setRoomDescription('');
      setRoomPassword('');

      // Automatically join the room as GM
      setTimeout(() => {
        const joinData = {
          roomId: data.room.id,
          playerName: createdPlayerName,
          password: createdRoomPassword,
          playerColor: playerColor
        };

        console.log('Auto-joining created room:', joinData);
        console.log('Socket connected:', socket.connected);
        console.log('Socket ID:', socket.id);
        socket.emit('join_room', joinData);
      }, 100); // Small delay to ensure room is fully created
    };

    const handleRoomJoined = (data) => {
      console.log('Room joined successfully:', data);
      console.log('Player name:', playerNameRef.current.trim());
      console.log('Room GM name:', data.room.gm?.name);
      console.log('Is GM reconnect:', data.isGMReconnect);
      setIsConnecting(false);

      // Set flag to refresh room data when returning to account page
      if (data.room.persistentRoomId) {
        localStorage.setItem('roomDataChanged', 'true');
        localStorage.setItem('lastJoinedRoom', data.room.persistentRoomId);
        console.log(`📝 Marked room data as changed for joined room: ${data.room.persistentRoomId}`);

        // For guest users, save the joined room to localStorage
        try {
          const { user } = useAuthStore.getState();
          if (user?.isGuest) {
            console.log('👤 Guest user joined room via lobby - saving to localStorage');
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
            console.log(`✅ Guest joined room saved: ${data.room.name}`);
          }
        } catch (error) {
          console.warn('Could not save guest joined room:', error);
        }
      }

      // Check if this is a GM reconnect or if the player name matches the GM name
      const isGM = data.isGMReconnect || (data.room.gm && data.room.gm.name === playerNameRef.current.trim());
      console.log('Determined isGM:', isGM);

      console.log('Calling onJoinRoom with:', { room: data.room, socket: socket, isGM });
      onJoinRoomRef.current(data.room, socket, isGM);
    };

    const handleError = (data) => {
      console.error('Socket error:', data);
      const errorMsg = data.message || 'An unknown error occurred';
      setError(translateErrorToFantasy(errorMsg));
      setIsConnecting(false);
    };

    const handleRoomListUpdated = (rooms) => {
      console.log('Room list updated:', rooms);
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
      if (process.env.NODE_ENV === 'development') {
        console.log('Cleaning up RoomLobby socket event listeners');
      }
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
        console.log('✅ Server health check passed:', data);
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

    setIsConnecting(true);
    setError('');

    try {
      // Try to create persistent room in Firebase first
      let persistentRoomId = null;
      try {
        persistentRoomId = await createPersistentRoom({
          name: roomName.trim(),
          description: roomDescription.trim(),
          password: roomPasswordRef.current.trim(),
          gmName: playerNameRef.current.trim(),
          maxPlayers: 6
        });
        console.log('Persistent room created:', persistentRoomId);
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
          console.log('🔄 Including converted game state in room creation');
        } catch (error) {
          console.error('Error parsing conversion game state:', error);
        }
      }

      // Create socket server room for immediate multiplayer
      const roomData = {
        roomName: roomName.trim(),
        gmName: playerNameRef.current.trim(),
        password: roomPasswordRef.current.trim(),
        playerColor: playerColor,
        persistentRoomId: persistentRoomId, // Include Firebase room ID if available
        gameState: gameState, // Include converted game state if available
        isConverted: !!originalRoomId, // Flag to indicate this is a converted room
        partyMembers: isInParty ? partyMembers.filter(m => m.id !== 'current-player').map(m => ({
          name: m.name,
          id: m.id,
          character: m.character
        })) : [] // Include party members (excluding current player who is the GM)
      };

      console.log('Creating socket room with data:', roomData);
      console.log('🎉 Party members to auto-invite:', roomData.partyMembers);
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
        console.log(`📝 Marked room data as changed for room: ${persistentRoomId}`);
      }

      // Mark local room as converted if this was a conversion
      if (originalRoomId && persistentRoomId) {
        try {
          const { default: localRoomService } = await import('../../services/localRoomService');
          localRoomService.markRoomAsConverted(originalRoomId, persistentRoomId);
          console.log(`✅ Local room ${originalRoomId} marked as converted to ${persistentRoomId}`);

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
    }
  };

  const handleJoinPersistentRoom = (room) => {
    if (!socket) {
      setError('The portal to the multiplayer realm remains closed. You cannot pass through the mists.');
      return;
    }

    setIsConnecting(true);
    setError('');

    // For persistent rooms, we need to connect to the live session
    // The room password is already known since the user is a member
    const joinData = {
      roomId: room.id,
      playerName: playerNameRef.current.trim(),
      password: room.password || '', // This should be handled securely
      playerColor: playerColor
    };

    console.log('Joining persistent room:', joinData);
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
    setError('');

    const roomData = {
      roomName: roomName.trim(),
      gmName: finalPlayerName,
      password: roomPasswordRef.current.trim(),
      playerColor: playerColor,
      partyMembers: isInParty ? partyMembers.filter(m => m.id !== 'current-player').map(m => ({
        name: m.name,
        id: m.id,
        character: m.character
      })) : [] // Include party members (excluding current player who is the GM)
    };

    console.log('Creating room with data:', roomData);
    console.log('🎉 Party members to auto-invite:', roomData.partyMembers);
    socket.emit('create_room', roomData);
  };

  const handleJoinRoom = (targetRoomId = null, targetPassword = null) => {
    const finalRoomId = targetRoomId || roomId;
    const finalPassword = targetPassword || joinPassword;

    // Get active character name - this should be the primary player name
    const activeCharacter = getActiveCharacter();
    const characterName = activeCharacter?.name || activeCharacter?.baseName;
    // Check if character name is the default "Character Name" and use a better fallback
    const isDefaultName = characterName === 'Character Name' || characterName === 'Character Name (Room Name)';
    const finalPlayerName = (!isDefaultName && characterName) ? characterName : (playerNameRef.current.trim() || 'Anonymous Adventurer');

    if (!finalPlayerName || !finalRoomId.trim()) {
      if (!finalPlayerName) {
        setError('No champion has been chosen. Journey to your account and select a character to represent you in these halls.');
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

    setIsConnecting(true);
    setError('');

    // Include full character data in join request to avoid race conditions
    const joinData = {
      roomId: finalRoomId.trim(),
      playerName: finalPlayerName,
      password: (isTestRoom && isLocalhost) ? 'test123' : finalPassword.trim(),
      playerColor: playerColor,
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
        alignment: activeCharacter.alignment,
        background: activeCharacter.background,
        classResource: activeCharacter.classResource,
        lore: activeCharacter.lore,
        tokenSettings: activeCharacter.tokenSettings
      } : null
    };

    console.log('🎮 Joining room with character:', {
      characterName: activeCharacter?.name,
      playerName: finalPlayerName,
      roomId: finalRoomId,
      hasCharacterData: !!activeCharacter
    });
    socket.emit('join_room', joinData);
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
            {error}
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
                <label htmlFor="joinPassword">Room Password:</label>
                <div className="password-input-with-button">
                  <input
                    id="joinPassword"
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    placeholder="Enter room password"
                    disabled={isConnecting}
                    className="form-input"
                  />
                  <button
                    onClick={() => handleJoinRoom()}
                    disabled={isConnecting || !playerNameRef.current.trim() || !roomId.trim() || !joinPassword.trim()}
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
                <div className="no-rooms">
                  <i className="fas fa-dungeon"></i>
                  <h3>No Public Rooms Available</h3>
                  <p>No public rooms are currently available. Create your own room to get started!</p>
                </div>
              ) : (
                <div className="multiplayer-rooms-grid">
                  {availableRooms.map(room => (
                    <div key={room.id} className="multiplayer-room-card">
                      <div className="room-header">
                        <h3 className="room-name">{room.name}</h3>
                        <div className="room-role">
                          <i className="fas fa-crown" style={{ color: '#FFD700' }}></i>
                          <span>GM: {room.gm} (GM)</span>
                        </div>
                      </div>

                      <div className="room-status">
                        <div className="status-indicator">
                          <i className="fas fa-circle" style={{ color: room.gmOnline !== false ? '#4CAF50' : '#757575' }}></i>
                          <span>{room.gmOnline !== false ? 'Online' : 'Offline'}</span>
                        </div>
                        <div className="member-count">
                          <i className="fas fa-users"></i>
                          <span>{room.playerCount}/{room.maxPlayers}</span>
                        </div>
                      </div>

                      <div className="room-stats">
                        <div className="stat-item">
                          <i className="fas fa-clock"></i>
                          <span>Created</span>
                          <span className="stat-value">
                            {new Date(room.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      <div className="room-actions">
                        <button
                          onClick={() => handleQuickJoin(room)}
                          disabled={isConnecting || !playerNameRef.current.trim() || room.playerCount >= room.maxPlayers}
                          className="join-btn primary"
                          title={room.playerCount >= room.maxPlayers ? 'Room is full' : 'Join this room'}
                        >
                          <i className={room.playerCount >= room.maxPlayers ? 'fas fa-ban' : 'fas fa-play'}></i>
                          {room.playerCount >= room.maxPlayers ? 'Full' : 'Join'}
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

            <div className="form-input-group password-optional">
              <label htmlFor="roomPassword">Room Password:</label>
              <input
                id="roomPassword"
                type="password"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                placeholder="Leave empty for no password, or enter a password"
                disabled={isConnecting}
                maxLength={50}
                className="form-input"
              />
            </div>

            <div className="create-buttons">
              <button
                onClick={handleCreateRoom}
                disabled={isConnecting || !roomName.trim()}
                className="create-button"
              >
                {isConnecting ? 'Creating...' : 'Create Temporary Room'}
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleCreatePersistentRoom}
                  disabled={isConnecting || !getActiveCharacter() || !roomName.trim()}
                  className="create-button persistent"
                >
                  {isConnecting ? 'Creating...' : 'Create Persistent Room'}
                </button>
              )}
            </div>

            <div className="gm-info">
              <p><strong>Note:</strong> You will be the Game Master (GM) of this room.</p>
              <p>As GM, you have full control over the game state and can manage players.</p>
              <p><strong>Password Required:</strong> All players must enter the password to join.</p>
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
              placeholder="Enter room password"
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
                disabled={!passwordInput.trim()}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomLobby;
