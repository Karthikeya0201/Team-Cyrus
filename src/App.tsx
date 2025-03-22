import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import EnhanceCV from './components/EnhanceCV'
import CreateCV from './components/CreateCV'
import ATSScore from './components/ATSScore'
import LandingPage from './components/LandingPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page without Layout */}
        <Route path="/" element={<LandingPage />} />

        {/* Wrap Layout around only the authenticated pages */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/enhance-cv" element={<EnhanceCV />} />
                <Route path="/create-cv" element={<CreateCV />} />
                <Route path="/ats-score" element={<ATSScore />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
