# Deploy Firebase Rules to Fix Permission Errors

## Critical Issue
The production logs show Firebase permission errors:
```
❌ Error fetching room data: FirebaseError: Missing or insufficient permissions.
❌ Error loading complete game state: FirebaseError: Missing or insufficient permissions.
```

## Solution
Deploy the updated `firestore.rules` file to Firebase Console.

## Steps to Deploy Firebase Rules

### 1. Go to Firebase Console
- Open https://console.firebase.google.com/
- Select your project: `mythrill-ff7c6`

### 2. Navigate to Firestore Database
- Click on "Firestore Database" in the left sidebar
- Click on the "Rules" tab

### 3. Replace Current Rules
Copy the content from `firestore.rules` file and replace the current rules:

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

### 4. Publish Rules
- Click "Publish" button
- Confirm the deployment

### 5. Verify Deployment
- The rules should take effect immediately
- Test multiplayer room creation/joining
- Check console logs for reduced Firebase errors

## Expected Results After Deployment

1. **Eliminated Firebase Permission Errors**: No more "Missing or insufficient permissions" messages
2. **Improved Room Access**: Authenticated users can read room data for joining
3. **Better Multiplayer Sync**: Game state updates work properly
4. **Reduced Error Spam**: Console logs should be much cleaner

## Testing After Deployment

1. Create a multiplayer room as GM
2. Join from another browser/device as player
3. Check console logs - should see no Firebase permission errors
4. Test room functionality (chat, token movement, etc.)

## Rollback Plan

If issues occur, revert to previous rules:
```javascript
// Previous restrictive rules
match /rooms/{roomId} {
  allow read, write: if request.auth != null && 
    (request.auth.uid == resource.data.gmId || 
     request.auth.uid in resource.data.members);
}
```

## Status
- [ ] Firebase rules deployed
- [ ] Permission errors eliminated
- [ ] Multiplayer functionality tested
- [ ] Performance improvements verified
