export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface TaskInput {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export interface Task extends TaskInput {
  id: string;
  completed: boolean;
  createdAt: string;
} 