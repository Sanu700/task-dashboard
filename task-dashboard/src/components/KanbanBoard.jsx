import React, { useState } from 'react';
import { useTaskContext } from '../context/useTaskContext';

export default function KanbanBoard({ tasks, onEditTask, onStartFocus }) {
  const { state, dispatch } = useTaskContext();
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    { id: 'To Do', title: 'TO DO', color: '#64748b' },
    { id: 'In Progress', title: 'IN PROGRESS', color: '#3b82f6' },
    { id: 'Done', title: 'DONE', color: '#10b981' },
  ];

  const getProjectInfo = (id) => (state.projects || []).find(p => Number(p.id) === Number(id));

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', String(taskId));
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverColumn === colId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskIdStr = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskIdStr) return;
    const taskId = Number(taskIdStr);

    const task = (state.tasks || []).find(t => Number(t.id) === taskId);
    if (!task) return;

    if (colId === 'Done' && task.status !== 'Done') {
      // Trigger completion confetti
      const confettiEvent = new CustomEvent('showConfetti', {
        detail: { message: '🎉 Task Completed! 🎉' }
      });
      document.dispatchEvent(confettiEvent);
    }

    dispatch({
      type: 'UPDATE_TASK_STATUS',
      payload: { id: taskId, status: colId },
    });
    setDraggedTaskId(null);
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-badge high';
      case 'Medium': return 'priority-badge medium';
      case 'Low': return 'priority-badge low';
      default: return 'priority-badge';
    }
  };

  return (
    <div className="kanban-board-container">
      <div className="kanban-columns-grid">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              className={`kanban-column ${isOver ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="kanban-column-header">
                <div className="column-title-group">
                  <span className="col-dot" style={{ backgroundColor: col.color }} />
                  <h4>{col.title}</h4>
                </div>
                <span className="col-count">{colTasks.length}</span>
              </div>

              <div className="kanban-column-body">
                {colTasks.length === 0 ? (
                  <div className="kanban-empty-state">
                    <span>No tasks</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const project = getProjectInfo(task.projectId);
                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

                    return (
                      <div
                        key={task.id}
                        className={`kanban-card ${task.status === 'Done' ? 'done' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      >
                        <div className="kanban-card-top">
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
                          />
                          <h5 className="task-card-title">{task.title}</h5>
                        </div>

                        {task.description && (
                          <p className="task-card-desc">{task.description}</p>
                        )}

                        <div className="kanban-card-meta">
                          {project && (
                            <span
                              className="project-pill"
                              style={{ backgroundColor: `${project.color}15`, color: project.color, borderColor: `${project.color}30` }}
                            >
                              {project.name}
                            </span>
                          )}

                          {task.priority && (
                            <span className={getPriorityBadgeClass(task.priority)}>
                              {task.priority}
                            </span>
                          )}

                          {task.dueDate && (
                            <span className={`due-date-pill ${isOverdue ? 'overdue' : ''}`}>
                              📅 {task.dueDate}
                            </span>
                          )}
                        </div>

                        <div className="kanban-card-actions">
                          <button
                            className="btn-action-icon"
                            title="Start Focus Session"
                            onClick={() => onStartFocus(task.id)}
                          >
                            ⏱️
                          </button>
                          <button
                            className="btn-action-icon"
                            title="Edit Task"
                            onClick={() => onEditTask(task)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-action-icon danger"
                            title="Delete Task"
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
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
