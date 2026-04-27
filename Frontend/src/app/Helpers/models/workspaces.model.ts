import { Task } from './task.model';

export interface Workspace {
  _id?: string;
  user: string;         // userId (from JWT / backend)
  name: string;
  description?: string;
  createdAt?: Date;
  tasks: Task[];
}
