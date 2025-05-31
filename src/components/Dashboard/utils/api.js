import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

export const fetchDashboardData = async (currentUser) => {
  if (!currentUser.emailVerified) {
    throw new Error('Email not verified');
  }

  const userDocRef = doc(db, "users", currentUser.uid);
  const transactionsQuery = query(
    collection(db, "transactions"),
    where("userId", "==", currentUser.uid)
  );

  const [userDoc, transactionsSnapshot] = await Promise.all([
    getDoc(userDocRef),
    getDocs(transactionsQuery)
  ]);

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const userData = userDoc.data();
  const transactionsData = transactionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  let usersData = [];
  if (userData.role === 'owner') {
    const usersSnapshot = await getDocs(collection(db, "users"));
    usersData = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  return { userData, transactionsData, usersData };
};