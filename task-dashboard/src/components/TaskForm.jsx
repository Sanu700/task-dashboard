import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function TaskForm() {
  const { state, dispatch } = useTaskContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    assignee: '',
    dueDate: '',
    projectId: '',
    category: '',
    estimatedTime: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTask = {
      id: Date.now(),
      ...formData,
      priority: formData.priority || 'Medium',
      status: 'To Do',
      createdAt: new Date().toISOString(),
      completedAt: null,
      timeSpent: 0
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    setFormData({
      title: '',
      description: '',
      priority: '',
      assignee: '',
      dueDate: '',
      projectId: '',
      category: '',
      estimatedTime: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3>Add New Task</h3>
      
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Task Title"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        rows="3"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
      >
        <option value="" disabled>Select Priority</option>
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>

      <select
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="" disabled>Type</option>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="health">Health</option>
        <option value="learning">Learning</option>
        <option value="finance">Finance</option>
        <option value="other">Other</option>
      </select>

      <input
        type="text"
        name="assignee"
        value={formData.assignee}
        onChange={handleChange}
        placeholder="Assignee"
        className="w-full border border-gray-300 rounded px-3 py-2"
      />

      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />

      <input
        type="number"
        name="estimatedTime"
        value={formData.estimatedTime}
        onChange={handleChange}
        placeholder="Estimated Time (hours)"
        min="0"
        step="0.5"
        className="w-full border border-gray-300 rounded px-3 py-2"
      />

      <select
        name="projectId"
        value={formData.projectId}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="">Select Project</option>
        {state.projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
      >
        Add Task
      </button>
    </form>
  );
}
