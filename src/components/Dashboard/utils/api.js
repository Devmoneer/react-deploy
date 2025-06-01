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
  let transactionsData = [];

  if (userData.role === 'owner') {
    // If the current user is the company owner, fetch accountant transactions as well.
    const accountantQuery = query(
      collection(db, "users"),
      where("role", "==", "accountant")
    );
    const accountantSnapshot = await getDocs(accountantQuery);
    const accountantIds = accountantSnapshot.docs.map(doc => doc.id);

    // Combine owner's id with accountant ids (Firestore "in" queries support up to 10 items)
    const idsList = [currentUser.uid, ...accountantIds];

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("userId", "in", idsList)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    transactionsData = transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    // For accountants, fetch only their own transactions.
    const transactionsQuery = query(
      collection(db, "transactions"),
      where("userId", "==", currentUser.uid)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    transactionsData = transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  let usersData = [];
  if (userData.role === 'owner') {
    const usersSnapshot = await getDocs(collection(db, "users"));
    usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  return { userData, transactionsData, usersData };
};