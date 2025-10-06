/**
 * Mock Presence Service
 * 
 * Creates fake online users for testing the Community chat system.
 * Simulates real users with automated responses and behaviors.
 */

import { v4 as uuidv4 } from 'uuid';

// Mock user data - Using actual game classes, races, and subraces
// ONLY using the 9 custom backgrounds: Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel
const MOCK_USERS = [
  {
    userId: 'mock_user_1',
    characterId: 'char_mock_1',
    characterName: 'Thorin Ironforge',
    level: 12,
    class: 'Titan',
    background: 'mercenary',
    race: 'Grimheart',
    subrace: 'Mountain Dwarf',
    status: 'online',
    sessionType: 'multiplayer',
    roomId: 'room_dragons_lair',
    roomName: "Dragon's Lair",
    roomParticipants: ['Thorin Ironforge', 'Elara Moonwhisper', 'GM Aldric']
  },
  {
    userId: 'mock_user_2',
    characterId: 'char_mock_2',
    characterName: 'Elara Moonwhisper',
    level: 10,
    class: 'Lunarch',
    background: 'arcanist',
    race: 'Thornkin',
    subrace: 'Courtly Thornkin',
    status: 'online',
    sessionType: 'multiplayer',
    roomId: 'room_dragons_lair',
    roomName: "Dragon's Lair",
    roomParticipants: ['Thorin Ironforge', 'Elara Moonwhisper', 'GM Aldric']
  },
  {
    userId: 'mock_user_3',
    characterId: 'char_mock_3',
    characterName: 'Grimjaw Bloodaxe',
    level: 15,
    class: 'Berserker',
    background: 'reaver',
    race: 'Ashmark',
    subrace: 'War Orc',
    status: 'online',
    sessionType: 'local',
    roomId: null,
    roomName: null,
    roomParticipants: null
  },
  {
    userId: 'mock_user_4',
    characterId: 'char_mock_4',
    characterName: 'Lyra Starweaver',
    level: 8,
    class: 'Pyrofiend',
    background: 'mystic',
    race: 'Nordmark',
    subrace: 'Berserker',
    status: 'online',
    sessionType: null,
    roomId: null,
    roomName: null,
    roomParticipants: null
  },
  {
    userId: 'mock_user_5',
    characterId: 'char_mock_5',
    characterName: 'Zephyr Shadowblade',
    level: 11,
    class: 'Bladedancer',
    background: 'trickster',
    race: 'Wildkin',
    subrace: 'Lightfoot Halfling',
    status: 'away',
    sessionType: 'local',
    roomId: null,
    roomName: null,
    roomParticipants: null
  },
  {
    userId: 'mock_user_6',
    characterId: 'char_mock_6',
    characterName: 'Aldric the Wise',
    level: 20,
    class: 'Inscriptor',
    background: 'arcanist',
    race: 'Nordmark',
    subrace: 'Skald',
    status: 'online',
    sessionType: 'multiplayer',
    roomId: 'room_dragons_lair',
    roomName: "Dragon's Lair",
    roomParticipants: ['Thorin Ironforge', 'Elara Moonwhisper', 'GM Aldric']
  }
];

// Automated responses for different scenarios
const GREETINGS = [
  "Hey there! Welcome to the community!",
  "Greetings, adventurer!",
  "Well met, friend!",
  "Hail and well met!",
  "Good to see you online!"
];

const CHAT_RESPONSES = [
  "That's an interesting point!",
  "I agree! The new update is great.",
  "Anyone up for a quest later?",
  "Just finished an epic dungeon run!",
  "Looking for a group for the Dragon's Lair raid.",
  "Has anyone tried the new spell crafting system?",
  "The combat mechanics are so smooth now!",
  "Need help with character builds? I'm happy to assist!",
  "Just hit level {level}! 🎉",
  "This game is amazing!",
  "Who wants to join my party for a dungeon crawl?",
  "The new talent trees are incredible!",
  "Just got an epic loot drop! 🎁",
  "Anyone know where to find the Moonstone Cavern?",
  "Looking for a healer for our group!",
  "The boss fight was intense! We barely made it!",
  "Trading rare items, whisper me if interested!",
  "Just unlocked a new spell - it's so powerful!",
  "The character customization is top-notch!",
  "Need tips on defeating the Shadow Dragon?",
  "This community is so helpful and friendly!",
  "Who else is excited for the next update?",
  "Just created a new character, any build suggestions?",
  "The multiplayer experience is seamless!",
  "Anyone want to test out the new combat features?"
];

const WHISPER_RESPONSES = [
  "Thanks for the whisper! How can I help?",
  "Hey! What's up?",
  "Sure, I'd be happy to help!",
  "Absolutely! Let me know what you need.",
  "Great to hear from you!"
];

const INVITE_RESPONSES = [
  "Thanks for the invite! I'll join in a moment.",
  "Appreciate the invitation! On my way!",
  "Count me in! See you there!",
  "Thanks! I'll be right there."
];

class MockPresenceService {
  constructor() {
    this.mockUsers = new Map();
    this.responseTimers = [];
    this.chatInterval = null;
    this.onlineOfflineInterval = null;
  }

  /**
   * Initialize mock users
   */
  initializeMockUsers() {
    console.log('🎭 Initializing mock users...');

    // Import background and race data for computing display names
    const { getCustomBackgroundData } = require('../data/customBackgroundData');
    const { getFullRaceData } = require('../data/raceData');

    MOCK_USERS.forEach(user => {
      // Compute backgroundDisplayName
      let backgroundDisplayName = '';
      if (user.background) {
        const customBgData = getCustomBackgroundData(user.background.toLowerCase());
        if (customBgData) {
          backgroundDisplayName = customBgData.name;
        }
      }

      // Compute raceDisplayName
      let raceDisplayName = '';
      if (user.race && user.subrace) {
        const raceData = getFullRaceData(user.race, user.subrace);
        if (raceData) {
          raceDisplayName = raceData.displayName;
        }
      }

      this.mockUsers.set(user.userId, {
        ...user,
        backgroundDisplayName,
        raceDisplayName,
        connectedAt: new Date(),
        lastSeen: new Date()
      });
    });

    console.log(`✅ Initialized ${this.mockUsers.size} mock users`);
    return Array.from(this.mockUsers.values());
  }

  /**
   * Get all mock users
   */
  getMockUsers() {
    return Array.from(this.mockUsers.values());
  }

  /**
   * Get a specific mock user
   */
  getMockUser(userId) {
    return this.mockUsers.get(userId);
  }

  /**
   * Simulate a user sending a chat message
   */
  simulateChatMessage(userId, addGlobalMessage) {
    const user = this.mockUsers.get(userId);
    if (!user) return;

    const responses = CHAT_RESPONSES.map(r => r.replace('{level}', user.level));
    const message = responses[Math.floor(Math.random() * responses.length)];

    const chatMessage = {
      id: `msg_${uuidv4()}`,
      senderId: user.userId,
      senderName: user.characterName,
      senderClass: user.class,
      senderLevel: user.level,
      content: message,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    addGlobalMessage(chatMessage);
    console.log(`💬 ${user.characterName}: ${message}`);
  }

  /**
   * Simulate a greeting when user joins
   */
  simulateGreeting(addGlobalMessage) {
    // Random user sends greeting
    const users = Array.from(this.mockUsers.values()).filter(u => u.status === 'online');
    if (users.length === 0) return;

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];

    const chatMessage = {
      id: `msg_${uuidv4()}`,
      senderId: randomUser.userId,
      senderName: randomUser.characterName,
      senderClass: randomUser.class,
      senderLevel: randomUser.level,
      content: greeting,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    addGlobalMessage(chatMessage);
  }

  /**
   * Simulate response to whisper and continue conversation
   */
  simulateWhisperResponse(targetUserId, senderName, addWhisperMessageCallback) {
    const user = this.mockUsers.get(targetUserId);
    if (!user) return;

    const response = WHISPER_RESPONSES[Math.floor(Math.random() * WHISPER_RESPONSES.length)];

    // Simulate initial delay
    setTimeout(() => {
      const whisperMessage = {
        id: `msg_${uuidv4()}`,
        senderId: user.userId,
        senderName: user.characterName,
        recipientName: senderName,
        content: response,
        timestamp: new Date().toISOString(),
        type: 'whisper_received'
      };

      // Call the callback with userId and message
      addWhisperMessageCallback(targetUserId, whisperMessage);
      console.log(`🤫 ${user.characterName} whispered back: ${response}`);

      // Continue conversation with 2-3 more messages
      this.continueWhisperConversation(targetUserId, senderName, addWhisperMessageCallback, 1);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  }

  /**
   * Continue whisper conversation with follow-up messages
   */
  continueWhisperConversation(targetUserId, senderName, addWhisperMessageCallback, messageCount) {
    if (messageCount >= 3) return; // Stop after 3 messages

    const user = this.mockUsers.get(targetUserId);
    if (!user) return;

    // Wait 5-10 seconds before next message
    setTimeout(() => {
      const followUpMessages = [
        "By the way, have you tried the new dungeon?",
        "I'm looking for a group later if you're interested!",
        "What build are you running these days?",
        "The new patch is pretty exciting!",
        "Let me know if you need any help with quests!",
        "I found some great loot earlier today!",
        "Want to team up for some PvP?",
        "The boss mechanics are tricky but fun!",
        "I've been working on my crafting skills.",
        "Have you seen the new talent trees?"
      ];

      const message = followUpMessages[Math.floor(Math.random() * followUpMessages.length)];

      const whisperMessage = {
        id: `msg_${uuidv4()}`,
        senderId: user.userId,
        senderName: user.characterName,
        recipientName: senderName,
        content: message,
        timestamp: new Date().toISOString(),
        type: 'whisper_received'
      };

      addWhisperMessageCallback(targetUserId, whisperMessage);
      console.log(`🤫 ${user.characterName} continues: ${message}`);

      // Continue conversation
      this.continueWhisperConversation(targetUserId, senderName, addWhisperMessageCallback, messageCount + 1);
    }, 5000 + Math.random() * 5000); // 5-10 seconds between messages
  }

  /**
   * Start simulating party chat for mock users in the party
   */
  startPartyChatSimulation(partyMembers, addPartyChatMessageCallback) {
    // Clear any existing party chat interval
    if (this.partyChatInterval) {
      clearInterval(this.partyChatInterval);
    }

    const PARTY_MESSAGES = [
      "Ready when you are!",
      "Let's do this!",
      "I've got your back!",
      "Anyone need buffs?",
      "Watch out for adds!",
      "Nice work team!",
      "I'll take the lead.",
      "Following your lead!",
      "Need a heal?",
      "Mana is good!",
      "Cooldowns ready!",
      "Let's stick together.",
      "I'll cover the rear.",
      "Great teamwork!",
      "On my way!",
      "Position looks good.",
      "Ready to engage!",
      "I'll handle the left side.",
      "Moving to position.",
      "All clear here!"
    ];

    // Send party messages every 15-25 seconds
    this.partyChatInterval = setInterval(() => {
      // Get mock users who are in the party
      const mockPartyMembers = partyMembers.filter(member =>
        this.mockUsers.has(member.id)
      );

      if (mockPartyMembers.length === 0) {
        return;
      }

      // Pick a random mock party member to send a message
      const randomMember = mockPartyMembers[Math.floor(Math.random() * mockPartyMembers.length)];
      const user = this.mockUsers.get(randomMember.id);

      if (user) {
        const message = PARTY_MESSAGES[Math.floor(Math.random() * PARTY_MESSAGES.length)];

        const partyMessage = {
          id: `msg_${uuidv4()}`,
          senderId: user.userId,
          senderName: user.characterName,
          senderClass: user.class,
          senderLevel: user.level,
          content: message,
          timestamp: new Date().toISOString(),
          type: 'party'
        };

        addPartyChatMessageCallback(partyMessage);
        console.log(`👥 ${user.characterName} says in party: ${message}`);
      }
    }, 15000 + Math.random() * 10000); // 15-25 seconds

    console.log(`🎉 Started party chat simulation for ${partyMembers.length} members`);
  }

  /**
   * Stop party chat simulation
   */
  stopPartyChatSimulation() {
    if (this.partyChatInterval) {
      clearInterval(this.partyChatInterval);
      this.partyChatInterval = null;
      console.log('🛑 Stopped party chat simulation');
    }
  }

  /**
   * Simulate response to room invitation
   */
  simulateInviteResponse(targetUserId, roomName, addGlobalMessage) {
    const user = this.mockUsers.get(targetUserId);
    if (!user) return;

    const response = INVITE_RESPONSES[Math.floor(Math.random() * INVITE_RESPONSES.length)];

    // Simulate delay
    setTimeout(() => {
      const systemMessage = {
        id: `msg_${uuidv4()}`,
        content: `${user.characterName} accepted your invitation to ${roomName}!`,
        timestamp: new Date().toISOString(),
        type: 'system'
      };

      addGlobalMessage(systemMessage);
      console.log(`📨 ${user.characterName} accepted invite to ${roomName}`);
    }, 2000 + Math.random() * 3000); // 2-5 second delay
  }

  /**
   * Start automated chat activity
   */
  startAutomatedChat(addGlobalMessage) {
    // Don't start if already running
    if (this.chatInterval) {
      console.log('🤖 Automated chat already running');
      return;
    }

    console.log('🤖 Starting automated chat activity...');

    // Send initial greeting after 2 seconds
    setTimeout(() => {
      this.simulateGreeting(addGlobalMessage);
    }, 2000);

    // Random chat messages every 8-15 seconds (more frequent for testing)
    this.chatInterval = setInterval(() => {
      const onlineUsers = Array.from(this.mockUsers.values()).filter(u => u.status === 'online');
      if (onlineUsers.length === 0) return;

      const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
      this.simulateChatMessage(randomUser.userId, addGlobalMessage);
    }, 8000 + Math.random() * 7000); // 8-15 seconds
  }

  /**
   * Stop automated chat activity
   */
  stopAutomatedChat() {
    if (this.chatInterval) {
      clearInterval(this.chatInterval);
      this.chatInterval = null;
    }
    this.responseTimers.forEach(timer => clearTimeout(timer));
    this.responseTimers = [];
    console.log('🛑 Stopped automated chat activity');
  }

  /**
   * Start simulating users going online/offline
   * Maintains 4-7 users online at any time
   */
  startOnlineOfflineSimulation(updateUserStatus, addGlobalMessage) {
    console.log('🔄 Starting online/offline simulation...');

    // More frequent status changes every 10-20 seconds to maintain 4-7 users online
    this.onlineOfflineInterval = setInterval(() => {
      const users = Array.from(this.mockUsers.values());
      if (users.length === 0) return;

      // Count currently online users
      const onlineCount = users.filter(u => u.status === 'online').length;

      // Determine if we should add or remove users
      let shouldGoOnline;
      if (onlineCount <= 4) {
        // Too few online, bring someone online
        shouldGoOnline = true;
      } else if (onlineCount >= 7) {
        // Too many online, take someone offline
        shouldGoOnline = false;
      } else {
        // In the sweet spot (4-7), randomly choose
        shouldGoOnline = Math.random() > 0.5;
      }

      // Pick a random user with the appropriate current status
      const eligibleUsers = users.filter(u =>
        shouldGoOnline ? u.status === 'offline' : u.status === 'online'
      );

      if (eligibleUsers.length === 0) return;

      const randomUser = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
      const newStatus = shouldGoOnline ? 'online' : 'offline';

      // Update user status
      randomUser.status = newStatus;
      randomUser.lastSeen = new Date();
      this.mockUsers.set(randomUser.userId, randomUser);

      // Update in store - if offline, remove from list
      if (newStatus === 'offline') {
        updateUserStatus(randomUser.userId, null, true); // true = remove
      } else {
        // Add back to online users
        updateUserStatus(randomUser.userId, randomUser, false);
      }

      console.log(`🔄 ${randomUser.characterName} is now ${newStatus} (${onlineCount} → ${shouldGoOnline ? onlineCount + 1 : onlineCount - 1} online)`);
    }, 10000 + Math.random() * 10000); // 10-20 seconds
  }

  /**
   * Stop online/offline simulation
   */
  stopOnlineOfflineSimulation() {
    if (this.onlineOfflineInterval) {
      clearInterval(this.onlineOfflineInterval);
      this.onlineOfflineInterval = null;
    }
    console.log('🛑 Stopped online/offline simulation');
  }

  /**
   * Cleanup
   */
  cleanup() {
    this.stopAutomatedChat();
    this.stopOnlineOfflineSimulation();
    this.stopPartyChatSimulation();
    this.mockUsers.clear();
  }
}

// Export singleton instance
const mockPresenceService = new MockPresenceService();
export default mockPresenceService;

