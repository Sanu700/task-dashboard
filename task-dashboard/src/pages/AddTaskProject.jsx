import React from 'react';
import TaskForm from '../components/TaskForm';
import ProjectForm from '../components/ProjectForm';

export default function AddTaskProject() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: '0.3rem', paddingBottom: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.2rem', fontWeight: 800, fontSize: '2.2rem', letterSpacing: '0.5px', color: '#4f46e5' }}>
        Add New Task & Project
      </h2>
      <div className="forms" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 340, maxWidth: 420 }}>
          <TaskForm />
        </div>
        <div style={{ flex: 1, minWidth: 340, maxWidth: 420 }}>
          <ProjectForm />
        </div>
      </div>
    </div>
  );
} 