import { apiRequest } from './api';
import { Task, TaskInput } from '../types';

export const taskService = {
  list(): Promise<Task[]> {
    return apiRequest<Task[]>('/tasks');
  },

  create(data: TaskInput): Promise<Task> {
    return apiRequest<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: TaskInput): Promise<Task> {
    return apiRequest<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggle(id: number, completed: boolean): Promise<Task> {
    return apiRequest<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });
  },

  remove(id: number): Promise<void> {
    return apiRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
