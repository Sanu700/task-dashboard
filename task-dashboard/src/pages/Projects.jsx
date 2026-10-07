import React, { useState } from 'react';
import { useTaskContext } from '../context/useTaskContext';

export default function Projects({ handleOpenTaskModal, handleOpenFocusModal }) {
  const { state, dispatch } = useTaskContext();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '', color: '#3b82f6' });

  const projects = state.projects || [];
  const tasks = state.tasks || [];
  const focusSessions = state.focusSessions || [];

  const handleOpenProjectModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({ name: proj.name, description: proj.description || '', color: proj.color || '#3b82f6' });
    } else {
      setEditingProject(null);
      setProjectForm({ name: '', description: '', color: '#3b82f6' });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    if (editingProject) {
      dispatch({
        type: 'EDIT_PROJECT',
        payload: { id: editingProject.id, updates: projectForm },
      });
    } else {
      dispatch({
        type: 'ADD_PROJECT',
        payload: { id: Date.now(), ...projectForm },
      });
    }
    setIsProjectModalOpen(false);
  };

  const selectedProject = projects.find(p => Number(p.id) === Number(selectedProjectId));

  // Compute metrics per project
  const getProjectMetrics = (projId) => {
    const projTasks = tasks.filter(t => Number(t.projectId) === Number(projId));
    const total = projTasks.length;
    const completed = projTasks.filter(t => t.status === 'Done').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Focus time in minutes
    const projSessions = focusSessions.filter(s => Number(s.projectId) === Number(projId));
    const totalFocusMins = projSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    return { total, completed, rate, focusMins: totalFocusMins, tasks: projTasks };
  };

  return (
    <div className="page-container projects-page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="subtext">Organize your tasks into structured, goal-driven projects</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenProjectModal()}>
          ➕ New Project
        </button>
      </div>

      {/* If a project is selected, show Project Detail View */}
      {selectedProject ? (
        <div className="project-detail-view">
          <button className="btn-ghost mb-3" onClick={() => setSelectedProjectId(null)}>
            ← Back to all projects
          </button>

          {(() => {
            const metrics = getProjectMetrics(selectedProject.id);
            return (
              <>
                <div className="project-detail-header" style={{ borderLeftColor: selectedProject.color }}>
                  <div className="detail-header-left">
                    <div className="project-title-row">
                      <span className="color-indicator" style={{ backgroundColor: selectedProject.color }} />
                      <h2>{selectedProject.name}</h2>
                    </div>
                    {selectedProject.description && <p className="detail-desc">{selectedProject.description}</p>}
                  </div>

                  <div className="detail-header-actions">
                    <button className="btn-secondary" onClick={() => handleOpenProjectModal(selectedProject)}>
                      ✏️ Edit Project
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => {
                        if (window.confirm(`Delete project "${selectedProject.name}" and all its tasks?`)) {
                          dispatch({ type: 'DELETE_PROJECT', payload: selectedProject.id });
                          setSelectedProjectId(null);
                        }
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Project Overview Metrics */}
                <div className="metrics-grid mt-4">
                  <div className="metric-card">
                    <div className="metric-icon remaining">📋</div>
                    <div className="metric-info">
                      <span className="metric-value">{metrics.total}</span>
                      <span className="metric-label">Total Tasks</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon completed">✅</div>
                    <div className="metric-info">
                      <span className="metric-value">{metrics.completed}</span>
                      <span className="metric-label">Completed</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon rate">📊</div>
                    <div className="metric-info">
                      <span className="metric-value">{metrics.rate}%</span>
                      <span className="metric-label">Completion Rate</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon focus">⏱️</div>
                    <div className="metric-info">
                      <span className="metric-value">{metrics.focusMins}m</span>
                      <span className="metric-label">Focus Time Spent</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="project-progress-card mt-4">
                  <div className="progress-info-row">
                    <span>Project Progress</span>
                    <span>{metrics.completed} of {metrics.total} tasks done</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${metrics.rate}%`, backgroundColor: selectedProject.color }}
                    />
                  </div>
                </div>

                {/* Project Task List */}
                <div className="project-tasks-section mt-5">
                  <div className="section-header">
                    <h3>Project Tasks</h3>
                    <button className="btn-secondary" onClick={() => handleOpenTaskModal(null)}>
                      + Add Task
                    </button>
                  </div>

                  {metrics.tasks.length === 0 ? (
                    <div className="empty-state-card">
                      <p>No tasks inside this project yet.</p>
                    </div>
                  ) : (
                    <div className="task-list-rows">
                      {metrics.tasks.map((task) => (
                        <div key={task.id} className={`task-list-row ${task.status === 'Done' ? 'completed' : ''}`}>
                          <div className="task-row-left">
                            <input
                              type="checkbox"
                              checked={task.status === 'Done'}
                              onChange={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                              className="task-checkbox"
                            />
                            <div className="task-info">
                              <span className="task-title">{task.title}</span>
                              {task.description && <p className="task-desc">{task.description}</p>}
                            </div>
                          </div>

                          <div className="task-row-right">
                            {task.priority && (
                              <span className={`badge-priority ${task.priority.toLowerCase()}`}>
                                {task.priority}
                              </span>
                            )}

                            {task.dueDate && <span className="due-date-text">{task.dueDate}</span>}

                            <div className="task-row-actions">
                              <button className="btn-row-action focus" onClick={() => handleOpenFocusModal(task.id)}>
                                ⏱️ Focus
                              </button>
                              <button className="btn-row-action" onClick={() => handleOpenTaskModal(task)}>
                                ✏️
                              </button>
                              <button
                                className="btn-row-action danger"
                                onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        /* Projects Grid View */
        <div className="projects-grid">
          {projects.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon">📁</div>
              <h3>No projects yet</h3>
              <p>Create your first project to organize your work and track progress.</p>
              <button className="btn-primary mt-3" onClick={() => handleOpenProjectModal()}>
                + Create Project
              </button>
            </div>
          ) : (
            projects.map((project) => {
              const metrics = getProjectMetrics(project.id);
              return (
                <div
                  key={project.id}
                  className="project-card"
                  style={{ borderTopColor: project.color }}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <div className="project-card-header">
                    <div className="project-name-group">
                      <span className="color-dot" style={{ backgroundColor: project.color }} />
                      <h3>{project.name}</h3>
                    </div>
                    <span className="task-count-badge">{metrics.total} tasks</span>
                  </div>

                  {project.description && <p className="project-desc">{project.description}</p>}

                  <div className="project-card-metrics">
                    <div className="metric-mini">
                      <span className="label">Completed</span>
                      <span className="val">{metrics.completed} / {metrics.total}</span>
                    </div>
                    <div className="metric-mini">
                      <span className="label">Focus Time</span>
                      <span className="val">{metrics.focusMins}m</span>
                    </div>
                  </div>

                  <div className="project-progress-bar">
                    <div className="progress-fill" style={{ width: `${metrics.rate}%`, backgroundColor: project.color }} />
                  </div>

                  <div className="project-card-footer">
                    <span className="rate-text">{metrics.rate}% complete</span>
                    <button className="btn-link">View project →</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isProjectModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProjectModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
              <button className="modal-close-btn" onClick={() => setIsProjectModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSaveProject} className="task-modal-form">
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="e.g. ToxicBuddy"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Short explanation of project scope & goals..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Theme Color</label>
                <div className="color-picker-row">
                  <input
                    type="color"
                    value={projectForm.color}
                    onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}
                    className="color-picker-input"
                  />
                  <span className="color-value">{projectForm.color}</span>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsProjectModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
