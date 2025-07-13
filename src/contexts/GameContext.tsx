import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { gameService } from '../services/gameService'
import { Achievement, UserProgress } from '../types'

interface GameContextType {
  userProgress: UserProgress | null
  achievements: Achievement[]
  unlockedAchievements: string[]
  addPoints: (points: number, source: string) => Promise<void>
  completeLesson: (subjectId: string, lessonId: string) => Promise<void>
  completeQuiz: (subjectId: string, quizId: string, score: number) => Promise<void>
  updateStreak: () => Promise<void>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      loadUserProgress()
      loadAchievements()
    }
  }, [user])

  const loadUserProgress = async () => {
    if (!user) return
    try {
      const progress = await gameService.getUserProgress(user.uid)
      setUserProgress(progress)
    } catch (error) {
      console.error('Failed to load user progress:', error)
    }
  }

  const loadAchievements = async () => {
    try {
      const allAchievements = await gameService.getAchievements()
      setAchievements(allAchievements)
      
      if (user) {
        const unlocked = await gameService.getUserAchievements(user.uid)
        setUnlockedAchievements(unlocked)
      }
    } catch (error) {
      console.error('Failed to load achievements:', error)
    }
  }

  const addPoints = async (points: number, source: string) => {
    if (!user || !userProgress) return
    
    try {
      const newProgress = await gameService.addPoints(user.uid, points, source)
      setUserProgress(newProgress)
      
      // Check for new achievements
      const newAchievements = await gameService.checkAchievements(user.uid, newProgress)
      if (newAchievements.length > 0) {
        setUnlockedAchievements(prev => [...prev, ...newAchievements])
      }
    } catch (error) {
      console.error('Failed to add points:', error)
    }
  }

  const completeLesson = async (subjectId: string, lessonId: string) => {
    if (!user) return
    
    try {
      const newProgress = await gameService.completeLesson(user.uid, subjectId, lessonId)
      setUserProgress(newProgress)
      await addPoints(50, 'lesson_completion')
    } catch (error) {
      console.error('Failed to complete lesson:', error)
    }
  }

  const completeQuiz = async (subjectId: string, quizId: string, score: number) => {
    if (!user) return
    
    try {
      const newProgress = await gameService.completeQuiz(user.uid, subjectId, quizId, score)
      setUserProgress(newProgress)
      await addPoints(score * 10, 'quiz_completion')
    } catch (error) {
      console.error('Failed to complete quiz:', error)
    }
  }

  const updateStreak = async () => {
    if (!user) return
    
    try {
      const newProgress = await gameService.updateStreak(user.uid)
      setUserProgress(newProgress)
    } catch (error) {
      console.error('Failed to update streak:', error)
    }
  }

  return (
    <GameContext.Provider value={{
      userProgress,
      achievements,
      unlockedAchievements,
      addPoints,
      completeLesson,
      completeQuiz,
      updateStreak
    }}>
      {children}
    </GameContext.Provider>
  )
}