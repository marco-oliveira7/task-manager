import { apiRequest } from './api';
import { Category } from '../types';

export const categoriesService = {
  list(): Promise<Category[]> {
    return apiRequest<Category[]>('/categories');
  },

  create(data: { title: string }): Promise<Category> {
    return apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};