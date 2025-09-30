// src/app/core/models/task.model.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
}
