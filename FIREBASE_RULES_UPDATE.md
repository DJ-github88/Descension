# Firebase Security Rules Update

## Current Issue
Players joining multiplayer rooms are getting "Missing or insufficient permissions" errors because they're not being added to the Firebase room's `members` array when they join via socket.

## Temporary Fix
Update the Firebase security rules to be less restrictive for authenticated users while maintaining security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own characters
    match /users/{userId}/characters/{characterId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public game data (items, spells, etc.) - read only
    match /gameData/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Multiplayer rooms - UPDATED RULES for better compatibility
    match /rooms/{roomId} {
      // Allow reading any room for authenticated users (they still need password to join)
      allow read: if request.auth != null;

      // Allow creating rooms (user becomes GM)
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.gmId;

      // Allow GM to update room settings and game state
      // Also allow any authenticated user to update gameState for multiplayer sync
      allow update: if request.auth != null &&
        (request.auth.uid == resource.data.gmId ||
         ('gameState' in request.resource.data && 
          request.resource.data.keys().hasOnly(['gameState', 'lastActivity'])));

      // Allow GM to delete rooms
      allow delete: if request.auth != null &&
        request.auth.uid == resource.data.gmId;
    }

    // Room sessions for active multiplayer sessions
    match /roomSessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Long-term Fix
The proper solution is to update the server-side join_room handler to also add players to the Firebase room's members array when they join via socket.

## How to Apply
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click on "Rules" tab
4. Replace the current rules with the updated rules above
5. Click "Publish"

This will allow authenticated users to read room data and update game state, which should resolve the permission errors while maintaining security.
