import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/Layout';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import Projects from './pages/Projects';
import Insights from './pages/Insights';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import './index.css';

// Site-wide Confetti Component
function ConfettiCelebration() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleConfetti = (event) => {
      setMessage(event.detail?.message || '🎉 Task Completed! 🎉');
      setShowConfetti(true);

      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.15;
        audio.play().catch(() => {});
      } catch {
        // Ignore audio errors
      }

      setTimeout(() => {
        setShowConfetti(false);
        document.dispatchEvent(new CustomEvent('confetti-ended'));
      }, 3500);
    };

    document.addEventListener('showConfetti', handleConfetti);
    return () => document.removeEventListener('showConfetti', handleConfetti);
  }, []);

  if (!showConfetti) return null;

  return (
    <div className="site-confetti-container">
      <div className="celebration-message">
        <span className="party-popper">🎉</span>
        <span className="message-text">{message}</span>
        <span className="party-popper">🎉</span>
      </div>

      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="golden-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#fbbf24'][i % 6],
            width: `${5 + Math.random() * 6}px`,
            height: `${5 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <TaskProvider>
      <Router>
        <ConfettiCelebration />
        <Layout dark={dark} setDark={setDark}>
          {({ handleOpenTaskModal, handleOpenFocusModal }) => (
            <Routes>
              <Route path="/" element={<Today handleOpenTaskModal={handleOpenTaskModal} handleOpenFocusModal={handleOpenFocusModal} />} />
              <Route path="/upcoming" element={<Upcoming handleOpenTaskModal={handleOpenTaskModal} handleOpenFocusModal={handleOpenFocusModal} />} />
              <Route path="/projects" element={<Projects handleOpenTaskModal={handleOpenTaskModal} handleOpenFocusModal={handleOpenFocusModal} />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/settings" element={<Settings dark={dark} setDark={setDark} />} />
              <Route path="/add" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </Layout>
      </Router>
    </TaskProvider>
  );
}
