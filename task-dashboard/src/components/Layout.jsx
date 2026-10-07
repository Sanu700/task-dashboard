import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import TaskModal from './TaskModal';
import FocusModal from './FocusModal';

export default function Layout({ children, dark, setDark }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [focusModalOpen, setFocusModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [focusTaskId, setFocusTaskId] = useState(null);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when user is typing inside input, textarea, or contenteditable elements
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      // ⌘K / Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }

      // N -> New Task
      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setEditingTask(null);
        setTaskModalOpen(true);
        return;
      }

      // / -> Search / Command Palette
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // F -> Focus session
      if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setFocusModalOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenTaskModal = (task = null) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleOpenFocusModal = (taskId = null) => {
    setFocusTaskId(taskId);
    setFocusModalOpen(true);
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenTaskModal={() => handleOpenTaskModal()}
        onOpenFocusModal={() => handleOpenFocusModal()}
      />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        {/* Top Header Bar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Navigation"
            >
              ☰
            </button>
            <div className="topbar-search-trigger" onClick={() => setCommandPaletteOpen(true)}>
              <span className="search-icon">🔍</span>
              <span className="search-placeholder">Search tasks, projects, or commands...</span>
              <kbd className="kbd-shortcut">⌘K</kbd>
            </div>
          </div>

          <div className="topbar-right">
            <button
              className="btn-topbar-action focus-btn"
              onClick={() => handleOpenFocusModal()}
              title="Start Focus Session (F)"
            >
              ⏱️ Focus
            </button>

            <button
              className="btn-topbar-action"
              onClick={() => handleOpenTaskModal()}
              title="Create New Task (N)"
            >
              ➕ Task
            </button>

            {/* Dark Mode Toggle */}
            <button
              className="btn-icon-toggle"
              onClick={() => setDark(!dark)}
              title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {dark ? '☀️' : '🌙'}
            </button>

            {/* User Profile Avatar */}
            <div className="user-avatar" title="Personal Workspace">
              <span>S</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="app-content">
          {typeof children === 'function'
            ? children({ handleOpenTaskModal, handleOpenFocusModal })
            : React.cloneElement(children, { handleOpenTaskModal, handleOpenFocusModal })}
        </main>
      </div>

      {/* Modals */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenTaskModal={() => handleOpenTaskModal()}
        onOpenFocusModal={() => handleOpenFocusModal()}
        dark={dark}
        setDark={setDark}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        editingTask={editingTask}
      />

      <FocusModal
        isOpen={focusModalOpen}
        onClose={() => {
          setFocusModalOpen(false);
          setFocusTaskId(null);
        }}
        defaultTaskId={focusTaskId}
      />
    </div>
  );
}
