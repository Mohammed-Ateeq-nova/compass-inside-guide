import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2
          className="text-xl font-semibold text-gray-700 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Shiksha AI
        </motion.h2>
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Loading your learning experience...
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingSpinner