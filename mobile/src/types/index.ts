export interface Category {
  id: number;
  title: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  id_categories?: number | null;
  category_title?: string | null;
}

export type TaskInput = {
  title: string;
  description?: string | null;
  completed?: boolean;
  id_categories?: number | null;
};

export type FilterType = 'all' | 'pending' | 'completed';

export const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Todas',
  pending: 'Pendentes',
  completed: 'Concluídas',
};
