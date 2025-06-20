import React, { useState } from 'react';

export default function TaskCard({ task, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...task });
  const [completed, setCompleted] = useState(task.completed || false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEdit(task.id, { ...formData, completed });
    setEditing(false);
  };

  const cardClass = `task-card ${completed ? 'completed' : ''}`;

  return (
    <div className={cardClass} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}>
      <div className="task-complete">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => setCompleted(!completed)}
        />
        <label>{completed ? 'Completed' : 'Mark Complete'}</label>
      </div>
      {editing ? (
        <>
          <input name="title" value={formData.title} onChange={handleChange} />
          <textarea name="description" value={formData.description} onChange={handleChange} />
          <input name="assignee" value={formData.assignee} onChange={handleChange} />
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Assignee:</strong> {task.assignee}</p>
          {task.dueDate && <p><strong>Due:</strong> {task.dueDate}</p>}
          <button onClick={() => setEditing(true)} className="edit-button">Edit</button>
        </>
      )}
      <button onClick={() => onDelete(task.id)} className="delete-button">Delete</button>
    </div>
  );
}