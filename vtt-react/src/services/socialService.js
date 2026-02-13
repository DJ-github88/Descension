import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    serverTimestamp,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

import { v4 as uuidv4 } from 'uuid';

const REQUESTS_COLLECTION = 'friendRequests';

class SocialService {
    /**
     * Send a friend request to another user
     */
    async sendFriendRequest(senderData, targetUser) {
        if (!db || !auth.currentUser) return { error: 'Not authenticated', success: false };

        try {
            // Check if a request already exists between these users
            const requestsRef = collection(db, REQUESTS_COLLECTION);

            // Check sent
            const qSent = query(requestsRef,
                where('senderId', '==', auth.currentUser.uid),
                where('receiverId', '==', targetUser.id)
            );
            const snapSent = await getDocs(qSent);

            // Check received
            const qReceived = query(requestsRef,
                where('senderId', '==', targetUser.id),
                where('receiverId', '==', auth.currentUser.uid)
            );
            const snapReceived = await getDocs(qReceived);

            if (!snapSent.empty || !snapReceived.empty) {
                const existing = [...snapSent.docs, ...snapReceived.docs][0].data();
                if (existing.status === 'pending') {
                    return { error: 'Friend request already pending', success: false };
                }
                if (existing.status === 'accepted') {
                    return { error: 'Already friends', success: false };
                }
            }

            console.log('📤 Sending friend request to:', targetUser.id);
            const requestId = uuidv4();
            const requestRef = doc(db, REQUESTS_COLLECTION, requestId);

            const requestData = {
                id: requestId,
                senderId: auth.currentUser.uid,
                senderName: senderData.displayName || senderData.email?.split('@')[0] || 'Unknown',
                senderFriendId: senderData.friendId,
                senderPhotoURL: senderData.photoURL || null,
                receiverId: targetUser.id,
                receiverName: targetUser.displayName || targetUser.email?.split('@')[0],
                receiverFriendId: targetUser.friendId,
                receiverPhotoURL: targetUser.photoURL || null,
                status: 'pending',
                timestamp: serverTimestamp()
            };

            await setDoc(requestRef, requestData);
            console.log('✅ Friend request sent successfully! ID:', requestId);
            return { success: true };
        } catch (error) {
            console.error('Error sending friend request:', error);
            return { error: error.message, success: false };
        }
    }

    /**
     * Add a friend to the current user's document using arrayUnion
     */
    async addFriendToMyList(friendInfo) {
        if (!db || !auth.currentUser) return { error: 'Not authenticated', success: false };
        try {
            const myUserRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(myUserRef, {
                friends: arrayUnion({
                    id: friendInfo.id,
                    name: friendInfo.name,
                    friendId: friendInfo.friendId,
                    photoURL: friendInfo.photoURL || null,
                    addedAt: Date.now()
                })
            });
            return { success: true };
        } catch (error) {
            console.error('Error adding friend to my list:', error);
            return { error: error.message, success: false };
        }
    }

    /**
     * Accept a friend request
     * - Status becomes 'accepted'
     * - Current user (receiver) adds sender to their list
     * - Sender will detect 'accepted' status and add receiver to their list
     */
    async acceptFriendRequest(requestId, userData, friendData) {
        if (!db || !auth.currentUser) return { error: 'Not authenticated', success: false };

        try {
            const requestRef = doc(db, REQUESTS_COLLECTION, requestId);

            // 1. Update request status to 'accepted'
            // No permission error here because anyone can update status if they are receiver
            await updateDoc(requestRef, {
                status: 'accepted',
                updatedAt: serverTimestamp()
            });

            // 2. Add sender to MY (the receiver) friends list
            await this.addFriendToMyList({
                id: friendData.senderId,
                name: friendData.senderName,
                friendId: friendData.senderFriendId,
                photoURL: friendData.senderPhotoURL || null
            });

            return { success: true };
        } catch (error) {
            console.error('Error accepting friend request:', error);
            return { error: error.message, success: false };
        }
    }

    /**
     * Delete/Cleanup a friend request
     */
    async deleteFriendRequest(requestId) {
        if (!db) return { error: 'Not authenticated', success: false };
        try {
            await deleteDoc(doc(db, REQUESTS_COLLECTION, requestId));
            return { success: true };
        } catch (error) {
            console.error('Error deleting friend request:', error);
            return { error: error.message, success: false };
        }
    }

    /**
     * Decline a friend request
     */
    async declineFriendRequest(requestId) {
        if (!db) return { error: 'Not authenticated', success: false };

        try {
            const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
            await updateDoc(requestRef, {
                status: 'declined',
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error declining friend request:', error);
            return { error: error.message, success: false };
        }
    }

    /**
     * Remove a friend
     */
    async removeFriend(myUid, myUserData, friendId) {
        if (!db) return { error: 'Not authenticated', success: false };

        try {
            const myUserRef = doc(db, 'users', myUid);
            const friendUserRef = doc(db, 'users', friendId);

            // Let's get the latest docs to be safe
            const mySnap = await getDoc(myUserRef);
            const friendSnap = await getDoc(friendUserRef);

            if (mySnap.exists()) {
                const myFriends = mySnap.data().friends || [];
                const updatedMyFriends = myFriends.filter(f => f.id !== friendId);
                await updateDoc(myUserRef, { friends: updatedMyFriends });
            }

            if (friendSnap.exists()) {
                const friendFriends = friendSnap.data().friends || [];
                const updatedFriendFriends = friendFriends.filter(f => f.id !== myUid);
                await updateDoc(friendUserRef, { friends: updatedFriendFriends });
            }

            return { success: true };
        } catch (error) {
            console.error('Error removing friend:', error);
            return { error: error.message, success: false };
        }
    }

    /**
     * Listen to incoming friend requests
     */
    subscribeToRequests(userId, callback) {
        if (!db) return () => { };

        const q = query(
            collection(db, REQUESTS_COLLECTION),
            where('receiverId', '==', userId),
            where('status', '==', 'pending')
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'received'
            }));
            callback(requests);
        }, (error) => {
            console.error('Error in friend requests subscription:', error);
        });
    }

    /**
     * Listen to sent friend requests (to track their status)
     */
    subscribeToSentRequests(userId, callback) {
        if (!db) return () => { };

        const q = query(
            collection(db, REQUESTS_COLLECTION),
            where('senderId', '==', userId),
            where('status', '==', 'pending')
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'sent'
            }));
            callback(requests);
        });
    }

    /**
     * Listen to friends list updates in the user document
     */
    subscribeToFriends(userId, callback) {
        if (!db) return () => { };

        const userRef = doc(db, 'users', userId);
        return onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                callback(data.friends || []);
            }
        }, (error) => {
            console.error('Error in friends subscription:', error);
        });
    }

    /**
     * Listen to sent requests that were accepted
     */
    subscribeToAcceptedRequests(userId, callback) {
        if (!db) return () => { };

        const q = query(
            collection(db, REQUESTS_COLLECTION),
            where('senderId', '==', userId),
            where('status', '==', 'accepted')
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                type: 'sent'
            }));
            callback(requests);
        });
    }
}

const socialService = new SocialService();
export default socialService;
