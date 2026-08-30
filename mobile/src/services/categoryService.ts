import { apiRequest } from './api';
import { Category } from '../types';

export const categoryService = {
  list(): Promise<Category[]> {
    return apiRequest<Category[]>('/categories');
  },

  create(title: string): Promise<Category> {
    return apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  remove(id: number): Promise<void> {
    return apiRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
