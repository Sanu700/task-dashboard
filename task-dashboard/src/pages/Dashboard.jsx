import React, { useState } from 'react';
import ProjectForm from '../components/ProjectForm';
import TaskForm from '../components/TaskForm';
import TaskColumn from '../components/TaskColumn';
import { useTaskContext } from '../context/TaskContext';

export default function Dashboard() {
  const { state, dispatch } = useTaskContext();
  const [filter, setFilter] = useState('');
  const [project, setProject] = useState('all');

  return (
    <div className="dashboard-container">
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="all">All Projects</option>
          {state.projects.map((proj) => (
            <option key={proj.id} value={proj.id}>{proj.name}</option>
          ))}
        </select>
      </div>

      <div className="forms">
        <ProjectForm />
        <TaskForm />
      </div>

      <div className="task-columns">
        {/* Projects Column */}
        <TaskColumn title="My Projects" />

        {/* Existing Task Columns */}
        <TaskColumn title="To Do" filter={filter} project={project} />
        <TaskColumn title="In Progress" filter={filter} project={project} />
        <TaskColumn title="Done" filter={filter} project={project} />
      </div>
    </div>
  );
}
