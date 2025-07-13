import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Trophy, 
  Wifi, 
  ArrowRight, 
  Star, 
  Users, 
  BookOpen,
  Zap,
  Globe,
  Heart
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Home: React.FC = () => {
  const { t } = useLanguage()

  const features = [
    {
      icon: Brain,
      title: t('aiTutorFeature'),
      description: t('aiTutorDesc'),
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Trophy,
      title: t('gamifiedFeature'),
      description: t('gamifiedDesc'),
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Wifi,
      title: t('offlineFeature'),
      description: t('offlineDesc'),
      color: 'from-green-500 to-teal-600'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Students Learning', labelHi: 'छात्र सीख रहे हैं', labelTe: 'విద్యార్థులు నేర్చుకుంటున్నారు' },
    { number: '500+', label: 'Lessons Available', labelHi: 'उपलब्ध पाठ', labelTe: 'అందుబాటులో ఉన్న పాఠాలు' },
    { number: '3', label: 'Languages Supported', labelHi: 'समर्थित भाषाएं', labelTe: 'మద్దతు ఉన్న భాషలు' },
    { number: '95%', label: 'Success Rate', labelHi: 'सफलता दर', labelTe: 'విజయ రేటు' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="gradient-text">{t('heroTitle')}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {t('heroSubtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                {t('getStarted')}
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="#features" className="btn-secondary text-lg px-8 py-4">
                {t('learnMore')}
              </Link>
            </motion.div>

            {/* Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💻</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{t('coding')}</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔢</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{t('mathematics')}</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{t('generalKnowledge')}</h3>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose <span className="gradient-text">Shiksha AI</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Experience the future of education with AI-powered personalized learning
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card p-8 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Support Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Learn in <span className="gradient-text">Your Language</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Breaking language barriers to make quality education accessible to every Indian student
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card p-8 text-center"
            >
              <div className="text-6xl mb-4">🇺🇸</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">English</h3>
              <p className="text-gray-600">Global language for international opportunities</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-8 text-center border-2 border-primary-200"
            >
              <div className="text-6xl mb-4">🇮🇳</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">हिंदी</h3>
              <p className="text-gray-600">भारत की राष्ट्रीय भाषा में सीखें</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card p-8 text-center"
            >
              <div className="text-6xl mb-4">🇮🇳</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">తెలుగు</h3>
              <p className="text-gray-600">దక్షిణ భారతదేశంలో అత్యధికంగా మాట్లాడే భాష</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning with Shiksha AI
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-100 transition-colors text-lg"
            >
              {t('getStarted')}
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home