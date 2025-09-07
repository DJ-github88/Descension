# Firebase Setup for Community Spells

This guide will help you set up Firebase for the community spell system.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "dnd-community-spells")
4. Enable Google Analytics (optional)
5. Create the project

## 2. Set up Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Update Configuration

**Good news!** Firebase is already configured in your project. The configuration is in `src/config/firebase.js` and uses environment variables.

You have two options:

### Option A: Use Environment Variables (Recommended)
Create a `.env.local` file in your project root with your Firebase configuration:

```bash
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Option B: Update the Hardcoded Values
Edit `src/config/firebase.js` and replace the fallback values in the firebaseConfig object.

## 5. Set up Firestore Security Rules

In the Firestore console, go to "Rules" and update them:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to public spells
    match /community_spells/{spellId} {
      allow read: if resource.data.isPublic == true;
      allow write: if request.auth != null;
    }
    
    // Allow read access to categories
    match /spell_categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow users to manage their own ratings
    match /spell_ratings/{ratingId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 6. Initialize Categories (Optional)

You can manually add some initial categories to your Firestore database:

1. Go to Firestore Database
2. Click "Start collection"
3. Collection ID: `spell_categories`
4. Add documents with the following structure:

```json
{
  "name": "Damage Spells",
  "description": "Spells that deal damage to enemies",
  "icon": "spell_fire_fireball02",
  "color": "#FF4500"
}
```

## 7. Authentication (Optional)

For user authentication:

1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Choose sign-in methods (Email/Password, Google, etc.)
4. Enable the methods you want to use

## 8. Test the Connection

1. Start your React app
2. Open the Spellbook window
3. Click on the "Community" tab
4. You should see the community spells interface

## Troubleshooting

- **Connection errors**: Check your Firebase configuration
- **Permission denied**: Verify your Firestore security rules
- **No categories showing**: Add some categories manually in Firestore
- **Offline message**: Check your internet connection

## Production Considerations

1. **Security Rules**: Update rules for production use
2. **Indexes**: Create composite indexes as needed
3. **Billing**: Set up billing alerts
4. **Backup**: Enable automatic backups
5. **Monitoring**: Set up error monitoring

## Community Features

Once set up, users can:
- Browse spells by category
- Search for spells
- Download spells to their local library
- Rate and review spells (with authentication)
- Upload their own spells (with authentication)

The system is designed to be a true MMO-style community database where players can share their creations!
