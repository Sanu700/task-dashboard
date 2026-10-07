import { useContext } from 'react';
import { TaskContext } from './TaskContextInstance';

export function useTaskContext() {
  return useContext(TaskContext);
}
