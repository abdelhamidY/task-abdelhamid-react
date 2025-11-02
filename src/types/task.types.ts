export type ColumnStatus = 'backlog' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnStatus;
}

export interface Column {
  id: ColumnStatus;
  title: string;
  color: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  column: ColumnStatus;
}

export interface UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;
  column?: ColumnStatus;
  oldColumn?: ColumnStatus;
}

export interface TasksResponse {
  data: Task[];
  total: number;
  hasMore: boolean;
}
