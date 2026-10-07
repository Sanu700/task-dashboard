import React, { useState } from 'react';
import { useTaskContext } from '../context/useTaskContext';

export default function Settings({ dark, setDark }) {
  const { state, dispatch } = useTaskContext();
  const [exportFormat, setExportFormat] = useState('json');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleExport = () => {
    const dataToExport = {
      tasks: state.tasks || [],
      projects: state.projects || [],
      focusSessions: state.focusSessions || [],
      userStreak: state.userStreak || {},
      exportDate: new Date().toISOString(),
    };

    let content, filename, mimeType;

    if (exportFormat === 'json') {
      content = JSON.stringify(dataToExport, null, 2);
      filename = `taskboard-export-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else if (exportFormat === 'csv') {
      const headers = ['Title', 'Description', 'Status', 'Priority', 'Category', 'Assignee', 'Due Date', 'Created At'];
      const rows = (state.tasks || []).map(t => [
        `"${t.title || ''}"`,
        `"${t.description || ''}"`,
        t.status || '',
        t.priority || '',
        t.category || '',
        `"${t.assignee || ''}"`,
        t.dueDate || '',
        t.createdAt || '',
      ]);
      content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `taskboard-tasks-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else {
      content = `Task Dashboard Export Report\nDate: ${new Date().toLocaleString()}\nTotal Tasks: ${state.tasks?.length || 0}\nTotal Projects: ${state.projects?.length || 0}\n`;
      filename = `taskboard-report-${new Date().toISOString().split('T')[0]}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Exported ${filename}!`);
  };

  const handleLoadSampleData = () => {
    if (window.confirm('Reset workspace with sample tasks and projects?')) {
      dispatch({ type: 'LOAD_SAMPLE_DATA' });
      triggerToast('Loaded sample workspace data!');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      dispatch({ type: 'RESET_ALL_DATA' });
      triggerToast('All data cleared.');
    }
  };

  return (
    <div className="page-container settings-page">
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtext">Configure your workspace preferences and manage data</p>
        </div>
      </div>

      <div className="settings-sections grid-2">
        {/* Workspace Theme Settings */}
        <div className="settings-card">
          <div className="card-header">
            <h3>🎨 Theme & Appearance</h3>
          </div>
          <div className="settings-item">
            <div>
              <span className="item-title">Dark Mode</span>
              <p className="item-desc">Use deep charcoal theme for low-light environments</p>
            </div>
            <button className="btn-secondary" onClick={() => setDark(!dark)}>
              {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>

        {/* Data Export Card */}
        <div className="settings-card">
          <div className="card-header">
            <h3>📤 Export Data</h3>
          </div>
          <div className="settings-item">
            <div>
              <span className="item-title">Format</span>
              <p className="item-desc">Download JSON, CSV spreadsheet, or Text report</p>
            </div>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="filter-select"
            >
              <option value="json">JSON (Structured)</option>
              <option value="csv">CSV (Spreadsheet)</option>
              <option value="txt">Text Report</option>
            </select>
          </div>
          <button className="btn-primary btn-full mt-3" onClick={handleExport}>
            📥 Download Export
          </button>
        </div>

        {/* Data Management */}
        <div className="settings-card">
          <div className="card-header">
            <h3>💾 Workspace Data</h3>
          </div>
          <div className="settings-item">
            <div>
              <span className="item-title">Sample Workspace</span>
              <p className="item-desc">Load sample tasks, projects, and focus history</p>
            </div>
            <button className="btn-secondary" onClick={handleLoadSampleData}>
              🔄 Load Sample Data
            </button>
          </div>

          <div className="settings-item mt-3">
            <div>
              <span className="item-title">Clear Workspace</span>
              <p className="item-desc">Wipe all tasks, projects, and focus data</p>
            </div>
            <button className="btn-danger" onClick={handleResetData}>
              🗑️ Reset All Data
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="settings-card">
          <div className="card-header">
            <h3>⌨️ Keyboard Shortcuts</h3>
          </div>
          <div className="shortcuts-table">
            <div className="shortcut-row">
              <span className="sc-key"><kbd>N</kbd></span>
              <span className="sc-label">Create new task</span>
            </div>
            <div className="shortcut-row">
              <span className="sc-key"><kbd>/</kbd></span>
              <span className="sc-label">Search / Command Palette</span>
            </div>
            <div className="shortcut-row">
              <span className="sc-key"><kbd>F</kbd></span>
              <span className="sc-label">Start Focus session</span>
            </div>
            <div className="shortcut-row">
              <span className="sc-key"><kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd></span>
              <span className="sc-label">Open Command Palette</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
