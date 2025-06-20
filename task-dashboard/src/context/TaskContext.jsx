import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TaskContext = createContext();

const initialState = {
  projects: [],
  tasks: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, status: action.payload.status } : task
        ),
      };
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };
    default:
      return state;
  }
}



export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    const stored = localStorage.getItem('taskApp');
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem('taskApp', JSON.stringify(state));
  }, [state]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}
