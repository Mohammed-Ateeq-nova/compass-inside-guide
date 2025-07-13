import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebaseConfig'
import { User } from '../types'

class AuthService {
  async signUp(userData: Partial<User> & { password: string }) {
    const { email, password, ...profileData } = userData
    
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    const userProfile: User = {
      uid: user.uid,
      email: user.email!,
      displayName: profileData.displayName || '',
      role: profileData.role || 'student',
      preferredLanguage: profileData.preferredLanguage || 'en',
      grade: profileData.grade,
      school: profileData.school,
      createdAt: new Date()
    }

    await setDoc(doc(db, 'users', user.uid), userProfile)
    return userProfile
  }

  async signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }

  async signOut() {
    await signOut(auth)
  }

  async getUserProfile(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data() as User
    }
    return null
  }

  async updateUserProfile(uid: string, userData: Partial<User>) {
    await updateDoc(doc(db, 'users', uid), userData)
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userProfile = await this.getUserProfile(firebaseUser.uid)
        callback(userProfile)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()