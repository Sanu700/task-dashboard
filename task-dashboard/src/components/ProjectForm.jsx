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
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          style={window.innerWidth <= 600 ? { width: '100vw', maxWidth: '100vw', minWidth: 0, boxSizing: 'border-box' } : {}}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          style={window.innerWidth <= 600 ? { width: '100vw', maxWidth: '100vw', minWidth: 0, boxSizing: 'border-box' } : {}}
          rows="3"
        />
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Color:</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="h-8 border border-gray-300 rounded cursor-pointer"
            style={window.innerWidth <= 600 ? { width: '48px', minWidth: 0, boxSizing: 'border-box' } : {}}
          />
        </div>
        <button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition-colors duration-200 font-medium"
          style={window.innerWidth <= 600 ? { width: '100vw', maxWidth: '100vw', minWidth: 0, boxSizing: 'border-box' } : {}}
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
