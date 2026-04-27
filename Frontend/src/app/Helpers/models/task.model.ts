export interface Subtask {
  _id?: string; // comes from Mongo
  title: string;
  description?: string;
  deadline?: Date;
  completed: boolean;
  createdAt?: Date;
}

export interface Task {
  _id?: string; // comes from Mongo
  title: string;
  description?: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  remindAt?: Date;
  reminded?: boolean;
  completed?: boolean;
  createdAt?: Date;
  colour?: string;
  subtasks?: Subtask[];
}
