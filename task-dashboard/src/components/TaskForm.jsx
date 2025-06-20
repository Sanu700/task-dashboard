import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('To Do');
  const [projectId, setProjectId] = useState('');
  const { state, dispatch } = useTaskContext(); // ✅ get state to list projects

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: Date.now(),
        title,
        description,
        priority,
        assignee,
        dueDate,
        status,
        projectId: Number(projectId), // ✅ store projectId
      },
    });

    setTitle('');
    setDescription('');
    setAssignee('');
    setDueDate('');
    setProjectId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="text"
        placeholder="Assignee"
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      {/* ✅ Project Selector */}
      <select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
      >
        <option value="">Select Project</option>
        {state.projects.map((proj) => (
          <option key={proj.id} value={proj.id}>
            {proj.name}
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
