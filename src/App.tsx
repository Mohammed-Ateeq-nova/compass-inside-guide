import { Routes, Route, Navigate } from 'react-router-dom'
import { IndoorNavApp } from './components/IndoorNavApp'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <Routes>
          <Route path="/" element={<IndoorNavApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App