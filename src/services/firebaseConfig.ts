import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAgqOzY7KU-kh8GxNN4Y8PSNUpqGqadP0U",
  authDomain: "idk1-899ac.firebaseapp.com",
  projectId: "idk1-899ac",
  storageBucket: "idk1-899ac.appspot.com",
  messagingSenderId: "113005765308320049744",
  appId: "1:113005765308320049744:web:abc123def456"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app