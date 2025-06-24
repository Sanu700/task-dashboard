import React, { useState, useEffect, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function Badges() {
  const { state } = useTaskContext();
  const [showBadges, setShowBadges] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowBadges(false);
      }
    };

    if (showBadges) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBadges]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowShareModal(false);
      }
    };

    if (showShareModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareModal]);

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
          new Date(t.completedAt).toDateString() === today
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
      condition: (tasks) => state.projects.length >= 3
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
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
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
      setTimeout(() => message.remove(), 3000);
    });
  };

  return (
    <div className="achievement-badges" ref={dropdownRef}>
      <button 
        onClick={() => setShowBadges(!showBadges)}
        className="badge-toggle"
      >
        🏆 Achievements ({earnedBadges.length})
      </button>
      
      {showBadges && (
        <div className="badges-container">
          <div className="badges-header">
            <h4>Achievement Badges</h4>
            <p>Earn badges by completing tasks and reaching milestones!</p>
          </div>
          
          <div className="badges-grid">
            {earnedBadges.map((badge) => (
              <div 
                key={badge.id}
                className="badge-item earned"
                onClick={() => {
                  setSelectedBadge(badge);
                  setShowShareModal(true);
                }}
                style={{ borderColor: badge.color }}
              >
                <div className="badge-icon" style={{ color: badge.color }}>
                  {badge.icon}
                </div>
                <div className="badge-info">
                  <h5>{badge.name}</h5>
                  <p>{badge.description}</p>
                </div>
                <div className="badge-status">✓ Earned</div>
              </div>
            ))}
            
            {unearnedBadges.map((badge) => (
              <div key={badge.id} className="badge-item locked">
                <div className="badge-icon locked">🔒</div>
                <div className="badge-info">
                  <h5>{badge.name}</h5>
                  <p>{badge.description}</p>
                </div>
                <div className="badge-status">Locked</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showShareModal && selectedBadge && (
        <div className="share-modal-overlay">
          <div className="share-modal" ref={modalRef}>
            <div className="share-modal-header">
              <h4>Share Achievement</h4>
              <button onClick={() => setShowShareModal(false)} className="close-btn">×</button>
            </div>
            
            <div className="share-badge-preview">
              <div className="badge-preview" style={{ borderColor: selectedBadge.color }}>
                <div className="badge-icon" style={{ color: selectedBadge.color }}>
                  {selectedBadge.icon}
                </div>
                <div className="badge-info">
                  <h5>{selectedBadge.name}</h5>
                  <p>{selectedBadge.description}</p>
                </div>
              </div>
            </div>
            
            <div className="share-actions">
              <button onClick={() => shareBadge(selectedBadge)} className="share-btn">
                📤 Share Achievement
              </button>
              <button onClick={() => copyToClipboard(`🎉 I just earned the "${selectedBadge.name}" badge in TaskBoard! ${selectedBadge.description}`)} className="copy-btn">
                📋 Copy Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 