import React, { useState } from 'react';
import { useTaskContext } from '../context/useTaskContext';

export default function Templates() {
  const { state, dispatch } = useTaskContext();
  const [selectedProjectForTemplate, setSelectedProjectForTemplate] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTemplateTitle, setCustomTemplateTitle] = useState('');
  const [customTasks, setCustomTasks] = useState(['', '']);
  const [toastMessage, setToastMessage] = useState('');

  const builtInTemplates = {
    'Interview Preparation': [
      { title: 'Solve DSA Problems (LeetCode Medium)', category: 'learning', priority: 'High', estimatedMinutes: 60 },
      { title: 'Review Mistakes & Edge Cases', category: 'learning', priority: 'Medium', estimatedMinutes: 30 },
      { title: 'System Design Architecture Sketch', category: 'work', priority: 'High', estimatedMinutes: 60 },
      { title: 'Behavioral Prep (STAR Method Stories)', category: 'personal', priority: 'Medium', estimatedMinutes: 45 }
    ],
    'Daily Routine': [
      { title: 'Morning Focus & Meditation', category: 'health', priority: 'High', estimatedMinutes: 30 },
      { title: 'Review & Plan Top 3 Goals', category: 'work', priority: 'High', estimatedMinutes: 15 },
      { title: 'Check Emails & Async Messages', category: 'work', priority: 'Medium', estimatedMinutes: 30 },
      { title: 'Evening Daily Reflection', category: 'personal', priority: 'Low', estimatedMinutes: 15 }
    ],
    'Sprint & Feature Setup': [
      { title: 'Define Feature Requirements & User Stories', category: 'work', priority: 'High', estimatedMinutes: 60 },
      { title: 'Create DB Schemas & API Contracts', category: 'work', priority: 'High', estimatedMinutes: 90 },
      { title: 'Implement Frontend UI Components', category: 'work', priority: 'High', estimatedMinutes: 120 },
      { title: 'Write Integration & End-to-End Tests', category: 'work', priority: 'Medium', estimatedMinutes: 60 }
    ],
    'Learning Session': [
      { title: 'Read Documentation / Chapter', category: 'learning', priority: 'High', estimatedMinutes: 45 },
      { title: 'Build Hands-On Code Example', category: 'learning', priority: 'High', estimatedMinutes: 60 },
      { title: 'Synthesize Notes & Key Concepts', category: 'learning', priority: 'Medium', estimatedMinutes: 30 }
    ],
    'Financial Planning': [
      { title: 'Review Monthly Budget & Subscriptions', category: 'finance', priority: 'High', estimatedMinutes: 30 },
      { title: 'Pay Pending Bills & Transfers', category: 'finance', priority: 'High', estimatedMinutes: 15 },
      { title: 'Track Savings & Investment Portfolio', category: 'finance', priority: 'Medium', estimatedMinutes: 30 }
    ]
  };

  const applyTemplate = (name, tasks) => {
    const today = new Date().toISOString().split('T')[0];
    tasks.forEach((t, i) => {
      const newTask = {
        id: Date.now() + i,
        title: t.title,
        description: `Generated from template "${name}"`,
        projectId: selectedProjectForTemplate || null,
        priority: t.priority || 'Medium',
        category: t.category || 'work',
        dueDate: today,
        estimatedMinutes: t.estimatedMinutes || 30,
        estimatedTime: Math.round(((t.estimatedMinutes || 30) / 60) * 10) / 10,
        status: 'To Do',
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        focusTimeMinutes: 0,
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
    });

    triggerToast(`Added ${tasks.length} tasks from "${name}"!`);
  };

  const handleAddCustomTaskRow = () => {
    setCustomTasks([...customTasks, '']);
  };

  const handleCustomTaskChange = (index, val) => {
    const copy = [...customTasks];
    copy[index] = val;
    setCustomTasks(copy);
  };

  const handleSaveCustomTemplate = (e) => {
    e.preventDefault();
    const validTitles = customTasks.filter(t => t.trim().length > 0);
    if (!customTemplateTitle.trim() || validTitles.length === 0) return;

    const newTemplate = {
      id: Date.now(),
      title: customTemplateTitle,
      tasks: validTitles.map(t => ({ title: t, priority: 'Medium', category: 'work', estimatedMinutes: 30 })),
    };

    dispatch({ type: 'ADD_CUSTOM_TEMPLATE', payload: newTemplate });
    setShowCustomModal(false);
    setCustomTemplateTitle('');
    setCustomTasks(['', '']);
    triggerToast(`Created custom template "${newTemplate.title}"!`);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const customTemplates = state.customTemplates || [];

  return (
    <div className="page-container templates-page">
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      <div className="page-header">
        <div>
          <h1>Task Templates</h1>
          <p className="subtext">Quickly jumpstart recurring workflows and project checklists</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCustomModal(true)}>
          ➕ Create Template
        </button>
      </div>

      {/* Target Project Selection */}
      <div className="template-target-card mt-3">
        <label>Target Project for generated tasks:</label>
        <select
          value={selectedProjectForTemplate}
          onChange={(e) => setSelectedProjectForTemplate(e.target.value)}
          className="filter-select"
        >
          <option value="">No Project (General Inbox)</option>
          {(state.projects || []).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Built-in Templates */}
      <div className="templates-section mt-5">
        <h2>Built-in Productivity Workflows</h2>
        <div className="templates-grid mt-3">
          {Object.entries(builtInTemplates).map(([name, tasks]) => (
            <div key={name} className="template-card">
              <div className="template-card-header">
                <h3>{name}</h3>
                <span className="task-badge">{tasks.length} tasks</span>
              </div>

              <ul className="template-task-preview">
                {tasks.map((t, idx) => (
                  <li key={idx}>
                    <span className="bullet">□</span> {t.title}
                  </li>
                ))}
              </ul>

              <button
                className="btn-primary btn-full mt-3"
                onClick={() => applyTemplate(name, tasks)}
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Templates */}
      {customTemplates.length > 0 && (
        <div className="templates-section mt-6">
          <h2>Your Custom Templates</h2>
          <div className="templates-grid mt-3">
            {customTemplates.map((template) => (
              <div key={template.id} className="template-card custom">
                <div className="template-card-header">
                  <h3>{template.title}</h3>
                  <span className="task-badge">{template.tasks.length} tasks</span>
                </div>

                <ul className="template-task-preview">
                  {template.tasks.map((t, idx) => (
                    <li key={idx}>
                      <span className="bullet">□</span> {t.title}
                    </li>
                  ))}
                </ul>

                <div className="template-card-actions mt-3">
                  <button
                    className="btn-primary flex-1"
                    onClick={() => applyTemplate(template.title, template.tasks)}
                  >
                    Use Template
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => dispatch({ type: 'DELETE_CUSTOM_TEMPLATE', payload: template.id })}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Custom Template Modal */}
      {showCustomModal && (
        <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Custom Template</h3>
              <button className="modal-close-btn" onClick={() => setShowCustomModal(false)}>×</button>
            </div>

            <form onSubmit={handleSaveCustomTemplate} className="task-modal-form">
              <div className="form-group">
                <label>Template Name *</label>
                <input
                  type="text"
                  value={customTemplateTitle}
                  onChange={(e) => setCustomTemplateTitle(e.target.value)}
                  placeholder="e.g. Weekly Code Review"
                  required
                />
              </div>

              <div className="form-group">
                <label>Checklist Tasks *</label>
                {customTasks.map((t, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={t}
                    onChange={(e) => handleCustomTaskChange(idx, e.target.value)}
                    placeholder={`Task ${idx + 1}`}
                    className="mb-2"
                  />
                ))}
                <button
                  type="button"
                  className="btn-secondary btn-small mt-1"
                  onClick={handleAddCustomTaskRow}
                >
                  + Add task row
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCustomModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
