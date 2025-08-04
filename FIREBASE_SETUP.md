# Firebase Authentication Setup Guide

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `mythrill-dnd` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Choose or create a Google Analytics account
6. Click "Create project"

### Step 2: Enable Authentication
1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google**: Click, toggle "Enable", and add your project's support email

### Step 3: Enable Firestore Database
1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (we'll secure it later)
4. Select a location (choose closest to your users)
5. Click **Done**

### Step 4: Get Firebase Configuration
1. Go to **Project Settings** (gear icon in left sidebar)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app with nickname: `mythrill-web`
5. Copy the `firebaseConfig` object

### Step 5: Configure Environment Variables
1. In your `vtt-react` folder, create `.env.local` file
2. Copy the template from `.env.example`
3. Fill in your Firebase configuration:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🔐 Google OAuth Setup

### Step 1: Configure OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **OAuth consent screen**
4. Choose **External** user type
5. Fill in required fields:
   - App name: `Mythrill D&D`
   - User support email: your email
   - Developer contact: your email
6. Add scopes: `email`, `profile`, `openid`
7. Add test users (your email and any testers)

### Step 2: Configure Authorized Domains
1. In Firebase Console, go to **Authentication** > **Settings**
2. In **Authorized domains** tab, add:
   - `localhost` (for development)
   - `windtunnel.netlify.app` (for production)
   - Any other domains you'll use

## 🛡️ Firestore Security Rules

Replace the default rules with these secure rules:

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
      allow write: if false; // Only admins can write (we'll handle this separately)
    }
    
    // Multiplayer rooms - users can read rooms they're in
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || request.auth.uid in resource.data.members);
    }
  }
}
```

## 🚀 Testing the Setup

### Step 1: Start Development Server
```bash
cd vtt-react
npm start
```

### Step 2: Test Authentication
1. Go to `http://localhost:3000`
2. You should see login/register options
3. Try creating an account with email/password
4. Try signing in with Google
5. Check Firebase Console > Authentication to see users

### Step 3: Verify Database
1. After creating an account, check Firestore Database
2. You should see a `users` collection with your user document
3. User document should contain profile and preference data

## 🔧 Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to Authorized domains in Firebase Console

2. **"Firebase: Error (auth/popup-blocked)"**
   - Allow popups for your domain or use redirect method

3. **"Firebase: Error (auth/operation-not-allowed)"**
   - Enable the authentication provider in Firebase Console

4. **Environment variables not loading**
   - Ensure `.env.local` is in the `vtt-react` folder
   - Restart the development server after adding env vars
   - Variables must start with `REACT_APP_`

### Development vs Production:

- **Development**: Uses `localhost:3000`
- **Production**: Uses `windtunnel.netlify.app`
- Make sure both domains are authorized in Firebase

## 📱 Next Steps

Once authentication is working:

1. **User Profile Integration**: Connect character data to user accounts
2. **Multiplayer Enhancement**: Link authenticated users to multiplayer rooms
3. **Data Persistence**: Save character progress, items, and game state
4. **Social Features**: Friend lists, shared campaigns, etc.

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify Firebase configuration in `.env.local`
3. Ensure all Firebase services are enabled
4. Check Firestore security rules are applied correctly

The authentication system is now ready for integration with your existing game features!
