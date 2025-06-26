import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import TaskColumn from '../components/TaskColumn';
import TaskTemplates from '../components/TaskTemplates';
import PomodoroTimer from '../components/PomodoroTimer';
import Badges from '../components/Badges';
import ExportFeatures from '../components/ExportFeatures';
import AchievementBadges from '../components/AchievementBadges';
import { useTaskContext } from '../context/TaskContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { state, dispatch } = useTaskContext();
  const [filter, setFilter] = useState('');
  const [project, setProject] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchPriority, setSearchPriority] = useState('all');
  const [expandedTask, setExpandedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Calculate statistics
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.status === 'Done').length;
  const inProgressTasks = state.tasks.filter(task => task.status === 'In Progress').length;
  const todoTasks = state.tasks.filter(task => task.status === 'To Do').length;
  const overdueTasks = state.tasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  }).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
  };

  // Enhanced search function
  const getFilteredTasks = () => {
    return state.tasks.filter(task => {
      // Category filter
      if (searchCategory !== 'all' && task.category !== searchCategory) {
        return false;
      }
      
      // Priority filter
      if (searchPriority !== 'all' && task.priority !== searchPriority) {
        return false;
      }
      
      // Text search
      if (filter && filter.trim() !== '') {
        const searchTerm = filter.toLowerCase().trim();
        const taskTitle = (task.title || '').toLowerCase();
        const taskDescription = (task.description || '').toLowerCase();
        const taskAssignee = (task.assignee || '').toLowerCase();
        const taskCategory = (task.category || '').toLowerCase();
        
        if (!taskTitle.includes(searchTerm) && 
            !taskDescription.includes(searchTerm) && 
            !taskAssignee.includes(searchTerm) &&
            !taskCategory.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Find the expanded task object
  const task = expandedTask ? state.tasks.find(t => t.id === expandedTask) : null;
  const proj = task ? state.projects.find(p => Number(p.id) === Number(task.projectId)) : null;
  const color = proj?.color || '#64748b';
  const projectName = proj?.name || 'No Project';
  const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date();
  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };
  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return '#3b82f6';
      case 'personal': return '#8b5cf6';
      case 'health': return '#10b981';
      case 'learning': return '#f59e0b';
      case 'finance': return '#ef4444';
      case 'other': return '#6b7280';
      default: return '#6b7280';
    }
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '🏠';
      case 'health': return '💪';
      case 'learning': return '📚';
      case 'finance': return '💰';
      case 'other': return '📝';
      default: return '📝';
    }
  };

  // Modal handlers
  const handleTaskClick = (taskId) => setExpandedTask(taskId);
  const handleCloseModal = () => {
    setExpandedTask(null);
    setEditingTask(null);
    setEditForm({});
  };
  const handleEdit = () => {
    setEditingTask(expandedTask);
    setEditForm({ ...task });
  };
  const handleSaveEdit = (e) => {
    e.preventDefault();
    dispatch({ type: 'EDIT_TASK', payload: { id: editingTask, updates: editForm } });
    setEditingTask(null);
    setEditForm({});
  };
  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({});
  };
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: expandedTask });
      handleCloseModal();
    }
  };
  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_TASK', payload: expandedTask });
  };

  return (
    <div className="dashboard-container" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      {/* Enhanced Filter Bar */}
      <div className="filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.2rem',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '14px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          padding: '1.1rem 2rem',
          margin: '0 auto',
          maxWidth: 1200,
        }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filter}
            onChange={handleFilterChange}
            style={{ minWidth: 220, maxWidth: 260, flex: 1, padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem' }}
        />
          <select value={project} onChange={e => setProject(e.target.value)} style={{ minWidth: 220, maxWidth: 260, flex: 1, padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem' }}>
            <option value="all">All Projects</option>
            {state.projects.map((proj) => (
              <option key={proj.id} value={proj.id}>{proj.name}</option>
            ))}
          </select>
          <select value={searchPriority} onChange={e => setSearchPriority(e.target.value)} style={{ minWidth: 220, maxWidth: 260, flex: 1, padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem' }}>
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)} style={{ minWidth: 220, maxWidth: 260, flex: 1, padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem' }}>
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="learning">Learning</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Utility buttons row: Stats, TaskTemplates, PomodoroTimer, Badges, ExportFeatures */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginTop: '0.7rem' }}>
          <button 
            onClick={() => setShowStats(!showStats)}
            className="stats-toggle"
            title="Toggle Statistics"
            style={{ minWidth: 120 }}
          >
            📊 Stats
          </button>
          <TaskTemplates />
          <PomodoroTimer />
          <Badges />
          <ExportFeatures />
        </div>
      </div>

      {/* Inline Stats Panel (restored behavior) */}
      {showStats && (
        <div className="stat-card">
          <h3>📊 Overview</h3>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-number">{totalTasks}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{completedTasks}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{inProgressTasks}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{todoTasks}</span>
              <span className="stat-label">To Do</span>
            </div>
            <div className="stat-item">
              <span className="stat-number overdue">{overdueTasks}</span>
              <span className="stat-label">Overdue</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
            <span className="progress-text">{completionRate}% Complete</span>
          </div>
        </div>
      )}

      {/* Task Columns Row */}
      <div className="task-columns" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(320px, 1fr))',
        gap: '2rem',
        maxWidth: '1700px',
        margin: '0 auto',
        width: '100%',
        alignItems: 'stretch',
        justifyItems: 'stretch',
        padding: '3.5rem 1rem 3.5rem 1rem',
        flexGrow: 1,
        alignSelf: 'center',
      }}>
        <TaskColumn title="To Do" filter={filter} project={project} category={searchCategory} priority={searchPriority} onTaskClick={handleTaskClick} statusClass="todo" />
        <TaskColumn title="In Progress" filter={filter} project={project} category={searchCategory} priority={searchPriority} onTaskClick={handleTaskClick} statusClass="inprogress" />
        <TaskColumn title="Done" filter={filter} project={project} category={searchCategory} priority={searchPriority} onTaskClick={handleTaskClick} statusClass="done" />
        <TaskColumn title="My Projects" statusClass="projects" />
      </div>
      {/* Modal Portal */}
      {expandedTask && task && ReactDOM.createPortal(
        <div className="task-modal-overlay" onClick={handleCloseModal}>
          <div className="task-modal" onClick={e => e.stopPropagation()}>
            <div className="task-header">
              <div className="task-complete">
                <input
                  type="checkbox"
                  checked={task.status === 'Done'}
                  onChange={handleToggle}
                />
                <strong>{task.title}</strong>
              </div>
              <button onClick={handleCloseModal} className="close-expand-btn">×</button>
            </div>
            {editingTask === expandedTask ? (
              <form className="edit-form" onSubmit={handleSaveEdit}>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Task Title"
                  className="edit-input"
                />
                <textarea
                  value={editForm.description || ''}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Description"
                  className="edit-textarea"
                />
                <select
                  value={editForm.priority || ''}
                  onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                  className="edit-select"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  type="text"
                  value={editForm.assignee || ''}
                  onChange={e => setEditForm({ ...editForm, assignee: e.target.value })}
                  placeholder="Assignee"
                  className="edit-input"
                />
                <input
                  type="date"
                  value={editForm.dueDate || ''}
                  onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })}
                  className="edit-input"
                />
                <div className="edit-buttons">
                  <button type="submit" className="edit-button">Save</button>
                  <button type="button" onClick={handleCancelEdit} className="delete-button">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="task-expanded-content">
                {task.category && (
                  <div className="category-badge" style={{ backgroundColor: getCategoryColor(task.category), borderLeft: `4px solid ${getCategoryColor(task.category)}` }}>
                    <span className="category-icon">{getCategoryIcon(task.category)}</span>
                    <span className="category-name">{task.category}</span>
                  </div>
                )}
                {task.priority && (
                  <div className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>{task.priority}</div>
                )}
                {task.description && <p className="task-description">{task.description}</p>}
                {task.assignee && <p><strong>Assignee:</strong> {task.assignee}</p>}
                {task.dueDate && (
                  <p className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : isDueSoon(task.dueDate) ? 'due-soon' : ''}`}>
                    <strong>Due:</strong> {task.dueDate}
                    {isOverdue(task.dueDate) && <span className="warning-icon">⚠️ Overdue</span>}
                    {isDueSoon(task.dueDate) && !isOverdue(task.dueDate) && <span className="warning-icon">⏰ Due Soon</span>}
                  </p>
                )}
                {task.estimatedTime && <p><strong>Est. Time:</strong> {task.estimatedTime}h</p>}
                <p style={{ backgroundColor: color, color: 'white', padding: '4px 8px', fontSize: '0.8rem', borderRadius: '6px', display: 'inline-block', marginTop: '0.5rem' }}>{projectName}</p>
                <div className="task-actions">
                  <button onClick={handleEdit} className="edit-button">Edit</button>
                  <button onClick={handleDelete} className="delete-button">Delete</button>
                </div>
              </div>
          )}
        </div>
        </div>,
        document.body
      )}
      {/* Portal for badge celebration modal (always above all content) */}
      {typeof window !== 'undefined' && ReactDOM.createPortal(
        <AchievementBadges portalOnly />,
        document.body
      )}
    </div>
  );
}
