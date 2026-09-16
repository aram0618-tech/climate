import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with specific databaseId if provided
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Connection on boot
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const q = query(collection(db, 'students'), limit(1));
    await getDocs(q);
    console.log('Firebase Firestore connection verified.');
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    return false;
  }
}

export { app };
