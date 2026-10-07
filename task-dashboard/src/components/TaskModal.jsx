import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/useTaskContext';

export default function TaskModal({ isOpen, onClose, editingTask = null, defaultProjectId = null }) {
  const { state, dispatch } = useTaskContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    projectId: defaultProjectId || '',
    category: 'work',
    assignee: 'Sanvi',
    dueDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 30,
    tags: '',
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'Medium',
        projectId: editingTask.projectId || '',
        category: editingTask.category || 'work',
        assignee: editingTask.assignee || 'Sanvi',
        dueDate: editingTask.dueDate || new Date().toISOString().split('T')[0],
        estimatedMinutes: editingTask.estimatedMinutes || (editingTask.estimatedTime ? editingTask.estimatedTime * 60 : 30),
        tags: Array.isArray(editingTask.tags) ? editingTask.tags.join(', ') : editingTask.tags || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        projectId: defaultProjectId || '',
        category: 'work',
        assignee: 'Sanvi',
        dueDate: new Date().toISOString().split('T')[0],
        estimatedMinutes: 30,
        tags: '',
      });
    }
  }, [editingTask, isOpen, defaultProjectId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedTags = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    if (editingTask) {
      dispatch({
        type: 'EDIT_TASK',
        payload: {
          id: editingTask.id,
          updates: {
            ...formData,
            tags: parsedTags,
            estimatedTime: Math.round((Number(formData.estimatedMinutes) / 60) * 10) / 10,
          },
        },
      });
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        tags: parsedTags,
        estimatedTime: Math.round((Number(formData.estimatedMinutes) / 60) * 10) / 10,
        status: 'To Do',
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        focusTimeMinutes: 0,
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
    }

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card task-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="task-modal-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Finish API integration"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add key context, links, or sub-steps..."
              rows={3}
            />
          </div>

          <div className="form-row grid-2">
            <div className="form-group">
              <label>Project</label>
              <select name="projectId" value={formData.projectId} onChange={handleChange}>
                <option value="">No Project</option>
                {(state.projects || []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="form-row grid-2">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row grid-2">
            <div className="form-group">
              <label>Estimated Time (mins)</label>
              <input
                type="number"
                name="estimatedMinutes"
                value={formData.estimatedMinutes}
                onChange={handleChange}
                min="5"
                step="5"
              />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="API, Backend, PR"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
