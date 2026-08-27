export interface Categories {
  id: number;
  title: string;
}

export type CategoriesInput = {
  title: string;
};

export type Category = Categories;
export type CategoryInput = CategoriesInput;

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  id_categories?: number;
  category_title?: string;
}

export type TaskInput = {
  title: string;
  description?: string | null;
  completed?: boolean;
  id_categories: number;
};

export type FilterType = 'all' | 'pending' | 'completed';

export const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Todas',
  pending: 'Pendentes',
  completed: 'Concluídas',
};
