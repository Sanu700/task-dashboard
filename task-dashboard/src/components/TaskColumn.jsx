import React from 'react';
import TaskCard from './TaskCard';
import { useTaskContext } from '../context/TaskContext';

export default function TaskColumn({ title, filter, project }) {
  const { state, dispatch } = useTaskContext();

  let filtered = state.tasks.filter((task) => task.status === title);

  if (filter) {
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(filter.toLowerCase()) ||
        task.assignee.toLowerCase().includes(filter.toLowerCase()) ||
        task.priority.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (project && project !== 'all') {
    filtered = filtered.filter(task => task.projectId === project);
  }

  filtered.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('text/plain'));
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { id: taskId, status: title } });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleEdit = (id, updates) => {
    dispatch({ type: 'EDIT_TASK', payload: { id, updates } });
  };

  return (
    <div className="task-column" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <h2>{title}</h2>
      {filtered.length ? (
        filtered.map((task) => <TaskCard key={task.id} task={task} onDelete={handleDelete} onEdit={handleEdit} />)
      ) : (
        <p>No tasks in this category.</p>
      )}
    </div>
  );
}
