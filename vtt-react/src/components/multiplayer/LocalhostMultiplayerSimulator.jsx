import React, { useState, useEffect } from 'react';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import useGameStore from '../../store/gameStore';
import { showPlayerLeaveNotification } from '../../utils/playerNotifications';
import './LocalhostMultiplayerSimulator.css';

// Predefined character data for simulation using our actual game system
const FAKE_CHARACTERS = [
  {
    name: "Kael Frostborn",
    class: "Pyrofiend",
    race: "nordmark",
    subrace: "berserker_nordmark",
    raceDisplayName: "Berserker (Nordmark)",
    level: 5,
    health: { current: 95, max: 130 },
    mana: { current: 40, max: 60 },
    actionPoints: { current: 4, max: 4 },
    color: "#FF4500",
    lore: {
      characterIcon: "ability_warrior_battleshout"
    },
    equipment: {
      weapon: { name: "Greatsword", slot: "weapon" },
      armor: { name: "Heavy Armor", slot: "armor" },
      shield: null,
      accessories: []
    },
    inventory: {
      items: [
        { name: "Health Potion", quantity: 3 },
        { name: "Rations", quantity: 5 }
      ],
      currency: { platinum: 0, gold: 50, silver: 25, copper: 10 }
    }
  },
  {
    name: "Lyralei Starweaver",
    class: "Chronarch",
    race: "mirrorkin",
    subrace: "doppel_mirrorkin",
    raceDisplayName: "Doppel (Mirrorkin)",
    level: 4,
    health: { current: 55, max: 75 },
    mana: { current: 85, max: 110 },
    actionPoints: { current: 3, max: 3 },
    color: "#4169E1",
    lore: {
      characterIcon: "spell_arcane_starfire"
    },
    equipment: {
      weapon: { name: "Staff", slot: "weapon" },
      armor: { name: "Robes", slot: "armor" },
      shield: null,
      accessories: [{ name: "Ring of Intelligence", slot: "accessory" }]
    },
    inventory: {
      items: [
        { name: "Mana Potion", quantity: 5 },
        { name: "Spell Components", quantity: 10 }
      ],
      currency: { platinum: 1, gold: 75, silver: 50, copper: 0 }
    }
  },
  {
    name: "Thane Ironward",
    class: "Warden",
    race: "wildkin",
    subrace: "guardian_wildkin",
    raceDisplayName: "Guardian (Wildkin)",
    level: 6,
    health: { current: 120, max: 150 },
    mana: { current: 35, max: 50 },
    actionPoints: { current: 4, max: 4 },
    color: "#228B22",
    lore: {
      characterIcon: "ability_druid_catform"
    },
    equipment: {
      weapon: { name: "Warhammer", slot: "weapon" },
      armor: { name: "Plate Armor", slot: "armor" },
      shield: { name: "Tower Shield", slot: "shield" },
      accessories: []
    },
    inventory: {
      items: [
        { name: "Health Potion", quantity: 2 },
        { name: "Rope", quantity: 1 },
        { name: "Torch", quantity: 5 }
      ],
      currency: { platinum: 0, gold: 100, silver: 0, copper: 50 }
    }
  },
  {
    name: "Zara Shadowdance",
    class: "Bladedancer",
    race: "mirrorkin",
    subrace: "doppel_mirrorkin",
    raceDisplayName: "Doppel (Mirrorkin)",
    level: 3,
    health: { current: 45, max: 65 },
    mana: { current: 60, max: 80 },
    actionPoints: { current: 5, max: 6 },
    color: "#8A2BE2",
    lore: {
      characterIcon: "ability_rogue_shadowdance"
    },
    equipment: {
      weapon: { name: "Dual Daggers", slot: "weapon" },
      armor: { name: "Leather Armor", slot: "armor" },
      shield: null,
      accessories: [{ name: "Cloak of Stealth", slot: "accessory" }]
    },
    inventory: {
      items: [
        { name: "Lockpicks", quantity: 1 },
        { name: "Poison Vial", quantity: 3 },
        { name: "Health Potion", quantity: 2 }
      ],
      currency: { platinum: 0, gold: 30, silver: 75, copper: 25 }
    }
  },
  {
    name: "Grimjaw Bonecrusher",
    class: "Necromancer",
    race: "nordmark",
    subrace: "berserker_nordmark",
    raceDisplayName: "Berserker (Nordmark)",
    level: 4,
    health: { current: 70, max: 90 },
    mana: { current: 75, max: 95 },
    actionPoints: { current: 3, max: 3 },
    color: "#2F4F4F",
    lore: {
      characterIcon: "spell_shadow_raisedead"
    },
    equipment: {
      weapon: { name: "Dark Staff", slot: "weapon" },
      armor: { name: "Death Robes", slot: "armor" },
      shield: null,
      accessories: [{ name: "Skull Pendant", slot: "accessory" }]
    },
    inventory: {
      items: [
        { name: "Bone Dust", quantity: 10 },
        { name: "Soul Gem", quantity: 2 },
        { name: "Mana Potion", quantity: 3 }
      ],
      currency: { platinum: 0, gold: 60, silver: 15, copper: 5 }
    }
  }
];

const CHAT_MESSAGES = [
  "Ready for adventure!",
  "Let's check the map",
  "I need to rest soon",
  "Found something interesting",
  "Watch out for traps!",
  "Nice roll!",
  "My turn to attack",
  "Healing anyone who needs it",
  "Let's move forward",
  "I'll scout ahead",
  "Rolling for initiative!",
  "Can someone cast light?",
  "I'm low on health",
  "Need to recharge my mana",
  "That was a critical hit!",
  "Let's take a short rest",
  "Anyone have a healing potion?",
  "I'll check for secret doors",
  "This looks dangerous...",
  "Great teamwork everyone!",
  "My class resource is charged up!",
  "Time to use my racial abilities",
  "Should we set up camp here?",
  "I can see movement ahead",
  "Let me buff the party first",
  "My exhaustion level is getting high",
  "Perfect positioning for this spell",
  "Anyone need equipment repairs?",
  "The loot looks promising",
  "Formation up, everyone!"
];

const LocalhostMultiplayerSimulator = ({ isVisible, currentRoom }) => {
  const [simulatedPlayers, setSimulatedPlayers] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [autoChat, setAutoChat] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const { addPartyMember, removePartyMember, updatePartyMember, partyMembers, setMemberPosition } = usePartyStore();
  const { addNotification } = useChatStore();
  const { setGMMode } = useGameStore();

  // Only show if we're on localhost and in development
  const isLocalhost = window.location.hostname === 'localhost';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const shouldShow = isLocalhost && isDevelopment && isVisible && currentRoom;

  // Drag functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('.simulator-header')) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - 320; // simulator width
      const maxY = window.innerHeight - 400; // approximate simulator height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Generate a random character from the pool
  const generateRandomCharacter = () => {
    const availableChars = FAKE_CHARACTERS.filter(
      char => !simulatedPlayers.find(p => p.name === char.name)
    );
    
    if (availableChars.length === 0) return null;
    
    const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
    return {
      ...randomChar,
      id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      joinedAt: Date.now(),
      isSimulated: true
    };
  };

  // Add a simulated player
  const addSimulatedPlayer = () => {
    const newPlayer = generateRandomCharacter();
    if (!newPlayer) {
      alert('No more characters available for simulation');
      return;
    }

    // Add to local state
    setSimulatedPlayers(prev => [...prev, newPlayer]);

    // Add to party system
    const partyMember = {
      id: newPlayer.id,
      name: newPlayer.name,
      isGM: false,
      character: {
        class: newPlayer.class,
        level: newPlayer.level,
        health: newPlayer.health,
        mana: newPlayer.mana,
        actionPoints: newPlayer.actionPoints,
        race: newPlayer.race,
        subrace: newPlayer.subrace,
        raceDisplayName: newPlayer.raceDisplayName,
        lore: newPlayer.lore,
        equipment: newPlayer.equipment,
        inventory: newPlayer.inventory
      }
    };

    addPartyMember(partyMember);

    // Set fixed position for the new player to ensure they fit on screen
    // Use predefined positions on the left side
    const fixedPositions = [
      { x: 20, y: 120 },   // Position 1
      { x: 20, y: 220 },   // Position 2
      { x: 20, y: 320 },   // Position 3
      { x: 20, y: 420 },   // Position 4
      { x: 20, y: 520 }    // Position 5
    ];

    const currentSimCount = simulatedPlayers.length;
    const newPosition = fixedPositions[currentSimCount] || { x: 20, y: 120 };

    // Set the position for this new member
    setTimeout(() => {
      setMemberPosition(newPlayer.id, newPosition);
    }, 100); // Small delay to ensure party member is added first

    // Add join notification
    addNotification('social', {
      sender: { name: 'System', class: 'system', level: 0 },
      content: `${newPlayer.name} joined the simulation`,
      type: 'system',
      timestamp: new Date().toISOString()
    });

    console.log(`🤖 Simulated player joined: ${newPlayer.name}`);
  };

  // Add all available players at once
  const addAllPlayers = () => {
    const availableChars = FAKE_CHARACTERS.filter(
      char => !simulatedPlayers.find(p => p.name === char.name)
    );

    availableChars.forEach((char, index) => {
      setTimeout(() => {
        const newPlayer = {
          ...char,
          id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          joinedAt: Date.now(),
          isSimulated: true
        };

        setSimulatedPlayers(prev => [...prev, newPlayer]);

        const partyMember = {
          id: newPlayer.id,
          name: newPlayer.name,
          isGM: false,
          character: {
            class: newPlayer.class,
            level: newPlayer.level,
            health: newPlayer.health,
            mana: newPlayer.mana,
            actionPoints: newPlayer.actionPoints,
            race: newPlayer.race,
            subrace: newPlayer.subrace,
            raceDisplayName: newPlayer.raceDisplayName,
            lore: newPlayer.lore,
            equipment: newPlayer.equipment,
            inventory: newPlayer.inventory
          }
        };

        addPartyMember(partyMember);

        // Set fixed position for the new player to ensure they fit on screen
        // Use predefined positions on the left side
        const fixedPositions = [
          { x: 20, y: 120 },   // Position 1
          { x: 20, y: 220 },   // Position 2
          { x: 20, y: 320 },   // Position 3
          { x: 20, y: 420 },   // Position 4
          { x: 20, y: 520 }    // Position 5
        ];

        const currentSimCount = index; // Use the index from forEach for positioning
        const newPosition = fixedPositions[currentSimCount] || { x: 20, y: 120 };

        // Set the position for this new member
        setTimeout(() => {
          setMemberPosition(newPlayer.id, newPosition);
        }, 100); // Small delay to ensure party member is added first

        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${newPlayer.name} joined the simulation`,
          type: 'system',
          timestamp: new Date().toISOString()
        });

        console.log(`🤖 Simulated player joined: ${newPlayer.name}`);
      }, index * 500); // Stagger joins by 500ms each
    });
  };

  // Remove a simulated player
  const removeSimulatedPlayer = (playerId) => {
    const player = simulatedPlayers.find(p => p.id === playerId);
    if (!player) return;

    // Show leave notification with fade-out effect (same as real multiplayer)
    showPlayerLeaveNotification(player.name, currentRoom?.name || 'Simulation');

    // Add visual fade-out effect before removing (same as party uninvite)
    const memberElement = document.querySelector(`.party-frame-${playerId}`);
    if (memberElement) {
      memberElement.style.transition = 'opacity 0.5s ease-out';
      memberElement.style.opacity = '0';

      // Remove after animation completes
      setTimeout(() => {
        removePartyMember(playerId);
        setSimulatedPlayers(prev => prev.filter(p => p.id !== playerId));
      }, 500);
    } else {
      // Fallback: remove immediately if element not found
      removePartyMember(playerId);
      setSimulatedPlayers(prev => prev.filter(p => p.id !== playerId));
    }

    // Add chat notification about player leaving
    addNotification('social', {
      sender: { name: 'System', class: 'system', level: 0 },
      content: `${player.name} left the simulation`,
      type: 'system',
      timestamp: new Date().toISOString()
    });

    console.log(`🤖 Simulated player left: ${player.name}`);
  };

  // Simulate random chat messages
  useEffect(() => {
    if (!autoChat || simulatedPlayers.length === 0) return;

    const interval = setInterval(() => {
      const randomPlayer = simulatedPlayers[Math.floor(Math.random() * simulatedPlayers.length)];
      const randomMessage = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];

      addNotification('social', {
        sender: { 
          name: randomPlayer.name, 
          class: randomPlayer.class.toLowerCase(), 
          level: randomPlayer.level 
        },
        content: randomMessage,
        type: 'chat',
        timestamp: new Date().toISOString()
      });
    }, 3000 + Math.random() * 7000); // Random interval between 3-10 seconds

    return () => clearInterval(interval);
  }, [autoChat, simulatedPlayers, addNotification]);

  // Simulate random health/mana changes
  useEffect(() => {
    if (!isSimulating || simulatedPlayers.length === 0) return;

    const interval = setInterval(() => {
      const randomPlayer = simulatedPlayers[Math.floor(Math.random() * simulatedPlayers.length)];
      
      // Randomly change health or mana
      const newHealth = Math.max(1, randomPlayer.health.current + (Math.random() > 0.5 ? -5 : 5));
      const newMana = Math.max(0, randomPlayer.mana.current + (Math.random() > 0.5 ? -10 : 10));

      const updatedPlayer = {
        ...randomPlayer,
        health: { ...randomPlayer.health, current: Math.min(newHealth, randomPlayer.health.max) },
        mana: { ...randomPlayer.mana, current: Math.min(newMana, randomPlayer.mana.max) }
      };

      // Update local state
      setSimulatedPlayers(prev => 
        prev.map(p => p.id === randomPlayer.id ? updatedPlayer : p)
      );

      // Update party member
      updatePartyMember(randomPlayer.id, {
        character: {
          ...updatedPlayer,
          health: updatedPlayer.health,
          mana: updatedPlayer.mana
        }
      });

    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds

    return () => clearInterval(interval);
  }, [isSimulating, simulatedPlayers, updatePartyMember]);

  // Listen for removal events from context menu
  useEffect(() => {
    const handleRemovePlayer = (event) => {
      const { playerId } = event.detail;
      setSimulatedPlayers(prev => prev.filter(p => p.id !== playerId));
      console.log(`🤖 Simulated player removed via context menu: ${playerId}`);
    };

    window.addEventListener('removeSimulatedPlayer', handleRemovePlayer);
    return () => window.removeEventListener('removeSimulatedPlayer', handleRemovePlayer);
  }, []);

  // Monitor for simulated players becoming GM - DISABLED for testing GM transfer functionality
  // This useEffect was preventing proper testing of GM promotion by automatically
  // transferring leadership back to current player when simulated players became GM
  /*
  useEffect(() => {
    const simulatedGM = partyMembers.find(member =>
      member.id.startsWith('sim_') && member.isGM
    );

    if (simulatedGM) {
      console.log(`🤖 Simulated player ${simulatedGM.name} became GM, transferring back to current player`);

      // Remove GM status from simulated player
      updatePartyMember(simulatedGM.id, { isGM: false });

      // Give GM status back to current player
      updatePartyMember('current-player', { isGM: true });

      // Set global GM mode back to true for current player
      setGMMode(true);

      // Add chat notification
      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Leadership automatically returned to you (simulated players cannot be GMs)`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    }
  }, [partyMembers, updatePartyMember, setGMMode, addNotification]);
  */

  // Clear all simulated players when component unmounts or room changes
  useEffect(() => {
    return () => {
      simulatedPlayers.forEach(player => {
        removePartyMember(player.id);
      });
    };
  }, [currentRoom]);

  if (!shouldShow) return null;

  return (
    <div
      className={`localhost-multiplayer-simulator ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="simulator-header" style={{ cursor: 'grab' }}>
        <h3>🤖 Localhost Multiplayer Simulator</h3>
        <div className="simulator-status">
          Room: {currentRoom?.name} | Players: {simulatedPlayers.length}
        </div>
      </div>

      <div className="simulator-controls">
        <button
          onClick={addSimulatedPlayer}
          disabled={simulatedPlayers.length >= 5}
          className="add-player-btn"
        >
          Add Player ({simulatedPlayers.length}/5)
        </button>

        <button
          onClick={addAllPlayers}
          disabled={simulatedPlayers.length >= 5}
          className="add-all-btn"
        >
          Add All
        </button>

        <label className="auto-chat-toggle">
          <input
            type="checkbox"
            checked={autoChat}
            onChange={(e) => setAutoChat(e.target.checked)}
          />
          Auto Chat
        </label>

        <label className="simulation-toggle">
          <input
            type="checkbox"
            checked={isSimulating}
            onChange={(e) => setIsSimulating(e.target.checked)}
          />
          Simulate Activity
        </label>
      </div>

      <div className="simulated-players-list">
        {simulatedPlayers.map(player => (
          <div key={player.id} className="simulated-player">
            <div className="player-info">
              <span className="player-name" style={{ color: player.color }}>
                {player.name}
              </span>
              <span className="player-details">
                {player.class} {player.level} | {player.race}
              </span>
            </div>
            <div className="player-resources">
              <div className="resource health">
                HP: {player.health.current}/{player.health.max}
              </div>
              <div className="resource mana">
                MP: {player.mana.current}/{player.mana.max}
              </div>
            </div>
            <button 
              onClick={() => removeSimulatedPlayer(player.id)}
              className="remove-player-btn"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {simulatedPlayers.length === 0 && (
        <div className="no-players">
          No simulated players. Click "Add Player" to start testing multiplayer features.
        </div>
      )}
    </div>
  );
};

export default LocalhostMultiplayerSimulator;
