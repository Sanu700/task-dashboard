import React, { useReducer, useEffect } from 'react';
import { TaskContext } from './TaskContextInstance';



const defaultSampleState = {
  projects: [
    { id: 101, name: 'ToxicBuddy', description: 'ML/AI Safety and moderation dashboard', color: '#3b82f6' },
    { id: 102, name: 'Portfolio', description: 'Personal website and project showcase', color: '#10b981' },
    { id: 103, name: 'Jodo', description: 'Productivity and task management suite', color: '#f59e0b' },
  ],
  tasks: [
    {
      id: 1,
      title: 'Finish API integration',
      description: 'Connect frontend endpoints to backend REST service and add error boundaries.',
      projectId: 101,
      status: 'To Do',
      priority: 'High',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 60,
      tags: ['API', 'Backend'],
      category: 'work',
      assignee: 'Sanvi',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedAt: null,
      focusTimeMinutes: 25,
    },
    {
      id: 2,
      title: 'Review PR for Authentication',
      description: 'Check OAuth token refresh flow and unit test coverage.',
      projectId: 101,
      status: 'In Progress',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 45,
      tags: ['PR', 'Auth'],
      category: 'work',
      assignee: 'Sanvi',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      completedAt: null,
      focusTimeMinutes: 50,
    },
    {
      id: 3,
      title: 'DSA Practice - Graph Algorithms',
      description: 'Solve 2 Medium BFS/DFS problems on LeetCode.',
      projectId: 103,
      status: 'To Do',
      priority: 'Low',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 30,
      tags: ['LeetCode', 'DSA'],
      category: 'learning',
      assignee: 'Sanvi',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      completedAt: null,
      focusTimeMinutes: 0,
    },
    {
      id: 4,
      title: 'Update portfolio project cards',
      description: 'Refactor screenshot carousels and live link badges.',
      projectId: 102,
      status: 'To Do',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      estimatedMinutes: 90,
      tags: ['Design', 'Frontend'],
      category: 'personal',
      assignee: 'Sanvi',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      completedAt: null,
      focusTimeMinutes: 0,
    },
    {
      id: 5,
      title: 'Setup PostgreSQL schema',
      description: 'Define initial tables, foreign key constraints, and migrations.',
      projectId: 103,
      status: 'Done',
      priority: 'High',
      dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      estimatedMinutes: 120,
      tags: ['Database', 'SQL'],
      category: 'work',
      assignee: 'Sanvi',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      focusTimeMinutes: 75,
    },
  ],
  focusSessions: [
    {
      id: 201,
      taskId: 1,
      projectId: 101,
      durationMinutes: 25,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 202,
      taskId: 2,
      projectId: 101,
      durationMinutes: 25,
      completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 203,
      taskId: 5,
      projectId: 103,
      durationMinutes: 25,
      completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    }
  ],
  customTemplates: [],
  userStreak: {
    count: 3,
    lastActiveDate: new Date().toISOString().split('T')[0]
  }
};

const initialState = {
  projects: [],
  tasks: [],
  focusSessions: [],
  customTemplates: [],
  userStreak: { count: 0, lastActiveDate: null }
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PROJECT':
      return { ...state, projects: [...(state.projects || []), action.payload] };
    case 'EDIT_PROJECT':
      return {
        ...state,
        projects: (state.projects || []).map(project =>
          Number(project.id) === Number(action.payload.id) ? { ...project, ...action.payload.updates } : project
        ),
      };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...(state.tasks || [])] };
    case 'DELETE_TASK':
      return { ...state, tasks: (state.tasks || []).filter(task => Number(task.id) !== Number(action.payload)) };
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        tasks: (state.tasks || []).map(task =>
          Number(task.id) === Number(action.payload.id)
            ? {
                ...task,
                status: action.payload.status,
                completed: action.payload.status === 'Done',
                completedAt:
                  action.payload.status === 'Done'
                    ? task.completedAt || new Date().toISOString()
                    : null,
              }
            : task
        ),
      };
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: (state.tasks || []).map(task =>
          Number(task.id) === Number(action.payload.id) ? { ...task, ...action.payload.updates } : task
        ),
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: (state.tasks || []).map(task =>
          Number(task.id) === Number(action.payload)
            ? {
                ...task,
                status: task.status === 'Done' ? 'To Do' : 'Done',
                completed: task.status !== 'Done',
                completedAt:
                  task.status === 'Done' ? null : new Date().toISOString(),
              }
            : task
        ),
      };
    case 'TOGGLE_TASK_COMPLETE':
      return {
        ...state,
        tasks: (state.tasks || []).map(task =>
          Number(task.id) === Number(action.payload)
            ? {
                ...task,
                completed: !task.completed,
                status: !task.completed ? 'Done' : 'To Do',
                completedAt: !task.completed ? (task.completedAt || new Date().toISOString()) : null,
              }
            : task
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: (state.projects || []).filter(project => Number(project.id) !== Number(action.payload)),
        tasks: (state.tasks || []).map(task =>
          Number(task.projectId) === Number(action.payload) ? { ...task, projectId: null } : task
        ),
      };
    case 'RECORD_FOCUS_SESSION': {
      const { taskId, projectId, durationMinutes } = action.payload;
      const newSession = {
        id: Date.now(),
        taskId: taskId ? Number(taskId) : null,
        projectId: projectId ? Number(projectId) : null,
        durationMinutes: durationMinutes || 25,
        completedAt: new Date().toISOString()
      };

      // Update task focus minutes if taskId exists
      const updatedTasks = (state.tasks || []).map(task => {
        if (taskId && Number(task.id) === Number(taskId)) {
          return {
            ...task,
            focusTimeMinutes: (task.focusTimeMinutes || 0) + (durationMinutes || 25)
          };
        }
        return task;
      });

      // Update streak if today
      const today = new Date().toISOString().split('T')[0];
      const streak = state.userStreak || { count: 0, lastActiveDate: null };
      let newCount = streak.count || 0;
      if (streak.lastActiveDate !== today) {
        newCount = (streak.count || 0) + 1;
      }

      return {
        ...state,
        tasks: updatedTasks,
        focusSessions: [...(state.focusSessions || []), newSession],
        userStreak: { count: newCount, lastActiveDate: today }
      };
    }
    case 'ADD_CUSTOM_TEMPLATE':
      return {
        ...state,
        customTemplates: [...(state.customTemplates || []), action.payload]
      };
    case 'DELETE_CUSTOM_TEMPLATE':
      return {
        ...state,
        customTemplates: (state.customTemplates || []).filter(t => t.id !== action.payload)
      };
    case 'LOAD_SAMPLE_DATA':
      return defaultSampleState;
    case 'RESET_ALL_DATA':
      return {
        projects: [],
        tasks: [],
        focusSessions: [],
        customTemplates: [],
        userStreak: { count: 0, lastActiveDate: null }
      };

    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const stored = localStorage.getItem('taskApp');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Guarantee arrays exist for all keys
        return {
          projects: parsed.projects || defaultSampleState.projects,
          tasks: parsed.tasks || defaultSampleState.tasks,
          focusSessions: parsed.focusSessions || defaultSampleState.focusSessions,
          customTemplates: parsed.customTemplates || [],
          userStreak: parsed.userStreak || defaultSampleState.userStreak,
        };
      }
    } catch (e) {
      console.error('Failed to parse localStorage taskApp:', e);
    }
    return defaultSampleState;
  });

  useEffect(() => {
    try {
      localStorage.setItem('taskApp', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save taskApp to localStorage:', e);
    }
  }, [state]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

