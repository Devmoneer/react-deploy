import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';  // Added for Realtime Database


const firebaseConfig = {
  apiKey: "AIzaSyBvnm_vCvuImaPwbbLniykutJsjdU7kMMI",
  authDomain: "moneerwebapp-fa166.firebaseapp.com",
  projectId: "moneerwebapp-fa166",
  storageBucket: "moneerwebapp-fa166.firebasestorage.app",
  messagingSenderId: "936666618536",
  appId: "1:936666618536:web:81226612b09925960a809d",
  measurementId: "G-VJ8QSE2ZKK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app); // Firebase Realtime Database instance
export const sendResetEmail = sendPasswordResetEmail;