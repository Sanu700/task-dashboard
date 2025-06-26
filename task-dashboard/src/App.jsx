import React, { useState, useEffect } from 'react';
import { TaskProvider } from './context/TaskContext';
import Dashboard from './pages/Dashboard';
import SplashCursor from './SplashCursor';
import logo from './assets/logo.webp';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddTaskProject from './pages/AddTaskProject';

// Site-wide Confetti Component
function ConfettiCelebration() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleConfetti = (event) => {
      setMessage(event.detail.message);
      setShowConfetti(true);
      // Set global confetti flag
      
      // Subtle success sound (optional - muted by default)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.1;
        audio.play().catch(() => {}); // Ignore if audio fails
      } catch (e) {
        // Ignore audio errors
      }
      
      setTimeout(() => {
        setShowConfetti(false);
        // Dispatch confetti-ended event
        document.dispatchEvent(new CustomEvent('confetti-ended'));
      }, 4000);
    };

    document.addEventListener('showConfetti', handleConfetti);
    return () => document.removeEventListener('showConfetti', handleConfetti);
  }, []);

  if (!showConfetti) return null;

  return (
    <div className="site-confetti-container">
      {/* Golden Celebration Message */}
      <div className="celebration-message">
        <span className="party-popper">🎉</span>
        <span className="message-text">{message}</span>
        <span className="party-popper">🎉</span>
      </div>
      
      {/* Golden Confetti Particles */}
      {[...Array(80)].map((_, i) => {
        const windDirection = Math.random() > 0.5 ? 1 : -1;
        const windStrength = Math.random() * 0.3;
        return (
          <div
            key={i}
            className="golden-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`,
              backgroundColor: ['#fbbf24', '#f59e0b', '#d97706', '#fbbf24', '#fcd34d', '#fef3c7', '#fde68a', '#fef08a'][Math.floor(Math.random() * 8)],
              transform: `rotate(${Math.random() * 360}deg)`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              opacity: 0.8 + Math.random() * 0.2,
              '--wind-direction': windDirection,
              '--wind-strength': windStrength
            }}
          />
        );
      })}
      
      {/* Golden Success Icons */}
      {[...Array(15)].map((_, i) => {
        const windDirection = Math.random() > 0.5 ? 1 : -1;
        const windStrength = Math.random() * 0.2;
        return (
          <div
            key={`success-${i}`}
            className="golden-success-icon"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${3 + Math.random() * 1}s`,
              fontSize: `${1 + Math.random() * 0.5}rem`,
              '--wind-direction': windDirection,
              '--wind-strength': windStrength
            }}
          >
            ✨
          </div>
        );
      })}
      
      {/* Golden Sparkle Effects */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="golden-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${1.8 + Math.random() * 0.8}s`,
            fontSize: `${0.8 + Math.random() * 0.6}rem`
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <TaskProvider>
      <Router>
        <ConfettiCelebration />
        {showCursor && <SplashCursor />}

        <header className="site-header">
          <div
            className="logo"
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logo} alt="Logo" style={{ height: '36px', marginRight: '10px' }} />
            TaskBoard
          </div>
          <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/add" className="nav-link">Add Task/Project</Link>
          </nav>
          <div className="toggle-wrapper">
            {/* Dark Mode Toggle */}
            <div className="toggle-item">
              <span className="toggle-label">Dark Mode</span>
              <label className="theme-toggle attractive-toggle">
                <input
                  type="checkbox"
                  checked={dark}
                  onChange={() => setDark(!dark)}
                />
                <span className="slider" />
              </label>
            </div>

            {/* Splash Cursor Toggle */}
            <div className="toggle-item">
              <span className="toggle-label">Splash Cursor</span>
              <label className="theme-toggle splash-toggle">
                <input
                  type="checkbox"
                  checked={showCursor}
                  onChange={() => setShowCursor(!showCursor)}
                />
                <span className="slider flashy-slider" title="Toggle Splash Cursor" />
              </label>
            </div>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTaskProject />} />
          </Routes>
        </main>

        <footer className="site-footer enhanced-footer">
          <div className="footer-bottom">
            <span>&copy; 2025 TaskBoard. All rights reserved.</span>
          </div>
        </footer>
      </Router>
    </TaskProvider>
  );
}
