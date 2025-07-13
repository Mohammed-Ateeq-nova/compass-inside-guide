import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useLanguage } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import AITutor from './pages/AITutor'
import Profile from './pages/Profile'
import Quiz from './pages/Quiz'
import Lesson from './pages/Lesson'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const { user, loading } = useAuth()
  const { language } = useLanguage()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={`min-h-screen ${language === 'hi' ? 'font-hindi' : language === 'te' ? 'font-telugu' : ''}`}>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/subjects" element={user ? <Subjects /> : <Navigate to="/login" />} />
          <Route path="/ai-tutor" element={user ? <AITutor /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/quiz/:subject" element={user ? <Quiz /> : <Navigate to="/login" />} />
          <Route path="/lesson/:subject/:lessonId" element={user ? <Lesson /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App