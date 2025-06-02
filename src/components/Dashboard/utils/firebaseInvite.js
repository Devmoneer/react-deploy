import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

/**
 * Updates (or creates) an invite code in Firestore.
 * The invite code is saved in the document 'inviteSettings' under the 'settings' collection.
 *
 * @param {string} code - The invite code to store.
 * @returns {Promise<boolean>} - Resolves to true if the update succeeded.
 */
export const updateInviteCodeInFirestore = async (code) => {
    try {
        // Use merge:true to update only the inviteCode field
        const settingsRef = doc(db, 'settings', 'inviteSettings');
        await setDoc(settingsRef, { inviteCode: code }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error updating invite code:', error);
        throw error;
    }
};