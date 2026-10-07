import React, { useState } from 'react';
import { useTaskContext } from '../context/useTaskContext';
import KanbanBoard from '../components/KanbanBoard';

export default function Today({ handleOpenTaskModal, handleOpenFocusModal }) {
  const { state, dispatch } = useTaskContext();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'
  const [filterDateScope, setFilterDateScope] = useState('today'); // 'today' | 'all'
  const [filterProject, setFilterProject] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Filter tasks
  const allTasks = state.tasks || [];
  const filteredTasks = allTasks.filter((task) => {
    // Date Scope filter
    if (filterDateScope === 'today') {
      const isDueToday = task.dueDate === todayStr;
      const isOverdueUnfinished = task.dueDate && task.dueDate < todayStr && task.status !== 'Done';
      const isUndated = !task.dueDate;
      if (!isDueToday && !isOverdueUnfinished && !isUndated) return false;
    }

    // Project filter
    if (filterProject !== 'all') {
      if (filterProject === 'none' && task.projectId) return false;
      if (filterProject !== 'none' && Number(task.projectId) !== Number(filterProject)) return false;
    }

    // Priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

    // Category filter
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (task.title || '').toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchTag = Array.isArray(task.tags) && task.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    return true;
  });

  // Calculate today focus metrics
  const todayTasksList = allTasks.filter(t => t.dueDate === todayStr || (t.dueDate && t.dueDate < todayStr && t.status !== 'Done') || !t.dueDate);
  const remainingToday = todayTasksList.filter(t => t.status !== 'Done').length;
  const completedToday = allTasks.filter(t => {
    if (t.status !== 'Done') return false;
    if (!t.completedAt) return true;
    return new Date(t.completedAt).toISOString().split('T')[0] === todayStr;
  }).length;

  // Calculate focus time today in minutes
  const todaySessions = (state.focusSessions || []).filter(s => {
    return new Date(s.completedAt).toISOString().split('T')[0] === todayStr;
  });
  const focusMinutesToday = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const streakDays = state.userStreak?.count || 0;

  const getProjectInfo = (id) => (state.projects || []).find(p => Number(p.id) === Number(id));

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge-priority high';
      case 'Medium': return 'badge-priority medium';
      case 'Low': return 'badge-priority low';
      default: return 'badge-priority';
    }
  };

  return (
    <div className="page-container today-page">
      {/* Header Banner */}
      <div className="today-header-banner">
        <div className="greeting-group">
          <h1>{greeting} 👋</h1>
          <p className="subtext">
            {remainingToday > 0
              ? `You've got ${remainingToday} ${remainingToday === 1 ? 'task' : 'tasks'} remaining today.`
              : "🎉 You're all caught up for today!"}
          </p>
        </div>

        <div className="today-actions-group">
          <button className="btn-primary" onClick={() => handleOpenTaskModal()} aria-label="Create New Task">
            ➕ New Task
          </button>
        </div>
      </div>

      {/* Progress Bar Card */}
      {allTasks.length > 0 && (
        <div className="today-progress-card">
          <div className="progress-info-row">
            <span>Today's progress</span>
            <span>{allTasks.length > 0 ? Math.round(((allTasks.length - remainingToday) / allTasks.length) * 100) : 0}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${allTasks.length > 0 ? Math.round(((allTasks.length - remainingToday) / allTasks.length) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon remaining">📋</div>
          <div className="metric-info">
            <span className="metric-value">{remainingToday}</span>
            <span className="metric-label">Tasks remaining</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon completed">✅</div>
          <div className="metric-info">
            <span className="metric-value">{completedToday}</span>
            <span className="metric-label">Completed today</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon focus">⏱️</div>
          <div className="metric-info">
            <span className="metric-value">{focusMinutesToday}m</span>
            <span className="metric-label">Focus time today</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon streak">🔥</div>
          <div className="metric-info">
            <span className="metric-value">{streakDays}</span>
            <span className="metric-label">Current streak</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Filters & View Switcher */}
      <div className="controls-bar">
        <div className="view-switcher-group">
          <button
            className={`switch-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List View
          </button>
          <button
            className={`switch-btn ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
          >
            📊 Board View
          </button>
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <select value={filterDateScope} onChange={(e) => setFilterDateScope(e.target.value)} className="filter-select">
              <option value="today">Today & Overdue</option>
              <option value="all">All Dates</option>
            </select>
          </div>

          <div className="filter-item">
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="filter-select">
              <option value="all">All Projects</option>
              <option value="none">No Project</option>
              {(state.projects || []).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select">
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="filter-item">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workspace Views */}
      {viewMode === 'board' ? (
        <KanbanBoard
          tasks={filteredTasks}
          onEditTask={(task) => handleOpenTaskModal(task)}
          onStartFocus={(taskId) => handleOpenFocusModal(taskId)}
          filterProject={filterProject}
          searchPriority={filterPriority}
          searchCategory={filterCategory}
          filterQuery={searchQuery}
        />
      ) : (
        <div className="task-list-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon">🎉</div>
              <h3>No tasks for today</h3>
              <p>You're all caught up! Enjoy your day or add a new task to get started.</p>
              <button className="btn-primary mt-3" onClick={() => handleOpenTaskModal()}>
                + Add a Task
              </button>
            </div>
          ) : (
            <div className="task-list-rows">
              {filteredTasks.map((task) => {
                const project = getProjectInfo(task.projectId);
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

                return (
                  <div
                    key={task.id}
                    className={`task-list-row ${task.status === 'Done' ? 'completed' : ''}`}
                  >
                    <div className="task-row-left">
                      <input
                        type="checkbox"
                        checked={task.status === 'Done'}
                        onChange={() => {
                          if (task.status !== 'Done') {
                            const confettiEvent = new CustomEvent('showConfetti', {
                              detail: { message: '🎉 Task Completed! 🎉' }
                            });
                            document.dispatchEvent(confettiEvent);
                          }
                          dispatch({ type: 'TOGGLE_TASK', payload: task.id });
                        }}
                        className="task-checkbox"
                      />

                      <div className="task-info">
                        <span className="task-title">{task.title}</span>
                        {task.description && <p className="task-desc">{task.description}</p>}
                      </div>
                    </div>

                    <div className="task-row-right">
                      {project && (
                        <span
                          className="project-tag-pill"
                          style={{
                            backgroundColor: `${project.color}15`,
                            color: project.color,
                            borderColor: `${project.color}30`,
                          }}
                        >
                          {project.name}
                        </span>
                      )}

                      {task.priority && (
                        <span className={getPriorityClass(task.priority)}>
                          {task.priority}
                        </span>
                      )}

                      {task.dueDate && (
                        <span className={`due-date-text ${isOverdue ? 'overdue' : ''}`}>
                          {task.dueDate}
                        </span>
                      )}

                      {Array.isArray(task.tags) && task.tags.map((tag, i) => (
                        <span key={i} className="tag-pill">#{tag}</span>
                      ))}

                      <div className="task-row-actions">
                        <button
                          className="btn-row-action focus"
                          title="Start Focus Session"
                          onClick={() => handleOpenFocusModal(task.id)}
                        >
                          ⏱️ Focus
                        </button>
                        <button
                          className="btn-row-action"
                          title="Edit"
                          onClick={() => handleOpenTaskModal(task)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-row-action danger"
                          title="Delete"
                          onClick={() => {
                            if (window.confirm('Delete this task?')) {
                              dispatch({ type: 'DELETE_TASK', payload: task.id });
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
