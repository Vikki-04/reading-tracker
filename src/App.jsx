import './App.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import { Navbar } from './components/Navbar.jsx'
import { BackToTop } from './components/BackToTop.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { ReadingLog } from './pages/ReadingLog.jsx'
import { TBRList } from './pages/TBRList.jsx'

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ width: '100%', maxWidth: 'none', margin: 0, padding: '24px 16px', boxSizing: 'border-box' }}>
        <Routes>
          <Route path="/" element={<ReadingLog />} />
          <Route path="/tbr" element={<TBRList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BackToTop />
    </div>
  )
}

export default App
