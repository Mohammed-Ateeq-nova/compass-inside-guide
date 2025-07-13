import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Partial<User> & { password: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password)
      toast.success('Successfully logged in!')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    }
  }

  const register = async (userData: Partial<User> & { password: string }) => {
    try {
      await authService.signUp(userData)
      toast.success('Account created successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.signOut()
      toast.success('Successfully logged out!')
    } catch (error: any) {
      toast.error(error.message || 'Logout failed')
      throw error
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (user) {
        await authService.updateUserProfile(user.uid, userData)
        setUser({ ...user, ...userData })
        toast.success('Profile updated successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Profile update failed')
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}