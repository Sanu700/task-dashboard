import React, { useState, useEffect, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function ExportFeatures() {
  const { state } = useTaskContext();
  const [showExport, setShowExport] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [exportFilter, setExportFilter] = useState('all');
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExport(false);
      }
    };

    if (showExport) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExport]);

  const exportData = () => {
    let dataToExport = {};

    // Filter data based on selection
    switch (exportFilter) {
      case 'tasks':
        dataToExport = {
          tasks: state.tasks,
          exportDate: new Date().toISOString(),
          totalTasks: state.tasks.length,
          completedTasks: state.tasks.filter(t => t.status === 'Done').length
        };
        break;
      case 'projects':
        dataToExport = {
          projects: state.projects,
          exportDate: new Date().toISOString(),
          totalProjects: state.projects.length
        };
        break;
      case 'completed':
        dataToExport = {
          completedTasks: state.tasks.filter(t => t.status === 'Done'),
          exportDate: new Date().toISOString(),
          totalCompleted: state.tasks.filter(t => t.status === 'Done').length
        };
        break;
      case 'all':
      default:
        dataToExport = {
          tasks: state.tasks,
          projects: state.projects,
          exportDate: new Date().toISOString(),
          totalTasks: state.tasks.length,
          totalProjects: state.projects.length,
          completedTasks: state.tasks.filter(t => t.status === 'Done').length
        };
        break;
    }

    let content, filename, mimeType;

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(dataToExport, null, 2);
        filename = `taskboard-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      
      case 'csv':
        if (exportFilter === 'tasks' || exportFilter === 'all') {
          const csvContent = convertTasksToCSV(state.tasks);
          content = csvContent;
          filename = `taskboard-tasks-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
        } else {
          content = 'No tasks to export';
          filename = `taskboard-export-${new Date().toISOString().split('T')[0]}.txt`;
          mimeType = 'text/plain';
        }
        break;
      
      case 'txt':
        content = convertToText(dataToExport);
        filename = `taskboard-export-${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
        break;
      
      default:
        content = JSON.stringify(dataToExport, null, 2);
        filename = `taskboard-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
    }

    downloadFile(content, filename, mimeType);
  };

  const convertTasksToCSV = (tasks) => {
    if (tasks.length === 0) return 'No tasks to export';
    
    const headers = ['Title', 'Description', 'Status', 'Priority', 'Category', 'Assignee', 'Due Date', 'Created At', 'Completed At', 'Project'];
    const csvRows = [headers.join(',')];
    
    tasks.forEach(task => {
      const project = state.projects.find(p => p.id === task.projectId);
      const row = [
        `"${task.title || ''}"`,
        `"${task.description || ''}"`,
        task.status || '',
        task.priority || '',
        task.category || '',
        `"${task.assignee || ''}"`,
        task.dueDate || '',
        task.createdAt || '',
        task.completedAt || '',
        `"${project?.name || ''}"`
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  };

  const convertToText = (data) => {
    let text = 'TaskBoard Export Report\n';
    text += '='.repeat(50) + '\n\n';
    text += `Export Date: ${new Date().toLocaleString()}\n\n`;
    
    if (data.tasks) {
      text += `TOTAL TASKS: ${data.totalTasks}\n`;
      text += `COMPLETED TASKS: ${data.completedTasks}\n`;
      text += `COMPLETION RATE: ${data.totalTasks > 0 ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0}%\n\n`;
      
      text += 'TASK DETAILS:\n';
      text += '-'.repeat(30) + '\n';
      
      data.tasks.forEach((task, index) => {
        const project = state.projects.find(p => p.id === task.projectId);
        text += `${index + 1}. ${task.title}\n`;
        text += `   Status: ${task.status}\n`;
        text += `   Priority: ${task.priority}\n`;
        text += `   Category: ${task.category}\n`;
        if (task.assignee) text += `   Assignee: ${task.assignee}\n`;
        if (task.dueDate) text += `   Due Date: ${task.dueDate}\n`;
        if (project) text += `   Project: ${project.name}\n`;
        if (task.description) text += `   Description: ${task.description}\n`;
        text += '\n';
      });
    }
    
    if (data.projects) {
      text += 'PROJECTS:\n';
      text += '-'.repeat(30) + '\n';
      data.projects.forEach((project, index) => {
        text += `${index + 1}. ${project.name}\n`;
        text += `   Color: ${project.color}\n\n`;
      });
    }
    
    return text;
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    const message = document.createElement('div');
    message.textContent = `Export completed! File: ${filename}`;
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
  };

  return (
    <div className="export-features">
      <button 
        onClick={() => setShowExport(!showExport)}
        className="export-toggle"
      >
        📤 Export Data
      </button>
      
      {showExport && (
        <div className="export-container" ref={dropdownRef}>
          <div className="export-header">
            <h4>Export Your Data</h4>
            <p>Choose what to export and in which format</p>
          </div>
          
          <div className="export-options">
            <div className="export-section">
              <label>What to Export:</label>
              <select 
                value={exportFilter} 
                onChange={(e) => setExportFilter(e.target.value)}
                className="export-select"
              >
                <option value="all">All Data (Tasks + Projects)</option>
                <option value="tasks">Tasks Only</option>
                <option value="projects">Projects Only</option>
                <option value="completed">Completed Tasks Only</option>
              </select>
            </div>
            
            <div className="export-section">
              <label>Export Format:</label>
              <select 
                value={exportFormat} 
                onChange={(e) => setExportFormat(e.target.value)}
                className="export-select"
              >
                <option value="json">JSON (Structured Data)</option>
                <option value="csv">CSV (Spreadsheet)</option>
                <option value="txt">Text Report</option>
              </select>
            </div>
          </div>
          
          <div className="export-preview">
            <h5>Preview:</h5>
            <div className="preview-content">
              {exportFilter === 'all' && (
                <div>
                  <p>📊 Total Tasks: {state.tasks.length}</p>
                  <p>✅ Completed: {state.tasks.filter(t => t.status === 'Done').length}</p>
                  <p>📋 Projects: {state.projects.length}</p>
                </div>
              )}
              {exportFilter === 'tasks' && (
                <div>
                  <p>📊 Total Tasks: {state.tasks.length}</p>
                  <p>✅ Completed: {state.tasks.filter(t => t.status === 'Done').length}</p>
                  <p>⏳ In Progress: {state.tasks.filter(t => t.status === 'In Progress').length}</p>
                </div>
              )}
              {exportFilter === 'projects' && (
                <div>
                  <p>📋 Total Projects: {state.projects.length}</p>
                </div>
              )}
              {exportFilter === 'completed' && (
                <div>
                  <p>✅ Completed Tasks: {state.tasks.filter(t => t.status === 'Done').length}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="export-actions">
            <button onClick={exportData} className="export-btn">
              📥 Download Export
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 