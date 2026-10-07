import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/useTaskContext';

export default function CommandPalette({ isOpen, onClose, onOpenTaskModal, onOpenFocusModal, dark, setDark }) {
  const { state } = useTaskContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const navigationCommands = [
    { id: 'nav-today', label: 'Go to Today', category: 'Navigation', icon: '☀️', action: () => navigate('/') },
    { id: 'nav-upcoming', label: 'Go to Upcoming', category: 'Navigation', icon: '📅', action: () => navigate('/upcoming') },
    { id: 'nav-projects', label: 'Go to Projects', category: 'Navigation', icon: '📁', action: () => navigate('/projects') },
    { id: 'nav-insights', label: 'Go to Insights', category: 'Navigation', icon: '📈', action: () => navigate('/insights') },
    { id: 'nav-templates', label: 'Go to Templates', category: 'Navigation', icon: '📋', action: () => navigate('/templates') },
    { id: 'nav-settings', label: 'Go to Settings', category: 'Navigation', icon: '⚙️', action: () => navigate('/settings') },
  ];

  const actionCommands = [
    { id: 'act-new-task', label: 'Create new task', category: 'Actions', icon: '➕', action: () => onOpenTaskModal() },
    { id: 'act-focus', label: 'Start focus session', category: 'Actions', icon: '⏱️', action: () => onOpenFocusModal() },
    { id: 'act-theme', label: dark ? 'Switch to Light mode' : 'Switch to Dark mode', category: 'Actions', icon: dark ? '☀️' : '🌙', action: () => setDark(!dark) },
  ];

  // Search tasks & projects
  const filteredTasks = (state.tasks || [])
    .filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || (t.description || '').toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map(t => ({
      id: `task-${t.id}`,
      label: t.title,
      category: 'Tasks',
      icon: t.status === 'Done' ? '✅' : '□',
      subtitle: `${t.priority || 'Normal'} priority • ${t.status}`,
      action: () => navigate('/')
    }));

  const filteredProjects = (state.projects || [])
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .map(p => ({
      id: `proj-${p.id}`,
      label: p.name,
      category: 'Projects',
      icon: '📁',
      subtitle: `${p.description || 'Project'}`,
      action: () => navigate('/projects')
    }));

  const filteredNav = navigationCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  const filteredActions = actionCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const allItems = [...filteredActions, ...filteredNav, ...filteredTasks, ...filteredProjects];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette-modal" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette-header">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search tasks..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="kbd-badge">ESC</kbd>
        </div>

        <div className="command-palette-list">
          {allItems.length === 0 ? (
            <div className="command-empty">No matching commands or tasks</div>
          ) : (
            allItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  className={`command-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="command-item-icon">{item.icon}</span>
                  <div className="command-item-text">
                    <span className="command-item-title">{item.label}</span>
                    {item.subtitle && <span className="command-item-subtitle">{item.subtitle}</span>}
                  </div>
                  <span className="command-item-category">{item.category}</span>
                </div>
              );
            })
          )}
        </div>

        <div className="command-palette-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to select</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
