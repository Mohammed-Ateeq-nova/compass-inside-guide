import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Star,
  Play,
  Award,
  Target,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useGame } from '../contexts/GameContext'
import { subjects } from '../data/subjects'
import { getLocalizedTitle } from '../utils/translations'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const { userProgress, achievements, unlockedAchievements, updateStreak } = useGame()

  useEffect(() => {
    updateStreak()
  }, [])

  const recentAchievements = achievements
    .filter(achievement => unlockedAchievements.includes(achievement.id))
    .slice(-3)

  const progressData = subjects.map(subject => ({
    ...subject,
    progress: Math.floor(Math.random() * 100), // Mock progress data
    lessonsCompleted: Math.floor(Math.random() * 10),
    totalLessons: subject.lessons.length
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('welcomeBack')}, {user?.displayName}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to continue your learning journey?
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('points')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress?.totalPoints || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('level')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress?.level || 1}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('streak')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress?.streak || 0} days
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lessons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress?.completedLessons.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                <BookOpen className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('continueLesson')}
              </h2>
              <div className="space-y-4">
                {progressData.slice(0, 2).map((subject, index) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${subject.color} rounded-lg flex items-center justify-center text-2xl`}>
                        {subject.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getLocalizedTitle(subject, language)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {subject.lessonsCompleted}/{subject.totalLessons} lessons completed
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/subjects`}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      <Play size={16} className="mr-1" />
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Subject Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Subject Progress
              </h2>
              <div className="space-y-4">
                {progressData.map((subject) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        {getLocalizedTitle(subject, language)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {subject.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${subject.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="card p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/ai-tutor"
                  className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Brain className="text-blue-600" size={20} />
                  <span className="font-medium text-blue-700">{t('aiTutor')}</span>
                </Link>
                <Link
                  to="/subjects"
                  className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <BookOpen className="text-green-600" size={20} />
                  <span className="font-medium text-green-700">{t('subjects')}</span>
                </Link>
                <Link
                  to="/quiz/coding"
                  className="flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <Target className="text-purple-600" size={20} />
                  <span className="font-medium text-purple-700">{t('takeQuiz')}</span>
                </Link>
              </div>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="card p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('recentAchievements')}
              </h2>
              {recentAchievements.length > 0 ? (
                <div className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {getLocalizedTitle(achievement, language)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          +{achievement.points} points
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500">
                    Complete lessons to earn achievements!
                  </p>
                </div>
              )}
            </motion.div>

            {/* Daily Goal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="card p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Daily Goal
              </h2>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#f97316"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.65) }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">65%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  2 of 3 lessons completed today
                </p>
                <p className="text-xs text-gray-500">
                  Keep going! You're doing great! 🎉
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard