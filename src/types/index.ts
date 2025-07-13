export interface User {
  uid: string
  email: string
  displayName: string
  role: 'student' | 'teacher' | 'admin'
  preferredLanguage: 'en' | 'hi' | 'te'
  grade?: string
  school?: string
  createdAt: Date
}

export interface Subject {
  id: string
  name: string
  nameHi: string
  nameTe: string
  description: string
  descriptionHi: string
  descriptionTe: string
  icon: string
  color: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  titleHi: string
  titleTe: string
  content: string
  contentHi: string
  contentTe: string
  type: 'video' | 'text' | 'interactive'
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  points: number
}

export interface Quiz {
  id: string
  subject: string
  title: string
  titleHi: string
  titleTe: string
  questions: Question[]
  timeLimit: number
  points: number
}

export interface Question {
  id: string
  question: string
  questionHi: string
  questionTe: string
  options: string[]
  optionsHi: string[]
  optionsTe: string[]
  correctAnswer: number
  explanation: string
  explanationHi: string
  explanationTe: string
  points: number
}

export interface UserProgress {
  userId: string
  subjectId: string
  completedLessons: string[]
  completedQuizzes: string[]
  totalPoints: number
  streak: number
  lastActivity: Date
  level: number
}

export interface Achievement {
  id: string
  name: string
  nameHi: string
  nameTe: string
  description: string
  descriptionHi: string
  descriptionTe: string
  icon: string
  condition: string
  points: number
}

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  language: 'en' | 'hi' | 'te'
}