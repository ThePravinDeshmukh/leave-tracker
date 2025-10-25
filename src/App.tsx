import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Reports from './pages/Reports'

export default function App() {
  return (
    <div>
      <header style={{padding:12, borderBottom:'1px solid #ddd'}}>
        <nav style={{display:'flex', gap:12}}>
          <Link to="/">Home</Link>
          <Link to="/reports">Reports</Link>
        </nav>
      </header>
      <main style={{padding:12}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/reports" element={<Reports/>} />
        </Routes>
      </main>
    </div>
  )
}
