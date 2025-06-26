import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function AchievementBadges() {
  const { state } = useTaskContext();
  const [showBadges, setShowBadges] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [justEarnedBadge, setJustEarnedBadge] = useState(null);
  const prevEarnedRef = useRef([]);
  const prevCompletedCount = useRef(0);
  const prevProjectCount = useRef(0);
  // Manage collision with site-wide confetti
  const confettiActiveRef = useRef(false);
  // Robust queue for badge celebrations
  const [badgeQueue, setBadgeQueue] = useState([]);
  const badgeTimeoutRef = useRef(null);
  // Track if a badge is pending display after confetti
  const [pendingBadge, setPendingBadge] = useState(null);
  // Toast state for 'Achievement Unlocked!'
  const [showToast, setShowToast] = useState(false);
  const buttonRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Achievement definitions
  const achievements = {
    firstTask: {
      id: 'firstTask',
      name: 'First Steps',
      description: 'Complete your first task',
      icon: '🎯',
      color: '#10b981',
      condition: (tasks) => tasks.filter(t => t.status === 'Done').length >= 1
    },
    taskMaster: {
      id: 'taskMaster',
      name: 'Task Master',
      description: 'Complete 10 tasks',
      icon: '👑',
      color: '#f59e0b',
      condition: (tasks) => tasks.filter(t => t.status === 'Done').length >= 10
    },
    speedDemon: {
      id: 'speedDemon',
      name: 'Speed Demon',
      description: 'Complete 5 tasks in one day',
      icon: '⚡',
      color: '#ef4444',
      condition: (tasks) => {
        const today = new Date().toDateString();
        const todayCompleted = tasks.filter(t => 
          t.status === 'Done' && 
          t.completedAt && new Date(t.completedAt).toDateString() === today
        );
        return todayCompleted.length >= 5;
      }
    },
    earlyBird: {
      id: 'earlyBird',
      name: 'Early Bird',
      description: 'Complete a task before 9 AM',
      icon: '🌅',
      color: '#8b5cf6',
      condition: (tasks) => {
        return tasks.some(t => {
          if (t.status !== 'Done' || !t.completedAt) return false;
          const completedHour = new Date(t.completedAt).getHours();
          return completedHour < 9;
        });
      }
    },
    nightOwl: {
      id: 'nightOwl',
      name: 'Night Owl',
      description: 'Complete a task after 10 PM',
      icon: '🦉',
      color: '#6366f1',
      condition: (tasks) => {
        return tasks.some(t => {
          if (t.status !== 'Done' || !t.completedAt) return false;
          const completedHour = new Date(t.completedAt).getHours();
          return completedHour >= 22;
        });
      }
    },
    projectManager: {
      id: 'projectManager',
      name: 'Project Manager',
      description: 'Create 3 projects',
      icon: '📋',
      color: '#06b6d4',
      condition: () => state.projects.length >= 3
    },
    perfectionist: {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Complete 5 high-priority tasks',
      icon: '💎',
      color: '#ec4899',
      condition: (tasks) => {
        const highPriorityCompleted = tasks.filter(t => 
          t.status === 'Done' && t.priority === 'High'
        );
        return highPriorityCompleted.length >= 5;
      }
    },
    consistent: {
      id: 'consistent',
      name: 'Consistent',
      description: 'Complete tasks for 7 consecutive days',
      icon: '📅',
      color: '#059669',
      condition: (tasks) => {
        const completedTasks = tasks.filter(t => t.status === 'Done' && t.completedAt);
        if (completedTasks.length < 7) return false;
        
        const dates = completedTasks.map(t => new Date(t.completedAt).toDateString()).sort();
        
        // Check for 7 consecutive days
        const uniqueDates = [...new Set(dates)];
        for (let i = 0; i <= uniqueDates.length - 7; i++) {
          const startDate = new Date(uniqueDates[i]);
          let consecutive = true;
          for (let j = 1; j < 7; j++) {
            const expectedDate = new Date(startDate);
            expectedDate.setDate(startDate.getDate() + j);
            if (!uniqueDates.includes(expectedDate.toDateString())) {
              consecutive = false;
              break;
            }
          }
          if (consecutive) return true;
        }
        return false;
      }
    }
  };

  // Calculate earned badges
  const earnedBadges = Object.values(achievements).filter(achievement => 
    achievement.condition(state.tasks)
  );

  const unearnedBadges = Object.values(achievements).filter(achievement => 
    !achievement.condition(state.tasks)
  );

  const shareBadge = async (badge) => {
    const shareText = `🎉 I just earned the "${badge.name}" badge in TaskBoard! ${badge.description}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TaskBoard Achievement',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show success message
      const message = document.createElement('div');
      message.textContent = 'Achievement copied to clipboard!';
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
      `;
      document.body.appendChild(message);
      setTimeout(() => {
        message.remove();
      }, 3000);
    });
  };

  // Show next badge in queue
  const showNextBadge = () => {
    if (badgeQueue.length > 0) {
      const next = badgeQueue[0];
      console.log('[Badge] Showing badge:', next);
      setJustEarnedBadge(next);
      setBadgeQueue(q => q.slice(1));
      badgeTimeoutRef.current = setTimeout(() => {
        setJustEarnedBadge(null);
        console.log('[Badge] Hiding badge:', next);
      }, 4000);
    }
  };

  // Listen for confetti start and end
  useEffect(() => {
    const handleConfettiStart = () => {
      confettiActiveRef.current = true;
      console.log('[Confetti] Started');
    };
    const handleConfettiEnd = () => {
      confettiActiveRef.current = false;
      console.log('[Confetti] Ended');
      // If a badge is queued and no badge is showing, show it now
      if (badgeQueue.length > 0 && !justEarnedBadge) {
        showNextBadge();
      }
    };
    document.addEventListener('showConfetti', handleConfettiStart);
    document.addEventListener('confetti-ended', handleConfettiEnd);
    return () => {
      document.removeEventListener('showConfetti', handleConfettiStart);
      document.removeEventListener('confetti-ended', handleConfettiEnd);
      if (badgeTimeoutRef.current) clearTimeout(badgeTimeoutRef.current);
    };
  }, [badgeQueue, justEarnedBadge]);

  // When justEarnedBadge is hidden, show next in queue
  useEffect(() => {
    if (!justEarnedBadge && badgeQueue.length > 0 && !confettiActiveRef.current) {
      showNextBadge();
    }
  }, [justEarnedBadge, badgeQueue]);

  // Listen for confetti start and end
  useEffect(() => {
    const handleConfettiEnd = () => {
      if (pendingBadge) {
        setJustEarnedBadge(pendingBadge);
        setPendingBadge(null);
        setTimeout(() => setJustEarnedBadge(null), 4000);
      }
    };
    document.addEventListener('confetti-ended', handleConfettiEnd);
    return () => {
      document.removeEventListener('confetti-ended', handleConfettiEnd);
    };
  }, [pendingBadge]);

  // Add a helper to get/set celebrated badges in localStorage
  function getCelebratedBadges() {
    try {
      return JSON.parse(localStorage.getItem('celebratedBadges') || '[]');
    } catch {
      return [];
    }
  }
  function setCelebratedBadges(badges) {
    localStorage.setItem('celebratedBadges', JSON.stringify(badges));
  }

  // Add new badge to pending or show immediately
  useEffect(() => {
    const completedCount = state.tasks.filter(t => t.status === 'Done').length;
    const projectCount = state.projects.length;
    const earnedBadges = Object.values(achievements).filter(achievement => achievement.condition(state.tasks));
    const prevEarned = prevEarnedRef.current;
    // Get celebrated badges from localStorage
    const celebrated = getCelebratedBadges();
    if (
      (completedCount > prevCompletedCount.current || projectCount > prevProjectCount.current) &&
      earnedBadges.length > prevEarned.length
    ) {
      // Find the new badge(s)
      const newBadges = earnedBadges.filter(b => !prevEarned.some(pb => pb.id === b.id) && !celebrated.includes(b.id));
      if (newBadges.length > 0) {
        // Use global confettiActive flag
        if (typeof window !== 'undefined' && window.confettiActive) {
          setPendingBadge(newBadges[0]);
        } else {
          setJustEarnedBadge(newBadges[0]);
          setTimeout(() => setJustEarnedBadge(null), 4000);
          // Mark as celebrated
          setCelebratedBadges([...celebrated, ...newBadges.map(b => b.id)]);
        }
      }
    }
    prevCompletedCount.current = completedCount;
    prevProjectCount.current = projectCount;
    prevEarnedRef.current = earnedBadges;
  }, [state.tasks, state.projects]);

  // Debug: log every render and state
  useEffect(() => {
    console.log('[Badge] Render', {
      badgeQueue,
      justEarnedBadge,
      confettiActive: confettiActiveRef.current
    });
  });
  useEffect(() => {
    console.log('[Badge] Component mounted');
  }, []);

  // Toast state for 'Achievement Unlocked!'
  useEffect(() => {
    if (justEarnedBadge) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(t);
    } else {
      setShowToast(false);
    }
  }, [justEarnedBadge]);

  // Position dropdown/modal on mobile
  useLayoutEffect(() => {
    if (justEarnedBadge && buttonRef.current) {
      const isMobile = window.innerWidth <= 600;
      if (isMobile) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownStyle({
          top: rect.bottom + 8,
          left: 8,
          right: 8,
          maxWidth: 'calc(100vw - 16px)',
          position: 'fixed',
          zIndex: 20000,
        });
      } else {
        setDropdownStyle({});
      }
    }
  }, [justEarnedBadge]);

  // Only render the badge modal (no button or panel)
  return justEarnedBadge ? (
    <>
      {showToast && (
        <div className="achievement-toast-fixed">
          Achievement Unlocked!
        </div>
      )}
      <div
        className={`share-modal-overlay badge-celebration-overlay${window.innerWidth <= 600 ? ' mobile-dropdown' : ''}`}
        style={window.innerWidth <= 600 ? dropdownStyle : { zIndex: 20000 }}
      >
        <div className="share-modal badge-celebration-modal">
          {/* Confetti background */}
          <div className="confetti-bg">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="confetti-dot"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${8 + Math.random() * 10}px`,
                  height: `${8 + Math.random() * 10}px`,
                  background: [
                    '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#fbbf24', '#f472b6', '#06b6d4', '#fde68a'
                  ][i % 8],
                  animationDelay: `${Math.random() * 1.5}s`,
                }}
              />
            ))}
          </div>
          <div className="badge-preview-centered">
            <div className="badge-icon" style={{ color: justEarnedBadge.color }}>
              {justEarnedBadge.icon}
            </div>
            <div className="badge-info">
              <h5 style={{ margin: 0, textAlign: 'center' }}>{justEarnedBadge.name}</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
} 