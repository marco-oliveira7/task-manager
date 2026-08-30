<<<<<<< HEAD
export interface Categories {
=======
export interface Category {
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
  id: number;
  title: string;
}

<<<<<<< HEAD
export type CategoriesInput = {
  title: string;
};

export type Category = Categories;
export type CategoryInput = CategoriesInput;

=======
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
<<<<<<< HEAD
  id_categories?: number;
  category_title?: string;
=======
  id_categories?: number | null;
  category_title?: string | null;
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
}

export type TaskInput = {
  title: string;
  description?: string | null;
  completed?: boolean;
<<<<<<< HEAD
  id_categories: number;
=======
  id_categories?: number | null;
>>>>>>> f2660b0 (inserir tarefas funcionando, banco de dados arrumado, seed.sql.)
};

export type FilterType = 'all' | 'pending' | 'completed';

export const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Todas',
  pending: 'Pendentes',
  completed: 'Concluídas',
};
