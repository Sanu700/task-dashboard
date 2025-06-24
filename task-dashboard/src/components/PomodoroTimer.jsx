import React, { useState, useEffect, useRef } from 'react';

export default function PomodoroTimer() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [showTimer, setShowTimer] = useState(false);
  const intervalRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTimer(false);
      }
    };

    if (showTimer) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimer]);

  const focusTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes
  const longBreakTime = 15 * 60; // 15 minutes

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            // Timer finished
            playNotification();
            if (mode === 'focus') {
              setMode('break');
              return breakTime;
            } else {
              setMode('focus');
              return focusTime;
            }
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, mode]);

  const playNotification = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore audio errors
    }
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setTimeLeft(focusTime);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'focus') {
      setTimeLeft(focusTime);
    } else if (newMode === 'break') {
      setTimeLeft(breakTime);
    } else {
      setTimeLeft(longBreakTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((focusTime - timeLeft) / focusTime) * 100;

  return (
    <div className="pomodoro-timer">
      <button 
        onClick={() => setShowTimer(!showTimer)}
        className="timer-toggle"
      >
        ⏰ Pomodoro Timer
      </button>
      
      {showTimer && (
        <div className="timer-container" ref={dropdownRef}>
          <div className="timer-header">
            <h4>Focus Timer</h4>
            <div className="timer-modes">
              <button 
                onClick={() => switchMode('focus')}
                className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
              >
                Focus
              </button>
              <button 
                onClick={() => switchMode('break')}
                className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
              >
                Break
              </button>
              <button 
                onClick={() => switchMode('longBreak')}
                className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
              >
                Long Break
              </button>
            </div>
          </div>

          <div className="timer-display">
            <div className="time">{formatTime(timeLeft)}</div>
            <div className="timer-progress">
              <div 
                className="timer-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="timer-controls">
            {!isActive ? (
              <button onClick={startTimer} className="timer-btn start">
                ▶ Start
              </button>
            ) : (
              <button onClick={pauseTimer} className="timer-btn pause">
                ⏸ Pause
              </button>
            )}
            <button onClick={resetTimer} className="timer-btn reset">
              🔄 Reset
            </button>
          </div>

          <div className="timer-info">
            <p>Current Mode: <strong>{mode === 'focus' ? 'Focus Session' : mode === 'break' ? 'Short Break' : 'Long Break'}</strong></p>
            <p>Time Remaining: <strong>{formatTime(timeLeft)}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
} 