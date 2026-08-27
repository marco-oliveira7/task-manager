import { apiRequest } from './api';
import { Categories, CategoriesInput } from '../types';

export const categoriesService = {
  list(): Promise<Categories[]> {
    return apiRequest<Categories[]>('/categories');
  },

  create(data: CategoriesInput): Promise<Categories> {
    return apiRequest<Categories>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};