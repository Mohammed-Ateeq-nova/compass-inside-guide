import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebaseConfig'
import { UserProgress, Achievement } from '../types'

class GameService {
  async getUserProgress(userId: string): Promise<UserProgress> {
    const progressDoc = await getDoc(doc(db, 'userProgress', userId))
    
    if (progressDoc.exists()) {
      return progressDoc.data() as UserProgress
    } else {
      // Create initial progress
      const initialProgress: UserProgress = {
        userId,
        subjectId: '',
        completedLessons: [],
        completedQuizzes: [],
        totalPoints: 0,
        streak: 0,
        lastActivity: new Date(),
        level: 1
      }
      
      await setDoc(doc(db, 'userProgress', userId), initialProgress)
      return initialProgress
    }
  }

  async addPoints(userId: string, points: number, source: string): Promise<UserProgress> {
    const progressRef = doc(db, 'userProgress', userId)
    const progressDoc = await getDoc(progressRef)
    
    if (progressDoc.exists()) {
      const currentProgress = progressDoc.data() as UserProgress
      const newTotalPoints = currentProgress.totalPoints + points
      const newLevel = Math.floor(newTotalPoints / 1000) + 1
      
      const updatedProgress = {
        ...currentProgress,
        totalPoints: newTotalPoints,
        level: newLevel,
        lastActivity: new Date()
      }
      
      await updateDoc(progressRef, updatedProgress)
      
      // Log the points activity
      await setDoc(doc(db, 'pointsHistory', `${userId}_${Date.now()}`), {
        userId,
        points,
        source,
        timestamp: new Date()
      })
      
      return updatedProgress
    }
    
    throw new Error('User progress not found')
  }

  async completeLesson(userId: string, subjectId: string, lessonId: string): Promise<UserProgress> {
    const progressRef = doc(db, 'userProgress', userId)
    const progressDoc = await getDoc(progressRef)
    
    if (progressDoc.exists()) {
      const currentProgress = progressDoc.data() as UserProgress
      const lessonKey = `${subjectId}_${lessonId}`
      
      if (!currentProgress.completedLessons.includes(lessonKey)) {
        const updatedProgress = {
          ...currentProgress,
          completedLessons: [...currentProgress.completedLessons, lessonKey],
          lastActivity: new Date()
        }
        
        await updateDoc(progressRef, updatedProgress)
        return updatedProgress
      }
      
      return currentProgress
    }
    
    throw new Error('User progress not found')
  }

  async completeQuiz(userId: string, subjectId: string, quizId: string, score: number): Promise<UserProgress> {
    const progressRef = doc(db, 'userProgress', userId)
    const progressDoc = await getDoc(progressRef)
    
    if (progressDoc.exists()) {
      const currentProgress = progressDoc.data() as UserProgress
      const quizKey = `${subjectId}_${quizId}`
      
      const updatedProgress = {
        ...currentProgress,
        completedQuizzes: [...currentProgress.completedQuizzes.filter(q => !q.startsWith(quizKey)), `${quizKey}_${score}`],
        lastActivity: new Date()
      }
      
      await updateDoc(progressRef, updatedProgress)
      
      // Log quiz completion
      await setDoc(doc(db, 'quizHistory', `${userId}_${quizId}_${Date.now()}`), {
        userId,
        subjectId,
        quizId,
        score,
        timestamp: new Date()
      })
      
      return updatedProgress
    }
    
    throw new Error('User progress not found')
  }

  async updateStreak(userId: string): Promise<UserProgress> {
    const progressRef = doc(db, 'userProgress', userId)
    const progressDoc = await getDoc(progressRef)
    
    if (progressDoc.exists()) {
      const currentProgress = progressDoc.data() as UserProgress
      const today = new Date()
      const lastActivity = currentProgress.lastActivity.toDate ? currentProgress.lastActivity.toDate() : new Date(currentProgress.lastActivity)
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
      
      let newStreak = currentProgress.streak
      
      if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1
      }
      // If daysDiff === 0, same day, keep current streak
      
      const updatedProgress = {
        ...currentProgress,
        streak: newStreak,
        lastActivity: today
      }
      
      await updateDoc(progressRef, updatedProgress)
      return updatedProgress
    }
    
    throw new Error('User progress not found')
  }

  async getAchievements(): Promise<Achievement[]> {
    const achievementsSnapshot = await getDocs(collection(db, 'achievements'))
    return achievementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement))
  }

  async getUserAchievements(userId: string): Promise<string[]> {
    const userAchievementsSnapshot = await getDocs(
      query(collection(db, 'userAchievements'), where('userId', '==', userId))
    )
    return userAchievementsSnapshot.docs.map(doc => doc.data().achievementId)
  }

  async checkAchievements(userId: string, progress: UserProgress): Promise<string[]> {
    const allAchievements = await this.getAchievements()
    const userAchievements = await this.getUserAchievements(userId)
    const newAchievements: string[] = []
    
    for (const achievement of allAchievements) {
      if (!userAchievements.includes(achievement.id)) {
        let unlocked = false
        
        switch (achievement.condition) {
          case 'first_lesson':
            unlocked = progress.completedLessons.length >= 1
            break
          case 'ten_lessons':
            unlocked = progress.completedLessons.length >= 10
            break
          case 'first_quiz':
            unlocked = progress.completedQuizzes.length >= 1
            break
          case 'perfect_quiz':
            unlocked = progress.completedQuizzes.some(quiz => quiz.endsWith('_100'))
            break
          case 'week_streak':
            unlocked = progress.streak >= 7
            break
          case 'thousand_points':
            unlocked = progress.totalPoints >= 1000
            break
          case 'level_five':
            unlocked = progress.level >= 5
            break
        }
        
        if (unlocked) {
          newAchievements.push(achievement.id)
          
          // Save user achievement
          await setDoc(doc(db, 'userAchievements', `${userId}_${achievement.id}`), {
            userId,
            achievementId: achievement.id,
            unlockedAt: new Date()
          })
        }
      }
    }
    
    return newAchievements
  }
}

export const gameService = new GameService()