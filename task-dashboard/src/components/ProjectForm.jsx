import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function ProjectForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const { dispatch } = useTaskContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_PROJECT',
      payload: { id: Date.now(), name, description, color },
    });
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700">Color:</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 border rounded" />
      </div>
      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">Save Project</button>
    </form>
  );
}