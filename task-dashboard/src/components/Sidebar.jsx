import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTaskContext } from '../context/useTaskContext';
import logo from '../assets/logo.webp';

export default function Sidebar({ isOpen, onClose, onOpenTaskModal, onOpenFocusModal }) {
  const { state } = useTaskContext();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasksCount = (state.tasks || []).filter(t => t.dueDate === todayStr && t.status !== 'Done').length;
  const totalProjectsCount = (state.projects || []).length;
  const streakCount = state.userStreak?.count || 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`app-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <img src={logo} alt="TaskBoard Logo" className="logo-img" />
            <div className="brand-text">
              <span className="brand-title">Task Dashboard</span>
            </div>
          </div>
          <button className="sidebar-mobile-close" onClick={onClose} aria-label="Close navigation">×</button>
        </div>

        {/* Quick Action Button */}
        <div className="sidebar-quick-add">
          <button className="btn-primary btn-full" onClick={() => { onOpenTaskModal(); onClose(); }}>
            <span className="plus-icon">+</span> New Task
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">Workspace</div>
          
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">☀️</span>
            <span className="nav-label">Today</span>
            {todayTasksCount > 0 && <span className="nav-count">{todayTasksCount}</span>}
          </NavLink>

          <NavLink
            to="/upcoming"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-label">Upcoming</span>
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">📁</span>
            <span className="nav-label">Projects</span>
            {totalProjectsCount > 0 && <span className="nav-count muted">{totalProjectsCount}</span>}
          </NavLink>

          <NavLink
            to="/insights"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Insights</span>
          </NavLink>

          <div className="nav-divider" />
          <div className="nav-group-label">Tools</div>

          <NavLink
            to="/templates"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-label">Templates</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </NavLink>
        </nav>

        {/* Focus Widget in Sidebar */}
        <div className="sidebar-footer">
          <button className="focus-quick-btn" onClick={() => { onOpenFocusModal(); onClose(); }}>
            <span className="timer-icon">⏱️</span>
            <span className="text">Start Focus Session</span>
          </button>

          {streakCount > 0 && (
            <div className="sidebar-streak-badge">
              <span className="flame">🔥</span>
              <span className="streak-text">{streakCount} day streak</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
