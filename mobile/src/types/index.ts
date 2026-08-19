export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

export type TaskInput = {
  title: string;
  description?: string | null;
  completed?: boolean;
};

export type FilterType = 'all' | 'pending' | 'completed';

export const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Todas',
  pending: 'Pendentes',
  completed: 'Concluídas',
};
