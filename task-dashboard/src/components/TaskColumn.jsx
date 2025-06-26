import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTaskContext } from '../context/TaskContext';

export default function TaskColumn({ title, filter, project, category, priority, onTaskClick, statusClass: statusClassProp }) {
  const { state, dispatch } = useTaskContext();
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [taskCount, setTaskCount] = useState(0);
  const [expandedTask, setExpandedTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editProjectForm, setEditProjectForm] = useState({});
  const [expandedProject, setExpandedProject] = useState(null);

  // Use statusClass prop if provided, else infer from title
  let statusClass = statusClassProp || '';
  if (!statusClass) {
    if (title === 'To Do') statusClass = 'todo';
    else if (title === 'In Progress') statusClass = 'inprogress';
    else if (title === 'Done') statusClass = 'done';
    else if (title === 'My Projects') statusClass = 'projects';
  }

  // Get project info by ID - moved before it's used
  const getProjectInfo = (id) => state.projects.find(p => Number(p.id) === Number(id));

  // Get tasks that match status
  let filtered = state.tasks.filter(task => {
    // First filter by status
    if (task.status !== title) return false;
    
    // Filter by category
    if (category && category !== 'all' && task.category !== category) {
      return false;
    }
    
    // Filter by priority
    if (priority && priority !== 'all' && task.priority !== priority) {
      return false;
    }
    
    // Then filter by search term if provided
    if (filter && filter.trim() !== '') {
      const searchTerm = filter.toLowerCase().trim();
      const taskTitle = (task.title || '').toLowerCase();
      const taskDescription = (task.description || '').toLowerCase();
      const taskAssignee = (task.assignee || '').toLowerCase();
      const taskPriority = (task.priority || '').toLowerCase();
      const taskDueDate = (task.dueDate || '').toLowerCase();
      const taskCategory = (task.category || '').toLowerCase();
      
      // Get project name for search
      const proj = getProjectInfo(task.projectId);
      const projectName = (proj?.name || '').toLowerCase();
      
      // Enhanced search across multiple fields
      const searchableFields = [
        taskTitle,
        taskDescription,
        taskAssignee,
        taskPriority,
        taskDueDate,
        projectName,
        taskCategory
      ];
      
      // Check if search term appears in any field
      const hasMatch = searchableFields.some(field => 
        field.includes(searchTerm)
      );
      
      // Also check for partial word matches
      const words = searchTerm.split(' ').filter(word => word.length > 0);
      const hasWordMatch = words.some(word =>
        searchableFields.some(field => field.includes(word))
      );
      
      if (!hasMatch && !hasWordMatch) {
        return false;
      }
    }
    
    return true;
  });

  // Update project filter logic
  if (project && project !== 'all') {
    if (project === 'none') {
      filtered = filtered.filter(task => !task.projectId || task.projectId === '' || task.projectId === null);
    } else {
      filtered = filtered.filter(task => Number(task.projectId) === Number(project));
    }
  }

  // Update task count with animation
  useEffect(() => {
    const targetCount = filtered.length;
    const increment = targetCount > taskCount ? 1 : -1;
    const timer = setInterval(() => {
      setTaskCount(prev => {
        if (prev === targetCount) {
          clearInterval(timer);
          return prev;
        }
        return prev + increment;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [filtered.length]);

  // Sort tasks by priority and due date
  filtered.sort((a, b) => {
    // Priority order: High > Medium > Low
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;
    
    // If priorities are different, sort by priority (higher first)
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // If priorities are the same, sort by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    
    // If only one has a due date, prioritize the one with a date
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // If neither has a due date, maintain original order
    return 0;
  });

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Check if task is due soon (within 3 days)
  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get category color
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

  // Get category icon
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

  const handleToggle = (id) => {
    const task = state.tasks.find(t => t.id === id);
    if (task && task.status !== 'Done') {
      // Show site-wide confetti when completing a task
      const confettiEvent = new CustomEvent('showConfetti', {
        detail: { message: '🎉 Task Completed! 🎉' }
      });
      document.dispatchEvent(confettiEvent);
    }
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const handleEdit = (task, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setEditingTask(task.id);
    setEditForm({ ...task });
  };

  const handleDelete = (id, e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: id });
    }
  };

  const handleSaveEdit = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    dispatch({
      type: 'EDIT_TASK',
      payload: { id: editingTask, updates: editForm }
    });
    setEditingTask(null);
    setEditForm({});
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setEditingTask(null);
    setEditForm({});
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.currentTarget.style.transform = 'rotate(2deg) scale(1.05)';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const taskId = e.dataTransfer.getData('text/plain');
    const task = state.tasks.find(t => t.id === parseInt(taskId));
    
    // Show confetti when moving to Done
    if (title === 'Done' && task && task.status !== 'Done') {
      // Create site-wide confetti celebration
      const confettiEvent = new CustomEvent('showConfetti', {
        detail: { message: '🎉 Task Completed! 🎉' }
      });
      document.dispatchEvent(confettiEvent);
    }
    
    dispatch({
      type: 'UPDATE_TASK_STATUS',
      payload: { id: parseInt(taskId), status: title }
    });
  };

  // Handle Projects Column
  if (title === 'My Projects') {
    const handleDelete = (id, e) => {
      e.stopPropagation();
      if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
        dispatch({ type: 'DELETE_PROJECT', payload: id });
        setExpandedProject(null);
      }
    };

    const handleEditProject = (project, e) => {
      e.stopPropagation();
      setEditingProject(project.id);
      setEditProjectForm({ name: project.name, description: project.description, color: project.color });
    };

    const handleSaveProjectEdit = (e) => {
      e.preventDefault();
      dispatch({
        type: 'EDIT_PROJECT',
        payload: { id: editingProject, updates: editProjectForm }
      });
      setEditingProject(null);
      setEditProjectForm({});
    };

    const handleCancelProjectEdit = (e) => {
      e.stopPropagation();
      setEditingProject(null);
      setEditProjectForm({});
    };

    const handleProjectClick = (projectId, e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      setExpandedProject(projectId);
    };

    const closeProjectModal = () => {
      setExpandedProject(null);
      setEditingProject(null);
      setEditProjectForm({});
    };

    const project = expandedProject ? state.projects.find(p => p.id === expandedProject) : null;

    return (
      <>
        <div className={`task-column projects`}>
          <h2>
            {title}
            <span className="task-counter">{state.projects.length}</span>
          </h2>
          {state.projects.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#999' }}>No projects yet</p>
          ) : (
            state.projects.map((proj) => (
              <div
                key={proj.id}
                className="task-card projects"
                style={{ borderLeft: `6px solid ${proj.color}` }}
                onClick={e => handleProjectClick(proj.id, e)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div className="color-dot" style={{ backgroundColor: proj.color }} />
                  <strong>{proj.name}</strong>
                </div>
                {proj.description && <p style={{ fontSize: '0.95em', color: '#6b7280', marginBottom: '0.5rem' }}>{proj.description}</p>}
                <div style={{ marginTop: '0.75rem' }}>
                  <button onClick={e => handleEditProject(proj, e)} className="edit-button">Edit</button>
                  <button onClick={e => handleDelete(proj.id, e)} className="delete-button">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
        {expandedProject && project && ReactDOM.createPortal(
          <div className="task-modal-overlay" onClick={closeProjectModal}>
            <div className="task-modal" onClick={e => e.stopPropagation()}>
              <div className="task-header">
                <div className="task-complete">
                  <div className="color-dot" style={{ backgroundColor: project.color, marginRight: 8 }} />
                  <strong>{project.name}</strong>
                </div>
                <button onClick={closeProjectModal} className="close-expand-btn">×</button>
              </div>
              {editingProject === expandedProject ? (
                <form className="edit-form" onSubmit={handleSaveProjectEdit}>
                  <input
                    type="text"
                    value={editProjectForm.name || ''}
                    onChange={e => setEditProjectForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Project Name"
                    className="edit-input"
                    required
                  />
                  <textarea
                    value={editProjectForm.description || ''}
                    onChange={e => setEditProjectForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Description"
                    className="edit-textarea"
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <label className="text-xs font-medium text-gray-700">Color:</label>
                    <input
                      type="color"
                      value={editProjectForm.color || '#4f46e5'}
                      onChange={e => setEditProjectForm(f => ({ ...f, color: e.target.value }))}
                      className="h-6 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div className="edit-buttons">
                    <button type="submit" className="edit-button">Save</button>
                    <button type="button" onClick={handleCancelProjectEdit} className="delete-button">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="task-expanded-content">
                  {project.description && <p className="task-description">{project.description}</p>}
                  <div className="task-actions">
                    <button onClick={e => handleEditProject(project, e)} className="edit-button">Edit</button>
                    <button onClick={e => handleDelete(project.id, e)} className="delete-button">Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  // Handle task card click to expand
  const handleTaskClick = (taskId, e) => {
    if (e.target.tagName === 'BUTTON' || e.target.type === 'checkbox' || e.target.closest('button')) {
      return;
    }
    if (onTaskClick) onTaskClick(taskId);
  };

  return (
    <div 
      className={`task-column ${statusClass}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2>
        {title}
        <span className="task-counter">{taskCount}</span>
      </h2>

      {filtered.map(task => {
        const proj = getProjectInfo(task.projectId);
        const color = proj?.color || '#64748b';
        const projectName = proj?.name || 'No Project';
        const overdue = isOverdue(task.dueDate);
        const dueSoon = isDueSoon(task.dueDate);
        const isEditing = editingTask === task.id;
        return (
          <div
            key={task.id}
            className={`task-card ${statusClass} ${task.status === 'Done' ? 'completed' : ''} ${overdue ? 'overdue' : ''} ${dueSoon ? 'due-soon' : ''}`}
            style={{ borderLeft: `6px solid ${color}` }}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={handleDragEnd}
            onClick={(e) => handleTaskClick(task.id, e)}
          >
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="edit-task-form" onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
                <textarea
                  value={editForm.description || ''}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                />
                <input
                  type="text"
                  value={editForm.assignee || ''}
                  onChange={e => setEditForm(f => ({ ...f, assignee: e.target.value }))}
                  placeholder="Assignee"
                />
                <select
                  value={editForm.priority || ''}
                  onChange={e => setEditForm(f => ({ ...f, priority: e.target.value }))}
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  type="date"
                  value={editForm.dueDate || ''}
                  onChange={e => setEditForm(f => ({ ...f, dueDate: e.target.value }))}
                />
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
              </form>
            ) : (
              <>
                <div className="task-complete">
                  <input
                    type="checkbox"
                    checked={task.status === 'Done'}
                    onChange={() => handleToggle(task.id)}
                  />
                  <strong>{task.title}</strong>
                </div>
                {/* BADGES ROW: Priority & Category */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  {task.priority && (
                    <div className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>{task.priority}</div>
                  )}
                  {task.category && (
                    <div className="category-badge" style={{ backgroundColor: getCategoryColor(task.category), borderLeft: `4px solid ${getCategoryColor(task.category)}` }}>
                      <span className="category-icon">{getCategoryIcon(task.category)}</span>
                      <span className="category-name">{task.category}</span>
                    </div>
                  )}
                </div>
                {/* DESCRIPTION & DETAILS */}
                {task.description && <p>{task.description}</p>}
                {task.assignee && <p><strong>Assignee:</strong> {task.assignee}</p>}
                {task.dueDate && (
                  <p className={`due-date ${overdue ? 'overdue' : dueSoon ? 'due-soon' : ''}`}>
                    <strong>Due:</strong> {task.dueDate}
                    {overdue && <span className="warning-icon">⚠️ Overdue</span>}
                    {dueSoon && !overdue && <span className="warning-icon">⏰ Due Soon</span>}
                  </p>
                )}
                {task.estimatedTime && <p><strong>Est. Time:</strong> {task.estimatedTime}h</p>}
                <p style={{ backgroundColor: color, color: 'white', padding: '4px 8px', fontSize: '0.8rem', borderRadius: '6px', display: 'inline-block', marginTop: '0.5rem' }}>{projectName}</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <button onClick={e => handleEdit(task, e)} className="edit-button">Edit</button>
                  <button onClick={e => handleDelete(task.id, e)} className="delete-button">Delete</button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

