const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!serviceAccountPath) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT_PATH not found in .env');
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, '..', serviceAccountPath), 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: projectId
});

const db = admin.firestore();

async function deleteAllRooms() {
    console.log('🔄 Fetching all rooms...');
    const roomsRef = db.collection('rooms');
    const snapshot = await roomsRef.get();

    if (snapshot.empty) {
        console.log('✅ No rooms found to delete.');
        return;
    }

    console.log(`🗑️ Found ${snapshot.size} rooms. Starting deletion...`);

    const batchSize = 500;
    let batch = db.batch();
    let count = 0;

    for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        count++;

        // Also delete core data if it exists in subcollections (split storage)
        const gameStateRef = doc.ref.collection('gameState');
        const gameStateSnapshot = await gameStateRef.get();
        gameStateSnapshot.forEach(subDoc => {
            batch.delete(subDoc.ref);
        });

        const chatRef = doc.ref.collection('chat');
        const chatSnapshot = await chatRef.get();
        chatSnapshot.forEach(subDoc => {
            batch.delete(subDoc.ref);
        });

        if (count % batchSize === 0) {
            await batch.commit();
            batch = db.batch();
            console.log(`✅ Deleted ${count} rooms...`);
        }
    }

    if (count % batchSize !== 0) {
        await batch.commit();
    }

    console.log(`✨ Successfully deleted all ${count} rooms and their subcollections.`);
}

deleteAllRooms().catch(err => {
    console.error('❌ Error deleting rooms:', err);
    process.exit(1);
});
