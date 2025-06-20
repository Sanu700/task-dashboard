import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function ProjectForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const { state, dispatch } = useTaskContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_PROJECT',
      payload: { id: Date.now(), name, description, color },
    });
    setName('');
    setDescription('');
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

  return (
    <div className="project-form-wrapper">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          rows="3"
        />
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Color:</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition-colors duration-200 font-medium"
        >
          Save Project
        </button>
      </form>

      {state.projects.length > 0 && (
        <div className="project-list">
          {state.projects.map((proj) => (
            <div key={proj.id} className="project-item">
              <div className="color-dot" style={{ backgroundColor: proj.color }} />
              <span className="project-name">{proj.name}</span>
              <button
                className="delete-project"
                onClick={() => handleDelete(proj.id)}
                title="Delete Project"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
