import React, { useState, useEffect, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function TaskTemplates() {
  const { dispatch } = useTaskContext();
  const [showTemplates, setShowTemplates] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setShowTemplates(false);
      }
    };
    if (showTemplates) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTemplates]);

  const templates = {
    'Daily Routine': [
      { title: 'Morning Exercise', category: 'health', priority: 'High', estimatedTime: '0.5' },
      { title: 'Check Emails', category: 'work', priority: 'Medium', estimatedTime: '0.25' },
      { title: 'Plan Day', category: 'work', priority: 'High', estimatedTime: '0.25' },
      { title: 'Drink Water', category: 'health', priority: 'Medium', estimatedTime: '0.1' }
    ],
    'Weekly Planning': [
      { title: 'Review Last Week', category: 'work', priority: 'High', estimatedTime: '1' },
      { title: 'Set Weekly Goals', category: 'work', priority: 'High', estimatedTime: '0.5' },
      { title: 'Plan Meals', category: 'personal', priority: 'Medium', estimatedTime: '0.5' },
      { title: 'Schedule Exercise', category: 'health', priority: 'Medium', estimatedTime: '0.25' }
    ],
    'Project Setup': [
      { title: 'Define Requirements', category: 'work', priority: 'High', estimatedTime: '2' },
      { title: 'Create Timeline', category: 'work', priority: 'High', estimatedTime: '1' },
      { title: 'Assign Tasks', category: 'work', priority: 'Medium', estimatedTime: '0.5' },
      { title: 'Set Milestones', category: 'work', priority: 'Medium', estimatedTime: '0.5' }
    ],
    'Learning Session': [
      { title: 'Research Topic', category: 'learning', priority: 'High', estimatedTime: '1' },
      { title: 'Take Notes', category: 'learning', priority: 'Medium', estimatedTime: '0.5' },
      { title: 'Practice Exercise', category: 'learning', priority: 'Medium', estimatedTime: '1' },
      { title: 'Review & Reflect', category: 'learning', priority: 'Low', estimatedTime: '0.25' }
    ],
    'Financial Planning': [
      { title: 'Review Budget', category: 'finance', priority: 'High', estimatedTime: '0.5' },
      { title: 'Pay Bills', category: 'finance', priority: 'High', estimatedTime: '0.25' },
      { title: 'Update Expenses', category: 'finance', priority: 'Medium', estimatedTime: '0.25' },
      { title: 'Plan Savings', category: 'finance', priority: 'Medium', estimatedTime: '0.5' }
    ]
  };

  const applyTemplate = (templateName) => {
    const tasks = templates[templateName];
    tasks.forEach((task, index) => {
      const newTask = {
        id: Date.now() + index,
        ...task,
        description: `Template task from ${templateName}`,
        status: 'To Do',
        createdAt: new Date().toISOString(),
        completedAt: null,
        timeSpent: 0,
        progress: 0
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
    });
    setShowTemplates(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Toast notification
  const toast = showToast ? (
    <div style={{
      position: 'fixed',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(90deg, #10b981, #6366f1)',
      color: 'white',
      padding: '0.6rem 1.2rem',
      borderRadius: '14px',
      fontWeight: 600,
      fontSize: '1rem',
      boxShadow: '0 4px 24px rgba(16,185,129,0.18)',
      zIndex: 50000,
      letterSpacing: '0.5px',
      textAlign: 'center',
      animation: 'toastIn 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
    }}>
      Template task added to To Do!
    </div>
  ) : null;

  return (
    <>
      {toast}
      <div className="task-templates">
        <button 
          onClick={() => setShowTemplates(!showTemplates)}
          className="template-toggle"
          ref={buttonRef}
        >
          📋 Task Templates
        </button>
        {showTemplates && (
          <div
            className="timer-container templates-dropdown"
            ref={dropdownRef}
          >
            <h4>Choose a Template</h4>
            <div className="template-list">
              {Object.keys(templates).map((templateName) => (
                <button
                  key={templateName}
                  onClick={() => applyTemplate(templateName)}
                  className="template-option"
                >
                  <span className="template-name">{templateName}</span>
                  <span className="template-count">{templates[templateName].length} tasks</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
} 