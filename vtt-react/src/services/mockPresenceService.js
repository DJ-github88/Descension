/**
 * Mock Presence Service
 * 
 * Creates fake online users for testing the Community chat system.
 * Simulates real users with automated responses and behaviors.
 */

import { v4 as uuidv4 } from 'uuid';

// Mock user data
const MOCK_USERS = [
  {
    userId: 'mock_user_1',
    characterId: 'char_mock_1',
    characterName: 'Thorin Ironforge',
    level: 12,
    class: 'Titan',
    background: 'Zealot',
    race: 'Dwarf',
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
    class: 'Mystic',
    background: 'Sage',
    race: 'Elf',
    subrace: 'High Elf',
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
    background: 'Outlaw',
    race: 'Orc',
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
    background: 'Mystic',
    race: 'Human',
    subrace: 'Nordmark',
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
    class: 'Rogue',
    background: 'Criminal',
    race: 'Halfling',
    subrace: 'Lightfoot',
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
    class: 'Archmage',
    background: 'Sage',
    race: 'Human',
    subrace: 'Nordmark',
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
  "This game is amazing!"
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
  }

  /**
   * Initialize mock users
   */
  initializeMockUsers() {
    console.log('🎭 Initializing mock users...');
    
    MOCK_USERS.forEach(user => {
      this.mockUsers.set(user.userId, {
        ...user,
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
   * Simulate response to whisper
   */
  simulateWhisperResponse(targetUserId, senderName, addGlobalMessage) {
    const user = this.mockUsers.get(targetUserId);
    if (!user) return;

    const response = WHISPER_RESPONSES[Math.floor(Math.random() * WHISPER_RESPONSES.length)];

    // Simulate delay
    setTimeout(() => {
      const whisperMessage = {
        id: `msg_${uuidv4()}`,
        senderId: user.userId,
        senderName: user.characterName,
        senderClass: user.class,
        senderLevel: user.level,
        targetName: senderName,
        content: response,
        timestamp: new Date().toISOString(),
        type: 'whisper',
        isOutgoing: false
      };

      addGlobalMessage(whisperMessage);
      console.log(`🤫 ${user.characterName} whispered back: ${response}`);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
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
    console.log('🤖 Starting automated chat activity...');

    // Send initial greeting after 2 seconds
    setTimeout(() => {
      this.simulateGreeting(addGlobalMessage);
    }, 2000);

    // Random chat messages every 15-30 seconds
    this.chatInterval = setInterval(() => {
      const onlineUsers = Array.from(this.mockUsers.values()).filter(u => u.status === 'online');
      if (onlineUsers.length === 0) return;

      const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
      this.simulateChatMessage(randomUser.userId, addGlobalMessage);
    }, 15000 + Math.random() * 15000); // 15-30 seconds
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
   * Cleanup
   */
  cleanup() {
    this.stopAutomatedChat();
    this.mockUsers.clear();
  }
}

// Export singleton instance
const mockPresenceService = new MockPresenceService();
export default mockPresenceService;

