import React from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import UploadPage from './pages/UploadPage'
const swaggerUrl = import.meta.env.VITE_API_BASE + '/swagger/index.html'
function AppLayout(){
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">RAG / LLM</p>
          <h1>Workspace Console</h1>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Chat
          </NavLink>
          <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Upload
          </NavLink>
        </nav>
      </header>

      <main className="content-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </main>

      <footer className="footer-bar">
        {/* <span>Swagger:</span>
        <a href={swaggerUrl} target="_blank" rel="noreferrer">
          {swaggerUrl}
        </a> */}
      </footer>
    </div>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
