// Demo authentication service for development without Firebase
class DemoAuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
    this.users = new Map(); // Store demo users
    this.isConfigured = true;

    // Load demo user from localStorage if exists
    const savedUser = localStorage.getItem('mythrill-demo-user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  // Create user document in demo storage
  async createUserDocument(user) {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      friendId: user.friendId || this.generateFriendId(),
      preferences: {
        theme: 'pathfinder',
        notifications: true,
        autoSave: true
      },
      characters: []
    };

    // Store in demo storage
    localStorage.setItem(`mythrill-user-${user.uid}`, JSON.stringify(userData));
    return userData;
  }

  // Get user data from demo storage
  async getUserData(uid) {
    const userData = localStorage.getItem(`mythrill-user-${uid}`);
    return userData ? JSON.parse(userData) : null;
  }

  // Update user data in demo storage
  async updateUserData(data) {
    if (!this.currentUser) {
      return { error: 'No user signed in', success: false };
    }

    try {
      const existingData = await this.getUserData(this.currentUser.uid);
      const updatedData = { ...existingData, ...data };

      // Update stored user data
      localStorage.setItem(`mythrill-user-${this.currentUser.uid}`, JSON.stringify(updatedData));

      // Update currentUser object if displayName or photoURL changed
      if (data.displayName || data.photoURL) {
        this.currentUser = {
          ...this.currentUser,
          ...(data.displayName ? { displayName: data.displayName } : {}),
          ...(data.photoURL ? { photoURL: data.photoURL } : {})
        };
        localStorage.setItem('mythrill-demo-user', JSON.stringify(this.currentUser));

        // Update users map as well
        if (this.users.has(this.currentUser.uid)) {
          this.users.set(this.currentUser.uid, {
            ...this.users.get(this.currentUser.uid),
            ...this.currentUser
          });
          localStorage.setItem('mythrill-demo-users', JSON.stringify(Array.from(this.users.entries())));
        }

        this.notifyListeners(this.currentUser);
      }

      return { success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  // Sign up with email and password (demo)
  async signUp(email, password, displayName) {
    try {
      // Check if user already exists
      const existingUsers = this.getAllUsers();
      if (existingUsers.find(u => u.email === email)) {
        return { error: 'User already exists', success: false };
      }

      // Create demo user
      const user = {
        uid: `demo-${Date.now()}`,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: null,
        emailVerified: true
      };

      // Store user
      this.users.set(user.uid, { ...user, password });
      localStorage.setItem('mythrill-demo-users', JSON.stringify(Array.from(this.users.entries())));

      // Create user document
      await this.createUserDocument(user);

      // Set as current user
      this.currentUser = user;
      localStorage.setItem('mythrill-demo-user', JSON.stringify(user));

      // Notify listeners
      this.notifyListeners(user);

      return { user, success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  // Sign in with email and password (demo)
  async signIn(email, password) {
    try {
      const users = this.getAllUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return { error: 'Invalid email or password', success: false };
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      this.currentUser = userWithoutPassword;
      localStorage.setItem('mythrill-demo-user', JSON.stringify(userWithoutPassword));

      // Notify listeners
      this.notifyListeners(userWithoutPassword);

      return { user: userWithoutPassword, success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  // Sign in with Google (demo)
  async signInWithGoogle() {
    try {
      // Simulate Google OAuth popup

      // Create a realistic demo Google user
      const googleUsers = [
        {
          email: 'adventurer@gmail.com',
          displayName: 'Epic Adventurer',
          photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        },
        {
          email: 'dungeonmaster@gmail.com',
          displayName: 'Master of Dungeons',
          photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        },
        {
          email: 'mythrill.player@gmail.com',
          displayName: 'Mythrill Player',
          photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        }
      ];

      // Pick a random demo user or create new one
      const randomUser = googleUsers[Math.floor(Math.random() * googleUsers.length)];

      const user = {
        uid: `google-${Date.now()}`,
        email: randomUser.email,
        displayName: randomUser.displayName,
        photoURL: randomUser.photoURL,
        emailVerified: true,
        providerId: 'google.com'
      };

      // Check if user already exists
      const existingUsers = this.getAllUsers();
      const existingUser = existingUsers.find(u => u.email === user.email);

      if (existingUser) {
        // Sign in existing user
        const { password: _, ...userWithoutPassword } = existingUser;
        this.currentUser = userWithoutPassword;
        localStorage.setItem('mythrill-demo-user', JSON.stringify(userWithoutPassword));
        this.notifyListeners(userWithoutPassword);
        return { user: userWithoutPassword, success: true };
      } else {
        // Create new user
        this.users.set(user.uid, user);
        localStorage.setItem('mythrill-demo-users', JSON.stringify(Array.from(this.users.entries())));

        // Create user document
        await this.createUserDocument(user);

        // Set as current user
        this.currentUser = user;
        localStorage.setItem('mythrill-demo-user', JSON.stringify(user));

        // Notify listeners
        this.notifyListeners(user);
        return { user, success: true };
      }
    } catch (error) {
      console.error('Demo Google sign-in error:', error);
      return { error: error.message, success: false };
    }
  }

  // Sign out
  async signOut() {
    try {
      this.currentUser = null;
      localStorage.removeItem('mythrill-demo-user');

      // Notify listeners
      this.notifyListeners(null);

      return { success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  // Sign in anonymously (for development mode)
  async signInAsAnonymous() {
    try {
      // Create anonymous demo user for development
      const user = {
        uid: `anon-${Date.now()}`,
        email: `anonymous-${Date.now()}@mythrill.local`,
        displayName: 'Development User',
        photoURL: null,
        emailVerified: false,
        isAnonymous: true,
        isDevelopmentUser: true
      };

      // Store user
      this.users.set(user.uid, user);
      localStorage.setItem('mythrill-demo-users', JSON.stringify(Array.from(this.users.entries())));

      // Create user document
      await this.createUserDocument(user);

      // Set as current user
      this.currentUser = user;
      localStorage.setItem('mythrill-demo-user', JSON.stringify(user));

      // Notify listeners
      this.notifyListeners(user);

      console.log('✅ Demo anonymous sign-in successful:', user.uid);
      return { user, success: true };
    } catch (error) {
      console.error('❌ Demo anonymous sign-in error:', error);
      return { error: error.message, success: false };
    }
  }

  // Reset password (demo)
  async resetPassword(email) {
    try {
      const users = this.getAllUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        return { error: 'No user found with this email', success: false };
      }

      // In demo mode, just return success
      return { success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  // Auth state change listener
  onAuthStateChange(callback) {
    this.listeners.push(callback);

    // Immediately call with current user
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Helper methods
  getAllUsers() {
    const stored = localStorage.getItem('mythrill-demo-users');
    if (stored) {
      const entries = JSON.parse(stored);
      this.users = new Map(entries);
      return Array.from(this.users.values());
    }
    return [];
  }

  notifyListeners(user) {
    this.listeners.forEach(callback => callback(user));
  }

  // Generate a unique Friend ID with fantasy flair
  generateFriendId() {
    const prefixes = [
      'Dragon', 'Storm', 'Moon', 'Shadow', 'Gold', 'Iron', 'Sky', 'Fire', 'Ice', 'Frost',
      'Spirit', 'Blade', 'Blood', 'Silver', 'Night', 'Dawn', 'Grim', 'Wild', 'Star', 'Cloud',
      'Void', 'Sun', 'Mist', 'Oak', 'Stone', 'Light', 'Dark', 'Wind', 'Earth', 'Sea'
    ];
    const suffixes = [
      'Whisper', 'Walker', 'Watcher', 'Seeker', 'Hunter', 'Caller', 'Binder', 'Mage', 'Sage',
      'Blade', 'Hammer', 'Heart', 'Soul', 'Song', 'Storm', 'Shield', 'Guard', 'Fang', 'Claw',
      'Eye', 'Wing', 'Breath', 'Path', 'Light', 'Flame', 'Spark', 'Tide', 'Brook', 'Hill', 'Peak'
    ];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randomNums = Math.floor(1000 + Math.random() * 9000); // 4 digits

    return `${prefix}${suffix}${randomNums}`;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

export default new DemoAuthService();
