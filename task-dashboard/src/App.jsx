import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import SplashCursor from './SplashCursor';
import logo from './assets/logo.webp';

export default function App() {
  const [dark, setDark] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark';
    setDark(saved);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <AnimatePresence mode="wait">
      <>
        {showCursor && <SplashCursor />}

        <motion.div
          key={dark ? 'dark' : 'light'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <header className="site-header">
            <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
              <img src={logo} alt="Logo" style={{ height: '36px', marginRight: '10px' }} />
              TaskBoard
            </div>

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
            <Dashboard />
          </main>

          <footer className="site-footer">
            <p>&copy; 2025 TaskBoard. All rights reserved.</p>
          </footer>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
