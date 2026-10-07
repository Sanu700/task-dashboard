import React from 'react';
import { useTaskContext } from '../context/useTaskContext';

export default function Upcoming({ handleOpenTaskModal, handleOpenFocusModal }) {
  const { state, dispatch } = useTaskContext();
  const allTasks = state.tasks || [];

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const next7DaysEndStr = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];

  const getProjectInfo = (id) => (state.projects || []).find(p => Number(p.id) === Number(id));

  // Group tasks
  const overdue = allTasks.filter(t => t.dueDate && t.dueDate < todayStr && t.status !== 'Done');
  const today = allTasks.filter(t => t.dueDate === todayStr);
  const tomorrow = allTasks.filter(t => t.dueDate === tomorrowStr);
  const next7Days = allTasks.filter(t => t.dueDate > tomorrowStr && t.dueDate <= next7DaysEndStr);
  const later = allTasks.filter(t => t.dueDate > next7DaysEndStr);
  const noDate = allTasks.filter(t => !t.dueDate);

  const sections = [
    { id: 'overdue', title: 'Overdue ⚠️', tasks: overdue, isWarning: true },
    { id: 'today', title: 'Today ☀️', tasks: today },
    { id: 'tomorrow', title: 'Tomorrow 📅', tasks: tomorrow },
    { id: 'next7Days', title: 'Next 7 Days 🗓️', tasks: next7Days },
    { id: 'later', title: 'Later 📌', tasks: later },
    { id: 'noDate', title: 'No Due Date 📝', tasks: noDate },
  ];

  return (
    <div className="page-container upcoming-page">
      <div className="page-header">
        <div>
          <h1>Upcoming Tasks</h1>
          <p className="subtext">Plan ahead and track your schedule across time frames</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenTaskModal()}>
          ➕ Add Task
        </button>
      </div>

      <div className="upcoming-sections">
        {sections.map((section) => {
          if (section.tasks.length === 0) return null;

          return (
            <div key={section.id} className={`upcoming-section ${section.isWarning ? 'warning' : ''}`}>
              <div className="section-header">
                <h3>{section.title}</h3>
                <span className="section-badge">{section.tasks.length}</span>
              </div>

              <div className="task-list-rows">
                {section.tasks.map((task) => {
                  const project = getProjectInfo(task.projectId);

                  return (
                    <div
                      key={task.id}
                      className={`task-list-row ${task.status === 'Done' ? 'completed' : ''}`}
                    >
                      <div className="task-row-left">
                        <input
                          type="checkbox"
                          checked={task.status === 'Done'}
                          onChange={() => {
                            if (task.status !== 'Done') {
                              const confettiEvent = new CustomEvent('showConfetti', {
                                detail: { message: '🎉 Task Completed! 🎉' }
                              });
                              document.dispatchEvent(confettiEvent);
                            }
                            dispatch({ type: 'TOGGLE_TASK', payload: task.id });
                          }}
                          className="task-checkbox"
                        />
                        <div className="task-info">
                          <span className="task-title">{task.title}</span>
                          {task.description && <p className="task-desc">{task.description}</p>}
                        </div>
                      </div>

                      <div className="task-row-right">
                        {project && (
                          <span
                            className="project-tag-pill"
                            style={{
                              backgroundColor: `${project.color}15`,
                              color: project.color,
                              borderColor: `${project.color}30`,
                            }}
                          >
                            {project.name}
                          </span>
                        )}

                        {task.priority && (
                          <span className={`badge-priority ${task.priority.toLowerCase()}`}>
                            {task.priority}
                          </span>
                        )}

                        {task.dueDate && (
                          <span className="due-date-text">{task.dueDate}</span>
                        )}

                        <div className="task-row-actions">
                          <button
                            className="btn-row-action focus"
                            onClick={() => handleOpenFocusModal(task.id)}
                          >
                            ⏱️ Focus
                          </button>
                          <button
                            className="btn-row-action"
                            onClick={() => handleOpenTaskModal(task)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-row-action danger"
                            onClick={() => {
                              if (window.confirm('Delete this task?')) {
                                dispatch({ type: 'DELETE_TASK', payload: task.id });
                              }
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {allTasks.length === 0 && (
          <div className="empty-state-card">
            <div className="empty-icon">📅</div>
            <h3>No upcoming tasks</h3>
            <p>Your calendar is clean! Create a new task with a due date to start planning.</p>
            <button className="btn-primary mt-3" onClick={() => handleOpenTaskModal()}>
              + Add a Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
