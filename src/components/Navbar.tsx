import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  BookOpen, 
  Brain, 
  User, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Globe,
  Settings
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    ...(user ? [
      { path: '/dashboard', icon: BookOpen, label: t('dashboard') },
      { path: '/subjects', icon: BookOpen, label: t('subjects') },
      { path: '/ai-tutor', icon: Brain, label: t('aiTutor') },
      { path: '/profile', icon: User, label: t('profile') }
    ] : [])
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-sm">SA</span>
            </motion.div>
            <span className="font-bold text-xl gradient-text">Shiksha AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              >
                <Globe size={18} />
                <span className="text-sm font-medium">
                  {languages.find(lang => lang.code === language)?.flag}
                </span>
              </button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as 'en' | 'hi' | 'te')
                          setIsLanguageMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                          language === lang.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth buttons */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>{t('logout')}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <LogIn size={18} />
                  <span>{t('login')}</span>
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {/* Language selector for mobile */}
              <div className="px-3 py-3">
                <div className="flex items-center space-x-3 mb-2">
                  <Globe size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-700">{t('changeLanguage')}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 ml-8">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as 'en' | 'hi' | 'te')
                        setIsMenuOpen(false)
                      }}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        language === lang.code
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg">{lang.flag}</div>
                        <div className="text-xs">{lang.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth buttons for mobile */}
              <div className="border-t border-gray-200 pt-2">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">{t('logout')}</span>
                  </button>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LogIn size={20} />
                      <span className="font-medium">{t('login')}</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                    >
                      {t('register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar