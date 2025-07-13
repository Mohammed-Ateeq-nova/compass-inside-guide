import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBUNU4dGXkchVGLL6dHdTixFkCT1dbRKRg",
  authDomain: "stoor-mapper.firebaseapp.com",
  projectId: "stoor-mapper",
  storageBucket: "stoor-mapper.firebasestorage.app",
  messagingSenderId: "866575911426",
  appId: "1:866575911426:web:69025d76b4de389904b51b",
  measurementId: "G-MM85Y7CBLC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;