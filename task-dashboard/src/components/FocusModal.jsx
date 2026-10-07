import React, { useState, useEffect, useRef } from 'react';
import { useTaskContext } from '../context/useTaskContext';

export default function FocusModal({ isOpen, onClose, defaultTaskId = null }) {
  const { state, dispatch } = useTaskContext();
  const [selectedTaskId, setSelectedTaskId] = useState(defaultTaskId || '');
  const [mode, setMode] = useState('focus'); // focus (25), shortBreak (5), longBreak (15)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedNotification, setCompletedNotification] = useState(false);

  const intervalRef = useRef(null);

  const durations = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    if (isOpen) {
      if (defaultTaskId) {
        setSelectedTaskId(defaultTaskId);
      } else if (!selectedTaskId && state.tasks && state.tasks.length > 0) {
        const activeTask = state.tasks.find(t => t.status !== 'Done');
        if (activeTask) setSelectedTaskId(activeTask.id);
      }
    }
  }, [defaultTaskId, isOpen, selectedTaskId, state.tasks]);

  useEffect(() => {
    if (isActive) {
      document.title = `(${formatTime(timeLeft)}) Focus | Task Dashboard`;
    } else {
      document.title = 'Task Dashboard';
    }
    return () => {
      document.title = 'Task Dashboard';
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            setCompletedNotification(true);

            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
              audio.volume = 0.5;
              audio.play().catch(() => {});
            } catch {
              // Ignore audio errors
            }

            if (mode === 'focus') {
              const targetTask = state.tasks?.find(t => Number(t.id) === Number(selectedTaskId));
              dispatch({
                type: 'RECORD_FOCUS_SESSION',
                payload: {
                  taskId: selectedTaskId,
                  projectId: targetTask ? targetTask.projectId : null,
                  durationMinutes: 25,
                },
              });
            }

            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, mode, selectedTaskId, state.tasks, dispatch]);

  const handleStart = () => {
    setCompletedNotification(false);
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(durations[mode]);
    setCompletedNotification(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeSwitch = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setCompletedNotification(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeTaskObj = state.tasks.find(t => Number(t.id) === Number(selectedTaskId));
  const activeProjectObj = activeTaskObj ? state.projects.find(p => Number(p.id) === Number(activeTaskObj.projectId)) : null;

  const totalModeTime = durations[mode];
  const progressPercent = Math.min(100, Math.max(0, ((totalModeTime - timeLeft) / totalModeTime) * 100));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card focus-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="focus-modal-title">
            <span className="focus-icon">⏱️</span>
            <h3>Focus Session</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="focus-modal-body">
          {/* Mode Tabs */}
          <div className="focus-mode-tabs">
            <button
              className={`mode-tab ${mode === 'focus' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('focus')}
            >
              Focus (25m)
            </button>
            <button
              className={`mode-tab ${mode === 'shortBreak' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('shortBreak')}
            >
              Short Break (5m)
            </button>
            <button
              className={`mode-tab ${mode === 'longBreak' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('longBreak')}
            >
              Long Break (15m)
            </button>
          </div>

          {/* Working On Selector */}
          <div className="focus-task-selector">
            <label>Working on task:</label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              disabled={isActive}
            >
              <option value="">-- Standalone Focus --</option>
              {(state.tasks || []).filter(t => t.status !== 'Done').map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} {task.priority ? `(${task.priority})` : ''}
                </option>
              ))}
            </select>
          </div>

          {activeTaskObj && (
            <div className="focus-active-badge">
              <span className="dot" style={{ backgroundColor: activeProjectObj?.color || '#3b82f6' }} />
              <span className="task-name">{activeTaskObj.title}</span>
              {activeProjectObj && <span className="project-tag">{activeProjectObj.name}</span>}
            </div>
          )}

          {/* Timer Display */}
          <div className="focus-timer-display">
            <div className="focus-time-digits">{formatTime(timeLeft)}</div>
            <div className="focus-progress-track">
              <div className="focus-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {completedNotification && (
            <div className="focus-completed-banner">
              🎉 Focus session completed! Time logged to task.
            </div>
          )}

          {/* Controls */}
          <div className="focus-modal-controls">
            {!isActive ? (
              <button className="btn-primary btn-large" onClick={handleStart}>
                ▶ Start Focus
              </button>
            ) : (
              <button className="btn-secondary btn-large" onClick={handlePause}>
                ⏸ Pause
              </button>
            )}
            <button className="btn-ghost" onClick={handleReset}>
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
