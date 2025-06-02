import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

export const fetchDashboardData = async (currentUser) => {
  if (!currentUser.emailVerified) {
    throw new Error('Email not verified');
  }

  // Get the current user's document
  const userDocRef = doc(db, "users", currentUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const userData = userDoc.data();

  console.log("Current user data:", userData);

  // Fetch transactions for the current user (for accountants)
  let transactionsData = [];
  const transactionsQuery = query(
    collection(db, "transactions"),
    where("userId", "==", currentUser.uid)
  );
  const transactionsSnapshot = await getDocs(transactionsQuery);
  transactionsData = transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // For company owners, fetch only the accountants associated with this owner.
  let usersData = [];
  if (userData.role === 'owner') {
    const accountantsQuery = query(
      collection(db, "users"),
      where("role", "==", "accountant"),
      where("ownerId", "==", currentUser.uid) // This field must be set when accountants register
    );
    const accountantsSnapshot = await getDocs(accountantsQuery);
    usersData = accountantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched accountants for owner:", usersData);
  }

  return { userData, transactionsData, usersData };
};