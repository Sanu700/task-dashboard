import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function TaskColumn({ title, filter, project }) {
  const { state, dispatch } = useTaskContext();
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Handle Projects Column
  if (title === 'My Projects') {
    const handleDelete = (id) => {
      if (confirm('Are you sure you want to delete this project?')) {
        dispatch({ type: 'DELETE_PROJECT', payload: id });
      }
    };

    return (
      <div className="task-column">
        <h2>{title}</h2>
        {state.projects.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#999' }}>No projects yet</p>
        ) : (
          state.projects.map((proj) => (
            <div
              key={proj.id}
              className="task-card"
              style={{ borderLeft: `6px solid ${proj.color}` }}
            >
              <h3>{proj.name}</h3>
              <p>{proj.description}</p>
              <button
                onClick={() => handleDelete(proj.id)}
                className="delete-button"
                style={{ marginTop: '0.5rem' }}
              >
                🗑 Delete
              </button>
            </div>
          ))
        )}
      </div>
    );
  }

  // Get tasks that match status
  let filtered = state.tasks.filter(task => {
    // First filter by status
    if (task.status !== title) return false;
    
    // Then filter by search term if provided
    if (filter && filter.trim() !== '') {
      const searchTerm = filter.toLowerCase().trim();
      const taskTitle = (task.title || '').toLowerCase();
      const taskDescription = (task.description || '').toLowerCase();
      const taskAssignee = (task.assignee || '').toLowerCase();
      
      // Simple search in title, description, and assignee
      if (!taskTitle.includes(searchTerm) && 
          !taskDescription.includes(searchTerm) && 
          !taskAssignee.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });

  // Filter by project if selected
  if (project && project !== 'all') {
    filtered = filtered.filter(task => Number(task.projectId) === Number(project));
  }

  // Get project info by ID
  const getProjectInfo = (id) => state.projects.find(p => Number(p.id) === Number(id));

  const handleToggle = (id) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditForm({ ...task });
  };

  const handleSaveEdit = () => {
    dispatch({
      type: 'EDIT_TASK',
      payload: { id: editingTask, updates: editForm }
    });
    setEditingTask(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({});
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
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
    dispatch({
      type: 'UPDATE_TASK_STATUS',
      payload: { id: parseInt(taskId), status: title }
    });
  };

  return (
    <div 
      className="task-column"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2>{title}</h2>
      {filtered.map(task => {
        const proj = getProjectInfo(task.projectId);
        const color = proj?.color || '#64748b'; // default gray
        const projectName = proj?.name || 'No Project';

        return (
          <div
            key={task.id}
            className={`task-card ${task.status === 'Done' ? 'completed' : ''}`}
            style={{ borderLeft: `6px solid ${color}` }}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
          >
            {editingTask === task.id ? (
              // Edit Form
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  placeholder="Task Title"
                  className="edit-input"
                />
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  placeholder="Description"
                  className="edit-textarea"
                />
                <select
                  value={editForm.priority || 'Medium'}
                  onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                  className="edit-select"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  type="text"
                  value={editForm.assignee || ''}
                  onChange={(e) => setEditForm({...editForm, assignee: e.target.value})}
                  placeholder="Assignee"
                  className="edit-input"
                />
                <input
                  type="date"
                  value={editForm.dueDate || ''}
                  onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                  className="edit-input"
                />
                <div className="edit-buttons">
                  <button onClick={handleSaveEdit} className="edit-button">Save</button>
                  <button onClick={handleCancelEdit} className="delete-button">Cancel</button>
                </div>
              </div>
            ) : (
              // Display Mode
              <>
                <div className="task-complete">
                  <input
                    type="checkbox"
                    checked={task.status === 'Done'}
                    onChange={() => handleToggle(task.id)}
                  />
                  <strong>{task.title}</strong>
                </div>

                {task.description && <p>{task.description}</p>}
                {task.priority && <p><strong>Priority:</strong> {task.priority}</p>}
                {task.assignee && <p><strong>Assignee:</strong> {task.assignee}</p>}
                {task.dueDate && <p><strong>Due:</strong> {task.dueDate}</p>}

                {/* ✅ Project Name Tag */}
                <p style={{
                  backgroundColor: color,
                  color: 'white',
                  padding: '4px 8px',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginTop: '0.5rem'
                }}>
                  {projectName}
                </p>

                <div>
                  <button onClick={() => handleEdit(task)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(task.id)} className="delete-button">Delete</button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
